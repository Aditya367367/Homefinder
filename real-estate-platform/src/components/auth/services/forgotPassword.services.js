import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import api from "../../utils/axiosInstance";


const sendPasswordResetEmailAPI = async (email) => {
  const response = await api.post("/auth/password-reset/", { email });
  
  return response.data; 
};

export const useForgotPasswordService = () => {
  const { enqueueSnackbar } = useSnackbar();

  const { mutate, isLoading, isSuccess, isError, error } = useMutation({
    mutationFn: sendPasswordResetEmailAPI,
    onSuccess: () => {
      enqueueSnackbar(
        "If an account with that email exists, a password reset link has been sent to your inbox. Please check your spam folder as well.",
        { variant: "success" }
      );
    },
    onError: (err) => {
      const errorData = err?.response?.data;
      let errorMessage = "Failed to send password reset request. Please try again.";

      if (errorData) {
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.email && errorData.email[0]) {
          errorMessage = errorData.email[0];
        } else if (typeof errorData === 'object') {
          errorMessage = Object.values(errorData).flat().join(" ");
        }
      }

      enqueueSnackbar(errorMessage, {
        variant: "error",
      });
    },
  });

  
  const handleSendResetLink = mutate;

  return { handleSendResetLink, isLoading, isSuccess, isError, error };
};