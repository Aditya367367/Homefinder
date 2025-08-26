import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../utils/axiosInstance";

const updateMeetingStatusAPI = async ({ id, status }) => {
  const response = await api.patch(`/auth/meeting-request/${id}/update/`, { status });
  return response.data;
};

export const useUpdateMeetingStatus = () => {
  const queryClient = useQueryClient();

  const { mutate, isLoading, isError, error, isSuccess } = useMutation({
    mutationFn: updateMeetingStatusAPI,
    onSuccess: (data, variables) => {
      
      queryClient.invalidateQueries(["ownerMeetings"]);
      queryClient.invalidateQueries(["userCreatedMeetings"]);
     
      queryClient.invalidateQueries(["meeting", variables.id]);
    },
  });

  return {
    updateMeetingStatus: mutate,
    isUpdatingMeetingStatus: isLoading,
    isMeetingStatusUpdated: isSuccess,
    updateMeetingStatusError: error,
    isUpdateMeetingStatusError: isError,
  };
};