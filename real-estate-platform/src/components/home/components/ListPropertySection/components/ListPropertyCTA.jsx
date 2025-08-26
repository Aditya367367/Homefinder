import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAccessToken } from "../../../../utils/authTokenStore"; 
const ListPropertyCTA = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 800);

    const token = getAccessToken();
    setIsLoggedIn(!!token);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mt-16 px-4">
      {!isLoaded ? (
        <div className="max-w-3xl mx-auto bg-[#1f2227] rounded-xl shadow-lg p-10 animate-pulse space-y-4">
          <div className="h-8 bg-gray-700 rounded w-3/4 mx-auto" />
          <div className="h-4 bg-gray-700 rounded w-2/3 mx-auto" />
          <div className="h-10 bg-gray-700 rounded w-40 mx-auto mt-4" />
        </div>
      ) : (
        <div className="bg-gradient-to-r from-[#1f2227] to-[#2c2f34] rounded-xl max-w-3xl mx-auto px-6 py-10 shadow-lg text-center transition-transform duration-300 hover:scale-[1.02]">
          <h2 className="text-white text-3xl md:text-4xl font-bold mb-3">
            Want to Sell or Rent Your Property?
          </h2>

          <p className="text-gray-400 text-base md:text-lg mb-6 max-w-md mx-auto">
            Reach thousands of buyers and renters by listing with us. It's quick and easy to get started.
          </p>

          <Link
            to={isLoggedIn ? "/list-property" : "/login"}
            className="inline-block bg-blue-600 hover:bg-blue-700 transition-colors duration-300 text-white px-6 py-2.5 rounded-full text-sm md:text-base font-medium"
          >
            {isLoggedIn ? "List Your Property" : "Login to List"}
          </Link>
        </div>
      )}
    </div>
  );
};

export default ListPropertyCTA;
