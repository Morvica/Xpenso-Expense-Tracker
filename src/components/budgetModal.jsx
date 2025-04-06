import React, { useState, useEffect } from "react";
import axios from "axios";
import './budgetModal.css'; // Import your CSS file

const BudgetModal = ({ isOpen, onClose, budgetData, onBudgetSet }) => {
    const [category, setCategory] = useState("Overall Budget");
    const [amount, setAmount] = useState("");

    useEffect(() => {
        if (budgetData) {
            setCategory(budgetData.category);
            setAmount(budgetData.budgetAmount);
        } else {
            setCategory("Overall Budget");
            setAmount("");
        }
    }, [budgetData]);

    const handleSave = async () => {
        if (Number.isNaN(Number(amount)) || Number(amount) <= 0) {
            alert("Please enter a valid budget amount.");
            return;
        }

        const payload = { category, budgetAmount: Number(amount) };
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('No token found. Please log in again.');
                return;
            }
            const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

            if (budgetData) {
                await axios.put(`http://localhost:5000/api/budget/${budgetData._id}`, payload, { headers: { Authorization: authToken } });
            } else {
                await axios.post("http://localhost:5000/api/budget/set", payload, { headers: { Authorization: authToken } });
            }
            onBudgetSet?.();
            onClose();
        } catch (error) {
            console.error("Error saving budget:", error?.response?.data?.message || error.message);
            alert(error?.response?.data?.message || "Failed to save budget.");
        }
    };

    return (
        <div className={`modal-overlay ${isOpen ? 'show-modal' : ''}`}>
            <div className="modal-container">
                <button onClick={onClose} className="close-button">&times;</button>
                <h2 className="modal-title">{budgetData ? "Edit Budget" : "Add Budget"}</h2>

                <label className="modal-label">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="modal-input">
                    {["Overall Budget", "Food", "Transport", "Entertainment", "Education", "Housing", "Health"].map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <label className="modal-label">Budget Amount</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="modal-input"
                    placeholder="Enter amount"
                />

                <button onClick={handleSave} className="modal-button">
                    {budgetData ? "Update Budget" : "Add Budget"}
                </button>
            </div>
        </div>
    );
};

export default BudgetModal;