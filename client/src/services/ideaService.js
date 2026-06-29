import api from "./api";

export const getIdeas = async (params = {}) => {
  return api.get("/ideas", { params });
};

export const getIdeaById = async (id) => {
  return api.get(`/ideas/${id}`);
};

export const createIdea = async (ideaData) => {
  return api.post("/ideas", ideaData);
};

export const updateIdea = async (id, ideaData) => {
  return api.put(`/ideas/${id}`, ideaData);
};

export const deleteIdea = async (id) => {
  return api.delete(`/ideas/${id}`);
};

export const toggleBookmark = async (id) => {
  return api.patch(`/ideas/${id}/bookmark`);
};

export const getIdeaStats = async () => {
  return api.get("/ideas/stats");
};
