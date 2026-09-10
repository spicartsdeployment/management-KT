import { CLASSES_DATA, formatINR, formatINRFull } from './mockData';

const REMINDER_TYPES = ['SMS', 'Email', 'WhatsApp'];
const CONTACT_BASE = 9876500000;

function daysFromRoll(classNum, section, rollNo) {
  const sectionSeed = section.charCodeAt(0) - 64;
  return ((classNum * 17 + sectionSeed * 11 + rollNo * 7) % 130) + 1;
}

function dueDateFromDays(days) {
  const dt = new Date('2026-05-19');
  dt.setDate(dt.getDate() - days);
  return dt.toISOString().slice(0, 10);
}

function statusFromAmounts(student, overdueDays) {
  if (student.pendingAmount === 0 && student.overdueAmount === 0) return 'Paid';
  if (overdueDays >= 90 || student.overdueAmount >= 5000) return 'Critical Overdue';
  if (student.paidAmount > 0) return 'Partial';
  return 'Pending';
}

function priorityFromStatus(status, overdueDays) {
  if (status === 'Critical Overdue') return 'Urgent';
  if (overdueDays >= 60) return 'High';
  if (overdueDays >= 30) return 'Medium';
  return 'Low';
}

function healthFromPct(pct) {
  if (pct <= 8) return 'Healthy';
  if (pct <= 14) return 'Watchlist';
  if (pct <= 20) return 'Risk';
  return 'Critical';
}

function severityFromPct(pct) {
  if (pct <= 10) return 'Low';
  if (pct <= 18) return 'Moderate';
  if (pct <= 25) return 'High';
  return 'Severe';
}

function communicationLogs(student) {
  const seed = Number(String(student.id).replace(/\D/g, '').slice(-4)) || 1;
  const count = 2 + (seed % 3); // 2-4 logs
  const CHANNELS = ['SMS', 'Email', 'WhatsApp', 'Phone Call'];
  const OUTCOMES = ['No Response', 'Promised to Pay', 'Payment Initiated', 'Request for Extension', 'Delivered', 'Read'];
  return Array.from({ length: count }, (_, i) => {
    const daysAgo = (i + 1) * Math.ceil(seed % 8 + 3);
    return {
      id: `${student.id}-LOG-${i + 1}`,
      date: dueDateFromDays(daysAgo),
      channel: CHANNELS[(seed + i) % CHANNELS.length],
      outcome: OUTCOMES[(seed + i) % OUTCOMES.length],
      by: i % 2 === 0 ? 'Accounts Team' : 'Class Teacher',
      notes: i === 0 ? 'Initial contact — no response' : 'Follow-up sent',
    };
  });
}

function latestReminder(studentId) {
  const seed = Number(String(studentId).replace(/\D/g, '').slice(-4)) || 1;
  const daysAgo = (seed % 12) + 1;
  const type = REMINDER_TYPES[seed % REMINDER_TYPES.length];
  const status = seed % 4 === 0 ? 'Failed' : 'Delivered';
  return {
    type,
    status,
    sentOn: dueDateFromDays(daysAgo),
    by: 'Accounts Team',
  };
}

function reminderLogs(student) {
  const logCount = student.status === 'Critical Overdue' ? 4 : student.status === 'Pending' ? 1 : 2;
  return Array.from({ length: logCount }, (_, idx) => {
    const daysAgo = (idx + 1) * (student.status === 'Critical Overdue' ? 7 : 12);
    return {
      id: `${student.id}-REM-${idx + 1}`,
      type: REMINDER_TYPES[idx % REMINDER_TYPES.length],
      template: idx % 2 === 0 ? 'Fee Reminder - Standard' : 'Urgent Overdue Alert',
      sentOn: dueDateFromDays(daysAgo),
      status: idx === 0 && student.status === 'Critical Overdue' ? 'Read' : 'Delivered',
      sentBy: 'Finance Office',
    };
  });
}

function buildOverdueStudent(student) {
  const overdueDays = daysFromRoll(student.classNum, student.section, student.rollNo);
  const status = statusFromAmounts(student, overdueDays);
  const dueDate = dueDateFromDays(overdueDays);
  const lastPaymentDate = student.paymentHistory.length
    ? student.paymentHistory[student.paymentHistory.length - 1].date
    : '-';
  const priority = priorityFromStatus(status, overdueDays);
  const totalPendingAmount = student.pendingAmount + student.overdueAmount;
  const paidPct = Math.round((student.paidAmount / student.totalAmount) * 100);
  const latest = latestReminder(student.id);

  const aging = {
    d0_30: overdueDays <= 30 ? totalPendingAmount : 0,
    d31_60: overdueDays > 30 && overdueDays <= 60 ? totalPendingAmount : 0,
    d61_90: overdueDays > 60 && overdueDays <= 90 ? totalPendingAmount : 0,
    d90Plus: overdueDays > 90 ? totalPendingAmount : 0,
  };

  return {
    ...student,
    parentContact: `+91 ${String(CONTACT_BASE + student.classNum * 1000 + student.rollNo)}`,
    dueDate,
    overdueDays,
    paymentStatus: status,
    priority,
    totalPendingAmount,
    lastPaymentDate,
    latestReminder: latest,
    reminderLogs: reminderLogs({ id: student.id, status }),
    communicationLogs: communicationLogs(student),
    recoveryProgress: paidPct,
    overduePct: Math.round((totalPendingAmount / student.totalAmount) * 100),
    aging,
  };
}

