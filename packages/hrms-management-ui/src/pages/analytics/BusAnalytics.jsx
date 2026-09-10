import React from 'react';
import ManagementPageHeader from '../../app/components/common/ManagementPageHeader';

const metrics = [
  { label: 'Total Buses', value: '12', trend: '+2 this year', color: '#C9A962', bg: 'rgba(201,169,98,0.08)' },
  { label: 'Avg Occupancy', value: '82%', trend: '+5% this month', color: '#22C55E', bg: 'rgba(34,197,94,0.08)' },
  { label: 'On-time Rate', value: '94%', trend: '+1.2% this week', color: '#4F46E5', bg: 'rgba(79,70,229,0.08)' },
  { label: 'Incidents', value: '3', trend: '-2 from last month', color: '#EF4444', bg: 'rgba(239,68,68,0.08)' },
];

const busData = [
  { bus: 'KA-01-AB-1234', route: 'Route 3 - North', students: 32, capacity: 40, onTime: '96%', driver: 'Raju Singh', utilization: 80 },
  { bus: 'KA-01-CD-5678', route: 'Route 5 - East', students: 28, capacity: 35, onTime: '92%', driver: 'Mohan Das', utilization: 80 },
  { bus: 'KA-01-EF-9012', route: 'Route 1 - South', students: 35, capacity: 40, onTime: '95%', driver: 'Suresh Kumar', utilization: 87 },
];

const titleStyle = {
  fontSize: '1.875rem', fontWeight: 700,
  background: 'linear-gradient(to right, #C9A962, #2C2C2C)',
  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  backgroundClip: 'text', margin: 0,
};

/**
 * BusAnalytics - analyze bus utilization and transport efficiency
 */
export default function BusAnalytics() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} data-testid="school-page-bus-analytics">
      <ManagementPageHeader
        breadcrumbs={[
          { label: "Analytics" },
          { label: "Bus Analytics" },
        ]}
        title="Bus Analytics"
        subtitle="Analyze bus utilization and transport efficiency"
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        {metrics.map((m) => (
          <div key={m.label} style={{ background: m.bg, borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>{m.label}</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: m.color, marginBottom: '0.25rem' }}>{m.value}</p>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{m.trend}</p>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f3f4f6' }}>
          <h3 style={{ margin: 0, fontWeight: 600 }}>Bus Performance Overview</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              {['Bus Number', 'Route', 'Students', 'On-Time Rate', 'Driver', 'Utilization'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {busData.map((b) => (
              <tr key={b.bus} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#C9A962' }}>{b.bus}</td>
                <td style={{ padding: '0.75rem 1rem' }}>{b.route}</td>
                <td style={{ padding: '0.75rem 1rem' }}>{b.students}/{b.capacity}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#22C55E', fontWeight: 600 }}>{b.onTime}</td>
                <td style={{ padding: '0.75rem 1rem' }}>{b.driver}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ flex: 1, height: '0.5rem', background: '#e5e7eb', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${b.utilization}%`, background: '#22C55E', borderRadius: '9999px' }} />
                    </div>
                    <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>{b.utilization}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
