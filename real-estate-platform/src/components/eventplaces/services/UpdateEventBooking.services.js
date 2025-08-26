
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from '../../utils/axiosInstance';
import { toast } from "react-toastify";

const updateEventBooking = async ({ id, data }) => {
    
    const response = await api.put(`auth/event-booking/${id}/update/`, data);
    return response.data;
};

export const useUpdateEventBooking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateEventBooking,
        onSuccess: (data) => {
            toast.success("Booking updated successfully!");
            queryClient.invalidateQueries(["userEventBookings"]); 
            if (data && data.event_place) {
              queryClient.invalidateQueries(["eventPlace", data.event_place]);
            }
        },
        onError: (error) => {
            console.error("Failed to update booking:", error);
            if (error.response && error.response.data) {
                const responseData = error.response.data;
                if (responseData.non_field_errors && responseData.non_field_errors.length > 0) {
                    toast.error(responseData.non_field_errors[0]);
                } else if (responseData.detail) {
                    toast.error(responseData.detail);
                } else {
                    
                    let errorMessage = "Update failed: ";
                    for (const key in responseData) {
                        if (Array.isArray(responseData[key]) && responseData[key].length > 0) {
                            errorMessage += `${key}: ${responseData[key][0]} `;
                        }
                    }
                    toast.error(errorMessage.trim() || 'Failed to update booking. Please try again.');
                }
            } else {
                toast.error('Failed to update booking. Please try again.');
            }
        },
    });
};