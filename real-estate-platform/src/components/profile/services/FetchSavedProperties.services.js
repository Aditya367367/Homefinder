import { useQuery } from "@tanstack/react-query";
import api from "../../utils/axiosInstance";
import { getAccessToken } from "../../utils/authTokenStore";

const fetchSavedPropertiesAPI = async () => {
  const response = await api.get("/auth/user/saved-properties/");
  return response.data;
};

export const useFetchSavedProperties = () => {
  const token = getAccessToken();

  const { data, isLoading, isError, error, isSuccess, refetch } = useQuery({
    queryKey: ["savedProperties"],
    queryFn: fetchSavedPropertiesAPI,
    enabled: !!token, 
    staleTime: 5 * 60 * 1000,
  });

  return {
    savedProperties: data,
    isLoadingSavedProperties: isLoading,
    isErrorSavedProperties: isError,
    errorSavedProperties: error,
    isSuccessSavedProperties: isSuccess,
    refetchSavedProperties: refetch,
  };
};