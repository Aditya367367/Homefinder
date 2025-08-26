import { useMutation } from "@tanstack/react-query";
import api from "../../utils/axiosInstance";
import { setTokens } from "../../utils/authTokenStore";
import { useSnackbar } from "notistack";

export const loginAPI = async ({ email, password }) => {
  
  const response = await api.post("/auth/login/", {
    email,
    password,
  });
  return response.data;
};

export const useLoginService = () => {
  const { enqueueSnackbar } = useSnackbar();

  const { mutate, isLoading, isSuccess, data, error, isError } = useMutation({
    mutationFn: loginAPI,
    onSuccess: (data) => {
      setTokens({ access: data.tokens.access, refresh: data.tokens.refresh });
      enqueueSnackbar("Logged in successfully!", { variant: "success" });
      window.location.href = "/";
    },
    onError: (error) => {
      const errMsg =
        error?.response?.data?.detail ||
        "Login failed. Please check your credentials.";
      enqueueSnackbar(errMsg, { variant: "error" });
    },
  });

  return {  
    login: mutate,
    isLoading,
    isSuccess,
    data,
    error,
    isError,
  };
};
