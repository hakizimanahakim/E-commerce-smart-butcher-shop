import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-700 py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-yellow-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-2xl font-bold">🥩</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-red-500 via-yellow-400 to-red-500 bg-clip-text text-transparent">
                  One Genesis
                </h3>
                <p className="text-gray-400 text-sm">Butcher Shop</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Premium quality meats delivered fresh to your doorstep. We pride ourselves on providing the finest cuts and exceptional service to our valued customers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors duration-300">
                <span className="text-2xl">📘</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors duration-300">
                <span className="text-2xl">📷</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors duration-300">
                <span className="text-2xl">🐦</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300">
                  About Us
                </a>
              </li>
              <li>
                <a href="#products" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300">
                  Our Products
                </a>
              </li>
              <li>
                <a href="/login" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300">
                  Admin Login
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-yellow-400">📍</span>
                <span className="text-gray-300">Kigali, Rwanda</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-yellow-400">📞</span>
                <a href="tel:+250123456789" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300">
                  +250 123 456 789
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-yellow-400">✉️</span>
                <a href="mailto:info@onegenesis.rw" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300">
                  info@onegenesis.rw
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-yellow-400">🕒</span>
                <span className="text-gray-300">Mon-Sat: 8AM-8PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 One Genesis Butcher Shop. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors duration-300">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors duration-300">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
