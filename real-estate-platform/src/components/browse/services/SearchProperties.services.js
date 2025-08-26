
import { useQuery } from "@tanstack/react-query";
import api from "../../utils/axiosInstance";

const searchPropertiesAPI = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.query) params.append("query", filters.query);
  if (filters.location) params.append("location", filters.location);
  if (filters.type) params.append("type", filters.type);
  if (filters.furnished) params.append("furnished", filters.furnished);
  if (filters.propertyTypes?.length) {
    filters.propertyTypes.forEach((type) => {
      params.append("property_type", type);
    });
  }
  if (filters.min_price) params.append("min_price", filters.min_price);
  if (filters.max_price) params.append("max_price", filters.max_price);
  if (filters.page) params.append("page", filters.page);
  if (filters.ordering) params.append("ordering", filters.ordering);

  const response = await api.get(`/auth/property/search/?${params.toString()}`);
  return response.data;
};

export const useSearchProperties = (filters) => {
  return useQuery({
    queryKey: ["searchProperties", filters],
    queryFn: () => searchPropertiesAPI(filters),
    keepPreviousData: true,
  });
};
