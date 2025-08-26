import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginService } from "../../services/login.services";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null); 
  const [messageType, setMessageType] = useState("success"); 

  const navigate = useNavigate();
  const { login, isLoading } = useLoginService();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("❌ Please fill in all fields.");
      setMessageType("error");
      return;
    }

    login(
      { email, password },
      {
        onSuccess: () => {
          setMessage("Login successful! Redirecting...");
          setMessageType("success");
          setTimeout(() => navigate("/"), 1000); 
        },
        onError: (error) => {
          const errorMsg =
            error?.response?.data?.detail ||
            Object.values(error?.response?.data || {}).flat().join(" ") ||
            "Login failed. Please try again.";
          setMessage(`❌ ${errorMsg}`);
          setMessageType("error");
        },
      }
    );
  };

  return (
    <div className="max-w-md w-full mx-auto bg-[#1a1d21] p-6 rounded-lg shadow-lg text-white mt-10 ">
  

      {message && (
        <div
          className={`text-sm rounded-md px-4 py-3 mb-4 ${
            messageType === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {message}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full px-4 py-2 rounded-md bg-[#2c2f34] border border-gray-700 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-4 py-2 rounded-md bg-[#2c2f34] border border-gray-700 text-sm outline-none focus:border-blue-500"
          />
          <div className="text-right text-sm mt-1">
            <Link to="/forgot-password" className="text-blue-400 hover:underline">
              Forgot Password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-md font-medium transition"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="text-center mt-4 text-sm">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-blue-400 hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
