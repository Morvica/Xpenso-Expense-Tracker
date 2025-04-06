import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard"; 
import SplitExpense from "./pages/SplitExpense"; // ✅ Import SplitExpense
import BudgetPage from "./pages/BudgetPage";
import Expense from "./pages/Expense";
import Analysis from "./pages/Analysis";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/expense" element={<Expense />} /> 
        <Route path="/split-expense" element={<SplitExpense />} /> {/* ✅ Added Route */}
        <Route path="/analysis" element={<Analysis />} /> 
        <Route path="/budgetpage" element={<BudgetPage/>}/>
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
