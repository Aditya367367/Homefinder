import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EventPlaceImage from '../../assets/event.png';
import { getAccessToken } from "../utils/authTokenStore"; 
import { useFetchEventPlaces } from './services/FetchEventPlaces.services'; 

const Toggle = ({ checked, onChange }) => (
  <label className="flex items-center cursor-pointer">
    <div className="relative">
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      <div className="block bg-gray-600 w-10 h-6 rounded-full"></div>
      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'translate-x-4 bg-blue-500' : ''}`}></div>
    </div>
  </label>
);


const Slider = ({ min, max, value, onChange, label }) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = parseInt(e.target.value);
    setLocalValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="my-4">
      <label className="block text-gray-300 text-sm font-bold mb-2">{label}</label>
      <div className="relative h-2 bg-gray-600 rounded-lg">
        <div
          className="absolute h-full bg-blue-500 rounded-lg"
          style={{
            width: `${((localValue - min) / (max - min)) * 100}%`
          }}
        ></div>
        <input
          type="range"
          min={min}
          max={max}
          value={localValue}
          onChange={handleChange}
          className="absolute w-full h-full appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:-mt-1 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:-mt-1 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:border-none"
        />
      </div>
      <div className="flex justify-between text-gray-400 text-sm mt-2">
        <span>₹{min}</span>
        <span>₹{localValue}</span>
      </div>
    </div>
  );
};

const EventPlaceCard = ({ place }) => (
  <Link to={`/spaces/${place.id}`} className="block">
    <div className="bg-[#1f2227] rounded-lg shadow-lg overflow-hidden h-full flex flex-col">
      <img
        src={place.images && place.images.length > 0 ? place.images[0].image : EventPlaceImage}
        alt={place.name}
        className="w-full h-40 object-cover"
      />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-white mb-1">{place.name}</h3>
        <p className="text-gray-400 text-sm flex-grow">{place.location}</p>
        <p className="text-blue-400 font-bold mt-2">₹{parseFloat(place.price_per_hour).toFixed(2)}/hr</p>
      </div>
    </div>
  </Link>
);

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
            Want to List Your Event Space?
          </h2>
          <p className="text-gray-400 text-base md:text-lg mb-6 max-w-md mx-auto">
            Reach thousands of potential renters by listing your space with us. It's quick and easy to get started.
          </p>
          <Link
            to={isLoggedIn ? "/add-event-place" : "/login"}
            className="inline-block bg-blue-600 hover:bg-blue-700 transition-colors duration-300 text-white px-6 py-2.5 rounded-full text-sm md:text-base font-medium"
          >
            {isLoggedIn ? "List Your Space" : "Login to List"}
          </Link>
        </div>
      )}
    </div>
  );
};

const EventPlacesPage = () => {
  const { data: eventPlacesData = [], isLoading, isError, error } = useFetchEventPlaces();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  const [filters, setFilters] = useState({
    indoor: false,
    outdoor: false,
    rooftop: false,
    priceMax: 250000,
    availabilityNow: false,
  });
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Check login status on component mount
  useEffect(() => {
    const token = getAccessToken();
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    let tempPlaces = [...eventPlacesData];

    const activeCategories = [];
    if (filters.indoor) activeCategories.push('Indoor');
    if (filters.outdoor) activeCategories.push('Outdoor');
    if (filters.rooftop) activeCategories.push('Rooftop');

    if (activeCategories.length > 0) {
      tempPlaces = tempPlaces.filter(place =>
        activeCategories.includes(place.category)
      );
    }

    // MODIFIED FILTERING LOGIC for single price max
    tempPlaces = tempPlaces.filter(place =>
      parseFloat(place.price_per_hour) <= filters.priceMax
    );

    if (filters.availabilityNow) {
      tempPlaces = tempPlaces.filter(place => place.is_available_now);
    }

    setFilteredPlaces(tempPlaces);
    setCurrentPage(1);
  }, [eventPlacesData, filters]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPlaces.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPlaces.length / itemsPerPage);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24 min-h-[calc(100vh-160px)] flex justify-center items-center text-white text-xl">
        <p>Loading event spaces...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24 min-h-[calc(100vh-160px)] flex justify-center items-center text-red-500 text-xl">
        <p>Error loading event spaces: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-160px)]">
      <div className="relative h-[500px] rounded-lg shadow-lg mb-8 flex items-center justify-center overflow-hidden">
        <img src={EventPlaceImage} alt="Event Places" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black opacity-40 rounded-lg"></div>
        <h1 className="relative text-4xl font-bold text-white z-10 text-center">Book Stunning Event Spaces</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4 bg-[#1f2227] rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold text-white mb-4">Filters</h2>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-300 mb-2">Categories</h3>
            <label className="flex items-center text-gray-400 mb-2">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-blue-600 bg-gray-700 border-gray-500 rounded"
                checked={filters.indoor}
                onChange={(e) => handleFilterChange('indoor', e.target.checked)}
              />
              <span className="ml-2">Indoor</span>
            </label>
            <label className="flex items-center text-gray-400 mb-2">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-blue-600 bg-gray-700 border-gray-500 rounded"
                checked={filters.outdoor}
                onChange={(e) => handleFilterChange('outdoor', e.target.checked)}
              />
              <span className="ml-2">Outdoor</span>
            </label>
            <label className="flex items-center text-gray-400">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-blue-600 bg-gray-700 border-gray-500 rounded"
                checked={filters.rooftop}
                onChange={(e) => handleFilterChange('rooftop', e.target.checked)}
              />
              <span className="ml-2">Rooftop</span>
            </label>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-300 mb-2">Price Range (Max)</h3>
            <Slider
              min={1000}
              max={250000}
              value={filters.priceMax}
              onChange={(value) => handleFilterChange('priceMax', value)}
              label="Max Price"
            />
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-300 mb-2">Availability</h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Available Now</span>
              <Toggle
                checked={filters.availabilityNow}
                onChange={(e) => handleFilterChange('availabilityNow', e.target.checked)}
              />
            </div>
          </div>
        </aside>

        <section className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">Event Spaces</h2>
            {isLoggedIn && (
              <Link
                to="/my-bookings"
                className="bg-blue-500 hover:bg-purple-700 text-white text-sm font-medium py-2 px-4 rounded-full transition-colors duration-200 shadow-md"
              >
                My Bookings
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.length > 0 ? (
              currentItems.map(place => (
                <EventPlaceCard key={place.id} place={place} />
              ))
            ) : (
              <p className="text-gray-400 col-span-full text-center">No event spaces found matching your criteria.</p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 bg-gray-800 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-full ${currentPage === i + 1 ? 'bg-blue-800 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 bg-gray-800 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
              >
                &gt;
              </button>
            </div>
          )}
        </section>
      </div>
      <ListPropertyCTA />
    </div>
  );
};

export default EventPlacesPage;