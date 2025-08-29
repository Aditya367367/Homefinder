import React, { useEffect } from "react";
import FullScreenLoader from "../components/common-warnings/FullScreenLoader";

const AdminRedirect = () => {
  useEffect(() => {
    const base = process.env.REACT_APP_MEDIA_URL;  
    if (base) {
      window.location.href = base + "admin";
    } else {
      alert("Admin URL not configured.");
    }
  }, []);

  return (
    <div>
      <FullScreenLoader message="Redirecting to Admin Panel..." />
    </div>
  );
};

export default AdminRedirect;
