import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";


const resetPasswordConfirmAPI = async ({ uidb64, token, newPassword, confirmNewPassword }) => {
  const response = await api.post(
    `/auth/password-reset-confirm/${uidb64}/${token}/`,
    {
      new_password: newPassword,
      confirm_password: confirmNewPassword, 
    }
  );
  return {
    message: response?.data?.detail || "Password reset successful!", 
    isMessageVisible: !!response?.data?.detail,
  };
};

export const usePasswordResetConfirmService = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { mutate, isLoading, isSuccess, isError, error } = useMutation({
    mutationFn: resetPasswordConfirmAPI,
    onSuccess: ({ message, isMessageVisible }) => {
      if (isMessageVisible && message) {
        enqueueSnackbar(message, {
          variant: "success",
        });
      } else {
        enqueueSnackbar("Password reset successful! You can now log in.", {
          variant: "success",
        });
      }
      setTimeout(() => navigate("/login"), 2000);
    },
    onError: (err) => {
      const errorData = err?.response?.data;
      let errorMessage = "Failed to reset password. The link might be invalid or expired.";

      if (errorData) {
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.new_password && errorData.new_password.length > 0) {
          errorMessage = errorData.new_password[0];
        } else if (errorData.confirm_password && errorData.confirm_password.length > 0) { 
            errorMessage = errorData.confirm_password[0];
        } else if (errorData.uid || errorData.token) {
          errorMessage = "The password reset link is invalid or has expired.";
        }
        else if (typeof errorData === 'object') {
          errorMessage = Object.values(errorData).flat().join(" ");
        }
      }

      enqueueSnackbar(errorMessage, {
        variant: "error",
      });
    },
  });

  const handlePasswordResetConfirm = mutate;

  return { handlePasswordResetConfirm, isLoading, isSuccess, isError, error };
};