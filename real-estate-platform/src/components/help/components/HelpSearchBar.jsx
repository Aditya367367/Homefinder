import React from "react";

const HelpSearchBar = ({ query, setQuery }) => (
  <div className="mb-6">
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search FAQs..."
      className="w-full p-3 rounded-md bg-[#1f2227] border border-gray-600 text-white"
    />
  </div>
);

export default HelpSearchBar;
