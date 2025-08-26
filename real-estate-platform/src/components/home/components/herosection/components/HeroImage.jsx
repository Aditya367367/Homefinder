import React from "react";
import HeroImage1 from "../../../../../assets/hero_image.png";
import { motion } from "framer-motion";

const HeroImage = () => (
  <motion.img
    initial={{ opacity: 0, scale: 1.05 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8 }}
    src={HeroImage1}
    alt="Hero"
    className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] object-cover rounded-2xl mt-[100px]"
  />
);

export default HeroImage;
