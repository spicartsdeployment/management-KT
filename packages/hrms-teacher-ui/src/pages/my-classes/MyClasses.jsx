import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import {
  Star,
  FileText,
  Video,
  File,
  FolderOpen,
  Download,
  Share2,
  ThumbsUp,
  AlertTriangle,
  TrendingUp,
  Award,
  Users,
  BarChart3,
  ClipboardCheck,
  ClipboardList,
  GraduationCapIcon,
  Heart,
  MessageSquare,
  Trash,
  Eye,
  Pencil,
  CheckCircle,
  Trophy,
  Clock,
  XCircle,
  BookText,
  Edit,
  Trash2,


} from "lucide-react";
import FloatingAIAssistant from '../../components/FloatingAIAssistant';
import '../../assets/scss/MyClasses.scss';

// ─── Data ──────────────────────────────────────────
const CLASSES = [
  { id: 1, name: 'Class 9A', subject: 'Mathematics', color: '#3b82f6', isClassTeacher: false },
  { id: 2, name: 'Class 9B', subject: 'Mathematics', color: '#8b5cf6', isClassTeacher: false },
  { id: 3, name: 'Class 10A', subject: 'Advanced Algebra', color: '#ec4899', isClassTeacher: false },
  { id: 4, name: 'Class 9A', subject: 'Class Teacher', color: '#6b7280', isClassTeacher: true },
];



const resultStats = [
  {
    label: 'Class Average',
    value: 'A+',
    icon: BarChart3,
    variant: 'blue',
  },
  {
    label: 'Top Scorers (90%+)',
    value: '8',
    icon: Trophy,
    variant: 'emerald',
  },
  {
    label: 'Pass Percentage',
    value: '85.5%',
    icon: TrendingUp,
    variant: 'violet',
  },
  {
    label: 'Highest Score',
    value: '98%',
    icon: Star,
    variant: 'amber',
  },
];

const INITIAL_STUDENTS = {
  1: [
    {
      id: 1,
      rollNo: '001',
      name: 'Aarav Sharma',
      phone: '+91 98765 43210',
      altPhone: '',
      email: 'aarav@school.com',
      attendance: 96,
      avgMarks: 96,
      lastTest: 94,
      behavior: 'Excellent',
    },
    {
      id: 2,
      rollNo: '002',
      name: 'Priya Patel',
      phone: '+91 98765 43212',
      altPhone: '',
      email: 'priya@school.com',
      attendance: 94,
      avgMarks: 94,
      lastTest: 92,
      behavior: 'Very Good',
    },
    {
      id: 3,
      rollNo: '003',
      name: 'Rohan Kumar',
      phone: '+91 98765 43214',
      altPhone: '',
      email: 'rohan@school.com',
      attendance: 98,
      avgMarks: 93,
      lastTest: 95,
      behavior: 'Excellent',
    },
    {
      id: 4,
      rollNo: '005',
      name: 'Arjun Mehta',
      phone: '+91 98765 43218',
      altPhone: '',
      email: 'arjun@school.com',
      attendance: 92,
      avgMarks: 90,
      lastTest: 88,
      behavior: 'Very Good',
    },
    {
      id: 5,
      rollNo: '004',
      name: 'Ananya Singh',
      phone: '+91 98765 43216',
      altPhone: '',
      email: 'ananya@school.com',
      attendance: 89,
      avgMarks: 85,
      lastTest: 83,
      behavior: 'Good',
    },
  ],

  2: [
    {
      id: 1,
      rollNo: '001',
      name: 'Kabir Reddy',
      phone: '+91 98765 41010',
      altPhone: '',
      email: 'kabir@school.com',
      attendance: 88,
      avgMarks: 78,
      lastTest: 76,
      behavior: 'Good',
    },
    {
      id: 2,
      rollNo: '002',
      name: 'Diya Mehta',
      phone: '+91 98765 41012',
      altPhone: '',
      email: 'diya@school.com',
      attendance: 91,
      avgMarks: 82,
      lastTest: 84,
      behavior: 'Very Good',
    },
    {
      id: 3,
      rollNo: '003',
      name: 'Vivaan Shah',
      phone: '+91 98765 41014',
      altPhone: '',
      email: 'vivaan@school.com',
      attendance: 85,
      avgMarks: 75,
      lastTest: 72,
      behavior: 'Good',
    },
  ],

  3: [
    {
      id: 1,
      rollNo: '001',
      name: 'Saanvi Gupta',
      phone: '+91 98765 42010',
      altPhone: '',
      email: 'saanvi@school.com',
      attendance: 92,
      avgMarks: 88,
      lastTest: 90,
      behavior: 'Excellent',
    },
    {
      id: 2,
      rollNo: '002',
      name: 'Advait Nair',
      phone: '+91 98765 42012',
      altPhone: '',
      email: 'advait@school.com',
      attendance: 90,
      avgMarks: 84,
      lastTest: 82,
      behavior: 'Very Good',
    },
    {
      id: 3,
      rollNo: '003',
      name: 'Myra Joshi',
      phone: '+91 98765 42014',
      altPhone: '',
      email: 'myra@school.com',
      attendance: 95,
      avgMarks: 91,
      lastTest: 93,
      behavior: 'Excellent',
    },
    {
      id: 4,
      rollNo: '004',
      name: 'Neil Verma',
      phone: '+91 98765 42016',
      altPhone: '',
      email: 'neil@school.com',
      attendance: 87,
      avgMarks: 80,
      lastTest: 78,
      behavior: 'Good',
    },
  ],

  4: [],
};

const INITIAL_RESOURCES = {
  1: [{ id: 1, name: 'Quadratic Equations Guide.pdf', chapter: 'Chapter 4: Quadratic Equations', type: 'PDF', size: '2.4 MB', views: 145, date: 'Nov 3, 2025' }],
  2: [], 3: [], 4: [],
};

const INITIAL_ASSIGNMENTS = {
  1: [{ id: 1, title: 'Algebra Problem Set', desc: 'Complete exercises 1-20', due: 'Nov 10, 2025', total: 35, submitted: 28 }],
  2: [], 3: [], 4: [],
};

const BEHAVIOR_OPTIONS = ['Excellent', 'Very Good', 'Good', 'Average', 'Needs Improvement'];
const RESOURCE_STATS_CONFIG = {
  PDF: {
    icon: FileText,
    variant: 'red',
    color: '#ef4444',
    background: '#fee2e2',
  },
  Video: {
    icon: Video,
    variant: 'blue',
    color: '#3b82f6',
    background: '#dbeafe',

  },
  Document: {
    icon: File,
    variant: 'violet',
    color: '#8b5cf6',
    background: '#f3e8ff',
  },

  Total: {
    icon: FolderOpen,
    variant: 'green',
    color: '#16a34a',
    background: '#dcfce7',
  },
};

const RESOURCE_TYPES = [
  'PDF',
  'Video',
  'Document',
  'Total',
];

const TABS = [
  { key: 'overview', icon: BarChart3, label: 'Overview' },
  { key: 'students', icon: Users, label: 'Students' },
  { key: 'attendance', icon: ClipboardCheck, label: 'Attendance' },
  { key: 'marks', icon: ClipboardList, label: 'Marks Entry' },
  { key: 'exams', icon: GraduationCapIcon, label: 'Exam Results' },
  { key: 'behavior', icon: Heart, label: 'Behavior' },
  { key: 'feedback', icon: MessageSquare, label: 'Feedback' },
  { key: 'resources', icon: FolderOpen, label: 'Resources' },
  { key: 'assignments', icon: FileText, label: 'Assignments' },
  // { key: 'evaluations', icon: Star, label: 'Evaluations' },
];

const TODAY_STR = '2026-04-13';

const attColor = (v) => v >= 90 ? '#22c55e' : v >= 80 ? '#f59e0b' : '#ef4444';
const marksColor = (v) => v >= 90 ? '#22c55e' : v >= 75 ? '#3b82f6' : '#ef4444';

const behaviorColor = (b) => {
  if (b === 'Excellent') return '#22c55e';
  if (b === 'Very Good') return '#3b82f6';
  if (b === 'Good') return '#a78bfa';
  return '#64748b';
};

// Helper functions
const calculateGrade = (percentage) => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 40) return 'D';
  return 'F';
};

const getGradeColor = (grade) => {
  if (grade === 'A+' || grade === 'A') return '#22c55e';
  if (grade === 'B+' || grade === 'B') return '#3b82f6';
  if (grade === 'C') return '#f59e0b';
  if (grade === 'D') return '#f97316';
  return '#ef4444';
};

// Mock data for exam results
const EXAM_RESULTS = [
  { subject: 'Mathematics', max: 100, classAvg: 78, highest: 96, lowest: 42, passPercentage: 85 },
  { subject: 'Science', max: 100, classAvg: 74, highest: 94, lowest: 38, passPercentage: 82 },
  { subject: 'English', max: 100, classAvg: 81, highest: 97, lowest: 55, passPercentage: 88 },
  { subject: 'Social Studies', max: 100, classAvg: 72, highest: 92, lowest: 40, passPercentage: 80 },
  { subject: 'Hindi', max: 100, classAvg: 76, highest: 95, lowest: 48, passPercentage: 84 },
];

