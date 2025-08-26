import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import api from "../../utils/axiosInstance";
import { getAuthHeaders } from "../../auth/utils/authHeaders";

const updatePropertyStatusAPI = async ({ propertyId, newStatus }) => {
  const response = await api.patch(
    `/auth/property/${propertyId}/status/`,
    { status: newStatus },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const useUpdatePropertyStatus = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { mutate, isLoading, isSuccess, isError, error } = useMutation({
    mutationFn: updatePropertyStatusAPI,
    onSuccess: (data, variables) => {
      enqueueSnackbar(`Property status updated to "${variables.newStatus}"!`, { variant: "success" });
      
      queryClient.invalidateQueries(["userProperties"]);
      queryClient.invalidateQueries(["allProperties"]);
      queryClient.invalidateQueries(["property", variables.propertyId]); 
    },
    onError: (err) => {
      const errMsg =
        err?.response?.data?.detail || "Failed to update property status.";
      enqueueSnackbar(errMsg, { variant: "error" });
    },
  });

  return {
    updatePropertyStatus: mutate,
    isUpdatingPropertyStatus: isLoading,
    isPropertyStatusUpdated: isSuccess,
    updatePropertyStatusError: error,
    isUpdatePropertyStatusError: isError,
  };
};