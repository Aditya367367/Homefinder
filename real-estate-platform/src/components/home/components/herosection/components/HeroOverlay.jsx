import React from "react";
import HeroSearchBar from "./HeroSearchBar";
import { motion } from "framer-motion";

const HeroOverlay = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4 py-6"
    >
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
        Find Your Perfect Home
      </h1>
      <p className="text-xs sm:text-sm md:text-base mb-4 max-w-xl">
        Explore a wide range of properties for sale and rent in your desired location.
      </p>
      <HeroSearchBar />
    </motion.div>
  );
};

export default HeroOverlay;
