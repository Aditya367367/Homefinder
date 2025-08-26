import api from "./axiosInstance";
import { getRefreshToken, setTokens, clearTokens } from "./authTokenStore";

export async function refreshToken() {
  const refresh = getRefreshToken();

  if (!refresh) {
    clearTokens();
    throw new Error("No refresh token found");
  }

  try {
    const res = await api.post(
      "/token/refresh/",
      { refresh },
      { headers: { "Content-Type": "application/json" } }
    );

    const { access, refresh: newRefresh } = res.data;

    if (access) {
      setTokens({ access, refresh: newRefresh || refresh });
      return access;
    }

    throw new Error("Token refresh failed");
  } catch (err) {
    clearTokens();
    throw err;
  }
}
