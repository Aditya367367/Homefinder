import React, { useState } from "react";
import Logo from "./components/logo";
import SearchBar from "./components/SearchBar";
import NavLinks from "./components/NavLinks";
import LoginSignupButton from "./components/LoginSignupButton";
import { Menu, X, Search } from "lucide-react";
import { getAccessToken } from "../utils/authTokenStore";

const Navbar = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isLoggedIn] = useState(() => !!getAccessToken()); 

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out py-4 bg-[#1a1d21] px-4 md:px-6 shadow-md border-b border-white">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => setDrawerOpen(!isDrawerOpen)}
              className="text-white md:hidden"
            >
              {isDrawerOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Logo />
          </div>

          {isLoggedIn && (
            <div className="hidden sm:flex flex-1 justify-center">
              <SearchBar />
            </div>
          )}

          {isLoggedIn && (
            <div className="flex sm:hidden">
              <button onClick={() => setShowMobileSearch(!showMobileSearch)}>
                <Search size={20} className="text-white" />
              </button>
            </div>
          )}

          <div className="hidden md:flex items-center gap-6">
            <NavLinks />
          </div>

          <div className="flex items-center">
            <LoginSignupButton />
          </div>
        </div>
      </header>

      {isLoggedIn && showMobileSearch && (
        <div className="sm:hidden w-full px-4 py-2 bg-[#1f2227] border-b border-gray-700 mt-[72px] fixed top-0 left-0 z-40">
          <SearchBar isMobile={true} />
        </div>
      )}

      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-40 md:hidden"
          onClick={() => setDrawerOpen(false)}
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#1a1d21] z-50 flex flex-col gap-6 px-6 py-8 md:hidden border-r border-gray-700 transition-transform duration-300 ease-in-out transform ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <Logo />
          <button
            onClick={() => setDrawerOpen(false)}
            className="text-white p-2 rounded-full hover:bg-white/10"
          >
            <X size={24} />
          </button>
        </div>
        <NavLinks isMobile />
      </div>
    </>
  );
};

export default Navbar;
