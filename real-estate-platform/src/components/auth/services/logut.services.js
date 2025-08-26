import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getRefreshToken, clearTokens } from '../../utils/authTokenStore'; 
import api from '../../utils/axiosInstance'; 


const logoutAPI = () => {
  return api.post('/auth/logout/', {
    refresh: getRefreshToken(),
  });
};

export const useLogoutService = () => {
  const queryClient = useQueryClient();

  const { mutate, isLoading, isSuccess } = useMutation({
    mutationFn: logoutAPI,
    onSuccess: () => {
      try {
        clearTokens(); 
        localStorage.clear();
        sessionStorage.clear();
        queryClient.clear(); 

        
        setTimeout(() => {
          window.location.href = '/login';
        }, 800);
      } catch (err) {
        console.error('Logout cleanup error:', err);
      }
    },
    onError: (err) => {
      console.error('Logout failed:', err);
      clearTokens();
      queryClient.clear();
      localStorage.clear();
      sessionStorage.clear();

      setTimeout(() => {
        window.location.href = '/login';
      }, 800);
    },
  });

  return {
    handleLogout: mutate,
    isLoading,
    isSuccess,
  };
};
