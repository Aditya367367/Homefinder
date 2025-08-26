import React from "react";
import HeroImage from "./components/HeroImage";
import HeroOverlay from "./components/HeroOverlay";
// import HeroOptionsBar from "./components/HeroOptionsBar";

const Hero = () => {
  return (
    <div className=" w-full  ">
      <section className="relative overflow-hidden w-full">
        <div className="max-w-7xl mx-auto px-4 ">
          <HeroImage />
          <HeroOverlay />
        </div>
      </section>

      {/* <div className="max-w-7xl mx-auto px-4 mt-4 flex justify-start">
        <HeroOptionsBar />
      </div> */}
    </div>
  );
};

export default Hero;
