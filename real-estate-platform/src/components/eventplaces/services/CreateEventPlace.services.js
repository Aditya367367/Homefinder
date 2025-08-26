import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from '../../utils/axiosInstance';
import { toast } from "react-toastify";

const createEventPlace = (eventPlaceData) => {
  return api.post('auth/event-place/create/', eventPlaceData);
};

export const useCreateEventPlace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEventPlace,
    onSuccess: (data) => {
      toast.success("Property registration request submitted successfully!");
      console.log("Event Place created:", data);
      queryClient.invalidateQueries(["userProperties"]);
    },
    onError: (error) => {
      console.error("Failed to register property:", error);
      if (error.response && error.response.data) {
        Object.entries(error.response.data).forEach(([key, value]) => {
          const errorMessage = Array.isArray(value) ? value.join(', ') : value;
          toast.error(`${key}: ${errorMessage}`);
        });
      } else {
        toast.error('Failed to register property. Please try again.');
      }
    },
  });
};