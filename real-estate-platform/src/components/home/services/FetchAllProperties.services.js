import { useQuery } from "@tanstack/react-query";
import api from "../../utils/axiosInstance";

const fetchAllPropertiesAPI = async (page = 1) => {
  const response = await api.get(`/auth/property/all/?page=${page}`);
  return response.data;
};

export const useFetchAllProperties = (page) => {
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["allProperties", page],
    queryFn: () => fetchAllPropertiesAPI(page),
    staleTime: 5 * 60 * 1000, 
  });

  return {
    allProperties: data,
    isLoadingAllProperties: isLoading,
    isErrorAllProperties: isError,
    errorAllProperties: error,
    isSuccessAllProperties: isSuccess,
  };
};