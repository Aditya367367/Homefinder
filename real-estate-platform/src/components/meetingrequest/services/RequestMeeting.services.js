import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../utils/axiosInstance";

const requestMeetingAPI = async ({ propertyId, data }) => {
  const response = await api.post(`/auth/property/${propertyId}/meeting-request/`, data);
  return response.data;
};

export const useRequestMeeting = () => {
  const queryClient = useQueryClient();

  const { mutate, isLoading, isError, error, isSuccess } = useMutation({
    mutationFn: requestMeetingAPI,
    onSuccess: () => {
     
      queryClient.invalidateQueries(["userCreatedMeetings"]);
    },
  });

  return {
    requestMeeting: mutate,
    isRequestingMeeting: isLoading,
    isMeetingRequested: isSuccess,
    requestMeetingError: error,
    isRequestMeetingError: isError,
  };
};