const FEEDBACK_HISTORY = [
  { date: 'Apr 5, 2026', text: 'Excellent performance in recent tests. Keep up the good work!', studentId: 1 },
  { date: 'Mar 28, 2026', text: 'Needs more focus on Science. Recommend additional practice sessions.', studentId: 3 },
  { date: 'Mar 20, 2026', text: 'Great improvement in Mathematics. Behavior has also been exemplary.', studentId: 2 },
];

// ─── Modals ────────────────────────────────────────
const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div className="mc-overlay" onClick={onCancel} data-testid="teacher-confirm-modal">
    <div className="mc-modal mc-modal--sm" onClick={e => e.stopPropagation()}>
      <h3 className="mc-modal__title">Confirm Delete</h3>
      <p className="mc-modal__sub">{message}</p>
      <div className="mc-modal__footer">
        <button className="mc-btn mc-btn--gray" onClick={onCancel} data-testid="teacher-confirm-cancel">Cancel</button>
        <button className="mc-btn mc-btn--red" onClick={onConfirm} data-testid="teacher-confirm-delete">Delete</button>
      </div>
    </div>
  </div>
);

const EditStudentModal = ({ student, onSave, onClose }) => {
  const [form, setForm] = useState({ phone: student.phone, altPhone: student.altPhone, email: student.email, behavior: student.behavior });
  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));

  return (
    <div className="mc-overlay" onClick={onClose} data-testid="teacher-edit-student-modal">
      <div className="mc-modal" onClick={e => e.stopPropagation()}>
        <button className="mc-modal__close" onClick={onClose}>×</button>
        <h3 className="mc-modal__title">Edit Student</h3>
        <p className="mc-modal__sub">{student.name} · Roll No: {student.rollNo}</p>
        <div className="mc-form">
          <div className="mc-form__group"><label>Phone</label><input value={form.phone} onChange={e => set('phone', e.target.value)} data-testid="teacher-edit-phone" /></div>
          <div className="mc-form__group"><label>Alternate Phone</label><input value={form.altPhone} onChange={e => set('altPhone', e.target.value)} data-testid="teacher-edit-alt-phone" /></div>
          <div className="mc-form__group"><label>Email</label><input type="email" value={form.email} onChange={e => set('email', e.target.value)} data-testid="teacher-edit-email" /></div>
          <div className="mc-form__group"><label>Behavior</label>
            <select value={form.behavior} onChange={e => set('behavior', e.target.value)} data-testid="teacher-edit-behavior">
              {BEHAVIOR_OPTIONS.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
        </div>
        <div className="mc-modal__footer">
          <button className="mc-btn mc-btn--gray" onClick={onClose} data-testid="teacher-edit-cancel">Cancel</button>
          <button className="mc-btn mc-btn--blue" onClick={() => onSave(form)} data-testid="teacher-edit-save">Update</button>
        </div>
      </div>
    </div>
  );
};

const AddStudentModal = ({ onAdd, onClose }) => {
  const [form, setForm] = useState({ rollNo: '', name: '', phone: '', altPhone: '', email: '' });
  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleAdd = () => {
    if (!form.rollNo || !form.name) { alert('Roll No and Name are required'); return; }
    onAdd({ ...form, attendance: 100, avgMarks: 0, behavior: 'Good' });
    onClose();
  };

  return (
    <div className="mc-overlay" onClick={onClose} data-testid="teacher-add-student-modal">
      <div className="mc-modal" onClick={e => e.stopPropagation()}>
        <button className="mc-modal__close" onClick={onClose}>×</button>
        <h3 className="mc-modal__title">Add Student</h3>
        <p className="mc-modal__sub">Add a new student to this class</p>
        <div className="mc-form">
          {[['rollNo', 'Roll Number *'], ['name', 'Name *'], ['phone', 'Phone'], ['altPhone', 'Alternate Phone'], ['email', 'Email']].map(([k, l]) => (
            <div key={k} className="mc-form__group">
              <label>{l}</label>
              <input value={form[k]} onChange={e => set(k, e.target.value)} data-testid={`teacher-add-${k}`} />
            </div>
          ))}
        </div>
        <div className="mc-modal__footer">
          <button className="mc-btn mc-btn--gray" onClick={onClose} data-testid="teacher-add-cancel">Cancel</button>
          <button className="mc-btn mc-btn--blue" onClick={handleAdd} data-testid="teacher-add-save">Add Student</button>
        </div>
      </div>
    </div>
  );
};

const UploadResourceModal = ({ onUpload, onClose }) => {
  const [form, setForm] = useState({ name: '', chapter: '', type: '' });
  const [fileName, setFileName] = useState('');
  const fileRef = useRef(null);
  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleUpload = () => {
    if (!form.name || !form.type) { alert('Name and Type are required'); return; }
    onUpload({ ...form, size: fileName ? '1.0 MB' : '0 KB', views: 0, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) });
    onClose();
  };

  return (
    <div className="mc-overlay" onClick={onClose} data-testid="teacher-upload-resource-modal">
      <div className="mc-modal" onClick={e => e.stopPropagation()}>
        <button className="mc-modal__close" onClick={onClose}>×</button>
        <h3 className="mc-modal__title">Upload New Resource</h3>
        <p className="mc-modal__sub">Add a new teaching resource to your library</p>
        <div className="mc-form">
          <div className="mc-form__group"><label>Resource Name</label><input placeholder="e.g., Quadratic Equations Guide" value={form.name} onChange={e => set('name', e.target.value)} data-testid="teacher-res-name" /></div>
          <div className="mc-form__group"><label>Chapter</label><input placeholder="e.g., Chapter 4: Quadratic Equations" value={form.chapter} onChange={e => set('chapter', e.target.value)} data-testid="teacher-res-chapter" /></div>
          <div className="mc-form__group"><label>Resource Type</label>
            <select value={form.type} onChange={e => set('type', e.target.value)} data-testid="teacher-res-type">
              <option value="">Select type</option>
              {RESOURCE_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="mc-form__group">
            <label>Upload File</label>
            <div className="mc-upload-area" onClick={() => fileRef.current?.click()} data-testid="teacher-res-upload-area">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
              <p>{fileName || 'Click to upload or drag and drop'}</p>
              <small>PDF, Video, Image (Max 50MB)</small>
              <input ref={fileRef} type="file" hidden onChange={e => setFileName(e.target.files[0]?.name || '')} />
            </div>
          </div>
        </div>
        <div className="mc-modal__footer">
          <button className="mc-btn mc-btn--blue mc-btn--full" onClick={handleUpload} data-testid="teacher-res-upload-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /></svg>
            Upload Resource
          </button>
        </div>
      </div>
    </div>
  );
};

const CreateAssignmentModal = ({ onSave, onClose }) => {
  const [form, setForm] = useState({ title: '', due: '', desc: '' });
  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleSave = () => {
    if (!form.title || !form.due) { alert('Title and Deadline are required'); return; }
    onSave({ ...form, total: 0, submitted: 0 });
    onClose();
  };

  return (
    <div className="mc-overlay" onClick={onClose} data-testid="teacher-create-assignment-modal">
      <div className="mc-modal" onClick={e => e.stopPropagation()}>
        <button className="mc-modal__close" onClick={onClose}>×</button>
        <h3 className="mc-modal__title">Create New Assignment</h3>
        <p className="mc-modal__sub">Enter the details for the new assignment</p>
        <div className="mc-form">
          <div className="mc-form__group"><label>Assignment Title</label><input placeholder="e.g., Algebra Problem Set" value={form.title} onChange={e => set('title', e.target.value)} data-testid="teacher-assign-title" /></div>
          <div className="mc-form__group"><label>Deadline</label><input type="date" value={form.due} onChange={e => set('due', e.target.value)} data-testid="teacher-assign-due" /></div>
          <div className="mc-form__group"><label>Description</label><textarea placeholder="Assignment details and instructions..." value={form.desc} onChange={e => set('desc', e.target.value)} rows={4} data-testid="teacher-assign-desc" /></div>
        </div>
        <div className="mc-modal__footer">
          <button className="mc-btn mc-btn--blue mc-btn--full" onClick={handleSave} data-testid="teacher-assign-create-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /></svg>
            Create Assignment
          </button>
        </div>
      </div>
    </div>
  );
};

