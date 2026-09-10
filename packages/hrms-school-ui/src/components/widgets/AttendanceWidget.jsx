import React from 'react'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import Card from '../../layout/Card'

const AttendanceWidget = ({ data }) => {
  const { title, value, change, trend, icon, color, bgColor, data: chartData } = data

  return (
    <Card variant="glass" className="widget-card">
      <div className="widget-header">
        <div className={`widget-icon-wrapper ${bgColor}`}>
          <CheckCircleIcon className={`widget-icon ${color}`} />
        </div>
        <div className={`widget-badge ${
          trend === 'up' 
            ? 'widget-badge-up'
            : trend === 'down'
            ? 'widget-badge-down' 
            : 'widget-badge-neutral'
        }`}>
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

      {/* Mini chart */}
      <div className="widget-line-chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#10B981" 
              strokeWidth={2} 
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Background decoration */}
      <div className="widget-decoration widget-decoration-green"></div>
    </Card>
  )
}

export default AttendanceWidget