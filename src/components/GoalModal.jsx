import React, { useState } from "react";
import axios from "axios";

const GoalsModal = ({ goal, onClose, onGoalUpdated }) => {
    const [goalName, setGoalName] = useState(goal.goal);
    const [goalAmount, setGoalAmount] = useState(goal.goalAmount);
    const [savedAmount, setSavedAmount] = useState(goal.savedAmount);
    const [deadline, setDeadline] = useState(goal.deadline.split("T")[0]);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(goal.image ? `http://localhost:5000/uploads/${goal.image}` : null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleUpdate = async () => {
        const formData = new FormData();
        formData.append("goal", goalName);
        formData.append("goalAmount", goalAmount);
        formData.append("savedAmount", savedAmount);
        formData.append("deadline", deadline);
        if (image) formData.append("image", image);

        try {
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:5000/api/goals/${goal._id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            alert("Goal updated successfully!");
            onGoalUpdated();
            onClose();
        } catch (error) {
            console.error("Error updating goal:", error);
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this goal?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5000/api/goals/${goal._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Goal deleted!");
            onGoalUpdated();
            onClose();
        } catch (error) {
            console.error("Error deleting goal:", error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold text-teal-400 mb-4 text-center">Edit Goal</h2>
                {preview && <img src={preview} alt="Goal" className="w-full h-40 object-cover rounded-lg mb-4" />}
                <input type="text" value={goalName} onChange={(e) => setGoalName(e.target.value)} className="w-full p-2 border border-teal-500 rounded mb-2 bg-gray-700 text-white" />
                <input type="number" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} className="w-full p-2 border border-teal-500 rounded mb-2 bg-gray-700 text-white" />
                <input type="number" value={savedAmount} onChange={(e) => setSavedAmount(e.target.value)} className="w-full p-2 border border-teal-500 rounded mb-2 bg-gray-700 text-white" />
                <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full p-2 border border-teal-500 rounded mb-2 bg-gray-700 text-white" />
                <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-2 border border-teal-500 rounded mb-2 bg-gray-700 text-white" />

                <div className="flex justify-between mt-4">
                    <button onClick={handleUpdate} className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700">Update</button>
                    <button onClick={handleDelete} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">Delete</button>
                    <button onClick={onClose} className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">Close</button>
                </div>
            </div>
        </div>
    );
};

export default GoalsModal;