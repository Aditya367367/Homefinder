import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import api from "../../utils/axiosInstance";

const unsavePropertyAPI = async (propertyId) => {
  const response = await api.delete(`/auth/property/${propertyId}/unsave/`);
  return response.data;
};

export const useUnsaveProperty = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { mutate, isLoading, isSuccess, isError, error } = useMutation({
    mutationFn: unsavePropertyAPI,
    onSuccess: () => {
      enqueueSnackbar("Property unsaved successfully!", { variant: "success" });
      queryClient.invalidateQueries(["savedProperties"]);
    },
    onError: (err) => {
      const errMsg =
        err?.response?.data?.detail || "Failed to unsave property.";
      enqueueSnackbar(errMsg, { variant: "error" });
    },
  });

  return {
    unsaveProperty: mutate,
    isUnsaving: isLoading,
    isUnsaved: isSuccess,
    unsaveError: error,
    isUnsaveError: isError,
  };
};