import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';

// Modern product card component with stunning design
const ProductCard = ({ product, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
    <div
      className="group relative bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-700/50 hover:border-red-500/50 transition-all duration-700 hover:scale-[1.02] hover:shadow-red-500/20"
      style={{
        opacity: 0,
        animation: `slideInUp 0.8s ease-out ${index * 0.15}s forwards`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-yellow-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Fresh Badge */}
        <div className={`absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg transition-all duration-500 ${
          isHovered ? 'scale-100 opacity-100 rotate-3' : 'scale-0 opacity-0'
        }`}>
          ✨ Fresh
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm text-yellow-400 px-4 py-2 rounded-xl font-bold text-lg border border-yellow-400/30 shadow-lg">
          {product.price} RWF/kg
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300 mb-2">
            {product.name}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
            {product.description || 'Premium quality meat, fresh and delicious.'}
          </p>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/50 active:scale-95 group/btn"
        >
          <span className="flex items-center justify-center space-x-3">
            <span className="transition-transform duration-300 group-hover/btn:scale-110">🛒</span>
            <span>Add to Cart</span>
            <span className={`transition-transform duration-300 ${isHovered ? 'translate-x-1' : 'translate-x-0'}`}>
              →
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get('http://localhost:3001/api/products')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      });
  }, []);

  // Mouse tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="w-full bg-black min-h-screen overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute w-96 h-96 bg-red-600/5 rounded-full blur-3xl animate-pulse"
          style={{
            left: `${mousePosition.x * 0.1}%`,
            top: `${mousePosition.y * 0.1}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
        <div
          className="absolute w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl animate-pulse"
          style={{
            right: `${mousePosition.x * 0.05}%`,
            bottom: `${mousePosition.y * 0.05}%`,
            transform: 'translate(50%, 50%)',
            animationDelay: '1s',
          }}
        />
      </div>

      {/* Modern Hero Section */}
      <div className="relative w-full min-h-screen overflow-hidden z-10">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="/images/Best-bulk-meat-delivery-scaled.jpg"
            alt="Premium Meat Selection"
            className="w-full h-full object-cover scale-105 transition-transform duration-20000 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/70 to-red-900/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-5xl mx-auto">
            {/* Main Heading */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight">
                <span className="block bg-gradient-to-r from-white via-yellow-400 to-red-500 bg-clip-text text-transparent animate-pulse">
                  One Genesis
                </span>
                <span className="block text-3xl md:text-5xl lg:text-6xl font-light text-gray-300 mt-2">
                  Butcher Shop
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Experience the finest selection of
              <span className="text-yellow-400 font-semibold"> premium meats</span>,
              delivered fresh to your doorstep with unmatched quality and service.
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-700 hover:border-yellow-400/50 transition-colors duration-300">
                <span className="text-green-400 text-lg">✓</span>
                <span className="text-white font-medium">Fresh Daily</span>
              </div>
              <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-700 hover:border-yellow-400/50 transition-colors duration-300">
                <span className="text-green-400 text-lg">✓</span>
                <span className="text-white font-medium">Premium Quality</span>
              </div>
              <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-700 hover:border-yellow-400/50 transition-colors duration-300">
                <span className="text-green-400 text-lg">✓</span>
                <span className="text-white font-medium">Fast Delivery</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/50 group"
              >
                <span className="flex items-center justify-center space-x-3">
                  <span className="text-2xl">🥩</span>
                  <span>Shop Now</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </button>

              <button onClick={() => setShowContactModal(true)} className="border-2 border-white/30 hover:border-yellow-400 text-white hover:text-yellow-400 px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm group">
                <span className="flex items-center justify-center space-x-3">
                  <span className="text-2xl">📞</span>
                  <span>Contact Us</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `floatRandom ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 5}s infinite alternate`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Modern Products Section */}
      <section id="products" className="py-24 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-red-600 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-600 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-600 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-red-600/10 to-yellow-600/10 border border-red-600/20 rounded-full px-8 py-3 mb-8 backdrop-blur-sm">
              <span className="text-red-400 text-xl">🥩</span>
              <span className="text-red-400 font-semibold text-lg">Premium Selection</span>
            </div>

            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-tight">
              Our Fresh
              <span className="block bg-gradient-to-r from-red-500 via-yellow-400 to-red-500 bg-clip-text text-transparent"> Products</span>
            </h2>

            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8">
              Discover our carefully curated selection of premium meats,
              sourced from the finest suppliers and prepared with exceptional care.
            </p>

            <div className="w-40 h-1.5 bg-gradient-to-r from-red-600 via-yellow-400 to-red-600 mx-auto rounded-full shadow-lg shadow-red-500/30"></div>
          </div>

          {loading && (
            <div className="text-center py-20">
              <div className="relative mb-8">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-700 border-t-red-500 mb-4"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-yellow-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <p className="text-gray-300 text-xl font-medium animate-pulse">Loading fresh products...</p>
              <p className="text-gray-500 text-sm mt-2">Preparing the finest selection for you</p>
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto bg-gradient-to-br from-red-900/20 to-red-800/10 border border-red-700/50 rounded-2xl p-8 backdrop-blur-sm">
                <div className="text-red-400 text-4xl mb-4">⚠️</div>
                <h3 className="text-red-400 text-xl font-bold mb-2">Oops! Something went wrong</h3>
                <p className="text-red-300 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="text-gray-400 text-6xl mb-6">🥩</div>
                <h3 className="text-gray-300 text-2xl font-bold mb-4">No Products Available</h3>
                <p className="text-gray-500 text-lg">We're restocking our premium selection. Please check back soon!</p>
              </div>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modern Footer Section */}
      <footer className="bg-gradient-to-br from-black via-gray-900 to-black border-t border-gray-700/50 py-16 relative z-10 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-600 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 via-red-700 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30">
                  <span className="text-white text-3xl">🥩</span>
                </div>
                <div>
                  <h3 className="text-3xl font-black bg-gradient-to-r from-red-500 via-yellow-400 to-red-500 bg-clip-text text-transparent">
                    One Genesis
                  </h3>
                  <p className="text-gray-400 text-lg font-medium">Butcher Shop</p>
                </div>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-lg">
                Premium quality meats delivered fresh to your doorstep. We pride ourselves on providing the finest cuts and exceptional service to our valued customers.
              </p>

              {/* Social Links */}
              <div className="flex space-x-4">
                <div className="w-12 h-12 bg-gray-800 hover:bg-red-600 rounded-xl flex items-center justify-center transition-colors duration-300 cursor-pointer group">
                  <span className="text-gray-400 group-hover:text-white text-xl">📘</span>
                </div>
                <div className="w-12 h-12 bg-gray-800 hover:bg-red-600 rounded-xl flex items-center justify-center transition-colors duration-300 cursor-pointer group">
                  <span className="text-gray-400 group-hover:text-white text-xl">📷</span>
                </div>
                <div className="w-12 h-12 bg-gray-800 hover:bg-red-600 rounded-xl flex items-center justify-center transition-colors duration-300 cursor-pointer group">
                  <span className="text-gray-400 group-hover:text-white text-xl">🐦</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white text-xl font-bold mb-6">Quick Links</h4>
              <ul className="space-y-4">
                <li>
                  <a href="/" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 flex items-center space-x-2 group">
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    <span>Home</span>
                  </a>
                </li>
                <li>
                  <a href="/about" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 flex items-center space-x-2 group">
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    <span>About Us</span>
                  </a>
                </li>
                <li>
                  <a href="/login" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 flex items-center space-x-2 group">
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    <span>Login</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-white text-xl font-bold mb-6">Contact Us</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors duration-300">
                  <span className="text-yellow-400 text-xl">📍</span>
                  <span className="text-gray-300">Kigali, Rwanda</span>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors duration-300">
                  <span className="text-yellow-400 text-xl">📞</span>
                  <a href="tel:+250123456789" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300">
                    +250 123 456 789
                  </a>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors duration-300">
                  <span className="text-yellow-400 text-xl">✉️</span>
                  <a href="mailto:onegenesisinfo@gmail.com" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300">
                    onegenesisinfo@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-lg mb-4 md:mb-0">
              © 2024 One Genesis Butcher Shop. All rights reserved.
            </p>
            <div className="flex items-center space-x-2 text-gray-500">
              <span>Made with</span>
              <span className="text-red-500 animate-pulse">❤️</span>
              <span>in Rwanda</span>
            </div>

      {/* Contact Us Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowContactModal(false)} />
          <div className="relative bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
              <h3 className="text-2xl font-bold text-white flex items-center space-x-3">
                <span className="text-3xl">📞</span>
                <span>Contact Us</span>
              </h3>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-gray-400 hover:text-white transition-colors duration-300 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Contact blocks */}
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700/60">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl">📍</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">Business Location</div>
                    <div className="text-gray-300 text-sm">Kigali, Rwanda</div>
                  </div>
                </div>

                <a href="tel:+250123456789" className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700/60 hover:bg-gray-800 transition-colors duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl">📞</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">Phone</div>
                    <div className="text-gray-300 text-sm">+250 123 456 789</div>
                  </div>
                </a>

                <a href="mailto:onegenesisinfo@gmail.com" className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700/60 hover:bg-gray-800 transition-colors duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl">✉️</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">Email</div>
                    <div className="text-gray-300 text-sm">onegenesisinfo@gmail.com</div>
                  </div>
                </a>

                <div className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700/60">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl">⏰</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">Working Hours</div>
                    <div className="text-gray-300 text-sm">Mon - Sat: 8:00 AM - 8:00 PM</div>
                    <div className="text-gray-500 text-xs">Sunday: 10:00 AM - 6:00 PM</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="https://wa.me/250123456789?text=Hello%20One%20Genesis"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors duration-300"
                    aria-label="Chat on WhatsApp"
                  >
                    <span>💬</span>
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href="https://instagram.com/onegenesisrw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-rose-500 text-white font-semibold hover:brightness-110 transition-colors duration-300"
                    aria-label="Visit Instagram profile"
                  >
                    <span>📸</span>
                    <span>Instagram</span>
                  </a>
                </div>
                <div className="pt-1">
                  <button
                    onClick={() => setShowContactModal(false)}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
