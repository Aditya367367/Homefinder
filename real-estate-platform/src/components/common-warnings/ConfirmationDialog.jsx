import React from 'react';
import { XCircle, AlertTriangle } from 'lucide-react';

const ConfirmationDialog = ({
  message,
  onConfirm,
  onCancel,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  isDestructive = false, 
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-[100] flex items-center justify-center p-4">
      <div className="bg-[#1f2227] border border-gray-700 rounded-lg shadow-xl p-6 max-w-sm w-full relative">
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          aria-label="Close"
        >
          <XCircle size={20} />
        </button>
        <div className="text-center mb-4">
          <AlertTriangle size={32} className="text-yellow-400 mx-auto mb-3" />
          <h5 className="font-semibold text-white text-lg">Confirm Action</h5>
          <p className="text-gray-300 text-sm mt-2">{message}</p>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md border border-gray-600 text-gray-300 hover:bg-gray-700 transition"
          >
            {cancelButtonText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-md text-white transition ${
              isDestructive ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;