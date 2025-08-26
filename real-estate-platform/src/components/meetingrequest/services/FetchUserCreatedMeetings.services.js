import { useQuery } from "@tanstack/react-query";
import api from "../../utils/axiosInstance";

const fetchUserCreatedMeetingsAPI = async () => {
  const response = await api.get("/auth/user/my-meeting-requests/");
  return response.data;
};

export const useFetchUserCreatedMeetings = () => {
  const { data, isLoading, isError, error, isSuccess, refetch } = useQuery({
    queryKey: ["userCreatedMeetings"],
    queryFn: fetchUserCreatedMeetingsAPI,
    staleTime: 5 * 60 * 1000,
  });

  return {
    userCreatedMeetings: data,
    isLoadingUserCreatedMeetings: isLoading,
    isErrorUserCreatedMeetings: isError,
    errorUserCreatedMeetings: error,
    isSuccessUserCreatedMeetings: isSuccess,
    refetchUserCreatedMeetings: refetch,
  };
};