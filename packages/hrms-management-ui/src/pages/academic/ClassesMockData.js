// ─── Classes & Sections Module — Enhanced Enterprise Mock Data ─────────────────

// ── Options / Configs ──────────────────────────────────────────────────────────
export const ACADEMIC_YEAR_OPTIONS = [
  { value: "2024-25", label: "2024-25" },
  { value: "2025-26", label: "2025-26" },
  { value: "2026-27", label: "2026-27 (Current)" },
];

export const TIMETABLE_PERIODS = [
  { num: 1, time: "06:30 – 07:15", type: "class" },
  { num: 2, time: "07:15 – 08:00", type: "class" },
  { num: 3, time: "08:00 – 08:45", type: "class" },
  { num: 4, time: "08:45 – 09:30", type: "class" },
  { num: 5, time: "09:30 – 10:15", type: "break", label: "BREAK" },
  { num: 6, time: "10:15 – 11:00", type: "class" },
  { num: 7, time: "11:00 – 11:45", type: "class" },
  { num: 8, time: "11:45 – 12:30", type: "class" },
];

export const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// ── Teacher Pool ───────────────────────────────────────────────────────────────
const TEACHERS = [
  { id: "T001", name: "Mrs. Priya Sharma",   dept: "Academic",    exp: 12, workload: 28, phone: "+91-98765-43210", email: "priya@school.edu",   initials: "PS" },
  { id: "T002", name: "Mr. Rajesh Patel",    dept: "Mathematics", exp: 8,  workload: 22, phone: "+91-98765-43211", email: "rajesh@school.edu",  initials: "RP" },
  { id: "T003", name: "Ms. Anjali Gupta",    dept: "Science",     exp: 6,  workload: 20, phone: "+91-98765-43212", email: "anjali@school.edu",  initials: "AG" },
  { id: "T004", name: "Mr. Arun Kumar",      dept: "Social Stud.",exp: 10, workload: 24, phone: "+91-98765-43213", email: "arun@school.edu",    initials: "AK" },
  { id: "T005", name: "Mrs. Deepika Singh",  dept: "Science Lab", exp: 7,  workload: 18, phone: "+91-98765-43214", email: "deepika@school.edu", initials: "DS" },
  { id: "T006", name: "Mr. Vikram Rao",      dept: "IT",          exp: 5,  workload: 16, phone: "+91-98765-43215", email: "vikram@school.edu",  initials: "VR" },
  { id: "T007", name: "Ms. Neha Sharma",     dept: "Languages",   exp: 9,  workload: 26, phone: "+91-98765-43216", email: "neha@school.edu",    initials: "NS" },
  { id: "T008", name: "Mr. Karthik Menon",   dept: "Mathematics", exp: 11, workload: 30, phone: "+91-98765-43217", email: "karthik@school.edu", initials: "KM" },
  { id: "T009", name: "Mrs. Sunita Iyer",    dept: "Hindi",       exp: 15, workload: 25, phone: "+91-98765-43218", email: "sunita@school.edu",  initials: "SI" },
  { id: "T010", name: "Mr. Rajan Verma",     dept: "PE & Sports", exp: 8,  workload: 20, phone: "+91-98765-43219", email: "rajan@school.edu",   initials: "RV" },
];

// ── Room Pool ──────────────────────────────────────────────────────────────────
const ROOMS = [
  { id: "R101", roomNo: "101", floor: 1, block: "A", capacity: 45, category: "Standard" },
  { id: "R102", roomNo: "102", floor: 1, block: "A", capacity: 45, category: "Standard" },
  { id: "R103", roomNo: "103", floor: 1, block: "A", capacity: 45, category: "Standard" },
  { id: "R201", roomNo: "201", floor: 2, block: "A", capacity: 50, category: "Advanced" },
  { id: "R202", roomNo: "202", floor: 2, block: "A", capacity: 50, category: "Advanced" },
  { id: "R301", roomNo: "301", floor: 3, block: "B", capacity: 40, category: "Compact"  },
  { id: "R302", roomNo: "302", floor: 3, block: "B", capacity: 40, category: "Compact"  },
  { id: "R111", roomNo: "111", floor: 1, block: "B", capacity: 45, category: "Standard" },
  { id: "R211", roomNo: "211", floor: 2, block: "B", capacity: 48, category: "Standard" },
  { id: "R401", roomNo: "401", floor: 4, block: "C", capacity: 55, category: "Large"    },
  { id: "R402", roomNo: "402", floor: 4, block: "C", capacity: 55, category: "Large"    },
  { id: "R501", roomNo: "501", floor: 5, block: "C", capacity: 42, category: "Standard" },
];

