import React from "react";

const PreviewPage = ({ formData, onEdit, onSubmit, isSubmitting }) => { 
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Preview Your Listing</h2>

      <div className="space-y-2 bg-[#1f2227] p-4 rounded-lg">
        <h3 className="text-white text-lg">{formData.title}</h3>
        <p className="text-gray-400">{formData.location}</p>
        <p className="text-blue-400 font-semibold">₹{formData.price}</p>
        <p className="text-sm text-gray-300">
          Type: {formData.type} | Furnished: {formData.furnished}
        </p>
        <p className="text-sm text-gray-300">
          {formData.bedrooms} Beds | {formData.bathrooms} Baths | {formData.area} sqft
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {formData.images.map((img, idx) => (
          <img
            key={idx}
            src={img.preview}
            alt={`Preview ${idx}`}
            className="w-full h-32 object-cover rounded-md"
          />
        ))}
      </div>

      <div className="bg-[#1f2227] p-4 rounded-lg space-y-1">
     
        <p className="text-gray-300">Contact: {formData.contact_name}</p>
        <p className="text-gray-400 text-sm">{formData.contact_phone}</p>
        <p className="text-gray-400 text-sm">{formData.contact_email}</p>
      </div>

      <div className="flex justify-end gap-4 mt-4">
        <button
          type="button"
          className="bg-gray-600 px-4 py-2 rounded-md hover:bg-gray-700 transition"
          onClick={onEdit}
          disabled={isSubmitting} 
        >
          Edit
        </button>
        <button
          type="button"
          className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition"
          onClick={onSubmit} 
          disabled={isSubmitting} 
        >
          {isSubmitting ? "Submitting..." : "Submit"} 
        </button>
      </div>
    </div>
  );
};

export default PreviewPage;