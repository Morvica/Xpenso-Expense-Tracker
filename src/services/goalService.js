import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/goals";

const getGoals = async (token) => {
  const response = await axios.get(API_BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const addGoal = async (token, formData) => {
  const response = await axios.post(API_BASE_URL, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export default { getGoals, addGoal };
