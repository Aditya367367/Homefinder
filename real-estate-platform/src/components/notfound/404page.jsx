import React from "react";
import { Link } from "react-router-dom";
import { Ghost } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#0f1115] text-white flex items-center justify-center px-6 py-12">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <Ghost className="w-16 h-16 text-blue-500 animate-bounce" />
        </div>
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-lg text-gray-400 mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
