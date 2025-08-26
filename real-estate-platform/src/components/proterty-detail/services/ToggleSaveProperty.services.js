import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import api from "../../utils/axiosInstance";

const toggleSaveAPI = async (propertyId) => {
  const response = await api.post(`/auth/property/${propertyId}/toggle-save/`);
  return response.data;
};

export const useToggleSaveProperty = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { mutate, isLoading } = useMutation({
    mutationFn: toggleSaveAPI,
    onSuccess: (data) => {
      enqueueSnackbar(data.message, { variant: "success" });
      queryClient.invalidateQueries(["savedProperties"]);
    },
    onError: (err) => {
      enqueueSnackbar(
        err?.response?.data?.detail || "Failed to toggle save.",
        { variant: "error" }
      );
    },
  });

  return { toggleSave: mutate, isToggling: isLoading };
};
