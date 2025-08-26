import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const options = ["Buy", "Rent", "Furnished", "Unfurnished"];

const HeroOptionsBar = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="flex gap-3 flex-wrap"
    >
      {loading
        ? options.map((_, index) => (
            <div
              key={index}
              className="w-24 h-9 rounded-full bg-gray-700 animate-pulse"
            />
          ))
        : options.map((label) => (
            <motion.button
              key={label}
              whileHover={{ scale: 1.05 }}
              className="px-5 py-2 rounded-full text-sm text-white bg-gradient-to-br from-[#1f2227] to-[#2a2d32] hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md"
            >
              {label}
            </motion.button>
          ))}
    </motion.div>
  );
};

export default HeroOptionsBar;
