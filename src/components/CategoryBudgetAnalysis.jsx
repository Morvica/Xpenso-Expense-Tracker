import React, { useState, useEffect } from "react";
import { FaUtensils, FaBus, FaFilm, FaGraduationCap, FaHome, FaHeart } from "react-icons/fa";
import BudgetService from "../services/BudgetService";
import ExpenseService from "../services/expenseService"; // Import ExpenseService
import "./CategoryBudgetAnalysis.css";

const categoryIcons = {
    Food: <FaUtensils />,
    Transport: <FaBus />,
    Entertainment: <FaFilm />,
    Education: <FaGraduationCap />,
    Housing: <FaHome />,
    Health: <FaHeart />,
};

const categoryColors = {
    Food: "#6A5ACD",
    Transport: "#9370DB",
    Entertainment: "#8A2BE2",
    Education: "#FFD700",
    Housing: "#FF4500",
    Health: "#FF1493",
};

const CategoryBudgetAnalysis = () => {
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("No token found. Please log in.");
                    return;
                }

                // Fetch budget data
                const budgetData = await BudgetService.getCategoryBudgets(`Bearer ${token}`);
                const categoryBudgets = budgetData.filter((budget) => budget.category !== "Overall Budget");

                // Fetch expense data
                const expenses = await ExpenseService.getExpenses(token);

                // Calculate spent amounts per category
                const categorySpent = {};
                expenses.forEach((expense) => {
                    if (categorySpent[expense.category]) {
                        categorySpent[expense.category] += parseFloat(expense.amount) || 0;
                    } else {
                        categorySpent[expense.category] = parseFloat(expense.amount) || 0;
                    }
                });

                // Update budgets with actual spent amounts
                const updatedBudgets = categoryBudgets.map((budget) => {
                    return {
                        ...budget,
                        spent: categorySpent[budget.category] || 0,
                    };
                });

                setBudgets(updatedBudgets);
            } catch (error) {
                console.error("Error fetching data:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="category-budget-container">
            <h2>Category Breakdown</h2>

            {loading ? (
                <p>Loading budget analysis...</p>
            ) : budgets.length > 0 ? (
                budgets.map((budget, index) => {
                    const spent = budget.spent || 0;
                    const percentage = budget.budgetAmount > 0 ? (spent / budget.budgetAmount) * 100 : 0;
                    const barWidth = Math.min(percentage, 150);
                    const color = categoryColors[budget.category] || "#6A5ACD";

                    return (
                        <div key={index} className="category-item">
                            <div className="category-header">
                                <span className="icon" style={{ background: `linear-gradient(45deg, ${color}, #444)` }}>
                                    {categoryIcons[budget.category] || <FaHeart />}
                                </span>
                                <div className="category-details">
                                    <p>{budget.category}</p>
                                    <span>{`₹${spent} of ₹${budget.budgetAmount}`}</span>
                                </div>
                                <span className="percentage">{`${percentage.toFixed(0)}%`}</span>
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${barWidth}%`, background: color, opacity: barWidth > 0 ? 1 : 0.3 }}
                                ></div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <p className="text-gray-500">No budget data available.</p>
            )}
        </div>
    );
};

export default CategoryBudgetAnalysis;