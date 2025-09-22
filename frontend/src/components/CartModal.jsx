import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const CartModal = () => {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    clearCart
  } = useCart();

  // Customer form state
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    location: '',
    address: ''
  });

  // Rwanda locations
  const rwandaLocations = [
    'Kigali - Nyarugenge',
    'Kigali - Gasabo',
    'Kigali - Kicukiro',
    'Northern Province - Rulindo',
    'Northern Province - Gicumbi',
    'Northern Province - Musanze',
    'Northern Province - Burera',
    'Northern Province - Gakenke',
    'Southern Province - Nyanza',
    'Southern Province - Gisagara',
    'Southern Province - Nyaruguru',
    'Southern Province - Huye',
    'Southern Province - Nyamagabe',
    'Southern Province - Ruhango',
    'Southern Province - Muhanga',
    'Southern Province - Kamonyi',
    'Eastern Province - Rwamagana',
    'Eastern Province - Nyagatare',
    'Eastern Province - Gatsibo',
    'Eastern Province - Kayonza',
    'Eastern Province - Kirehe',
    'Eastern Province - Ngoma',
    'Eastern Province - Bugesera',
    'Western Province - Karongi',
    'Western Province - Rutsiro',
    'Western Province - Rubavu',
    'Western Province - Nyabihu',
    'Western Province - Ngororero',
    'Western Province - Rusizi',
    'Western Province - Nyamasheke'
  ];

  // Flutterwave configuration
  const config = {
    public_key: process.env.REACT_APP_FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: Date.now().toString(),
    amount: getCartTotal(),
    currency: 'RWF',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: 'customer@onegenesis.rw', // Default email since not collected from form
      phone_number: customerInfo.phone || '+250123456789',
      name: customerInfo.name || 'One Genesis Customer',
    },
    customizations: {
      title: 'One Genesis Butcher Shop',
      description: 'Payment for meat products',
      logo: 'https://your-logo-url.com/logo.png',
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  if (!isCartOpen) return null;

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
      alert('Please fill in all required fields (Name, Phone, Location)');
      return;
    }
    setShowCustomerForm(false);
    processPayment();
  };

  const processPayment = () => {

    if (!process.env.REACT_APP_FLUTTERWAVE_PUBLIC_KEY) {
      alert('Flutterwave public key not configured. Please check your environment variables.');
      return;
    }

    handleFlutterPayment({
      callback: async (response) => {
        console.log('Flutterwave response:', response);
        if (response.status === 'successful') {
          try {
            // Create order in database with customer information
            const orderData = {
              transaction_id: response.transaction_id,
              amount: response.amount,
              currency: response.currency,
              customer_email: 'customer@onegenesis.rw', // Default email
              customer_phone: customerInfo.phone,
              customer_name: customerInfo.name,
              customer_address: `${customerInfo.location}${customerInfo.address ? ' - ' + customerInfo.address : ''}`,
              items: cartItems.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
              })),
              status: 'paid'
            };

            await axios.post('https://butcher-shop-backend.onrender.com/api/orders', orderData);

            alert(`Payment successful! Transaction ID: ${response.transaction_id}\nThank you ${customerInfo.name} for your purchase. Your order will be delivered to ${customerInfo.location}.`);
            clearCart();
            closeCart();
            // Reset customer form
            setCustomerInfo({ name: '', phone: '', location: '', address: '' });
          } catch (error) {
            console.error('Error creating order:', error);
            alert(`Payment successful! Transaction ID: ${response.transaction_id}\nThank you for your purchase.`);
            clearCart();
            closeCart();
          }
        } else {
          alert('Payment failed or was cancelled. Please try again.');
        }
        closePaymentModal();
      },
      onClose: () => {
        console.log('Payment modal closed by user');
      },
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-80 transition-opacity duration-300"
        onClick={closeCart}
      />

      {/* Popup Modal */}
      <div className="relative bg-black border border-gray-700 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <span>🛒</span>
            <span>Your Cart ({cartItems.length})</span>
          </h2>
          <button
            onClick={closeCart}
            className="text-gray-400 hover:text-white transition-colors duration-200 p-2 hover:bg-gray-800 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 max-h-[60vh] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">🛒</span>
              </div>
              <p className="text-gray-400 text-lg mb-2">Your cart is empty</p>
              <p className="text-gray-500 text-sm">Add some delicious meats to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-gray-900 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={`http://localhost:3001${item.image}`}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover border border-gray-600"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjMzc0MTUxIi8+Cjx0ZXh0IHg9IjMyIiB5PSIzOCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSIjOUNBM0FGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn42pPC90ZXh0Pgo8L3N2Zz4K';
                      }}
                    />
                    
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{item.name}</h3>
                      <p className="text-gray-400 text-sm">{formatPrice(item.price)} / kg</p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3 mt-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="w-8 h-8 bg-gray-800 hover:bg-gray-700 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                        >
                          -
                        </button>
                        <span className="text-white font-medium w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-gray-800 hover:bg-gray-700 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                        >
                          +
                        </button>
                        <span className="text-yellow-400 font-medium ml-auto">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-300 p-2 hover:bg-red-900/20 rounded-lg transition-all duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-700 p-6 bg-gray-900 rounded-b-2xl">
            {/* Total */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-medium text-white">Total:</span>
              <span className="text-2xl font-bold text-yellow-400">
                {formatPrice(getCartTotal())}
              </span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/50"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>💳</span>
                <span>Proceed to Checkout</span>
              </span>
            </button>

            {/* Continue Shopping */}
            <button
              onClick={closeCart}
              className="w-full mt-3 text-gray-400 hover:text-white transition-colors duration-200 py-2"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>

      {/* Customer Information Form Modal */}
      {showCustomerForm && (
        <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-10">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
              <span>📋</span>
              <span>Customer Information</span>
            </h3>

            <form onSubmit={handleCustomerFormSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  required
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-400 transition-colors duration-300"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  required
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-400 transition-colors duration-300"
                  placeholder="+250 123 456 789"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Location *
                </label>
                <select
                  value={customerInfo.location}
                  onChange={(e) => setCustomerInfo({...customerInfo, location: e.target.value})}
                  required
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-400 transition-colors duration-300"
                >
                  <option value="">Select your location</option>
                  {rwandaLocations.map((location, index) => (
                    <option key={index} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Additional Address Details (Optional)
                </label>
                <textarea
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                  rows="2"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-400 transition-colors duration-300 resize-none"
                  placeholder="Street name, building, landmarks (optional)"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                >
                  Continue to Payment
                </button>
                <button
                  type="button"
                  onClick={() => setShowCustomerForm(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-300"
                >
                  Back to Cart
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartModal;
