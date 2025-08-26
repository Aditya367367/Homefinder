import React from "react";

const ContactInfoSection = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="mb-8">
      <h2 className="font-semibold text-lg mb-2 text-white">Contact Info</h2>
      
      <input
        name="contact_name"
        value={formData.contact_name || ""}
        onChange={handleChange}
        className="w-full mb-3 bg-[#1f2227] p-3 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
        placeholder="Name"
      />

      <input
        name="contact_phone"
        value={formData.contact_phone || ""}
        onChange={handleChange}
        className="w-full mb-3 bg-[#1f2227] p-3 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
        placeholder="Phone"
      />

      <input
        name="contact_email"
        value={formData.contact_email || ""}
        onChange={handleChange}
        className="w-full bg-[#1f2227] p-3 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
        placeholder="Email"
      />
    </div>
  );
};

export default ContactInfoSection;
