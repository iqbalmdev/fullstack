import { authApi } from "../interceptor";


export const login = async (email: string, password: string) => {
  const { data } = await authApi.post("/auth/login", { email, password });
  document.cookie = `token=${data.token}; path=/`;
  return data;
};

export const register = async (email: string, password: string) => {
  const { data } = await authApi.post("/auth/register", { email, password });
  return data;
};

export const logout = () => {
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  window.location.href = "/login";
};
