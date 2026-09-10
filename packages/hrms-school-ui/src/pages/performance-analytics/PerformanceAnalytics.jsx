import React from 'react';
import PropTypes from 'prop-types';
import '../../assets/scss/PerformanceAnalytics.scss';
import { PerformanceAnalyticsContext } from './context';
import { usePerformanceAnalytics } from './hooks/usePerformanceAnalytics';
import { macpDataByYear, months, achievements } from './constants/performanceData';
import CustomDropdown from './components/CustomDropdown';
import PageLoader from '../../components/PageLoader';
import MetricCard from './components/MetricCard';
import AcademicTab from './components/AcademicTab';
import SportsTab from './components/SportsTab';
import BehaviorTab from './components/BehaviorTab';
import CulturalTab from './components/CulturalTab';
import AchievementCard from './components/AchievementCard';

// Metrics configuration
const metrics = [
  { key: 'academic', icon: '🎓', percent: 95, label: 'Academic', color: '#6495ed', iconBg: 'rgba(219, 234, 254, 0.5)' },
  { key: 'sports', icon: '🏆', percent: 92, label: 'Sports', color: '#5edf77', iconBg: 'rgba(220, 252, 231, 0.5)' },
  { key: 'behavior', icon: '⭐', percent: 96, label: 'Behavior', color: '#a29bfe', iconBg: 'rgba(237, 233, 254, 0.5)' },
  { key: 'cultural', icon: '🎨', percent: 91, label: 'Cultural', color: '#f9b66f', iconBg: 'rgba(254, 243, 199, 0.5)' },
];

/**
 * Renders MACP SVG chart with color bands, smooth bezier curves, hover tooltips, and entrance animation
 */
