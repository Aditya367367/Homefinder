import React, { useEffect } from "react";

const AdminRedirect = () => {
  useEffect(() => {
    const adminUrl = "process.env.REACT_APP_MEDIA_URL/admin"; 
    if (adminUrl) {
      window.location.href = adminUrl; 
    } else {
      alert("Admin URL is not configured.");
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <p>Redirecting to admin panel...</p>
    </div>
  );
};

export default AdminRedirect;
