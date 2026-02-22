import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="text-white py-6 border-t" style={{ background: "rgba(15 9 36 / 0.85)", backdropFilter: "blur(16px)", borderColor: "rgba(255 255 255 / 0.08)" }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">© 2025 UPI Wallet & MLR. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-200">
              About
            </Link>
            <Link to="/contact" className="text-gray-300 hover:text-white transition-colors duration-200">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;