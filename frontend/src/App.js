import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { useState } from 'react';
import Home from './pages/home';
import About from './pages/About';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Checkout from './pages/Checkout';
import { CartProvider, useCart } from './context/CartContext';
import CartModal from './components/CartModal';
import './index.css';

// Navigation component
function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { getCartItemsCount, openCart } = useCart();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-black shadow-2xl border-b border-gray-700 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-3">
                {/* Logo Icon */}
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl font-bold">🥩</span>
                </div>
                {/* Business Name */}
                <div className="hidden sm:block">
                  <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-red-500 via-yellow-400 to-red-500 bg-clip-text text-transparent">
                    One Genesis
                  </h1>
                  <p className="text-gray-400 text-sm font-medium">Butcher Shop</p>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg text-lg font-medium transition-all duration-300 relative group ${
                  isActive('/')
                    ? 'text-yellow-400 bg-gray-900'
                    : 'text-white hover:text-yellow-400 hover:bg-gray-900'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span>🏠</span>
                  <span>Home</span>
                </span>
                {isActive('/') && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 to-yellow-400"></div>
                )}
              </Link>

              <Link
                to="/about"
                className={`px-4 py-2 rounded-lg text-lg font-medium transition-all duration-300 relative group ${
                  isActive('/about')
                    ? 'text-yellow-400 bg-gray-900'
                    : 'text-white hover:text-yellow-400 hover:bg-gray-900'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span>ℹ️</span>
                  <span>About</span>
                </span>
                {isActive('/about') && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 to-yellow-400"></div>
                )}
              </Link>

              {/* Cart Button */}
              <button
                onClick={openCart}
                className="relative bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="flex items-center space-x-2">
                  <span>🛒</span>
                  <span>Cart</span>
                </span>
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {getCartItemsCount()}
                  </span>
                )}
              </button>

              {/* Login Button */}
              <Link
                to="/login"
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-block"
              >
                <span className="flex items-center space-x-2">
                  <span>🔐</span>
                  <span>Login</span>
                </span>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-yellow-400 focus:outline-none focus:text-yellow-400 transition-colors duration-300"
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900 rounded-b-lg mt-2">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-lg font-medium transition-all duration-300 ${
                  isActive('/')
                    ? 'text-yellow-400 bg-black'
                    : 'text-white hover:text-yellow-400 hover:bg-black'
                }`}
              >
                <span className="flex items-center space-x-3">
                  <span>🏠</span>
                  <span>Home</span>
                </span>
              </Link>

              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-lg font-medium transition-all duration-300 ${
                  isActive('/about')
                    ? 'text-yellow-400 bg-black'
                    : 'text-white hover:text-yellow-400 hover:bg-black'
                }`}
              >
                <span className="flex items-center space-x-3">
                  <span>ℹ️</span>
                  <span>About</span>
                </span>
              </Link>

              {/* Cart Button */}
              <button
                onClick={() => {
                  openCart();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full mt-4 bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 relative"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>🛒</span>
                  <span>Cart ({getCartItemsCount()})</span>
                </span>
              </button>

              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full mt-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 inline-block"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>🔐</span>
                  <span>Login</span>
                </span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <Navigation />
        <div className="bg-black min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </div>
        <CartModal />
      </Router>
    </CartProvider>
  );
}

export default App;
