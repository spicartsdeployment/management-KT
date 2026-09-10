import React from "react";
import PropTypes from "prop-types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function computeTrendStats(trends, history) {
  const totalLeaves = trends.reduce((sum, month) => sum + month.leaves, 0);
  const currentMonth = new Date().toLocaleString("default", { month: "short" });
  const currentMonthData = trends.find((m) => m.month === currentMonth);
  const thisMonthLeaves = currentMonthData ? currentMonthData.leaves : 0;
  const leaveTypeCounts = history.reduce((acc, leave) => {
    acc[leave.type] = (acc[leave.type] || 0) + 1;
    return acc;
  }, {});
  const mostCommonType = Object.entries(leaveTypeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Sick Leave";
  const mostCommonCount = leaveTypeCounts[mostCommonType] || 0;
  return { totalLeaves, thisMonthLeaves, currentMonth, mostCommonType, mostCommonCount };
}

function TrendStatsCards({ totalLeaves, thisMonthLeaves, currentMonth, mostCommonType, mostCommonCount }) {
  return (
    <div className="sch-lm-trend-stats-cards">
      <div className="sch-lm-trend-stat-card" data-testid="school-card-most-common">
        <div className="sch-lm-stat-card-label">Most Common Type</div>
        <div className="sch-lm-stat-card-value">{mostCommonType}</div>
        <div className="sch-lm-stat-card-detail">{mostCommonCount} times</div>
      </div>
      <div className="sch-lm-trend-stat-card" data-testid="school-card-year-to-date">
        <div className="sch-lm-stat-card-label">Year to Date</div>
        <div className="sch-lm-stat-card-value">{totalLeaves} days</div>
        <div className="sch-lm-stat-card-detail">Total leaves</div>
      </div>
      <div className="sch-lm-trend-stat-card" data-testid="school-card-this-month">
        <div className="sch-lm-stat-card-label">This Month</div>
        <div className="sch-lm-stat-card-value">{thisMonthLeaves} days</div>
        <div className="sch-lm-stat-card-detail">{currentMonth}</div>
      </div>
    </div>
  );
}

TrendStatsCards.propTypes = {
  totalLeaves: PropTypes.number.isRequired,
  thisMonthLeaves: PropTypes.number.isRequired,
  currentMonth: PropTypes.string.isRequired,
  mostCommonType: PropTypes.string.isRequired,
  mostCommonCount: PropTypes.number.isRequired,
};

export default function LeaveTrendGraph({ monthlyTrends = [], leaveHistory = [], trendStats = null }) {
  const stats = trendStats || computeTrendStats(monthlyTrends || [], leaveHistory || []);
  return (
    <div className="sch-lm-trend-container" data-testid="school-container-leave-trend">
      <div className="sch-lm-trend-header">
        <h3>Leave Trend</h3>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={monthlyTrends || []} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="month" stroke="#666" fontSize={12} />
          <YAxis stroke="#666" fontSize={12} />
          <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e0e0e0", borderRadius: "8px", padding: "8px 12px" }} />
          <Line type="monotone" dataKey="leaves" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: "#8b5cf6", r: 5 }} activeDot={{ r: 7 }} />
        </LineChart>
      </ResponsiveContainer>
      <TrendStatsCards {...stats} />
    </div>
  );
}

LeaveTrendGraph.propTypes = {
  monthlyTrends: PropTypes.arrayOf(PropTypes.shape({ month: PropTypes.string, leaves: PropTypes.number })),
  leaveHistory: PropTypes.arrayOf(PropTypes.shape({ type: PropTypes.string })),
  trendStats: PropTypes.shape({
    totalLeaves: PropTypes.number,
    thisMonthLeaves: PropTypes.number,
    currentMonth: PropTypes.string,
    mostCommonType: PropTypes.string,
    mostCommonCount: PropTypes.number,
  }),
};
