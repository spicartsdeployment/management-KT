import React from "react";
import { TrophyIcon } from "@heroicons/react/24/outline";
import Card from "../../layout/Card";

const RankWidget = ({ data }) => {
  const {
    title,
    value,
    change,
    trend,
    icon,
    color,
    bgColor,
    totalStudents,
    currentRank,
    previousRank,
  } = data;

  // Calculate percentage for ranking visualization
  const rankPercentage = ((totalStudents - currentRank) / totalStudents) * 100;

  return (
    <Card variant="glass" className="widget-card">
      <div className="widget-header">
        <div className={`widget-icon-wrapper ${bgColor}`}>
          <TrophyIcon className={`widget-icon ${color}`} />
        </div>
        <div
          className={`widget-badge ${
            trend === "up"
              ? "widget-badge-up"
              : trend === "down"
                ? "widget-badge-down"
                : "widget-badge-neutral"
          }`}
        >
          {change}
        </div>
      </div>

      <div className="widget-body">
        <h3 className="widget-title">{title}</h3>
        <p className="widget-value">
          {value}
          <span className="widget-value-sub">of {totalStudents}</span>
        </p>
      </div>

      {/* Ranking visualization */}
      <div className="widget-progress">
        <div className="widget-progress-header">
          <span>Performance</span>
          <span>{Math.round(rankPercentage)}%</span>
        </div>
        <div className="widget-progress-track">
          <div
            className="widget-progress-bar widget-progress-bar-yellow"
            style={{ width: `${rankPercentage}%` }}
          />
        </div>
      </div>

      {/* Previous rank comparison */}
      {previousRank && (
        <div className="widget-footer">
          Previous rank: #{previousRank}
          {currentRank < previousRank && (
            <span className="widget-improvement">
              ↑ Improved by {previousRank - currentRank} position
              {previousRank - currentRank > 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}

      {/* Background decoration */}
      <div className="widget-decoration widget-decoration-yellow"></div>
    </Card>
  );
};

export default RankWidget;
