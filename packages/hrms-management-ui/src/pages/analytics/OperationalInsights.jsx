import React from 'react';
import '../../Assets/styles/OperationalInsights.scss';
import ManagementPageHeader from '../../app/components/common/ManagementPageHeader';

const metrics = [
  { label: 'Staff Attendance', value: '96.2%', trend: '+1.4%', color: '#4F46E5', variant: 'indigo', trendUp: true },
  { label: 'Fee Collection Rate', value: '84.5%', trend: '+3.1%', color: '#22C55E', variant: 'success', trendUp: true },
  { label: 'Bus On-time Rate', value: '94%', trend: '-0.5%', color: '#C9A962', variant: 'gold', trendUp: false },
  { label: 'Pending Grievances', value: '19', trend: '-4 this week', color: '#F59E0B', variant: 'warning', trendUp: false },
];

/**
 * OperationalInsights - school-wide operational analytics
 */
export default function OperationalInsights() {
  return (
    <div className="operational-insights" data-testid="school-page-operational-insights">
      <ManagementPageHeader
        breadcrumbs={[
          { label: "Analytics" },
          { label: "Operational Insights" },
        ]}
        title="Operational Insights"
        subtitle="School-wide operational analytics and performance metrics"
      />

      <div className="operational-insights__metrics-grid">
        {metrics.map((m) => (
          <div key={m.label} className={`operational-insights__metric-card operational-insights__metric-card--${m.variant}`}>
            <div className="operational-insights__metric-content">
              <div className="operational-insights__metric-body">
                <div>
                  <p className="operational-insights__metric-label">{m.label}</p>
                  <p className="operational-insights__metric-value">{m.value}</p>
                  <div className="operational-insights__metric-trend">
                    <span className={`operational-insights__trend-icon operational-insights__trend-icon--${m.trendUp ? 'success' : 'warning'}`}>
                      {m.trendUp ? '↑' : '↓'}
                    </span>
                    <span style={{ fontSize: '0.875rem', color: m.trendUp ? '#22C55E' : '#F59E0B' }}>{m.trend}</span>
                  </div>
                </div>
                <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', background: `${m.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                  {m.variant === 'indigo' ? '👤' : m.variant === 'success' ? '💰' : m.variant === 'gold' ? '🚌' : '📊'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={{ background: '#fff', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Department Performance</h3>
          {[{ dept: 'Academic', score: 92 }, { dept: 'Administration', score: 87 }, { dept: 'Transport', score: 94 }, { dept: 'Support', score: 80 }].map((d) => (
            <div key={d.dept} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                <span>{d.dept}</span><span style={{ fontWeight: 600 }}>{d.score}%</span>
              </div>
              <div style={{ height: '0.5rem', background: '#e5e7eb', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${d.score}%`, background: 'linear-gradient(90deg, #C9A962, #4F46E5)', borderRadius: '9999px' }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: '#fff', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Monthly Summary</h3>
          {[
            { label: 'Total Working Days', value: '22' },
            { label: 'Avg Staff Attendance', value: '96.2%' },
            { label: 'Leaves Approved', value: '34' },
            { label: 'Grievances Resolved', value: '43' },
            { label: 'Events Conducted', value: '5' },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6', fontSize: '0.875rem' }}>
              <span style={{ color: '#6B7280' }}>{item.label}</span>
              <span style={{ fontWeight: 600 }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
