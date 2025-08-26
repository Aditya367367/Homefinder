import React, { useState, useEffect, useMemo } from "react";
import BasicInfoSection from "./components/BasicInfoSection";
import PropertyDetailsSection from "./components/PropertyDetailsSection";
import ImageUploadSection from "./components/ImageUploadSection";
import DescriptionSection from "./components/DescriptionSection";
import ContactInfoSection from "./components/ContactInfoSection";
import SubmitButtons from "./components/SubmitButtons";
import PreviewPage from "./components/PreviewPage";
import { getAccessToken } from "../utils/authTokenStore"; 
import { Link } from "react-router-dom";
import { useCreateProperty } from "../list_property/services/CreateProperty.services"; 

const ListPropertyPage = () => {
  
  const initialFormData = useMemo(() => ({
    title: "",
    location: "",
    price: "",
    type: "Buy",
    furnished: "Furnished",
    property_type: "Flat",
    bedrooms: "",
    bathrooms: "",
    area: "",
    description: "",
    contact_name: "",
    contact_phone: "",
    contact_email: "",
    images: [],
  }), []);

  const [formData, setFormData] = useState(initialFormData);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const {
    createProperty,
    isCreating,
    isCreated,
    isCreateError,
    
  } = useCreateProperty();

 
  useEffect(() => {
    const token = getAccessToken();
    setIsLoggedIn(!!token);
  }, []); 
  useEffect(() => {
    if (isCreated) {
      setFormData(initialFormData);
      setShowPreview(false);       
    }
  }, [isCreated, initialFormData]); 

  const handleSubmit = () => {
    
    console.log("ListPropertyPage: handleSubmit initiated.");

    const formPayload = new FormData();
    formPayload.append("title", formData.title);
    formPayload.append("location", formData.location);
    formPayload.append("price", formData.price);
    formPayload.append("type", formData.type);
    formPayload.append("property_type", formData.property_type);
    formPayload.append("furnished", formData.furnished);
    formPayload.append("bedrooms", formData.bedrooms);
    formPayload.append("bathrooms", formData.bathrooms);
    formPayload.append("area", formData.area);
    formPayload.append("description", formData.description);
    formPayload.append("contact_name", formData.contact_name);
    formPayload.append("contact_phone", formData.contact_phone);
    formPayload.append("contact_email", formData.contact_email);

    
    formData.images.forEach((imgObj) => {
      formPayload.append("images", imgObj.file);
    });

   
    for (let pair of formPayload.entries()) {
      console.log(pair[0]+ ': ' + pair[1]);
    }

    
    createProperty(formPayload);
    console.log("ListPropertyPage: createProperty (mutate function) called.");
  };

  
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1115] px-4">
        <div className="bg-[#1f2227] text-white p-6 rounded-md shadow-md w-full max-w-md text-center">
          <h2 className="text-xl font-semibold mb-4">Please Login to Continue</h2>
          <p className="text-gray-400 mb-6">You must be logged in to list a property.</p>
          <Link to="/login">
            <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md text-white font-medium">
              Go to Login
            </button>
          </Link>
        </div>
      </div>
    );
  }

 
  return (
    <div className="bg-[#0f1115] text-white min-h-screen pt-24 px-4 md:px-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">List Your Property</h1>

     
      {isCreated && (
        <div className="mb-6 p-4 bg-green-700 text-white rounded-md shadow">
          <span className="font-semibold">Success:</span> Property listed successfully!
        </div>
      )}

     
      {isCreateError && (
        <div className="mb-6 p-4 bg-red-700 text-white rounded-md shadow">
          <span className="font-semibold">Error:</span> Failed to list property. Please check your details and try again.
        </div>
      )}

      {showPreview ? (
        <PreviewPage
          formData={formData}
          onEdit={() => setShowPreview(false)}
          onSubmit={handleSubmit}
          isSubmitting={isCreating} 
        />
      ) : (
        <>
          <BasicInfoSection formData={formData} setFormData={setFormData} />
          <PropertyDetailsSection formData={formData} setFormData={setFormData} />
          <ImageUploadSection formData={formData} setFormData={setFormData} />
          <DescriptionSection formData={formData} setFormData={setFormData} />
          <ContactInfoSection formData={formData} setFormData={setFormData} />
          <SubmitButtons
            onPreview={() => setShowPreview(true)}
            onSubmit={handleSubmit}
            isSubmitting={isCreating} 
          />
        </>
      )}
    </div>
  );
};

export default ListPropertyPage;