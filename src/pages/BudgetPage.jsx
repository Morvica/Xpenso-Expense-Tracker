// import React, { useState, useEffect } from 'react';
// import BudgetCard from '../components/BudgetCard';
// import BudgetModal from '../components/budgetModal';
// import BudgetService from '../services/BudgetService';
// import ExpenseService from '../services/expenseService'; // Import ExpenseService
// import { FaUtensils, FaBus, FaFilm, FaGraduationCap, FaHome, FaHeart } from "react-icons/fa";
// import './budgetPage.css';

// const categoryIcons = {
//     Food: <FaUtensils />,
//     Transport: <FaBus />,
//     Entertainment: <FaFilm />,
//     Education: <FaGraduationCap />,
//     Housing: <FaHome />,
//     Health: <FaHeart />,
// };

// const BudgetPage = () => {
//     const [budgets, setBudgets] = useState([]);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedBudget, setSelectedBudget] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const fetchBudgets = async () => {
//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 setError('No token found. Please log in.');
//                 return;
//             }
//             const data = await BudgetService.getCategoryBudgets(`Bearer ${token}`);

//             const categoryBudgets = data.filter(budget => budget.category !== 'Overall Budget');

//             const expenses = await ExpenseService.getExpenses(token);

//             const categorySpent = {};
//             expenses.forEach((expense) => {
//                 if (categorySpent[expense.category]) {
//                     categorySpent[expense.category] += parseFloat(expense.amount) || 0;
//                 } else {
//                     categorySpent[expense.category] = parseFloat(expense.amount) || 0;
//                 }
//             });

//             const updatedBudgets = categoryBudgets.map(budget => ({
//                 ...budget,
//                 spentAmount: categorySpent[budget.category] || 0, // Add spentAmount
//                 icon: categoryIcons[budget.category] || null,
//             }));

//             setBudgets(updatedBudgets);

//         } catch (err) {
//             setError('Failed to fetch budgets. Please try again.');
//             console.error('Error fetching budgets:', err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchBudgets();
//     }, []);

//     const handleEdit = (budget) => {
//         setSelectedBudget(budget);
//         setIsModalOpen(true);
//     };

//     const handleModalClose = () => {
//         setIsModalOpen(false);
//         setSelectedBudget(null);
//         fetchBudgets();
//     };

//     if (error) {
//         return <p className="error-text">{error}</p>;
//     }

//     return (
//         <div className="budget-page-container">
//             <div className="budget-header">
//                 <div className="budget-header-left">
//                     <h1 className="budget-title">Budgets</h1>
//                     <p className="budget-subtitle">Set and manage your monthly spending limits</p>
//                 </div>
//                 <button onClick={() => setIsModalOpen(true)} className="add-budget-btn">+ Add Budget</button>
//             </div>

//             {loading ? (
//                 <p className="loading-text">Loading budgets...</p>
//             ) : (
//                 <div className="budget-grid">
//                     {budgets.length > 0 ? (
//                         budgets.map((budget) => (
//                             <BudgetCard key={budget._id} budget={budget} onEdit={handleEdit} />
//                         ))
//                     ) : (
//                         <p className="no-budget-text">No budgets available. Please add a budget.</p>
//                     )}
//                 </div>
//             )}

//             {isModalOpen && (
//                 <BudgetModal isOpen={isModalOpen} onClose={handleModalClose} budgetData={selectedBudget} onBudgetSet={fetchBudgets}/>
//             )}
//         </div>
//     );
// };

// export default BudgetPage;
// BudgetPage.jsx
import React, { useState, useEffect } from 'react';
import BudgetCard from '../components/BudgetCard';
import BudgetModal from '../components/budgetModal';
import BudgetService from '../services/BudgetService';
import ExpenseService from '../services/expenseService';
import { FaUtensils, FaBus, FaFilm, FaGraduationCap, FaHome, FaHeart } from "react-icons/fa";
import './budgetPage.css';
import Sidebar from "../components/Sidebar"; // Import Sidebar
import FloatingButton from "../components/FloatingButton"; // Import Floating Button

const categoryIcons = {
    Food: <FaUtensils />,
    Transport: <FaBus />,
    Entertainment: <FaFilm />,
    Education: <FaGraduationCap />,
    Housing: <FaHome />,
    Health: <FaHeart />,
};

