import axios from "axios";

const API_URL = "http://localhost:5000/api/ideas";

const getToken = () => {
  return localStorage.getItem("token");
};

const config = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

export const getIdeas = async () => {
  return axios.get(API_URL, config());
};

export const createIdea = async (ideaData) => {
  return axios.post(
    API_URL,
    ideaData,
    config()
  );
};

export const updateIdea = async (
  id,
  ideaData
) => {
  return axios.put(
    `${API_URL}/${id}`,
    ideaData,
    config()
  );
};

export const deleteIdea = async (id) => {
  return axios.delete(
    `${API_URL}/${id}`,
    config()
  );
};