import api from "./api";

export const generateStartupIdea = async (prompt, save = false) => {
  const response = await api.post("/ai/generate", { prompt, save });
  return response.data;
};

export const chatWithAI = async ({ message, persona, chatId, history }) => {
  const response = await api.post("/ai/chat", { message, persona, chatId, history });
  return response.data;
};

export const analyzeCompetitors = async ({ startup, industry }) => {
  const response = await api.post("/ai/competitors", { startup, industry });
  return response.data;
};

export const validateMarket = async ({ idea, targetMarket }) => {
  const response = await api.post("/ai/validate", { idea, targetMarket });
  return response.data;
};

export const generatePitch = async (data) => {
  const response = await api.post("/ai/pitch", data);
  return response.data;
};

export const generateBusinessPlan = async (data) => {
  const response = await api.post("/ai/business-plan", data);
  return response.data;
};

export const getChatHistory = async () => {
  const response = await api.get("/ai/chats");
  return response.data;
};

export const getChatById = async (id) => {
  const response = await api.get(`/ai/chats/${id}`);
  return response.data;
};

export const deleteChat = async (id) => {
  const response = await api.delete(`/ai/chats/${id}`);
  return response.data;
};

// Legacy export for backward compat
const generateIdea = async (prompt) => {
  const response = await api.post("/ai/generate", { prompt });
  return response.data;
};

export default generateIdea;