const MACPChartSVG = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = React.useState(null);
  const [animated, setAnimated] = React.useState(false);

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const LEFT = 52, TOP = 16, RIGHT = 20, BOTTOM = 44;
  const SVG_W = 900, SVG_H = 360;
  const CW = SVG_W - LEFT - RIGHT; // 828
  const CH = SVG_H - TOP - BOTTOM; // 300

  const getX = (idx) => LEFT + (idx / (data.length - 1)) * CW;
  const getY = (val) => TOP + CH - (val / 100) * CH;

  // Smooth bezier path using midpoint control points
  const linePath = data.reduce((path, val, idx) => {
    const x = getX(idx);
    const y = getY(val);
    if (idx === 0) return `M ${x},${y}`;
    const px = getX(idx - 1);
    const py = getY(data[idx - 1]);
    const cpx = (px + x) / 2;
    return `${path} C ${cpx},${py} ${cpx},${y} ${x},${y}`;
  }, '');

  const areaPath = `${linePath} L ${getX(data.length - 1)},${TOP + CH} L ${getX(0)},${TOP + CH} Z`;
  const yTicks = [0, 20, 40, 60, 80, 100];
  const getTooltipX = (x) => Math.min(Math.max(x - 44, LEFT + 2), LEFT + CW - 90);

  return (
    <div className="chart-container">
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="macp-svg"
        preserveAspectRatio="xMidYMid meet"
        onMouseLeave={() => setHoveredIdx(null)}
        aria-label="MACP monthly performance chart"
        role="img"
      >
        <defs>
          <linearGradient id="macpAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(249,182,111,0.28)" />
            <stop offset="100%" stopColor="rgba(249,182,111,0.02)" />
          </linearGradient>
          <clipPath id="macpChartClip">
            <rect x={LEFT} y={TOP} width={CW} height={CH} />
          </clipPath>
        </defs>

        {/* Background color bands: Excellent / Good / Average / Needs Work */}
        <rect x={LEFT} y={getY(100)} width={CW} height={getY(90) - getY(100)} fill="rgba(34,197,94,0.12)" />
        <rect x={LEFT} y={getY(90)}  width={CW} height={getY(70) - getY(90)}  fill="rgba(59,130,246,0.10)" />
        <rect x={LEFT} y={getY(70)}  width={CW} height={getY(40) - getY(70)}  fill="rgba(251,191,36,0.10)" />
        <rect x={LEFT} y={getY(40)}  width={CW} height={getY(0)  - getY(40)}  fill="rgba(239,68,68,0.10)"  />

        {/* Chart border */}
        <rect x={LEFT} y={TOP} width={CW} height={CH} fill="none" stroke="rgba(0,0,0,0.09)" strokeWidth="1" />

        {/* Y-axis gridlines and labels */}
        {yTicks.map((tick) => {
          const ty = getY(tick);
          return (
            <React.Fragment key={tick}>
              <line
                x1={LEFT} y1={ty} x2={LEFT + CW} y2={ty}
                stroke="rgba(0,0,0,0.07)" strokeWidth="1"
                strokeDasharray={tick > 0 && tick < 100 ? '4,4' : '0'}
              />
              <text x={LEFT - 8} y={ty + 4} textAnchor="end" fill="#9ca3af" fontSize="11" fontFamily="sans-serif">{tick}</text>
            </React.Fragment>
          );
        })}

        {/* Area fill with fade-in */}
        <path
          d={areaPath}
          fill="url(#macpAreaGradient)"
          clipPath="url(#macpChartClip)"
          style={{ opacity: animated ? 1 : 0, transition: 'opacity 0.9s ease 0.2s' }}
        />

        {/* Smooth line with entrance draw animation */}
        <path
          d={linePath}
          fill="none"
          stroke="#f9b66f"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength="1"
          clipPath="url(#macpChartClip)"
          style={{
            strokeDasharray: '1',
            strokeDashoffset: animated ? '0' : '1',
            transition: 'stroke-dashoffset 1.1s cubic-bezier(0.4,0,0.2,1)',
          }}
        />

        {/* Per-column hover rects + data point circles + x-axis labels */}
        {data.map((val, idx) => {
          const x = getX(idx);
          const y = getY(val);
          const isHov = hoveredIdx === idx;
          return (
            <React.Fragment key={idx}>
              {/* Transparent hover target spanning full column height */}
              <rect
                x={x - 34}
                y={TOP}
                width={68}
                height={CH}
                fill="transparent"
                onMouseEnter={() => setHoveredIdx(idx)}
                style={{ cursor: 'crosshair' }}
              />
              {/* Data point marker */}
              <circle
                cx={x} cy={y}
                r={isHov ? 7 : 5}
                fill={isHov ? '#ea580c' : '#f9b66f'}
                stroke="#fff"
                strokeWidth="2"
                pointerEvents="none"
                style={{
                  opacity: animated ? 1 : 0,
                  transition: `opacity 0.4s ease ${0.8 + idx * 0.05}s`,
                }}
              />
              {/* X-axis month label */}
              <text
                x={x} y={TOP + CH + 22}
                textAnchor="middle"
                fill="#9ca3af"
                fontSize="11"
                fontFamily="sans-serif"
              >
                {months[idx]}
              </text>
            </React.Fragment>
          );
        })}

        {/* Hover tooltip with vertical guide line */}
        {hoveredIdx !== null && (() => {
          const hx = getX(hoveredIdx);
          const tx = getTooltipX(hx);
          const ty = Math.max(TOP + 6, getY(data[hoveredIdx]) - 54);
          return (
            <g pointerEvents="none">
              <line
                x1={hx} y1={TOP} x2={hx} y2={TOP + CH}
                stroke="#f9b66f" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.7"
              />
              <rect x={tx} y={ty} width={88} height={40} rx={8} fill="rgba(24,24,36,0.88)" />
              <text x={tx + 44} y={ty + 14} textAnchor="middle" fill="#ffd6a5" fontSize="10.5" fontFamily="sans-serif" fontWeight="600">{months[hoveredIdx]}</text>
              <text x={tx + 44} y={ty + 31} textAnchor="middle" fill="#ffffff" fontSize="14" fontFamily="sans-serif" fontWeight="700">{data[hoveredIdx]}</text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
};

MACPChartSVG.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
};

/**
 * Renders MACP Indicator card: overall badge, title, year dropdown, chart, and legend
 */
const MACPChart = ({ macpData, selectedYear, onYearChange }) => {
  const data = Array.isArray(macpData) && macpData.length > 0 
    ? macpData 
    : macpDataByYear[selectedYear] || macpDataByYear['2025'];
  const overallScore = Math.round(data.reduce((a, b) => a + b, 0) / data.length);

  return (
    <div className="macp-card">
      <div className="macp-header">
        <div className="macp-overall-badge" data-testid="school-badge-macp-overall">
          <span className="macp-overall-score">{overallScore}</span>
          <span className="overall-label">Overall</span>
        </div>
        <div className="macp-title-section">
          <svg className="macp-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#f9b66f" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="macp-title-group">
            <h3>MACP Indicator</h3>
            <p className="macp-subtitle">Monthly Academic &amp; Co-curricular Performance</p>
          </div>
        </div>
        <CustomDropdown
          id="performance-year-select"
          value={selectedYear}
          onChange={onYearChange}
          options={['2025', '2024', '2023']}
          testId="school-dropdown-performance-year"
          className="year-dropdown"
        />
      </div>
      <MACPChartSVG key={selectedYear} data={data} />
      <div className="chart-legend" data-testid="school-legend-macp">
        <div className="legend-item"><div className="legend-dot excellent" /><span>Excellent (90-100)</span></div>
        <div className="legend-item"><div className="legend-dot good" /><span>Good (70-90)</span></div>
        <div className="legend-item"><div className="legend-dot average" /><span>Average (40-70)</span></div>
        <div className="legend-item"><div className="legend-dot needs-work" /><span>Needs Work (0-40)</span></div>
      </div>
    </div>
  );
};

MACPChart.propTypes = {
  selectedYear: PropTypes.string.isRequired,
  onYearChange: PropTypes.func.isRequired,
};

/**
 * Renders the Student's Achievements card with a trophy header and a
 * scrollable list of AchievementCard items.
 */
const AchievementsTimeline = () => (
  <div className="achievements-card" data-testid="school-card-achievements">
    <div className="achievements-header">
      <div className="achievements-trophy-wrapper" aria-hidden="true">🏆</div>
      <div className="achievements-header-text">
        <h3 className="achievements-title">Student&apos;s Achievements</h3>
        <p className="achievements-count">{achievements.length} Awards &amp; Recognitions</p>
      </div>
    </div>
    <div className="achievements-list">
      {achievements.map((achievement) => (
        <AchievementCard key={achievement.id} achievement={achievement} />
      ))}
    </div>
  </div>
);

/**
 * Renders tab content based on selected tab
 */
const TabContent = ({ selectedTab, state, currentSubjectData, handleYearChange, handleSubjectChange, handleTermChange }) => {
  if (selectedTab === 'academic') return <AcademicTab selectedYear={state.selectedYear} selectedSubject={state.selectedSubject} selectedTerm={state.selectedTerm} currentSubjectData={currentSubjectData} isDarkMode={state.isDarkMode} onYearChange={handleYearChange} onSubjectChange={handleSubjectChange} onTermChange={handleTermChange} />;
  if (selectedTab === 'sports') return <SportsTab isDarkMode={state.isDarkMode} />;
  if (selectedTab === 'behavior') return <BehaviorTab isDarkMode={state.isDarkMode} />;
  if (selectedTab === 'cultural') return <CulturalTab isDarkMode={state.isDarkMode} />;
  return null;
};

TabContent.propTypes = {
  selectedTab: PropTypes.string.isRequired,
  state: PropTypes.object.isRequired,
  currentSubjectData: PropTypes.object,
  handleYearChange: PropTypes.func.isRequired,
  handleSubjectChange: PropTypes.func.isRequired,
  handleTermChange: PropTypes.func.isRequired,
};

/**
 * PerformanceAnalytics page component
 */
const PerformanceAnalytics = () => {
  const { state, dispatch, currentSubjectData } = usePerformanceAnalytics();

  const handleTabChange = (tab) => dispatch({type: 'UPDATE_STATE_FIELD', field: 'selectedTab', value: tab});
  const handleYearChange = (year) => dispatch({ type: 'UPDATE_STATE_FIELD', field: 'selectedYear', value: year });
  const handleSubjectChange = (subject) => dispatch({ type: 'UPDATE_STATE_FIELD', field: 'selectedSubject', value: subject });
  const handleTermChange = (term) => dispatch({ type: 'UPDATE_STATE_FIELD', field: 'selectedTerm', value: term });

  // Compute MACP data from query response with fallback to mock
  const macpData = state.academicData?.monthlyData 
    ? Object.values(state.academicData.monthlyData)
    : macpDataByYear[state.selectedYear] || macpDataByYear['2025'];

  return (
    <PerformanceAnalyticsContext.Provider value={{ state, dispatch }}>
      <div className="performance-analytics-container" data-testid="school-container-performance-analytics">
        {state.isLoading ? <PageLoader title="Loading Performance" subtitle="Fetching your analytics..." icon="📊" /> : (
          <>
            <div className="row-1"><MACPChart macpData={macpData} selectedYear={state.selectedYear} onYearChange={handleYearChange} /><AchievementsTimeline /></div>
            <div className="row-2">{metrics.map((metric) => <MetricCard key={metric.key} metric={metric} selectedTab={state.selectedTab} onTabClick={handleTabChange} isDarkMode={state.isDarkMode} />)}</div>
            <TabContent selectedTab={state.selectedTab} state={state} currentSubjectData={currentSubjectData} handleYearChange={handleYearChange} handleSubjectChange={handleSubjectChange} handleTermChange={handleTermChange} />
          </>
        )}
      </div>
    </PerformanceAnalyticsContext.Provider>
  );
};

export default PerformanceAnalytics;