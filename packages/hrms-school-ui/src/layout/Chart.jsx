import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
const data = [
  { name: 'Jan', Attendance: 90, Grades: 85, Assignments: 80 },
  { name: 'Feb', Attendance: 92, Grades: 88, Assignments: 82 },
  { name: 'Mar', Attendance: 91, Grades: 87, Assignments: 85 },
  { name: 'Apr', Attendance: 93, Grades: 89, Assignments: 88 },
  { name: 'May', Attendance: 94, Grades: 90, Assignments: 90 },
  { name: 'Jun', Attendance: 95, Grades: 92, Assignments: 92 },
]
const Chart = () => (
  <div>
    <ResponsiveContainer width="100%" height={120}>
      <LineChart data={data}>
        <XAxis dataKey="name" />
        <YAxis domain={[70, 100]} />
        <Tooltip />
        <Line type="monotone" dataKey="Attendance" stroke="#F59E0B" strokeWidth={2} />
        <Line type="monotone" dataKey="Grades" stroke="#10B981" strokeWidth={2} />
        <Line type="monotone" dataKey="Assignments" stroke="#6366F1" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
    {/* Legend below chart */}
    <div className="chart-legend">
      <span className="chart-legend-item">
        <span className="chart-legend-dot chart-legend-dot-orange" data-testid="school-dot-attendance" />
        <span className="chart-legend-label">Attendance</span>
      </span>
      <span className="chart-legend-item">
        <span className="chart-legend-dot chart-legend-dot-purple" data-testid="school-dot-grades" />
        <span className="chart-legend-label">Grades</span>
      </span>
      <span className="chart-legend-item">
        <span className="chart-legend-dot chart-legend-dot-teal" data-testid="school-dot-assignments" />
        <span className="chart-legend-label">Assignments</span>
      </span>
    </div>
  </div>
)
export default Chart
