import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import "./Analysis.css";
import {
  fetchFilteredAnalysis,
  fetchOverallBudget, // Ensure this fetches *all* monthly budgets from DB
} from "../services/analysisService";
import Sidebar from "../components/Sidebar"; // Import Sidebar
import FloatingButton from "../components/FloatingButton"; // Import Floating Button

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  TimeScale
);

const Analytics = () => {
  const [budget, setBudget] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [savings, setSavings] = useState(0);
  const [goal, setGoal] = useState(300);
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-12-31");
  const [isExpanded, setIsExpanded] = useState(false); // Sidebar state

  useEffect(() => {
    const token = localStorage.getItem("token");

    const getData = async () => {
      try {
        const budgets = await fetchOverallBudget(token); // returns { budgetAmount: 1200 }
        console.log("Fetched budget:", budgets);
    
        // ✅ Directly use the value if it's a single object
        const totalBudget = budgets.budgetAmount || 0;
        setBudget(totalBudget);
    
        // ✅ Fetch filtered expenses
        const filtered = await fetchFilteredAnalysis(startDate, endDate, token);
        const formatted = filtered.map((item) => ({
          category: item.category || item._id || "Unknown",
          amount: item.amount || item.total || 0,
          date: item.date ? new Date(item.date) : new Date(),
        }));
    
        setFilteredExpenses(formatted);
    
        const totalExpenses = formatted.reduce((sum, e) => sum + e.amount, 0);
        setExpenses(totalExpenses);
        setSavings(totalBudget - totalExpenses);
      } catch (err) {
        console.error("Error loading analysis:", err);
      }
    };
    

    getData();
  }, [startDate, endDate]);

  // 🥧 Pie Chart Data
  const categorySpend = {};
  filteredExpenses.forEach(({ category, amount }) => {
    categorySpend[category] = (categorySpend[category] || 0) + amount;
  });

  const mostSpentCategory = Object.entries(categorySpend).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  const pieData = {
    labels: Object.keys(categorySpend),
    datasets: [
      {
        data: Object.values(categorySpend),
        backgroundColor: [
          "#14b8a6",
          "#0f172a",
          "#1e40af",
          "#a3e635",
          "#e11d48",
          "#6366f1",
        ],
      },
    ],
  };

  // 📊 Bar Chart Data
  const getMonthKey = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;
  };

  const monthMap = {};
  filteredExpenses.forEach((expense) => {
    const key = getMonthKey(expense.date);
    monthMap[key] = (monthMap[key] || 0) + expense.amount;
  });

  const monthLabels = Object.keys(monthMap).sort();
  const expenseValues = monthLabels.map((key) => monthMap[key]);

  const barData = {
    labels: monthLabels,
    datasets: [
      {
        label: "Expenses",
        data: expenseValues,
        backgroundColor: "#0f172a",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Amount ($)",
        },
      },
    },
  };

  return (
    <div className="analytics-container">
       <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
       <div className={`analysis-grid-container ${isExpanded ? "analysis-grid-container-expanded" : ""}`}>
        <div className="header">
        <h1>Welcome back 👋</h1>
        <p>
          You're ${Math.max(0, goal - savings)} away from your savings goal{" "}
          <span>keep going! 🫶</span>
        </p>

        <div className="goal-input">
          <label>Set Monthly Goal:</label>
          <input
            type="number"
            value={goal}
            onChange={(e) => setGoal(parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="stats-cards">
        <div className="card">
          <h3>Total Budget (in range)</h3>
          <h2>${budget}</h2>
          <p className="increase">📊 Summed per month</p>
        </div>
        <div className="card">
          <h3>Total Expenses</h3>
          <h2>${expenses}</h2>
          <p className="decrease">⬇ vs previous period</p>
        </div>
        <div className="card">
          <h3>Savings</h3>
          <h2>${savings}</h2>
          <p className="increase">⬆ vs previous period</p>
        </div>
      </div>

      <div className="date-filters">
        <label>Start Date:</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <label>End Date:</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>

      <div className="monthly-summary">
        <h2>Summary ({startDate} - {endDate})</h2>
        <div className="summary-box">
          💸 Total Spent: ${expenses}<br />
          💰 Total Saved: ${savings}<br />
          📊 Most spent on: {mostSpentCategory}
        </div>
      </div>

      <div className="charts">
        <div className="bar-chart">
          <h3>Expenses Over Time</h3>
          <Bar data={barData} options={barOptions} height={300} />
        </div>
        <div className="pie-chart">
          <h3>Spending Distribution</h3>
          <Pie
            data={pieData}
            options={{ responsive: true, maintainAspectRatio: false }}
            height={300}
          />
        </div>
      </div>
    </div>
    <FloatingButton />
        </div>
  );
};

export default Analytics;