// ── Subjects by Class ──────────────────────────────────────────────────────────
const SUBJECTS_BY_CLASS = {
  1:  ["English", "Hindi", "Mathematics", "EVS", "Art", "PE"],
  2:  ["English", "Hindi", "Mathematics", "EVS", "Art", "PE"],
  3:  ["English", "Hindi", "Mathematics", "Science", "Social Studies", "Art", "PE"],
  4:  ["English", "Hindi", "Mathematics", "Science", "Social Studies", "Art", "PE"],
  5:  ["English", "Hindi", "Mathematics", "Science", "Social Studies", "Art", "PE"],
  6:  ["English", "Hindi", "Mathematics", "Science", "Social Studies", "Sanskrit", "Art", "PE"],
  7:  ["English", "Hindi", "Mathematics", "Physics", "Chemistry", "Biology", "Social Studies", "Sanskrit", "PE"],
  8:  ["English", "Hindi", "Mathematics", "Physics", "Chemistry", "Biology", "Social Studies", "Sanskrit", "IT", "PE"],
  9:  ["English", "Hindi", "Mathematics", "Physics", "Chemistry", "Biology", "Social Studies", "Sanskrit", "IT", "PE"],
  10: ["English", "Hindi", "Mathematics", "Physics", "Chemistry", "Biology", "Social Studies", "Sanskrit", "IT", "PE"],
};

// ── Student Name Pool ──────────────────────────────────────────────────────────
const FIRST_NAMES = [
  "Aarav","Aditi","Akash","Anika","Arjun","Ayesha","Divya","Farhan","Ishaan","Kavya",
  "Kiran","Manish","Neha","Priya","Rahul","Riya","Rohan","Sahil","Sneha","Tanvi",
  "Varun","Vivek","Zoya","Amit","Pooja","Harsh","Megha","Nikhil","Shruti","Tarun",
];
const LAST_NAMES = [
  "Sharma","Patel","Kumar","Singh","Rao","Gupta","Verma","Iyer","Menon","Nair",
  "Joshi","Shah","Mehta","Chopra","Malhotra","Reddy","Naidu","Pillai","Bose","Das",
];

// Deterministic pseudo-random (avoids re-renders changing data)
const seedRand = (seed) => {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return Math.abs(s) / 0x7fffffff;
  };
};

const generateStudents = (classNum, sectionLabel, count) => {
  const rand = seedRand(classNum * 100 + sectionLabel.charCodeAt(0));
  const todayStatuses = ["present", "present", "present", "absent", "leave"];
  const students = [];
  for (let i = 0; i < count; i++) {
    const fn = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)];
    const ln = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)];
    const rollNo = String(i + 1).padStart(3, "0");
    students.push({
      id: `S${classNum}${sectionLabel}${rollNo}`,
      name: `${fn} ${ln}`,
      rollNo,
      admissionNo: `ADM-${2020 + classNum}-${classNum}${sectionLabel}${rollNo}`,
      gender: Math.floor(rand() * 3) === 0 ? "Female" : "Male",
      attendance: 78 + Math.floor(rand() * 20),
      todayStatus: todayStatuses[Math.floor(rand() * todayStatuses.length)],
      parentPhone: `+91-9${Math.floor(rand() * 900000000 + 100000000)}`,
    });
  }
  return students;
};

const generateTimetable = (classNum, subjectNames) => {
  const rand = seedRand(classNum * 37);
  const shuffled = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const timetable = {};
  DAYS_OF_WEEK.forEach((day) => {
    timetable[day] = {};
    const daySubjects = shuffled(subjectNames);
    let si = 0;
    TIMETABLE_PERIODS.forEach((period) => {
      if (period.type === "break") {
        timetable[day][period.num] = null;
      } else {
        const subj = daySubjects[si % daySubjects.length];
        timetable[day][period.num] = {
          subject: subj,
          teacherId: TEACHERS[(si + classNum) % TEACHERS.length].id,
        };
        si++;
      }
    });
  });
  return timetable;
};

