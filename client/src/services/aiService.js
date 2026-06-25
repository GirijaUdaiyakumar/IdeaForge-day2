import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

const generateIdea = async (prompt) => {
  const response = await API.post("/ai/chat", {
    prompt,
  });

  return response.data;
};

export default generateIdea;