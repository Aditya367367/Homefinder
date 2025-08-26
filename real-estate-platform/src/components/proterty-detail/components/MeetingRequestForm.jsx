import React, { useState } from "react";
import { useRequestMeeting } from "../../meetingrequest/services/RequestMeeting.services";
import { useUserService } from "../../auth/services/user.services";
import { toast } from "react-toastify";

const SuccessCard = () => (
  <div className="bg-green-600 text-white p-4 rounded-md text-center my-4">
    <h2 className="text-lg font-semibold">Meeting Request Sent!</h2>
    <p>We'll notify the property owner of your request.</p>
  </div>
);

const MeetingRequestForm = ({ property }) => {
  const [form, setForm] = useState({
    proposed_time_slot: "",
    meeting_purpose: "",
  });
  const user = useUserService();
  
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("error");

  const {
    requestMeeting,
    isRequestingMeeting,
    isMeetingRequested,
  } = useRequestMeeting();

  const isOwnProperty = user?.id === property?.user;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(null); 
    requestMeeting(
      { propertyId: property.id, data: form },
      {
        onSuccess: () => {
          toast.success("Meeting request sent!");
        },
        onError: (error) => {
          console.error("Error sending meeting request:", error);

          const errorMsg =
           
            (Array.isArray(error.response?.data?.detail) ? error.response.data.detail[0] : error.response?.data?.detail) ||
            
            Object.values(error.response?.data || {}).flat().join(" ") ||
            "An unexpected error occurred.";

          setMessage(errorMsg);
          setMessageType("error");
          toast.error(errorMsg);
        },
      }
    );
  };
  
  if (isOwnProperty) {
    return (
      <div className="bg-red-600 text-white p-4 rounded-md my-4">
        <p className="font-semibold">You are the owner of this property.</p>
        <p>You cannot send a meeting request to your own listing.</p>
      </div>
    );
  }

  if (isMeetingRequested) {
    return <SuccessCard />;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#1f2227] p-4 rounded-md text-white space-y-4 mt-4">
      {message && (
        <div
          className={`text-sm rounded-md px-4 py-3 mb-4 ${
            messageType === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {message}
        </div>
      )}
      <div>
        <label htmlFor="proposed_time_slot" className="block mb-1">Meeting Date & Time</label>
        <input
          type="datetime-local"
          id="proposed_time_slot"
          name="proposed_time_slot"
          value={form.proposed_time_slot}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 rounded bg-[#2a2e35] text-white"
        />
      </div>
      <div>
        <label htmlFor="meeting_purpose" className="block mb-1">Purpose of Meeting</label>
        <textarea
          id="meeting_purpose"
          name="meeting_purpose"
          value={form.meeting_purpose}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 rounded bg-[#2a2e35] text-white"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white disabled:opacity-60"
        disabled={isRequestingMeeting}
      >
        {isRequestingMeeting ? "Sending..." : "Request Meeting"}
      </button>
    </form>
  );
};

export default MeetingRequestForm;