// ─── Classes & Sections Module — Enterprise Mock Data ──────────────────────

export const CLASS_METRICS_DEF = [
  { id: "total",      icon: "📚", label: "Total Classes",      color: "primary"   },
  { id: "sections",   icon: "📊", label: "Total Sections",     color: "secondary" },
  { id: "teachers",   icon: "👨‍🏫", label: "Class Teachers",     color: "success"   },
  { id: "students",   icon: "👥", label: "Total Students",     color: "warning"   },
  { id: "occupancy",  icon: "🏫", label: "Avg Occupancy",      color: "info"      },
];

export const ACADEMIC_YEAR_OPTIONS = [
  { value: "2025-26", label: "2025-26" },
  { value: "2026-27", label: "2026-27" },
  { value: "2027-28", label: "2027-28" },
];

export const SHIFT_OPTIONS = [
  { value: "morning", label: "Morning (06:30 - 01:30 PM)" },
  { value: "afternoon", label: "Afternoon (02:00 - 07:00 PM)" },
];

export const CLASS_STATUSES = [
  { value: "active",   label: "Active",   color: "#16a34a", bg: "rgba(22,163,74,.1)"   },
  { value: "inactive", label: "Inactive", color: "#6b7280", bg: "rgba(107,114,128,.1)" },
];

export const TEACHER_ROLES = [
  { id: "class-teacher", label: "Class Teacher", primary: true },
  { id: "co-teacher", label: "Co-Teacher", primary: false },
  { id: "subject-teacher", label: "Subject Teacher", primary: false },
  { id: "coordinator", label: "Coordinator", primary: false },
];

// Date helpers
const BASE = "2026-05-27";
const dAgo = (n) => {
  const d = new Date(BASE);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

// ── Mock Teachers ─────────────────────────────────────────────────────────────
const TEACHERS = [
  { id: "T001", name: "Mrs. Priya Sharma",        dept: "Academic",    exp: 12, yoe: "12 years", phone: "+91-9876543210", email: "priya@school.edu", avatar: "👩‍🏫" },
  { id: "T002", name: "Mr. Rajesh Patel",         dept: "Academic",    exp: 8,  yoe: "8 years",  phone: "+91-9876543211", email: "rajesh@school.edu", avatar: "👨‍🏫" },
  { id: "T003", name: "Ms. Anjali Gupta",         dept: "Academic",    exp: 6,  yoe: "6 years",  phone: "+91-9876543212", email: "anjali@school.edu", avatar: "👩‍🏫" },
  { id: "T004", name: "Mr. Arun Kumar",           dept: "Sports",      exp: 10, yoe: "10 years", phone: "+91-9876543213", email: "arun@school.edu", avatar: "👨‍🏫" },
  { id: "T005", name: "Mrs. Deepika Singh",       dept: "Science Lab", exp: 7,  yoe: "7 years",  phone: "+91-9876543214", email: "deepika@school.edu", avatar: "👩‍🏫" },
  { id: "T006", name: "Mr. Vikram Rao",           dept: "IT",          exp: 5,  yoe: "5 years",  phone: "+91-9876543215", email: "vikram@school.edu", avatar: "👨‍🏫" },
  { id: "T007", name: "Ms. Neha Sharma",          dept: "Languages",   exp: 9,  yoe: "9 years",  phone: "+91-9876543216", email: "neha@school.edu", avatar: "👩‍🏫" },
  { id: "T008", name: "Mr. Karthik Menon",        dept: "Mathematics", exp: 11, yoe: "11 years", phone: "+91-9876543217", email: "karthik@school.edu", avatar: "👨‍🏫" },
];

// ── Mock Rooms/Classrooms ─────────────────────────────────────────────────────
const ROOMS = [
  { id: "R101", name: "Room 101", building: "A", floor: 1, capacity: 45, category: "Standard" },
  { id: "R102", name: "Room 102", building: "A", floor: 1, capacity: 45, category: "Standard" },
  { id: "R103", name: "Room 103", building: "A", floor: 1, capacity: 45, category: "Standard" },
  { id: "R201", name: "Room 201", building: "A", floor: 2, capacity: 50, category: "Advanced" },
  { id: "R202", name: "Room 202", building: "A", floor: 2, capacity: 50, category: "Advanced" },
  { id: "R301", name: "Room 301", building: "B", floor: 3, capacity: 40, category: "Compact" },
  { id: "R302", name: "Room 302", building: "B", floor: 3, capacity: 40, category: "Compact" },
];

// ── Mock Subjects ─────────────────────────────────────────────────────────────
const SUBJECTS_BY_CLASS = {
  "1": ["English", "Hindi", "Mathematics", "EVS", "Art", "PE", "Music"],
  "2": ["English", "Hindi", "Mathematics", "EVS", "Art", "PE", "Music"],
  "3": ["English", "Hindi", "Mathematics", "Science", "Social Studies", "Art", "PE", "Music"],
  "4": ["English", "Hindi", "Mathematics", "Science", "Social Studies", "Art", "PE", "Music"],
  "5": ["English", "Hindi", "Mathematics", "Science", "Social Studies", "Art", "PE", "Music"],
  "6": ["English", "Hindi", "Mathematics", "Science", "Social Studies", "Sanskrit", "Art", "PE", "Music"],
  "7": ["English", "Hindi", "Mathematics", "Physics", "Chemistry", "Biology", "Social Studies", "Sanskrit", "Art", "PE", "Music"],
  "8": ["English", "Hindi", "Mathematics", "Physics", "Chemistry", "Biology", "Social Studies", "Sanskrit", "Art", "PE", "Music"],
  "9": ["English", "Hindi", "Mathematics", "Physics", "Chemistry", "Biology", "Social Studies", "Sanskrit", "Art", "PE", "Music", "IT"],
  "10": ["English", "Hindi", "Mathematics", "Physics", "Chemistry", "Biology", "Social Studies", "Sanskrit", "Art", "PE", "Music", "IT"],
  "11": ["English", "Physics", "Chemistry", "Biology", "Mathematics", "History", "Geography", "Political Science", "Economics"],
  "12": ["English", "Physics", "Chemistry", "Mathematics", "History", "Geography", "Political Science", "Economics"],
};

/**
 * Generate mock sections for a class
 */
const generateSections = (classNum) => {
  const sectionCount = classNum <= 6 ? 2 : classNum <= 9 ? 3 : 2;
  const sections = [];
  const sectionLabels = ["A", "B", "C", "D", "E"];
  
  for (let i = 0; i < sectionCount; i++) {
    const sectionLabel = sectionLabels[i];
    const studentCount = 35 + Math.floor(Math.random() * 15);
    
    sections.push({
      id: `SEC-${classNum}-${sectionLabel}`,
      name: `Section ${sectionLabel}`,
      classNum,
      sectionLabel,
      studentCount,
      occupancy: Math.round((studentCount / 45) * 100),
      roomId: ROOMS[Math.floor(Math.random() * ROOMS.length)].id,
      classTeacherId: TEACHERS[Math.floor(Math.random() * TEACHERS.length)].id,
      coTeacherId: TEACHERS[Math.floor(Math.random() * TEACHERS.length)].id,
      coordinatorId: TEACHERS[Math.floor(Math.random() * TEACHERS.length)].id,
      subjects: (SUBJECTS_BY_CLASS[String(classNum)] || []).map(s => ({
        name: s,
        teacherId: TEACHERS[Math.floor(Math.random() * TEACHERS.length)].id,
      })),
      attendance: Math.floor(Math.random() * 15) + 85,
      status: "active",
      academicYear: "2026-27",
      shift: classNum <= 6 ? "morning" : "afternoon",
      createdDate: dAgo(Math.floor(Math.random() * 90)),
    });
  }
  
  return sections;
};

/**
 * Generate mock timetable for a section
 */
const generateTimetable = (sectionId) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const periods = [
    { num: 1, time: "06:30 - 07:15" },
    { num: 2, time: "07:15 - 08:00" },
    { num: 3, time: "08:00 - 08:45" },
    { num: 4, time: "08:45 - 09:30" },
    { num: 5, time: "09:30 - 10:15", label: "BREAK" },
    { num: 6, time: "10:15 - 11:00" },
    { num: 7, time: "11:00 - 11:45" },
    { num: 8, time: "11:45 - 12:30" },
    { num: 9, time: "12:30 - 01:30", label: "LUNCH" },
  ];
  
  const timetable = {};
  days.forEach(day => {
    timetable[day] = periods.map(p => ({
      periodNum: p.num,
      time: p.time,
      subject: p.label || ["English", "Mathematics", "Science", "Social Studies", "Sanskrit"][Math.floor(Math.random() * 5)],
      teacherId: TEACHERS[Math.floor(Math.random() * TEACHERS.length)].id,
    }));
  });
  
  return timetable;
};

