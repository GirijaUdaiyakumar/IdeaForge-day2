import api from "./api";

export const awardXP = async (action, amount) => {
  const { data } = await api.post("/user/xp", { action, amount });
  return data;
};

export const getDailyMissions = async () => {
  const { data } = await api.get("/user/missions");
  return data;
};

export const completeMission = async (missionId) => {
  const { data } = await api.post(`/user/missions/${missionId}/complete`);
  return data;
};

export const getBadges = async () => {
  const { data } = await api.get("/user/badges");
  return data;
};

export const updateStreak = async () => {
  const { data } = await api.post("/user/streak");
  return data;
};
