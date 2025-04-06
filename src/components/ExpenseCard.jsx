import React, { useState, useEffect } from "react";
import BudgetService from "../services/BudgetService";
import ExpenseService from "../services/expenseService"; // Import expense service
import "./ExpenseCard.css";

const ExpenseCard = () => {
    const [overallBudget, setOverallBudget] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [remainingBudget, setRemainingBudget] = useState(0); // Add remaining budget state

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("No token found. Please log in.");
                    return;
                }

                // Fetch budgets
                const budgets = await BudgetService.getCategoryBudgets(`Bearer ${token}`);

                // Find overall budget
                const overall = budgets.find((budget) => budget.category === "Overall Budget");
                const overallBudgetValue = overall ? overall.budgetAmount : 0;
                setOverallBudget(overallBudgetValue);

                // Fetch expenses
                const expenses = await ExpenseService.getExpenses(token);
                // Calculate total expense
                const totalSpent = expenses.reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0);
                setTotalExpense(totalSpent);

                // Calculate remaining budget
                setRemainingBudget(overallBudgetValue - totalSpent);

            } catch (error) {
                console.error("Error fetching data:", error.message);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="expense-card">
            <h2 className="card-title">Card</h2>
            <div className="amount-container">
                <div className="income-box">
                    <h3>Budget</h3>
                    <p>₹{overallBudget}</p>
                </div>
                <div className="expense-box">
                    <h3>Expense</h3>
                    <p>₹{totalExpense}</p>
                </div>
                <div className="remaining-box">
                    <h3>Remaining</h3>
                    <p>₹{remainingBudget}</p>
                </div>
            </div>
        </div>
    );
};

export default ExpenseCard;