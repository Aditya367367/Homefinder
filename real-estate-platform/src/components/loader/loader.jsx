import React from "react";
import Lottie from "lottie-react";
import animationData from "../../assets/loader.json"; 
import logo from "../../assets/logo.png"; 

export default function Loader() {
  return (
    <div className="fixed inset-0 bg-[#0f1115] flex flex-col items-center justify-center z-[9999] text-white">
      <div className="bg-[#1f2227] p-10 rounded-xl shadow-2xl flex flex-col items-center max-w-md w-full mx-4">
        <div className="w-60 h-60">
          <Lottie animationData={animationData} loop />
        </div>
        <div className="flex items-center gap-2 mt-4 text-xl font-bold mb-2">
          <span>Loading</span> <img src={logo} alt="HomeFinder Logo" className="w-6 h-6" /><span>HomeFinder</span>
        </div>
        <p className="text-gray-300 text-md mb-4">Preparing your real estate experience</p>
        <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
          <div className="bg-blue-500 h-full animate-pulse" style={{ width: '100%' }}></div>
        </div>
      </div>
    </div>
  );
}
