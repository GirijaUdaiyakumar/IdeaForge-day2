import axios from "axios";

const API_URL =
"http://localhost:5000/api/ai";

export const generateIdea =
async (prompt) => {

  const response =
  await axios.post(
    `${API_URL}/generate`,
    { prompt }
  );

  return response.data;
};