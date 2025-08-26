import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import api from "../../utils/axiosInstance";

const savePropertyAPI = async (propertyId) => {
  const response = await api.post(`/auth/property/${propertyId}/save/`, {});
  return response.data;
};

export const useSaveProperty = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { mutate, isLoading, isSuccess, isError, error } = useMutation({
    mutationFn: savePropertyAPI,
    onSuccess: () => {
      enqueueSnackbar("Property saved successfully!", { variant: "success" });
      queryClient.invalidateQueries(["savedProperties"]);
    },
    onError: (err) => {
      const errMsg =
        err?.response?.data?.detail || "Failed to save property.";
      enqueueSnackbar(errMsg, { variant: "error" });
    },
  });

  return {
    saveProperty: mutate,
    isSaving: isLoading,
    isSaved: isSuccess,
    saveError: error,
    isSaveError: isError,
  };
};