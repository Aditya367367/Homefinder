import React from "react";

const SuccessModal = ({ title, message, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl p-6 w-[350px] shadow-lg text-center">
        <h2 className="text-2xl font-bold text-green-600">{title}</h2>
        <p className="mt-3 text-gray-600">{message}</p>
        <button
          onClick={onClose}
          className="mt-5 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