const BudgetPage = () => {
    const [budgets, setBudgets] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [overallBudget, setOverallBudget] = useState(null);
    const [hasBudgets, setHasBudgets] = useState(true); // Track if user has budgets
    const [isExpanded, setIsExpanded] = useState(false); // Sidebar state

    const fetchBudgets = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token found. Please log in.');
                return;
            }
            const data = await BudgetService.getCategoryBudgets(`Bearer ${token}`);
    
            if (data.length === 0) {
                setHasBudgets(false); // No budgets, show initial info
                setLoading(false);
                return;
            }
    
            setHasBudgets(true); // User has budgets
    
            const overall = data.find(budget => budget.category === 'Overall Budget');
            setOverallBudget(overall);
    
            const categoryBudgets = data.filter(budget => budget.category !== 'Overall Budget');
    
            const expenses = await ExpenseService.getExpenses(token);
    
            const categorySpent = {};
            expenses.forEach((expense) => {
                if (categorySpent[expense.category]) {
                    categorySpent[expense.category] += parseFloat(expense.amount) || 0;
                } else {
                    categorySpent[expense.category] = parseFloat(expense.amount) || 0;
                }
            });
    
            const updatedBudgets = categoryBudgets.map(budget => ({
                ...budget,
                spentAmount: categorySpent[budget.category] || 0,
                icon: categoryIcons[budget.category] || null,
            }));
    
            setBudgets(updatedBudgets);
    
        } catch (err) {
            // Only set error if it's a genuine error (not just empty data)
            if (err.response && err.response.status !== 404) {
                setError('Failed to fetch budgets. Please try again.');
                console.error('Error fetching budgets:', err.message);
            } else if (err.response && err.response.status === 404) {
                // Handle 404 as no budgets, not an error
                setHasBudgets(false);
                setLoading(false);
            } else {
                // Handle other errors
                setError('Failed to fetch budgets. Please try again.');
                console.error('Error fetching budgets:', err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBudgets();
    }, []);

    const handleEdit = (budget) => {
        setSelectedBudget(budget);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedBudget(null);
        fetchBudgets();
    };

    if (error) {
        return <p className="error-text">{error}</p>;
    }

    if (loading) {
        return <p className="loading-text">Loading budgets...</p>;
    }

    if (!hasBudgets) {
        return (
            <div className="budget-page-container">
                <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
                <div className={`budget-grid-container ${isExpanded ? "budget-grid-container-expanded" : ""}`}>
                    <div className="budget-header">
                        <div className="budget-header-left">
                            <h1 className="budget-title">Budgets</h1>
                            <p className="budget-subtitle">Get started by setting your monthly spending limits.</p>
                        </div>
                        <button onClick={() => setIsModalOpen(true)} className="add-budget-btn">+ Add Budget</button>
                    </div>
                    <p className="no-budget-text">You haven't added any budgets yet. Click "Add Budget" to get started.</p>
                    {isModalOpen && (
                        <BudgetModal isOpen={isModalOpen} onClose={handleModalClose} onBudgetSet={fetchBudgets} />
                    )}
                </div>
                <FloatingButton />
            </div>
        );
    }

    return (
        <div className="budget-page-container">
            <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
            <div className={`budget-grid-container ${isExpanded ? "budget-grid-container-expanded" : ""}`}>
                <div className="budget-header">
                    <div className="budget-header-left">
                        <h1 className="budget-title">Budgets</h1>
                        <p className="budget-subtitle">Set and manage your monthly spending limits</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="add-budget-btn">+ Add Budget</button>
                </div>

                {overallBudget && (
                    <div className="overall-budget-card">
                        <h2>Total Budget</h2>
                        <p className="budget-amount">₹{overallBudget.budgetAmount}</p>
                    </div>
                )}

                <div className="budget-grid">
                    {budgets.length > 0 ? (
                        budgets.map((budget) => (
                            <BudgetCard key={budget._id} budget={budget} onEdit={handleEdit} />
                        ))
                    ) : (
                        <p className="no-budget-text">No budgets available. Please add a budget.</p>
                    )}
                </div>

                {isModalOpen && (
                    <BudgetModal isOpen={isModalOpen} onClose={handleModalClose} budgetData={selectedBudget} onBudgetSet={fetchBudgets} />
                )}
            </div>
            <FloatingButton />
        </div>
    );
};

export default BudgetPage;