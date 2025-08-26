import React from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useFetchAllProperties } from "../../services/FetchAllProperties.services";

const formatImageUrl = (imgPath) => {
  return imgPath?.startsWith("http")
    ? imgPath
    : `${process.env.REACT_APP_MEDIA_URL}${imgPath}`;
};

const PropertyTypeListPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const propertyType = location.state?.type || "Villa";
  const currentPage = parseInt(searchParams.get("page")) || 1;

  const {
    allProperties,
    isLoadingAllProperties,
    isErrorAllProperties,
    errorAllProperties,
  } = useFetchAllProperties(currentPage);

  const handleCardClick = (propertyId) => {
    navigate(`/property-detail/${propertyId}`);
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

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

  if (isLoadingAllProperties) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-white mb-6">
          {propertyType}s Available
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <PropertyCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (isErrorAllProperties) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-white mb-6">
          {propertyType}s Available
        </h2>
        <div className="text-red-400">
          Error fetching properties: {errorAllProperties.message}
        </div>
      </div>
    );
  }

  const filteredProperties = (allProperties?.results || []).filter(
    (prop) => prop.property_type === propertyType && prop.status === "Active"
  );
  
  const hasNextPage = !!allProperties?.next;
  const hasPreviousPage = !!allProperties?.previous;
  const totalPages = Math.ceil((allProperties?.count || 0) / 10);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-white mb-6">
        {propertyType}s Available
      </h2>
      {filteredProperties.length === 0 ? (
        <div className="text-gray-400">No active {propertyType}s found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              className="bg-[#181a20] p-4 rounded-2xl border border-gray-800 text-white shadow-lg hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
              onClick={() => handleCardClick(property.id)}
            >
              <div className="mb-3">
                {property.images?.length > 0 ? (
                  <div>
                    <img
                      src={formatImageUrl(property.images[0].image)}
                      alt="Property"
                      className="w-full h-40 object-cover rounded-xl mb-2 border border-gray-700"
                    />
                    <div className="flex gap-1">
                      {property.images.slice(1, 4).map((img, idx) => (
                        <img
                          key={idx}
                          src={formatImageUrl(img.image)}
                          alt={`Property ${idx + 2}`}
                          className="w-1/3 h-16 object-cover rounded-lg border border-gray-700"
                        />
                      ))}
                      {Array.from({
                        length: 3 - property.images.slice(1, 4).length,
                      }).map((_, idx) => (
                        <div
                          key={idx}
                          className="w-1/3 h-16 bg-gray-900 rounded-lg border border-gray-700 flex items-center justify-center text-gray-600 text-xs"
                        >
                          No Image
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-40 bg-gray-900 rounded-xl flex items-center justify-center text-gray-600 text-lg border border-gray-700">
                    No Images
                  </div>
                )}
              </div>
              <h3 className="font-bold text-lg mb-1">{property.title}</h3>
              <p className="text-xs text-blue-400 mb-1">{property.location}</p>
              <div className="flex flex-wrap gap-1 mb-2 text-xs">
                <span className="bg-blue-700 px-2 py-1 rounded text-white">
                  ₹{property.price}
                </span>
                <span className="bg-gray-700 px-2 py-1 rounded text-white">
                  {property.bedrooms} Beds
                </span>
                <span className="bg-gray-700 px-2 py-1 rounded text-white">
                  {property.bathrooms} Baths
                </span>
                <span className="bg-gray-700 px-2 py-1 rounded text-white">
                  {property.area} sq.ft.
                </span>
                <span className="bg-gray-700 px-2 py-1 rounded text-white">
                  {property.furnished}
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                {property.description}
              </p>
            </div>
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPreviousPage}
            className="px-4 py-2 rounded-full disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
          >
            {`Previous`}
          </button>
          {Array.from({ length: totalPages }).map((_, index) => {
            const page = index + 1;
            const isActive = page === currentPage;
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-full text-lg font-bold transition-colors duration-200 ${
                  isActive ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                }`}
              >
                {page}
              </button>
            );
          })}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNextPage}
            className="px-4 py-2 rounded-full disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
          >
            {`Next`}
          </button>
        </div>
      )}
    </div>
  );
};

export default PropertyTypeListPage;