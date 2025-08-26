import React from "react";

const PropertyDetailsSection = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="mb-8 space-y-4">
      <h2 className="font-semibold text-lg text-white">Details</h2>
      <input
        name="bedrooms"
        value={formData.bedrooms}
        onChange={handleChange}
        placeholder="Bedrooms"
        className="w-full bg-[#1f2227] p-3 rounded-md text-white"
      />
      <input
        name="bathrooms"
        value={formData.bathrooms}
        onChange={handleChange}
        placeholder="Bathrooms"
        className="w-full bg-[#1f2227] p-3 rounded-md text-white"
      />
      <input
        name="area"
        value={formData.area}
        onChange={handleChange}
        placeholder="Area (sq ft)"
        className="w-full bg-[#1f2227] p-3 rounded-md text-white"
      />
    </div>
  );
};

export default PropertyDetailsSection;
