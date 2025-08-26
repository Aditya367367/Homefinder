
import { useMutation } from "@tanstack/react-query";
import api from "../../utils/axiosInstance";
import { useSnackbar } from "notistack";

export const signupAPI = async ({ name, email, password }) => {
  const response = await api.post("/auth/register/", {
    name,
    email,
    password,
  });
  return response.data;
};

export const useSignupService = () => {
  const { enqueueSnackbar } = useSnackbar();

  const { mutate, isLoading, isSuccess, data, error, isError } = useMutation({
    mutationFn: signupAPI,
    onSuccess: (data) => {
      enqueueSnackbar(data.message || "Account created successfully!", {
        variant: "success",
      });
    },
    onError: (error) => {
      const errMsg =
        error?.response?.data?.detail ||
        Object.values(error?.response?.data || {})
          .flat()
          .join(" ") ||
        "Signup failed";
      enqueueSnackbar(errMsg, { variant: "error" });
    },
  });

  return {
    signup: mutate,
    isLoading,
    isSuccess,
    data,
    error,
    isError,
  };
};
