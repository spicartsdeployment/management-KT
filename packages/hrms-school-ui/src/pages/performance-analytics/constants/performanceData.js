/**
 * Performance Analytics - Mock Data Constants
 * Contains all static data for the Performance Analytics feature
 */

// MACP chart data indexed by year
export const macpDataByYear = {
  '2025': [93, 95, 94, 96, 97, 98, 97, 96, 95, 94, 96, 97],
  '2024': [90, 93, 94, 95, 97, 98, 97, 84, 79, 93, 88, 98],
  '2023': [82, 84, 86, 88, 89, 91, 90, 85, 83, 86, 87, 88],
};

// Keep original macpData for backwards compatibility
export const macpData = macpDataByYear['2025'];
export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Achievements data
export const achievements = [
  { id: 11, name: 'National Science Olympiad', category: 'Academic', place: '1st Place', month: 'Oct 2024', icon: '🔭', type: 'academic' },
  { id: 12, name: 'Inter-School Basketball Championship', category: 'Sports', place: 'Gold Medal', month: 'Sep 2024', icon: '🏀', type: 'sports' },
  { id: 1, name: 'State Level Dance Competition', category: 'Cultural', place: '2nd Place', month: 'Aug 2024', icon: '💃', type: 'cultural' },
  { id: 2, name: 'Debate Competition Winner', category: 'Academic', place: 'Champion', month: 'Jul 2024', icon: '🎤', type: 'academic' },
  { id: 3, name: 'Best Student Award', category: 'Overall', place: 'Excellence', month: 'Jun 2024', icon: '⭐', type: 'academic' },
  { id: 4, name: 'Art Exhibition Showcase', category: 'Cultural', place: 'Featured Artist', month: 'May 2024', icon: '🎨', type: 'art' },
  { id: 5, name: 'Inter-School Cricket', category: 'Sports', place: 'Winner', month: 'Apr 2024', icon: '🏏', type: 'sports' },
  { id: 6, name: 'Science Quiz Competition', category: 'Academic', place: '1st Place', month: 'Mar 2024', icon: '🔬', type: 'academic' },
  { id: 7, name: 'Mathematics Olympiad', category: 'Academic', place: 'Gold Medal', month: 'Feb 2024', icon: '🏅', type: 'academic' },
  { id: 8, name: 'Drama Competition', category: 'Cultural', place: 'Best Actor', month: 'Jan 2024', icon: '🎭', type: 'cultural' },
  { id: 9, name: 'Basketball Tournament', category: 'Sports', place: 'Runner Up', month: 'Dec 2023', icon: '🏀', type: 'sports' },
  { id: 10, name: 'Essay Writing Contest', category: 'Academic', place: 'Winner', month: 'Nov 2023', icon: '✍️', type: 'academic' },
];

// Report Card Data
export const reportData = [
  { subject: 'Mathematics', marks: '88 / 100', percentage: '88.0%', grade: 'A' },
  { subject: 'Physics', marks: '82 / 100', percentage: '82.0%', grade: 'A' },
  { subject: 'Chemistry', marks: '78 / 100', percentage: '78.0%', grade: 'B+' },
  { subject: 'English', marks: '91 / 100', percentage: '91.0%', grade: 'A+' },
  { subject: 'Computer Science', marks: '95 / 100', percentage: '95.0%', grade: 'A+' },
  { subject: 'Biology', marks: '78 / 100', percentage: '78.0%', grade: 'B+' },
];

