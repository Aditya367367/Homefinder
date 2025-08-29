import React, { useEffect } from "react";

const AdminRedirect = () => {
  useEffect(() => {
    const base = process.env.REACT_APP_MEDIA_URL;  
    if (base) {
      window.location.href = base + "/admin";
    } else {
      alert("Admin URL not configured.");
    }
  }, []);

  return (
    <div>
      <p>Redirecting to admin panel…</p>
    </div>
  );
};

export default AdminRedirect;
