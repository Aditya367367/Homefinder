import React from "react";
import Lottie from "lottie-react";
import animationData from "../../assets/loader.json"; 
import logo from "../../assets/logo.png"; 

export default function Loader() {
  return (
    <div className="fixed inset-0 bg-[#0e1a10] flex flex-col items-center justify-center z-50 text-white">
      <div className="w-60 h-60">
        <Lottie animationData={animationData} loop />
      </div>
      <div className="flex items-center gap-2 mt-4 text-lg font-semibold">
        
        <span>Loading </span> <img src={logo} alt="FitTrack Logo" className="w-5 h-5" /><span> HomeFinder...</span>
      </div>
    </div>
  );
}
