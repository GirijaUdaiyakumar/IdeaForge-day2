import api from "./api";

export const login = async (email, password) => {
  const { data } = await api.post("/auth/login", { email, password });
  if (data?.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));
  }
  return { user: data };
};

export const signup = async (name, email, password) => {
  const { data } = await api.post("/auth/register", { name, email, password });
  if (data?.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));
  }
  return { user: data };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const getProfile = async () => {
  const { data } = await api.get("/auth/profile");
  return data;
};

export const updateProfile = async (updates) => {
  const { data } = await api.put("/auth/profile", updates);
  // Update local cache
  const user = getCurrentUser();
  if (user) {
    localStorage.setItem("user", JSON.stringify({ ...user, ...data }));
  }
  return data;
};

const authService = {
  login,
  signup,
  logout,
  getCurrentUser,
  getProfile,
  updateProfile,
};

export default authService;
