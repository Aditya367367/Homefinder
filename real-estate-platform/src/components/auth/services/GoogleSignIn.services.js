import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useGoogleLogin } from '@react-oauth/google';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

import { setTokens} from '../../utils/authTokenStore'; 
import api from '../../utils/axiosInstance';


const loginAPI = async ({ access_token }) => {
  const response = await api.post('/auth/google-login/', { access_token });
  const user = response?.data?.user;
  const tokens = response?.data?.tokens;
  return {
    message: 'Logged in successfully',
    tokens: {
      access: tokens?.access,
      refresh: tokens?.refresh,
    },
    user: {
      fullName: user?.name || '',
      email: user?.email || '',
    },
  };
};

export const useGoogleSignIn = () => {
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { mutate, isLoading, isError, data, error } = useMutation({
        mutationFn: loginAPI,
        onSuccess: (responseData) => {
            const { tokens, message } = responseData;
            
            setTokens({ access: tokens?.access, refresh: tokens?.refresh });

            enqueueSnackbar(message || 'Logged in successfully!', {
                variant: 'success',
            });

            queryClient.invalidateQueries({ queryKey: ['userData'] });
            navigate('/');
        },
        onError: (error) => {
            console.error('Login error:', error.response?.data);
            const errorMessage = error.response?.data?.error || 'Something went wrong';
            enqueueSnackbar(errorMessage, { variant: 'error' });
        },
    });

    const googleLogin = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            mutate({ access_token: tokenResponse.access_token });
        },
        onError: (error) => {
            console.error('Google login error:', error);
            enqueueSnackbar('Google login failed. Please try again.', { variant: 'error' });
        },
    });

    return {
        loginWithGoogle: googleLogin,
        isLoading,
        isError,
        data,
        error,
    };
};