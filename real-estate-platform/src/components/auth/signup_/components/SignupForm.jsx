import React, { useState } from "react";
import { useSignupService } from "../../services/signup.service";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState(null); // success or error message
  const [messageType, setMessageType] = useState("success"); // 'success' or 'error'

  const navigate = useNavigate();
  const { signup, isLoading } = useSignupService();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match.");
      setMessageType("error");
      return;
    }

    signup(
      { name, email, password },
      {
        onSuccess: () => {
          setMessage("Account created successfully! Redirecting...");
          setMessageType("success");
          setTimeout(() => navigate("/login"), 1500);
        },
        onError: (error) => {
          const errorMsg =
            error?.response?.data?.detail ||
            Object.values(error?.response?.data || {}).flat().join(" ") ||
            "Something went wrong. Please try again.";
          setMessage(`❌ ${errorMsg}`);
          setMessageType("error");
        },
      }
    );
  };

  return (
    <div className="">
      

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
          <label className="block text-sm mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Cateshwar"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-[#2c2f34] border border-gray-700 text-sm outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-[#2c2f34] border border-gray-700 text-sm outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-[#2c2f34] border border-gray-700 text-sm outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-[#2c2f34] border border-gray-700 text-sm outline-none focus:border-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-md font-medium transition"
        >
          {isLoading ? "Signing up..." : "Signup"}
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
