import React, { useState, useEffect } from "react";
import axios from "axios";
import AddGoalForm from "./addGoals"; // Import Add Goal Form
import GoalModal from "./GoalModal"; // Import Goal Modal
import "./Goals.css";

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isAddingGoal, setIsAddingGoal] = useState(false); // Control modal visibility

  // Function to fetch goals
  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get("http://localhost:5000/api/goals", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setGoals(response.data);
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  // Fetch goals on mount
  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <div className="goals-containers">
      <h2 className="goals-title">Your Goals</h2>

      {/* Button to open Add Goal Form */}
      {/* <button className="add-goal-btn" onClick={() => setIsAddingGoal(true)}>
        Add New Goal
      </button> */}

      {/* Render Add Goal Form Modal */}
      {isAddingGoal && (
        <AddGoalForm
          onGoalAdded={() => {
            setIsAddingGoal(false);
            fetchGoals(); // Refresh goals after adding a new one
          }}
        />
      )}

      {/* Render Goals */}
      <div className="goals-grid">
        {goals.map((goal) => {
          const savedAmount = goal.savedAmount || 0; // Handle undefined
          const progress = (savedAmount / goal.goalAmount) * 100;

          return (
            <div
              key={goal._id}
              className="goal-card"
              onClick={() => setSelectedGoal(goal)}
            >
              {/* Show Image If Available */}
              {goal.image && (
                <img
                  src={`http://localhost:5000/uploads/${goal.image}`}
                  alt={goal.goal}
                  className="goal-image"
                />
              )}

              <h3 className="goal-name">{goal.goal}</h3>
              <p className="goal-amount">Target: ₹{goal.goalAmount}</p>
              <p className="goal-saved">Saved: ₹{savedAmount}</p>

              {/* Progress Bar */}
              <div className="progress-bar">
                <div className="progress" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Goal Modal */}
      {selectedGoal && (
        <GoalModal 
          goal={selectedGoal} 
          onClose={() => setSelectedGoal(null)} 
          onGoalUpdated={fetchGoals} // ✅ Refresh goals when updated/deleted
        />
      )}
    </div>
  );
};

export default Goals;
