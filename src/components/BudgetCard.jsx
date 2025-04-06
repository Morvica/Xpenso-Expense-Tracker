// // import React from 'react';
// // import { FaEdit, FaTrash } from 'react-icons/fa';

// // // const BudgetCard = ({ budget, onEdit, onDelete }) => {
// // //   const usagePercentage = ((budget.spent / budget.amount) * 100).toFixed(0);

// // // const BudgetCard = ({ budget, onEdit, onDelete }) => {
// // //     const usagePercentage = budget.amount > 0
// // //         ? ((budget.spent / budget.amount) * 100).toFixed(0)
// // //         : 0;

// // //     const progressBarColor = usagePercentage > 80 ? 'bg-red-500' : 'bg-purple-500';
// // // Function to determine the progress bar color based on usage percentage
// // const getProgressBarColor = (percentage) => {
// //     if (percentage < 50) return 'bg-green-500';
// //     if (percentage < 75) return 'bg-yellow-500';
// //     return 'bg-red-500';
// // };

// // const BudgetCard = ({ budget, onEdit, onDelete }) => {
// //     const usagePercentage = ((budget.spent / budget.amount) * 100).toFixed(0);
// //     const progressBarColor = getProgressBarColor(usagePercentage);
// //     return (
// //         <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-1/3">
// //             <div className="flex justify-between items-center mb-4">
// //                 <h3 className="text-lg font-semibold">{budget.category}</h3>
// //                 <div className="flex gap-2">
// //                     <button onClick={() => onEdit(budget)} className="text-blue-500 hover:text-blue-700">
// //                         <FaEdit />
// //                     </button>
// //                     <button onClick={() => onDelete(budget.id)} className="text-red-500 hover:text-red-700">
// //                         <FaTrash />
// //                     </button>
// //                 </div>
// //             </div>
// //             <p><strong>Budget:</strong> ${budget.amount}</p>
// //             <p><strong>Spent:</strong> ${budget.spent}</p>
// //             <p><strong>Usage:</strong> {usagePercentage}%</p>
// //             <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
// //                 {/* <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${usagePercentage}%` }}></div> */}
// //                 <div className={`h-2.5 rounded-full ${progressBarColor}`} style={{ width: `${usagePercentage}%` }}></div>
// //             </div>
// //         </div>
// //     );
// // };

// // export default BudgetCard;


// // BudgetCard.jsx
// import React from 'react';
// import { FaEdit, FaTrash } from 'react-icons/fa';

// const getProgressBarColor = (percentage) => {
//   if (percentage <= 50) return 'bg-green-500';
//   if (percentage <= 75) return 'bg-yellow-500';
//   return 'bg-red-500';
// };

// const BudgetCard = ({ budget, onEdit, onDelete }) => {
//   const usagePercentage = budget.amount > 0 ? ((budget.spent / budget.amount) * 100).toFixed(0) : 0;
//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-1/3">
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-lg font-semibold">{budget.category}</h3>
//         <div className="flex gap-2">
//           <button onClick={() => onEdit(budget)} className="text-blue-500"><FaEdit /></button>
//           <button onClick={() => onDelete(budget.id)} className="text-red-500"><FaTrash /></button>
//         </div>
//       </div>
//       <p><strong>Budget:</strong> ${budget.amount}</p>
//       <p><strong>Spent:</strong> ${budget.spent}</p>
//       <p><strong>Usage:</strong> {usagePercentage}%</p>
//       <div className="w-full bg-gray-200 h-2 rounded-lg mt-2">
//         <div className={`h-2 rounded-lg ${getProgressBarColor(usagePercentage)}`} style={{ width: `${usagePercentage}%` }}></div>
//       </div>
//     </div>
//   );
// };

// export default BudgetCard;

// BudgetCard.jsx
import React from 'react';
import { FaEdit } from 'react-icons/fa';
import './BudgetCard.css';

const getProgressBarColor = (percentage) => {
    return percentage <= 75 ? "progress-purple" : "progress-red";
};

const BudgetCard = ({ budget, onEdit }) => {
    const spentAmount = parseFloat(budget.spentAmount) || 0;
    const budgetAmount = parseFloat(budget.budgetAmount) || 0;

    const usagePercentage = budgetAmount > 0 ? ((spentAmount / budgetAmount) * 100).toFixed(0) : 0;
    const finalUsagePercentage = isNaN(usagePercentage) ? 0 : usagePercentage;

    const remainingAmount = budgetAmount - spentAmount;
    const finalRemainingAmount = isNaN(remainingAmount) ? 0 : remainingAmount;

    const isOverBudget = spentAmount > budgetAmount;

    return (
        <div className="budget-card">
            <div className="budget-card-header">
                <div className="budget-category">
                    <span className="budget-icon">{budget.icon}</span>
                    <h3>{budget.category}</h3>
                </div>
                <button onClick={() => onEdit(budget)} className="edit-button">
                    <FaEdit />
                </button>
            </div>

            <p><strong>Budget:</strong> ₹{budgetAmount}</p>
            <p><strong>Spent:</strong> ₹{spentAmount}</p>
            <p><strong>Usage:</strong> {finalUsagePercentage}%</p>

            <div className="progress-bar">
                <div
                    className={`progress-fill ${getProgressBarColor(finalUsagePercentage)}`}
                    style={{ width: `${finalUsagePercentage}%` }}
                ></div>
            </div>

            {isOverBudget ? (
                <p className="over-budget">Over budget by ₹{Math.abs(finalRemainingAmount)}</p>
            ) : (
                <p className="remaining-budget">₹{finalRemainingAmount} remaining</p>
            )}
        </div>
    );
};

export default BudgetCard;