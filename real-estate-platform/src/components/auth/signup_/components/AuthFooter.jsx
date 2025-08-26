import React from "react";
import { Link } from "react-router-dom";

const AuthFooter = ({ type }) => {
  return (
    <p className="text-sm text-center text-gray-400 mt-4">
      {type === "signup" ? (
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </>
      ) : (
        <>
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Signup
          </Link>
        </>
      )}
    </p>
  );
};

export default AuthFooter;
