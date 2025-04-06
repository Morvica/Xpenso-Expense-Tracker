import React, { useState } from "react";
import axios from "axios";

const AddGoalForm = ({ onGoalAdded = () => {}, onClose }) => {
    const [goal, setGoal] = useState("");
    const [goalAmount, setGoalAmount] = useState("");
    const [deadline, setDeadline] = useState("");
    const [image, setImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("goal", goal);
        formData.append("goalAmount", parseFloat(goalAmount));
        formData.append("deadline", deadline);
        if (image) formData.append("image", image);

        console.log("Sending Form Data:");
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:5000/api/goals", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            alert("Goal added!");
            onGoalAdded();
            onClose(); // Close the form
        } catch (error) {
            console.error("Error adding goal:", error.response?.data || error.message);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96 relative"> {/* Increased padding to p-8 */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-200 p-2"
                >
                    &#x274C; {/* Cross Sign */}
                </button>
                <form onSubmit={handleSubmit} className="mt-4">
                    <input
                        type="text"
                        name="goal"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder="Goal Name"
                        required
                        className="w-full p-2 border border-teal-500 rounded mb-2 bg-gray-700 text-white"
                    />

                    <input
                        type="number"
                        name="goalAmount"
                        value={goalAmount}
                        onChange={(e) => setGoalAmount(e.target.value)}
                        placeholder="Target Amount"
                        required
                        className="w-full p-2 border border-teal-500 rounded mb-2 bg-gray-700 text-white"
                    />

                    <input
                        type="date"
                        name="deadline"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        required
                        className="w-full p-2 border border-teal-500 rounded mb-2 bg-gray-700 text-white"
                    />

                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                        className="w-full p-2 border border-teal-500 rounded mb-2 bg-gray-700 text-white"
                    />

                    <button type="submit" className="mt-4 bg-teal-600 text-white py-2 px-4 rounded w-full hover:bg-teal-700">
                        Add Goal
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddGoalForm;