import React from "react";

const SortDropdown = () => {
  return (
    <select className="bg-[#1f2227] text-white px-4 py-2 rounded-md border border-gray-700 w-full max-w-xs">
      <option>Sort</option>
      <option>Newest</option>
      <option>Oldest</option>
    </select>
  );
};

export default SortDropdown;
    