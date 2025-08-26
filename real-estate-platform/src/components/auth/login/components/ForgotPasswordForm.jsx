import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForgotPasswordService } from "../../services/forgotPassword.services"; 
const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  

  const { 
    handleSendResetLink, 
    isLoading, 
    isSuccess, 
    isError, 
    error 
  } = useForgotPasswordService();

 
  const [localMessage, setLocalMessage] = useState(null);
  const [localMessageType, setLocalMessageType] = useState("success");

  useEffect(() => {
    if (isSuccess) {
      
      setLocalMessage("If an account with that email exists, a password reset link has been sent to your inbox. Please check your spam folder as well.");
      setLocalMessageType("success");
      setEmail("");
    }
    if (isError) {
      
      const errorData = error?.response?.data;
      let errorMessage = "Failed to send password reset request. Please try again.";

      if (errorData) {
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.email && errorData.email[0]) {
          errorMessage = errorData.email[0];
        } else if (typeof errorData === 'object') {
          errorMessage = Object.values(errorData).flat().join(" ");
        }
      }
      setLocalMessage(`❌ ${errorMessage}`);
      setLocalMessageType("error");
    }
  }, [isSuccess, isError, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalMessage(null);
    setLocalMessageType("success");

    if (!email) {
      setLocalMessage("❌ Please enter your email address.");
      setLocalMessageType("error");
      return;
    }

   
    handleSendResetLink(email);
  };

  return (
    <div className="max-w-md w-full mx-auto bg-[#1a1d21] p-6 rounded-lg shadow-lg text-white mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>

      {localMessage && (
        <div
          className={`text-sm rounded-md px-4 py-3 mb-4 ${
            localMessageType === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {localMessage}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full px-4 py-2 rounded-md bg-[#2c2f34] border border-gray-700 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-md font-medium transition"
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <div className="text-center mt-4 text-sm">
        Remember your password?{" "}
        <Link to="/login" className="text-blue-400 hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;