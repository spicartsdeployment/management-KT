// ─── Payment Tracking Mock Data ───────────────────────────────────────────────

// ── Helpers ───────────────────────────────────────────────────────────────────
/** @param {number} n */
export function formatINR(n) {
  if (!n && n !== 0) return '—';
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)}Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)}L`;
  if (n >= 1e3) return `₹${(n / 1e3).toFixed(1)}K`;
  return `₹${n.toLocaleString('en-IN')}`;
}

/** @param {number} n */
export function formatINRFull(n) {
  if (!n && n !== 0) return '—';
  return `₹${n.toLocaleString('en-IN')}`;
}

// ── Seed arrays ───────────────────────────────────────────────────────────────
const STUDENT_NAMES = [
  'Aarav Sharma', 'Priya Patel', 'Rahul Verma', 'Sneha Reddy', 'Arjun Nair',
  'Divya Krishnan', 'Kiran Mehta', 'Pooja Joshi', 'Rohan Gupta', 'Ananya Singh',
  'Vikas Choudhary', 'Swati Agarwal', 'Nikhil Kumar', 'Neha Pillai', 'Suresh Iyer',
  'Meera Desai', 'Aditya Bose', 'Kavya Rao', 'Rohit Saxena', 'Isha Malik',
  'Dhruv Kapoor', 'Sana Qureshi', 'Sameer Shah', 'Tanvi Jain', 'Abhishek Nair',
  'Pallavi Mishra', 'Gaurav Tripathi', 'Ritu Pandey', 'Manoj Tiwari', 'Shweta Srivastava',
  'Vivek Bhatt', 'Leena Pillai', 'Siddharth Kaul', 'Nandita Rao', 'Arpit Goyal',
];

const ADMISSION_NOS = (start) => `ADM2024${String(start).padStart(4, '0')}`;
const PAYMENT_MODES = ['Cash', 'UPI', 'NEFT', 'RTGS', 'Card', 'Cheque'];
const PURPOSES = ['Tuition Fee', 'Transport Fee', 'Lab Fee', 'Exam Fee', 'Books Fee', 'Hostel Fee', 'Miscellaneous'];
const PROCESSED_BY = ['Accounts Team', 'Class Teacher', 'Admin Desk', 'Finance Officer', 'Receptionist'];
const REFUND_STATUSES = ['None', 'None', 'None', 'None', 'Requested', 'Approved', 'Completed'];
const STATUSES = ['Completed', 'Completed', 'Completed', 'Partial', 'Failed', 'Pending', 'Refunded'];
const CLASSES = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];
const SECTIONS = ['A', 'B', 'C', 'D', 'E', 'F'];

function pseudoRandom(seed) {
  let x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function randomDate(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function buildAuditLog(txnId, status) {
  const base = [
    { ts: '09:00', action: 'Transaction initiated', by: 'System' },
    { ts: '09:01', action: 'Payment gateway request sent', by: 'System' },
  ];
  if (status === 'Completed' || status === 'Partial') {
    base.push({ ts: '09:02', action: 'Payment confirmed', by: 'Bank Gateway' });
    base.push({ ts: '09:03', action: 'Receipt generated', by: 'Accounts Team' });
  } else if (status === 'Failed') {
    base.push({ ts: '09:02', action: 'Payment failed — bank declined', by: 'Bank Gateway' });
    base.push({ ts: '09:05', action: 'Failure notification sent to parent', by: 'System' });
  } else if (status === 'Refunded') {
    base.push({ ts: '09:02', action: 'Original payment confirmed', by: 'Bank Gateway' });
    base.push({ ts: '10:00', action: 'Refund request raised', by: 'Accounts Team' });
    base.push({ ts: '10:30', action: 'Refund approved', by: 'Finance Officer' });
    base.push({ ts: '11:00', action: `Refund processed — ${txnId}`, by: 'Bank Gateway' });
  }
  return base;
}

/** @returns {import('./paymentMockData').PaymentRecord} */
function buildTransaction(idx) {
  const r = (offset) => pseudoRandom(idx * 37 + offset);
  const sIdx = Math.floor(r(1) * STUDENT_NAMES.length);
  const cIdx = Math.floor(r(2) * CLASSES.length);
  const secIdx = Math.floor(r(3) * SECTIONS.length);
  const modeIdx = Math.floor(r(4) * PAYMENT_MODES.length);
  const purposeIdx = Math.floor(r(5) * PURPOSES.length);
  const processedByIdx = Math.floor(r(6) * PROCESSED_BY.length);
  const statusIdx = Math.floor(r(7) * STATUSES.length);
  const refundStatusIdx = Math.floor(r(8) * REFUND_STATUSES.length);

  const amount = Math.round((2000 + r(9) * 28000) / 500) * 500;
  const daysAgo = Math.floor(r(10) * 90);
  const status = STATUSES[statusIdx];
  const isPartial = status === 'Partial';
  const paidAmount = isPartial ? Math.round(amount * (0.3 + r(11) * 0.5) / 100) * 100 : amount;
  const refundStatus = status === 'Refunded' ? REFUND_STATUSES[5] : REFUND_STATUSES[0];
  const refundAmount = status === 'Refunded' ? paidAmount : 0;
  const txnRef = `TXN${String(idx + 1000).padStart(6, '0')}`;
  const receiptId = `RCP${String(idx + 2000).padStart(6, '0')}`;
  const studentId = `STU${String(sIdx * 10 + cIdx).padStart(5, '0')}`;

  return {
    id: idx + 1,
    receiptId,
    txnRef,
    studentId,
    studentName: STUDENT_NAMES[sIdx],
    admissionNo: ADMISSION_NOS(sIdx + cIdx * 35 + 1),
    classNum: cIdx + 1,
    classLabel: CLASSES[cIdx],
    section: SECTIONS[secIdx],
    purpose: PURPOSES[purposeIdx],
    amount,
    paidAmount,
    mode: PAYMENT_MODES[modeIdx],
    dateTime: `${randomDate(daysAgo)} ${String(8 + Math.floor(r(12) * 8)).padStart(2, '0')}:${String(Math.floor(r(13) * 60)).padStart(2, '0')}`,
    status,
    processedBy: PROCESSED_BY[processedByIdx],
    remarks: r(14) > 0.7 ? `Partial payment for ${PURPOSES[purposeIdx]}` : '',
    isPartial,
    refundStatus,
    refundAmount,
    auditLog: buildAuditLog(txnRef, status),
  };
}

// ── Generate 65 transactions ──────────────────────────────────────────────────
export const PAYMENT_TRANSACTIONS = Array.from({ length: 65 }, (_, i) => buildTransaction(i));

// ── Aggregate Metrics ─────────────────────────────────────────────────────────
const today = new Date().toISOString().slice(0, 10);
const todayRecords = PAYMENT_TRANSACTIONS.filter(t => t.dateTime.startsWith(today));
const currentMonth = new Date().toISOString().slice(0, 7);
const monthRecords = PAYMENT_TRANSACTIONS.filter(t => t.dateTime.startsWith(currentMonth) && (t.status === 'Completed' || t.status === 'Partial'));
const totalCollected = PAYMENT_TRANSACTIONS.filter(t => t.status === 'Completed' || t.status === 'Partial').reduce((s, t) => s + t.paidAmount, 0);
const totalExpected = PAYMENT_TRANSACTIONS.reduce((s, t) => s + t.amount, 0);

export const PT_METRICS = {
  todayTotal: todayRecords.reduce((s, t) => s + (t.status === 'Completed' || t.status === 'Partial' ? t.paidAmount : 0), 0),
  todayCount: todayRecords.length,
  monthCollected: monthRecords.reduce((s, t) => s + t.paidAmount, 0),
  monthCount: monthRecords.length,
  pendingCount: PAYMENT_TRANSACTIONS.filter(t => t.status === 'Pending').length,
  failedCount: PAYMENT_TRANSACTIONS.filter(t => t.status === 'Failed').length,
  refundedCount: PAYMENT_TRANSACTIONS.filter(t => t.status === 'Refunded').length,
  discountsApplied: Math.round(PAYMENT_TRANSACTIONS.length * 0.08),
  collectionEfficiencyPct: Math.round((totalCollected / totalExpected) * 100),
  totalCollected,
  totalExpected,
};

/** Mode-wise summary for breakdown charts */
export const PT_MODE_SUMMARY = PAYMENT_MODES.map(mode => ({
  mode,
  count: PAYMENT_TRANSACTIONS.filter(t => t.mode === mode).length,
  total: PAYMENT_TRANSACTIONS.filter(t => t.mode === mode && (t.status === 'Completed' || t.status === 'Partial')).reduce((s, t) => s + t.paidAmount, 0),
}));

/** Status-wise summary */
export const PT_STATUS_SUMMARY = [...new Set(PAYMENT_TRANSACTIONS.map(t => t.status))].map(status => ({
  status,
  count: PAYMENT_TRANSACTIONS.filter(t => t.status === status).length,
  total: PAYMENT_TRANSACTIONS.filter(t => t.status === status).reduce((s, t) => s + t.paidAmount, 0),
}));
