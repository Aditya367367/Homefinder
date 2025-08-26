import { useQuery } from "@tanstack/react-query";
import api from "../../utils/axiosInstance";

const globalSearchAPI = async (query = "") => {
  const response = await api.get(`/auth/search-all/?q=${query}`);
  return response.data;
};

export const useGlobalSearch = (query = "") => {
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["globalSearch", query],
    queryFn: () => globalSearchAPI(query),
    enabled: !!query,
    staleTime: 0,
  });

  return {
    searchResults: data,
    isLoadingSearchResults: isLoading,
    isErrorSearchResults: isError,
    errorSearchResults: error,
    isSuccessSearchResults: isSuccess,
  };
};