// Subject data for feedback
export const subjectData = {
  'Mathematics': {
    percentage: 86,
    icon: '➗',
    subjectColor: '#fb923c',
    teacher: 'Mr. Anderson',
    role: 'Mathematics Teacher',
    feedback: 'Excellent participation and helps other students. Shows strong problem-solving skills in algebra and calculus.',
    rating: 5,
    date: 'Nov 18, 2024',
    tag: 'Good',
    topics: [
      { name: 'Algebra', percentage: 85, color: '#f59e0b' },
      { name: 'Geometry', percentage: 92, color: '#f59e0b' },
      { name: 'Calculus', percentage: 78, color: '#f59e0b' },
      { name: 'Statistics', percentage: 88, color: '#f59e0b' }
    ]
  },
  'Physics': {
    percentage: 82,
    icon: '⚛️',
    subjectColor: '#60a5fa',
    teacher: 'Dr. Johnson',
    role: 'Physics Teacher',
    feedback: 'Good understanding of concepts. Needs improvement in practical applications.',
    rating: 4,
    date: 'Nov 15, 2024',
    tag: 'Average',
    topics: [
      { name: 'Mechanics', percentage: 88, color: '#3b82f6' },
      { name: 'Electricity', percentage: 75, color: '#3b82f6' },
      { name: 'Optics', percentage: 82, color: '#3b82f6' },
      { name: 'Thermodynamics', percentage: 84, color: '#3b82f6' }
    ]
  },
  'Chemistry': {
    percentage: 78,
    icon: '🧪',
    subjectColor: '#4ade80',
    teacher: 'Ms. Williams',
    role: 'Chemistry Teacher',
    feedback: 'Shows great interest in organic chemistry. Laboratory work is outstanding.',
    rating: 4,
    date: 'Nov 12, 2024',
    tag: 'Average',
    topics: [
      { name: 'Organic', percentage: 85, color: '#22c55e' },
      { name: 'Inorganic', percentage: 72, color: '#22c55e' },
      { name: 'Physical', percentage: 76, color: '#22c55e' },
      { name: 'Analytical', percentage: 80, color: '#22c55e' }
    ]
  },
  'English': {
    percentage: 91,
    icon: '📚',
    subjectColor: '#a78bfa',
    teacher: 'Ms. Brown',
    role: 'English Teacher',
    feedback: 'Excellent writing skills and strong comprehension. Very creative in essays.',
    rating: 5,
    date: 'Nov 20, 2024',
    tag: 'Excellent',
    topics: [
      { name: 'Grammar', percentage: 95, color: '#8b5cf6' },
      { name: 'Literature', percentage: 90, color: '#8b5cf6' },
      { name: 'Writing', percentage: 88, color: '#8b5cf6' },
      { name: 'Speaking', percentage: 92, color: '#8b5cf6' }
    ]
  },
  'Biology': {
    percentage: 78,
    icon: '🧬',
    subjectColor: '#f472b6',
    teacher: 'Dr. Smith',
    role: 'Biology Teacher',
    feedback: 'Good practical skills in lab work. Needs more focus on theory.',
    rating: 4,
    date: 'Nov 14, 2024',
    tag: 'Average',
    topics: [
      { name: 'Cell Biology', percentage: 82, color: '#ec4899' },
      { name: 'Genetics', percentage: 75, color: '#ec4899' },
      { name: 'Ecology', percentage: 80, color: '#ec4899' },
      { name: 'Evolution', percentage: 76, color: '#ec4899' }
    ]
  }
};

// Sports Data - School Events
export const sportsSchoolEvents = [
  {
    id: 1,
    name: 'Annual Swimming Gala',
    description: 'School swimming competition with various categories. Open for all age groups and skill levels.',
    date: 'Dec 22, 2024',
    time: '09:00 AM',
    venue: 'Aquatic Center',
    contact: 'Coach Anderson',
    contactRole: 'Swimming Instructor',
    badge: 'Upcoming',
    badgeColor: '#10b981'
  },
  {
    id: 2,
    name: 'Badminton Tournament',
    description: 'Intra-school badminton championship with singles and doubles categories for both boys and girls.',
    date: 'Jan 20, 2025',
    time: '10:30 AM',
    venue: 'Indoor Sports Hall',
    contact: 'Coach Henderson',
    contactRole: 'Badminton Coach',
    badge: 'Registration Open',
    badgeColor: '#3b82f6'
  }
];

// Sports Data - Outside Events
export const sportsOutsideEvents = [
  {
    id: 1,
    name: 'Inter-School Basketball Championship',
    description: 'Regional level basketball tournament open for all students. Team selection trials will be held before the event.',
    date: 'Dec 15-17, 2024',
    time: '08:00 AM',
    venue: 'Main Sports Complex',
    contact: 'Coach Martinez',
    contactRole: 'Basketball Coach',
    badge: 'Trials Soon',
    badgeColor: '#3b82f6'
  },
  {
    id: 2,
    name: 'District Athletics Meet',
    description: 'Annual district-level athletics competition with track and field events for all age categories.',
    date: 'Mar 10, 2025',
    time: '08:00 AM',
    venue: 'District Stadium',
    contact: 'Coach Williams',
    contactRole: 'Athletics Coach',
    badge: 'Registration Open',
    badgeColor: '#3b82f6'
  },
];

// Participation History
export const participationHistory = [
  {
    id: 1,
    eventName: '24th Annual Sports Day',
    activity: 'Basketball Tournament',
    date: 'Oct 15, 2024',
    review: '"Outstanding performance as team captain. Led the team to victory with exceptional scoring and strategic plays."',
    status: 'Champion',
    statusColor: 'gold'
  },
  {
    id: 2,
    eventName: 'Inter-School Championship',
    activity: 'Football Match',
    date: 'Sep 22, 2024',
    review: '"Great defensive skills and teamwork. Showed excellent sportsmanship throughout the tournament."',
    status: 'Runner-up',
    statusColor: 'blue'
  },
  {
    id: 3,
    eventName: 'Weekly CCA Activity',
    activity: 'Swimming',
    date: 'Aug 10, 2024',
    review: '"Consistent attendance and dedication shown throughout the CCA sessions."',
    status: 'Participated',
    statusColor: 'green'
  }
];

