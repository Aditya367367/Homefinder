import api from "../../auth/utils/axiosInstance";
import { refreshToken } from "../../auth/utils/refresh";
import { clearTokens } from "../../auth/utils/authTokenStore";

const withAuthRetry = async (apiCall) => {
  try {
    return await apiCall();
  } catch (err) {
    if (err.response?.status === 401) {
      try {
        await refreshToken();
        return await apiCall();
      } catch (refreshErr) {
        clearTokens();
        window.location.href = "/login";
        throw refreshErr;
      }
    }
    throw err;
  }
};

export const requestMeeting = async (propertyId, data) =>
  withAuthRetry(() =>
    api.post(`/auth/property/${propertyId}/meeting-request/`, data)
  );

export const fetchOwnerMeetings = async () =>
  withAuthRetry(() => api.get("/auth/owner/meeting-requests/").then((res) => res.data));

export const fetchUserCreatedMeetings = async () =>
  withAuthRetry(() => api.get("/auth/user/my-meeting-requests/").then((res) => res.data));

export const updateMeetingStatus = async (id, status) =>
  withAuthRetry(() =>
    api.patch(`/auth/meeting-request/${id}/update/`, { status })
  );