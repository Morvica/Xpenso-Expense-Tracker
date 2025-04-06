import axios from 'axios';

const API_URL = 'http://localhost:5000/api/expense';

const expenseService = {
    async getExpenses(token) {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.get(API_URL, config);
        return response.data;
    },

    async addExpense(token, expenseData) {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.post(API_URL, expenseData, config);
        return response.data;
    },

    async deleteExpense(token, expenseId) {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.delete(`${API_URL}/${expenseId}`, config); // Corrected URL
        return response.data;
    },

    async updateExpense(token, expenseId, expenseData) {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.put(`${API_URL}/${expenseId}`, expenseData, config); // Corrected URL
        return response.data;
    },
};

export default expenseService;