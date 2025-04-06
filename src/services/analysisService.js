// src/services/analysisService.js
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/analysis"; // Adjust if different

export const fetchAnalysis = async (token) => {
  const res = await axios.get(`${BASE_URL}/summary`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
  return res.data;
};

export const fetchFilteredAnalysis = async (startDate, endDate, token) => {
  const res = await axios.get(`${BASE_URL}/filter`, {
    params: { startDate, endDate },
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
  return res.data;
};

// Add this to analysisService.js
export const fetchOverallBudget = async (token) => {
    const res = await fetch("http://localhost:5000/api/budget/overall", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) {
      throw new Error("Failed to fetch budget data");
    }
  
    const data = await res.json();
    return data; // ✅ Not data.data — just return the parsed JSON
  };
  
  
  
  