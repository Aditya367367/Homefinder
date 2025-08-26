import React, { useEffect, useState } from "react";
import RentBuyToggle from "./components/BuyRentToggle";
import PriceRangeSlider from "./components/PriceRangeSlider";
import LocationDropdown from "./components/LocationDropdown";
import FurnishedToggle from "./components/FurnishedToggle";
import PropertyTypeToggle from "./components/PropertyTypeCheckboxes";

const SidebarFilters = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState({
    rentType: "buy",
    price: 50000,
    location: "",
    furnished: false,
    propertyTypes: [],
  });

  const availableLocations = ["Mumbai", "Delhi", "Goa", "uttar pradesh"]; 
useEffect(() => {
  if (onFiltersChange) {
    onFiltersChange(filters);
  }
}, [filters, onFiltersChange]);

  return (
    <div className="space-y-6">
      <RentBuyToggle
        value={filters.rentType}
        onChange={(rentType) => setFilters((prev) => ({ ...prev, rentType }))}
      />

      <PriceRangeSlider
        value={filters.price}
        onChange={(price) => setFilters((prev) => ({ ...prev, price }))}
      />

      <LocationDropdown
        value={filters.location}
        onChange={(location) => setFilters((prev) => ({ ...prev, location }))}
        locations={availableLocations}
      />

      <FurnishedToggle
        value={filters.furnished}
        onChange={(furnished) => setFilters((prev) => ({ ...prev, furnished }))}
      />

      <PropertyTypeToggle
        value={filters.propertyTypes}
        onChange={(propertyTypes) => setFilters((prev) => ({ ...prev, propertyTypes }))}
      />
    </div>
  );
};
  
export default SidebarFilters;