// Behavior Metrics
export const behaviorMetrics = [
  { label: 'Punctuality', percentage: 98, color: 'green', description: 'Always on time' },
  { label: 'Participation', percentage: 92, color: 'blue', description: 'Active in class' },
  { label: 'Team skills', percentage: 96, color: 'purple', description: 'Collaboration with team' },
  { label: 'Leadership', percentage: 89, color: 'orange', description: 'Takes initiative' },
  { label: 'Discipline', percentage: 97, color: 'red', description: 'Follows rules' },
  { label: 'Obedience', percentage: 94, color: 'indigo', description: 'Obedient and compliant' }
];

// Teacher Reviews
export const teacherReviews = [
  {
    id: 1,
    teacher: 'Mrs. Davis',
    role: 'Class Teacher',
    date: 'Nov 18, 2024',
    review: 'Demonstrates excellent behavior and respect towards peers and teachers. Always punctual and shows great responsibility in class duties.',
    rating: 5
  },
  {
    id: 2,
    teacher: 'Mr. Thompson',
    role: 'Discipline Coordinator',
    date: 'Nov 16, 2024',
    review: 'Exemplary conduct throughout the semester. Acts as a positive role model for other students and maintains high standards of behavior.',
    rating: 5
  },
  {
    id: 3,
    teacher: 'Ms. Parker',
    role: 'Counselor',
    date: 'Nov 14, 2024',
    review: 'Shows empathy and kindness towards classmates. Excellent interpersonal skills and conflict resolution abilities.',
    rating: 5
  },
  {
    id: 4,
    teacher: 'Dr. Patel',
    role: 'Science Teacher',
    date: 'Nov 5, 2024',
    review: 'Excellent lab conduct and follows safety protocols diligently.',
    rating: 5
  },
  {
    id: 5,
    teacher: 'Ms. Garcia',
    role: 'Art Teacher',
    date: 'Oct 28, 2024',
    review: 'Creative and collaborative. Respects materials and cleanup responsibilities.',
    rating: 4
  }
];

// Cultural Roles
export const culturalRoles = [
  {
    title: 'Lead Performer',
    subtitle: 'Drama & Theatre',
    description: 'Leading roles in school plays',
    icon: '🎭',
    bgColor: '#fff7ed',
    borderColor: '#fed7aa',
    rating: 4.8
  },
  {
    title: 'Support Member',
    subtitle: 'Choir & Music',
    description: 'Active choir participant',
    icon: '🎵',
    bgColor: '#eff6ff',
    borderColor: '#bfdbfe',
    rating: 4.5
  },
  {
    title: 'Announcer',
    subtitle: 'Event Hosting',
    description: 'Host for school events',
    icon: '🎤',
    bgColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    rating: 4.7
  }
];

