

import { getAccessToken } from './authTokenStore'; 

export const getAuthHeaders = () => { 
  const token = getAccessToken();
  if (token) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }
  return {};
};