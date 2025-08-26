import React from "react";

const PriceRangeSlider = ({
  value,
  onChange,
  min = 3000,
  max = 5000000,
  step = 10000,
}) => {
  return (
    <div>
      <label className="block text-sm mb-1 text-gray-400">
        Price Range: ₹{value.toLocaleString()}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-500"
      />
    </div>
  );
};

export default PriceRangeSlider;
