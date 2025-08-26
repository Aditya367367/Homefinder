import { QueryClient } from "@tanstack/react-query";
import api from "./axiosInstance";
import { clearTokens } from "./authTokenStore";
import { refreshToken } from "./refresh";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: async (failureCount, error) =>
        error?.response?.status === 401 && failureCount < 1,

      queryFn: async ({ queryKey }) => {
        try {
          const { data } = await api.get(queryKey[0]);
          return data;
        } catch (err) {
          if (err.response?.status === 401) {
            try {
              await refreshToken();
              const { data } = await api.get(queryKey[0]);
              return data;
            } catch (refreshErr) {
              clearTokens();
              window.location.href = "/login";
              throw refreshErr;
            }
          }
          throw err;
        }
      },
    },

    mutations: {
      retry: async (failureCount, error) =>
        error?.response?.status === 401 && failureCount < 1,

      mutationFn: async ({ url, method = "post", data }) => {
        try {
          const res = await api({ url, method, data });
          return res.data;
        } catch (err) {
          if (err.response?.status === 401) {
            try {
              await refreshToken();
              const res = await api({ url, method, data });
              return res.data;
            } catch (refreshErr) {
              clearTokens();
              window.location.href = "/login";
              throw refreshErr;
            }
          }
          throw err;
        }
      },
    },
  },
});
