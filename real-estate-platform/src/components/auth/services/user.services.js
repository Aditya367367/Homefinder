import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import api from "../../utils/axiosInstance";
import { getAccessToken, getRefreshToken, clearTokens, setTokens } from "../../utils/authTokenStore";
import { refreshToken } from "../../utils/refresh";
import { useLogoutService } from "./logut.services";

const queryClient = new QueryClient();

const fetchUserDataAPI = async () => {
  const access = getAccessToken();
  const refresh = getRefreshToken();

  if (!access && !refresh) {
    throw new Error("No authentication tokens found.");
  }

  try {
    const res = await api.get("/auth/user/", {
      headers: { Authorization: `Bearer ${access}` },
    });
    return res.data;
  } catch (error) {
    if (error.response?.status === 401 && refresh) {
      try {
        const newAccess = await refreshToken();
        setTokens({ access: newAccess, refresh });
        const retryRes = await api.get("/auth/user/", {
          headers: { Authorization: `Bearer ${newAccess}` },
        });
        return retryRes.data;
      } catch (refreshErr) {
        clearTokens();
        throw refreshErr;
      }
    }
    throw error;
  }
};

const updateUserDataAPI = async (updateData) => {
  const access = getAccessToken();
  const refresh = getRefreshToken();

  if (!access && !refresh) {
    throw new Error("No authentication tokens found.");
  }

  try {
    const res = await api.put("/auth/update/user/", updateData, {
      headers: { Authorization: `Bearer ${access}` },
    });
    return res.data;
  } catch (error) {
    if (error.response?.status === 401 && refresh) {
      try {
        const newAccess = await refreshToken();
        setTokens({ access: newAccess, refresh });
        const retryRes = await api.put("/auth/update/user/", updateData, {
          headers: { Authorization: `Bearer ${newAccess}` },
        });
        return retryRes.data;
      } catch (refreshErr) {
        clearTokens();
        throw refreshErr;
      }
    }
    throw error;
  }
};


export const useUserService = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { handleLogout } = useLogoutService();

  const {
    data,
    isLoading,
    isError,
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: fetchUserDataAPI,
    retry: false,
    onError: (error) => {
      if (error?.message === "No authentication tokens found." || error?.response?.status === 401) {
        handleLogout();
        enqueueSnackbar("Session expired. Please log in again.", { variant: "error" });
      } else {
        enqueueSnackbar("Failed to load user data.", { variant: "error" });
      }
    },
  });

  const mutation = useMutation({
    mutationFn: updateUserDataAPI,
    onSuccess: () => {
      enqueueSnackbar("Profile updated successfully!", { variant: "success" });
      queryClient.invalidateQueries(["userData"]);
    },
    onError: (error) => {
      if (error?.response?.status === 401) {
        handleLogout();
        enqueueSnackbar("Session expired. Please log in again.", { variant: "error" });
      } else {
        enqueueSnackbar("Failed to update profile", { variant: "error" });
      }
    },
  });

  return {
    user: data?.user || null,
    isLoading,
    isError,
    isSuccess,
    refetch,
    isLoggedIn: !!data?.user,
    updateProfile: mutation.mutate,
    updateLoading: mutation.isLoading,
  };
};