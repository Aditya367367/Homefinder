import React from "react";

const DescriptionSection = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, description: e.target.value }));
  };

  return (
    <div className="mb-8">
      <h2 className="font-semibold text-lg mb-2 text-white">Description</h2>
      <textarea
        name="description"
        rows={5}
        value={formData.description || ""}
        onChange={handleChange}
        placeholder="Write a description"
        className="w-full bg-[#1f2227] p-3 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
    </div>
  );
};

export default DescriptionSection;
