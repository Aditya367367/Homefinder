import React from "react";
import { Home, Building, Landmark } from "lucide-react";
import PropertyTypeCard from "./components/PropertyTypeCard";

const types = [
  {
    icon: <Home size={28} />,
    title: "Apartment",
    desc: "Explore modern apartments",
  },
  {
    icon: <Building size={28} />,
    title: "Flat",
    desc: "Discover spacious flats",
  },
  {
    icon: <Landmark size={28} />,
    title: "Villa",
    desc: "Find luxurious villas",
  },
];

const PropertyTypes = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 mt-10 md:mt-16">
      <div className="text-left mb-8">
        <h2 className="text-white text-3xl font-bold mb-2">Property Types</h2>
        <p className="text-gray-400 text-sm">
          Choose from a variety of property categories based on your needs.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {types.map((type, index) => (
          <PropertyTypeCard
            key={index}
            icon={type.icon}
            title={type.title}
            desc={type.desc}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};

export default PropertyTypes;
