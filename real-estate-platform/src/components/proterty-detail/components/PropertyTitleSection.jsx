import React from "react";
import { MapPin } from "lucide-react";

const PropertyTitleSection = ({
  title,
  location,
  price,
  furnished,
  type,
  bedrooms,
  bathrooms,
  area,
}) => (
  <div className="mt-6 space-y-3">
    <h1 className="text-3xl md:text-4xl font-bold text-white leading-snug">
      {title}
    </h1>

    <div className="flex items-center text-gray-300 text-sm flex-wrap gap-2">
      <span className="bg-blue-600 px-3 py-1 rounded-full text-white font-semibold text-sm">
        ₹{price}
      </span>
      <span className="text-gray-500 hidden sm:inline">|</span>
      <div className="flex items-center gap-1">
        <MapPin className="w-4 h-4 text-red-400" />
        <span>{location}</span>
      </div>
    </div>

    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-300">
      <span className="bg-[#2a2d33] px-3 py-1 rounded-full">{furnished}</span>
      <span className="bg-[#2a2d33] px-3 py-1 rounded-full">{type}</span>
      <span className="bg-[#2a2d33] px-3 py-1 rounded-full">{bedrooms} Beds</span>
      <span className="bg-[#2a2d33] px-3 py-1 rounded-full">{bathrooms} Baths</span>
      <span className="bg-[#2a2d33] px-3 py-1 rounded-full">{area} sq.ft.</span>
    </div>
  </div>
);

export default PropertyTitleSection;
