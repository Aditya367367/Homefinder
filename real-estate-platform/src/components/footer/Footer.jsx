import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#0f1115] text-gray-400 py-6 px-4">
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 text-sm">
        <Link to="/about" className="hover:text-white transition">About</Link>
        <Link to="/contact" className="hover:text-white transition">Contact</Link>
        <Link to="/terms" className="hover:text-white transition">Terms</Link>
        <Link to="/privacy" className="hover:text-white transition">Privacy</Link>
      </div>

      <div className="flex justify-center gap-6 mt-6">
        {process.env.REACT_APP_INSTAGRAM_URL && (
          <a
            href={process.env.REACT_APP_INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition"
            aria-label="Instagram"
          >
            <i className="fa-brands fa-instagram fa-lg"></i> 
          </a>
        )}
        {process.env.REACT_APP_FACEBOOK_URL && (
          <a
            href={process.env.REACT_APP_FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition"
            aria-label="Facebook"
          >
            <i className="fa-brands fa-facebook-f fa-lg"></i> 
          </a>
        )}
        {process.env.REACT_APP_X_URL && (
          <a
            href={process.env.REACT_APP_X_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition"
            aria-label="X (formerly Twitter)"
          >
            <i className="fa-brands fa-x-twitter fa-lg"></i> 
          </a>
        )}
      </div>

      <p className="text-center text-sm mt-4 text-gray-500">
        © {new Date().getFullYear()} <span className="text-white font-medium">HomeFinder.</span> All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;