import React, { useState } from "react";
import ExpenseCard from "../components/ExpenseCard";
import RecentExpenses from "../components/RecentExpenses";
import Goals from "../components/Goals";
import DailySpendingChart from "../components/DailySpendingChart";
import ScholarshipAndAid from "../components/ScholarshipAndAid";
import CategoryBudgetAnalysis from "../components/CategoryBudgetAnalysis";
import Sidebar from "../components/Sidebar"; // ✅ Sidebar
import FloatingButton from "../components/FloatingButton"; // ✅ Floating Button
import "./Dashboard.css"; // ✅ CSS

const Dashboard = () => {
  const [isExpanded, setIsExpanded] = useState(false); // ✅ Sidebar toggle

  // ✅ Format date with time
  const formatDateWithTime = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    const getOrdinal = (n) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return s[(v - 20) % 10] || s[v] || s[0];
    };

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");

    const time = `${formattedHours}:${formattedMinutes} ${ampm}`;
    return `${day}${getOrdinal(day)} ${month} ${year}, ${time}`;
  };

  const currentTime = new Date();

  return (
    <div className="dashboard-container">
      {/* ✅ Sidebar */}
      <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

      {/* ✅ Main Content */}
      <div className={`dashboard-grid ${isExpanded ? "dashboard-grid-expanded" : ""}`}>
        
        {/* ✅ Header */}
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h1>DASHBOARD</h1>
            <p className="dashboard-time">{formatDateWithTime(currentTime)}</p>
          </div>
        </div>

        {/* ✅ ExpenseCard + RecentExpenses */}
        <div className="card-recent-expense-container">
          <div className="expense-card-container">
            <ExpenseCard />
          </div>
          <div className="recent-expenses">
            <RecentExpenses />
          </div>
        </div>

        {/* ✅ Daily Chart + Goals */}
        <div className="chart-goals-container">
          <div className="chart-container">
            <DailySpendingChart />
          </div>
          {/* <div className="goals-container">
            <Goals />
          </div> */}
        </div>

        {/* ✅ Scholarship + Category Budget */}
        <div className="scholarship-budget-container">
          {/* <div className="scholarship-container">
            <ScholarshipAndAid />
          </div> */}
          <div className="goals-container">
            <Goals />
          </div>
          <div className="budget-container">
            <CategoryBudgetAnalysis />
          </div>
        </div>
      </div>

      {/* ✅ Floating Button */}
      <FloatingButton />
    </div>
  );
};

export default Dashboard;
