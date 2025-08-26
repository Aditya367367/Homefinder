
import { useQuery } from "@tanstack/react-query";
import api from '../../utils/axiosInstance';

const fetchEventPlaceDetail = async (id) => {
  const { data } = await api.get(`auth/event-place/${id}/`);
  return data;
};

export const useFetchEventPlaceDetail = (id, enabled = true) => {
  return useQuery({
    queryKey: ["eventPlace", id],
    queryFn: () => fetchEventPlaceDetail(id),
    enabled: !!id && enabled, 
    staleTime: 5 * 60 * 1000,
  });
};