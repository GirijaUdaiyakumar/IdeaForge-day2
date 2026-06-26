import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const generateIdea = async (prompt) => {
  const response = await API.post("/ai/chat", {
    prompt,
  });

  return response.data;
};

export default generateIdea;