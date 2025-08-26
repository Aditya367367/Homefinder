import React, { useState, useEffect } from "react";

const EventPlaceFormModal = ({ eventPlace, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    price_per_hour: "",
    category: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    capacity: "",
    is_available_now: true, // Default initial value
    status: "active",       // Default initial value
  });

  useEffect(() => {
    if (eventPlace) {
      setFormData({
        name: eventPlace.name || "",
        location: eventPlace.location || "",
        description: eventPlace.description || "",
        price_per_hour: eventPlace.price_per_hour || "",
        category: eventPlace.category || "",
        contact_name: eventPlace.contact_name || "",
        contact_email: eventPlace.contact_email || "",
        contact_phone: eventPlace.contact_phone || "",
        capacity: eventPlace.capacity || "",
        
        is_available_now: eventPlace.is_available_now ?? true,
        
        status: eventPlace.status ? eventPlace.status.toLowerCase() : "active",
      });
    }
  }, [eventPlace]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      const newFormData = { ...prev };

      if (type === "checkbox" && name === "is_available_now") {
        newFormData.is_available_now = checked;
        // ABBREVIATION / BUSINESS LOGIC:
        // If 'Available Now' is checked, set status to 'active'.
        // If 'Available Now' is unchecked, set status to 'inactive'.
        newFormData.status = checked ? "active" : "inactive";

      } else if (name === "status") {
        newFormData.status = value.toLowerCase();
      } else {
        newFormData[name] = value;
      }

      return newFormData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      status: formData.status.toLowerCase(),
    };
    onSave(dataToSave);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 no-scrollbar"> 
      <div className="bg-[#1e2025] p-6 rounded-lg shadow-xl max-w-lg w-full relative z-50 overflow-hidden">
        <h3 className="text-xl font-bold text-white mb-4">Edit Event Space</h3>
        <div className="overflow-y-auto max-h-[80vh] scrollbar-hide">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-300 text-sm font-bold mb-1">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-gray-300 text-sm font-bold mb-1">Location:</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-gray-300 text-sm font-bold mb-1">Description:</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <div>
              <label htmlFor="price_per_hour" className="block text-gray-300 text-sm font-bold mb-1">Price per Hour (₹):</label>
              <input
                type="number"
                id="price_per_hour"
                name="price_per_hour"
                value={formData.price_per_hour}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-gray-300 text-sm font-bold mb-1">Category:</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="contact_name" className="block text-gray-300 text-sm font-bold mb-1">Contact Name:</label>
              <input
                type="text"
                id="contact_name"
                name="contact_name"
                value={formData.contact_name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="contact_email" className="block text-gray-300 text-sm font-bold mb-1">Contact Email:</label>
              <input
                type="email"
                id="contact_email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="contact_phone" className="block text-gray-300 text-sm font-bold mb-1">Contact Phone:</label>
              <input
                type="tel"
                id="contact_phone"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="capacity" className="block text-gray-300 text-sm font-bold mb-1">Capacity:</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* The status dropdown is now commented out as per your previous intention to control it via is_available_now */}
            {/* <div>
              <label htmlFor="status" className="block text-gray-300 text-sm font-bold mb-1">Status:</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="active">Active</option>
                <option value="pending">Pending Review</option>
                <option value="inactive">Inactive</option>
              </select>
            </div> */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_available_now"
                name="is_available_now"
                checked={formData.is_available_now}
                onChange={handleChange}
                className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out bg-gray-700 border-gray-600 rounded"
              />
              <abbr title="Toggle to change status between Active and Inactive."> 
                <label htmlFor="is_available_now" className="ml-2 text-gray-300 text-sm font-bold">Available Now</label>
              </abbr>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventPlaceFormModal;