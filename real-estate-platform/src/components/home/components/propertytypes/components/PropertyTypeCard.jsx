import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const cardVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const PropertyTypeCard = ({ icon, title, desc, index }) => {
  const [isIconLoaded, setIsIconLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  
    const timer = setTimeout(() => {
      setIsIconLoaded(true);
    }, 300); 

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    
    navigate("/property-type", { state: { type: title } });
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileInView="animate"
      transition={{ duration: 0.4, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <div
        onClick={handleClick}
        className="cursor-pointer bg-[#1f2227] p-6 rounded-xl border border-gray-700 text-white text-center hover:shadow-xl hover:scale-[1.03] transition-transform duration-300"
      >
        <div className="mb-3 mx-auto h-10 w-10 flex items-center justify-center text-blue-400">
          {!isIconLoaded ? (
            <div className="h-6 w-6 bg-gray-700 rounded-full animate-pulse" />
          ) : (
            icon
          )}
        </div>

        <h4 className="font-semibold text-lg">{title}</h4>
        <p className="text-sm text-gray-400 mt-1">{desc}</p>
      </div>
    </motion.div>
  );
};

export default PropertyTypeCard;
