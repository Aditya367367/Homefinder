import React, { useEffect, useState } from "react";
import { useFetchSimilarProperties } from "../../list_property/services/FetchSimilarProperties.services";
import { useNavigate } from "react-router-dom";

const SimilarPropertiesGrid = ({ propertyId }) => {
  const navigate = useNavigate();
  const {
    similarProperties,
    isLoadingSimilarProperties,
    isErrorSimilarProperties,
  } = useFetchSimilarProperties(propertyId);

  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 1000); 

    return () => clearTimeout(timer);
  }, []);

  const handleCardClick = (id) => {
    navigate(`/property-detail/${id}`);
  };

  const activeSimilarProperties = (similarProperties || []).filter(
    (property) => property.status === "Active"
  );

  if (isErrorSimilarProperties) {
    return (
      <div className="mt-12">
        <h3 className="text-white text-xl font-semibold mb-4">
          Similar Properties
        </h3>
        <p className="text-red-400">Error fetching similar properties.</p>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h3 className="text-white text-xl font-semibold mb-6">
        Similar Properties
      </h3>

      {isLoadingSimilarProperties || showSkeleton ? (
        <div className="flex gap-4 overflow-x-auto scrollbar-hide px-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="min-w-[250px] max-w-[250px] bg-[#1f2227] rounded-xl border border-gray-700 animate-pulse"
            >
              <div className="w-full h-48 bg-gray-800 rounded-t-md"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-600 rounded w-1/3 mt-3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : activeSimilarProperties.length === 0 ? (
        <p className="text-gray-400">No active similar properties found.</p>
      ) : (
        <div className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory px-1">
          {activeSimilarProperties.map((item, i) => {
            let imageUrl = "https://source.unsplash.com/400x300/?house";
            if (item.images?.length) {
              const img = item.images[0].image;
              imageUrl = img.startsWith("http")
                ? img
                : `${process.env.REACT_APP_MEDIA_URL}${img}`;
            }

            return (
              <div
                key={i}
                onClick={() => handleCardClick(item.id)}
                className="min-w-[250px] max-w-[250px] snap-start bg-[#1f2227] rounded-xl overflow-hidden border border-gray-700 hover:shadow-lg hover:scale-[1.01] transition-all cursor-pointer"
              >
                <img
                  src={imageUrl}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="text-white text-base font-semibold truncate">
                    {item.title}
                  </h4>
                  <p className="text-gray-400 text-sm mt-1 truncate">
                    ₹{item.price} • {item.location}
                  </p>
                  <span
                    className={`inline-block mt-3 px-2 py-1 rounded text-xs font-semibold tracking-wide uppercase ${
                      item.furnished === "Furnished"
                        ? "bg-green-600 text-white"
                        : "bg-gray-600 text-gray-100"
                    }`}
                  >
                    {item.furnished}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SimilarPropertiesGrid;
