import React from "react";

const FullScreenLoader = ({ message = "Loading...", subMessage = "This may take a moment" }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
      <div className="bg-[#1f2227] p-8 rounded-xl shadow-2xl flex flex-col items-center max-w-md w-full mx-4">
        <div className="w-24 h-24 border-4 border-t-transparent border-blue-500 rounded-full animate-spin mb-6"></div>
        <p className="text-white text-2xl font-bold mb-2">{message}</p>
        <p className="text-gray-300 text-md mb-4">{subMessage}</p>
        <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
          <div className="bg-blue-500 h-full animate-pulse" style={{ width: '100%' }}></div>
        </div>
      </div>
    </div>
  );
};

export default FullScreenLoader;
