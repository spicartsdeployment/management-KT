/**
 * Fee Management Mock Data
 * Structured for easy swap-out with real API responses.
 */

const PARENT_NAMES = [
  'Mr. Rajesh Kumar', 'Mrs. Sunita Sharma', 'Mr. Anil Singh', 'Mrs. Kiran Patel', 'Mr. Venkat Reddy',
  'Mrs. Meena Desai', 'Mr. Deepak Gupta', 'Mrs. Usha Rao', 'Mr. Suresh Gupta', 'Mrs. Lakshmi Nair',
  'Mr. Vijay Verma', 'Mrs. Kamla Krishnan', 'Mr. Ramesh Joshi', 'Mrs. Sudha Iyer', 'Mr. Shyam Yadav',
  'Mrs. Gita Mishra', 'Mr. Bharat Bhatt', 'Mrs. Anita Kulkarni', 'Mr. Mohan Shankar', 'Mrs. Prabha Menon',
  'Mr. Sunil Tiwari', 'Mrs. Rekha Agarwal', 'Mr. Dinesh Malhotra', 'Mrs. Savita Singh', 'Mr. Ashok Nair',
  'Mrs. Seema Sinha', 'Mr. Tapan Bose', 'Mrs. Ranjana Roy', 'Mr. Vinod Saxena', 'Mrs. Poonam Jain',
  'Mr. Rajendra Pandey', 'Mrs. Shakuntala Kapoor', 'Mr. Hemant Mehta', 'Mrs. Sushila Chaudhary', 'Mr. Arun Das',
];

const PHONES = [
  '9876543210', '9765432109', '9654321098', '9543210987', '9432109876',
  '9321098765', '9210987654', '9109876543', '9098765432', '8987654321',
  '8876543210', '8765432109', '8654321098', '8543210987', '8432109876',
  '8321098765', '8210987654', '8109876543', '8098765432', '7987654321',
  '7876543210', '7765432109', '7654321098', '7543210987', '7432109876',
  '7321098765', '7210987654', '7109876543', '7098765432', '6987654321',
  '6876543210', '6765432109', '6654321098', '6543210987', '6432109876',
];

const GENDERS = [
  'Male', 'Female', 'Male', 'Female', 'Male', 'Female', 'Male', 'Female', 'Male', 'Female',
  'Male', 'Female', 'Male', 'Female', 'Male', 'Female', 'Male', 'Female', 'Male', 'Female',
  'Male', 'Female', 'Male', 'Female', 'Male', 'Female', 'Male', 'Female', 'Male', 'Female',
  'Male', 'Female', 'Male', 'Female', 'Male',
];

const LOCALITIES = [
  'Koramangala', 'Indiranagar', 'HSR Layout', 'JP Nagar', 'Whitefield',
  'Marathahalli', 'Electronic City', 'Hebbal', 'Rajajinagar', 'Jayanagar',
  'BTM Layout', 'Banashankari', 'Yeshwanthpur', 'Malleswaram', 'Ulsoor',
  'Cunningham Road', 'Basavanagudi', 'Bellandur', 'Sarjapur', 'Kadugodi',
  'Vijayanagar', 'Bommanahalli', 'KR Puram', 'Yelahanka', 'Devanahalli',
  'Peenya', 'Nagarbhavi', 'Kengeri', 'Uttarahalli', 'Padmanabhanagar',
  'Chamarajpet', 'Gandhinagar', 'Shivajinagar', 'Frazer Town', 'Richmond Town',
];

const ADMISSION_YEARS = ['2022-06-01', '2022-07-15', '2023-01-10', '2023-06-05', '2024-01-20'];

const STUDENT_NAMES = [
  'Rahul Kumar', 'Priya Sharma', 'Amit Singh', 'Neha Patel', 'Vikram Reddy',
  'Anjali Desai', 'Rohan Gupta', 'Kavita Rao', 'Sandeep Gupta', 'Meera Nair',
  'Arjun Verma', 'Divya Krishnan', 'Siddharth Joshi', 'Pooja Iyer', 'Manish Yadav',
  'Swati Mishra', 'Harsh Bhatt', 'Sneha Kulkarni', 'Ravi Shankar', 'Deepa Menon',
  'Aakash Tiwari', 'Nisha Agarwal', 'Karan Malhotra', 'Rekha Singh', 'Varun Nair',
  'Pallavi Sinha', 'Tarun Bose', 'Ananya Roy', 'Mohit Saxena', 'Sonal Jain',
  'Nitin Pandey', 'Lata Kapoor', 'Gaurav Mehta', 'Ritu Chaudhary', 'Abhishek Das',
];

