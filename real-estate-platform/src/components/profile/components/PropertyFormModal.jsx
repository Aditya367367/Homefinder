import React, { useState, useEffect } from "react";

const PropertyFormModal = ({ property, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    status: "Active",
  });

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || "",
        location: property.location || "",
        price: property.price || "",
        status: property.status || "Active",
      });
    }
  }, [property]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
      <div className="bg-[#1f1f1f] p-6 rounded w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4 text-white">Edit Property</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full p-2 rounded bg-gray-800 text-white"
            required
          />
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full p-2 rounded bg-gray-800 text-white"
            required
          />
          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full p-2 rounded bg-gray-800 text-white"
            required
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
          >
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
          </select>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="text-gray-400">
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyFormModal;