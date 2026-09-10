import { useState, useEffect } from 'react';
import { useAuth } from '../../../../../../src/hooks/useAuth';
import { isTeachingStaff, isNonTeachingStaff } from '../../../utils/helpers';

const useOverview = () => {
  const { userId, user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Teaching staff mock data generator
  const getTeachingStaffData = (userId) => {
    return {
      todayClasses: {
        total: 6,
        completed: 3,
        upcoming: 3,
        progress: [true, true, true, false, false, false]
      },
      attendance: {
        percentage: 92,
        label: 'Average class attendance'
      },
      pendingAssignments: {
        count: 18,
        label: '12 need grading'
      },
      leaveRequests: {
        count: 4,
        label: '2 pending approval'
      },
      complianceData: [
        { id: 1, title: 'Student Progress Reports', status: 'Completed', dueDate: 'Jan 15', description: 'Quarterly progress reports' },
        { id: 2, title: 'Attendance Register', status: 'Pending', dueDate: 'Jan 20', description: 'Monthly attendance submission' },
        { id: 3, title: 'Lesson Plans - Q1', status: 'Expiring Soon', dueDate: 'Jan 18', description: 'Submit Q1 lesson plans' },
        { id: 4, title: 'Safety Training Certificate', status: 'Completed', dueDate: 'Jan 10', description: 'Annual safety training' },
        { id: 5, title: 'Parent-Teacher Meeting Log', status: 'Pending', dueDate: 'Jan 25', description: 'Meeting attendance log' },
        { id: 6, title: 'Assessment Records', status: 'Overdue', dueDate: 'Jan 12', description: 'Student assessment documentation' },
        { id: 7, title: 'Professional Development Hours', status: 'Pending', dueDate: 'Jan 30', description: 'CPD hours verification' }
      ],
      tasks: [
        { id: 1, title: 'Grade Math Test Papers - Class 10A', category: 'Academic', priority: 'HIGH', daysLeft: 2 },
        { id: 2, title: 'Prepare Science Quiz', category: 'Academic', priority: 'MEDIUM', daysLeft: 5 },
        { id: 3, title: 'Update Lesson Plans', category: 'Academic', priority: 'MEDIUM', daysLeft: 7 },
        { id: 4, title: 'Submit Attendance Report', category: 'Administrative', priority: 'HIGH', daysLeft: 1 },
        { id: 5, title: 'Parent-Teacher Meeting Prep', category: 'Communication', priority: 'HIGH', daysLeft: 3 },
        { id: 6, title: 'Review Student Assignments', category: 'Academic', priority: 'MEDIUM', daysLeft: 4 },
        { id: 7, title: 'Exam Question Paper Review', category: 'Academic', priority: 'HIGH', daysLeft: 0 },
        { id: 8, title: 'Faculty Meeting Notes', category: 'General', priority: 'LOW', daysLeft: 10 }
      ],
      todayPlan: {
        suggestions: [
          '📝 Grade pending assignments from Class 10A',
          '👥 Prepare for parent meeting at 3 PM',
          '📊 Review low-performing students in Math',
          '📧 Send weekly progress emails to parents'
        ],
        overview: [
          { text: 'Grade Math Test Papers - Class 10A' },
          { text: 'Prepare Science Quiz for next week' },
          { text: 'Parent-Teacher Conference at 3 PM' },
        ],
        aiSuggestions: [
          { title: 'Focus on struggling students', subtitle: 'Michael & Emma need extra attention', priority: 'High' },
          { title: 'Schedule review sessions', subtitle: 'Plan before mid-term exams', priority: 'Medium' },
        ]
      },
      studentAlerts: {
        absences: [
          { id: 1, name: 'Alex Johnson', class: '10-A', days: 3, reason: 'Medical' },
          { id: 2, name: 'Sarah Williams', class: '9-B', days: 2, reason: 'Not specified' }
        ],
        continuousAbsences: [
          { id: 1, name: 'Alex Johnson', class: '10-A', days: 3, reason: 'Medical' },
          { id: 2, name: 'Sarah Williams', class: '9-B', days: 2, reason: 'Not specified' }
        ],
        lowPerformers: [
          { id: 1, name: 'Michael Brown', subject: 'Mathematics', grade: 'D', trend: 'declining' },
          { id: 2, name: 'Emma Davis', subject: 'Physics', grade: 'C-', trend: 'stable' }
        ],
        birthdays: [
          { id: 1, name: 'Olivia Martinez', class: '10-A', date: 'Today' }
        ],
        newAdmissions: [
          { id: 1, name: 'Liam Anderson', class: '9-C', date: 'Jan 10' }
        ]
      },
      classPerformance: {
        averageGrade: 'B+',
        passingRate: 89,
        improvementRate: +5,
        metrics: [
          { label: 'Average Grade', value: 'B+', change: '+0.5' },
          { label: 'Passing Rate', value: '89%', change: '+3%' },
          { label: 'Improvement Rate', value: '+5%', comparison: 'vs last term' },
          { label: 'Top Performers', value: '3', comparison: 'this term' },
        ],
        topPerformers: [
          { id: 1, name: 'Sophie Chen', grade: 'A+', subject: 'Mathematics' },
          { id: 2, name: 'James Wilson', grade: 'A', subject: 'Physics' },
          { id: 3, name: 'Ava Taylor', grade: 'A', subject: 'Chemistry' }
        ],
        needsAttention: [
          { id: 1, name: 'Michael Brown', reason: 'Declining grades', action: 'Schedule meeting' },
          { id: 2, name: 'Isabella Garcia', reason: 'Low attendance', action: 'Contact parents' }
        ]
      },
      meetings: [
        { id: 1, title: 'Department Meeting', time: '10:00 AM', type: 'In-Person', room: 'Staff Room 2' },
        { id: 2, title: 'Parent-Teacher Conference', time: '03:00 PM', type: 'Virtual', room: 'Zoom Link' },
        { id: 3, title: 'Curriculum Review', time: '04:30 PM', type: 'In-Person', room: 'Conference Hall' },
        { id: 4, title: 'Student Counseling Session', time: '02:00 PM', type: 'In-Person', room: 'Counseling Room' }
      ],
      announcements: [
        { id: 1, title: 'Mid-term Exam Schedule Released', priority: 'high', time: '2 hours ago', description: 'Check the exam calendar' },
        { id: 2, title: 'Professional Development Workshop', priority: 'medium', time: '5 hours ago', description: 'Next Friday at 3 PM' },
        { id: 3, title: 'New Grading Guidelines', priority: 'high', time: '1 day ago', description: 'Updated assessment criteria' },
        { id: 4, title: 'Parent-Teacher Day - Jan 25', priority: 'medium', time: '2 days ago', description: 'Book your slots' }
      ],
      aiInsights: {
        summary: 'Your class performance is trending upward with 89% passing rate.',
        recommendations: ['Focus on struggling students', 'Plan review sessions'],
        cards: [
          { type: 'success', text: 'Class 10A improved by 5% this month' },
          { type: 'warning', text: '2 students at risk of failing Mathematics' },
          { type: 'info', text: 'Assignment submission rate is 92% this week' },
        ],
        chartData: [
          { month: 'Aug', class10A: 50, class9A: 45, class9B: 35 },
          { month: 'Sep', class10A: 58, class9A: 50, class9B: 35 },
          { month: 'Oct', class10A: 68, class9A: 57, class9B: 45 },
          { month: 'Nov', class10A: 74, class9A: 63, class9B: 52 },
        ]
      }
    };
  };

  // Non-teaching staff mock data generator
  const getNonTeachingStaffData = (userId) => {
    return {
      todayClasses: {
        total: 8,
        completed: 4,
        upcoming: 4,
        progress: [true, true, true, true, false, false, false, false]
      },
      attendance: {
        percentage: 95,
        label: 'Student participation rate'
      },
      pendingAssignments: {
        count: 12,
        label: '8 equipment requests'
      },
      leaveRequests: {
        count: 3,
        label: '1 pending approval'
      },
      complianceData: [
        { id: 1, title: 'Sports Equipment Inventory', status: 'Completed', dueDate: 'Jan 15', description: 'Quarterly inventory check' },
        { id: 2, title: 'Facility Safety Inspection', status: 'Pending', dueDate: 'Jan 20', description: 'Monthly safety audit' },
        { id: 3, title: 'Event Planning Report', status: 'Expiring Soon', dueDate: 'Jan 18', description: 'Annual sports day planning' },
        { id: 4, title: 'First Aid Certification', status: 'Completed', dueDate: 'Jan 10', description: 'Annual certification renewal' },
        { id: 5, title: 'Student Participation Log', status: 'Pending', dueDate: 'Jan 25', description: 'Activity participation records' },
        { id: 6, title: 'Equipment Maintenance Records', status: 'Overdue', dueDate: 'Jan 12', description: 'Maintenance documentation' },
        { id: 7, title: 'Budget Utilization Report', status: 'Pending', dueDate: 'Jan 30', description: 'Department budget review' }
      ],
      tasks: [
        { id: 1, title: 'Organize Inter-School Sports Meet', category: 'Events', priority: 'HIGH', daysLeft: 2 },
        { id: 2, title: 'Equipment Purchase Requisition', category: 'Administrative', priority: 'MEDIUM', daysLeft: 5 },
        { id: 3, title: 'Update Sports Activity Schedule', category: 'Planning', priority: 'MEDIUM', daysLeft: 7 },
        { id: 4, title: 'Facility Maintenance Check', category: 'Operations', priority: 'HIGH', daysLeft: 1 },
        { id: 5, title: 'Student Performance Tracking', category: 'Evaluation', priority: 'HIGH', daysLeft: 3 },
        { id: 6, title: 'Coach Training Session Prep', category: 'Development', priority: 'MEDIUM', daysLeft: 4 },
        { id: 7, title: 'Annual Sports Day Planning', category: 'Events', priority: 'HIGH', daysLeft: 0 },
        { id: 8, title: 'Budget Review Meeting', category: 'General', priority: 'LOW', daysLeft: 10 }
      ],
      todayPlan: {
        suggestions: [
          '⚽ Conduct morning sports practice session',
          '📋 Review equipment requisition forms',
          '🎯 Plan upcoming inter-school competition',
          '📊 Update student participation records'
        ],
        overview: [
          { text: 'Conduct morning sports practice session' },
          { text: 'Review equipment requisition forms' },
          { text: 'Annual Sports Day planning meeting at 2 PM' },
        ],
        aiSuggestions: [
          { title: 'Focus on underperforming students', subtitle: 'Alex & Sarah need extra coaching', priority: 'High' },
          { title: 'Plan inter-school competition', subtitle: 'Registration deadline approaching', priority: 'Medium' },
        ]
      },
      studentAlerts: {
        absences: [
          { id: 1, name: 'Alex Johnson', activity: 'Football Practice', days: 2, reason: 'Injury' },
          { id: 2, name: 'Sarah Williams', activity: 'Basketball', days: 3, reason: 'Not specified' }
        ],
        continuousAbsences: [
          { id: 1, name: 'Alex Johnson', activity: 'Football Practice', days: 2, reason: 'Injury' },
          { id: 2, name: 'Sarah Williams', activity: 'Basketball', days: 3, reason: 'Not specified' }
        ],
        lowPerformers: [
          { id: 1, name: 'Michael Brown', activity: 'Athletics', performance: 'Below Average', trend: 'declining' },
          { id: 2, name: 'Emma Davis', activity: 'Swimming', performance: 'Needs Improvement', trend: 'stable' }
        ],
        birthdays: [
          { id: 1, name: 'Olivia Martinez', activity: 'Volleyball', date: 'Today' }
        ],
        newAdmissions: [
          { id: 1, name: 'Liam Anderson', activity: 'Football', date: 'Jan 10' }
        ]
      },
      classPerformance: {
        averageGrade: 'A-',
        passingRate: 94,
        improvementRate: +7,
        metrics: [
          { label: 'Average Grade', value: 'A-', change: '+0.3' },
          { label: 'Participation Rate', value: '94%', change: '+2%' },
          { label: 'Improvement Rate', value: '+7%', comparison: 'vs last term' },
          { label: 'Top Performers', value: '3', comparison: 'this term' },
        ],
        topPerformers: [
          { id: 1, name: 'Sophie Chen', grade: 'Excellent', subject: 'Athletics' },
          { id: 2, name: 'James Wilson', grade: 'Excellent', subject: 'Football' },
          { id: 3, name: 'Ava Taylor', grade: 'Outstanding', subject: 'Swimming' }
        ],
        needsAttention: [
          { id: 1, name: 'Michael Brown', reason: 'Low participation', action: 'Motivational session' },
          { id: 2, name: 'Isabella Garcia', reason: 'Performance decline', action: 'Extra coaching' }
        ]
      },
      meetings: [
        { id: 1, title: 'Sports Committee Meeting', time: '10:00 AM', type: 'In-Person', room: 'Sports Office' },
        { id: 2, title: 'Equipment Vendor Discussion', time: '02:00 PM', type: 'Virtual', room: 'Zoom Link' },
        { id: 3, title: 'Annual Sports Day Planning', time: '04:00 PM', type: 'In-Person', room: 'Conference Hall' },
        { id: 4, title: 'Coach Training Workshop', time: '11:00 AM', type: 'In-Person', room: 'Training Center' }
      ],
      announcements: [
        { id: 1, title: 'Inter-School Sports Meet - Feb 15', priority: 'high', time: '2 hours ago', description: 'Registration deadline: Jan 25' },
        { id: 2, title: 'New Sports Equipment Arrived', priority: 'medium', time: '5 hours ago', description: 'Available for distribution' },
        { id: 3, title: 'Facility Upgrade Schedule', priority: 'high', time: '1 day ago', description: 'Gymnasium renovation starts Feb 1' },
        { id: 4, title: 'Student Achievement Awards', priority: 'medium', time: '2 days ago', description: 'Nominations open' }
      ],
      aiInsights: {
        summary: 'Student engagement is high with 95% participation rate.',
        recommendations: ['Focus on underperforming students', 'Plan more inter-school events'],
        cards: [
          { type: 'success', text: 'Participation rate increased to 95% this month' },
          { type: 'warning', text: '2 students showing declining performance in Athletics' },
          { type: 'info', text: 'Inter-school competition registration closes Jan 25' },
        ],
        chartData: [
          { month: 'Aug', class10A: 48, class9A: 42, class9B: 38 },
          { month: 'Sep', class10A: 55, class9A: 50, class9B: 42 },
          { month: 'Oct', class10A: 65, class9A: 58, class9B: 48 },
          { month: 'Nov', class10A: 72, class9A: 65, class9B: 55 },
        ]
      }
    };
  };

  useEffect(() => {
    // Console output for staff type detection
    const staffType = isTeachingStaff(userId) ? 'Teaching Staff' : 'Non-Teaching Staff';
    console.log('\n📊 OVERVIEW DATA LOADING');
    console.log('├─ User ID:', userId);
    console.log('├─ Staff Type Detected:', staffType);
    console.log('├─ User Name:', user?.name);
    console.log('└─ Loading Data Generator:', isTeachingStaff(userId) ? 'getTeachingStaffData()' : 'getNonTeachingStaffData()');
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      console.log('✅ Overview data loaded successfully for', staffType);
    }, 500);
  }, [userId, user]);

  // Determine which data to return based on userId
  const staffData = isTeachingStaff(userId) 
    ? getTeachingStaffData(userId) 
    : getNonTeachingStaffData(userId);

  // Transform complianceData array into the shape Overview.jsx expects
  const complianceItems = staffData.complianceData || [];
  const complianceData = {
    items: complianceItems,
    completed: complianceItems.filter((i) => i.status === 'Completed').length,
    pending: complianceItems.filter((i) => i.status === 'Pending').length,
    overdue: complianceItems.filter((i) => i.status === 'Overdue').length,
    expiringSoon: complianceItems.filter((i) => i.status === 'Expiring Soon').length,
    overall: complianceItems.length
      ? Math.round((complianceItems.filter((i) => i.status === 'Completed').length / complianceItems.length) * 100)
      : 0,
  };

  return {
    loading,
    userId,
    ...staffData,
    complianceData,
  };
};

export default useOverview;

