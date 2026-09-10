import React from 'react'
import { DocumentTextIcon } from '@heroicons/react/24/outline'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import Card from '../../layout/Card'

const AssignmentsWidget = ({ data }) => {
  const { title, value, change, icon, color, bgColor, pendingCount, completedCount, totalCount } = data

  const chartData = [
    { name: 'Completed', value: completedCount, color: '#10B981' },
    { name: 'Pending', value: pendingCount, color: '#F59E0B' }
  ]

  return (
    <Card variant="glass" className="widget-card">
      <div className="widget-header">
        <div className={`widget-icon-wrapper ${bgColor}`}>
          <DocumentTextIcon className={`widget-icon ${color}`} />
        </div>
        <div className="widget-badge widget-badge-warning">
          {change}
        </div>
      </div>

      <div className="widget-body">
        <h3 className="widget-title">
          {title}
        </h3>
        <p className="widget-value">
          {value}
        </p>
      </div>

      {/* Mini pie chart */}
      <div className="widget-chart-row">
        <div className="widget-pie-chart">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={12}
                outerRadius={20}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="widget-legend">
          <div className="widget-legend-item">
            <div className="widget-legend-dot widget-legend-dot-green"></div>
            Completed: {completedCount}
          </div>
          <div className="widget-legend-item">
            <div className="widget-legend-dot widget-legend-dot-yellow"></div>
            Pending: {pendingCount}
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="widget-decoration widget-decoration-blue"></div>
    </Card>
  )
}

export default AssignmentsWidget