import React from "react";

const tabs = ["All", "Pending", "Accepted", "Completed"];

const MeetingTabs = ({ active, onChange }) => {
  return (
    <div className="flex space-x-6 border-b border-gray-700 mb-2 overflow-x-auto mt-[70px]">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`pb-2 text-sm font-medium ${
            active === tab
              ? "text-white border-b-2 border-white"
              : "text-gray-400"
          }`}
          onClick={() => onChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default MeetingTabs;
