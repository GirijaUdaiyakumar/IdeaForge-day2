import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

const login = async (email, password) => {
  const response = await axios.post(
    `${API_URL}/login`,
    {
      email,
      password,
    }
  );

  if (response.data.token) {
    localStorage.setItem(
      "token",
      response.data.token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(response.data)
    );
  }

  return {
    user: response.data,
  };
};

const signup = async (
  name,
  email,
  password
) => {
  const response = await axios.post(
    `${API_URL}/register`,
    {
      name,
      email,
      password,
    }
  );

  if (response.data.token) {
    localStorage.setItem(
      "token",
      response.data.token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(response.data)
    );
  }

  return {
    user: response.data,
  };
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  const user =
    localStorage.getItem("user");

  return user
    ? JSON.parse(user)
    : null;
};

const authService = {
  login,
  signup,
  logout,
  getCurrentUser,
};

export default authService;