import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from '../../utils/axiosInstance'; 

const createEventBooking = async (bookingData) => {
  const { data } = await api.post('auth/event-booking/create/', bookingData);
  return data;
};

// Now accepts a refetch function as a second argument
export const useCreateEventBooking = (toast, refetchEventPlaceDetail) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEventBooking,
    onSuccess: (data) => {
      // Invalidate user-specific bookings list (if you have one)
      queryClient.invalidateQueries(["userBookings"]); 
      
      // Check if event_place details are in the response and invalidate that specific place
      // This might not be strictly needed if refetchEventPlaceDetail handles it.
      if (data && data.event_place && data.event_place.id) {
          queryClient.invalidateQueries(["eventPlace", data.event_place.id]);
      } 
      
      // If a refetch function was provided, call it to update the current page's data
      if (refetchEventPlaceDetail && typeof refetchEventPlaceDetail === 'function') {
          refetchEventPlaceDetail(); // This will re-run useFetchEventPlaceDetail
      }

      if (toast) { 
        toast.success("Booking request submitted successfully! Your booking is pending confirmation.");
      }
    },
    onError: (error) => {
      let errorMessage = "Booking failed: An unexpected error occurred."; 

      if (error.response) {
        // console.error("Full Backend Error Response Data:", error.response.data); // Keep for debugging if needed

        if (error.response.data && Array.isArray(error.response.data.non_field_errors) && error.response.data.non_field_errors.length > 0) {
          errorMessage = error.response.data.non_field_errors[0];
        } 
        else if (error.response.data && error.response.data.detail) {
          errorMessage = error.response.data.detail;
        }
        else if (error.response.data && typeof error.response.data === 'object') {
            const fieldErrors = Object.values(error.response.data).flat();
            if (fieldErrors.length > 0) {
                errorMessage = fieldErrors[0];
            }
        }
        else if (typeof error.response.data === 'string' && error.response.data.trim() !== '') {
            errorMessage = error.response.data;
        }
        
      } else if (error.request) {
        errorMessage = "Booking failed: No response from server. Please check your network connection.";
      } else {
        errorMessage = `Booking failed: ${error.message}`;
      }
      
      // console.error("Error message sent to toast:", errorMessage); // Keep for debugging if needed
      if (toast) {
        toast.error(errorMessage);
      }
    },
  });
};