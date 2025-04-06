import React, { useState } from "react";
import "./SplitExpense.css";
import Sidebar from "../components/Sidebar"; // Import Sidebar
import FloatingButton from "../components/FloatingButton"; // Import Floating Button


const SplitExpense = () => {
  const [people, setPeople] = useState([{ name: "", amount: "" }]);
  const [transactions, setTransactions] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false); // Sidebar state

  const handleChange = (index, field, value) => {
    const newPeople = [...people];
    newPeople[index][field] = value;
    setPeople(newPeople);
  };

  const addPerson = () => {
    setPeople([...people, { name: "", amount: "" }]);
  };

  const calculateSplit = () => {
    const validPeople = people.filter(p => p.name && p.amount);
    if (validPeople.length < 2) {
      alert("Enter at least two valid people with amounts!");
      return;
    }

    const totalAmount = validPeople.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const equalShare = totalAmount / validPeople.length;

    let balances = validPeople.map(p => ({
      name: p.name,
      balance: parseFloat(p.amount) - equalShare
    }));

    let toPay = balances.filter(p => p.balance < 0);
    let toReceive = balances.filter(p => p.balance > 0);

    let finalTransactions = [];

    while (toPay.length && toReceive.length) {
      let payer = toPay[0];
      let receiver = toReceive[0];

      let amount = Math.min(Math.abs(payer.balance), receiver.balance);
      finalTransactions.push(`${payer.name} pays ₹${amount.toFixed(2)} to ${receiver.name}`);

      payer.balance += amount;
      receiver.balance -= amount;

      if (payer.balance === 0) toPay.shift();
      if (receiver.balance === 0) toReceive.shift();
    }

    setTransactions(finalTransactions);
  };

  return (
    <div className="split-expense-page">
    <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
    <div className={`split-grid-container ${isExpanded ? "split-grid-container-expanded" : ""}`}>
    <div className="split-expenses-container" >
    <div className="split-expense-container">
      <h2>Split Expense</h2>
      
      {people.map((person, index) => (
        <div key={index} className="person-input">
          <input
            type="text"
            placeholder="Name"
            value={person.name}
            onChange={(e) => handleChange(index, "name", e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount Paid"
            value={person.amount}
            onChange={(e) => handleChange(index, "amount", e.target.value)}
          />
        </div>
      ))}

      <button onClick={addPerson} className="add-btn">➕ Add Person</button>
      <button onClick={calculateSplit} className="calculate-btn">💰 Calculate Split</button>

      {transactions.length > 0 && (
        <div className="result">
          <h3>Settlements:</h3>
          <ul>
            {transactions.map((transaction, index) => (
              <li key={index}>{transaction}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
    </div>
    </div>
      <FloatingButton />
    </div>
  );
};

export default SplitExpense;
