import React, { useState, useEffect } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    BarChart,
    Bar,
    Legend,
    ResponsiveContainer
} from "recharts";
import ExpenseService from "../services/expenseService";
import "./DailySpendingChart.css";

const DailySpendingChart = () => {
    const [view, setView] = useState("weekly");
    const [chartType, setChartType] = useState("area");
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExpenses = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("No token found. Please log in.");
                    return;
                }

                const expenses = await ExpenseService.getExpenses(token);

                const processedData = processExpenseData(expenses);
                setChartData(processedData);
            } catch (error) {
                console.error("Error fetching expenses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExpenses();
    }, [view]); // Re-run when view changes (weekly/monthly)

    const processExpenseData = (expenses) => {
        const now = new Date();
    
        if (view === "weekly") {
            const startOfWeek = new Date(now);
            const dayOfWeek = now.getDay(); // 0 = Sunday
            startOfWeek.setDate(now.getDate() - dayOfWeek);
            startOfWeek.setHours(0, 0, 0, 0);
    
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);
    
            const weeklyExpenses = expenses.filter(exp => {
                const expDate = new Date(exp.date);
                return expDate >= startOfWeek && expDate <= endOfWeek;
            });
    
            const weekly = {};
    
            weeklyExpenses.forEach((expense) => {
                const dateObj = new Date(expense.date);
                const day = dateObj.toLocaleDateString("en-US", { weekday: "short" });
                const dateStr = dateObj.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                });
    
                if (weekly[day]) {
                    weekly[day].amount += parseFloat(expense.amount) || 0;
                } else {
                    weekly[day] = {
                        day,
                        date: dateStr,
                        amount: parseFloat(expense.amount) || 0
                    };
                }
            });
    
            return Object.values(weekly);
        } else {
            // Monthly view
            const currentMonth = now.getMonth(); // 0-indexed
            const currentYear = now.getFullYear();

            const monthlyExpenses = expenses.filter(exp => {
                const expDate = new Date(exp.date);
                return (
                    expDate.getMonth() === currentMonth &&
                    expDate.getFullYear() === currentYear
                );
            });

            const monthly = {};

            monthlyExpenses.forEach((expense) => {
                const dateObj = new Date(expense.date);
                const startOfMonth = new Date(currentYear, currentMonth, 1);
                const dayOfMonth = dateObj.getDate();

                // Week number in the month (1-based)
                const week = Math.ceil((dayOfMonth + startOfMonth.getDay()) / 7);
                const weekLabel = `Week ${week}`;

                if (monthly[weekLabel]) {
                    monthly[weekLabel].amount += parseFloat(expense.amount) || 0;
                } else {
                    monthly[weekLabel] = {
                        day: weekLabel,
                        amount: parseFloat(expense.amount) || 0,
                        date: dateObj.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                        })
                    };
                }
            });
            return Object.values(monthly);
        }
    };
    

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-day">{payload[0].payload.day}</p>
                    <p className="tooltip-date">{payload[0].payload.date}</p>
                    <p className="tooltip-amount">₹{payload[0].value}</p>
                </div>
            );
        }
        return null;
    };
    

    return (
        <div className="chart-containers">
            <div className="chart-header">
                <h3 className="chart-title">Spending Overview</h3>
                <div className="chart-controls">
                    <button onClick={() => setView(view === "weekly" ? "monthly" : "weekly")}>
                        {view === "weekly" ? "Switch to Monthly" : "Switch to Weekly"}
                    </button>
                    <button onClick={() => setChartType(chartType === "area" ? "bar" : "area")}>
                        {chartType === "area" ? "Switch to Bar" : "Switch to Line"}
                    </button>
                </div>
            </div>

            {loading ? (
                <p>Loading chart data...</p>
            ) : (
                <ResponsiveContainer width="100%" height={150}>
                    {chartType === "area" ? (
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00c6ff" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#0072ff" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "white", strokeWidth: 1 }} />
                            <Legend />
                            <Area
                                type="monotone"
                                dataKey="amount"
                                stroke="#00c6ff"
                                fillOpacity={1}
                                fill="url(#colorExpense)"
                            />
                        </AreaChart>
                    ) : (
                        <BarChart data={chartData}>
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="amount" fill="#00c6ff" barSize={30} />
                        </BarChart>
                    )}
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default DailySpendingChart;
