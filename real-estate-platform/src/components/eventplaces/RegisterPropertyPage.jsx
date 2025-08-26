import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useCreateEventPlace } from '../eventplaces/services/CreateEventPlace.services';
import { useNavigate } from 'react-router-dom';
import { getAccessToken } from "../utils/authTokenStore";
import { CheckCircle } from 'lucide-react';

const SuccessConfirmationModal = ({ onClose, onNavigate }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-[#1f2227] rounded-lg p-6 md:p-8 lg:p-10 w-full max-w-md mx-auto text-center shadow-xl border border-gray-700">
        <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-3">Registration Successful!</h3>
        <p className="text-gray-300 text-base mb-6">
          Your event property has been successfully registered. It will be reviewed shortly.
        </p>
        <div className="flex flex-col gap-3">
          {/* <button
            onClick={onNavigate}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-full focus:outline-none focus:shadow-outline transform transition duration-300 hover:scale-105"
          >
            View My Listings
          </button> */}
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2.5 px-6 rounded-full focus:outline-none focus:shadow-outline transform transition duration-300 hover:scale-105"
          >
            Register Another Property
          </button>
        </div>
      </div>
    </div>
  );
};

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!getAccessToken();
  });

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!getAccessToken());
    };
    window.addEventListener('storage', checkAuth);
    checkAuth();
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);
  return { isAuthenticated };
};

