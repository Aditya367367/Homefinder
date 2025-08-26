import React, { useState } from "react";
import { X } from "lucide-react";

const PropertyImageGallery = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (imgUrl) => {
    setSelectedImage(imgUrl);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <div className="flex overflow-x-auto space-x-4 pb-4 mt-[70px] no-scrollbar">
        {images.length > 0 ? (
          images.map((imgObj, index) => {
            const imageUrl = imgObj.image.startsWith("http")
              ? imgObj.image
              : `${window.location.origin}${imgObj.image}`;
            return (
              <img
                key={index}
                src={imageUrl}
                alt={`Gallery ${index}`}
                className="h-40 w-60 object-cover rounded-md cursor-pointer transition-transform hover:scale-105"
                onClick={() => handleImageClick(imageUrl)}
              />
            );
          })
        ) : (
          <div className="h-40 w-60 bg-gray-900 flex items-center justify-center rounded-md text-gray-500">
            No Images Available
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={closeModal}
        >
          <div
            className="relative max-w-4xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-300 hover:text-white z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage}
              alt="Full View"
              className="w-full max-h-[90vh] object-contain rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyImageGallery;