// Cultural Upcoming Events
export const culturalUpcomingEvents = [
  {
    id: 1,
    name: 'Annual Day Celebration',
    badge: 'Major Event',
    description: 'Grand annual day event with performances from all students. Auditions for various cultural activities.',
    date: 'Dec 20, 2024',
    time: '6:00 PM',
    venue: 'School Auditorium',
    contact: 'Ms. Rodriguez'
  },
  {
    id: 2,
    name: 'Poetry Recitation Contest',
    badge: 'Competition',
    description: 'School-wide poetry competition in multiple languages. Original compositions are encouraged.',
    date: 'Dec 5, 2024',
    time: '10:00 AM',
    venue: 'Library Auditorium',
    contact: 'Mr. Thompson'
  },
  {
    id: 3,
    name: 'Christmas Carol Performance',
    badge: 'Performance',
    description: 'Traditional Christmas carol singing event with school choir and orchestra.',
    date: 'Dec 23, 2024',
    time: '5:00 PM',
    venue: 'School Chapel',
    contact: 'Ms. Anderson'
  },
  {
    id: 4,
    name: 'Art Exhibition & Gallery Walk',
    badge: 'Exhibition',
    description: 'Showcase of student artwork including paintings, sculptures, and digital art.',
    date: 'Jan 10, 2025',
    time: '2:00 PM',
    venue: 'Art Gallery',
    contact: 'Mr. Roberts'
  },
  {
    id: 5,
    name: 'Drama Workshop - Method Acting',
    badge: 'Workshop',
    description: 'Intensive drama workshop conducted by professional theater artists.',
    date: 'Jan 15, 2025',
    time: '3:00 PM',
    venue: 'Drama Room',
    contact: 'Ms. Williams'
  },
  {
    id: 6,
    name: 'Classical Music Recital',
    badge: 'Recital',
    description: 'Classical music performance featuring student musicians on various instruments.',
    date: 'Jan 20, 2025',
    time: '6:30 PM',
    venue: 'Music Hall',
    contact: 'Mr. Kumar'
  },
  {
    id: 7,
    name: 'Dance Competition - Freestyle',
    badge: 'Competition',
    description: 'Inter-house dance competition with multiple categories and styles.',
    date: 'Jan 25, 2025',
    time: '4:00 PM',
    venue: 'Sports Complex',
    contact: 'Ms. Davis'
  },
  {
    id: 8,
    name: 'Film Appreciation Workshop',
    badge: 'Workshop',
    description: 'Learn about cinematography, storytelling, and film making techniques.',
    date: 'Feb 1, 2025',
    time: '11:00 AM',
    venue: 'Media Lab',
    contact: 'Mr. Johnson'
  },
  {
    id: 9,
    name: 'Cultural Heritage Day',
    badge: 'Major Event',
    description: 'Celebration of diverse cultures with traditional performances and food stalls.',
    date: 'Feb 14, 2025',
    time: '9:00 AM',
    venue: 'School Grounds',
    contact: 'Ms. Patel'
  },
  {
    id: 10,
    name: 'Shakespeare Festival',
    badge: 'Festival',
    description: 'Week-long celebration of Shakespeare with plays, readings, and discussions.',
    date: 'Feb 20, 2025',
    time: '5:00 PM',
    venue: 'School Auditorium',
    contact: 'Mr. Stevens'
  }
];

// Cultural Past Participation
export const culturalPastParticipation = [
  {
    id: 1,
    emoji: '🎭',
    title: 'Annual Day 2024',
    subtitle: 'Drama Play - Romeo & Juliet',
    role: 'Lead Performer',
    date: 'Oct 20, 2024',
    achievement: 'Best Performance',
    rating: 4.9
  },
  {
    id: 2,
    emoji: '🎵',
    title: 'Independence Day Celebration',
    subtitle: 'Patriotic Song Performance',
    role: 'Support Member',
    date: 'Aug 15, 2024',
    achievement: 'Participated',
    rating: 4.6
  },
  {
    id: 3,
    emoji: '🎤',
    title: 'Sports Day Opening Ceremony',
    subtitle: 'Event Anchoring',
    role: 'Announcer',
    date: 'Sep 5, 2024',
    achievement: 'Outstanding',
    rating: 4.8
  },
  {
    id: 4,
    emoji: '🎨',
    title: 'Art Competition 2024',
    subtitle: 'Painting Exhibition',
    role: 'Participant',
    date: 'Jul 12, 2024',
    achievement: '2nd Prize',
    rating: 4.5
  },
  {
    id: 5,
    emoji: '🎭',
    title: 'Drama Festival',
    subtitle: 'One-Act Play Performance',
    role: 'Lead Performer',
    date: 'Jun 20, 2024',
    achievement: 'Winner',
    rating: 4.9
  },
  {
    id: 6,
    emoji: '🎵',
    title: 'Music Concert 2024',
    subtitle: 'Classical Instrumental',
    role: 'Support Member',
    date: 'May 15, 2024',
    achievement: 'Participated',
    rating: 4.4
  },
  {
    id: 7,
    emoji: '🎤',
    title: 'Debate Competition',
    subtitle: 'Inter-School Debate',
    role: 'Speaker',
    date: 'Apr 10, 2024',
    achievement: 'Finalist',
    rating: 4.7
  },
  {
    id: 8,
    emoji: '💃',
    title: 'Dance Performance',
    subtitle: 'Cultural Day Celebration',
    role: 'Dancer',
    date: 'Mar 22, 2024',
    achievement: 'Best Group',
    rating: 4.8
  },
  {
    id: 9,
    emoji: '🎭',
    title: 'Street Play Festival',
    subtitle: 'Social Awareness Play',
    role: 'Lead Performer',
    date: 'Feb 28, 2024',
    achievement: 'Outstanding',
    rating: 4.6
  },
  {
    id: 10,
    emoji: '🎵',
    title: 'Choir Competition',
    subtitle: 'Regional Choir Contest',
    role: 'Support Member',
    date: 'Jan 18, 2024',
    achievement: '3rd Place',
    rating: 4.5
  }
];
