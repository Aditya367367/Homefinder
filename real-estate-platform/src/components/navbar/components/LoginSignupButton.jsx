import React, { useState, useEffect } from "react";
import { Bell, User, XCircle, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getAccessToken } from "../../utils/authTokenStore";
import { useUserService } from "../../auth/services/user.services";
import {
  useNotificationsService,
  useMarkNotificationReadService,
  useDeleteNotificationService,
  useDeleteAllReadNotificationsService,
  useDeleteAllNotificationsService,
} from "../services/notification.services";
import ConfirmationDialog from "../../common-warnings/ConfirmationDialog";

const LoginSignupButton = () => {
  const [isLoggedIn] = useState(() => !!getAccessToken()); 
  const [showNotifications, setShowNotifications] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [isDestructiveAction, setIsDestructiveAction] = useState(false);

  const { user, isLoading: userLoading, isError: userError } = useUserService();
  const {
    data: notifications,
    isLoading: notificationsLoading,
    isError: notificationsError,
  } = useNotificationsService(isLoggedIn);

  const markAsReadMutation = useMarkNotificationReadService();
  const deleteNotificationMutation = useDeleteNotificationService();
  const deleteAllReadMutation = useDeleteAllReadNotificationsService();
  const deleteAllMutation = useDeleteAllNotificationsService();

  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0;
  const readCount = notifications?.filter((n) => n.is_read).length || 0;

  const toggleNotifications = () => {
    setShowNotifications((prev) => {
      const newState = !prev;
      if (newState && unreadCount > 0) {
        notifications?.forEach(note => {
          if (!note.is_read) {
            markAsReadMutation.mutate(note.id);
          }
        });
      }
      return newState;
    });
  };

  const triggerConfirmation = (message, action, isDestructive = false) => {
    setConfirmationMessage(message);
    setConfirmAction(() => action);
    setIsDestructiveAction(isDestructive);
    setShowConfirmation(true);
  };

  const handleDeleteNotificationClick = (notificationId) => {
    triggerConfirmation(
      "Are you sure you want to delete this notification?",
      () => deleteNotificationMutation.mutate(notificationId),
      false
    );
  };

  const handleDeleteAllReadClick = () => {
    triggerConfirmation(
      "Are you sure you want to delete all read notifications?",
      () => deleteAllReadMutation.mutate(),
      true
    );
  };

  const handleDeleteAllClick = () => {
    triggerConfirmation(
      "Are you absolutely sure you want to delete ALL notifications?",
      () => deleteAllMutation.mutate(),
      true
    );
  };

  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction();
    }
    setShowConfirmation(false);
    setConfirmAction(null);
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
    setConfirmAction(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showNotifications &&
        !event.target.closest(".notification-area") &&
        !event.target.closest(".confirmation-dialog-container")
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  const profilePicUrl = user?.profile_pic;

  if (!isLoggedIn) {
    return (
      <div className="flex gap-4 items-center">
        <Link to="/login">
          <button className="text-white border border-white px-4 py-1 rounded-md hover:bg-white hover:text-black transition">
            Login
          </button>
        </Link>
        <Link to="/signup">
          <button className="text-black bg-white px-4 py-1 rounded-md hover:bg-gray-200 transition">
            Signup
          </button>
        </Link>
      </div>
    );
  }

  if (userLoading || notificationsLoading) {
    return <p className="text-white">Loading...</p>;
  }

  if (userError || notificationsError) {
    console.error("Error fetching user or notifications:", userError || notificationsError);
    return <p className="text-red-500">login again</p>;
  }

  return (
    <div className="relative flex items-center gap-4 notification-area no-scrollbar">
      <button
        onClick={toggleNotifications}
        className="relative p-2 rounded-full hover:bg-white/10 transition-all duration-300"
      >
        <Bell size={20} className="text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute top-12 right-0 w-64 bg-[#1f2227] border border-gray-700 rounded-md shadow-lg z-50 no-scrollbar">
          <div className="p-3 text-sm text-white no-scrollbar">
            <h4 className="font-semibold mb-2">Notifications</h4>
            {notifications?.length === 0 ? (
              <p className="text-gray-400">No new notifications</p>
            ) : (
              <>
                <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {notifications?.map((note) => (
                    <li
                      key={note.id}
                      className={`p-2 rounded-md flex items-center justify-between group ${
                        note.is_read ? "bg-[#2a2d33] text-gray-400" : "bg-blue-800/30 text-white font-medium"
                      } hover:bg-[#32353a] cursor-pointer`}
                    >
                      <div>
                        {note.message}
                        <span className="block text-xs text-gray-500 mt-1">
                          {new Date(note.created_at).toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNotificationClick(note.id);
                        }}
                        className="ml-2 p-1 rounded-full text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Delete notification"
                      >
                        <XCircle size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 pt-3 border-t border-gray-700 flex flex-col gap-2">
                  {readCount > 0 && (
                    <button
                      onClick={handleDeleteAllReadClick}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white text-xs transition"
                    >
                      <Trash2 size={14} /> Delete All Read
                    </button>
                  )}
                  {notifications?.length > 0 && (
                    <button
                      onClick={handleDeleteAllClick}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-800 hover:bg-red-700 rounded-md text-white text-xs transition"
                    >
                      <Trash2 size={14} /> Delete All
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Link to="/profile">
        {profilePicUrl ? (
          <img
            src={profilePicUrl}
            alt="User Profile"
            className="w-9 h-9 rounded-full border-2 border-white hover:ring-2 hover:ring-blue-400 transition-all duration-300 object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center bg-gray-600 hover:ring-2 hover:ring-blue-400 transition-all duration-300">
            <User size={20} className="text-white" />
          </div>
        )}
      </Link>

      {showConfirmation && (
        <ConfirmationDialog
          message={confirmationMessage}
          onConfirm={handleConfirm}
          onCancel={handleCancelConfirmation}
          isDestructive={isDestructiveAction}
        />
      )}
    </div>
  );
};

export default LoginSignupButton;
