import React, { useState } from "react";
import { Pencil, Trash } from "lucide-react";
import { toast } from "react-toastify";

import { useDeleteProperty } from "../services/DeleteProperty.services";
import { useUpdateProperty } from "../services/UpdateProperty.services";

import { useDeleteEventPlace } from "../services/DeleteEventPlace.services";
import { useUpdateEventPlace } from "../services/UpdateEventPlace.services";

import PropertyFormModal from "./PropertyFormModal";
import EventPlaceFormModal from "./EventPlaceFormModal";
import Placeholder from "../../../assets/features2.png"


const LOCAL_PLACEHOLDER_IMAGE = Placeholder;

const statusColor = {
  Active: "text-green-400",
  Inactive: "text-gray-500",
  Pending: "text-yellow-400",
  Approved: "text-green-400",
  "Pending Review": "text-yellow-400",
  Disabled: "text-red-400",
  "Pending Approval": "text-yellow-400",
};

const DeleteConfirmationModal = ({ item, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-[#1f2227] rounded-lg p-6 w-full max-w-sm shadow-xl border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">Confirm Deletion</h3>
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete the{" "}
          <span className="font-bold capitalize">{item.listing_type?.replace("_", " ")}</span>:{" "}
          <span className="font-bold">{item.display_name}</span>? This action cannot be undone.
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm(item.id, item.listing_type);
              onClose();
            }}
            className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const MyListingsTable = ({ listings = [], isLoading }) => {
  const [currentListing, setCurrentListing] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [deleteConfirmationDetails, setDeleteConfirmationDetails] = useState(null);

  const { deleteProperty, isLoading: isDeletingProperty } = useDeleteProperty();
  const { updatePropertyAsync, isLoading: isUpdatingProperty } = useUpdateProperty();

  const { deleteEventPlace, isLoading: isDeletingEventPlace } = useDeleteEventPlace();
  const { updateEventPlaceAsync, isLoading: isUpdatingEventPlace } = useUpdateEventPlace();

  const handleEditClick = (listing) => {
    setCurrentListing(listing);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (item) => {
    setDeleteConfirmationDetails(item);
  };

  const executeDelete = async (id, type) => {
    try {
      if (type === "property") {
        await deleteProperty(id);
      } else if (type === "event_place") {
        await deleteEventPlace(id);
      }
      toast.success(
        `${type.replace("_", " ").charAt(0).toUpperCase() + type.replace("_", " ").slice(1)} deleted successfully!`
      );
    } catch (err) {
      console.error(`Failed to delete ${type}:`, err);
      const errorMessage =
        err.response?.data?.detail || err.message || `An unknown error occurred while deleting ${type}.`;
      toast.error(`Failed to delete listing: ${errorMessage}`);
    } finally {
      setDeleteConfirmationDetails(null);
    }
  };

  const handleModalSave = async (updatedData) => {
    if (!currentListing) return;

    try {
      if (currentListing.listing_type === "property") {
        await updatePropertyAsync({
          propertyId: currentListing.id,
          updatedData: updatedData,
        });
      } else if (currentListing.listing_type === "event_place") {
        await updateEventPlaceAsync({ id: currentListing.id, data: updatedData });
      }
      setEditModalOpen(false);
      toast.success("Listing updated successfully!");
    } catch (error) {
      console.error("Failed to update listing:", error.response || error);
      const errorMessage =
        error.response?.data?.detail || error.message || "An unknown error occurred.";
      toast.error(`Failed to update listing: ${errorMessage}`);
    }
  };

  const filteredListings = (listings || []).filter((item) => {
    if (filterType === "all") {
      return true;
    }
    return item.listing_type === filterType;
  });

  if (isLoading) {
    return <p className="text-gray-400">Loading listings...</p>;
  }

  if (!listings || listings.length === 0) {
    return <p className="text-gray-400">No listings available.</p>;
  }

  return (
    <div className="mb-10">
      <h2 className="text-lg font-semibold mb-4">
        My Listings{" "}
        {listings?.length > 0 && (
          <span className="text-sm text-gray-400 ml-2">({listings.length} total)</span>
        )}
      </h2>

      <div className="mb-4 flex space-x-2">
        <button
          onClick={() => setFilterType("all")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            filterType === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          All Listings
        </button>
        <button
          onClick={() => setFilterType("property")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            filterType === "property"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Properties
        </button>
        <button
          onClick={() => setFilterType("event_place")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            filterType === "event_place"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Event Spaces
        </button>
      </div>

      {filteredListings.length === 0 ? (
        <p className="text-gray-400">No listings found for this filter.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse min-w-[700px]">
            <thead className="text-gray-400 border-b border-gray-700">
              <tr>
                <th className="py-2 pr-4">Listing</th>
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Location</th>
                <th className="py-2 pr-4">Price</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredListings.map((item) => {
                const imageUrl = item.main_image || LOCAL_PLACEHOLDER_IMAGE;
                
                return (
                  <tr
                    key={`${item.id}-${item.listing_type}`}
                    className="border-t border-gray-800 hover:bg-[#1a1d22] transition duration-200"
                  >
                    <td className="py-3 pr-4 flex items-center gap-3">
                      <img
                        src={imageUrl}
                        alt={item.display_name}
                        className="w-12 h-12 rounded-md object-cover border border-gray-600 shadow-sm"
                      />
                      <span className="text-white font-medium">
                        {item.listing_type === "event_place" && (
                          <span className="text-blue-400 font-bold mr-1">Ev</span>
                        )}
                        {item.display_name}
                      </span>
                    </td>
                    <td className="py-3 pr-4 capitalize text-gray-300">
                      {item.listing_type?.replace("_", " ")}
                    </td>
                    <td className="py-3 pr-4 text-gray-300">{item.location}</td>
                    <td className="py-3 pr-4 text-gray-300">{item.display_price}</td>
                    <td
                      className={`py-3 pr-4 font-semibold ${
                        statusColor[item.status] || "text-gray-400"
                      }`}
                    >
                      {item.status || "N/A"}
                    </td>
                    <td className="py-3 pr-4 flex justify-end gap-3">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-xs"
                        title="Edit"
                        disabled={isUpdatingProperty || isUpdatingEventPlace}
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item)}
                        className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-xs"
                        title="Delete"
                        disabled={isDeletingProperty || isDeletingEventPlace}
                      >
                        <Trash size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {editModalOpen && currentListing && currentListing.listing_type === "property" && (
        <PropertyFormModal
          property={currentListing}
          onClose={() => setEditModalOpen(false)}
          onSave={handleModalSave}
        />
      )}
      {editModalOpen && currentListing && currentListing.listing_type === "event_place" && (
        <EventPlaceFormModal
          eventPlace={currentListing}
          onClose={() => setEditModalOpen(false)}
          onSave={handleModalSave}
        />
      )}

      {deleteConfirmationDetails && (
        <DeleteConfirmationModal
          item={deleteConfirmationDetails}
          onClose={() => setDeleteConfirmationDetails(null)}
          onConfirm={executeDelete}
        />
      )}
    </div>
  );
};

export default MyListingsTable;