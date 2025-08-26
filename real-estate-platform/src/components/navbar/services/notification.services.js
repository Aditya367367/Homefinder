import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../utils/axiosInstance";

export const useNotificationsService = (isLoggedIn) => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data } = await api.get("auth/notifications/");
      return data;
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 60 * 1000,
    enabled: isLoggedIn,
  });
};

export const useMarkNotificationReadService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notificationId) => {
      const { data } = await api.patch(`auth/notifications/${notificationId}/mark-read/`, {
        is_read: true,
      });
      return data;
    },
    onSuccess: (data, notificationId) => {
      queryClient.invalidateQueries(["notifications"]);
      queryClient.setQueryData(["notifications"], (oldNotifications) => {
        return oldNotifications?.map((note) =>
          note.id === notificationId ? { ...note, is_read: true } : note
        );
      });
    },
    onError: (error) => {
      console.error("Failed to mark notification as read:", error);
    },
  });
};

export const useDeleteNotificationService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notificationId) => {
      await api.delete(`auth/notifications/${notificationId}/delete/`);
    },
    onSuccess: (data, notificationId) => {
      queryClient.invalidateQueries(["notifications"]);
      queryClient.setQueryData(["notifications"], (oldNotifications) => {
        return oldNotifications?.filter((note) => note.id !== notificationId);
      });
    },
    onError: (error) => {
      console.error("Failed to delete notification:", error);
    },
  });
};

export const useDeleteAllReadNotificationsService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await api.delete("auth/notifications/delete-read/");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
    onError: (error) => {
      console.error("Failed to delete all read notifications:", error);
    },
  });
};

export const useDeleteAllNotificationsService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await api.delete("auth/notifications/delete-all/");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
    onError: (error) => {
      console.error("Failed to delete all notifications:", error);
    },
  });
};