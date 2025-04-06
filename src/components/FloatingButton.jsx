import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FloatingButton.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faChartLine, faWallet, faBullseye } from "@fortawesome/free-solid-svg-icons";
import BudgetModal from "./BudgetModal";
// import ExpenseModal from "./ExpenseModal";
import GoalsModal from "./addGoals";

const FloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const navigate = useNavigate();

  const openModal = (modalName) => {
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="floating-container">
      {/* Floating Buttons */}
      <div className="floating-buttons">
        <button className={`floating-btn ${isOpen ? "show" : ""}`} onClick={() => openModal("budget")}>
          <span className="tooltip">Add Budget</span>
          <FontAwesomeIcon icon={faChartLine} />
        </button>
        {/* <button className={`floating-btn ${isOpen ? "show" : ""}`} onClick={() => openModal("expense")}>
          <span className="tooltip">Add Expense</span>
          <FontAwesomeIcon icon={faWallet} />
        </button> */}
        <button className={`floating-btn ${isOpen ? "show" : ""}`} onClick={() => openModal("goals")}>
          <span className="tooltip">Add Goal</span>
          <FontAwesomeIcon icon={faBullseye} />
        </button>
      </div>

      {/* Main Floating Button */}
      <button className="main-floating-btn" onClick={() => setIsOpen(!isOpen)}>
        <FontAwesomeIcon icon={faPlus} />
      </button>

      {/* Modals */}
      {activeModal === "budget" && <BudgetModal isOpen={true} onClose={closeModal} />}
      {activeModal === "expense" && <ExpenseModal isOpen={true} onClose={closeModal} />}
      {activeModal === "goals" && <GoalsModal isOpen={true} onClose={closeModal} />}
    </div>
  );
};

export default FloatingButton;
