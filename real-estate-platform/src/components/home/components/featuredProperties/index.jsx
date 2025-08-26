import React from "react";
import PropertyCard from "./components/PropertyCard";
import { useFetchFeaturedProperties } from "../../services/FetchFeaturedProperties.services";

const formatImageUrl = (imgPath) => {
  return imgPath?.startsWith("http")
    ? imgPath
    : `${process.env.REACT_APP_MEDIA_URL}${imgPath}`;
};

const FeaturedProperties = () => {
  const {
    featuredProperties,
    isLoadingFeaturedProperties,
    isErrorFeaturedProperties,
    errorFeaturedProperties,
  } = useFetchFeaturedProperties(1);

  if (isLoadingFeaturedProperties) {
    return (
      <section className="max-w-7xl mx-auto px-4 mt-8 md:mt-16">
        <div className="text-left mb-6">
          <h2 className="text-3xl text-white font-bold mb-2">Featured Properties</h2>
          <p className="text-gray-400 text-sm">
            Handpicked listings curated just for you — explore the top homes across India.
          </p>
        </div>
        <p className="text-gray-400">Loading featured properties...</p>
      </section>
    );
  }

  if (isErrorFeaturedProperties) {
    return (
      <section className="max-w-7xl mx-auto px-4 mt-8 md:mt-16">
        <div className="text-left mb-6">
          <h2 className="text-3xl text-white font-bold mb-2">Featured Properties</h2>
          <p className="text-gray-400 text-sm">
            Handpicked listings curated just for you — explore the top homes across India.
          </p>
        </div>
        <p className="text-red-400">Error fetching properties: {errorFeaturedProperties.message}</p>
      </section>
    );
  }

  const activeFeaturedProperties = (featuredProperties?.results || []).filter(
    (property) => property.status === "Active"
  );

  return (
    <section className="max-w-7xl mx-auto px-4 mt-8 md:mt-16">
      <div className="text-left mb-6">
        <h2 className="text-3xl text-white font-bold mb-2">Featured Properties</h2>
        <p className="text-gray-400 text-sm">
          Handpicked listings curated just for you — explore the top homes across India.
        </p>
      </div>
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-6 min-w-full">
          {activeFeaturedProperties.length === 0 ? (
            <p className="text-gray-400">No active featured properties available.</p>
          ) : (
            activeFeaturedProperties.map((property) => (
              <div key={property.id} className="min-w-[280px] max-w-[300px]">
                <PropertyCard
                  id={property.id}
                  title={property.title}
                  price={`₹${property.price}`}
                  location={property.location}
                  image={
                    property.images?.length
                      ? formatImageUrl(property.images[0].image)
                      : "https://source.unsplash.com/400x300/?house"
                  }
                />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;