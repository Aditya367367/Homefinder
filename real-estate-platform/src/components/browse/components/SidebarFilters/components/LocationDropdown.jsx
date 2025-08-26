import React from "react";

const LocationDropdown = ({ value, onChange, locations = [] }) => {
  return (
    <div>
      <label className="block text-sm mb-1 text-gray-400">Location</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#1f2227] border border-gray-600 rounded-md text-white px-3 py-2"
      >
        <option value="">All</option>
        {locations.map((loc) => (
          <option key={loc} value={loc}>
            {loc}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocationDropdown;
