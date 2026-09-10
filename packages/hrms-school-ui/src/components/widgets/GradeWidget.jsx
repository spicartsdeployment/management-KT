import React from 'react'
import { AcademicCapIcon } from '@heroicons/react/24/outline'
import Card from '../../layout/Card'

const GradeWidget = ({ data }) => {
  const { title, value, change, trend, icon, color, bgColor, gpa, maxGpa, subjects } = data

  // Calculate GPA percentage for visualization
  const gpaPercentage = (gpa / maxGpa) * 100

  // Get grade color based on performance
  const getGradeColor = (grade) => {
    switch(grade) {
      case 'A+': return 'text-green-600 dark:text-green-400'
      case 'A': return 'text-green-500 dark:text-green-300'
      case 'B+': return 'text-blue-600 dark:text-blue-400'
      case 'B': return 'text-blue-500 dark:text-blue-300'
      case 'C+': return 'text-yellow-600 dark:text-yellow-400'
      case 'C': return 'text-yellow-500 dark:text-yellow-300'
      default: return 'text-red-600 dark:text-red-400'
    }
  }

  return (
    <Card variant="glass" className="widget-card">
      <div className="widget-header">
        <div className={`widget-icon-wrapper ${bgColor}`}>
          <AcademicCapIcon className={`widget-icon ${color}`} />
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
        <div className="widget-grade-row">
          <p className={`widget-grade-value ${getGradeColor(value)}`}>
            {value}
          </p>
          <p className="widget-gpa-label">
            GPA {gpa}/{maxGpa}
          </p>
        </div>
      </div>

      {/* GPA visualization */}
      <div className="widget-progress">
        <div className="widget-progress-header">
          <span>GPA Progress</span>
          <span>{gpa}/{maxGpa}</span>
        </div>
        <div className="widget-progress-track">
          <div 
            className="widget-progress-bar widget-progress-bar-purple"
            style={{ width: `${gpaPercentage}%` }}
          />
        </div>
      </div>

      {/* Subject count */}
      <div className="widget-footer">
        Based on {subjects} subjects
      </div>

      {/* Background decoration */}
      <div className="widget-decoration widget-decoration-purple"></div>
    </Card>
  )
}

export default GradeWidget