import api from "./api";

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const register = async (data: RegisterData) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const login = async (data: LoginData) => {
  const response = await api.post("/auth/login", data);

  const { token } = response.data;

  if (token) {
    localStorage.setItem("token", token);
  }

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const verifyEmail = async (token: string) => {
  const response = await api.get("/auth/verify-email", {
    params: {
      token,
    },
  });

  return response.data;
};