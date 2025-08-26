import React from "react";

const BasicInfoSection = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleButtonSelect = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="mb-10 space-y-6">
      <h2 className="text-lg font-semibold text-white">Basic Info</h2>

      <div className="space-y-4">
        <input
          type="text"
          name="title"
          value={formData.title || ""}
          onChange={handleChange}
          className="w-full bg-[#1f2227] p-3 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Property Title"
        />
        <input
          type="text"
          name="location"
          value={formData.location || ""}
          onChange={handleChange}
          className="w-full bg-[#1f2227] p-3 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Location"
        />
        <input
          type="number"
          name="price"
          value={formData.price || ""}
          onChange={handleChange}
          className="w-full bg-[#1f2227] p-3 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Price"
        />
      </div>

      {/* Property Type Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {["Buy", "Rent"].map((type) => (
          <button
            key={type}
            type="button"
            className={`w-full py-2 rounded-md transition text-sm ${
              formData.type === type
                ? "bg-blue-600 text-white"
                : "bg-[#1f2227] text-gray-300 hover:bg-[#2a2d33]"
            }`}
            onClick={() => handleButtonSelect("type", type)}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {["Furnished", "Unfurnished"].map((furnish) => (
          <button
            key={furnish}
            type="button"
            className={`w-full py-2 rounded-md transition text-sm ${
              formData.furnished === furnish
                ? "bg-blue-600 text-white"
                : "bg-[#1f2227] text-gray-300 hover:bg-[#2a2d33]"
            }`}
            onClick={() => handleButtonSelect("furnished", furnish)}
          >
            {furnish}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {["Flat", "Villa", "Apartment"].map((ptype) => (
          <button
            key={ptype}
            type="button"
            className={`w-full py-2 rounded-md transition text-sm ${
              formData.property_type === ptype
                ? "bg-blue-600 text-white"
                : "bg-[#1f2227] text-gray-300 hover:bg-[#2a2d33]"
            }`}
            onClick={() => handleButtonSelect("property_type", ptype)}
          >
            {ptype}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BasicInfoSection;
