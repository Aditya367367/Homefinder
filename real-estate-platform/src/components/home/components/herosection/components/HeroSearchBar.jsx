import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const HeroSearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.4 }}
      className="bg-[#2c2f34] w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl px-4 py-2 rounded-full flex items-center gap-2"
    >
      <input
        type="text"
        placeholder="Search for properties"
        className="flex-1 bg-transparent text-white text-sm sm:text-base outline-none placeholder-gray-400"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <button
        onClick={handleSearch}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-full text-sm sm:text-base font-medium"
      >
        Search
      </button>
    </motion.div>
  );
};

export default HeroSearchBar;
