// src/components/RecentExpenses.jsx
import React, { useState, useEffect } from "react";
import ExpenseService from "../services/expenseService"; // Import ExpenseService
import "./RecentExpenses.css";

const RecentExpenses = () => {
    const [recentExpenses, setRecentExpenses] = useState([]);

    useEffect(() => {
        const fetchRecentExpenses = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("No token found. Please log in.");
                    return;
                }

                const expenses = await ExpenseService.getExpenses(token);

                // Sort expenses by date (assuming date is in ISO format)
                const sortedExpenses = expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

                // Take only the first 3 expenses
                const top3Expenses = sortedExpenses.slice(0, 3);

                setRecentExpenses(top3Expenses);
            } catch (error) {
                console.error("Error fetching recent expenses:", error);
            }
        };

        fetchRecentExpenses();
    }, []);

    return (
        <div className="recent-expense">
            <h2>Recent Expenses</h2>
            <table>
                <thead>
                    <tr>
                        <th>Commodity</th>
                        <th>Price (₹)</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {recentExpenses.map((expense, index) => (
                        <tr key={index}>
                            <td>{expense.description}</td>
                            <td>{expense.amount}</td>
                            <td>{new Date(expense.date).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RecentExpenses;