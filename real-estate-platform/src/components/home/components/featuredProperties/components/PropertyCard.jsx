import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const PropertyCard = ({ id, title, price, location, image }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/property-detail/${id}`, { state: { title, price, location, image } });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="w-full"
    >
      <div
        className="bg-[#1f2227] rounded-xl overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
        onClick={handleClick}
      >
        {!isLoaded && (
          <div className="h-44 sm:h-48 md:h-52 w-full bg-gray-800 animate-pulse" />
        )}

        <img
          src={image}
          alt={title}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-44 sm:h-48 md:h-52 object-cover transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
        />

        <div className="p-3 sm:p-4">
          <h3 className="text-white text-base sm:text-lg font-semibold">{title}</h3>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            <span className="font-medium text-blue-400">{price}</span> — {location}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
