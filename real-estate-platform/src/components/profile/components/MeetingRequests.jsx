import React, { useEffect, useState } from "react";
import { useUpdateMeetingStatus } from "../../meetingrequest/services/UpdateMeetingStatus.services";
import { useUserService } from "../../auth/services/user.services";
import { toast } from "react-toastify";

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "accepted":
      return "bg-green-600 text-white";
    case "pending":
      return "bg-yellow-500 text-black";
    case "completed":
    case "fulfilled":
      return "bg-gray-500 text-white";
    case "rejected":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-400 text-white";
  }
};

const ConfirmationModal = ({ meeting, newStatus, onClose, onConfirm }) => {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown === 0) {
      onConfirm({ id: meeting.id, status: newStatus });
      onClose();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, meeting.id, newStatus, onConfirm, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-[#1f2227] rounded-lg p-6 w-full max-w-sm shadow-xl border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">Confirm Action</h3>
        <p className="text-gray-300 mb-2">
          Are you sure you want to change the status of the meeting for{" "}
          <span className="font-bold">{meeting.property?.title || "Untitled Property"}</span> to{" "}
          <span className="font-bold capitalize">{newStatus}</span>?
        </p>
        <p className="text-gray-300 mb-4">
          This action will be automatically confirmed in{" "}
          <span className="font-bold text-lg text-blue-400">{countdown}</span> seconds.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm({ id: meeting.id, status: newStatus });
              onClose();
            }}
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Confirm Now
          </button>
        </div>
      </div>
    </div>
  );
};

const MeetingRequests = ({ meetings, isLoading, isError, error }) => {
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [confirmationDetails, setConfirmationDetails] = useState(null);
  const {
    updateMeetingStatus,
    isMeetingStatusUpdated,
    isUpdateMeetingStatusError,
    updateMeetingStatusError,
  } = useUpdateMeetingStatus();
  const { isLoading: userLoading } = useUserService();

  useEffect(() => {
    if (isMeetingStatusUpdated) {
      toast.success("Meeting status updated successfully!");
    }
  }, [isMeetingStatusUpdated]);

  useEffect(() => {
    if (isUpdateMeetingStatusError) {
      const errorMessage =
        updateMeetingStatusError?.response?.data?.detail ||
        "Failed to update meeting status.";
      toast.error(errorMessage);
    }
  }, [isUpdateMeetingStatusError, updateMeetingStatusError]);

  const handleStatusUpdateInitiate = (meeting, newStatus) => {
    setConfirmationDetails({ meeting, newStatus });
  };

  const renderSkeleton = () => (
    <div className="grid gap-4 sm:grid-cols-2">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className="bg-[#1f2227] p-4 rounded-lg shadow-md border border-gray-700 animate-pulse"
        >
          <div className="flex justify-between items-center mb-2">
            <div className="h-4 bg-gray-600 rounded w-3/4"></div>
            <div className="h-4 bg-gray-600 rounded w-1/4"></div>
          </div>
          <div className="h-3 bg-gray-600 rounded w-1/2 mb-1"></div>
          <div className="h-3 bg-gray-600 rounded w-2/3 mb-3"></div>
          <div className="h-8 bg-gray-600 rounded-md w-1/3"></div>
        </div>
      ))}
    </div>
  );

  if (userLoading || isLoading) {
    return (
      <div className="mb-10 relative z-10">
        <h2 className="text-lg font-semibold mb-4 text-white">
          Meeting Requests for Your Properties
        </h2>
        {renderSkeleton()}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mb-10 relative z-10">
        <h2 className="text-lg font-semibold mb-4 text-white">
          Meeting Requests for Your Properties
        </h2>
        <p className="text-red-500">
          Failed to load meeting requests: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="mb-10 relative z-10">
      <h2 className="text-lg font-semibold mb-4 text-white">
        Meeting Requests for Your Properties
      </h2>
      {meetings?.length === 0 ? (
        <p className="text-gray-500">No meeting requests for your properties.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {meetings?.map((m) => (
            <div
              key={m.id}
              className="bg-[#1f2227] p-4 rounded-lg shadow-md hover:shadow-lg transition border border-gray-700"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-white text-base">
                  {m.property?.title || "Untitled Property"}
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
                Requested by: {m.requester_name || m.requester_email || "N/A"}
              </p>
              <p className="text-gray-400 text-sm mb-3">
                Requested at: {new Date(m.requested_at).toLocaleString()}
              </p>
              <button
                onClick={() => setSelectedMeeting(m)}
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 transition rounded-md text-white"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedMeeting && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-[#1f2227] rounded-lg p-6 w-full max-w-md shadow-xl border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-2">
              Meeting for: {selectedMeeting.property?.title}
            </h2>
            <p className="text-sm text-gray-400 mb-1">
              <span className="font-medium">Requested by:</span>{" "}
              {selectedMeeting.requester_name ||
                selectedMeeting.requester_email ||
                "N/A"}
            </p>
            <p className="text-sm text-gray-400 mb-1">
              <span className="font-medium">Status:</span>{" "}
              <span className={getStatusColor(selectedMeeting.status)}>
                {selectedMeeting.status}
              </span>
            </p>
            <p className="text-sm text-gray-400 mb-1">
              <span className="font-medium">Proposed Time:</span>{" "}
              {new Date(selectedMeeting.proposed_time_slot).toLocaleString()}
            </p>
            <p className="text-sm text-gray-400 mb-3">
              <span className="font-medium">Purpose:</span>{" "}
              {selectedMeeting.meeting_purpose}
            </p>

            {selectedMeeting.status === "pending" && (
              <div className="mt-4 flex justify-between gap-2">
                <button
                  onClick={() =>
                    handleStatusUpdateInitiate(selectedMeeting, "accepted")
                  }
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm flex-1"
                >
                  Accept
                </button>
                <button
                  onClick={() =>
                    handleStatusUpdateInitiate(selectedMeeting, "rejected")
                  }
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm flex-1"
                >
                  Reject
                </button>
              </div>
            )}
            {selectedMeeting.status === "accepted" && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() =>
                    handleStatusUpdateInitiate(selectedMeeting, "completed")
                  }
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm w-full"
                >
                  Mark Completed
                </button>
              </div>
            )}

            <button
              onClick={() => setSelectedMeeting(null)}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {confirmationDetails && (
        <ConfirmationModal
          meeting={confirmationDetails.meeting}
          newStatus={confirmationDetails.newStatus}
          onClose={() => setConfirmationDetails(null)}
          onConfirm={updateMeetingStatus}
        />
      )}
    </div>
  );
};

export default MeetingRequests;