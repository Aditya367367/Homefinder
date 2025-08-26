import React from "react";

const SortDropdown = ({ onSortChange }) => {
  return (
    <select
      onChange={(e) => onSortChange(e.target.value)}
      className="bg-[#1f2227] border mt-[70px] border-gray-700 rounded-md px-3 py-2 text-white w-full sm:w-auto"
    >
      <option value="">Sort by</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="price_desc">Price: High to Low</option>
      <option value="newest">Newest Listings</option>
    </select>
  );
};

export default SortDropdown;
