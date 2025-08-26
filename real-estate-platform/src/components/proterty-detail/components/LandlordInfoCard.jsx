import React, { useState, useEffect } from "react";
import { Mail, Phone, X, User } from "lucide-react";
import { useToggleSaveProperty } from "../services/ToggleSaveProperty.services";

const LandlordInfoCard = ({
  name,
  phone,
  email,
  avatar,
  isSaved: initialSaved,
  MeetingRequestForm,
  property,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(initialSaved);
  const { toggleSave, isToggling } = useToggleSaveProperty();

  useEffect(() => {
    setSaved(initialSaved); // Sync if parent data changes
  }, [initialSaved]);

  const handleToggleSave = () => {
    toggleSave(property.id, {
      onSuccess: () => {
        setSaved((prev) => !prev); // Toggle instantly
      },
    });
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === "meeting-backdrop") {
      setShowForm(false);
    }
  };

  return (
    <>
      <div className="mt-6 flex items-start gap-4 bg-[#1f1f24] p-5 rounded-xl shadow-md border border-gray-700">
        <img
          src={avatar}
          alt="Landlord Avatar"
          className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-500"
        />
        <div className="flex-1">
          <p className="text-white font-semibold text-lg flex items-center gap-1">
            <User className="w-5 h-5 text-gray-400" /> {name}
          </p>
          <p className="text-sm text-green-400 mt-0.5">Available</p>

          <p className="text-sm text-gray-300 mt-2 flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-400" /> {phone || "N/A"}
          </p>

          <p className="text-sm text-gray-300 mt-1 flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-400" /> {email || "N/A"}
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition font-medium"
            >
              Request Meeting
            </button>
            <button
              onClick={handleToggleSave}
              disabled={isToggling}
              className={`px-4 py-2 text-sm rounded-md font-medium transition border ${
                saved
                  ? "bg-red-600 hover:bg-red-700 text-white border-red-500"
                  : "bg-gray-800 hover:bg-gray-700 text-white border-gray-600"
              }`}
            >
              {saved ? "Unsave" : "Save"}
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <div
          id="meeting-backdrop"
          onClick={handleOutsideClick}
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div className="bg-[#1f2227] p-6 rounded-lg w-full max-w-lg relative shadow-lg border border-gray-700">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
              aria-label="Close Modal"
            >
              <X className="w-6 h-6" />
            </button>
            {MeetingRequestForm && <MeetingRequestForm property={property} />}
          </div>
        </div>
      )}
    </>
  );
};

export default LandlordInfoCard;
