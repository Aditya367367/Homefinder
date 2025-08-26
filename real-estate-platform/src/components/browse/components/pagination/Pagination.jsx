import React from "react";

const Pagination = () => {
  return (
    <div className="flex justify-center gap-2 items-center mt-8">
      {["<", 1, 2, 3, 4, 5, ">"].map((item, idx) => (
        <button
          key={idx}
          className={`w-8 h-8 rounded-full text-sm flex items-center justify-center ${
            item === 1 ? "bg-blue-600 text-white" : "bg-[#1f2227] text-gray-400"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default Pagination;