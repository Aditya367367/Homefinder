import React, { useState, useMemo } from "react";
import DashboardHeader from "./components/DashboardHeader";
import StatCards from "./components/StatCards";
import DashboardTabs from "./components/DashboardTabs";
import MyListingsTable from "./components/MyListingsTable";
import SavedProperties from "./components/SavedProperties";
import MeetingRequests from "./components/MeetingRequests";
import ProfileSettingsForm from "./components/ProfileSettingsForm";

import { useFetchUserPropertiess as useFetchPropertiesHook } from "./services/useFetchUserProperties.services";
import { useFetchSavedProperties} from "./services/FetchSavedProperties.services";
import { useFetchOwnerMeetings } from "../meetingrequest/services/FetchOwnerMeetings.services"; 
import { useFetchUserProperties as useFetchEventPlacesHook } from "../eventplaces/services/FetchUserProperties.services";

const LandlordDashboard = () => {
    const [activeTab, setActiveTab] = useState("My Listings");

    const { userProperties, isLoadingUserProperties, isErrorUserProperties, errorUserProperties } = useFetchPropertiesHook();
    const { data: userEventPlaces, isLoading: isLoadingUserEventPlaces, isError: isErrorUserEventPlaces, error: errorUserEventPlaces } = useFetchEventPlacesHook();

    const { savedProperties, isLoadingSavedProperties, isErrorSavedProperties, errorSavedProperties } = useFetchSavedProperties();
    const { ownerMeetings, isLoadingOwnerMeetings, isErrorOwnerMeetings, errorOwnerMeetings } = useFetchOwnerMeetings();

    const allListings = useMemo(() => {
        const properties = (userProperties || [])
            .filter(p => p != null)
            .map(p => ({
                ...p,
                listing_type: 'property',
                main_image: p.images?.[0]?.image,
                display_name: p.title,
                display_price: `₹${p.price}`,
            }));

       const eventPlaces = (userEventPlaces || [])
    .filter(ep => ep != null && ep.listing_type === 'event_place') 
    .map(ep => ({
        ...ep,
        listing_type: 'event_place',
        main_image: ep.images?.[0]?.image,
        display_name: ep.name,
        display_price: `₹${ep.price_per_hour}/hr`,
    }));

        const combined = [...properties, ...eventPlaces];
        const uniqueListings = Array.from(new Map(combined.filter(item => item != null && item.id && item.listing_type).map(item => [`${item.id}-${item.listing_type}`, item])).values());
        return uniqueListings;
    }, [userProperties, userEventPlaces]);

    const totalListings = allListings.length;
    const activeListings = allListings.filter(p => p.status?.toLowerCase() === "active").length;
    const meetingCount = ownerMeetings?.length || 0;
    const savedCount = savedProperties?.length || 0;

    const isLoading = isLoadingUserProperties || isLoadingUserEventPlaces || isLoadingSavedProperties || isLoadingOwnerMeetings;
    const isError = isErrorUserProperties || isErrorUserEventPlaces || isErrorSavedProperties || isErrorOwnerMeetings;
    const error = isErrorUserProperties ? errorUserProperties : isErrorUserEventPlaces ? errorUserEventPlaces : isErrorSavedProperties ? errorSavedProperties : errorOwnerMeetings;

    if (isLoading) {
        return (
            <div className="pt-24 px-4 md:px-8 max-w-7xl mx-auto text-white bg-[#0f1115] min-h-screen flex items-center justify-center">
                <p>Loading dashboard data...</p>
            </div>
        );
    }

    if (isError) {
        console.error("Dashboard data loading error:", error);
        return (
            <div className="pt-24 px-4 md:px-8 max-w-7xl mx-auto text-white bg-[#0f1115] min-h-screen flex items-center justify-center">
                <p className="text-red-500">Error loading dashboard data: {error.message || "An unknown error occurred."}</p>
            </div>
        );
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case "My Listings":
                return <MyListingsTable listings={allListings} isLoading={isLoading} />;
            case "Saved Properties":
                return <SavedProperties saved={savedProperties} loading={isLoadingSavedProperties} />;
            case "Meeting Requests":
                return <MeetingRequests meetings={ownerMeetings} isLoading={isLoadingOwnerMeetings} isError={isErrorOwnerMeetings} error={errorOwnerMeetings} />;
            case "Profile Settings":
                return <ProfileSettingsForm />;
            default:
                return null;
        }
    };

    return (
        <div className="pt-24 px-4 md:px-8 max-w-7xl mx-auto text-white bg-[#0f1115] min-h-screen">
            <DashboardHeader />
            <StatCards
                totalListings={totalListings}
                activeListings={activeListings}
                meetingCount={meetingCount}
                savedCount={savedCount}
            />
            <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            {renderTabContent()}
        </div>
    );
};

export default LandlordDashboard;