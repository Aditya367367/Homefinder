import React from "react";

const RentBuyToggle = ({ value, onChange }) => {
  return (
    <div className="flex bg-[#1f2227] rounded-lg overflow-hidden mt-[70px]">
      <button
        className={`flex-1 py-2 px-4 ${
          value === "buy" ? "bg-blue-600 text-white" : "text-gray-400"
        }`}
        onClick={() => onChange("buy")}
      >
        Buy
      </button>
      <button
        className={`flex-1 py-2 px-4 ${
          value === "rent" ? "bg-blue-600 text-white" : "text-gray-400"
        }`}
        onClick={() => onChange("rent")}
      >
        Rent
      </button>
    </div>
  );
};

export default RentBuyToggle;
