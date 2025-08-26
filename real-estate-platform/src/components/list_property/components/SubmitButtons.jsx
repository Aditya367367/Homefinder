import React from "react";

const SubmitButtons = ({ onPreview, onSubmit, isSubmitting }) => ( 
  <div className="flex gap-4 justify-end mt-8">
    <button
      type="button" 
      className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-700 transition"
      onClick={onPreview}
      disabled={isSubmitting} 
    >
      Preview
    </button>
    <button
      type="button"
      className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition"
      onClick={onSubmit} 
      disabled={isSubmitting} 
    >
      {isSubmitting ? "Submitting..." : "Submit Property"}
    </button>
  </div>
);

export default SubmitButtons;