const PAYMENT_MODES = ['Online', 'Cash', 'Cheque', 'NEFT', 'UPI'];
const SECTIONS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const STUDENTS_PER_SECTION = 35;

const FEE_CATEGORIES_T1 = [
  { category: 'Tuition Fee',   expected: 20000 },
  { category: 'Transport Fee', expected: 8000  },
  { category: 'Lab Fee',       expected: 3000  },
  { category: 'Books Fee',     expected: 5000  },
];
const FEE_CATEGORIES_T2 = [
  { category: 'Tuition Fee',   expected: 10000 },
  { category: 'Exam Fee',      expected: 2000  },
  { category: 'Hostel Fee',    expected: 1500  },
  { category: 'Miscellaneous', expected: 500   },
];

const TOTAL_FEE = [...FEE_CATEGORIES_T1, ...FEE_CATEGORIES_T2].reduce((s, c) => s + c.expected, 0); // 50000

function paidRatio(rollNo) {
  const ratios = [1.0, 1.0, 0.70, 0.50, 0.80, 1.0, 0.60, 0.90, 0.40, 1.0,
                  0.75, 1.0, 0.55, 0.85, 1.0, 0.65, 1.0, 0.45, 0.95, 1.0,
                  0.70, 0.80, 1.0, 0.50, 0.90, 1.0, 0.60, 0.75, 1.0, 0.40,
                  0.85, 1.0, 0.70, 0.55, 0.95];
  return ratios[(rollNo - 1) % ratios.length];
}

function buildFeeBreakdown(ratio) {
  const term1 = FEE_CATEGORIES_T1.map((c) => {
    const paid = ratio >= 1 ? c.expected : Math.round(c.expected * ratio / 100) * 100;
    const overdue = paid < c.expected && ratio < 0.5 ? Math.round(c.expected * 0.1 / 100) * 100 : 0;
    const pending = c.expected - paid - overdue;
    return {
      ...c,
      paid,
      overdue,
      pending: Math.max(0, pending),
      dueDate: '2024-06-30',
      status: paid >= c.expected ? 'paid' : overdue > 0 ? 'overdue' : 'partial',
    };
  });
  const term2 = FEE_CATEGORIES_T2.map((c) => ({
    ...c,
    paid: 0,
    overdue: 0,
    pending: c.expected,
    dueDate: '2024-12-15',
    status: 'pending',
  }));
  return { term1, term2 };
}

function buildPaymentHistory(rollNo, paidAmt) {
  if (paidAmt <= 0) return [];
  const history = [];
  let remaining = paidAmt;
  const dates = ['2024-02-05', '2024-03-10', '2024-04-15', '2024-05-01'];
  dates.forEach((date, i) => {
    if (remaining <= 0) return;
    const chunk = Math.min(remaining, [15000, 10000, 10000, 10000][i]);
    history.push({
      date,
      amount: chunk,
      mode: PAYMENT_MODES[i % PAYMENT_MODES.length],
      receiptNo: `REC${String(rollNo).padStart(3, '0')}${i + 1}`,
      collectedBy: 'Admin',
      txnId: `TXN2024${String(rollNo).padStart(3, '0')}${i + 1}`,
      remarks: '-',
      status: 'Success',
    });
    remaining -= chunk;
  });
  return history;
}

