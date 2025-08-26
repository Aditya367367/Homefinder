import React from "react";
import { Link } from "react-router-dom";
import Logo1 from "../../../assets/logo.png";

const Logo = () => (
  <Link to="/" className="flex items-center gap-2 text-white font-bold text-lg">
    <img src={Logo1} alt="logo" className="w-5 h-5" />
    <span>HomeFinder</span>
  </Link>
);

export default Logo;
