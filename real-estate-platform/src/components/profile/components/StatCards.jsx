import React from "react";

const StatCards = ({ totalListings = 0, activeListings = 0, meetingCount = 0, savedCount = 0 }) => {
  const stats = [
    { label: "Total Listings", value: totalListings },
    { label: "Active Properties", value: activeListings },
    { label: "Meeting Requests", value: meetingCount },
    { label: "Saved Properties", value: savedCount },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      {stats.map(({ label, value }, idx) => (
        <div
          key={idx}
          className="border border-gray-700 rounded-lg p-4 text-center"
        >
          <p className="text-2xl font-semibold">{value}</p>
          <p className="text-sm text-gray-400">{label}</p>
        </div>
      ))}
    </div>
  );
};

export default StatCards;