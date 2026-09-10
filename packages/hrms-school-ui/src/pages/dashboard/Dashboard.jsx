import React, { useState } from 'react';
import PageLoader from '../../components/PageLoader';
import LearningStreak from './components/LearningStreak';
import OverallPerformance from './components/OverallPerformance';
import {
  studentProfile,
  performanceData as defaultPerformanceData,
  performanceLegend,
  statCards as defaultStatCards,
  quickAlerts,
  levelData,
  levelLegend,
  subjectOverview as defaultSubjectOverview,
  learningProgress as defaultLearningProgress,
  recentAchievements as defaultRecentAchievements,
  CHART_CONFIG,
  SPACING,
} from '../../constants/dashboardData';
import { scheduleData } from '../daily-schedule/scheduleData';
import { useOverviewQuery } from '../../services/overview.queries';
import '../../assets/scss/Overview.scss';
import { useQueryClient } from '@tanstack/react-query';
import { getSessionParams } from '../../config/sessionParams';



const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getTodayDayName() {
  const name = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  return DAY_ORDER.includes(name) ? name : DAY_ORDER[0];
}

/**
 * Derives real-time status for a dashboard schedule item.
 * @param {Object} item - Normalised item with `time` (start) and `to` (end), `type`
 * @returns {'completed'|'current'|'upcoming'|null}
 */
function getPeriodStatus(item) {
  if (item.type === 'break') return null;

  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();

  const [startH, startM] = item.time.split(':').map(Number);
  const [endH, endM] = item.to.split(':').map(Number);
  const startMins = startH * 60 + startM;
  const endMins = endH * 60 + endM;

  if (nowMins >= endMins) return 'completed';
  if (nowMins >= startMins) return 'current';
  return 'upcoming';
}

