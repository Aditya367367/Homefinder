import React from "react";
import SignupForm from "./components/SignupForm";
import SocialLogin from "./components/SocialLogin"; 
import AuthFooter from "./components/AuthFooter";

const SignupPage = () => {
  return (
    <div className="min-h-screen bg-[#0f1115] flex items-center justify-center px-4 mt-10">
      <div className="w-full max-w-md bg-[#1a1d21] text-white p-8 rounded-xl shadow-md space-y-6">
        <h2 className="text-2xl font-semibold text-center">Create Your Account</h2>
        <SignupForm />
        <SocialLogin />
        <AuthFooter type="signup" />
      </div>
    </div>
  );
};

export default SignupPage;