function buildSectionDue(section, classLabel) {
  const overdueStudents = section.students
    .map(buildOverdueStudent)
    .filter((st) => st.overdueAmount > 0);

  const overdueAmount = overdueStudents.reduce((sum, st) => sum + st.overdueAmount, 0);
  const pendingAmount = overdueStudents.reduce((sum, st) => sum + st.pendingAmount, 0);
  const totalDue = overdueAmount + pendingAmount;
  const overdueStudentsCount = overdueStudents.length;
  const overduePct = Math.round((totalDue / section.expected) * 100);
  const criticalCount = overdueStudents.filter((st) => st.paymentStatus === 'Critical Overdue').length;
  const avgRecovery = overdueStudentsCount
    ? Math.round(overdueStudents.reduce((sum, st) => sum + st.recoveryProgress, 0) / overdueStudentsCount)
    : 0;

  return {
    id: section.id,
    classLabel,
    section: section.section,
    label: section.label,
    totalStudents: section.totalStudents,
    overdueStudentsCount,
    overdueAmount,
    pendingAmount,
    totalDue,
    overduePct,
    criticalCount,
    recoveryProgress: avgRecovery,
    collectionHealth: healthFromPct(overduePct),
    students: overdueStudents,
  };
}

function buildClassDue(cls) {
  const sections = cls.sections.map((section) => buildSectionDue(section, cls.label));
  const totalDue = sections.reduce((sum, section) => sum + section.totalDue, 0);
  const overdueAmount = sections.reduce((sum, section) => sum + section.overdueAmount, 0);
  const overdueStudentsCount = sections.reduce((sum, section) => sum + section.overdueStudentsCount, 0);
  const criticalCount = sections.reduce((sum, section) => sum + section.criticalCount, 0);
  const overduePct = Math.round((totalDue / cls.expected) * 100);
  const collectionHealth = healthFromPct(overduePct);

  return {
    id: cls.id,
    label: cls.label,
    totalStudents: cls.totalStudents,
    overdueStudentsCount,
    overdueAmount,
    totalDue,
    overduePct,
    severity: severityFromPct(overduePct),
    criticalCount,
    collectionHealth,
    recoveryProgress: Math.max(0, 100 - overduePct),
    sections,
  };
}

export const DUE_CLASSES_DATA = CLASSES_DATA.map(buildClassDue);

export const DUE_OVERVIEW_METRICS = (() => {
  const totalOverdueAmount = DUE_CLASSES_DATA.reduce((sum, cls) => sum + cls.overdueAmount, 0);
  const totalDue = DUE_CLASSES_DATA.reduce((sum, cls) => sum + cls.totalDue, 0);
  const studentsWithOverdue = DUE_CLASSES_DATA.reduce((sum, cls) => sum + cls.overdueStudentsCount, 0);
  const criticalStudents = DUE_CLASSES_DATA.reduce((sum, cls) => sum + cls.criticalCount, 0);
  const avgOverduePct = DUE_CLASSES_DATA.length
    ? Math.round(DUE_CLASSES_DATA.reduce((sum, cls) => sum + cls.overduePct, 0) / DUE_CLASSES_DATA.length)
    : 0;
  return {
    totalOverdueAmount,
    totalDue,
    studentsWithOverdue,
    criticalStudents,
    avgOverduePct,
    remindersSent: DUE_CLASSES_DATA.reduce(
      (sum, cls) => sum + cls.sections.reduce(
        (s2, sec) => s2 + sec.students.reduce((s3, st) => s3 + (st.reminderLogs?.length ?? 0), 0), 0
      ), 0
    ),
    highestDueClass: DUE_CLASSES_DATA.reduce(
      (best, cls) => cls.totalDue > best.totalDue ? cls : best,
      DUE_CLASSES_DATA[0]
    )?.label ?? 'N/A',
    recoveryPct: (() => {
      const total = DUE_CLASSES_DATA.reduce((s, cls) => s + cls.totalStudents, 0);
      return total ? Math.round(((total - DUE_CLASSES_DATA.reduce((s, cls) => s + cls.overdueStudentsCount, 0)) / total) * 100) : 0;
    })(),
  };
})();

export function getAgingAnalysis(student) {
  return [
    { label: '0-30 Days', amount: student.aging.d0_30, color: '#22c55e' },
    { label: '31-60 Days', amount: student.aging.d31_60, color: '#f59e0b' },
    { label: '61-90 Days', amount: student.aging.d61_90, color: '#fb7185' },
    { label: '90+ Days', amount: student.aging.d90Plus, color: '#ef4444' },
  ];
}

export { formatINR, formatINRFull };
