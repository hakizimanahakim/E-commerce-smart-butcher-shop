import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import axios from "axios";

const CartModal = () => {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    clearCart,
  } = useCart();

  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    location: "",
    address: "",
  });

  // Load Flutterwave script once
  useEffect(() => {
    if (!document.querySelector("#flutterwave-script")) {
      const script = document.createElement("script");
      script.id = "flutterwave-script";
      script.src = "https://checkout.flutterwave.com/v3.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) return;
    setShowCustomerForm(true);
  };

  const handleCustomerFormSubmit = (e) => {
    e.preventDefault();
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.location) {
      alert("Please fill in all required fields (Name, Phone, Location)");
      return;
    }
    setShowCustomerForm(false);
    processPayment();
  };

  const processPayment = () => {
    if (!window.FlutterwaveCheckout) {
      alert("Payment SDK not loaded yet. Please wait a few seconds and try again.");
      return;
    }

    const tx_ref = `tx-${Date.now()}`;

    window.FlutterwaveCheckout({
      public_key: process.env.REACT_APP_FLUTTERWAVE_PUBLIC_KEY,
      tx_ref,
      amount: getCartTotal(),
      currency: "RWF",
      payment_options: "card,mobilemoney,ussd",
      customer: {
        email: "customer@onegenesis.rw",
        phone_number: customerInfo.phone,
        name: customerInfo.name,
      },
      customizations: {
        title: "One Genesis Butcher Shop",
        description: "Payment for meat products",
        logo: "https://your-logo-url.com/logo.png",
      },
      callback: async function (response) {
        if (response.status === "successful") {
          try {
            const verifyRes = await axios.post("http://localhost:3001/api/verify-payment", {
              transaction_id: response.transaction_id,
            });

            if (verifyRes.data?.data?.status === "successful") {
              const orderData = {
                transaction_id: response.transaction_id,
                amount: response.amount,
                currency: response.currency,
                customer_name: customerInfo.name,
                customer_phone: customerInfo.phone,
                customer_address: `${customerInfo.location}${customerInfo.address ? " - " + customerInfo.address : ""}`,
                items: cartItems.map((item) => ({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                  image: item.image,
                })),
                status: "paid",
              };

              await axios.post("http://localhost:3001/api/orders", orderData);

              alert(`Payment verified! Transaction ID: ${response.transaction_id}`);
              clearCart();
              closeCart();
              setCustomerInfo({ name: "", phone: "", location: "", address: "" });
            } else {
              alert("Payment could not be verified. Please contact support.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Payment received, but verification failed. Contact support.");
          }
        } else {
          alert("Payment failed or was cancelled.");
        }
      },
      onclose: function () {
        console.log("Payment modal closed");
      },
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-RW", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 text-gray-100 rounded-2xl shadow-2xl w-full max-w-lg p-6 overflow-y-auto max-h-[90vh] border border-gray-700">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
          <h2 className="text-2xl font-bold text-red-500">Your Cart</h2>
          <button
            onClick={closeCart}
            className="text-gray-400 hover:text-red-500 transition"
          >
            ✕
          </button>
        </div>

        {/* Cart items */}
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-400">Your cart is empty</p>
        ) : (
          <div>
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between mb-4 bg-gray-800 p-3 rounded-lg"
              >
                <div className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-md object-cover mr-4 border border-gray-700"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-gray-400">{formatPrice(item.price)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.id, parseInt(e.target.value))
                    }
                    className="w-16 border border-gray-600 bg-gray-700 rounded-md text-center mr-4 text-white"
                  />
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-400 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Cart total */}
            <div className="mt-6 border-t border-gray-700 pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span className="text-red-400">{formatPrice(getCartTotal())}</span>
              </div>
              <button
                onClick={handleProceedToCheckout}
                className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}

        {/* Customer form */}
        {showCustomerForm && (
          <form onSubmit={handleCustomerFormSubmit} className="mt-6 space-y-3">
            <h3 className="text-xl font-semibold mb-2 text-red-500">
              Customer Information
            </h3>
            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-400"
              value={customerInfo.name}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Phone"
              className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-400"
              value={customerInfo.phone}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, phone: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Location"
              className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-400"
              value={customerInfo.location}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, location: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Address (optional)"
              className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-400"
              value={customerInfo.address}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, address: e.target.value })
              }
            />
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
            >
              Confirm & Pay
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CartModal;
