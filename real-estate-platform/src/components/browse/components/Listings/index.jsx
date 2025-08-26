import React from "react";
import ListingGrid from "./components/ListingGrid";
import SortDropdown from "./components/SortDropdown";

const Listings = ({ properties, onSortChange }) => {
  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-white font-bold text-xl">Available Properties</h2>
        <SortDropdown onSortChange={onSortChange} />
      </div>
      <ListingGrid listings={properties} />
    </div>
  );
};

export default Listings;