// ── Section Generator ──────────────────────────────────────────────────────────
const SECTION_LABELS = ["A", "B", "C", "D"];

const generateSections = (classNum, roomOffset) => {
  const count = classNum <= 4 ? 2 : classNum <= 7 ? 3 : 2;
  const subjectNames = SUBJECTS_BY_CLASS[classNum] || SUBJECTS_BY_CLASS[1];
  const rand = seedRand(classNum * 53);
  const sections = [];

  for (let i = 0; i < count; i++) {
    const lbl = SECTION_LABELS[i];
    const room = ROOMS[(roomOffset + i) % ROOMS.length];
    const studentCount = 32 + Math.floor(rand() * 14);
    const occupancy = Math.min(Math.round((studentCount / room.capacity) * 100), 100);
    const classTeacherId = TEACHERS[(classNum * 2 + i) % TEACHERS.length].id;
    const coTeacherId    = TEACHERS[(classNum * 2 + i + 1) % TEACHERS.length].id;
    const coordinatorId  = TEACHERS[(classNum + i + 3) % TEACHERS.length].id;
    const weeklyAttendance = Math.min(82 + Math.floor(rand() * 14), 97);
    const leaderIdx = Math.floor(rand() * FIRST_NAMES.length);

    sections.push({
      id: `SEC-${classNum}-${lbl}`,
      label: `Section ${lbl}`,
      classNum,
      sectionLabel: lbl,
      studentCount,
      occupancy,
      room,
      classTeacherId,
      coTeacherId,
      coordinatorId,
      classLeader: {
        name: `${FIRST_NAMES[leaderIdx % FIRST_NAMES.length]} ${LAST_NAMES[leaderIdx % LAST_NAMES.length]}`,
        rollNo: `00${i + 1}`,
      },
      subjects: subjectNames.map((name, si) => ({
        name,
        teacherId: TEACHERS[(si + classNum) % TEACHERS.length].id,
      })),
      students: generateStudents(classNum, lbl, studentCount),
      weeklyAttendance,
      timetable: generateTimetable(classNum, subjectNames),
      status: "active",
      academicYear: "2026-27",
      createdDate: `2026-0${Math.max(1, (classNum % 9) + 1)}-01`,
    });
  }
  return sections;
};

// ── Main Classes Data ──────────────────────────────────────────────────────────
export const MOCK_CLASSES = Array.from({ length: 10 }, (_, i) => {
  const classNum = i + 1;
  const sections = generateSections(classNum, i * 2);
  const totalStudents = sections.reduce((s, sec) => s + sec.studentCount, 0);
  const avgOccupancy  = Math.round(sections.reduce((s, sec) => s + sec.occupancy, 0) / sections.length);
  const avgAttendance = Math.round(sections.reduce((s, sec) => s + sec.weeklyAttendance, 0) / sections.length);
  const uniqueTeachers = new Set([
    ...sections.map((s) => s.classTeacherId),
    ...sections.map((s) => s.coTeacherId),
  ]);

  return {
    id: `CLASS-${classNum}`,
    classNumber: classNum,
    label: `Class ${classNum}`,
    sections,
    totalSections:  sections.length,
    totalStudents,
    totalTeachers:  uniqueTeachers.size,
    avgOccupancy,
    avgAttendance,
    academicYear:   "2026-27",
    status:         "active",
    lastUpdated:    "2026-05-15",
  };
});

// ── Compute Overview Metrics ───────────────────────────────────────────────────
export const computeClassMetrics = (classes) => ({
  total:      classes.length,
  sections:   classes.reduce((s, c) => s + c.totalSections, 0),
  teachers:   new Set(
    classes.flatMap((c) =>
      c.sections.flatMap((sec) => [sec.classTeacherId, sec.coTeacherId])
    )
  ).size,
  students:   classes.reduce((s, c) => s + c.totalStudents, 0),
  occupancy:  Math.round(
    classes.reduce((s, c) => s + c.avgOccupancy, 0) / classes.length
  ),
  attendance: Math.round(
    classes.reduce((s, c) => s + c.avgAttendance, 0) / classes.length
  ),
});

// ── Lookup Helpers ─────────────────────────────────────────────────────────────
export const getTeacherById = (id) => TEACHERS.find((t) => t.id === id);
export const getAllTeachers  = ()   => TEACHERS;