const RegisterPropertyPage = () => {
  const { mutate: createEventPlace, isLoading } = useCreateEventPlace();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    city: '',
    state: '',
    zip_code: '',
    price_per_hour: '',
    capacity: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    is_available_now: true,
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [categories, setCategories] = useState({
    indoor: false,
    outdoor: false,
    rooftop: false,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast.warn("Please log in to register a property.");
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const newImagePreviews = formData.images.map(image => URL.createObjectURL(image));
    setImagePreviews(newImagePreviews);
    return () => {
      newImagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [formData.images]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCategoryChange = (e) => {
    const { name, checked } = e.target;
    setCategories(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({
      ...prev,
      images: Array.from(e.target.files),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("You must be logged in to register a property.");
      navigate('/login');
      return;
    }

    if (!categories.indoor && !categories.outdoor && !categories.rooftop) {
      toast.error("Please select at least one category for your property (Indoor, Outdoor, or Rooftop).");
      return;
    }

    let selectedCategory = '';
    if (categories.indoor) selectedCategory = 'Indoor';
    else if (categories.outdoor) selectedCategory = 'Outdoor';
    else if (categories.rooftop) selectedCategory = 'Rooftop';

    const dataToSend = new FormData();
    dataToSend.append('name', formData.name);
    dataToSend.append('description', formData.description);
    dataToSend.append('location', formData.location);
    dataToSend.append('city', formData.city);
    dataToSend.append('state', formData.state);
    dataToSend.append('zip_code', formData.zip_code);
    dataToSend.append('category', selectedCategory);
    dataToSend.append('price_per_hour', formData.price_per_hour);
    dataToSend.append('capacity', formData.capacity);
    dataToSend.append('contact_name', formData.contact_name);
    dataToSend.append('contact_email', formData.contact_email);
    dataToSend.append('contact_phone', formData.contact_phone);
    dataToSend.append('is_available_now', formData.is_available_now); 
    formData.images.forEach((image) => {
      dataToSend.append('images', image);
    });

    createEventPlace(dataToSend, {
      onSuccess: () => {
        toast.success("Property registration successful!");
        setShowSuccessModal(true);
        setFormData({
          name: '',
          description: '',
          location: '',
          city: '',
          state: '',
          zip_code: '',
          price_per_hour: '',
          capacity: '',
          contact_name: '',
          contact_email: '',
          contact_phone: '',
          is_available_now: true,
          images: [],
        });
        setCategories({
          indoor: false,
          outdoor: false,
          rooftop: false,
        });
        setImagePreviews([]);
      },
      onError: (err) => {
        const errorMessage = err.response?.data
          ? Object.values(err.response.data).flat().join(', ')
          : 'Failed to register property. Please try again.';
        toast.error(`Error: ${errorMessage}`);
      },
    });
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  // const handleNavigateToListings = () => {
  //   setShowSuccessModal(false);
  //   navigate('/my-listings');
  // };

  if (!isAuthenticated) {
    return (
      <div className="px-4 py-8 pt-24 min-h-[calc(100vh-160px)] flex justify-center items-center bg-gray-900 text-white text-xl">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 pt-24 min-h-[calc(100vh-160px)] flex justify-center items-center bg-gray-900">
      <div className="bg-[#1f2227] rounded-lg shadow-2xl border border-gray-700 p-6 md:p-8 lg:p-10 w-full max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 sm:mb-6 text-center tracking-wide">Register Your Event Property</h1>
        <p className="text-gray-400 text-base sm:text-lg mb-8 sm:mb-10 text-center">Showcase your amazing space to event planners and individuals looking for the perfect venue.</p>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-5 sm:gap-y-6">
          <div className="md:col-span-2 border-b border-gray-600 pb-3 sm:pb-4 mb-3 sm:mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Property Details</h2>
          </div>
          <div>
            <label htmlFor="name" className="block text-gray-300 text-sm sm:text-base font-semibold mb-1 sm:mb-2">Property Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="shadow-sm appearance-none border border-gray-600 rounded-lg w-full py-2.5 px-3 sm:py-3 sm:px-4 bg-gray-800 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm sm:text-base"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-gray-300 text-sm sm:text-base font-semibold mb-1 sm:mb-2">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="5"
              className="shadow-sm appearance-none border border-gray-600 rounded-lg w-full py-2.5 px-3 sm:py-3 sm:px-4 bg-gray-800 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm sm:text-base"
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="location" className="block text-gray-300 text-sm sm:text-base font-semibold mb-1 sm:mb-2">Address / Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="shadow-sm appearance-none border border-gray-600 rounded-lg w-full py-2.5 px-3 sm:py-3 sm:px-4 bg-gray-800 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label htmlFor="city" className="block text-gray-300 text-sm sm:text-base font-semibold mb-1 sm:mb-2">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="shadow-sm appearance-none border border-gray-600 rounded-lg w-full py-2.5 px-3 sm:py-3 sm:px-4 bg-gray-800 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label htmlFor="state" className="block text-gray-300 text-sm sm:text-base font-semibold mb-1 sm:mb-2">State</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="shadow-sm appearance-none border border-gray-600 rounded-lg w-full py-2.5 px-3 sm:py-3 sm:px-4 bg-gray-800 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label htmlFor="zip_code" className="block text-gray-300 text-sm sm:text-base font-semibold mb-1 sm:mb-2">Zip Code</label>
            <input
              type="text"
              id="zip_code"
              name="zip_code"
              value={formData.zip_code}
              onChange={handleInputChange}
              className="shadow-sm appearance-none border border-gray-600 rounded-lg w-full py-2.5 px-3 sm:py-3 sm:px-4 bg-gray-800 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm sm:text-base"
              required
            />
          </div>
          <div className="md:col-span-2 pt-3 sm:pt-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-2 sm:mb-3">Categories</h3>
            <div className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-1 sm:gap-y-2">
              <label className="flex items-center text-gray-400 cursor-pointer text-sm sm:text-base">
                <input
                  type="checkbox"
                  name="indoor"
                  checked={categories.indoor}
                  onChange={handleCategoryChange}
                  className="form-checkbox h-4 w-4 sm:h-5 sm:w-5 text-blue-600 bg-gray-700 border-gray-500 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-base sm:text-lg">Indoor</span>
              </label>
              <label className="flex items-center text-gray-400 cursor-pointer text-sm sm:text-base">
                <input
                  type="checkbox"
                  name="outdoor"
                  checked={categories.outdoor}
                  onChange={handleCategoryChange}
                  className="form-checkbox h-4 w-4 sm:h-5 sm:w-5 text-blue-600 bg-gray-700 border-gray-500 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-base sm:text-lg">Outdoor</span>
              </label>
              <label className="flex items-center text-gray-400 cursor-pointer text-sm sm:text-base">
                <input
                  type="checkbox"
                  name="rooftop"
                  checked={categories.rooftop}
                  onChange={handleCategoryChange}
                  className="form-checkbox h-4 w-4 sm:h-5 sm:w-5 text-blue-600 bg-gray-700 border-gray-500 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-base sm:text-lg">Rooftop</span>
              </label>
            </div>
          </div>
          <div>
            <label htmlFor="price_per_hour" className="block text-gray-300 text-sm sm:text-base font-semibold mb-1 sm:mb-2">Price Per Hour (Rs.)</label>
            <input
              type="number"
              id="price_per_hour"
              name="price_per_hour"
              value={formData.price_per_hour}
              onChange={handleInputChange}
              min="0"
              className="shadow-sm appearance-none border border-gray-600 rounded-lg w-full py-2.5 px-3 sm:py-3 sm:px-4 bg-gray-800 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label htmlFor="capacity" className="block text-gray-300 text-sm sm:text-base font-semibold mb-1 sm:mb-2">Max Capacity</label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              min="1"
              className="shadow-sm appearance-none border border-gray-600 rounded-lg w-full py-2.5 px-3 sm:py-3 sm:px-4 bg-gray-800 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm sm:text-base"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="images" className="block text-gray-300 text-sm sm:text-base font-semibold mb-1 sm:mb-2">Property Images (Select multiple)</label>
            <input
              type="file"
              id="images"
              name="images"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-400
                       file:mr-3 file:py-1.5 file:px-3 sm:file:mr-4 sm:file:py-2 sm:file:px-4
                       file:rounded-full file:border-0
                       file:text-xs sm:file:text-sm file:font-semibold
                       file:bg-blue-500 file:text-white
                       hover:file:bg-blue-600 transition duration-200
                       border border-gray-600 rounded-lg py-1.5 px-2 sm:py-2 sm:px-3 bg-gray-800"
            />
            {formData.images.length > 0 && (
              <p className="text-gray-500 text-xs mt-1 sm:mt-2">Selected {formData.images.length} file(s).</p>
            )}
            {imagePreviews.length > 0 && (
              <div className="mt-3 sm:mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {imagePreviews.map((src, index) => (
                  <div key={index} className="relative w-full h-24 sm:h-32 rounded-lg overflow-hidden border border-gray-600 shadow-md">
                    <img
                      src={src}
                      alt={`Property preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="md:col-span-2 mt-3 sm:mt-4 border-b border-gray-600 pb-3 sm:pb-4 mb-3 sm:mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Contact Information</h2>
          </div>
          <div>
            <label htmlFor="contact_name" className="block text-gray-300 text-sm sm:text-base font-semibold mb-1 sm:mb-2">Contact Person Name</label>
            <input
              type="text"
              id="contact_name"
              name="contact_name"
              value={formData.contact_name}
              onChange={handleInputChange}
              className="shadow-sm appearance-none border border-gray-600 rounded-lg w-full py-2.5 px-3 sm:py-3 sm:px-4 bg-gray-800 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label htmlFor="contact_email" className="block text-gray-300 text-sm sm:text-base font-semibold mb-1 sm:mb-2">Contact Email</label>
            <input
              type="email"
              id="contact_email"
              name="contact_email"
              value={formData.contact_email}
              onChange={handleInputChange}
              className="shadow-sm appearance-none border border-gray-600 rounded-lg w-full py-2.5 px-3 sm:py-3 sm:px-4 bg-gray-800 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label htmlFor="contact_phone" className="block text-gray-300 text-sm sm:text-base font-semibold mb-1 sm:mb-2">Contact Phone</label>
            <input
              type="tel"
              id="contact_phone"
              name="contact_phone"
              value={formData.contact_phone}
              onChange={handleInputChange}
              className="shadow-sm appearance-none border border-gray-600 rounded-lg w-full py-2.5 px-3 sm:py-3 sm:px-4 bg-gray-800 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm sm:text-base"
              required
            />
          </div>
          <div className="md:col-span-2 text-center mt-6 sm:mt-8">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 sm:py-3 sm:px-8 rounded-full focus:outline-none focus:shadow-outline transform transition duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </div>
              ) : (
                'Register Property'
              )}
            </button>
          </div>
        </form>
      </div>
      {showSuccessModal && (
        <SuccessConfirmationModal
          onClose={handleCloseSuccessModal}
          // onNavigate={handleNavigateToListings}
        />
      )}
    </div>
  );
};

export default RegisterPropertyPage;