function generateStudent(classNum, section, rollNo) {
  const ratio = paidRatio(rollNo);
  const paidAmt = Math.round(TOTAL_FEE * ratio / 1000) * 1000;
  const overdueAmt = ratio < 0.6 ? Math.round(TOTAL_FEE * 0.1 / 1000) * 1000 : 0;
  const pendingAmt = Math.max(0, TOTAL_FEE - paidAmt - overdueAmt);
  let status = 'pending';
  if (paidAmt >= TOTAL_FEE) status = 'paid';
  else if (overdueAmt > 0) status = 'overdue';
  else if (paidAmt > 0) status = 'partial';

  const idx = (rollNo - 1) % STUDENT_NAMES.length;
  const firstName = STUDENT_NAMES[idx].split(' ')[0].toLowerCase();

  return {
    id: `${classNum}-${section}-${rollNo}`,
    rollNo,
    admissionNo: `ADM2024${String(classNum * 100 + rollNo).padStart(3, '0')}`,
    name: STUDENT_NAMES[idx],
    class: `Class ${classNum}`,
    classNum,
    section,
    gender: GENDERS[idx],
    parentName: PARENT_NAMES[idx],
    phone: PHONES[idx],
    email: `${firstName}.${classNum}${section.toLowerCase()}${rollNo}@school.edu`,
    address: `${(rollNo % 50) + 1}, ${LOCALITIES[idx]}, Bengaluru - ${560000 + (rollNo % 100)}`,
    admissionDate: ADMISSION_YEARS[rollNo % ADMISSION_YEARS.length],
    totalAmount: TOTAL_FEE,
    paidAmount: paidAmt,
    pendingAmount: pendingAmt,
    overdueAmount: overdueAmt,
    status,
    collectionPct: Math.round((paidAmt / TOTAL_FEE) * 100),
    feeBreakdown: buildFeeBreakdown(ratio),
    paymentHistory: buildPaymentHistory(rollNo, paidAmt),
  };
}

function buildSection(classNum, section) {
  const students = Array.from({ length: STUDENTS_PER_SECTION }, (_, i) =>
    generateStudent(classNum, section, i + 1)
  );
  const totalStudents = students.length;
  const expected     = totalStudents * TOTAL_FEE;
  const collected    = students.reduce((s, st) => s + st.paidAmount, 0);
  const pending      = students.reduce((s, st) => s + st.pendingAmount, 0);
  const overdue      = students.reduce((s, st) => s + st.overdueAmount, 0);
  return {
    id: `${classNum}-${section}`,
    label: `Section ${section}`,
    section,
    totalStudents,
    expected,
    collected,
    pending,
    overdue,
    collectionPct: Math.round((collected / expected) * 100),
    students,
  };
}

function buildClass(classNum) {
  const sections = SECTIONS.map((s) => buildSection(classNum, s));
  const totalStudents = sections.reduce((s, sec) => s + sec.totalStudents, 0);
  const expected      = sections.reduce((s, sec) => s + sec.expected, 0);
  const collected     = sections.reduce((s, sec) => s + sec.collected, 0);
  const pending       = sections.reduce((s, sec) => s + sec.pending, 0);
  const overdue       = sections.reduce((s, sec) => s + sec.overdue, 0);
  return {
    id: classNum,
    label: `Class ${classNum}`,
    totalStudents,
    expected,
    collected,
    pending,
    overdue,
    collectionPct: Math.round((collected / expected) * 100),
    sections,
  };
}

export const CLASSES_DATA = Array.from({ length: 10 }, (_, i) => buildClass(i + 1));

export const OVERVIEW_METRICS = (() => {
  const totalStudents = CLASSES_DATA.reduce((s, c) => s + c.totalStudents, 0);
  const totalExpected = CLASSES_DATA.reduce((s, c) => s + c.expected, 0);
  const totalCollected = CLASSES_DATA.reduce((s, c) => s + c.collected, 0);
  const totalPending   = CLASSES_DATA.reduce((s, c) => s + c.pending, 0);
  const totalOverdue   = CLASSES_DATA.reduce((s, c) => s + c.overdue, 0);
  const collectionPct  = Math.round((totalCollected / totalExpected) * 100);
  return { totalStudents, totalExpected, totalCollected, totalPending, totalOverdue, collectionPct };
})();

/** Format ₹ values concisely: Cr / L / K */
export function formatINR(amount) {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000)   return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000)     return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatINRFull(amount) {
  return `₹${amount.toLocaleString('en-IN')}`;
}
