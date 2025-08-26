import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from '../../utils/axiosInstance';
import { toast } from "react-toastify";

const cancelEventBooking = async (id) => {
  
    const response = await api.delete(`auth/event-booking/${id}/cancel/`);
    return response.data;
};

export const useCancelEventBooking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: cancelEventBooking,
        onSuccess: (data, variables) => {
            toast.success("Booking cancelled successfully!");
            queryClient.invalidateQueries(["userEventBookings"]); 
            if (data && data.event_place) {
              queryClient.invalidateQueries(["eventPlace", data.event_place]);
            }
            console.log(`Booking with ID ${variables} cancelled.`);
        },
        onError: (error) => {
            console.error("Failed to cancel booking:", error);
            if (error.response && error.response.data && error.response.data.detail) {
                toast.error(error.response.data.detail);
            } else {
                toast.error('Failed to cancel booking. Please try again.');
            }
        },
    });
};