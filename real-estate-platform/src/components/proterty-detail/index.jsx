import React from "react";
import { useParams } from "react-router-dom";

import { useFetchPropertyById } from "./services/FetchPropertyById.services";
import { useSaveProperty } from "./services/SaveProperty.services";
import { useUnsaveProperty } from "./services/UnsaveProperty.services";

import PropertyImageGallery from "./components/PropertyImageGallery";
import PropertyTitleSection from "./components/PropertyTitleSection";
import PropertyDescription from "./components/PropertyDescription";
import LandlordInfoCard from "./components/LandlordInfoCard";
import SimilarPropertiesGrid from "./components/SimilarPropertiesGrid";
import MeetingRequestForm from "./components/MeetingRequestForm";

const PropertyDetailPage = () => {
  const { id } = useParams();

  
  const { property, isLoadingProperty, isErrorProperty } = useFetchPropertyById(id);

 
  const { saveProperty } = useSaveProperty();
  const { unsaveProperty } = useUnsaveProperty();

  const handleSaveToggle = () => {
    if (property?.is_saved) {
      unsaveProperty(id);
    } else {
      saveProperty(id);
    }
  };

  if (isLoadingProperty) {
    return (
      <div className="bg-[#0f1115] min-h-screen text-white flex items-center justify-center">
        <p>Loading property details...</p>
      </div>
    );
  }

  if (isErrorProperty) {
    return (
      <div className="bg-[#0f1115] min-h-screen text-red-500 flex items-center justify-center">
        <p>Failed to load property details. Please try again.</p>
      </div>
    );
  }

  
  if (!property) {
    return null;
  }

  return (
    <div className="bg-[#0f1115] min-h-screen text-white px-4 py-8 max-w-6xl mx-auto">
      <PropertyImageGallery images={property.images} />

      <PropertyTitleSection
        title={property.title}
        location={property.location}
        price={property.price}
        furnished={property.furnished}
        type={property.type}
        bedrooms={property.bedrooms}
        bathrooms={property.bathrooms}
        area={property.area}
      />

      <PropertyDescription description={property.description} />

      <LandlordInfoCard
        name={property.user?.name || property.contact_name}
        phone={property.user?.phone || property.contact_phone}
        email={property.user?.email || property.contact_email}
        avatar={property.user?.profile_pic}
        isSaved={property.is_saved}
        onSaveToggle={handleSaveToggle}
        MeetingRequestForm={MeetingRequestForm}
        property={property}
      />

      <SimilarPropertiesGrid propertyId={property.id} />
    </div>
  );
};

export default PropertyDetailPage;