
import Hero from "../home/components/herosection/Hero";
import FeaturedProperties from "./components/featuredProperties/index";
import PropertyTypes from "./components/propertytypes/index";
import Listproperty from "./components/ListPropertySection/index";
const HomePage = () => {
  return (
    <div className="bg-[#0f1115] text-white pb-4">
      <Hero />
      <FeaturedProperties/>
      <PropertyTypes />
      <Listproperty/>
      
    </div>
  );
};

export default HomePage;
