import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import api from "../../utils/axiosInstance";

const createPropertyAPI = async (propertyData) => {
  const response = await api.post("/auth/property/create/", propertyData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { mutate, isLoading, isSuccess, isError, error } = useMutation({
    mutationFn: createPropertyAPI,
    onSuccess: () => {
      enqueueSnackbar("Property created successfully!", { variant: "success" });
      queryClient.invalidateQueries(["userProperties"]);
      queryClient.invalidateQueries(["allProperties"]);
    },
    onError: (err) => {
      const errMsg =
        err?.response?.data?.detail ||
        (err?.response?.data && Object.values(err.response.data).flat().join(" ")) ||
        "Failed to create property. Please try again.";
      enqueueSnackbar(errMsg, { variant: "error" });
      console.error("Error creating property:", err);
    },
  });

  return {
    createProperty: mutate,
    isCreating: isLoading,
    isCreated: isSuccess,
    isCreateError: isError,
    createError: error,
  };
};