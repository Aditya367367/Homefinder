import React from "react";

const PropertyTypeToggle = ({ value = [], onChange }) => {
  const types = ["Flat", "Villa", "Apartment"];

  const handleToggle = (type) => {
    const updated = value.includes(type)
      ? value.filter((t) => t !== type)
      : [...value, type];
    onChange(updated);
  };

  return (
    <div>
      <p className="text-sm text-gray-400 mb-3 font-medium">Property Type</p>
      {types.map((type) => {
        const isActive = value.includes(type);
        return (
          <div key={type} className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-300">{type}</span>
            <button
              onClick={() => handleToggle(type)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                isActive ? "bg-blue-600" : "bg-gray-500"
              }`}
            >
              <span
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                  isActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default PropertyTypeToggle;
