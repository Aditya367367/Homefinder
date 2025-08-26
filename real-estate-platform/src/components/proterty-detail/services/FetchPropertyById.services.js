import { useQuery } from "@tanstack/react-query";
import api from "../../utils/axiosInstance";

const fetchPropertyByIdAPI = async (id) => {
  if (!id) return null; 
  const response = await api.get(`/auth/property/${id}/`);
  return response.data;
};

export const useFetchPropertyById = (propertyId) => {
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["property", propertyId], 
    queryFn: () => fetchPropertyByIdAPI(propertyId),
    enabled: !!propertyId, 
  });

  return {
    property: data,
    isLoadingProperty: isLoading,
    isErrorProperty: isError,
    errorProperty: error,
    isSuccessProperty: isSuccess,
  };
};