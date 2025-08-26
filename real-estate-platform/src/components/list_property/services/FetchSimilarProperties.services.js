import { useQuery } from "@tanstack/react-query";
import api from "../../utils/axiosInstance";

const fetchSimilarPropertiesAPI = async (propertyId) => {
  if (!propertyId) return null; 
  const response = await api.get(`/auth/property/${propertyId}/similar/`);
  return response.data;
};

export const useFetchSimilarProperties = (propertyId) => {
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["similarProperties", propertyId], 
    queryFn: () => fetchSimilarPropertiesAPI(propertyId),
    enabled: !!propertyId, 
    staleTime: 5 * 60 * 1000,
  });

  return {
    similarProperties: data,
    isLoadingSimilarProperties: isLoading,
    isErrorSimilarProperties: isError,
    errorSimilarProperties: error,
    isSuccessSimilarProperties: isSuccess,
  };
};