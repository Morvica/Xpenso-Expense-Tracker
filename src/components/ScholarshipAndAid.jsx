import React from "react";
import "./ScholarshipAndAid.css";
import { FaGraduationCap } from "react-icons/fa";

const ScholarshipAndAid = () => {
  return (
    <div className="scholarship-card">
      {/* Header Section */}
      <div className="header">
        <div className="icon">
          <FaGraduationCap />
        </div>
        <div className="title">
          <h2>Scholarships & Aid</h2>
          <p>Funding progress</p>
        </div>
        <button className="manage-btn">Manage</button>
      </div>

      {/* Awarded Section */}
      <div className="awarded-section">
        <h4>Total Awarded</h4>
        <h3 className="amount">$9,750</h3>
        <p>Received <span className="applied">Applied For: $24,500</span></p>
        <div className="progress-bar">
          <div className="progress"></div>
        </div>
      </div>

      {/* Award Details */}
      <div className="details">
        <div className="total-awarded">
          <h3>$9,750</h3>
          <p>Total Awarded</p>
        </div>
        <div className="pending-decision">
          <h3>$12,500</h3>
          <p>Pending Decision</p>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div className="deadlines">
        <h4>Upcoming Deadlines</h4>
        <p className="applications">3 applications due soon</p>
        <a href="#" className="view-all">View All</a>
      </div>
    </div>
  );
};

export default ScholarshipAndAid;
