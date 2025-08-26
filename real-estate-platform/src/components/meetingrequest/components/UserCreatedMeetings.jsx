import React from "react";
import { useFetchUserCreatedMeetings } from "../services/FetchUserCreatedMeetings.services";
import { useUserService } from "../../auth/services/user.services";
import { toast } from "react-toastify";

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "accepted":
      return "bg-green-600 text-white";
    case "pending":
      return "bg-yellow-500 text-black";
    case "completed":
      return "bg-gray-500 text-white";
    case "rejected":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-400 text-white";
  }
};

const UserCreatedMeetings = () => {
  const user = useUserService();

  const {
    userCreatedMeetings,
    isLoadingUserCreatedMeetings,
    isErrorUserCreatedMeetings,
    errorUserCreatedMeetings,
  } = useFetchUserCreatedMeetings(user?.id); 

  if (isErrorUserCreatedMeetings) {
    console.error("Failed to fetch user's created meetings:", errorUserCreatedMeetings);
    toast.error("Failed to load your meeting requests.");
    return (
      <div className="mb-10 relative z-10">
        <h2 className="text-lg font-semibold mb-4 text-white">Your Sent Meeting Requests</h2>
        <p className="text-red-400">Error loading your meeting requests.</p>
      </div>
    );
    }

  return (
    <div className="mb-10 relative z-10">
      <h2 className="text-lg font-semibold mb-4 text-white">Your Sent Meeting Requests</h2>

      {isLoadingUserCreatedMeetings ? (
        <p className="text-gray-400">Loading your requests...</p>
      ) : userCreatedMeetings?.length === 0 ? (
        <p className="text-gray-500">You haven't sent any meeting requests yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {userCreatedMeetings?.map((m) => (
            <div
              key={m.id}
              className="bg-[#1f2227] p-4 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-white text-base">
                  Meeting for: {m.property?.title || "Untitled Property"}
                </h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
                    m.status
                  )}`}
                >
                  {m.status}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-1">
                Property Owner: {m.property?.user_name || m.property?.user_email || 'N/A'}
              </p>
              <p className="text-gray-400 text-sm mb-1">
                Proposed Time: {new Date(m.proposed_time_slot).toLocaleString()}
              </p>
              <p className="text-gray-400 text-sm mb-3">
                Requested on: {new Date(m.requested_at).toLocaleString()}
              </p>
              <p className="text-gray-300 text-sm">
                Purpose: {m.meeting_purpose}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserCreatedMeetings;