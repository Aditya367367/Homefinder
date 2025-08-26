import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import api from "../../utils/axiosInstance";

const updatePropertyAPI = async ({ propertyId, updatedData }) => {
  const response = await api.patch(
    `/auth/property/${propertyId}/update/`,
    updatedData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { mutate, mutateAsync, isLoading, isSuccess, isError, error } = useMutation({
    mutationFn: updatePropertyAPI,
    onSuccess: (data, variables) => {
      enqueueSnackbar("Property updated successfully!", { variant: "success" });
      queryClient.invalidateQueries(["userProperties"]);
      queryClient.invalidateQueries(["allProperties"]);
      queryClient.invalidateQueries(["property", variables.propertyId]);
    },
    onError: (err) => {
      console.error("Error updating property:", err.response || err);
      const errMsg =
        err?.response?.data?.detail ||
        Object.values(err?.response?.data || {}).flat().join(" ") ||
        "Failed to update property. Please check your network or server.";
      enqueueSnackbar(errMsg, { variant: "error" });
    },
  });

  return {
    updateProperty: mutate,
    updatePropertyAsync: mutateAsync,
    isUpdatingProperty: isLoading,
    isPropertyUpdated: isSuccess,
    updatePropertyError: error,
    isUpdatePropertyError: isError,
  };
};