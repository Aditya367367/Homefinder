import React, { useState } from "react";
import HelpSearchBar from "./components/HelpSearchBar";
import FAQSection from "./components/FAQSection";

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="pt-24 px-4 md:px-8 max-w-5xl mx-auto text-white bg-[#0f1115] min-h-screen">
      <h1 className="text-3xl font-bold mb-6">How can we help you?</h1>
      <HelpSearchBar query={searchQuery} setQuery={setSearchQuery} />
      <FAQSection query={searchQuery} />
    </div>
  );
};

export default HelpPage;
