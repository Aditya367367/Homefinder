import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { useDebounce } from "use-debounce";
import { useGlobalSearch } from "../../list_property/services/SearchPropertiesByQuery.services";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ isMobile = false }) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 400);
  const [showResults, setShowResults] = useState(false);
  const {
    searchResults: results = [],
    isLoadingSearchResults: loading,
  } = useGlobalSearch(debouncedQuery);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (debouncedQuery.trim() !== "" && results.length > 0) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [debouncedQuery, results]);

  return (
    <div ref={searchRef} className={`relative ${isMobile ? "w-full" : "w-72"}`}>
      {isMobile ? (
        <div className="flex items-center bg-[#2c2f34] rounded-full px-4 py-2 w-full">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm text-white placeholder-gray-400 w-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (results.length > 0) setShowResults(true);
            }}
          />
        </div>
      ) : (
        <div className="hidden lg:flex items-center gap-2 bg-[#2c2f34]/80 backdrop-blur-md border border-gray-600 hover:border-blue-400 focus-within:border-blue-400 rounded-xl px-4 py-2 transition-all duration-300 shadow-sm">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search for properties, agents..."
            className="bg-transparent outline-none text-sm text-white placeholder-gray-400 w-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (results.length > 0) setShowResults(true);
            }}
          />
        </div>
      )}

      {showResults && results.length > 0 && (
        <div className="absolute z-50 top-full mt-2 w-full bg-[#1f2227] border border-gray-700 rounded-lg shadow-lg text-white max-h-60 overflow-y-auto no-scrollbar">
          {results.map((item) => (
            <div
              key={item.id}
              className="p-3 hover:bg-[#2d3036] cursor-pointer border-b border-gray-800 last:border-none"
              onClick={() => navigate(`/property-detail/${item.id}`)}
            >
              <div className="font-semibold">{item.title}</div>
              <div className="text-sm text-gray-400">{item.location}</div>
              <div className="text-sm text-blue-400">₹{item.price}</div>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="absolute top-full mt-2 w-full text-sm text-gray-400 p-3 bg-[#1f2227] rounded shadow">
          Searching...
        </div>
      )}
    </div>
  );
};

export default SearchBar;
