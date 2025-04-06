// BudgetService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/budget";

const getOverallBudget = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/overall`, {
            headers: { Authorization: token },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching overall budget:", error);
        throw error;
    }
};

const getCategoryBudgets = async (token) => {
    try {
        if (!token) {
            throw new Error("No token found. Please log in.");
        }

        const formattedToken = token.startsWith("Bearer ")
            ? token
            : `Bearer ${token}`;

        const response = await axios.get(`${API_BASE_URL}/`, {
            headers: { Authorization: formattedToken },
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching category budgets:", error);
        throw error;
    }
};

const setBudget = async (token, category, budgetAmount) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/set`,
            {
                category,
                budgetAmount,
            },
            {
                headers: { Authorization: token },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error setting budget:", error);
        throw error;
    }
};

const updateBudget = async (token, category, budgetAmount) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/:id`,
            {
                category,
                budgetAmount,
            },
            {
                headers: { Authorization: token },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating budget:", error);
        throw error;
    }
};

export default {
    getOverallBudget,
    getCategoryBudgets,
    setBudget,
    updateBudget,
};