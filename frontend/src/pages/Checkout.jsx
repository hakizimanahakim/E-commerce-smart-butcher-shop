
import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cartItems, getCartTotal } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-2xl">🛒</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
          <p className="text-gray-400 mb-6">Add some products to proceed to checkout</p>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Checkout</h1>

        <div className="max-w-2xl mx-auto">
          {/* Order Summary */}
          <div className="bg-gray-900 rounded-lg border border-gray-700 p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 py-3 border-b border-gray-700">
                  <img
                    src={`http://localhost:3001${item.image}`}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjMzc0MTUxIi8+Cjx0ZXh0IHg9IjI0IiB5PSIyOCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmaWxsPSIjOUNBM0FGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn42pPC90ZXh0Pgo8L3N2Zz4K';
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{item.name}</h3>
                    <p className="text-gray-400 text-sm">Quantity: {item.quantity} kg</p>
                  </div>
                  <div className="text-yellow-400 font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-700 pt-4">
              <div className="flex justify-between items-center text-xl font-bold">
                <span className="text-white">Total:</span>
                <span className="text-yellow-400">{formatPrice(getCartTotal())}</span>
              </div>
            </div>
          </div>

          {/* Payment Integration Message */}
          <div className="bg-gray-900 rounded-lg border border-gray-700 p-8 text-center">
            <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🚧</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Payment Integration Coming Soon</h2>
            <p className="text-gray-300 mb-6">
              We're working on integrating Flutterwave payment system to make your checkout experience seamless.
            </p>
            <p className="text-gray-400 mb-8">
              For now, please contact us directly to place your order.
            </p>

            <div className="space-y-4">
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>🏠</span>
                  <span>Continue Shopping</span>
                </span>
              </button>

              <button
                onClick={() => window.open('tel:+250123456789', '_self')}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>📞</span>
                  <span>Call to Order</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
