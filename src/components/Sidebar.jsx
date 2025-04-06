import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faWallet,
  faBullseye,
  faUsers,
  faBook,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Sidebar = ({ isExpanded, setIsExpanded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("User");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/auth/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.name) {
          setUserName(response.data.name);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const signOut = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  return (
    <div
      className={`sidebar ${isOpen ? "expanded" : ""}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="profile-circle"></div>
      <h3 className="username">Hi {userName}!!</h3>

      <ul className="menu">
        <li>
          <Link to="/dashboard" className="menu-item">
            <FontAwesomeIcon icon={faHome} /> {isOpen && <span>Home</span>}
          </Link>
        </li>
        <li>
          <Link to="/expense" className="menu-item">
            <FontAwesomeIcon icon={faWallet} /> {isOpen && <span>Expenses</span>}
          </Link>
        </li>
        <li>
          <Link to="/analysis" className="menu-item">
            <FontAwesomeIcon icon={faBullseye} /> {isOpen && <span>Analysis</span>}
          </Link>
        </li>
        <li>
          <Link to="/split-expense" className="menu-item">
            <FontAwesomeIcon icon={faUsers} /> {isOpen && <span>Split Expense</span>}
          </Link>
        </li>
        <li>
          <Link to="/budgetpage" className="menu-item">
            <FontAwesomeIcon icon={faBook} /> {isOpen && <span>Budget</span>}
          </Link>
        </li>
      </ul>

      <button className="signout-btn" onClick={signOut}>
        <FontAwesomeIcon icon={faSignOutAlt} /> {isOpen && <span>Sign Out</span>}
      </button>
    </div>
  );
};

export default Sidebar;