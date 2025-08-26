import React from "react";
import ListingCard from "./ListingCard";

const ListingGrid = ({ listings }) => {
  if (!listings || listings.length === 0)
    return <p className="text-gray-400 mt-4">No listings found.</p>;

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
        {listings.map((listing, index) => (
          <ListingCard
            key={listing.id || index}
            id={listing.id}
            title={listing.title}
            location={listing.location}
            image={
              listing.images?.[0]?.image?.startsWith("http")
                ? listing.images[0].image
                : `http://localhost:8000${listing.images?.[0]?.image || ""}`
            }
          />
        ))}
      </div>
    </div>
  );
};

export default ListingGrid;
