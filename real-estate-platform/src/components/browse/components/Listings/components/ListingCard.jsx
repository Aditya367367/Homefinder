import React from "react";
import { useNavigate } from "react-router-dom";

const ListingCard = ({ id, title, location, image }) => {
  const navigate = useNavigate();

  if (!id || !title || !location || !image) return null;

  const handleClick = () => {
    navigate(`/property-detail/${id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer rounded-lg overflow-hidden bg-[#1f2227] shadow hover:shadow-lg hover:scale-105 transition duration-300"
    >
      <img
        src={image}
        alt={title}
        className="w-full h-40 object-cover"
        loading="lazy"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
        }}
      />
      <div className="p-3">
        <h3 className="text-white font-semibold text-sm">{title}</h3>
        <p className="text-gray-400 text-xs">{location}</p>
      </div>
    </div>
  );
};

export default ListingCard;
