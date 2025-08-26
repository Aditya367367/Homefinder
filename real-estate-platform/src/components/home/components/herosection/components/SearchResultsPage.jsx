import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PropertyCard from "../../featuredProperties/components/PropertyCard";
import { useGlobalSearch } from "../../../../list_property/services/SearchPropertiesByQuery.services";

const SearchResultsPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";

  const {
    searchResults,
    isLoadingSearchResults,
    isErrorSearchResults,
    errorSearchResults,
  } = useGlobalSearch(query);

  const formatImageUrl = (imgPath) => {
    return imgPath?.startsWith("http")
      ? imgPath
      : `${process.env.REACT_APP_MEDIA_URL}${imgPath}`;
  };

  useEffect(() => {
    console.log("Search results from backend:", searchResults);
  }, [searchResults]);

  const PropertyCardSkeleton = () => (
    <div className="bg-[#181a20] p-4 rounded-2xl border border-gray-800 text-white shadow-lg animate-pulse">
      <div className="mb-3">
        <div className="w-full h-40 bg-gray-800 rounded-xl mb-2" />
        <div className="flex gap-1">
          <div className="w-1/3 h-16 bg-gray-800 rounded-lg" />
          <div className="w-1/3 h-16 bg-gray-800 rounded-lg" />
          <div className="w-1/3 h-16 bg-gray-800 rounded-lg" />
        </div>
      </div>
      <div className="h-5 w-3/4 bg-gray-800 rounded mb-1" />
      <div className="h-3 w-1/2 bg-gray-800 rounded mb-3" />
      <div className="flex flex-wrap gap-1 mb-2 text-xs">
        <div className="h-5 w-14 bg-gray-800 rounded" />
        <div className="h-5 w-14 bg-gray-800 rounded" />
        <div className="h-5 w-14 bg-gray-800 rounded" />
        <div className="h-5 w-14 bg-gray-800 rounded" />
        <div className="h-5 w-14 bg-gray-800 rounded" />
      </div>
      <div className="h-8 bg-gray-800 rounded" />
    </div>
  );

  if (isLoadingSearchResults) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <PropertyCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (isErrorSearchResults) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 text-red-400">
        <p>Error: {errorSearchResults?.message || "Something went wrong"}</p>
      </div>
    );
  }

  // ✅ searchResults is now a flat array of properties
  const properties = Array.isArray(searchResults) ? searchResults : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 min-h-screen">
      <h2 className="text-2xl font-bold text-white mb-6">
        Search Results for "{query}"
      </h2>

      {properties.length === 0 ? (
        <p className="text-gray-400">No properties found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              id={property.id}
              title={property.title}
              price={`₹${property.price}`}
              location={property.location}
              image={formatImageUrl(property.images?.[0]?.image)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
