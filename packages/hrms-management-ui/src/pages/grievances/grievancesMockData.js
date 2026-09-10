/**
 * Grievance Mock Data
 * Complete mock data system for testing and development
 */

// ─────────────────────────────────────────────────────────────────────────
// Categories
// ─────────────────────────────────────────────────────────────────────────
export const GRIEVANCE_CATEGORIES = [
  { id: 'academic', label: 'Academic', icon: '📚', color: '#2563eb' },
  { id: 'discipline', label: 'Discipline', icon: '⚠️', color: '#dc2626' },
  { id: 'transport', label: 'Transport', icon: '🚌', color: '#d97706' },
  { id: 'hostel', label: 'Hostel', icon: '🏠', color: '#e11d48' },
  { id: 'fees', label: 'Fees', icon: '💰', color: '#6366f1' },
  { id: 'infrastructure', label: 'Infrastructure', icon: '🏗️', color: '#10b981' },
  { id: 'sports', label: 'Sports', icon: '⚽', color: '#f59e0b' },
  { id: 'safety', label: 'Safety', icon: '🔒', color: '#b91c1c' },
  { id: 'hr', label: 'HR', icon: '👥', color: '#7c3aed' },
  { id: 'administration', label: 'Administration', icon: '📋', color: '#0891b2' },
  { id: 'maintenance', label: 'Maintenance', icon: '🔧', color: '#84cc16' },
];

// ─────────────────────────────────────────────────────────────────────────
// Priorities
// ─────────────────────────────────────────────────────────────────────────
export const GRIEVANCE_PRIORITIES = [
  { id: 'low', label: 'Low', color: '#22C55E' },
  { id: 'medium', label: 'Medium', color: '#F59E0B' },
  { id: 'high', label: 'High', color: '#EF4444' },
  { id: 'critical', label: 'Critical', color: '#7F1D1D' },
];

// ─────────────────────────────────────────────────────────────────────────
// Statuses
// ─────────────────────────────────────────────────────────────────────────
export const GRIEVANCE_STATUSES = [
  { id: 'open', label: 'Open', color: '#EF4444' },
  { id: 'assigned', label: 'Assigned', color: '#3B82F6' },
  { id: 'under_review', label: 'Under Review', color: '#8B5CF6' },
  { id: 'in_progress', label: 'In Progress', color: '#F59E0B' },
  { id: 'escalated', label: 'Escalated', color: '#DC2626' },
  { id: 'resolved', label: 'Resolved', color: '#22C55E' },
  { id: 'closed', label: 'Closed', color: '#6B7280' },
  { id: 'rejected', label: 'Rejected', color: '#9333EA' },
  { id: 'awaiting_response', label: 'Awaiting Response', color: '#0891B2' },
];

// ─────────────────────────────────────────────────────────────────────────
// Complainant Types
// ─────────────────────────────────────────────────────────────────────────
export const COMPLAINANT_TYPES = [
  { id: 'student', label: 'Student' },
  { id: 'parent', label: 'Parent' },
  { id: 'teaching_staff', label: 'Teaching Staff' },
  { id: 'non_teaching_staff', label: 'Non-Teaching Staff' },
];

// ─────────────────────────────────────────────────────────────────────────
// Assignable Roles
// ─────────────────────────────────────────────────────────────────────────
export const ASSIGNABLE_ROLES = [
  { id: 'principal', label: 'Principal', initials: 'P' },
  { id: 'hr_manager', label: 'HR Manager', initials: 'HR' },
  { id: 'accounts_team', label: 'Accounts Team', initials: 'AT' },
  { id: 'transport_manager', label: 'Transport Manager', initials: 'TM' },
  { id: 'hostel_warden', label: 'Hostel Warden', initials: 'HW' },
  { id: 'maintenance_team', label: 'Maintenance Team', initials: 'MT' },
  { id: 'discipline_committee', label: 'Discipline Committee', initials: 'DC' },
  { id: 'coordinator', label: 'Coordinator', initials: 'C' },
  { id: 'teacher', label: 'Teacher', initials: 'T' },
];