// ── Mock Classes ──────────────────────────────────────────────────────────────
export const MOCK_CLASSES = Array.from({ length: 12 }, (_, i) => {
  const classNum = i + 1;
  const sections = generateSections(classNum);
  const totalStudents = sections.reduce((sum, s) => sum + s.studentCount, 0);
  const avgOccupancy = Math.round(sections.reduce((sum, s) => sum + s.occupancy, 0) / sections.length);
  
  return {
    id: `CLASS-${classNum}`,
    classNumber: classNum,
    name: `Class ${classNum}`,
    sections,
    totalSections: sections.length,
    totalStudents,
    totalTeachers: new Set(sections.map(s => s.classTeacherId)).size,
    avgOccupancy,
    shift: classNum <= 6 ? "morning" : "afternoon",
    academicYear: "2026-27",
    status: "active",
    lastUpdated: dAgo(Math.floor(Math.random() * 30)),
    updatedBy: TEACHERS[Math.floor(Math.random() * TEACHERS.length)].name,
  };
});

/**
 * Compute dashboard metrics from classes array
 */
export const computeClassMetrics = (classes) => ({
  total: classes.length,
  sections: classes.reduce((sum, c) => sum + c.totalSections, 0),
  teachers: new Set(
    classes.flatMap(c => c.sections.map(s => s.classTeacherId))
  ).size,
  students: classes.reduce((sum, c) => sum + c.totalStudents, 0),
  occupancy: Math.round(
    classes.reduce((sum, c) => sum + c.avgOccupancy, 0) / classes.length
  ),
});

// ── Timetable Periods ─────────────────────────────────────────────────────────
export const TIMETABLE_PERIODS = [
  { num: 1, time: "06:30 - 07:15", type: "class" },
  { num: 2, time: "07:15 - 08:00", type: "class" },
  { num: 3, time: "08:00 - 08:45", type: "class" },
  { num: 4, time: "08:45 - 09:30", type: "class" },
  { num: 5, time: "09:30 - 10:15", type: "break", label: "BREAK" },
  { num: 6, time: "10:15 - 11:00", type: "class" },
  { num: 7, time: "11:00 - 11:45", type: "class" },
  { num: 8, time: "11:45 - 12:30", type: "class" },
  { num: 9, time: "12:30 - 01:30", type: "break", label: "LUNCH" },
];

export const DAYS_OF_WEEK = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"
];

// ── Helper Functions ──────────────────────────────────────────────────────────
export const getTeacherById = (teacherId) => TEACHERS.find(t => t.id === teacherId);
export const getRoomById = (roomId) => ROOMS.find(r => r.id === roomId);
export const getAllTeachers = () => TEACHERS;
export const getAllRooms = () => ROOMS;
