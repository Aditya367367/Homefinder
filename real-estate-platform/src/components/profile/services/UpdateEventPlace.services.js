import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from '../../utils/axiosInstance';
import { toast } from "react-toastify";



const updateEventPlaceAPI = ({ id, data }) => {
  return api.patch(`auth/event-place/${id}/update/`, data, { 
    headers: {
      "Content-Type": "application/json",
    },
  });
};


export const useUpdateEventPlace = () => {
  const queryClient = useQueryClient();

 
  const { mutate, mutateAsync, isLoading, isSuccess, isError, error } = useMutation({
    mutationFn: updateEventPlaceAPI,
    onSuccess: (data, variables) => {
      toast.success("Event Space updated successfully!"); 
      console.log("Event Place updated:", data);
      queryClient.invalidateQueries(["eventPlace", variables.id]);
      queryClient.invalidateQueries(["eventPlaces"]);
      queryClient.invalidateQueries(["userProperties"]); 
    },
    onError: (err) => { 
      console.error("Failed to update event place:", err.response || err); 
      if (err.response && err.response.data) {
       
        const errorMessages = Object.values(err.response.data)
                                    .flat()
                                    .map(msg => typeof msg === 'string' ? msg : JSON.stringify(msg))
                                    .join('; ');
        toast.error(`Failed to update event space: ${errorMessages}`);
      } else {
        toast.error('Failed to update event space. Please try again.');
      }
    },
  });

  return {
    updateEventPlace: mutate,
    updateEventPlaceAsync: mutateAsync, 
    isUpdatingEventPlace: isLoading, 
    isEventPlaceUpdated: isSuccess,
    updateEventPlaceError: error,
    isUpdateEventPlaceError: isError,
  };
};