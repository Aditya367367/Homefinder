import React, { useState, useEffect } from "react";
import { useParams,  Link } from "react-router-dom";
import { usePasswordResetConfirmService } from "../../services/passwordResetConfirm.services"; 

const ResetPasswordConfirmForm = () => {
  const { uidb64, token } = useParams();
 
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  
  
  const { 
    handlePasswordResetConfirm, 
    isLoading, 
    isSuccess, 
    isError, 
    error 
  } = usePasswordResetConfirmService();

  
  const [isValidToken, setIsValidToken] = useState(true);
  const [displayMessage, setDisplayMessage] = useState(null);
  const [displayMessageType, setDisplayMessageType] = useState("success");


  useEffect(() => {
    
    if (isSuccess) {
      setDisplayMessage("✅ Password reset successful! You can now log in with your new password.");
      setDisplayMessageType("success");
      setNewPassword("");
      setConfirmNewPassword("");
     
    }

   
    if (isError) {
      const backendError = error?.response?.data;
      let errorMessage = "Failed to reset password. The link might be invalid or expired.";

      if (backendError) {
        if (backendError.detail) {
          errorMessage = backendError.detail;
        } else if (backendError.new_password && backendError.new_password.length > 0) {
          errorMessage = backendError.new_password[0];
        } else if (backendError.uid || backendError.token) {
          errorMessage = "The password reset link is invalid or has expired. Please request a new one.";
          setIsValidToken(false); 
        } else if (typeof backendError === 'object') {
          errorMessage = Object.values(backendError).flat().join(" ");
        }
      }
      setDisplayMessage(`❌ ${errorMessage}`);
      setDisplayMessageType("error");
    }
  }, [isSuccess, isError, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisplayMessage(null); 
    setDisplayMessageType("success");

    if (!newPassword || !confirmNewPassword) {
      setDisplayMessage("❌ Please fill in both password fields.");
      setDisplayMessageType("error");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setDisplayMessage("❌ Passwords do not match.");
      setDisplayMessageType("error");
      return;
    }

   
    handlePasswordResetConfirm({ uidb64, token, newPassword, confirmNewPassword });
  };

  return (
    <div className="max-w-md w-full mx-auto bg-[#1a1d21] p-6 rounded-lg shadow-lg text-white mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>

     
      {displayMessage && (
        <div
          className={`text-sm rounded-md px-4 py-3 mb-4 ${
            displayMessageType === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {displayMessage}
        </div>
      )}

      {isValidToken ? (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="newPassword" className="block text-sm mb-1">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 rounded-md bg-[#2c2f34] border border-gray-700 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="confirmNewPassword" className="block text-sm mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 rounded-md bg-[#2c2f34] border border-gray-700 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading} 
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-md font-medium transition"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      ) : (
        <div className="text-center mt-6">
          <p className="text-red-400 mb-4">
            The password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link to="/forgot-password" className="text-blue-400 hover:underline">
            Request New Password Reset Link
          </Link>
        </div>
      )}

      <div className="text-center mt-4 text-sm">
        <Link to="/login" className="text-blue-400 hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ResetPasswordConfirmForm;