// ─────────────────────────────────────────────────────────────────────────
// Mock Grievances (15 complete objects)
// ─────────────────────────────────────────────────────────────────────────
export const MOCK_GRIEVANCES = [
  {
    id: 'GRV001',
    category: 'academic',
    priority: 'high',
    status: 'assigned',
    complainantType: 'student',
    complainantName: 'Aarav Sharma',
    studentId: 'STU-2026-5847',
    fatherName: 'Mr. Rajesh Sharma',
    motherName: 'Mrs. Meera Sharma',
    class: 'Class 10-A',
    section: 'A',
    rollNumber: '47',
    dateOfBirth: '2011-07-15',
    address: 'Block D, Shakarpur Colony, New Delhi, 110090',
    contactEmail: 'aarav.sharma@student.com',
    contactPhone: '+91-98765-43210',
    parentPhone: '+91-98765-43209',
    title: 'Difficulty in Mathematics Curriculum',
    description: 'Student reports difficulty understanding the Mathematics curriculum, particularly in Algebra and Calculus sections. Requesting additional support sessions and clarification on concepts. Student is willing to attend remedial classes during lunch breaks. Performance in recent tests has been below average.',
    createdDate: '2026-05-01T10:30:00Z',
    lastUpdated: '2026-05-02T14:20:00Z',
    deadline: '2026-05-08T23:59:59Z',
    assignedTo: 'Teacher',
    slaStatus: 'on_track',
    internalNotes: [
      { author: 'Teacher', text: 'Student shows strong foundation in basics. Needs focused coaching on algebraic identities. Scheduled 3 remedial sessions for next week. Parent meeting completed - fully supportive of extra classes.', timestamp: '2026-05-02T14:20:00Z' },
    ],
    attachments: [
      { id: 'att001', name: 'math_doubts.pdf', size: '2.4 MB', type: 'pdf', uploadedDate: '2026-05-01T10:30:00Z' },
      { id: 'att002', name: 'test_scores.pdf', size: '1.1 MB', type: 'pdf', uploadedDate: '2026-05-02T10:30:00Z' },
    ],
    activityLog: [
      { id: 'act001', type: 'created', user: 'Aarav Sharma', message: 'Grievance created', timestamp: '2026-05-01T10:30:00Z' },
      { id: 'act002', type: 'assigned', user: 'Coordinator', message: 'Assigned to Teacher for support', timestamp: '2026-05-02T12:00:00Z' },
    ],
    communicationHistory: [],
  },
  {
    id: 'GRV002',
    category: 'transport',
    priority: 'medium',
    status: 'in_progress',
    complainantType: 'parent',
    complainantName: 'Mrs. Priya Nair',
    parentId: 'PAR-2026-3421',
    studentName: 'Aditya Nair',
    studentId: 'STU-2026-4521',
    class: 'Class 8-B',
    address: 'Apartment 302, Green Valley Complex, Sector 5, Bangalore, 560034',
    contactEmail: 'priya.nair@email.com',
    contactPhone: '+91-98765-43211',
    alternatePhone: '+91-98765-43212',
    fatherName: 'Mr. Rajesh Nair',
    fatherPhone: '+91-98765-43213',
    title: 'Bus Route Delay Issue',
    description: 'Bus GRV-12 consistently arriving 15-20 minutes late to school. This is causing attendance issues for students and concerns about punctuality. The bus is usually full, and students are standing the entire journey. Request for route optimization, additional buses, or schedule adjustment.',
    busNumber: 'GRV-12',
    routeName: 'North-East Circuit',
    createdDate: '2026-04-28T14:15:00Z',
    lastUpdated: '2026-05-02T09:00:00Z',
    deadline: '2026-05-05T23:59:59Z',
    assignedTo: 'transport_manager',
    slaStatus: 'on_track',
    internalNotes: [
      { author: 'Transport Manager', text: 'Investigating route with driver. Possible traffic congestion during peak hours. Alternative route being evaluated. Expected resolution by May 5.', timestamp: '2026-04-30T15:00:00Z' },
    ],
    attachments: [],
    activityLog: [
      { id: 'act002', type: 'created', user: 'Mrs. Priya Nair', message: 'Grievance created', timestamp: '2026-04-28T14:15:00Z' },
      { id: 'act003', type: 'assigned', user: 'Principal', message: 'Assigned to Transport Manager', timestamp: '2026-04-28T15:00:00Z' },
      { id: 'act004', type: 'status_updated', user: 'Transport Manager', message: 'Status changed to In Progress', timestamp: '2026-04-29T10:00:00Z' },
    ],
    communicationHistory: [
      { id: 'comm001', from: 'Transport Manager', to: 'Mrs. Priya Nair', message: 'We are investigating the bus delay issue. Will provide update soon.', timestamp: '2026-04-29T11:00:00Z', channel: 'email' },
    ],
  },
  {
    id: 'GRV003',
    category: 'hostel',
    priority: 'critical',
    status: 'escalated',
    complainantType: 'student',
    complainantName: 'Rohan Mehta',
    studentId: 'STU-2026-2847',
    fatherName: 'Mr. Vikram Mehta',
    motherName: 'Mrs. Divya Mehta',
    class: 'Class 12-A',
    hostelBlock: 'Block C',
    roomNumber: '304',
    rollNumber: '21',
    dateOfBirth: '2008-03-20',
    address: 'Flat 5, Imperial Heights, Connaught Place, New Delhi, 110001',
    contactEmail: 'rohan.mehta@student.com',
    contactPhone: '+91-98765-43212',
    parentPhone: '+91-98765-43211',
    title: 'Hostel Room Hygiene Concerns',
    description: 'Critical hygiene issues in hostel room - rodent infestation, mold in bathroom, unhygienic food storage, and pest droppings visible on furniture. Health hazard for all residents (4 occupants). Room has no proper ventilation. Immediate action required for occupant safety.',
    createdDate: '2026-05-01T22:45:00Z',
    lastUpdated: '2026-05-02T11:30:00Z',
    deadline: '2026-05-03T23:59:59Z',
    assignedTo: 'hostel_warden',
    slaStatus: 'overdue',
    internalNotes: [
      { author: 'Hostel Warden', text: 'Urgent inspection conducted. Confirmed rodent presence. Maintenance team notified. Temporary accommodation arranged in Block A for affected students.', timestamp: '2026-05-02T08:00:00Z' },
      { author: 'Principal', text: 'Escalated to management for immediate remediation. Temporary room shift approved. Health officer consulted for sanitization protocol.', timestamp: '2026-05-02T10:00:00Z' },
    ],
    attachments: [
      { id: 'att002', name: 'room_inspection_photo.jpg', size: '3.8 MB', type: 'image', uploadedDate: '2026-05-02T08:00:00Z' },
      { id: 'att003', name: 'inspection_report.pdf', size: '0.9 MB', type: 'pdf', uploadedDate: '2026-05-02T08:30:00Z' },
    ],
    activityLog: [
      { id: 'act005', type: 'created', user: 'Rohan Mehta', message: 'Grievance created', timestamp: '2026-05-01T22:45:00Z' },
      { id: 'act006', type: 'assigned', user: 'System', message: 'Auto-assigned to Hostel Warden (Critical)', timestamp: '2026-05-01T23:00:00Z' },
      { id: 'act007', type: 'status_updated', user: 'Hostel Warden', message: 'Status changed to Escalated', timestamp: '2026-05-02T10:30:00Z' },
    ],
    communicationHistory: [
      { id: 'comm002', from: 'Hostel Warden', to: 'Rohan Mehta', message: 'Your concern is being treated with utmost urgency. Room has been shifted. Remediation in progress.', timestamp: '2026-05-02T09:00:00Z', channel: 'sms' },
    ],
  },
  {
    id: 'GRV004',
    category: 'fees',
    priority: 'medium',
    status: 'resolved',
    complainantType: 'parent',
    complainantName: 'Mr. Vikram Gupta',
    parentId: 'PAR-2026-5123',
    studentName: 'Arjun Gupta',
    studentId: 'STU-2026-3456',
    class: 'Class 9-C',
    rollNumber: '18',
    address: 'House No. 45, Sector 8, Rohini, New Delhi, 110085',
    contactEmail: 'vikram.gupta@email.com',
    contactPhone: '+91-98765-43213',
    alternatePhone: '+91-98765-43214',
    motherName: 'Mrs. Priya Gupta',
    motherPhone: '+91-98765-43215',
    title: 'Incorrect Fee Deduction',
    description: 'Fee statement shows deduction for sports activity (Swimming - Rs. 5000) that student never enrolled in. Sports coordinator confirmed no enrollment for this activity. Request for refund and correction in records. Student has been charged incorrectly.',
    feesForSession: 'Session 2025-26',
    feeAmount: '5000',
    createdDate: '2026-04-20T13:20:00Z',
    lastUpdated: '2026-04-25T16:45:00Z',
    deadline: '2026-04-27T23:59:59Z',
    assignedTo: 'accounts_team',
    slaStatus: 'on_track',
    internalNotes: [
      { author: 'Accounts Team', text: 'Found enrollment error in database. Student never registered for swimming. Processed refund of Rs. 5000 to parent account. Reference: TXN-5847392.', timestamp: '2026-04-22T10:00:00Z' },
    ],
    attachments: [],
    activityLog: [
      { id: 'act008', type: 'created', user: 'Mr. Vikram Gupta', message: 'Grievance created', timestamp: '2026-04-20T13:20:00Z' },
      { id: 'act009', type: 'assigned', user: 'Principal', message: 'Assigned to Accounts Team', timestamp: '2026-04-20T14:00:00Z' },
      { id: 'act010', type: 'resolved', user: 'Accounts Team', message: 'Issue resolved. Refund processed.', timestamp: '2026-04-25T15:30:00Z' },
      { id: 'act011', type: 'closed', user: 'Principal', message: 'Grievance closed', timestamp: '2026-04-25T16:45:00Z' },
    ],
    communicationHistory: [
      { id: 'comm003', from: 'Accounts Team', to: 'Mr. Vikram Gupta', message: 'Your refund of Rs. 5000 has been processed. Check your account within 3-5 business days.', timestamp: '2026-04-24T14:00:00Z', channel: 'email' },
    ],
  },
  {
    id: 'GRV005',
    category: 'discipline',
    priority: 'high',
    status: 'under_review',
    complainantType: 'teaching_staff',
    complainantName: 'Mr. Rajesh Kumar',
    staffId: 'STF-2026-1342',
    department: 'Mathematics',
    subject: 'Mathematics',
    yearsOfService: '12 years',
    qualification: 'M.Sc Mathematics, B.Ed',
    class: 'Class 11-A',
    contactEmail: 'rajesh.kumar@school.com',
    contactPhone: '+91-98765-43214',
    alternatePhone: '+91-98765-43215',
    title: 'Student Behavior and Classroom Disruption',
    description: 'Repeated classroom disruption by student Ravi Patel (Roll No. 34), disrespectful behavior towards teacher, and refusal to follow instructions. Student talks back, uses mobile phone during class, distracts other students. This has been happening for 2 months. Impacting other students\' learning outcomes.',
    studentInvolvedName: 'Ravi Patel',
    studentInvolvedId: 'STU-2026-4782',
    incidentsCount: '8',
    createdDate: '2026-04-25T15:50:00Z',
    lastUpdated: '2026-05-02T10:00:00Z',
    deadline: '2026-05-06T23:59:59Z',
    assignedTo: 'discipline_committee',
    slaStatus: 'on_track',
    internalNotes: [
      { author: 'Discipline Committee', text: 'Student counseling session scheduled for May 5. Parents have been informed. Past disciplinary record reviewed - 3 previous incidents. Parents agreed to intervention program.', timestamp: '2026-05-01T14:00:00Z' },
    ],
    attachments: [
      { id: 'att005', name: 'incident_diary.docx', size: '0.6 MB', type: 'document', uploadedDate: '2026-04-25T15:50:00Z' },
    ],
    activityLog: [
      { id: 'act012', type: 'created', user: 'Mr. Rajesh Kumar', message: 'Grievance created', timestamp: '2026-04-25T15:50:00Z' },
      { id: 'act013', type: 'assigned', user: 'Principal', message: 'Assigned to Discipline Committee', timestamp: '2026-04-25T16:30:00Z' },
      { id: 'act014', type: 'status_updated', user: 'Discipline Committee', message: 'Status changed to Under Review', timestamp: '2026-04-26T09:00:00Z' },
    ],
    communicationHistory: [],
  },
  {
    id: 'GRV006',
    category: 'infrastructure',
    priority: 'high',
    status: 'assigned',
    complainantType: 'student',
    complainantName: 'Nisha Kapoor',
    studentId: 'STU-2026-2156',
    fatherName: 'Mr. Deepak Kapoor',
    motherName: 'Mrs. Anjali Kapoor',
    class: 'Class 10-B',
    rollNumber: '32',
    dateOfBirth: '2010-11-08',
    address: 'Villa 12, Sunrise Apartments, Greater Noida, 201301',
    contactEmail: 'nisha.kapoor@student.com',
    contactPhone: '+91-98765-43215',
    parentPhone: '+91-98765-43216',
    title: 'Lab Equipment Malfunction',
    description: 'Science lab equipment (spectrophotometer and microscopes) are non-functional. This is hindering practical classes and hands-on learning experience. Lab session scheduled for entire class next week. 35 students will be affected. Equipment not maintained for past 6 months.',
    labName: 'Physics Lab - Block B',
    equipmentAffected: ['Spectrophotometer', 'Microscopes (4 units)', 'Bunsen Burners'],
    lastMaintenanceDate: '2025-10-15',
    createdDate: '2026-04-27T11:30:00Z',
    lastUpdated: '2026-04-29T13:15:00Z',
    deadline: '2026-05-04T23:59:59Z',
    assignedTo: 'maintenance_team',
    slaStatus: 'on_track',
    internalNotes: [
      { author: 'Maintenance Team', text: 'Equipment inspection scheduled for May 2. Parts ordering in progress. Repair estimated to take 3-4 days. Temporary arrangements for practical classes being arranged.', timestamp: '2026-04-29T12:00:00Z' },
    ],
    attachments: [
      { id: 'att006', name: 'equipment_list.pdf', size: '0.4 MB', type: 'pdf', uploadedDate: '2026-04-27T11:30:00Z' },
    ],
    activityLog: [
      { id: 'act015', type: 'created', user: 'Nisha Kapoor', message: 'Grievance created', timestamp: '2026-04-27T11:30:00Z' },
      { id: 'act016', type: 'assigned', user: 'Principal', message: 'Assigned to Maintenance Team', timestamp: '2026-04-27T12:00:00Z' },
    ],
    communicationHistory: [],
  },
  {
    id: 'GRV007',
    category: 'academic',
    priority: 'low',
    status: 'closed',
    complainantType: 'student',
    complainantName: 'Amit Singh',
    studentId: 'STU-2026-5521',
    fatherName: 'Mr. Suresh Singh',
    motherName: 'Mrs. Neha Singh',
    class: 'Class 9-A',
    rollNumber: '12',
    dateOfBirth: '2010-02-14',
    address: 'Plot 78, Scheme 54, Indore, 452001',
    contactEmail: 'amit.singh@student.com',
    contactPhone: '+91-98765-43216',
    parentPhone: '+91-98765-43217',
    title: 'Grade Re-evaluation Request',
    description: 'Request for re-evaluation of Math exam paper (Test 3 - April 2026). Student believes answers were marked incorrectly. Specifically, Q.12 (algebraic expressions) and Q.18 (geometry) were not properly evaluated. Student achieved 68/100 but expects 74/100 after review.',
    examName: 'Term Test 3 - Mathematics',
    examDate: '2026-04-10',
    marksObtained: '68',
    marksExpected: '74',
    createdDate: '2026-04-15T09:45:00Z',
    lastUpdated: '2026-04-22T15:20:00Z',
    deadline: '2026-04-25T23:59:59Z',
    assignedTo: 'coordinator',
    slaStatus: 'on_track',
    internalNotes: [
      { author: 'Coordinator', text: 'Paper re-evaluated by Mathematics Head. 2 marks awarded for Q.12 (evaluation error). New grade: 70/100. Student satisfied with decision.', timestamp: '2026-04-20T11:00:00Z' },
    ],
    attachments: [
      { id: 'att007', name: 'exam_answer_copy.pdf', size: '2.1 MB', type: 'pdf', uploadedDate: '2026-04-15T09:45:00Z' },
    ],
    activityLog: [
      { id: 'act017', type: 'created', user: 'Amit Singh', message: 'Grievance created', timestamp: '2026-04-15T09:45:00Z' },
      { id: 'act018', type: 'assigned', user: 'Principal', message: 'Assigned to Coordinator', timestamp: '2026-04-15T10:30:00Z' },
      { id: 'act019', type: 'resolved', user: 'Coordinator', message: 'Paper re-evaluated and grade updated', timestamp: '2026-04-20T11:30:00Z' },
      { id: 'act020', type: 'closed', user: 'Principal', message: 'Grievance closed', timestamp: '2026-04-22T15:20:00Z' },
    ],
    communicationHistory: [
      { id: 'comm004', from: 'Coordinator', to: 'Amit Singh', message: 'Your paper has been re-evaluated. You have been awarded 2 additional marks. Best wishes!', timestamp: '2026-04-20T12:00:00Z', channel: 'email' },
    ],
  },
  {
    id: 'GRV008',
    category: 'sports',
    priority: 'medium',
    status: 'assigned',
    complainantType: 'parent',
    complainantName: 'Mr. Suresh Desai',
    parentId: 'PAR-2026-7834',
    studentName: 'Arjun Desai',
    studentId: 'STU-2026-6432',
    class: 'Class 8-C',
    rollNumber: '28',
    address: 'Flat 8B, Maple Gardens, Pune, 411005',
    contactEmail: 'suresh.desai@email.com',
    contactPhone: '+91-98765-43217',
    alternatePhone: '+91-98765-43218',
    fatherName: 'Mr. Suresh Desai',
    motherName: 'Mrs. Shruti Desai',
    title: 'Sports Equipment Availability',
    description: 'Limited sports equipment availability preventing students from practicing during PE periods. Need more cricket bats (currently only 3 for 150 students), balls, and volleyball nets for daily training. Equipment is worn out and several items are broken.',
    sportTypesAffected: ['Cricket', 'Volleyball', 'Badminton'],
    estimatedBudget: 'Rs. 85000',
    createdDate: '2026-04-24T16:10:00Z',
    lastUpdated: '2026-05-01T12:30:00Z',
    deadline: '2026-05-08T23:59:59Z',
    assignedTo: 'teacher',
    slaStatus: 'on_track',
    internalNotes: [
      { author: 'Teacher', text: 'Submitted equipment procurement request to administration. Budget approval pending from Principal. List includes 10 cricket bats, 20 balls, 4 volleyball nets, badminton rackets.', timestamp: '2026-04-25T14:00:00Z' },
    ],
    attachments: [
      { id: 'att008', name: 'equipment_requisition.xlsx', size: '0.5 MB', type: 'document', uploadedDate: '2026-04-24T16:10:00Z' },
    ],
    activityLog: [
      { id: 'act021', type: 'created', user: 'Mr. Suresh Desai', message: 'Grievance created', timestamp: '2026-04-24T16:10:00Z' },
      { id: 'act022', type: 'assigned', user: 'Principal', message: 'Assigned to Sports Teacher', timestamp: '2026-04-24T17:00:00Z' },
    ],
    communicationHistory: [],
  },
  {
    id: 'GRV009',
    category: 'safety',
    priority: 'critical',
    status: 'escalated',
    complainantType: 'student',
    complainantName: 'Jessica Chen',
    studentId: 'STU-2026-4102',
    fatherName: 'Mr. David Chen',
    motherName: 'Mrs. Priya Chen',
    class: 'Class 10-A',
    rollNumber: '08',
    dateOfBirth: '2009-08-22',
    address: 'Apartment 15, Pearl Heights, Mumbai, 400051',
    contactEmail: 'jessica.chen@student.com',
    contactPhone: '+91-98765-43218',
    parentPhone: '+91-98765-43219',
    title: 'Bullying and Harassment Incident',
    description: 'Student experiencing ongoing bullying and harassment from peers (group of 4-5 students). Incidents reported multiple times (Feb, March, April) but no concrete action taken. Harassment includes name-calling, exclusion from groups, spread of rumors, and physical intimidation. Mental health and safety at risk. Student showing signs of anxiety and depression.',
    bulliesInvolvedCount: '5',
    incidentFrequency: 'Weekly',
    previousReportsCount: '3',
    createdDate: '2026-04-30T18:20:00Z',
    lastUpdated: '2026-05-02T14:45:00Z',
    deadline: '2026-05-03T23:59:59Z',
    assignedTo: 'principal',
    slaStatus: 'on_track',
    internalNotes: [
      { author: 'Principal', text: 'Emergency meeting with parents and school counselor scheduled for May 4. Zero-tolerance policy enforced. Perpetrators identified and parent meetings scheduled. Counseling sessions arranged twice a week.', timestamp: '2026-05-02T13:00:00Z' },
    ],
    attachments: [
      { id: 'att003', name: 'incident_report.docx', size: '1.2 MB', type: 'document', uploadedDate: '2026-04-30T18:20:00Z' },
      { id: 'att009', name: 'counselor_assessment.pdf', size: '0.7 MB', type: 'pdf', uploadedDate: '2026-05-01T10:00:00Z' },
    ],
    activityLog: [
      { id: 'act023', type: 'created', user: 'Jessica Chen', message: 'Grievance created', timestamp: '2026-04-30T18:20:00Z' },
      { id: 'act024', type: 'assigned', user: 'System', message: 'Auto-escalated to Principal (Critical)', timestamp: '2026-04-30T18:30:00Z' },
      { id: 'act025', type: 'escalated', user: 'Principal', message: 'Escalated status activated', timestamp: '2026-05-02T13:00:00Z' },
    ],
    communicationHistory: [
      { id: 'comm005', from: 'Principal', to: 'Jessica Chen', message: 'Your safety is our priority. Immediate action is being taken. Counseling support available. You are not alone.', timestamp: '2026-05-02T14:00:00Z', channel: 'sms' },
    ],
  },
  {
    id: 'GRV010',
    category: 'administration',
    priority: 'low',
    status: 'open',
    complainantType: 'non_teaching_staff',
    complainantName: 'Mr. Ravi Patel',
    staffId: 'STF-2026-5432',
    position: 'Office Administrator',
    department: 'Administration',
    yearsOfService: '8 years',
    qualification: 'B.Com, Diploma in Administration',
    class: 'Staff',
    address: 'House 12, Green Park Colony, Sector 7, Noida, 201301',
    contactEmail: 'ravi.patel@school.com',
    contactPhone: '+91-98765-43219',
    alternatePhone: '+91-98765-43220',
    title: 'Office Supply Requisition Delay',
    description: 'Office supplies requisition pending for 2 weeks. Delaying administrative work and routine operations. Stationery for 50 staff members, ink cartridges for 15 printers, and paper supply critically low. Need faster approval process.',
    requisitionNumber: 'REQ-2026-5847',
    amountRequested: 'Rs. 38000',
    createdDate: '2026-04-26T09:15:00Z',
    lastUpdated: '2026-04-26T09:15:00Z',
    deadline: '2026-05-03T23:59:59Z',
    assignedTo: null,
    slaStatus: 'on_track',
    internalNotes: [],
    attachments: [
      { id: 'att010', name: 'supply_list.pdf', size: '0.3 MB', type: 'pdf', uploadedDate: '2026-04-26T09:15:00Z' },
    ],
    activityLog: [
      { id: 'act026', type: 'created', user: 'Mr. Ravi Patel', message: 'Grievance created', timestamp: '2026-04-26T09:15:00Z' },
    ],
    communicationHistory: [],
  },
  {
    id: 'GRV011',
    category: 'maintenance',
    priority: 'high',
    status: 'in_progress',
    complainantType: 'student',
    complainantName: 'Divya Sharma',
    studentId: 'STU-2026-3847',
    fatherName: 'Mr. Ashok Sharma',
    motherName: 'Mrs. Anjali Sharma',
    class: 'Class 11-B',
    rollNumber: '42',
    dateOfBirth: '2008-12-10',
    address: 'Flat 7, Sunrise Residency, Gurgaon, 122001',
    contactEmail: 'divya.sharma@student.com',
    contactPhone: '+91-98765-43220',
    parentPhone: '+91-98765-43221',
    title: 'Toilet Facilities Maintenance',
    description: 'Toilet facilities in girls\' wing are in poor condition - leaking taps, clogged drains, water supply issues affecting 200+ students. Repairs pending for 3 weeks. Poses sanitation and health risks. Multiple complaints filed but not resolved.',
    affectedWing: 'Girls\' Dormitory - Blocks A & B',
    affectedStudents: '200+',
    issuesCount: '12',
    createdDate: '2026-05-02T08:30:00Z',
    lastUpdated: '2026-05-02T12:00:00Z',
    deadline: '2026-05-04T23:59:59Z',
    assignedTo: 'maintenance_team',
    slaStatus: 'on_track',
    internalNotes: [
      { author: 'Maintenance Team', text: 'Emergency repair team deployed. Temporary facilities arranged in west wing. Full repair will take 2-3 days. Contractor called for plumbing work.', timestamp: '2026-05-02T09:00:00Z' },
    ],
    attachments: [
      { id: 'att011', name: 'maintenance_checklist.pdf', size: '0.5 MB', type: 'pdf', uploadedDate: '2026-05-02T08:30:00Z' },
    ],
    activityLog: [
      { id: 'act027', type: 'created', user: 'Divya Sharma', message: 'Grievance created', timestamp: '2026-05-02T08:30:00Z' },
      { id: 'act028', type: 'assigned', user: 'System', message: 'Auto-assigned to Maintenance Team (High Priority)', timestamp: '2026-05-02T08:45:00Z' },
      { id: 'act029', type: 'status_updated', user: 'Maintenance Team', message: 'Status changed to In Progress', timestamp: '2026-05-02T09:30:00Z' },
    ],
    communicationHistory: [],
  },
  {
    id: 'GRV012',
    category: 'fees',
    priority: 'low',
    status: 'assigned',
    complainantType: 'parent',
    complainantName: 'Mrs. Anjali Verma',
    parentId: 'PAR-2026-9123',
    studentName: 'Aryan Verma',
    studentId: 'STU-2026-5987',
    class: 'Class 12-C',
    rollNumber: '15',
    address: 'Apartment 20, Golden Plaza, South Extension, New Delhi, 110049',
    contactEmail: 'anjali.verma@email.com',
    contactPhone: '+91-98765-43221',
    alternatePhone: '+91-98765-43222',
    fatherName: 'Mr. Suresh Verma',
    fatherPhone: '+91-98765-43223',
    title: 'Scholarship Application Query',
    description: 'Inquiry regarding scholarship application status and eligibility criteria. No response received despite multiple follow-ups via email and office visits. Application submitted on March 15. Student financial background: annual income Rs. 8 lakhs, mother is homemaker. Expecting decision for next academic session.',
    applicationDate: '2026-03-15',
    familyIncome: 'Rs. 8,00,000',
    scholarshipType: 'Merit-cum-Means',
    createdDate: '2026-04-23T10:00:00Z',
    lastUpdated: '2026-04-28T14:30:00Z',
    deadline: '2026-05-10T23:59:59Z',
    assignedTo: 'hr_manager',
    slaStatus: 'on_track',
    internalNotes: [
      { author: 'HR Manager', text: 'Scholarship status: Pending final approval from board. Expected decision by May 15. Income verification documents are complete. Recommendation is positive.', timestamp: '2026-04-28T14:00:00Z' },
    ],
    attachments: [
      { id: 'att012', name: 'income_certificate.pdf', size: '0.6 MB', type: 'pdf', uploadedDate: '2026-03-15T10:00:00Z' },
      { id: 'att013', name: 'tax_returns.pdf', size: '1.5 MB', type: 'pdf', uploadedDate: '2026-03-20T10:00:00Z' },
    ],
    activityLog: [
      { id: 'act030', type: 'created', user: 'Mrs. Anjali Verma', message: 'Grievance created', timestamp: '2026-04-23T10:00:00Z' },
      { id: 'act031', type: 'assigned', user: 'Principal', message: 'Assigned to HR Manager', timestamp: '2026-04-23T11:00:00Z' },
    ],
    communicationHistory: [
      { id: 'comm006', from: 'HR Manager', to: 'Mrs. Anjali Verma', message: 'Your application is under review. You will receive decision by May 15. Thank you for your patience.', timestamp: '2026-04-28T15:00:00Z', channel: 'email' },
    ],
  },
  {
    id: 'GRV013',
    category: 'academic',
    priority: 'medium',
    status: 'assigned',
    complainantType: 'student',
    complainantName: 'Kabir Reddy',
    studentId: 'STU-2026-4521',
    fatherName: 'Mr. Vikram Reddy',
    motherName: 'Mrs. Usha Reddy',
    class: 'Class 9-B',
    rollNumber: '24',
    dateOfBirth: '2010-09-30',
    address: 'House 32, Palm Avenue, Hyderabad, 500082',
    contactEmail: 'kabir.reddy@student.com',
    contactPhone: '+91-98765-43222',
    parentPhone: '+91-98765-43223',
    title: 'Assignment Submission Extension Request',
    description: 'Student requesting extension for assignment submission due to unforeseen circumstances (family emergency - death of grandfather on April 28). Original deadline was April 30. Requesting 5-day extension to May 5. Supporting documents provided. Student has otherwise maintained good academic record.',
    assignmentName: 'English Literature Essay - 2000 words',
    submissionDeadline: '2026-04-30',
    extensionRequested: '5 days',
    reasonCategory: 'Family Emergency',
    createdDate: '2026-04-29T16:45:00Z',
    lastUpdated: '2026-05-01T10:15:00Z',
    deadline: '2026-05-06T23:59:59Z',
    assignedTo: 'coordinator',
    slaStatus: 'on_track',
    internalNotes: [
      { author: 'Coordinator', text: '5-day extension approved subject to medical certificate verification. Certificate received and verified. Student can submit by May 5.', timestamp: '2026-04-30T11:00:00Z' },
    ],
    attachments: [
      { id: 'att004', name: 'medical_certificate.pdf', size: '0.8 MB', type: 'pdf', uploadedDate: '2026-04-29T16:45:00Z' },
      { id: 'att014', name: 'death_certificate_excerpt.pdf', size: '0.3 MB', type: 'pdf', uploadedDate: '2026-04-29T17:00:00Z' },
    ],
    activityLog: [
      { id: 'act032', type: 'created', user: 'Kabir Reddy', message: 'Grievance created', timestamp: '2026-04-29T16:45:00Z' },
      { id: 'act033', type: 'assigned', user: 'Principal', message: 'Assigned to Coordinator', timestamp: '2026-04-29T17:30:00Z' },
    ],
    communicationHistory: [],
  },
  {
    id: 'GRV014',
    category: 'infrastructure',
    priority: 'medium',
    status: 'open',
    complainantType: 'parent',
    complainantName: 'Mr. Arjun Singh',
    parentId: 'PAR-2026-2847',
    studentName: 'Isha Singh',
    studentId: 'STU-2026-6845',
    class: 'Class 7-A',
    rollNumber: '19',
    address: 'Plot 15, Woodland Estates, Bangalore, 560095',
    contactEmail: 'arjun.singh@email.com',
    contactPhone: '+91-98765-43223',
    alternatePhone: '+91-98765-43224',
    fatherName: 'Mr. Arjun Singh',
    motherName: 'Mrs. Pooja Singh',
    title: 'Classroom Air Conditioning Issue',
    description: 'Classroom AC system is non-functional since April 28, making classroom uncomfortably hot during afternoon classes. Temperature reaches 35-37°C. Affecting student concentration and learning outcomes. Multiple complaints filed with maintenance but not prioritized. Students experiencing fatigue and headaches.',
    classroomNumber: 'Block A, Room 102',
    affectedStudents: '45',
    temperatureRange: '35-37°C',
    createdDate: '2026-05-01T13:50:00Z',
    lastUpdated: '2026-05-01T13:50:00Z',
    deadline: '2026-05-05T23:59:59Z',
    assignedTo: null,
    slaStatus: 'on_track',
    internalNotes: [],
    attachments: [
      { id: 'att015', name: 'ac_maintenance_log.pdf', size: '0.4 MB', type: 'pdf', uploadedDate: '2026-05-01T13:50:00Z' },
    ],
    activityLog: [
      { id: 'act034', type: 'created', user: 'Mr. Arjun Singh', message: 'Grievance created', timestamp: '2026-05-01T13:50:00Z' },
    ],
    communicationHistory: [],
  },
  {
    id: 'GRV015',
    category: 'discipline',
    priority: 'low',
    status: 'resolved',
    complainantType: 'teaching_staff',
    complainantName: 'Ms. Sneha Gupta',
    staffId: 'STF-2026-7834',
    department: 'English',
    subject: 'English Literature',
    yearsOfService: '5 years',
    qualification: 'M.A English, B.Ed',
    class: 'Class 8-A',
    contactEmail: 'sneha.gupta@school.com',
    contactPhone: '+91-98765-43224',
    alternatePhone: '+91-98765-43225',
    title: 'Student Late Submission of Project',
    description: 'Student (Roshan Kumar, Roll 31) submitted project 3 days late without prior intimation or medical reason. Project submission deadline was April 28. Seeking clarification on late submission policy and marks deduction. Student had been given adequate time and reminders.',
    studentInvolvedName: 'Roshan Kumar',
    studentInvolvedId: 'STU-2026-7623',
    submissionDeadline: '2026-04-28',
    submissionDate: '2026-05-01',
    projectName: 'Shakespeare Analysis - 15 pages',
    daysLate: '3',
    createdDate: '2026-04-18T14:20:00Z',
    lastUpdated: '2026-04-21T11:40:00Z',
    deadline: '2026-04-25T23:59:59Z',
    assignedTo: 'coordinator',
    slaStatus: 'on_track',
    internalNotes: [
      { author: 'Coordinator', text: 'Late submission policy clarified to student and teacher. 10% marks deduction applied per policy. Policy shared with student for future reference. Counseling on time management provided.', timestamp: '2026-04-19T10:30:00Z' },
    ],
    attachments: [
      { id: 'att016', name: 'school_academic_policy.pdf', size: '2.3 MB', type: 'pdf', uploadedDate: '2026-04-18T14:20:00Z' },
    ],
    activityLog: [
      { id: 'act035', type: 'created', user: 'Ms. Sneha Gupta', message: 'Grievance created', timestamp: '2026-04-18T14:20:00Z' },
      { id: 'act036', type: 'assigned', user: 'Principal', message: 'Assigned to Coordinator', timestamp: '2026-04-18T15:00:00Z' },
      { id: 'act037', type: 'resolved', user: 'Coordinator', message: 'Policy clarified and applied', timestamp: '2026-04-19T11:00:00Z' },
      { id: 'act038', type: 'closed', user: 'Principal', message: 'Grievance closed', timestamp: '2026-04-21T11:40:00Z' },
    ],
    communicationHistory: [
      { id: 'comm007', from: 'Coordinator', to: 'Ms. Sneha Gupta', message: 'The late submission policy has been applied. Student has been counseled on time management. Thank you for bringing this to our attention.', timestamp: '2026-04-19T12:00:00Z', channel: 'email' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────────────────

/**
 * Format ISO date to readable format
 * @param {string} isoDate - ISO date string
 * @returns {string} Formatted date
 */
export const fmtDate = (isoDate) => {
  if (!isoDate) return '—';
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
};

/**
 * Format ISO date with time
 * @param {string} isoDate - ISO date string
 * @returns {string} Formatted date with time
 */
export const fmtDateTime = (isoDate) => {
  if (!isoDate) return '—';
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

/**
 * Format relative time (e.g., "2 days ago")
 * @param {string} isoDate - ISO date string
 * @returns {string} Relative time string
 */
export const fmtRelative = (isoDate) => {
  if (!isoDate) return '—';
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return fmtDate(isoDate);
};

/**
 * Get category by ID
 * @param {string} categoryId - Category ID
 * @returns {Object|null} Category object or null
 */
export const getCategory = (categoryId) => {
  return GRIEVANCE_CATEGORIES.find((cat) => cat.id === categoryId) || null;
};

/**
 * Get priority by ID
 * @param {string} priorityId - Priority ID
 * @returns {Object|null} Priority object or null
 */
export const getPriority = (priorityId) => {
  return GRIEVANCE_PRIORITIES.find((pri) => pri.id === priorityId) || null;
};

/**
 * Get status by ID
 * @param {string} statusId - Status ID
 * @returns {Object|null} Status object or null
 */
export const getStatus = (statusId) => {
  return GRIEVANCE_STATUSES.find((sts) => sts.id === statusId) || null;
};

/**
 * Get assignable role by ID
 * @param {string} roleId - Role ID
 * @returns {Object|null} Role object or null
 */
export const getRole = (roleId) => {
  return ASSIGNABLE_ROLES.find((role) => role.id === roleId) || null;
};

/**
 * Compute metrics from grievances list
 * @param {Array} grievances - List of grievances
 * @returns {Object} Metrics object
 */
export const computeMetrics = (grievances = MOCK_GRIEVANCES) => {
  const metrics = {
    openCount: 0,
    inProgressCount: 0,
    escalatedCount: 0,
    resolvedCount: 0,
    criticalCount: 0,
    totalCount: grievances.length,
  };

  grievances.forEach((grv) => {
    if (grv.status === 'open') metrics.openCount += 1;
    if (grv.status === 'in_progress') metrics.inProgressCount += 1;
    if (grv.status === 'escalated') metrics.escalatedCount += 1;
    if (grv.status === 'resolved' || grv.status === 'closed') metrics.resolvedCount += 1;
    if (grv.priority === 'critical') metrics.criticalCount += 1;
  });

  return metrics;
};

/**
 * Calculate resolution rate percentage
 * @param {Array} grievances - List of grievances
 * @returns {number} Resolution percentage
 */
export const calculateResolutionRate = (grievances = MOCK_GRIEVANCES) => {
  if (grievances.length === 0) return 0;
  const resolved = grievances.filter((g) => g.status === 'resolved' || g.status === 'closed').length;
  return Math.round((resolved / grievances.length) * 100);
};

/**
 * Calculate average resolution time in days
 * @param {Array} grievances - List of grievances
 * @returns {number} Average resolution time
 */
export const calculateAvgResolutionTime = (grievances = MOCK_GRIEVANCES) => {
  const resolved = grievances.filter((g) => g.status === 'resolved' || g.status === 'closed');
  if (resolved.length === 0) return 0;

  const totalDays = resolved.reduce((sum, g) => {
    const created = new Date(g.createdDate);
    const updated = new Date(g.lastUpdated);
    const daysDiff = (updated - created) / (1000 * 60 * 60 * 24);
    return sum + daysDiff;
  }, 0);

  return (totalDays / resolved.length).toFixed(1);
};
