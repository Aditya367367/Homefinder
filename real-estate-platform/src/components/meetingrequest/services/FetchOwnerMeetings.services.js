import { useQuery } from "@tanstack/react-query";
import api from "../../utils/axiosInstance";

const fetchOwnerMeetingsAPI = async () => {
  const response = await api.get("/auth/owner/meeting-requests/");
  return response.data;
};

export const useFetchOwnerMeetings = () => {
  const { data, isLoading, isError, error, isSuccess, refetch } = useQuery({
    queryKey: ["ownerMeetings"],
    queryFn: fetchOwnerMeetingsAPI,
    staleTime: 5 * 60 * 1000,
  });

  return {
    ownerMeetings: data,
    isLoadingOwnerMeetings: isLoading,
    isErrorOwnerMeetings: isError,
    errorOwnerMeetings: error,
    isSuccessOwnerMeetings: isSuccess,
    refetchOwnerMeetings: refetch,
  };
};