const ViewSubmissionsModal = ({
  assignment,
  students,
  onClose,
}) => {
  return (
    <div
      className="mc-overlay"
      onClick={onClose}
      data-testid="teacher-view-submissions-modal"
    >
      <div
        className="mc-modal mc-assignments-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mc-assignments-dialog__header">
          <div >
            <h3 className="mc-modal__title">
              Assignment Submissions
            </h3>

            <p className="mc-modal__sub">
              {assignment.title} ·
              {' '}
              {assignment.submitted}/
              {assignment.total}
              {' '}
              students submitted
            </p>

          </div>
          <div className="mc-modal__footer">
            <button
              className="mc-btn mc-btn--gray"
              onClick={onClose}
            >
              Close
            </button>

            <button className="mc-btn mc-btn--blue">
              Save Grades
            </button>
          </div>
        </div>

        <div className="mc-assignments-dialog__table-wrap">
          <table className="mc-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Status</th>
                <th>Submitted On</th>
                <th>Score</th>
                {/* <th>Actions</th> */}

              </tr>
            </thead>

            <tbody>
              {students.map((student, index) => {
                const submitted =
                  index < assignment.submitted;

                return (
                  <tr key={student.id}>
                    <td>{student.rollNo}</td>

                    <td className="mc-td-name">
                      {student.name}
                    </td>

                    <td>
                      <span
                        className={`mc-pill ${submitted
                          ? 'mc-pill--success'
                          : 'mc-pill--danger'
                          }`}
                      >
                        {submitted
                          ? 'Submitted'
                          : 'Pending'}
                      </span>
                    </td>

                    <td className="mc-td-date">
                      {submitted
                        ? '12 Jun 2026'
                        : '-'}
                    </td>

                    <td className="mc-td-score">
                      {submitted ? (
                        <input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="Enter Score"
                          className="mc-input-small"
                        />
                      ) : (
                        '-'
                      )}
                    </td>

                    {/* <td>
                      {submitted ? (
                        <div className="mc-students-actions">
                          <button className="mc-students-action-btn mc-students-action-btn--blue">
                            <Eye size={14} />
                          </button>

                          <button className="mc-students-action-btn mc-students-action-btn--blue">
                            <Download size={14} />
                          </button>
                        </div>
                      ) : (
                        <span className="mc-td-muted">
                          Not Submitted
                        </span>
                      )}
                    </td> */}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>


      </div>
    </div>
  );
};

// ─── Tab Components ─────────────────────────────────

const OverviewTab = ({ classId, students, resources }) => {
  const avgAtt = students.length ? Math.round(students.reduce((s, s2) => s + s2.attendance, 0) / students.length) : 0;
  const avgMarks = students.length ? Math.round(students.reduce((s, s2) => s + s2.avgMarks, 0) / students.length) : 0;
  const sorted = [...students].sort((a, b) => b.avgMarks - a.avgMarks);

  // Attendance distribution for pie chart
  const attDistribution = useMemo(() => {
    const excellent = students.filter(s => s.attendance >= 95).length;
    const good = students.filter(s => s.attendance >= 80 && s.attendance < 95).length;
    const needsImprovement = students.filter(s => s.attendance < 80).length;
    return [
      { name: 'Excellent (≥95%)', value: excellent, fill: '#10b981' },
      { name: 'Good (80-95%)', value: good, fill: '#3b82f6' },
      { name: 'Needs Improvement (<80%)', value: needsImprovement, fill: '#ef4444' },
    ].filter(d => d.value > 0);
  }, [students]);

  // Performance distribution for pie chart
  const perfDistribution = useMemo(() => {
    const excellent = students.filter(s => s.avgMarks >= 90).length;
    const good = students.filter(s => s.avgMarks >= 75 && s.avgMarks < 90).length;
    const needsImprovement = students.filter(s => s.avgMarks < 75).length;
    return [
      { name: 'Excellent (≥90%)', value: excellent, fill: '#8b5cf6' },
      { name: 'Good (75-90%)', value: good, fill: '#3b82f6' },
      { name: 'Needs Improvement (<75%)', value: needsImprovement, fill: '#f59e0b' },
    ].filter(d => d.value > 0);
  }, [students]);

  return (
    <div className="mc-tab-content" data-testid="teacher-tab-overview">
      <div className="mc-overview-metrics">
        {[
          {
            label: 'Total Students',
            value: students.length,
            icon: Users,
            variant: 'blue',
          },
          {
            label: 'Avg Attendance',
            value: `${avgAtt}%`,
            icon: TrendingUp,
            variant: 'emerald',
          },
          {
            label: 'Avg Performance',
            value: `${avgMarks}%`,
            icon: Award,
            variant: 'violet',
          },
          {
            label: 'Top Performer',
            value: `${Math.max(...students.map(s => s.avgMarks || 0))}%`,
            icon: Star,
            variant: 'amber',
          },
        ].map((m, i) => (
          <div
            key={i}
            className={`mc-metric-card mc-metric-card--${m.variant}`}
            data-testid={`teacher-metric-${i}`}
          >
            <div className="mc-metric-card__content">
              <div className="mc-metric-card__label">
                {m.label}
              </div>

              <div className="mc-metric-card__value">
                {m.value}
              </div>
            </div>

            <div
              className={`mc-metric-card__icon mc-metric-card__icon--${m.variant}`}
            >
              <m.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="mc-charts-grid">
        {/* Attendance Distribution */}
        {attDistribution.length > 0 && (
          <div
            className="mc-chart-card"
            data-testid="teacher-overview-attendance-chart"
          >
            <div className="mc-chart-card__header">
              <h3 className="mc-chart-card__title">
                Attendance Distribution
              </h3>
            </div>

            <div className="mc-chart-card__body">
              <div className="mc-chart-container">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={attDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) =>
                        `${name}: ${value}`
                      }
                      outerRadius={80}
                      dataKey="value"
                    >
                      {attDistribution.map((item, index) => (
                        <Cell
                          key={index}
                          fill={item.fill}
                        />
                      ))}
                    </Pie>


                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mc-chart-legend">
                {attDistribution.map((item, index) => (
                  <div
                    key={index}
                    className="mc-chart-legend__item"
                  >
                    <div className="mc-chart-legend__left">
                      <span
                        className="mc-chart-legend__dot"
                        style={{
                          backgroundColor: item.fill,
                        }}
                      />

                      <span className="mc-chart-legend__label">
                        {item.name}
                      </span>
                    </div>

                    <span className="mc-chart-legend__value">
                      {item.value} students
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Performance Distribution */}
        {perfDistribution.length > 0 && (
          <div
            className="mc-chart-card"
            data-testid="teacher-overview-performance-chart"
          >
            <div className="mc-chart-card__header">
              <h3 className="mc-chart-card__title">
                Performance Distribution
              </h3>
            </div>

            <div className="mc-chart-card__body">
              <div className="mc-chart-container">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={perfDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) =>
                        `${name}: ${value}`
                      }
                      outerRadius={80}
                      dataKey="value"
                    >
                      {perfDistribution.map((item, index) => (
                        <Cell
                          key={index}
                          fill={item.fill}
                        />
                      ))}
                    </Pie>


                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mc-chart-legend">
                {perfDistribution.map((item, index) => (
                  <div
                    key={index}
                    className="mc-chart-legend__item"
                  >
                    <div className="mc-chart-legend__left">
                      <span
                        className="mc-chart-legend__dot"
                        style={{
                          backgroundColor: item.fill,
                        }}
                      />

                      <span className="mc-chart-legend__label">
                        {item.name}
                      </span>
                    </div>

                    <span className="mc-chart-legend__value">
                      {item.value} students
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* <div className="mc-performers-section">
        <h3 className="mc-performers-title">🏆 Top Performers</h3>
        {sorted.slice(0, 5).map((s, i) => {
          const rankColors = ['#f59e0b', '#94a3b8', '#b45309'];
          return (
            <div key={s.id} className="mc-performer-item" data-testid={`teacher-overview-student-${s.id}`}>
              <div className="mc-performer-rank">#{i + 1}</div>
              <div className="mc-performer-info">
                <div className="mc-performer-name">{s.name}</div>
                <div className="mc-performer-score">Roll No: {s.rollNo}</div>
              </div>
              <div className="mc-performer-badge">{s.avgMarks}%</div>
            </div>
          );
        })}
        {students.length === 0 && <p className="mc-empty">No students in this class</p>}
      </div> */}
    </div>
  );
};

const StudentsTab = ({ classId, students, onUpdate }) => {
  const [search, setSearch] = useState('');
  const [perfFilter, setPerfFilter] = useState('all');
  const [editStudent, setEditStudent] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);

  const filtered = useMemo(() => {
    let result = students;
    const q = search.toLowerCase();
    result = result.filter(s => s.name.toLowerCase().includes(q) || s.rollNo.includes(q));
    if (perfFilter === 'excellent') result = result.filter(s => s.avgMarks >= 90);
    else if (perfFilter === 'good') result = result.filter(s => s.avgMarks >= 75 && s.avgMarks < 90);
    else if (perfFilter === 'needsHelp') result = result.filter(s => s.avgMarks < 75);
    return result;
  }, [students, search, perfFilter]);

  const handleEdit = (form) => {
    onUpdate(classId, students.map(s => s.id === editStudent.id ? { ...s, ...form } : s));
    setEditStudent(null);
  };

  const handleDelete = () => {
    onUpdate(classId, students.filter(s => s.id !== deleteId));
    setDeleteId(null);
  };

  const handleAdd = (data) => {
    const newS = { ...data, id: Date.now() };
    onUpdate(classId, [...students, newS]);
  };

  return (
    <div className="mc-tab-content" data-testid="teacher-tab-students">
      <div className="mc-students-header">
        <div className="mc-students-search">
          <div className="mc-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15" className="mc-search__icon"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input placeholder="Search by name or roll number..." value={search} onChange={e => setSearch(e.target.value)} className="mc-search__input" data-testid="teacher-students-search" />
          </div>
        </div>
        <div className="mc-students-filters">
          <button className={`mc-students-filter-btn ${perfFilter === 'all' ? 'mc-students-filter-btn--active' : ''}`} onClick={() => setPerfFilter('all')} data-testid="teacher-filter-all">All</button>
          <button className={`mc-students-filter-btn ${perfFilter === 'excellent' ? 'mc-students-filter-btn--active' : ''}`} onClick={() => setPerfFilter('excellent')} data-testid="teacher-filter-excellent">Excellent</button>
          <button className={`mc-students-filter-btn ${perfFilter === 'good' ? 'mc-students-filter-btn--active' : ''}`} onClick={() => setPerfFilter('good')} data-testid="teacher-filter-good">Good</button>
          <button className={`mc-students-filter-btn ${perfFilter === 'needsHelp' ? 'mc-students-filter-btn--active' : ''}`} onClick={() => setPerfFilter('needsHelp')} data-testid="teacher-filter-needs-help">Needs Attention</button>
        </div>

      </div>

      <div className="mc-students-table-wrap">
        <table className="mc-students-table" data-testid="teacher-students-table">
          <thead>
            <tr>
              <th>Roll No</th><th>Name</th><th>Attendance</th><th>Avg Marks</th><th>Last Test</th><th>Behavior</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} data-testid={`teacher-student-row-${s.id}`}>
                <td>{s.rollNo}</td>
                <td className="mc-students-name">{s.name}</td>

                <td><span className="mc-pill" style={{ background: attColor(s.attendance), color: '#fff' }}>{s.attendance}%</span></td>
                <td><span className="mc-pill" style={{ background: marksColor(s.avgMarks), color: '#fff' }}>{s.avgMarks}%</span></td>
                <td>
                  <span
                    className="mc-pill"
                    style={{
                      background: marksColor(s.lastTest),
                      color: '#fff',
                    }}
                  >
                    {s.lastTest}%
                  </span>
                </td>
                <td><span className="mc-pill" style={{ background: behaviorColor(s.behavior), color: '#fff' }}>{s.behavior}</span></td>
                <td>
                  <div className="mc-students-actions">
                    <button className="mc-students-action-btn mc-students-action-btn--blue" onClick={() => setViewStudent(s)} aria-label="View" data-testid={`teacher-view-btn-${s.id}`}><Eye size={12} /></button>
                    <button className="mc-students-action-btn mc-students-action-btn--blue" onClick={() => setEditStudent(s)} aria-label="Edit" data-testid={`teacher-edit-btn-${s.id}`}><Pencil size={12} /></button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="mc-empty">No students found</p>}
      </div>

      {viewStudent && (
        <div className="mc-overlay" onClick={() => setViewStudent(null)} data-testid="teacher-view-student-modal">
          <div className="mc-modal mc-students-dialog" onClick={e => e.stopPropagation()}>
            <button className="mc-modal__close" onClick={() => setViewStudent(null)}>×</button>
            <h3 className="mc-modal__title">{viewStudent.name}</h3>
            <p className="mc-modal__sub">Roll No: {viewStudent.rollNo}</p>
            <div className="mc-students-info-grid">
              <div className="mc-students-field">
                <label>Phone</label>
                <div className="mc-students-detail-card">{viewStudent.phone}</div>
              </div>
              <div className="mc-students-field">
                <label>Email</label>
                <div className="mc-students-detail-card">{viewStudent.email}</div>
              </div>
            </div>
            <div className="mc-students-detail-card">
              <div className="mc-students-detail-row">
                <span>Attendance</span>
                <span style={{ color: attColor(viewStudent.attendance) }}>{viewStudent.attendance}%</span>
              </div>
              <div className="mc-students-detail-row">
                <span>Average Marks</span>
                <span style={{ color: marksColor(viewStudent.avgMarks) }}>{viewStudent.avgMarks}%</span>
              </div>
              <div className="mc-students-detail-row">
                <span>Behavior</span>
                <span style={{ color: behaviorColor(viewStudent.behavior) }}>{viewStudent.behavior}</span>
              </div>
            </div>
            <div className="mc-modal__footer">
              <button className="mc-btn mc-btn--gray" onClick={() => setViewStudent(null)} data-testid="teacher-view-close">Close</button>
              <button className="mc-btn mc-btn--blue" onClick={() => { setViewStudent(null); setEditStudent(viewStudent); }} data-testid="teacher-view-edit">Edit</button>
            </div>
          </div>
        </div>
      )}

      {editStudent && <EditStudentModal student={editStudent} onSave={handleEdit} onClose={() => setEditStudent(null)} />}
      {deleteId && <ConfirmModal message="Are you sure you want to delete this student?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}
      {showAdd && <AddStudentModal onAdd={handleAdd} onClose={() => setShowAdd(false)} />}
    </div>
  );
};

const AttendanceTab = ({ classId, students }) => {
  const [date, setDate] = useState(TODAY_STR);
  const [attendance, setAttendance] = useState(() => {
    const init = {};
    students.forEach(s => { init[s.id] = 'present'; });
    return init;
  });

  useEffect(() => {
    const init = {};
    students.forEach(s => { init[s.id] = 'present'; });
    setAttendance(init);
  }, [classId, students]);

  const presentCount = useMemo(() => Object.values(attendance).filter(v => v === 'present').length, [attendance]);
  const absentCount = useMemo(() => Object.values(attendance).filter(v => v === 'absent').length, [attendance]);
  const leaveCount = useMemo(() => Object.values(attendance).filter(v => v === 'leave').length, [attendance]);
  const rate = students.length ? Math.round((presentCount / students.length) * 100) : 0;

  const toggle = useCallback((id, next) => setAttendance(p => ({ ...p, [id]: next })), []);
  const markAll = (val) => { const n = {}; students.forEach(s => { n[s.id] = val; }); setAttendance(n); };

  return (
    <div className="mc-tab-content" data-testid="teacher-tab-attendance">
      <div className="mc-att-date-row">
        <h5 className="mc-section-heading">Mark Attendance</h5>

        <div className="mc-att-date-left">
          <div className="mc-att-date-section">
            <label className="mc-att-date-label">Select Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="mc-date-input" data-testid="teacher-attendance-date" max={TODAY_STR} />

          </div>
          {/* <div>
            <span className="mc-att-date-text">{new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
          </div> */}
        </div>

        <div className="mc-att-actions">
          <button className="mc-btn mc-btn--outlined-green" onClick={() => markAll('present')} data-testid="teacher-mark-all-present">✓ All Present</button>
          <button className="mc-btn mc-btn--outlined-red" onClick={() => markAll('absent')} data-testid="teacher-mark-all-absent">✕ All Absent</button>
          <button className="mc-btn mc-btn--blue" data-testid="teacher-save-attendance"> <FileText size={12} />Save</button>
        </div>
      </div>

      {/* 
      <div className="mc-att-badge-legend">
        <div className="mc-att-badge mc-att-badge--present">
          <div className="mc-att-badge__indicator"></div>
          Present
        </div>
        <div className="mc-att-badge mc-att-badge--absent">
          <div className="mc-att-badge__indicator"></div>
          Absent
        </div>
        <div className="mc-att-badge mc-att-badge--leave">
          <div className="mc-att-badge__indicator"></div>
          On Leave
        </div>
      </div> */}

      {/* <div className="mc-att-rate-section">
        <div className="mc-att-rate-label"><span>Attendance Rate</span><span style={{ fontWeight: 700 }}>{rate}%</span></div>
        <div className="mc-att-rate-bar"><div className="mc-att-rate-fill" style={{ width: `${rate}%`, background: attColor(rate) }} /></div>
      </div> */}

      <div className="mc-att-table-section">

        <div className="mc-table-wrap">
          <table className="mc-table" data-testid="teacher-attendance-table">
            <thead>
              <tr><th>Roll No</th><th>Student Name</th> <th>Current%</th><th>Status</th><th>Remarks</th></tr>
            </thead>
            <tbody>
              {students.map(s => {
                const status = attendance[s.id] || 'present';
                const statusColors = { present: '#22c55e', absent: '#ef4444', leave: '#f59e0b' };
                const statusLabels = { present: 'Present', absent: 'Absent', leave: 'On Leave' };
                return (
                  <tr key={s.id} data-testid={`teacher-att-row-${s.id}`}>
                    <td>{s.rollNo}</td>
                    <td className="mc-td-name">{s.name}</td>
                    <td className='mc-td-current'> {s.currentAttendance}%</td>
                    <td>
                      <div className="mc-att-toggle-cell">
                        <button className={`mc-att-toggle-btn-cell mc-att-toggle-btn-cell--present ${status === 'present' ? 'mc-att-toggle-btn-cell--present' : ''}`} onClick={() => toggle(s.id, 'present')} data-testid={`teacher-att-present-${s.id}`} title="Mark Present">Present</button>
                        <button className={`mc-att-toggle-btn-cell mc-att-toggle-btn-cell--absent ${status === 'absent' ? 'mc-att-toggle-btn-cell--absent' : ''}`} onClick={() => toggle(s.id, 'absent')} data-testid={`teacher-att-absent-${s.id}`} title="Mark Absent">Absent</button>
                        <button className={`mc-att-toggle-btn-cell mc-att-toggle-btn-cell--leave ${status === 'leave' ? 'mc-att-toggle-btn-cell--leave' : ''}`} onClick={() => toggle(s.id, 'leave')} data-testid={`teacher-att-leave-${s.id}`} title="Mark Leave">On Leave</button>
                        <button className={`mc-att-toggle-btn-cell mc-att-toggle-btn-cell--late ${status === 'late' ? 'mc-att-toggle-btn-cell--late' : ''}`} onClick={() => toggle(s.id, 'late')} data-testid={`teacher-att-late-${s.id}`} title="Mark Late">Late</button>
                      </div>
                    </td>
                    <td><input type="text" placeholder="Optional" /></td>

                  </tr>
                );
              })}
            </tbody>
          </table>

        </div>
      </div>


      <div className="mc-att-summary-grid">
        {[
          { label: 'Total Students', value: students.length, color: '#6aa1fa', icon: Users, bg: '#e0f2fe' },
          { label: 'Present', value: presentCount, color: '#22c55e', icon: CheckCircle, bg: '#d1fae5' },
          { label: 'Absent', value: absentCount, color: '#ef4444', icon: XCircle, bg: '#fee2e2' },
          { label: 'On Leave', value: leaveCount, color: '#f59e0b', icon: Clock, bg: '#fef3c7' },
        ].map((m, i) => (
          <div key={i} className="mc-att-summary-card"
            data-testid={`teacher-att-summary-${i}`} style={{ background: m.bg }}>
            <div className="mc-att-summary-header"  >
              <div className="mc-att-summary-icon" style={{ color: m.color }}><m.icon size={20} /></div>
              <div className="mc-att-summary-label">{m.label}</div>
            </div>
            <div>
              <div className="mc-att-summary-value" style={{ color: m.color }}>{m.value}</div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ResourcesTab = ({ classId, className, resources, onUpdate }) => {
  const [showUpload, setShowUpload] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleUpload = (data) => {
    onUpdate(classId, [...resources, { id: Date.now(), ...data }]);
  };

  const handleDelete = () => {
    onUpdate(classId, resources.filter(r => r.id !== deleteId));
    setDeleteId(null);
  };

  const resourceStats = useMemo(() => {
    const counts = {};
    const views = {};

    RESOURCE_TYPES.forEach((t) => {
      counts[t] = 0;
      views[t] = 0;
    });

    resources.forEach((r) => {
      if (counts[r.type] !== undefined) {
        counts[r.type]++;
      }

      if (views[r.type] !== undefined) {
        views[r.type] += r.views || 0;
      }
    });

    counts.Total = resources.length;

    return { counts, views };
  }, [resources]);

  return (
    <div className="mc-tab-content" data-testid="teacher-tab-resources">
      <div className="mc-resources-header">
        <div>
          <h2 className="mc-section-heading">Teaching Resources</h2>
          <p className="mc-section-hint">for {className}</p>
        </div>
        <button className="mc-btn mc-btn--blue  mc-btn-upload"
          onClick={() => setShowUpload(true)}
          data-testid="teacher-upload-resource-btn">+ Upload Resource</button>
      </div>

      <div className="mc-resources-stats-grid">
        {RESOURCE_TYPES.map((type) => {
          const config = RESOURCE_STATS_CONFIG[type];
          const Icon = config.icon;

          return (
            <div
              key={type}
              className={`mc-resources-stat-card mc-resources-stat-card--${config.variant}`}
              data-testid={`teacher-resource-stat-${type}`}
              style={{ background: config.background }}
            >
              <div className="mc-resources-stat-left">
                <div
                  className={`mc-resources-stat-icon mc-resources-stat-icon--${config.variant}`}
                  style={{ color: config.color }}
                >
                  <Icon size={20} />
                </div>

                <div className="mc-resources-stat-label"
                  style={{ color: config.color }}>
                  {type === 'Total'
                    ? 'Total Resources'
                    : `${type} Files`}
                </div>
              </div>

              <div className="mc-resources-stat-value"
                style={{ color: config.color }}>
                {resourceStats.counts[type]}
              </div>
            </div>
          );
        })}
      </div>

      {resources.length === 0 ? (
        <p className="mc-empty">No resources uploaded yet. Click "Upload Resource" to get started.</p>
      ) : (
        <div className="mc-resources-table">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', borderBottom: '1.5px solid #e2e8f0' }}>File Name</th>
                <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', borderBottom: '1.5px solid #e2e8f0' }}>Type</th>
                <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', borderBottom: '1.5px solid #e2e8f0' }}>Size</th>
                <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', borderBottom: '1.5px solid #e2e8f0' }}>Views</th>
                <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', borderBottom: '1.5px solid #e2e8f0' }}>Date</th>
                <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', borderBottom: '1.5px solid #e2e8f0' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map(r => (
                <tr key={r.id} data-testid={`teacher-resource-${r.id}`} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>{r.name}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span className={`mc-resources-type-badge mc-resources-type-badge--${r.type.toLowerCase()}`}>
                      {r.type}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#64748b', fontSize: '0.875rem' }}>{r.size}</td>
                  <td style={{ padding: '0.875rem 1rem', color: '#64748b', fontSize: '0.875rem' }}>{r.views}</td>
                  <td style={{ padding: '0.875rem 1rem', color: '#64748b', fontSize: '0.875rem' }}>{r.date}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>

                      <button className="mc-res-action-btn" data-testid={`teacher-resource-share-${r.id}`}><Eye size={16} /></button>
                      <button className="mc-res-action-btn mc-res-action-btn--red" onClick={() => setDeleteId(r.id)} data-testid={`teacher-resource-delete-${r.id}`}><Trash size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showUpload && <UploadResourceModal onUpload={handleUpload} onClose={() => setShowUpload(false)} />}
      {deleteId && <ConfirmModal message="Delete this resource?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}
    </div>
  );
};

const AssignmentsTab = ({ classId, className, assignments, students, onUpdate }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [viewAssignment, setViewAssignment] = useState(null);

  const handleSave = (data) => {
    onUpdate(classId, [...assignments, { id: Date.now(), ...data, submitted: 0, total: 0 }]);
  };

  const handleDelete = () => {
    onUpdate(classId, assignments.filter(a => a.id !== deleteId));
    setDeleteId(null);
  };

  const pct = (a) => a.total ? Math.round((a.submitted / a.total) * 100) : 0;

  const ASSIGNMENT_STATS_CONFIG = [
    {
      key: 'total',
      label: 'Total Assignments',
      icon: FileText,
      color: '#3b82f6',
      background: '#dbeafe',
      variant: 'blue',
    },
    {
      key: 'completed',
      label: 'Fully Submitted',
      icon: CheckCircle,
      color: '#22c55e',
      background: '#dcfce7',
      variant: 'green',
    },
    {
      key: 'avgCompletion',
      label: 'Avg Completion',
      icon: TrendingUp,
      color: '#8b5cf6',
      background: '#ede9fe',
      variant: 'violet',
      suffix: '%',
    },
    {
      key: 'totalSubmitted',
      label: 'Total Submitted',
      icon: Users,
      color: '#f59e0b',
      background: '#fef3c7',
      variant: 'amber',
    },
  ];

  const assignmentStats = useMemo(() => ({
    total: assignments.length,
    completed: assignments.filter(a => pct(a) === 100).length,
    avgCompletion: assignments.length ? Math.round(assignments.reduce((s, a) => s + pct(a), 0) / assignments.length) : 0,
    totalSubmitted: assignments.reduce((s, a) => s + (a.submitted || 0), 0),
  }), [assignments]);

  return (
    <div className="mc-tab-content" data-testid="teacher-tab-assignments">
      <div className="mc-assignments-header">
        <div>
          <h2 className="mc-section-heading">Assignments</h2>
          <p className="mc-section-hint">Create and manage assignments for {className}</p>
        </div>
        <button className="mc-btn mc-btn--blue" onClick={() => setShowCreate(true)} data-testid="teacher-create-assignment-btn">+ Create Assignment</button>
      </div>

      <div className="mc-assignments-stats-grid">
        {ASSIGNMENT_STATS_CONFIG.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.key}
              className={`mc-assignments-stat-card mc-assignments-stat-card--${stat.variant}`}
              style={{ background: stat.background }}
              data-testid={`teacher-assign-${stat.key}`}
            >
              <div className="mc-assignments-stat-content">
                <div
                  className={`mc-assignments-stat-icon mc-assignments-stat-icon--${stat.variant}`}
                  style={{ color: stat.color }}
                >
                  <Icon size={20} />
                </div>

                <div
                  className="mc-assignments-stat-label"
                  style={{ color: stat.color }}
                >
                  {stat.label}
                </div>
              </div>

              <div
                className="mc-assignments-stat-value"
                style={{ color: stat.color }}
              >
                {assignmentStats[stat.key]}
                {stat.suffix || ''}
              </div>
            </div>
          );
        })}
      </div>

      {assignments.length === 0 ? (
        <p className="mc-empty">No assignments yet. Click "Create Assignment" to get started.</p>
      ) : (
        <div className="mc-assignments-list">
          {assignments.map((a) => {
            const progress = pct(a);
            const isOverdue = new Date(a.due) < new Date();

            return (
              <div
                key={a.id}
                className="mc-assignments-card"
                data-testid={`teacher-assignment-${a.id}`}
              >
                <div className="mc-assignments-card-icon">
                  <BookText size={24} />
                </div>

                <div className="mc-assignments-card-content">
                  <div className="mc-assignments-card-header">
                    <div>
                      <h4 className="mc-assignments-card-title">
                        {a.title}
                      </h4>

                      <p className="mc-assignments-card-desc">
                        {a.desc}
                      </p>
                    </div>

                    <span
                      className={`mc-assignments-status-badge ${isOverdue
                        ? 'mc-assignments-status-badge--overdue'
                        : 'mc-assignments-status-badge--active'
                        }`}
                    >
                      {isOverdue ? 'Overdue' : 'Active'}
                    </span>
                  </div>

                  <div className="mc-assignments-meta-grid">

                    <div className="mc-assignments-meta-item">
                      <span>Subject</span>
                      <p>{a.subject} Mathematics</p>
                    </div>
                    <div className="mc-assignments-meta-item">
                      <span>Due Date</span>
                      <p>{a.due}</p>
                    </div>

                    <div className="mc-assignments-meta-item">
                      <span>Marks</span>
                      <p>20</p>
                    </div>



                    <div className="mc-assignments-meta-item">
                      <span>Submissions</span>
                      <p>
                        {a.submitted}/{a.total}
                      </p>
                    </div>


                  </div>

                  {a.total > 0 && (
                    <div className="mc-assignments-progress-wrap">
                      <div className="mc-assignments-progress-label">
                        <span>Completion Rate</span>
                        <span>{progress}%</span>
                      </div>

                      <div className="mc-assignments-progress-bar">
                        <div
                          className="mc-assignments-progress-fill"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="mc-assignments-actions">
                    <button
                      className="mc-btn mc-btn--gray"
                      onClick={() => setViewAssignment(a)}
                      data-testid={`teacher-view-assignment-${a.id}`}
                    >
                      <Eye size={16} />
                      View
                    </button>

                    <button className="mc-btn mc-btn--gray">
                      <Edit size={16} />
                      Edit
                    </button>


                    <button
                      className="mc-btn mc-btn--red"
                      onClick={() => setDeleteId(a.id)}
                      data-testid={`teacher-delete-assignment-${a.id}`}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewAssignment && (
        <ViewSubmissionsModal
          assignment={viewAssignment}
          students={students}
          onClose={() => setViewAssignment(null)}
        />
      )}
      {showCreate && <CreateAssignmentModal onSave={handleSave} onClose={() => setShowCreate(false)} />}
      {deleteId && <ConfirmModal message="Delete this assignment?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}
    </div>
  );
};

// ─── Marks Entry Tab ─────────────────────────────────
const MarksTab = ({ classId, students, marksExamType, setMarksExamType, marksSubject, setMarksSubject, marksDate, setMarksDate, marksTotalMarks, setMarksTotalMarks, marksData, setMarksData }) => {
  const handleMarksChange = (studentId, marks, totalMarks) => {
    setMarksData(prev => ({ ...prev, [studentId]: { marks, totalMarks } }));
  };

  const calculatePercentage = (marks, total) => {
    return total > 0 ? ((marks / total) * 100).toFixed(1) : 0;
  };

  return (
    <div className="mc-tab-content" data-testid="teacher-tab-marks">
      <div className="my-classes__marks-container">
        <div className="mc-tab-header-row">
          <div>
            <h2 className="mc-tab-title">Marks Entry</h2>
            <p className="mc-tab-sub">Enter marks and grades will be calculated automatically</p>
          </div>
        </div>

        {/* Exam Details */}
        <div className="my-classes__exam-details">
          <div className="mc-form__group">
            <label>Exam Type</label>
            <select value={marksExamType} onChange={e => setMarksExamType(e.target.value)} data-testid="teacher-marks-exam-type">
              <option value="unit-test">Unit Test</option>
              <option value="mid-term">Mid Term</option>
              <option value="final">Final Exam</option>
            </select>
          </div>
          <div className="mc-form__group">
            <label>Subject</label>
            <select value={marksSubject} onChange={e => setMarksSubject(e.target.value)} data-testid="teacher-marks-subject">
              <option value="mathematics">Mathematics</option>
              <option value="science">Science</option>
              <option value="english">English</option>
            </select>
          </div>
          <div className="mc-form__group">
            <label>Date</label>
            <input type="date" value={marksDate} onChange={e => setMarksDate(e.target.value)} data-testid="teacher-marks-date" />
          </div>
          <div className="mc-form__group">
            <label>Total Marks</label>
            <input type="number" value={marksTotalMarks} onChange={e => setMarksTotalMarks(Number(e.target.value))} data-testid="teacher-marks-total" />
          </div>
        </div>

        {/* Marks Table */}
        <div className="my-classes__marks-table">
          <table className="mc-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Marks Obtained</th>
                <th>Total Marks</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => {
                const sm = marksData[s.id] || { marks: 0, totalMarks: marksTotalMarks };
                const pct = sm.totalMarks > 0 ? (sm.marks / sm.totalMarks) * 100 : 0;
                const grade = calculateGrade(pct);
                return (
                  <tr key={s.id} data-testid={`teacher-marks-row-${s.id}`}>
                    <td>{s.rollNo}</td>
                    <td className="mc-td-name">{s.name}</td>
                    <td className="mc-td-score"><input type="number" min="0" max={sm.totalMarks} value={sm.marks || ''} onChange={e => handleMarksChange(s.id, Number(e.target.value), sm.totalMarks)} className="mc-input-small" data-testid={`teacher-marks-obtained-${s.id}`} /></td>
                    <td className="mc-td-score"><input type="number" min="1" value={sm.totalMarks || ''} onChange={e => handleMarksChange(s.id, sm.marks, Number(e.target.value))} className="mc-input-small" data-testid={`teacher-marks-total-${s.id}`} /></td>
                    <td className="mc-td-pct"><span className="mc-pct">{calculatePercentage(sm.marks, sm.totalMarks)}%</span></td>
                    <td className="mc-td-grade"><span className="mc-pill" style={{ background: getGradeColor(grade), color: '#fff' }}>{grade}</span></td>
                    <td className="mc-td-remarks"><input type="text" placeholder="Optional" className="mc-input-small" data-testid={`teacher-marks-remarks-${s.id}`} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="my-classes__marks-summary">
          <span>Total Students: <strong>{students.length}</strong></span>
          <button className="mc-btn mc-btn--blue" data-testid="teacher-marks-save">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /></svg>
            Save All Marks
          </button>
        </div>
      </div>
    </div>
  );
};

// Exam Results Tab
const ExamsTab = ({ students }) => {
  return (
    <div className="mc-tab-content" data-testid="teacher-tab-exams">
      <div className="my-classes__exam-header">
        <div>
          <h2 className="mc-tab-title">Exam Results Analysis</h2>
          <p className="mc-tab-sub">View and analyze exam performance</p>
        </div>
        <span className="mc-pill" style={{ background: '#22c55e', color: '#fff' }}>📋 Latest Results</span>
      </div>

      {/* Class Performance Summary */}
      <div className="my-classes__results-summary">
        {resultStats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <div
              key={index}
              className={`my-classes__results-card my-classes__results-card--${stat.variant}`}
              data-testid={`teacher-results-stat-${index}`}
            >
              <div>
                <div
                  className={`my-classes__results-icon my-classes__results-icon--${stat.variant}`}
                >
                  <Icon size={24} />
                </div>

                <div className="my-classes__results-label">
                  {stat.label}
                </div>
              </div>

              <div className="my-classes__results-content">


                <div className="my-classes__results-value">
                  {stat.value}
                </div>
              </div>


            </div>
          );
        })}
      </div>

      {/* Individual Student Results */}
      <div className="mc-table-wrap">
        <table className="mc-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Roll No</th>
              <th>Student Name</th>
              <th>Total Marks</th>
              <th>Percentage</th>
              <th>Grade</th>
              <th>Rank Change</th>
            </tr>
          </thead>
          <tbody>
            {[...students].sort((a, b) => b.avgMarks - a.avgMarks).map((s, i) => {
              const pct = s.avgMarks;
              const grade = calculateGrade(pct);
              const change = Math.random() > 0.5 ? '+2' : '-1';
              return (
                <tr key={s.id} data-testid={`teacher-exam-result-${s.id}`}>
                  <td><span className="mc-pill" style={{ background: i < 3 ? '#fef3c7' : '#f1f5f9', color: i < 3 ? '#92400e' : '#374151' }}>#{i + 1}</span></td>
                  <td>{s.rollNo}</td>
                  <td className="mc-td-name">{s.name}</td>
                  <td>{s.lastTest || s.avgMarks}/100</td>
                  <td><span style={{ fontWeight: 700, color: marksColor(pct) }}>{pct}%</span></td>
                  <td><span className="mc-pill" style={{ background: getGradeColor(grade), color: '#fff' }}>{grade}</span></td>
                  <td><span style={{ color: change.startsWith('+') ? '#22c55e' : '#ef4444', fontWeight: 600 }}>{change}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Behavior Tab
const BehaviorTab = ({ students, behaviorNotes, setBehaviorNotes }) => {
  const [studentBehaviors, setStudentBehaviors] = useState(() => {
    const init = {};
    students.forEach(s => { init[s.id] = s.behavior; });
    return init;
  });

  const excellentCount = students.filter(s => studentBehaviors[s.id] === 'Excellent').length;
  const goodCount = students.filter(s => studentBehaviors[s.id] === 'Very Good' || studentBehaviors[s.id] === 'Good').length;
  const needsCount = students.filter(s => studentBehaviors[s.id] === 'Average' || studentBehaviors[s.id] === 'Needs Improvement').length;
  const behaviorStats = [
    {
      label: 'Excellent Behavior',
      value: excellentCount,
      icon: Award,
      variant: 'green',
      color: '#22c55e',
      background: '#d1fae5',
    },
    {
      label: 'Good Behavior',
      value: goodCount,
      icon: ThumbsUp,
      variant: 'blue',
      color: '#3b82f6',
      background: '#dbeafe',
    },
    {
      label: 'Needs Attention',
      value: needsCount,
      icon: AlertTriangle,
      variant: 'amber',
      color: '#f59e0b',
      background: '#fef3c7',
    },
  ];

  return (
    <div className="mc-tab-content" data-testid="teacher-tab-behavior">
      <div className="mc-behavior-summary-grid">
        {behaviorStats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <div
              key={index}
              className={`mc-behavior-stat-card mc-behavior-stat-card--${stat.variant}`}
              data-testid={`teacher-behavior-stat-${index} `}
              style={{ background: stat.background }}
            >
              <div className="mc-behavior-stat-content " >

                <div
                  className={`mc-behavior-stat-icon mc-behavior-stat-icon--${stat.variant}`}
                  style={{ color: stat.color }}
                >
                  <Icon size={20} />
                </div>

                <div className="mc-behavior-stat-label" style={{ color: stat.color }}>
                  {stat.label}
                </div>
              </div>

              <div className="mc-behavior-stat-value " style={{ color: stat.color }}>
                {stat.value}

              </div>
            </div>
          );
        })}
      </div>

      <div className="mc-att-table-section">
        <div className="mc-tab-header-row">
          <div className="mc-tab-header-row">
            <h3 className="mc-section-heading">Update Student Behavior</h3>
            <p className="mc-section-hint">Select behavior status and add notes for each student</p>
          </div>
          <div className="mc-save-button">
            <button className="mc-btn mc-btn--blue mc-btn--save" >
              Save
            </button>
          </div>
        </div>
        <div className="mc-table-wrap">
          <table className="mc-table" data-testid="teacher-behavior-table">
            <thead>
              <tr><th>Roll No</th><th>Student Name</th><th>Current Behavior</th><th>Update Behavior</th><th>Remarks</th></tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id} data-testid={`teacher-behavior-row-${s.id}`}>
                  <td>{s.rollNo}</td>
                  <td className="mc-td-name">{s.name}</td>
                  <td><span className="mc-pill" style={{ background: behaviorColor(studentBehaviors[s.id]), color: '#fff' }}>{studentBehaviors[s.id]}</span></td>
                  <td>
                    <select
                      value={studentBehaviors[s.id]}
                      onChange={e => setStudentBehaviors(p => ({ ...p, [s.id]: e.target.value }))}
                      className="mc-behavior-dropdown"
                      data-testid={`teacher-behavior-select-${s.id}`}
                    >
                      {BEHAVIOR_OPTIONS.map(b => <option key={b}>{b}</option>)}
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Add notes..."
                      value={behaviorNotes[s.id] || ''}
                      onChange={e => setBehaviorNotes(p => ({ ...p, [s.id]: e.target.value }))}
                      className="mc-search__input"
                      data-testid={`teacher-behavior-notes-${s.id}`}
                      style={{ padding: '0.575rem 0.875rem', border: '1.5px solid #e2e8f0', borderRadius: '9px', width: '100%', fontSize: '0.875rem' }}
                    />
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Feedback Tab
const FeedbackTab = ({ students, feedbackData, setFeedbackData, feedbackSentiment, setFeedbackSentiment }) => {
  return (
    <div className="mc-tab-content" data-testid="teacher-tab-feedback">
      <div className="mc-tab-header-row">
        <div>
          <h2 className="mc-tab-title">Student Feedback</h2>
          <p className="mc-tab-sub">Provide personalized feedback to students</p>
        </div>
      </div>

      <div className="my-classes__feedback-container">
        {students.map(s => (
          <div key={s.id} className="my-classes__feedback-card" data-testid={`teacher-feedback-card-${s.id}`}>
            <div className="my-classes__feedback-header">
              <div className="my-classes__feedback-avatar">{s.rollNo.slice(-2)}</div>
              <div className="my-classes__feedback-student-info">
                <p className="my-classes__feedback-student-name">{s.name}</p>
                <p className="mc-td-muted">Roll No: {s.rollNo}</p>
                <div className="my-classes__feedback-badges">
                  <span className="mc-pill mc-pill--sm" style={{ fontSize: '0.75rem' }}>Attendance: {s.attendance}%</span>
                  <span className="mc-pill mc-pill--sm" style={{ fontSize: '0.75rem' }}>Performance: {s.avgMarks}%</span>
                </div>
              </div>
            </div>
            <div className="my-classes__feedback-form">
              <textarea
                placeholder="Write feedback for this student..."
                className="my-classes__feedback-textarea"
                rows="3"
                value={feedbackData[s.id] || ''}
                onChange={e => setFeedbackData(p => ({ ...p, [s.id]: e.target.value }))}
                data-testid={`teacher-feedback-textarea-${s.id}`}
              />
              <div className="my-classes__feedback-controls">
                <select
                  className="my-classes__feedback-sentiment"
                  value={feedbackSentiment[s.id] || 'positive'}
                  onChange={e => setFeedbackSentiment(p => ({ ...p, [s.id]: e.target.value }))}
                  data-testid={`teacher-feedback-sentiment-${s.id}`}
                >
                  <option value="positive">👍 Positive</option>
                  <option value="neutral">➖ Neutral</option>
                  <option value="needs-improvement">⚠️ Needs Improvement</option>
                </select>
                <div className="my-classes__feedback-actions">
                  <button className="mc-btn mc-btn--sm" data-testid={`teacher-feedback-send-${s.id}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
                    Send to Parent
                  </button>
                  <button className="mc-btn mc-btn--sm mc-btn--blue" data-testid={`teacher-feedback-save-${s.id}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /></svg>
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EVAL_ACADEMIC = ['Attendance', 'Assignments', 'Exams', 'Projects'];
const EVAL_BEHAVIOR = ['Punctuality', 'Participation', 'Team Skills', 'Leadership', 'Discipline'];

const EvaluationsTab = ({ classId, students }) => {
  const [idx, setIdx] = useState(0);
  const [evals, setEvals] = useState({});
  const [star, setStar] = useState({});
  const [feedback, setFeedback] = useState({});

  if (students.length === 0) return <div className="mc-tab-content mc-empty">No students</div>;

  const s = students[idx];
  const sid = s.id;
  const ev = evals[sid] || {};
  const getV = (f) => ev[f] ?? 80;
  const setV = (f, v) => setEvals(p => ({ ...p, [sid]: { ...(p[sid] || {}), [f]: Number(v) } }));

  const fb = feedback[sid] || '';
  const st = star[sid] || 0;

  return (
    <div className="mc-tab-content mc-eval-content" data-testid="teacher-tab-evaluations">
      <div className="mc-eval-main">
        <h2 className="mc-eval-title">Student Evaluations</h2>
        <p className="mc-eval-sub">Evaluate student performance comprehensively</p>

        <div className="mc-eval-layout">
          {/* Student card */}
          <div className="mc-eval-student-card">
            <div className="mc-eval-student-avatar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="40" height="40" color="rgba(255,255,255,0.8)"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg></div>
            <div className="mc-eval-student-name">{s.name}</div>
            <div className="mc-eval-student-roll">Roll No: {s.rollNo}</div>
            <div className="mc-eval-student-info">
              <div><span>Attendance</span><span>{s.attendance}%</span></div>
              <div><span>Avg Marks</span><span>{s.avgMarks}%</span></div>
              <div><span>Last Test</span><span>98%</span></div>
              <div><span>Behavior</span><span className="mc-pill mc-pill--sm" style={{ background: behaviorColor(s.behavior), color: '#fff' }}>{s.behavior}</span></div>
            </div>
            <div className="mc-eval-nav">
              <button className="mc-eval-nav-btn" onClick={() => setIdx(p => Math.max(0, p - 1))} disabled={idx === 0} data-testid="teacher-eval-prev">‹ Previous</button>
              <span>{idx + 1} / {students.length}</span>
              <button className="mc-eval-nav-btn" onClick={() => setIdx(p => Math.min(students.length - 1, p + 1))} disabled={idx === students.length - 1} data-testid="teacher-eval-next">Next ›</button>
            </div>
          </div>

          {/* Evaluation form */}
          <div className="mc-eval-form">
            <h3 className="mc-eval-form-title">Performance Evaluation</h3>
            <p className="mc-eval-form-sub">Comprehensive assessment of student performance</p>

            <div className="mc-eval-section">
              <div className="mc-eval-section-head"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg> Academic Performance</div>
              {EVAL_ACADEMIC.map(f => (
                <div key={f} className="mc-eval-metric">
                  <div className="mc-eval-metric__label"><span>{f}</span><span>{getV(f)}%</span></div>
                  <input type="range" min="0" max="100" value={getV(f)} onChange={e => setV(f, e.target.value)} className="mc-range" data-testid={`teacher-eval-${f.toLowerCase()}`} />
                </div>
              ))}
            </div>

            <div className="mc-eval-section">
              <div className="mc-eval-section-head"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" /></svg> Behavioral Assessment</div>
              {EVAL_BEHAVIOR.map(f => (
                <div key={f} className="mc-eval-metric">
                  <div className="mc-eval-metric__label"><span>{f}</span><span>{getV(f)}%</span></div>
                  <input type="range" min="0" max="100" value={getV(f)} onChange={e => setV(f, e.target.value)} className="mc-range" data-testid={`teacher-eval-behav-${f.toLowerCase().replace(' ', '-')}`} />
                </div>
              ))}
            </div>

            <div className="mc-eval-section">
              <div className="mc-eval-metric__label" style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Teacher&apos;s Feedback</div>
              <textarea className="mc-eval-feedback" placeholder="Write your comments and suggestions for the student..." value={fb} onChange={e => setFeedback(p => ({ ...p, [sid]: e.target.value }))} rows={4} data-testid="teacher-eval-feedback" />
            </div>

            <div className="mc-eval-section">
              <div className="mc-eval-metric__label" style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Overall Rating</div>
              <div className="mc-eval-stars">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} className={`mc-star${st >= n ? ' mc-star--active' : ''}`} onClick={() => setStar(p => ({ ...p, [sid]: n }))} data-testid={`teacher-eval-star-${n}`}>★</button>
                ))}
              </div>
            </div>

            <button className="mc-btn mc-btn--blue mc-btn--full" data-testid="teacher-eval-save">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /></svg>
              Save Evaluation &amp; Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ─────────────────────────────────
const MyClasses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedClassId = parseInt(searchParams.get('classId')) || 1;
  const activeTab = searchParams.get('tab') || 'overview';
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [allStudents, setAllStudents] = useState(INITIAL_STUDENTS);
  const [allResources, setAllResources] = useState(INITIAL_RESOURCES);
  const [allAssignments, setAllAssignments] = useState(INITIAL_ASSIGNMENTS);

  // New state for marks, behavior, feedback tabs
  const [marksExamType, setMarksExamType] = useState('unit-test');
  const [marksSubject, setMarksSubject] = useState('mathematics');
  const [marksDate, setMarksDate] = useState(new Date().toISOString().split('T')[0]);
  const [marksTotalMarks, setMarksTotalMarks] = useState(100);
  const [marksData, setMarksData] = useState({});
  const [behaviorNotes, setBehaviorNotes] = useState({});
  const [feedbackData, setFeedbackData] = useState({});
  const [feedbackSentiment, setFeedbackSentiment] = useState({});

  const dropRef = useRef(null);

  const selectedClass = CLASSES.find(c => c.id === selectedClassId);
  const students = allStudents[selectedClassId] || [];
  const resources = allResources[selectedClassId] || [];
  const assignments = allAssignments[selectedClassId] || [];

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleClassChange = (id) => {
    setSearchParams({ classId: id.toString(), tab: 'overview' });
    setDropdownOpen(false);
  };

  const handleTabChange = (tabKey) => {
    setSearchParams({ classId: selectedClassId.toString(), tab: tabKey });
  };

  const updateStudents = (cid, val) => setAllStudents(p => ({ ...p, [cid]: val }));
  const updateResources = (cid, val) => setAllResources(p => ({ ...p, [cid]: val }));
  const updateAssignments = (cid, val) => setAllAssignments(p => ({ ...p, [cid]: val }));

  const regularClasses = CLASSES.filter(c => !c.isClassTeacher);
  const classTeacherClass = CLASSES.filter(c => c.isClassTeacher);

  return (
    <div className="mc-page" data-testid="teacher-page-my-classes">
      {/* Header */}
      <div className="mc-header" data-testid="teacher-my-classes-header">
        <div className="mc-header__left">
          <div className="mc-header__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg></div>
          <div>
            <h1 className="mc-header__title">My Classes</h1>
            <p className="mc-header__sub">Manage your classes, students, and teaching materials</p>
          </div>
        </div>

        {/* Class Dropdown */}
        <div className="mc-class-dropdown" ref={dropRef}>
          <button className="mc-class-dropdown__btn" onClick={() => setDropdownOpen(p => !p)} data-testid="teacher-class-dropdown-btn">
            <span className="mc-class-dot" style={{ background: selectedClass?.color }} />
            {selectedClass?.name} – {selectedClass?.subject}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="6 9 12 15 18 9" /></svg>
          </button>
          {dropdownOpen && (
            <div className="mc-class-dropdown__menu" data-testid="teacher-class-dropdown-menu">
              {regularClasses.map(c => (
                <button key={c.id} className={`mc-class-dropdown__item${c.id === selectedClassId ? ' active' : ''}`} onClick={() => handleClassChange(c.id)} data-testid={`teacher-class-option-${c.id}`}>
                  <span className="mc-class-dot" style={{ background: c.color }} />
                  {c.name} – {c.subject}
                  {c.id === selectedClassId && <svg className="mc-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="20 6 9 17 4 12" /></svg>}
                </button>
              ))}
              {classTeacherClass.length > 0 && (
                <>
                  <div className="mc-class-dropdown__divider">Class Teacher</div>
                  {classTeacherClass.map(c => (
                    <button key={c.id} className={`mc-class-dropdown__item${c.id === selectedClassId ? ' active' : ''}`} onClick={() => handleClassChange(c.id)} data-testid={`teacher-class-option-${c.id}`}>
                      <span className="mc-class-dot" style={{ background: c.color }} />
                      {c.subject}
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tab bar */}
      <div className="mc-tabs" data-testid="teacher-my-classes-tabs">
        {TABS.map((t) => {
          const Icon = t.icon;

          return (
            <button
              key={t.key}
              className={`mc-tab${activeTab === t.key ? ' active' : ''}`}
              onClick={() => handleTabChange(t.key)}
              data-testid={`teacher-tab-btn-${t.key}`}
            >
              <span className="mc-tab__icon">
                <Icon size={18} />
              </span>
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="mc-content">
        {activeTab === 'overview' && <OverviewTab classId={selectedClassId} students={students} resources={resources} />}
        {activeTab === 'students' && <StudentsTab classId={selectedClassId} students={students} onUpdate={updateStudents} />}
        {activeTab === 'attendance' && <AttendanceTab classId={selectedClassId} students={students} />}
        {activeTab === 'marks' && <MarksTab classId={selectedClassId} students={students} marksExamType={marksExamType} setMarksExamType={setMarksExamType} marksSubject={marksSubject} setMarksSubject={setMarksSubject} marksDate={marksDate} setMarksDate={setMarksDate} marksTotalMarks={marksTotalMarks} setMarksTotalMarks={setMarksTotalMarks} marksData={marksData} setMarksData={setMarksData} />}
        {activeTab === 'exams' && <ExamsTab students={students} />}
        {activeTab === 'behavior' && <BehaviorTab students={students} behaviorNotes={behaviorNotes} setBehaviorNotes={setBehaviorNotes} />}
        {activeTab === 'feedback' && <FeedbackTab students={students} feedbackData={feedbackData} setFeedbackData={setFeedbackData} feedbackSentiment={feedbackSentiment} setFeedbackSentiment={setFeedbackSentiment} />}
        {activeTab === 'resources' && <ResourcesTab classId={selectedClassId} className={`${selectedClass?.name}`} resources={resources} onUpdate={updateResources} />}
        {activeTab === 'assignments' && <AssignmentsTab
          classId={selectedClassId}
          className={`${selectedClass?.name}`}
          assignments={assignments}
          students={students}
          onUpdate={updateAssignments}
        />}
        {activeTab === 'evaluations' && <EvaluationsTab classId={selectedClassId} students={students} />}
      </div>

      <FloatingAIAssistant />
    </div>
  );
};

export default MyClasses;

