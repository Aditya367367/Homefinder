import React, { useState } from "react";
import { useFetchOwnerMeetings } from "./services/FetchOwnerMeetings.services";
import MeetingTabs from "./components/MeetingTabs";
import MeetingCard from "./components/MeetingCard";
import SortDropdown from "./components/SortDropdown";

const MeetingRequestPage = () => {
  const [activeTab, setActiveTab] = useState("All");

  const { ownerMeetings, isLoadingOwnerMeetings, isErrorOwnerMeetings, refetchOwnerMeetings } =
    useFetchOwnerMeetings();

  const filteredMeetings = (ownerMeetings || []).filter((meeting) =>
    activeTab === "All" ? true : meeting.status === activeTab
  );

  if (isErrorOwnerMeetings) {
    return (
      <div className="bg-[#0f1115] text-white min-h-screen p-4">
        <p className="text-red-400">Error fetching meetings. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0f1115] text-white min-h-screen p-4">
      <MeetingTabs active={activeTab} onChange={setActiveTab} />
      <div className="my-4">
        <SortDropdown />
      </div>
      {isLoadingOwnerMeetings ? (
        <p className="text-gray-400">Loading meetings...</p>
      ) : filteredMeetings.length > 0 ? (
        <div className="space-y-6">
          {filteredMeetings.map((meeting) => (
            <MeetingCard
              key={meeting.id}
              id={meeting.id}
              title={meeting.property.title}
              date={new Date(meeting.requested_at).toLocaleString()}
              status={meeting.status}
              image={
                meeting.property.images?.[0]?.image ||
                "https://via.placeholder.com/300x200?text=No+Image"
              }
              refetch={refetchOwnerMeetings}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No meeting requests found.</p>
      )}
    </div>
  );
};

export default MeetingRequestPage;