export default function Dashboard() {
  const [selectedLevel, setSelectedLevel] = useState(levelData.breakdown[0].name);
  const queryClient = useQueryClient();
  const result = useOverviewQuery();

  console.log("useOverviewQuery result:", result);

  const params = getSessionParams();

  console.log("cache data",
    queryClient.getQueryData([
      'overview',
      params
    ])
  );

  const { data, isLoading: isPageLoading, isError, isFetching } = useOverviewQuery();

  // Merge API data with static defaults
  const statCards = data?.statCards ?? defaultStatCards;
  const performanceData = data?.performanceData ?? defaultPerformanceData;
  const subjectOverview = data?.subjectOverview ?? defaultSubjectOverview;
  const learningProgress = data?.learningProgress ?? defaultLearningProgress;
  const recentAchievements = data?.recentAchievements ?? defaultRecentAchievements;

  // Show page loader on first load only; background refetches are silent
  const isSlowLoading = isPageLoading && isFetching;

  // Derive today's schedule from the shared scheduleData
  const todayDay = getTodayDayName();
  const todayItems = (scheduleData[todayDay] || []).map((item, i) =>
    item.break
      ? { id: i + 1, time: item.from, to: item.to, subject: item.label, duration: item.duration, type: 'break' }
      : { id: i + 1, time: item.from, to: item.to, subject: item.subject, topic: item.topic, teacher: item.teacher, type: 'class' }
  );
  const totalClasses = todayItems.filter(it => it.type === 'class').length;

  // Split stat cards for column layout
  const statCardsCol1 = statCards.slice(0, 4);
  const statCardsCol2 = statCards.slice(4);

  const selectedLevelValue = levelData.breakdown.find((item) => item.name === selectedLevel)?.value ?? levelData.overallPercentage;

  return (
    <div className="sch-ov-dashboard-main-container" data-testid="school-container-dashboard">
      {isPageLoading ? (
        <PageLoader
          title="Loading Your Dashboard"
          subtitle={isSlowLoading ? "Taking longer than usual... Please wait" : "Fetching your performance data..."}
        />
      ) : (
        <>
          {/* Student Profile Header */}
          <div className="sch-ov-dashboard-profile-header" data-testid="school-section-profile-header">
            <img
              src={studentProfile.avatar}
              alt={studentProfile.name}
              className="sch-ov-dashboard-profile-avatar"
              data-testid="school-image-profile-avatar"
            />
            <div className="sch-ov-dashboard-profile-info">
              <span className="sch-ov-dashboard-profile-name">
                {studentProfile.name}
              </span>
              <div className="sch-ov-dashboard-profile-badges">
                <span className="sch-ov-dashboard-badge sch-ov-dashboard-badge-grade">
                  {studentProfile.grade}
                </span>
                <span className="sch-ov-dashboard-badge sch-ov-dashboard-badge-roll">
                  Roll: {studentProfile.rollNumber}
                </span>
              </div>
            </div>
            {/* <div className="sch-ov-dashboard-student-actions">
          <button className="sch-ov-dashboard-action-button" data-testid="school-button-notifications">
            <span className="sch-ov-dashboard-icon">??</span>
          </button>
          <button className="sch-ov-dashboard-action-button" data-testid="school-button-messages">
            <span className="sch-ov-dashboard-icon">??</span>
          </button>
          <button className="sch-ov-dashboard-action-button" data-testid="school-button-settings">
            <span className="sch-ov-dashboard-icon">??</span>
          </button>
        </div> */}
          </div>

          {/* Overall Performance & Quick Stats Row */}
          <div className="sch-ov-dashboard-top-row" data-testid="school-section-top-row">
            {/* New Overall Performance Card */}
            <OverallPerformance />

            {/* Stat Cards & Alerts */}
            <div className="sch-ov-dashboard-stats-section" data-testid="school-section-stats">
              {/* Row 1: First 4 stat cards */}
              <div className="sch-ov-dashboard-stats-row">
                {statCardsCol1.map((card) => (
                  <div
                    key={card.id}
                    className={`sch-ov-dashboard-stat-card sch-ov-dashboard-stat-card-${card.id}`}
                    data-testid={`school-card-stat-${card.id}`}
                  >
                    {card.trend && (
                      <div className={`sch-ov-dashboard-stat-trend ${card.trendType === 'positive' ? 'sch-ov-dashboard-positive' : 'sch-ov-dashboard-negative'}`}>
                        {card.trend}
                      </div>
                    )}

                    <span className="sch-ov-dashboard-stat-label">{card.label}</span>
                    <span className="sch-ov-dashboard-stat-value">{card.value}</span>
                    <span className="sch-ov-dashboard-stat-icon">{card.icon}</span>
                    {card.subtitle && <span className="sch-ov-dashboard-stat-subtitle">{card.subtitle}</span>}
                    {card.description && <span className="sch-ov-dashboard-stat-description">{card.description}</span>}
                  </div>
                ))}
              </div>

              {/* Row 2: Last 2 stat cards */}
              <div className="sch-ov-dashboard-stats-row-2">
                {statCardsCol2.map((card) => (
                  <div
                    key={card.id}
                    className={`sch-ov-dashboard-stat-card sch-ov-dashboard-stat-card-${card.id}`}
                    data-testid={`school-card-stat-${card.id}`}
                  >
                    <div className="sch-ov-dashboard-stat-content">
                      {card.trend && (
                        <div className={`sch-ov-dashboard-stat-trend ${card.trendType === 'positive' ? 'sch-ov-dashboard-positive' : 'sch-ov-dashboard-negative'}`}>
                          {card.trend}
                        </div>
                      )}
                      <span className="sch-ov-dashboard-stat-label">{card.label}</span>
                      <span className="sch-ov-dashboard-stat-value">{card.value}</span>
                      {card.subtitle && <span className="sch-ov-dashboard-stat-subtitle">{card.subtitle}</span>}
                      {card.description && <span className="sch-ov-dashboard-stat-description">{card.description}</span>}
                    </div>
                    <span className="sch-ov-dashboard-stat-icon">{card.icon}</span>
                  </div>
                ))}
              </div>

              {/* Row 3: Quick Alerts */}
              <div className="sch-ov-dashboard-alerts-card" data-testid="school-card-quick-alerts">
                <div>
                  <div className="sch-ov-dashboard-alerts-header">
                    <span className="sch-ov-dashboard-alerts-title">
                      <span className="sch-ov-dashboard-alerts-icon">{quickAlerts.icon}</span>
                      Quick Alerts
                    </span>
                    <div>
                      <span className="sch-ov-dashboard-alerts-count">{quickAlerts.count}</span>
                      <span className="sch-ov-dashboard-alerts-count-label"> New Notifications</span>
                    </div>
                  </div>
                </div>
                <div className="sch-ov-dashboard-alerts-list">
                  {quickAlerts.alerts.map((alert) => (
                    <div key={alert.id} className="sch-ov-dashboard-alert-item">
                      <span className="sch-ov-dashboard-alert-dot" style={{ backgroundColor: alert.color }} />
                      <span className="sch-ov-dashboard-alert-text">{alert.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Level & Subject Overview Row */}
          <div className="sch-ov-dashboard-middle-row" data-testid="school-section-middle-row">
            {/* Learning Streak Card (replaces Your Level) */}
            <div className="sch-ov-dashboard-level-card" data-testid="school-card-learning-streak">
              <LearningStreak />
            </div>

            {/* Student Overview (Bar Chart) */}
            <div className="sch-ov-dashboard-subject-card" data-testid="school-card-subject-overview">
              <div className="sch-ov-dashboard-card-content">
                <span className="sch-ov-dashboard-section-title">
                  Student Overview
                </span>
                <div className="sch-ov-dashboard-bar-chart-wrapper">
                  {subjectOverview.map((subject) => {
                    const barHeight = Math.round(
                      (subject.value / 100) * CHART_CONFIG.subjectBarChart.maxBarHeight
                    );
                    const finalHeight = Math.max(
                      barHeight,
                      CHART_CONFIG.subjectBarChart.minBarHeight
                    );
                    return (
                      <div key={subject.id} className="sch-ov-dashboard-bar-item">
                        <div
                          className="sch-ov-dashboard-bar"
                          style={{
                            backgroundColor: subject.color,
                            height: `${finalHeight}px`,
                          }}
                        >
                          <span className="sch-ov-dashboard-bar-value">{subject.value}%</span>
                        </div>
                        <span className="sch-ov-dashboard-bar-label">
                          {subject.subject}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="sch-ov-dashboard-bar-footer">
                  <span className="sch-ov-dashboard-bar-footer-text">
                    Performance by subject (%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Schedule, Learning Progress, Achievements Row */}
          <div className="sch-ov-dashboard-bottom-row" data-testid="school-section-bottom-row">
            {/* Left Column: Today's Schedule */}
            <div className="sch-ov-dashboard-schedule-column" data-testid="school-section-schedule">
              <div className="sch-ov-dashboard-schedule-card" data-testid="school-card-schedule">
                <div>
                  <div className="sch-ov-dashboard-schedule-header">
                    <span className="sch-ov-dashboard-schedule-title">Today&apos;s Schedule</span>
                    <span className="sch-ov-dashboard-schedule-count">
                      {totalClasses} classes
                    </span>
                  </div>
                  <div className="sch-ov-dashboard-schedule-list">
                    {todayItems.map((item, index) => {
                      const status = getPeriodStatus(item);
                      const isCurrent = status === 'current';
                      const isCompleted = status === 'completed';
                      return (
                        <div
                          key={item.id}
                          className={`sch-ov-dashboard-schedule-item ${item.type === 'break' ? 'sch-ov-dashboard-schedule-break' : ''} ${isCurrent ? 'sch-ov-dashboard-schedule-current' : ''}`}
                          data-testid={`school-item-schedule-${item.id}`}
                        >
                          {item.type === 'break' ? (
                            <>
                              <div className="sch-ov-dashboard-schedule-icon-wrapper">
                                <div className={`sch-ov-dashboard-schedule-time-box sch-ov-dashboard-schedule-time-color-${index % 6}`}>
                                  <span className="sch-ov-dashboard-schedule-time">
                                    {item.time}
                                  </span>
                                </div>
                              </div>
                              <div className="sch-ov-dashboard-schedule-details">
                                <span className="sch-ov-dashboard-schedule-subject-break">{item.subject}</span>
                                {item.duration && <span className="sch-ov-dashboard-schedule-duration">{item.duration}</span>}
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="sch-ov-dashboard-schedule-icon-wrapper">
                                <div className={`sch-ov-dashboard-schedule-time-box sch-ov-dashboard-schedule-time-color-${index % 6} ${isCurrent ? 'sch-ov-dashboard-schedule-time-current' : ''}`}>
                                  <span className="sch-ov-dashboard-schedule-time">
                                    {item.time}
                                  </span>
                                </div>
                              </div>
                              <div className="sch-ov-dashboard-schedule-details">
                                <span className="sch-ov-dashboard-schedule-subject">{item.subject}</span>
                                {item.topic && <span className="sch-ov-dashboard-schedule-topic">{item.topic}</span>}
                              </div>
                              {isCompleted && (
                                <span className="sch-ov-dashboard-schedule-check">✓</span>
                              )}
                              {isCurrent && (
                                <span className="sch-ov-dashboard-schedule-now-badge">
                                  Now
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Learning Progress & Achievements */}
            <div className="sch-ov-dashboard-right-column">
              {/* Learning Progress */}
              <div className="sch-ov-dashboard-progress-card" data-testid="school-card-learning-progress">
                <div className="sch-ov-dashboard-card-content">
                  <span className="sch-ov-dashboard-section-title">Learning Progress</span>
                  <div className="sch-ov-dashboard-progress-grid">
                    {learningProgress.map((item) => {
                      // Map subject to icon
                      const subjectIcons = {
                        Mathematics: '📐',
                        Science: '🔬',
                        English: '📖',
                        Computer: '💻',
                      };
                      const icon = subjectIcons[item.subject] || '📚';

                      return (
                        <div
                          key={item.id}
                          className="sch-ov-dashboard-progress-item"
                          style={{ backgroundColor: item.bgColor }}
                          data-testid={`school-item-progress-${item.id}`}
                        >
                          <div className="sch-ov-dashboard-progress-header">
                            <span className="sch-ov-dashboard-progress-icon">{icon}</span>
                            <div>
                              <div className="sch-ov-dashboard-progress-subject" style={{ color: item.textColor }}>{item.subject}</div>
                              <div className="sch-ov-dashboard-progress-value" style={{ color: item.barFillColor }}>{item.progress}%</div>
                            </div>
                          </div>
                          <div className="sch-ov-dashboard-progress-bar-bg" style={{ backgroundColor: item.barBgColor }}>
                            <div
                              className="sch-ov-dashboard-progress-bar-fill"
                              style={{ width: `${item.progress}%`, backgroundColor: item.barFillColor }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Recent Achievements */}
              <div className="sch-ov-dashboard-achievements-card" data-testid="school-card-achievements">
                <div className="sch-ov-dashboard-card-content">
                  <span className="sch-ov-dashboard-section-title">Recent Achievements</span>
                  <div className="sch-ov-dashboard-achievements-list">
                    {recentAchievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="sch-ov-dashboard-achievement-item"
                        style={{ backgroundColor: achievement.bgColor }}
                        data-testid={`school-item-achievement-${achievement.id}`}
                      >
                        <span className="sch-ov-dashboard-achievement-icon" style={{ color: achievement.iconColor }}>
                          {achievement.icon}
                        </span>
                        <div className="sch-ov-dashboard-achievement-content">
                          <span className="sch-ov-dashboard-achievement-title" style={{ color: achievement.textColor }}>
                            {achievement.title}
                          </span>
                          <span className="sch-ov-dashboard-achievement-desc">{achievement.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
