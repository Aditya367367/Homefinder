
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from '../../utils/axiosInstance';
import { toast } from "react-toastify";

const deleteEventPlaceAPI = (id) => { 
  return api.delete(`auth/event-place/${id}/delete/`);
};

export const useDeleteEventPlace = () => {
  const queryClient = useQueryClient();

  const { mutate, isLoading, isSuccess, isError, error } = useMutation({
    mutationFn: deleteEventPlaceAPI, 
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["userEventPlacesData"] });
      await queryClient.cancelQueries({ queryKey: ["userPropertiesData"] });

      const previousEventPlaces = queryClient.getQueryData(["userEventPlacesData"]);

      if (previousEventPlaces) {
        queryClient.setQueryData(
          ["userEventPlacesData"],
          (old) => (old || []).filter((ep) => ep.id !== id)
        );
      }
      return { previousEventPlaces };
    },
    onSuccess: (data, id) => {
      toast.success("Event Place deleted successfully!");
      console.log(`Event Place with ID ${id} deleted.`);
      queryClient.invalidateQueries({ queryKey: ["userEventPlacesData"] });
      queryClient.invalidateQueries({ queryKey: ["userPropertiesData"] });
      queryClient.invalidateQueries({ queryKey: ["eventPlace", id] });
    },
    onError: (err, id, context) => { 
      console.error(`Failed to delete event place with ID ${id}:`, err);
      const errorMessage = err.response?.data?.detail || err.message || 'An unknown error occurred.';
      toast.error(`Failed to delete event place: ${errorMessage}`);
      if (context?.previousEventPlaces) {
        queryClient.setQueryData(["userEventPlacesData"], context.previousEventPlaces);
      }
    },
  });

  return {
    deleteEventPlace: mutate, 
    isDeletingEventPlace: isLoading,
    isEventPlaceDeleted: isSuccess,
    deleteEventPlaceError: error,
    isDeleteEventPlaceError: isError,
  };
};