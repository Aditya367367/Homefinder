import React from "react";
import { Link, useLocation } from "react-router-dom";

const links = [
  { label: "Home", to: "/" },
  { label: "Browse", to: "/browse" },
 
  { label: "Event Spaces", to: "/spaces" },
  { label: "List Your Property", to: "/list-property" },
  { label: "Help center", to: "/help" },
];

const NavLinks = ({ isMobile = false }) => {
  const location = useLocation();

  const baseClasses = "font-worksans text-sm font-medium leading-[21px] tracking-normal transition-all duration-300";
  const activeClass = "text-blue-400";
  const inactiveClass = "text-white hover:text-blue-400";

  return (
    <nav className={`flex flex-col ${isMobile ? "gap-4" : "md:flex-row md:gap-6 hidden md:flex"}`}>
      {links.map(({ label, to }) => {
        const isActive = location.pathname === to;

        return (
          <Link
            to={to}
            key={label}
            className={`relative px-3 py-1 rounded-md group ${baseClasses} ${
              isActive ? activeClass : inactiveClass
            }`}
          >
            <span className="relative z-10">{label}</span>

            <span className="absolute left-2 right-2 bottom-0 h-[2px] bg-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />

            <span className="absolute inset-0 bg-white/10 rounded-md scale-95 group-hover:scale-105 opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10" />
          </Link>
        );
      })}
    </nav>
  );
};

export default NavLinks;
