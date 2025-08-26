import { useQuery } from "@tanstack/react-query";
import api from '../../utils/axiosInstance';

const fetchAllEventPlaces = async () => {
  const response = await api.get('/auth/event-place/all/');
 
  return response.data.results; 
};

export const useFetchEventPlaces = (enabled = true) => {
  return useQuery({
    queryKey: ["eventPlaces"],
    queryFn: fetchAllEventPlaces,
    staleTime: 5 * 60 * 1000,
    refetchInterval: false,
    enabled: enabled,
  });
};