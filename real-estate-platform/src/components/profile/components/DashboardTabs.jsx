import React from "react";
import { LogOut } from "lucide-react";
import { useLogoutService } from "../../auth/services/logut.services"; 

const tabs = [
  "My Listings",
  "Saved Properties",
  "Meeting Requests",
  "Profile Settings",
  "Logout",
];

const DashboardTabs = ({ activeTab, setActiveTab }) => {
  const { handleLogout, isLoading } = useLogoutService();

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {tabs.map((tab, index) => (
        <button
          key={tab}
          onClick={() => {
            if (tab === "Logout") {
              handleLogout(); 
            } else {
              setActiveTab(tab);
            }
          }}
          className={`px-4 py-2 rounded-md text-sm flex items-center gap-2 transition-all duration-300 ease-in-out 
            ${
              activeTab === tab
                ? "bg-blue-600 text-white shadow-md scale-[1.03]"
                : "bg-[#1f2227] text-gray-400 hover:bg-[#2a2d33] hover:text-white"
            }`}
          style={{ transitionDelay: `${index * 50}ms` }}
          disabled={isLoading && tab === "Logout"} 
        >
          {tab === "Logout" ? (
            <>
              <LogOut size={16} />
              {isLoading ? "Logging out..." : tab}
            </>
          ) : (
            tab
          )}
        </button>
      ))}
    </div>
  );
};

export default DashboardTabs;
