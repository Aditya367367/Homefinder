import React from "react";
import { User } from "lucide-react";
import { useUserService } from "../../auth/services/user.services"; 

const DashboardHeader = () => {
  const { user, isLoading } = useUserService();

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-full">
          <User className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {isLoading ? "Loading..." : `Welcome, ${user?.name || "User"}`}
          </h1>
          <p className="text-sm text-gray-400">{user?.user_type || "landlord"}</p> 
        </div>
      </div>
    </div>  
  );
};

export default DashboardHeader;
