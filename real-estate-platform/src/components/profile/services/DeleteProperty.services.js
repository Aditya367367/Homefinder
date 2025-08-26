import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import api from "../../utils/axiosInstance";

const deletePropertyAPI = async (propertyId) => {
  const response = await api.delete(`/auth/property/${propertyId}/delete/`);
  return response.data;
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { mutate, isLoading, isSuccess, isError, error } = useMutation({
    mutationFn: deletePropertyAPI,
    onMutate: async (propertyId) => {
      await queryClient.cancelQueries({ queryKey: ["userPropertiesData"] });
      await queryClient.cancelQueries({ queryKey: ["userEventPlacesData"] });

      const previousUserProperties = queryClient.getQueryData(["userPropertiesData"]);

      if (previousUserProperties) {
        queryClient.setQueryData(
          ["userPropertiesData"],
          (old) => (old || []).filter((p) => p.id !== propertyId)
        );
      }
      return { previousUserProperties };
    },
    onSuccess: () => {
      enqueueSnackbar("Property deleted successfully!", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["userPropertiesData"] });
      queryClient.invalidateQueries({ queryKey: ["userEventPlacesData"] });
    },
    onError: (err, propertyId, context) => {
      const errMsg = err?.response?.data?.detail || "Failed to delete property.";
      enqueueSnackbar(errMsg, { variant: "error" });
      if (context?.previousUserProperties) {
        queryClient.setQueryData(["userPropertiesData"], context.previousUserProperties);
      }
    },
  });

  return {
    deleteProperty: mutate,
    isDeletingProperty: isLoading,
    isPropertyDeleted: isSuccess,
    deletePropertyError: error,
    isDeletePropertyError: isError,
  };
};