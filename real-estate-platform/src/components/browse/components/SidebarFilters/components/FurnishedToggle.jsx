import React from "react";

const FurnishedToggle = ({ value, onChange }) => {
  const isFurnished = value === "Furnished";

  return (
    <div className="flex items-center justify-between mt-4">
      <label className="text-white">Furnished</label>
      <button
        onClick={() =>
          onChange(isFurnished ? "Unfurnished" : "Furnished")
        }
        className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
          isFurnished ? "bg-blue-600" : "bg-gray-700"
        }`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full transform transition-transform duration-300 ${
            isFurnished ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
};

export default FurnishedToggle;
