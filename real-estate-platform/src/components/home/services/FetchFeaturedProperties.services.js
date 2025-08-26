import { useQuery } from "@tanstack/react-query";
import api from "../../utils/axiosInstance";

const fetchFeaturedPropertiesAPI = async (page = 1) => {
  const response = await api.get(`/auth/property/featured/?page=${page}`);
  return response.data;
};

export const useFetchFeaturedProperties = (page = 1) => {
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["featuredProperties", page], 
    queryFn: () => fetchFeaturedPropertiesAPI(page),
    keepPreviousData: true, 
    staleTime: 5 * 60 * 1000,
  });

  return {
    featuredProperties: data,
    isLoadingFeaturedProperties: isLoading,
    isErrorFeaturedProperties: isError,
    errorFeaturedProperties: error,
    isSuccessFeaturedProperties: isSuccess,
  };
};