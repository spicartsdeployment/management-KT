import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import './OverallPerformance.scss';

const baseData = [
  { month: 'Jan', actual: 25, target: 30 },
  { month: 'Feb', actual: 42, target: 46 },
  { month: 'Mar', actual: 48, target: 55 },
  { month: 'Apr', actual: 62, target: 65 },
  { month: 'May', actual: 78, target: 75 },
  { month: 'Jun', actual: 95, target: 85 }
];

const currentMonth = new Date().toLocaleString('default', { month: 'short' });
const data = baseData.map((d, i) =>
  i === baseData.length - 1 ? { ...d, month: currentMonth } : d
);

const COLORS = {
  teal: '#4CAF9A',
  purple: '#8E7CFF',
  orange: '#F2994A',
  grid: '#F2F4F8',
  text: '#222B45',
  subtext: '#6B7280',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="overall-tooltip">
        <div className="overall-tooltip-label">{label}</div>
        <div className="overall-tooltip-row">
          <span className="dot actual" /> Actual: <b>{payload[0].value}%</b>
        </div>
        <div className="overall-tooltip-row">
          <span className="dot target" /> Target: <b>{payload[1].value}%</b>
        </div>
      </div>
    );
  }
  return null;
};

const OverallPerformance = () => {
  return (
    <div className="overall-performance-card" style={{minWidth: 320 }}>
      <div className="overall-header">Overall Performance</div>
      <div className="overall-chart-section">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data} margin={{ top: 20, right: 24, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.teal} stopOpacity={0.25} />
                <stop offset="100%" stopColor={COLORS.teal} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.purple} stopOpacity={0.18} />
                <stop offset="100%" stopColor={COLORS.purple} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={COLORS.grid} vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={({ x, y, payload, index }) => (
                <g>
                  <text x={x} y={y + 15} textAnchor="middle" fill="#6B7280" fontSize={13}>
                    {payload.value}
                  </text>
                  {index === data.length - 1 && (
                    <text
                      x={x}
                      y={y + 35}
                      textAnchor="middle"
                      fill="#4CAF9A"
                      fontWeight="bold"
                      fontSize={16}
                      className="overall-attendance-xaxis"
                    >
                      95%
                    </text>
                  )}
                </g>
              )}
            />
            <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fill: COLORS.subtext, fontSize: 13 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F2F4F8', opacity: 0.3 }} />
            <Area
              type="monotone"
              dataKey="target"
              stackId="1"
              stroke={COLORS.purple}
              strokeWidth={2}
              fill="url(#colorTarget)"
              dot={{ r: 5, stroke: COLORS.purple, strokeWidth: 2, fill: '#fff' }}
              strokeDasharray="5 5"
              activeDot={{ r: 7 }}
            />
            <Area
              type="monotone"
              dataKey="actual"
              stackId="1"
              stroke={COLORS.teal}
              strokeWidth={3}
              fill="url(#colorActual)"
              dot={{ r: 6, stroke: COLORS.teal, strokeWidth: 2, fill: '#fff' }}
              activeDot={{ r: 8 }}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="overall-legend">
          <div className="legend-item"><span className="legend-dot actual" /> Actual</div>
          <div className="legend-item"><span className="legend-dot target" /> Target</div>
        </div>
      </div>
      <div className="overall-footer-strict">
        <div className="overall-footer__item left">
          <div className="overall-footer__label">
            <span className="footer-dot attendance" />
            <span>Attendance</span>
          </div>
          <span className="overall-footer__value overall-footer__value--large overall-footer__value--attendance">95%</span>
        </div>
        <div className="overall-footer__item center">
          <div className="overall-footer__label">
            <span className="footer-dot due" />
            <span>3 Dues</span>
          </div>
          <div className="dues-squares">
            <span className="dues-square filled" />
            <span className="dues-square filled" />
            <span className="dues-square filled" />
            <span className="dues-square" />
          </div>
          {/* <div className="overall-footer__value overall-footer__value--small dues-label">7 Due</div> */}
        </div>
        <div className="overall-footer__item right">
          <div className="overall-footer__label">
            <span className="footer-dot study" />
            <span>Study Hours</span>
          </div>
          <span className="overall-footer__value overall-footer__value--large overall-footer__value--study">
            6.5<span className="overall-footer__value--small footer-unit">hrs</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default OverallPerformance;
