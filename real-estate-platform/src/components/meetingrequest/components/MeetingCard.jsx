import React from "react";
import { useUpdateMeetingStatus } from "../services/UpdateMeetingStatus.services";
import { toast } from "react-toastify";

const MeetingCard = ({ id, title, date, status, image }) => {
  const {
    updateMeetingStatus,
    isUpdatingMeetingStatus,
    isMeetingStatusUpdated,
    updateMeetingStatusError,
  } = useUpdateMeetingStatus();

  const handleAccept = () => {
    updateMeetingStatus({ id, status: "Accepted" });
  };

  
  if (isMeetingStatusUpdated) {
    toast.success("Meeting accepted successfully!");
  }
  if (updateMeetingStatusError) {
    toast.error("Failed to accept meeting.");
  }

  return (
    <div className="flex flex-col sm:flex-row items-start justify-between bg-[#1f2227] p-4 rounded-lg shadow-md gap-4">
      <div className="flex-1">
        <p className="text-sm text-gray-400 mb-1">{status}</p>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-500 mb-3">Scheduled: {date}</p>
        {status === "Pending" && (
          <button
            onClick={handleAccept}
            disabled={isUpdatingMeetingStatus}
            className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded-md transition disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isUpdatingMeetingStatus ? "Accepting..." : "Accept ✔"}
          </button>
        )}
      </div>
      <img
        src={image}
        alt={title}
        className="w-full sm:w-64 h-40 object-cover rounded-md"
        loading="lazy"
      />
    </div>
  );
};

export default MeetingCard;