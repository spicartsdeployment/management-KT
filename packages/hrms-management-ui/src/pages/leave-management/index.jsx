import React, { useState, useMemo, useCallback, useEffect } from "react";
import "../../Assets/styles/LeaveManagement.scss";
import ManagementPageHeader from "../../app/components/common/ManagementPageHeader";

// ─── Constants ────────────────────────────────────────────────────────────────
const PAGE_SIZE = 10;

const DEPT_OPTIONS = [
  { value: "all", label: "All Departments" },
  { value: "Mathematics", label: "Mathematics" },
  { value: "Science", label: "Science" },
  { value: "English", label: "English" },
  { value: "Administration", label: "Administration" },
  { value: "HR", label: "HR" },
  { value: "IT", label: "IT" },
  { value: "Finance", label: "Finance" },
  { value: "Library", label: "Library" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
  { value: "on-hold", label: "On Hold" },
];

const TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "sick", label: "Sick Leave" },
  { value: "casual", label: "Casual Leave" },
  { value: "emergency", label: "Emergency Leave" },
  { value: "paid", label: "Paid Leave" },
  { value: "unpaid", label: "Unpaid Leave" },
  { value: "maternity", label: "Maternity Leave" },
  { value: "paternity", label: "Paternity Leave" },
  { value: "duty", label: "Duty Leave" },
  { value: "vacation", label: "Vacation Leave" },
];

const TYPE_CONFIGS = {
  sick:      { icon: "🤒", color: "#dc2626", bg: "rgba(220,38,38,.12)"  },
  casual:    { icon: "☀️", color: "#d97706", bg: "rgba(217,119,6,.12)"  },
  emergency: { icon: "🚨", color: "#dc2626", bg: "rgba(220,38,38,.12)"  },
  paid:      { icon: "💰", color: "#16a34a", bg: "rgba(22,163,74,.12)"  },
  unpaid:    { icon: "📋", color: "#6b7280", bg: "rgba(107,114,128,.12)"},
  maternity: { icon: "👶", color: "#7c3aed", bg: "rgba(124,58,237,.12)" },
  paternity: { icon: "👨‍👶", color: "#2563eb", bg: "rgba(37,99,235,.12)" },
  duty:      { icon: "🎯", color: "#c9a962", bg: "rgba(201,169,98,.12)" },
  vacation:  { icon: "🏖️", color: "#0891b2", bg: "rgba(8,145,178,.12)"  },
};

const LEAVE_METRICS_DEF = [
  { id: "total",       label: "Total Requests", icon: "📋", color: "primary" },
  { id: "pending",     label: "Pending",        icon: "⏳", color: "warning" },
  { id: "approved",    label: "Approved",       icon: "✅", color: "success" },
  { id: "rejected",    label: "Rejected",       icon: "❌", color: "danger"  },
  { id: "emergency",   label: "Emergency",      icon: "🚨", color: "danger"  },
  { id: "avgDays",     label: "Avg Days",       icon: "📅", color: "info"    },
  { id: "pendingDays", label: "Pending Days",   icon: "🗓️", color: "purple"  },
];

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_LEAVE_REQUESTS = [
  { id:1,  employeeId:"E001", name:"Arjun Sharma",     initials:"AS", avatarColor:"#c9a962", dept:"Mathematics",   desig:"Senior Teacher",    leaveType:"sick",      startDate:"2025-07-01", endDate:"2025-07-03", totalDays:3,  reason:"Viral fever and flu, doctor recommended rest.", status:"pending",   appliedOn:"2025-06-28", approvedBy:null,         remarks:"",                   attachments:["medical_cert.pdf"], isEmergency:false },
  { id:2,  employeeId:"E002", name:"Priya Nair",        initials:"PN", avatarColor:"#7c3aed", dept:"Science",        desig:"Teacher",           leaveType:"maternity", startDate:"2025-07-05", endDate:"2025-09-05", totalDays:60, reason:"Maternity leave as per medical advice.",       status:"pending",   appliedOn:"2025-06-20", approvedBy:null,         remarks:"",                   attachments:["doctor_note.pdf"],  isEmergency:false },
  { id:3,  employeeId:"E003", name:"Rahul Verma",       initials:"RV", avatarColor:"#2563eb", dept:"English",        desig:"HOD",               leaveType:"casual",    startDate:"2025-07-08", endDate:"2025-07-09", totalDays:2,  reason:"Family function attendance.",                  status:"pending",   appliedOn:"2025-07-01", approvedBy:null,         remarks:"",                   attachments:[],                   isEmergency:false },
  { id:4,  employeeId:"E004", name:"Sunita Patel",      initials:"SP", avatarColor:"#0891b2", dept:"Administration", desig:"Admin Officer",     leaveType:"emergency", startDate:"2025-07-02", endDate:"2025-07-02", totalDays:1,  reason:"Father hospitalized due to cardiac episode.", status:"pending",   appliedOn:"2025-07-02", approvedBy:null,         remarks:"",                   attachments:[],                   isEmergency:true  },
  { id:5,  employeeId:"E005", name:"Vikram Singh",      initials:"VS", avatarColor:"#16a34a", dept:"IT",             desig:"IT Manager",        leaveType:"paid",      startDate:"2025-07-15", endDate:"2025-07-19", totalDays:5,  reason:"Annual vacation leave.",                       status:"pending",   appliedOn:"2025-07-03", approvedBy:null,         remarks:"",                   attachments:[],                   isEmergency:false },
  { id:6,  employeeId:"E006", name:"Meera Krishnan",    initials:"MK", avatarColor:"#d97706", dept:"Finance",        desig:"Accountant",        leaveType:"sick",      startDate:"2025-07-10", endDate:"2025-07-11", totalDays:2,  reason:"Migraine and vertigo, requires medication.",   status:"pending",   appliedOn:"2025-07-07", approvedBy:null,         remarks:"",                   attachments:["prescription.pdf"], isEmergency:false },
  { id:7,  employeeId:"E007", name:"Deepak Joshi",      initials:"DJ", avatarColor:"#dc2626", dept:"Science",        desig:"Lab Assistant",     leaveType:"duty",      startDate:"2025-07-14", endDate:"2025-07-14", totalDays:1,  reason:"Official duty - district science exhibition.", status:"pending",   appliedOn:"2025-07-06", approvedBy:null,         remarks:"",                   attachments:["duty_letter.pdf"],  isEmergency:false },
  { id:8,  employeeId:"E008", name:"Anita Desai",       initials:"AD", avatarColor:"#6b7280", dept:"Library",        desig:"Librarian",         leaveType:"casual",    startDate:"2025-07-21", endDate:"2025-07-22", totalDays:2,  reason:"Personal work.",                               status:"pending",   appliedOn:"2025-07-10", approvedBy:null,         remarks:"",                   attachments:[],                   isEmergency:false },
  { id:9,  employeeId:"E009", name:"Suresh Menon",      initials:"SM", avatarColor:"#7c3aed", dept:"Mathematics",    desig:"Teacher",           leaveType:"unpaid",    startDate:"2025-07-25", endDate:"2025-07-26", totalDays:2,  reason:"Extended family emergency.",                   status:"pending",   appliedOn:"2025-07-12", approvedBy:null,         remarks:"",                   attachments:[],                   isEmergency:false },
  { id:10, employeeId:"E010", name:"Kavitha Rao",       initials:"KR", avatarColor:"#2563eb", dept:"HR",             desig:"HR Executive",      leaveType:"casual",    startDate:"2025-07-28", endDate:"2025-07-28", totalDays:1,  reason:"Personal appointment.",                        status:"pending",   appliedOn:"2025-07-15", approvedBy:null,         remarks:"",                   attachments:[],                   isEmergency:false },
  { id:11, employeeId:"E011", name:"Ravi Kumar",        initials:"RK", avatarColor:"#c9a962", dept:"Mathematics",    desig:"Senior Teacher",    leaveType:"vacation",  startDate:"2025-06-01", endDate:"2025-06-07", totalDays:7,  reason:"Annual vacation.",                             status:"approved",  appliedOn:"2025-05-20", approvedBy:"Principal",  remarks:"Approved. Have a good break.", attachments:[],              isEmergency:false },
  { id:12, employeeId:"E012", name:"Lakshmi Iyer",      initials:"LI", avatarColor:"#16a34a", dept:"English",        desig:"Teacher",           leaveType:"sick",      startDate:"2025-06-10", endDate:"2025-06-12", totalDays:3,  reason:"Dengue fever, hospitalized.",                  status:"approved",  appliedOn:"2025-06-09", approvedBy:"Vice Principal", remarks:"Approved with medical proof.", attachments:["hospital_report.pdf"], isEmergency:false },
  { id:13, employeeId:"E013", name:"Manoj Gupta",       initials:"MG", avatarColor:"#d97706", dept:"Administration", desig:"Principal",         leaveType:"duty",      startDate:"2025-06-15", endDate:"2025-06-16", totalDays:2,  reason:"Board meeting in state capital.",              status:"approved",  appliedOn:"2025-06-12", approvedBy:"Chairman",   remarks:"Approved.",          attachments:["meeting_invite.pdf"], isEmergency:false },
  { id:14, employeeId:"E014", name:"Nisha Sharma",      initials:"NS", avatarColor:"#0891b2", dept:"Science",        desig:"HOD",               leaveType:"paid",      startDate:"2025-06-20", endDate:"2025-06-25", totalDays:6,  reason:"Annual paid leave entitlement.",               status:"approved",  appliedOn:"2025-06-10", approvedBy:"Principal",  remarks:"Approved.",          attachments:[],                   isEmergency:false },
  { id:15, employeeId:"E015", name:"Arun Pillai",       initials:"AP", avatarColor:"#dc2626", dept:"IT",             desig:"Tech Support",      leaveType:"casual",    startDate:"2025-06-18", endDate:"2025-06-18", totalDays:1,  reason:"Personal work.",                               status:"approved",  appliedOn:"2025-06-16", approvedBy:"IT Manager", remarks:"Approved.",          attachments:[],                   isEmergency:false },
  { id:16, employeeId:"E016", name:"Sneha Kapoor",      initials:"SK", avatarColor:"#7c3aed", dept:"Finance",        desig:"Finance Head",      leaveType:"sick",      startDate:"2025-06-22", endDate:"2025-06-23", totalDays:2,  reason:"Cold and fever.",                              status:"approved",  appliedOn:"2025-06-21", approvedBy:"Principal",  remarks:"Approved. Rest well.", attachments:[],                  isEmergency:false },
  { id:17, employeeId:"E017", name:"Balasubramaniam K", initials:"BK", avatarColor:"#6b7280", dept:"Library",        desig:"Sr. Librarian",     leaveType:"paternity", startDate:"2025-05-10", endDate:"2025-05-24", totalDays:15, reason:"Paternity leave for newborn.",                 status:"approved",  appliedOn:"2025-05-05", approvedBy:"Principal",  remarks:"Congratulations! Approved.", attachments:["birth_cert.pdf"], isEmergency:false },
  { id:18, employeeId:"E018", name:"Divya Menon",       initials:"DM", avatarColor:"#2563eb", dept:"Mathematics",    desig:"Teacher",           leaveType:"casual",    startDate:"2025-06-05", endDate:"2025-06-05", totalDays:1,  reason:"Sibling's wedding.",                           status:"approved",  appliedOn:"2025-06-01", approvedBy:"HOD",        remarks:"Approved.",          attachments:[],                   isEmergency:false },
  { id:19, employeeId:"E019", name:"Ramesh Naidu",      initials:"RN", avatarColor:"#c9a962", dept:"Science",        desig:"Teacher",           leaveType:"unpaid",    startDate:"2025-05-15", endDate:"2025-05-20", totalDays:6,  reason:"Personal travel plans.",                       status:"rejected",  appliedOn:"2025-05-10", approvedBy:"Principal",  remarks:"Cannot approve during exam period.", attachments:[],             isEmergency:false },
  { id:20, employeeId:"E020", name:"Geeta Sharma",      initials:"GS", avatarColor:"#dc2626", dept:"English",        desig:"Teacher",           leaveType:"casual",    startDate:"2025-05-25", endDate:"2025-05-26", totalDays:2,  reason:"Personal.",                                    status:"rejected",  appliedOn:"2025-05-22", approvedBy:"HOD",        remarks:"Insufficient advance notice.", attachments:[],              isEmergency:false },
  { id:21, employeeId:"E021", name:"Prasad Rao",        initials:"PR", avatarColor:"#0891b2", dept:"Finance",        desig:"Accountant",        leaveType:"vacation",  startDate:"2025-04-01", endDate:"2025-04-08", totalDays:8,  reason:"Annual vacation.",                             status:"rejected",  appliedOn:"2025-03-25", approvedBy:"Finance Head", remarks:"Year-end closing. Rejected.", attachments:[],             isEmergency:false },
  { id:22, employeeId:"E022", name:"Shalini Thomas",    initials:"ST", avatarColor:"#7c3aed", dept:"Administration", desig:"Office Staff",      leaveType:"paid",      startDate:"2025-04-15", endDate:"2025-04-18", totalDays:4,  reason:"Family visit.",                                status:"rejected",  appliedOn:"2025-04-10", approvedBy:"Admin Officer", remarks:"Not enough staff coverage.", attachments:[],             isEmergency:false },
  { id:23, employeeId:"E023", name:"Mohan Das",         initials:"MD", avatarColor:"#16a34a", dept:"HR",             desig:"HR Manager",        leaveType:"casual",    startDate:"2025-05-05", endDate:"2025-05-05", totalDays:1,  reason:"Personal errand.",                             status:"cancelled", appliedOn:"2025-05-03", approvedBy:null,         remarks:"Withdrawn by employee.", attachments:[],              isEmergency:false },
  { id:24, employeeId:"E024", name:"Rekha Pillai",      initials:"RP", avatarColor:"#d97706", dept:"IT",             desig:"Developer",         leaveType:"sick",      startDate:"2025-05-12", endDate:"2025-05-13", totalDays:2,  reason:"Stomach infection.",                           status:"cancelled", appliedOn:"2025-05-11", approvedBy:null,         remarks:"Employee recovered and withdrew.", attachments:[],         isEmergency:false },
  { id:25, employeeId:"E025", name:"Girish Nambiar",    initials:"GN", avatarColor:"#2563eb", dept:"Mathematics",    desig:"Teacher",           leaveType:"emergency", startDate:"2025-07-03", endDate:"2025-07-04", totalDays:2,  reason:"Mother's surgery emergency.",                  status:"on-hold",   appliedOn:"2025-07-03", approvedBy:null,         remarks:"Pending verification of medical emergency.", attachments:["medical_note.pdf"], isEmergency:true  },
];

const MOCK_LEAVE_TYPES = [
  { id:"sick",      name:"Sick Leave",       icon:"🤒", color:"#dc2626", maxDays:12, carryForward:false, paid:true,  eligibility:"All Staff",     description:"For illness or medical conditions.",               activeCount:8,  status:"active"   },
  { id:"casual",    name:"Casual Leave",     icon:"☀️", color:"#d97706", maxDays:10, carryForward:false, paid:true,  eligibility:"All Staff",     description:"For personal or miscellaneous reasons.",           activeCount:12, status:"active"   },
  { id:"emergency", name:"Emergency Leave",  icon:"🚨", color:"#dc2626", maxDays:5,  carryForward:false, paid:true,  eligibility:"All Staff",     description:"For unforeseen urgent personal matters.",          activeCount:3,  status:"active"   },
  { id:"paid",      name:"Paid Leave",       icon:"💰", color:"#16a34a", maxDays:20, carryForward:true,  paid:true,  eligibility:"All Staff",     description:"Annual earned leave with full pay.",               activeCount:6,  status:"active"   },
  { id:"unpaid",    name:"Unpaid Leave",     icon:"📋", color:"#6b7280", maxDays:30, carryForward:false, paid:false, eligibility:"Permanent Staff","description":"Leave without pay, subject to approval.",        activeCount:2,  status:"active"   },
  { id:"maternity", name:"Maternity Leave",  icon:"👶", color:"#7c3aed", maxDays:180,carryForward:false, paid:true,  eligibility:"Female Staff",  description:"Maternity leave as per statutory requirements.",   activeCount:1,  status:"active"   },
  { id:"paternity", name:"Paternity Leave",  icon:"👨‍👶", color:"#2563eb", maxDays:15, carryForward:false, paid:true,  eligibility:"Male Staff",    description:"Paternity leave for newborn care.",                activeCount:0,  status:"active"   },
  { id:"duty",      name:"Duty Leave",       icon:"🎯", color:"#c9a962", maxDays:15, carryForward:false, paid:true,  eligibility:"All Staff",     description:"For official duties, events, and training.",       activeCount:4,  status:"active"   },
  { id:"vacation",  name:"Vacation Leave",   icon:"🏖️", color:"#0891b2", maxDays:25, carryForward:true,  paid:true,  eligibility:"All Staff",     description:"Annual vacation entitlement.",                     activeCount:3,  status:"inactive" },
];

const MOCK_BALANCES = [
  { employeeId:"E001", name:"Arjun Sharma",     initials:"AS", avatarColor:"#c9a962", dept:"Mathematics",   desig:"Senior Teacher",  balances:[{id:"sick",total:12,used:4,remaining:8},{id:"casual",total:10,used:3,remaining:7},{id:"paid",total:20,used:5,remaining:15},{id:"duty",total:15,used:2,remaining:13}] },
  { employeeId:"E002", name:"Priya Nair",        initials:"PN", avatarColor:"#7c3aed", dept:"Science",        desig:"Teacher",         balances:[{id:"sick",total:12,used:2,remaining:10},{id:"casual",total:10,used:1,remaining:9},{id:"maternity",total:180,used:60,remaining:120}] },
  { employeeId:"E003", name:"Rahul Verma",       initials:"RV", avatarColor:"#2563eb", dept:"English",        desig:"HOD",             balances:[{id:"sick",total:12,used:0,remaining:12},{id:"casual",total:10,used:4,remaining:6},{id:"paid",total:20,used:8,remaining:12},{id:"duty",total:15,used:6,remaining:9}] },
  { employeeId:"E005", name:"Vikram Singh",      initials:"VS", avatarColor:"#16a34a", dept:"IT",             desig:"IT Manager",      balances:[{id:"sick",total:12,used:1,remaining:11},{id:"casual",total:10,used:2,remaining:8},{id:"paid",total:20,used:10,remaining:10},{id:"vacation",total:25,used:5,remaining:20}] },
  { employeeId:"E011", name:"Ravi Kumar",        initials:"RK", avatarColor:"#c9a962", dept:"Mathematics",    desig:"Senior Teacher",  balances:[{id:"sick",total:12,used:3,remaining:9},{id:"casual",total:10,used:5,remaining:5},{id:"vacation",total:25,used:7,remaining:18}] },
  { employeeId:"E012", name:"Lakshmi Iyer",      initials:"LI", avatarColor:"#16a34a", dept:"English",        desig:"Teacher",         balances:[{id:"sick",total:12,used:8,remaining:4},{id:"casual",total:10,used:2,remaining:8},{id:"paid",total:20,used:3,remaining:17}] },
  { employeeId:"E014", name:"Nisha Sharma",      initials:"NS", avatarColor:"#0891b2", dept:"Science",        desig:"HOD",             balances:[{id:"sick",total:12,used:0,remaining:12},{id:"casual",total:10,used:3,remaining:7},{id:"paid",total:20,used:6,remaining:14},{id:"duty",total:15,used:4,remaining:11}] },
  { employeeId:"E017", name:"Balasubramaniam K", initials:"BK", avatarColor:"#6b7280", dept:"Library",        desig:"Sr. Librarian",   balances:[{id:"sick",total:12,used:2,remaining:10},{id:"casual",total:10,used:0,remaining:10},{id:"paternity",total:15,used:15,remaining:0}] },
];

const MOCK_SUBSTITUTES = [
  { id:1, absentEmp:{name:"Arjun Sharma",    initials:"AS",color:"#c9a962",dept:"Mathematics"},  subEmp:{name:"Divya Menon",   initials:"DM",color:"#2563eb"},  startDate:"2025-07-01", endDate:"2025-07-03", period:"Classes 8A, 9B", status:"active"   },
  { id:2, absentEmp:{name:"Priya Nair",       initials:"PN",color:"#7c3aed",dept:"Science"},       subEmp:{name:"Nisha Sharma",  initials:"NS",color:"#0891b2"},  startDate:"2025-07-05", endDate:"2025-09-05", period:"Classes 10B, 11A", status:"active"   },
  { id:3, absentEmp:{name:"Rahul Verma",      initials:"RV",color:"#2563eb",dept:"English"},       subEmp:{name:"Lakshmi Iyer",  initials:"LI",color:"#16a34a"},  startDate:"2025-07-08", endDate:"2025-07-09", period:"Classes 9A, 10A", status:"active"   },
  { id:4, absentEmp:{name:"Ravi Kumar",       initials:"RK",color:"#c9a962",dept:"Mathematics"},   subEmp:{name:"Arjun Sharma",  initials:"AS",color:"#c9a962"},  startDate:"2025-06-01", endDate:"2025-06-07", period:"Classes 11B, 12A", status:"completed" },
  { id:5, absentEmp:{name:"Lakshmi Iyer",     initials:"LI",color:"#16a34a",dept:"English"},       subEmp:{name:"Geeta Sharma",  initials:"GS",color:"#dc2626"},  startDate:"2025-06-10", endDate:"2025-06-12", period:"Classes 8B, 9C", status:"completed" },
  { id:6, absentEmp:{name:"Nisha Sharma",     initials:"NS",color:"#0891b2",dept:"Science"},       subEmp:{name:"Deepak Joshi",  initials:"DJ",color:"#dc2626"},  startDate:"2025-06-20", endDate:"2025-06-25", period:"Lab sessions, Classes 10B", status:"completed" },
  { id:7, absentEmp:{name:"Vikram Singh",     initials:"VS",color:"#16a34a",dept:"IT"},            subEmp:{name:"Rekha Pillai",  initials:"RP",color:"#d97706"},  startDate:"2025-07-15", endDate:"2025-07-19", period:"IT Lab duties", status:"pending"   },
  { id:8, absentEmp:{name:"Girish Nambiar",   initials:"GN",color:"#2563eb",dept:"Mathematics"},   subEmp:{name:"Suresh Menon",  initials:"SM",color:"#7c3aed"},  startDate:"2025-07-03", endDate:"2025-07-04", period:"Classes 7A, 7B", status:"pending"   },
];

const MOCK_HISTORY = [
  { id:1,  name:"Ravi Kumar",       initials:"RK", avatarColor:"#c9a962", dept:"Mathematics",   leaveType:"vacation",  startDate:"2025-06-01", endDate:"2025-06-07", totalDays:7,  status:"approved",  actedBy:"Principal",    actedOn:"2025-05-22", remarks:"Approved." },
  { id:2,  name:"Lakshmi Iyer",     initials:"LI", avatarColor:"#16a34a", dept:"English",        leaveType:"sick",      startDate:"2025-06-10", endDate:"2025-06-12", totalDays:3,  status:"approved",  actedBy:"VP",           actedOn:"2025-06-09", remarks:"Approved with medical proof." },
  { id:3,  name:"Ramesh Naidu",     initials:"RN", avatarColor:"#c9a962", dept:"Science",        leaveType:"unpaid",    startDate:"2025-05-15", endDate:"2025-05-20", totalDays:6,  status:"rejected",  actedBy:"Principal",    actedOn:"2025-05-12", remarks:"Exam period." },
  { id:4,  name:"Geeta Sharma",     initials:"GS", avatarColor:"#dc2626", dept:"English",        leaveType:"casual",    startDate:"2025-05-25", endDate:"2025-05-26", totalDays:2,  status:"rejected",  actedBy:"HOD",          actedOn:"2025-05-23", remarks:"Insufficient notice." },
  { id:5,  name:"Balasubramaniam K",initials:"BK", avatarColor:"#6b7280", dept:"Library",        leaveType:"paternity", startDate:"2025-05-10", endDate:"2025-05-24", totalDays:15, status:"approved",  actedBy:"Principal",    actedOn:"2025-05-07", remarks:"Congratulations!" },
  { id:6,  name:"Manoj Gupta",      initials:"MG", avatarColor:"#d97706", dept:"Administration", leaveType:"duty",      startDate:"2025-06-15", endDate:"2025-06-16", totalDays:2,  status:"approved",  actedBy:"Chairman",     actedOn:"2025-06-13", remarks:"Approved." },
  { id:7,  name:"Nisha Sharma",     initials:"NS", avatarColor:"#0891b2", dept:"Science",        leaveType:"paid",      startDate:"2025-06-20", endDate:"2025-06-25", totalDays:6,  status:"approved",  actedBy:"Principal",    actedOn:"2025-06-11", remarks:"Approved." },
  { id:8,  name:"Mohan Das",        initials:"MD", avatarColor:"#16a34a", dept:"HR",             leaveType:"casual",    startDate:"2025-05-05", endDate:"2025-05-05", totalDays:1,  status:"cancelled", actedBy:"Employee",     actedOn:"2025-05-04", remarks:"Self-withdrawn." },
  { id:9,  name:"Prasad Rao",       initials:"PR", avatarColor:"#0891b2", dept:"Finance",        leaveType:"vacation",  startDate:"2025-04-01", endDate:"2025-04-08", totalDays:8,  status:"rejected",  actedBy:"Finance Head", actedOn:"2025-03-27", remarks:"Year-end closing." },
  { id:10, name:"Sneha Kapoor",     initials:"SK", avatarColor:"#7c3aed", dept:"Finance",        leaveType:"sick",      startDate:"2025-06-22", endDate:"2025-06-23", totalDays:2,  status:"approved",  actedBy:"Principal",    actedOn:"2025-06-21", remarks:"Approved. Rest well." },
  { id:11, name:"Arun Pillai",      initials:"AP", avatarColor:"#dc2626", dept:"IT",             leaveType:"casual",    startDate:"2025-06-18", endDate:"2025-06-18", totalDays:1,  status:"approved",  actedBy:"IT Manager",   actedOn:"2025-06-17", remarks:"Approved." },
  { id:12, name:"Divya Menon",      initials:"DM", avatarColor:"#2563eb", dept:"Mathematics",    leaveType:"casual",    startDate:"2025-06-05", endDate:"2025-06-05", totalDays:1,  status:"approved",  actedBy:"HOD",          actedOn:"2025-06-03", remarks:"Approved." },
  { id:13, name:"Shalini Thomas",   initials:"ST", avatarColor:"#7c3aed", dept:"Administration", leaveType:"paid",      startDate:"2025-04-15", endDate:"2025-04-18", totalDays:4,  status:"rejected",  actedBy:"Admin Officer",actedOn:"2025-04-12", remarks:"Not enough staff coverage." },
  { id:14, name:"Rekha Pillai",     initials:"RP", avatarColor:"#d97706", dept:"IT",             leaveType:"sick",      startDate:"2025-05-12", endDate:"2025-05-13", totalDays:2,  status:"cancelled", actedBy:"Employee",     actedOn:"2025-05-12", remarks:"Employee recovered." },
  { id:15, name:"Vikram Singh",     initials:"VS", avatarColor:"#16a34a", dept:"IT",             leaveType:"paid",      startDate:"2025-04-10", endDate:"2025-04-14", totalDays:5,  status:"approved",  actedBy:"Principal",    actedOn:"2025-04-05", remarks:"Approved." },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtDate(d) {
  if (!d) return "—";
  const dt = new Date(d + "T00:00:00");
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function fmtRelative(d) {
  if (!d) return "";
  const diff = Math.floor((Date.now() - new Date(d + "T00:00:00").getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7)  return `${diff} days ago`;
  if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
  return fmtDate(d);
}

function getDaysBetween(s, e) {
  if (!s || !e) return 0;
  return Math.round((new Date(e + "T00:00:00") - new Date(s + "T00:00:00")) / 86400000) + 1;
}

function computeMetrics(requests) {
  const pending   = requests.filter(r => r.status === "pending").length;
  const approved  = requests.filter(r => r.status === "approved").length;
  const rejected  = requests.filter(r => r.status === "rejected").length;
  const emergency = requests.filter(r => r.isEmergency).length;
  const pendingItems = requests.filter(r => r.status === "pending");
  const pendingDays = pendingItems.reduce((a, r) => a + (r.totalDays || 0), 0);
  const avgDays = requests.length ? (requests.reduce((a, r) => a + (r.totalDays || 0), 0) / requests.length).toFixed(1) : 0;
  return { total: requests.length, pending, approved, rejected, emergency, avgDays, pendingDays };
}

// ─── Small Components ─────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const labels = { pending:"Pending", approved:"Approved", rejected:"Rejected", cancelled:"Cancelled", "on-hold":"On Hold" };
  return (
    <span className={`lm-status-badge lm-status-badge--${status}`} data-testid={`school-badge-lm-status-${status}`}>
      {labels[status] || status}
    </span>
  );
}

function TypeBadge({ type }) {
  const cfg = TYPE_CONFIGS[type] || { icon: "📋", color: "#6b7280", bg: "rgba(107,114,128,.1)" };
  return (
    <span className="lm-type-badge" style={{ color: cfg.color, background: cfg.bg, borderColor: "transparent" }} data-testid={`school-badge-lm-type-${type}`}>
      {cfg.icon} {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
}

function EmergBadge() {
  return <span className="lm-emerg-badge" data-testid="school-badge-lm-emergency">🚨 Emergency</span>;
}

function Avatar({ name, initials, color, size = 32 }) {
  return (
    <div
      className="lm-cell-avatar"
      style={{ width: size, height: size, background: color || "#c9a962", fontSize: size < 28 ? ".5625rem" : ".6875rem" }}
      aria-label={name}
    >
      {initials || name?.slice(0, 2).toUpperCase()}
    </div>
  );
}

function Toast({ toast, onClose }) {
  if (!toast) return null;
  const icons = { success: "✅", error: "❌", warn: "⚠️", info: "ℹ️" };
  return (
    <div className={`lm-toast lm-toast--${toast.type}`} role="alert" data-testid="school-toast-lm">
      <span className="lm-toast__icon">{icons[toast.type]}</span>
      <span className="lm-toast__msg">{toast.msg}</span>
      <button className="lm-toast__close" onClick={onClose} aria-label="Close notification">✕</button>
    </div>
  );
}

function BalanceBar({ used, total, color }) {
  const pct = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
  return (
    <div className="lm-bal-row__track">
      <div className="lm-bal-row__fill" style={{ width: `${pct}%`, background: color || "#c9a962" }} />
    </div>
  );
}

// ─── Modals ───────────────────────────────────────────────────────────────────
function ApplyLeaveModal({ onClose, onSave, editData }) {
  const [form, setForm] = useState({
    name: editData?.name || "",
    dept: editData?.dept || "Mathematics",
    leaveType: editData?.leaveType || "sick",
    startDate: editData?.startDate || "",
    endDate: editData?.endDate || "",
    reason: editData?.reason || "",
    isEmergency: editData?.isEmergency || false,
    substitute: editData?.substitute || "",
  });

  const days = getDaysBetween(form.startDate, form.endDate);

  function handleChange(f, v) { setForm(p => ({ ...p, [f]: v })); }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.startDate || !form.endDate || !form.reason.trim()) return;
    onSave({ ...form, totalDays: days > 0 ? days : 1, status: "pending", appliedOn: new Date().toISOString().slice(0, 10) });
  }

  return (
    <div className="lm-modal-backdrop" data-testid="school-modal-lm-apply">
      <div className="lm-modal">
        <div className="lm-modal__header">
          <span className="lm-modal__title">{editData ? "Edit Leave Request" : "Apply for Leave"}</span>
          <button className="lm-modal__close" onClick={onClose} data-testid="school-button-lm-modal-close">✕</button>
        </div>
        <div className="lm-modal__body">
          <form className="lm-form" id="lm-apply-form" onSubmit={handleSubmit}>
            <div className="lm-form-grid">
              <div className="lm-field">
                <label>Employee Name *</label>
                <input data-testid="school-field-lm-emp-name" value={form.name} onChange={e => handleChange("name", e.target.value)} placeholder="Full name" required />
              </div>
              <div className="lm-field">
                <label>Department</label>
                <select data-testid="school-dropdown-lm-dept" value={form.dept} onChange={e => handleChange("dept", e.target.value)}>
                  {DEPT_OPTIONS.filter(o => o.value !== "all").map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
            <div className="lm-field">
              <label>Leave Type *</label>
              <select data-testid="school-dropdown-lm-leave-type" value={form.leaveType} onChange={e => handleChange("leaveType", e.target.value)}>
                {TYPE_OPTIONS.filter(o => o.value !== "all").map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="lm-form-grid">
              <div className="lm-field">
                <label>Start Date *</label>
                <input type="date" data-testid="school-field-lm-start-date" value={form.startDate} onChange={e => handleChange("startDate", e.target.value)} required />
              </div>
              <div className="lm-field">
                <label>End Date *</label>
                <input type="date" data-testid="school-field-lm-end-date" value={form.endDate} onChange={e => handleChange("endDate", e.target.value)} required />
              </div>
            </div>
            {days > 0 && (
              <p style={{ fontSize: ".8125rem", color: "#c9a962", margin: 0 }}>📅 {days} day{days !== 1 ? "s" : ""} selected</p>
            )}
            <div className="lm-field">
              <label>Reason *</label>
              <textarea data-testid="school-field-lm-reason" value={form.reason} onChange={e => handleChange("reason", e.target.value)} placeholder="Describe the reason for leave…" rows={3} required />
            </div>
            <div className="lm-field lm-field--toggle">
              <label>Mark as Emergency</label>
              <label className="lm-toggle" data-testid="school-toggle-lm-emergency">
                <input type="checkbox" checked={form.isEmergency} onChange={e => handleChange("isEmergency", e.target.checked)} />
                <span className="lm-toggle__track" />
              </label>
            </div>
            <div className="lm-field">
              <label>Substitute Employee (optional)</label>
              <input data-testid="school-field-lm-substitute" value={form.substitute} onChange={e => handleChange("substitute", e.target.value)} placeholder="Employee ID or name" />
            </div>
          </form>
        </div>
        <div className="lm-modal__footer">
          <button className="lm-btn lm-btn--ghost" onClick={onClose} data-testid="school-button-lm-cancel-apply">Cancel</button>
          <button className="lm-btn lm-btn--primary" type="submit" form="lm-apply-form" data-testid="school-button-lm-submit-apply">
            {editData ? "Update Request" : "Submit Request"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ViewRequestModal({ request, onClose, onApprove, onReject }) {
  if (!request) return null;
  const trail = [
    { by: request.name, role: "Employee", at: fmtDate(request.appliedOn), state: "done", remark: "Leave request submitted." },
    { by: request.approvedBy || "—", role: "Approver", at: request.approvedBy ? "Actioned" : "Awaiting", state: request.status === "approved" ? "done" : request.status === "rejected" ? "reject" : "current", remark: request.remarks || "Pending review." },
  ];
  return (
    <div className="lm-modal-backdrop" data-testid="school-modal-lm-view">
      <div className="lm-modal lm-modal--view">
        <div className="lm-modal__header">
          <span className="lm-modal__title">Leave Request #{request.id}</span>
          <button className="lm-modal__close" onClick={onClose} data-testid="school-button-lm-view-close">✕</button>
        </div>
        <div className="lm-modal__body">
          <div className="lm-detail">
            <div className="lm-detail__hero">
              <Avatar name={request.name} initials={request.initials} color={request.avatarColor} size={48} />
              <div>
                <div style={{ fontWeight: 700, fontSize: "1rem" }}>{request.name}</div>
                <div style={{ fontSize: ".8125rem", color: "var(--lm-muted)" }}>{request.desig} · {request.dept}</div>
                <div style={{ marginTop: ".375rem", display: "flex", gap: ".375rem", flexWrap: "wrap" }}>
                  <StatusBadge status={request.status} />
                  <TypeBadge type={request.leaveType} />
                  {request.isEmergency && <EmergBadge />}
                </div>
              </div>
            </div>
            <div className="lm-detail__section">
              <div className="lm-detail__heading">Leave Details</div>
              <div className="lm-detail__grid">
                <div className="lm-detail__field"><span className="lm-detail__key">Start Date</span><span className="lm-detail__val">{fmtDate(request.startDate)}</span></div>
                <div className="lm-detail__field"><span className="lm-detail__key">End Date</span><span className="lm-detail__val">{fmtDate(request.endDate)}</span></div>
                <div className="lm-detail__field"><span className="lm-detail__key">Duration</span><span className="lm-detail__val">{request.totalDays} day{request.totalDays !== 1 ? "s" : ""}</span></div>
                <div className="lm-detail__field"><span className="lm-detail__key">Applied On</span><span className="lm-detail__val">{fmtDate(request.appliedOn)}</span></div>
              </div>
            </div>
            <div className="lm-detail__section">
              <div className="lm-detail__heading">Reason</div>
              <p style={{ fontSize: ".875rem", margin: 0 }}>{request.reason}</p>
            </div>
            {request.attachments?.length > 0 && (
              <div className="lm-detail__section">
                <div className="lm-detail__heading">Attachments</div>
                <div className="lm-file-list">
                  {request.attachments.map(a => <span key={a} className="lm-file-chip">📎 {a}</span>)}
                </div>
              </div>
            )}
            <div className="lm-detail__section">
              <div className="lm-detail__heading">Approval Trail</div>
              <div className="lm-trail">
                {trail.map((step, i) => (
                  <div key={i} className="lm-trail-step">
                    <div className={`lm-trail-step__dot lm-trail-step__dot--${step.state}`}>
                      {step.state === "done" ? "✓" : step.state === "reject" ? "✗" : ""}
                    </div>
                    <div className="lm-trail-step__meta">
                      <span className="lm-trail-step__by">{step.by}</span>
                      <span className="lm-trail-step__role">{step.role}</span>
                      <span className="lm-trail-step__at">{step.at}</span>
                      {step.remark && <span className="lm-trail-step__remark">"{step.remark}"</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="lm-modal__footer">
          <button className="lm-btn lm-btn--ghost" onClick={onClose} data-testid="school-button-lm-view-back">Close</button>
          {request.status === "pending" && (
            <>
              <button className="lm-btn lm-btn--danger" onClick={() => onReject(request)} data-testid="school-button-lm-view-reject">✗ Reject</button>
              <button className="lm-btn lm-btn--success" onClick={() => onApprove(request)} data-testid="school-button-lm-view-approve">✓ Approve</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ApprovalModal({ request, action, onClose, onConfirm }) {
  const [remarks, setRemarks] = useState("");
  if (!request) return null;
  const isApprove = action === "approve";
  return (
    <div className="lm-modal-backdrop" data-testid={`school-modal-lm-${action}`}>
      <div className="lm-modal lm-modal--sm">
        <div className="lm-modal__header">
          <span className="lm-modal__title">{isApprove ? "✓ Approve Request" : "✗ Reject Request"}</span>
          <button className="lm-modal__close" onClick={onClose}>✕</button>
        </div>
        <div className="lm-modal__body">
          <p style={{ fontSize: ".875rem", marginTop: 0 }}>
            {isApprove ? "Approve" : "Reject"} leave request from <strong>{request.name}</strong>?<br />
            <span style={{ color: "var(--lm-muted)", fontSize: ".8125rem" }}>{fmtDate(request.startDate)} – {fmtDate(request.endDate)} · {request.totalDays} day{request.totalDays !== 1 ? "s" : ""}</span>
          </p>
          <div className="lm-field">
            <label>Remarks (optional)</label>
            <textarea
              data-testid={`school-field-lm-${action}-remarks`}
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              placeholder={isApprove ? "Optional approval note…" : "Reason for rejection…"}
              rows={3}
            />
          </div>
        </div>
        <div className="lm-modal__footer">
          <button className="lm-btn lm-btn--ghost" onClick={onClose} data-testid={`school-button-lm-${action}-cancel`}>Cancel</button>
          <button
            className={`lm-btn ${isApprove ? "lm-btn--success" : "lm-btn--danger"}`}
            onClick={() => onConfirm(request, remarks)}
            data-testid={`school-button-lm-${action}-confirm`}
          >
            {isApprove ? "✓ Approve" : "✗ Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateLeaveTypeModal({ onClose, onSave }) {
  const [form, setForm] = useState({ name: "", icon: "📋", color: "#c9a962", maxDays: 10, paid: true, carryForward: false, eligibility: "All Staff", description: "" });
  function handleChange(f, v) { setForm(p => ({ ...p, [f]: v })); }
  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave({ ...form, id: form.name.toLowerCase().replace(/\s+/g, "-"), activeCount: 0, status: "active" });
  }
  return (
    <div className="lm-modal-backdrop" data-testid="school-modal-lm-create-type">
      <div className="lm-modal">
        <div className="lm-modal__header">
          <span className="lm-modal__title">Create Leave Type</span>
          <button className="lm-modal__close" onClick={onClose}>✕</button>
        </div>
        <div className="lm-modal__body">
          <form className="lm-form" id="lm-create-type-form" onSubmit={handleSubmit}>
            <div className="lm-form-grid">
              <div className="lm-field">
                <label>Name *</label>
                <input data-testid="school-field-lm-type-name" value={form.name} onChange={e => handleChange("name", e.target.value)} placeholder="e.g. Bereavement Leave" required />
              </div>
              <div className="lm-field">
                <label>Icon</label>
                <input data-testid="school-field-lm-type-icon" value={form.icon} onChange={e => handleChange("icon", e.target.value)} placeholder="Emoji" />
              </div>
            </div>
            <div className="lm-form-grid">
              <div className="lm-field">
                <label>Max Days</label>
                <input type="number" data-testid="school-field-lm-type-days" value={form.maxDays} onChange={e => handleChange("maxDays", +e.target.value)} min={1} />
              </div>
              <div className="lm-field">
                <label>Eligibility</label>
                <select data-testid="school-dropdown-lm-type-eligibility" value={form.eligibility} onChange={e => handleChange("eligibility", e.target.value)}>
                  <option>All Staff</option><option>Permanent Staff</option><option>Female Staff</option><option>Male Staff</option>
                </select>
              </div>
            </div>
            <div className="lm-field">
              <label>Description</label>
              <textarea data-testid="school-field-lm-type-desc" value={form.description} onChange={e => handleChange("description", e.target.value)} rows={2} />
            </div>
            <div className="lm-form-grid">
              <div className="lm-field lm-field--toggle">
                <label>Paid Leave</label>
                <label className="lm-toggle" data-testid="school-toggle-lm-type-paid">
                  <input type="checkbox" checked={form.paid} onChange={e => handleChange("paid", e.target.checked)} />
                  <span className="lm-toggle__track" />
                </label>
              </div>
              <div className="lm-field lm-field--toggle">
                <label>Carry Forward</label>
                <label className="lm-toggle" data-testid="school-toggle-lm-type-carry">
                  <input type="checkbox" checked={form.carryForward} onChange={e => handleChange("carryForward", e.target.checked)} />
                  <span className="lm-toggle__track" />
                </label>
              </div>
            </div>
          </form>
        </div>
        <div className="lm-modal__footer">
          <button className="lm-btn lm-btn--ghost" onClick={onClose} data-testid="school-button-lm-create-type-cancel">Cancel</button>
          <button className="lm-btn lm-btn--primary" type="submit" form="lm-create-type-form" data-testid="school-button-lm-create-type-save">Create Type</button>
        </div>
      </div>
    </div>
  );
}

// ─── Tab Views ────────────────────────────────────────────────────────────────
function RequestsView({ requests, viewMode, onView, onApprove, onReject, selectedIds, onToggleSelect, onSelectAll, onBulkApprove, onBulkReject, onBulkExport, page, setPage }) {
  const totalPages = Math.ceil(requests.length / PAGE_SIZE);
  const paged = requests.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const allSelected = paged.length > 0 && paged.every(r => selectedIds.includes(r.id));

  if (requests.length === 0) {
    return (
      <div className="lm-empty" data-testid="school-empty-lm-requests">
        <div className="lm-empty__icon">📋</div>
        <div className="lm-empty__title">No requests found</div>
        <div className="lm-empty__sub">Try adjusting your filters or apply a new leave request.</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
      {selectedIds.length > 0 && (
        <div className="lm-results-bar__bulk" style={{ padding: ".5rem .75rem", background: "rgba(201,169,98,.08)", border: "1px solid rgba(201,169,98,.2)", borderRadius: ".5rem" }}>
          <span style={{ fontSize: ".8125rem", color: "#c9a962", fontWeight: 500 }}>{selectedIds.length} selected</span>
          <button className="lm-btn lm-btn--success lm-btn--sm" onClick={onBulkApprove} data-testid="school-button-lm-bulk-approve">✓ Approve All</button>
          <button className="lm-btn lm-btn--danger lm-btn--sm"  onClick={onBulkReject}  data-testid="school-button-lm-bulk-reject">✗ Reject All</button>
          <button className="lm-btn lm-btn--ghost lm-btn--sm"   onClick={onBulkExport}  data-testid="school-button-lm-bulk-export">⬇ Export</button>
        </div>
      )}

      {viewMode === "table" ? (
        <div className="lm-table-wrap" data-testid="school-table-lm-requests">
          <div className="lm-table-scroll">
            <table className="lm-table">
              <thead>
                <tr>
                  <th><input type="checkbox" className="lm-checkbox" checked={allSelected} onChange={() => onSelectAll(paged, !allSelected)} aria-label="Select all" data-testid="school-checkbox-lm-select-all" /></th>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>Duration</th>
                  <th>Days</th>
                  <th>Status</th>
                  <th>Applied</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map(r => (
                  <tr key={r.id} className={r.isEmergency ? "--emergency" : ""}>
                    <td><input type="checkbox" className="lm-checkbox" checked={selectedIds.includes(r.id)} onChange={() => onToggleSelect(r.id)} aria-label={`Select ${r.name}`} data-testid={`school-checkbox-lm-row-${r.id}`} /></td>
                    <td>
                      <div className="lm-cell-emp">
                        <Avatar name={r.name} initials={r.initials} color={r.avatarColor} />
                        <div>
                          <div className="lm-cell-title">{r.name}</div>
                          <div className="lm-cell-sub">{r.dept}</div>
                        </div>
                      </div>
                    </td>
                    <td><TypeBadge type={r.leaveType} /></td>
                    <td><span className="lm-cell-mono">{fmtDate(r.startDate)} – {fmtDate(r.endDate)}</span></td>
                    <td><span style={{ fontWeight: 600 }}>{r.totalDays}</span></td>
                    <td>
                      <div style={{ display: "flex", gap: ".25rem", flexWrap: "wrap" }}>
                        <StatusBadge status={r.status} />
                        {r.isEmergency && <EmergBadge />}
                      </div>
                    </td>
                    <td><span className="lm-cell-muted">{fmtRelative(r.appliedOn)}</span></td>
                    <td>
                      <div className="lm-actions" style={{ justifyContent: "flex-end" }}>
                        <button className="lm-action-btn" title="View" onClick={() => onView(r)} data-testid={`school-button-lm-view-${r.id}`}>👁</button>
                        {r.status === "pending" && (
                          <>
                            <button className="lm-action-btn lm-action-btn--approve" title="Approve" onClick={() => onApprove(r)} data-testid={`school-button-lm-approve-${r.id}`}>✓</button>
                            <button className="lm-action-btn lm-action-btn--reject"  title="Reject"  onClick={() => onReject(r)}  data-testid={`school-button-lm-reject-${r.id}`}>✗</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="lm-cards" data-testid="school-cards-lm-requests">
          {paged.map(r => (
            <div key={r.id} className={`lm-req-card${r.isEmergency ? " lm-req-card--emergency" : ""}`} data-testid={`school-card-lm-request-${r.id}`}>
              <div className="lm-req-card__top">
                <div className="lm-req-card__emp">
                  <Avatar name={r.name} initials={r.initials} color={r.avatarColor} />
                  <div>
                    <div className="lm-req-card__name">{r.name}</div>
                    <div className="lm-req-card__meta">{r.desig} · {r.dept}</div>
                  </div>
                </div>
                <input type="checkbox" className="lm-checkbox" checked={selectedIds.includes(r.id)} onChange={() => onToggleSelect(r.id)} aria-label={`Select ${r.name}`} />
              </div>
              <div className="lm-req-card__dates">📅 {fmtDate(r.startDate)} – {fmtDate(r.endDate)}</div>
              <div className="lm-req-card__days">{r.totalDays} day{r.totalDays !== 1 ? "s" : ""}</div>
              <div className="lm-req-card__reason">{r.reason}</div>
              <div className="lm-req-card__badges">
                <StatusBadge status={r.status} />
                <TypeBadge type={r.leaveType} />
                {r.isEmergency && <EmergBadge />}
              </div>
              <div className="lm-req-card__footer">
                <span className="lm-cell-muted">{fmtRelative(r.appliedOn)}</span>
                <div className="lm-actions">
                  <button className="lm-action-btn" title="View" onClick={() => onView(r)} data-testid={`school-button-lm-card-view-${r.id}`}>👁</button>
                  {r.status === "pending" && (
                    <>
                      <button className="lm-action-btn lm-action-btn--approve" title="Approve" onClick={() => onApprove(r)} data-testid={`school-button-lm-card-approve-${r.id}`}>✓</button>
                      <button className="lm-action-btn lm-action-btn--reject"  title="Reject"  onClick={() => onReject(r)}  data-testid={`school-button-lm-card-reject-${r.id}`}>✗</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="lm-pagination" data-testid="school-pagination-lm">
          <button className="lm-page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} data-testid="school-button-lm-page-prev">‹</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i + 1} className={`lm-page-btn${page === i + 1 ? " lm-page-btn--active" : ""}`} onClick={() => setPage(i + 1)} data-testid={`school-button-lm-page-${i + 1}`}>{i + 1}</button>
          ))}
          <button className="lm-page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} data-testid="school-button-lm-page-next">›</button>
        </div>
      )}
    </div>
  );
}

function LeaveTypesView({ leaveTypes, onCreateType, onToggleStatus }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="lm-btn lm-btn--primary" onClick={onCreateType} data-testid="school-button-lm-create-type">+ Create Leave Type</button>
      </div>
      <div className="lm-type-grid" data-testid="school-grid-lm-types">
        {leaveTypes.map(t => (
          <div key={t.id} className={`lm-type-card${t.status === "inactive" ? " lm-type-card--inactive" : ""}`} data-testid={`school-card-lm-type-${t.id}`}>
            <div className="lm-type-card__icon">{t.icon}</div>
            <div className="lm-type-card__name">{t.name}</div>
            <div className="lm-type-card__desc">{t.description}</div>
            <div className="lm-type-card__stats">
              <div><div className="lm-type-card__stat-val">{t.maxDays}</div><div className="lm-type-card__stat-lbl">Max Days</div></div>
              <div><div className="lm-type-card__stat-val">{t.activeCount}</div><div className="lm-type-card__stat-lbl">Active</div></div>
            </div>
            <div className="lm-type-card__actions">
              <span style={{ fontSize: ".75rem", color: "var(--lm-muted)" }}>{t.paid ? "💰 Paid" : "📋 Unpaid"} · {t.eligibility}</span>
              <button
                className={`lm-btn lm-btn--xs ${t.status === "active" ? "lm-btn--warning" : "lm-btn--success"}`}
                onClick={() => onToggleStatus(t.id)}
                style={{ marginLeft: "auto" }}
                data-testid={`school-button-lm-type-toggle-${t.id}`}
              >
                {t.status === "active" ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BalancesView({ balances }) {
  const TYPE_MAP = Object.fromEntries(MOCK_LEAVE_TYPES.map(t => [t.id, t]));
  return (
    <div className="lm-balance-grid" data-testid="school-grid-lm-balances">
      {balances.map(emp => (
        <div key={emp.employeeId} className="lm-balance-card" data-testid={`school-card-lm-balance-${emp.employeeId}`}>
          <div className="lm-balance-card__header">
            <Avatar name={emp.name} initials={emp.initials} color={emp.avatarColor} size={36} />
            <div>
              <div className="lm-balance-card__name">{emp.name}</div>
              <div className="lm-balance-card__dept">{emp.desig} · {emp.dept}</div>
            </div>
          </div>
          <div className="lm-balance-card__body">
            {emp.balances.map(b => {
              const typeCfg = TYPE_CONFIGS[b.id] || {};
              return (
                <div key={b.id} data-testid={`school-balance-lm-${emp.employeeId}-${b.id}`}>
                  <div className="lm-bal-row__top">
                    <span className="lm-bal-row__label">{typeCfg.icon || "📋"} {TYPE_MAP[b.id]?.name || b.id}</span>
                    <div className="lm-bal-row__stats">
                      <span className="lm-bal-row__stat">Used: <span>{b.used}</span></span>
                      <span className="lm-bal-row__stat">Left: <span>{b.remaining}</span></span>
                    </div>
                  </div>
                  <BalanceBar used={b.used} total={b.total} color={typeCfg.color} />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function CalendarView({ requests, calYear, calMonth, setCalYear, setCalMonth }) {
  const today = new Date();
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const approvedRequests = requests.filter(r => r.status === "approved");

  function getLeavesOnDay(day) {
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return approvedRequests.filter(r => r.startDate <= dateStr && r.endDate >= dateStr);
  }

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push({ day: null });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d });

  const prevMonth = () => { if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); } else setCalMonth(m => m - 1); };
  const nextMonth = () => { if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); } else setCalMonth(m => m + 1); };

  return (
    <div className="lm-cal-wrap" data-testid="school-calendar-lm">
      <div className="lm-cal-header">
        <div className="lm-cal-header__title">{MONTH_NAMES[calMonth]} {calYear}</div>
        <div className="lm-cal-header__nav">
          <button className="lm-btn lm-btn--ghost lm-btn--sm" onClick={prevMonth} data-testid="school-button-lm-cal-prev">‹ Prev</button>
          <button className="lm-btn lm-btn--ghost lm-btn--sm" onClick={() => { setCalYear(today.getFullYear()); setCalMonth(today.getMonth()); }} data-testid="school-button-lm-cal-today">Today</button>
          <button className="lm-btn lm-btn--ghost lm-btn--sm" onClick={nextMonth} data-testid="school-button-lm-cal-next">Next ›</button>
        </div>
      </div>
      <div className="lm-cal-day-names">
        {DAY_NAMES.map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="lm-cal-days">
        {cells.map((cell, i) => {
          if (!cell.day) return <div key={`e-${i}`} className="lm-cal-day lm-cal-day--other-month" />;
          const isToday = today.getFullYear() === calYear && today.getMonth() === calMonth && today.getDate() === cell.day;
          const dow = (firstDay + cell.day - 1) % 7;
          const isWeekend = dow === 0 || dow === 6;
          const leaves = getLeavesOnDay(cell.day);
          return (
            <div key={cell.day} className={`lm-cal-day${isToday ? " lm-cal-day--today" : ""}${isWeekend ? " lm-cal-day--weekend" : ""}`} data-testid={`school-cal-day-lm-${cell.day}`}>
              <div className="lm-cal-day__num">{cell.day}</div>
              <div className="lm-cal-day__leaves">
                {leaves.slice(0, 3).map(r => {
                  const cfg = TYPE_CONFIGS[r.leaveType] || {};
                  return (
                    <div key={r.id} className="lm-cal-leave-chip" style={{ background: cfg.color || "#c9a962" }} title={`${r.name} – ${r.leaveType}`}>
                      {r.initials}
                    </div>
                  );
                })}
                {leaves.length > 3 && <div className="lm-cal-leave-chip" style={{ background: "#6b7280" }}>+{leaves.length - 3}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SubstitutesView({ substitutes }) {
  const statusColors = { active: "#16a34a", completed: "#6b7280", pending: "#d97706" };
  return (
    <div className="lm-sub-grid" data-testid="school-grid-lm-substitutes">
      {substitutes.map(s => (
        <div key={s.id} className="lm-sub-card" data-testid={`school-card-lm-sub-${s.id}`}>
          <div className="lm-sub-card__header">
            <span className="lm-sub-card__title">Substitution #{s.id}</span>
            <span className="lm-status-badge" style={{ background: `rgba(${s.status === "active" ? "22,163,74" : s.status === "pending" ? "217,119,6" : "107,114,128"},.12)`, color: statusColors[s.status] }}>
              {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
            </span>
          </div>
          <div className="lm-sub-card__emp">
            <Avatar name={s.absentEmp.name} initials={s.absentEmp.initials} color={s.absentEmp.color} size={28} />
            <div>
              <div style={{ fontSize: ".8125rem", fontWeight: 500 }}>{s.absentEmp.name}</div>
              <div style={{ fontSize: ".75rem", color: "var(--lm-muted)" }}>On Leave</div>
            </div>
          </div>
          <div className="lm-sub-card__arrow">↓ covered by</div>
          <div className="lm-sub-card__emp">
            <Avatar name={s.subEmp.name} initials={s.subEmp.initials} color={s.subEmp.color} size={28} />
            <div>
              <div style={{ fontSize: ".8125rem", fontWeight: 500 }}>{s.subEmp.name}</div>
              <div style={{ fontSize: ".75rem", color: "var(--lm-muted)" }}>Substitute</div>
            </div>
          </div>
          <div className="lm-sub-card__footer">
            <span>📅 {fmtDate(s.startDate)} – {fmtDate(s.endDate)}</span>
            <span>📚 {s.period}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function HistoryView({ history }) {
  return (
    <div className="lm-history-wrap" data-testid="school-table-lm-history">
      <div className="lm-table-scroll">
        <table className="lm-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Leave Type</th>
              <th>Duration</th>
              <th>Days</th>
              <th>Status</th>
              <th>Actioned By</th>
              <th>Date</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {history.map(h => (
              <tr key={h.id}>
                <td>
                  <div className="lm-cell-emp">
                    <Avatar name={h.name} initials={h.initials} color={h.avatarColor} />
                    <div>
                      <div className="lm-cell-title">{h.name}</div>
                      <div className="lm-cell-sub">{h.dept}</div>
                    </div>
                  </div>
                </td>
                <td><TypeBadge type={h.leaveType} /></td>
                <td><span className="lm-cell-mono">{fmtDate(h.startDate)} – {fmtDate(h.endDate)}</span></td>
                <td><span style={{ fontWeight: 600 }}>{h.totalDays}</span></td>
                <td><StatusBadge status={h.status} /></td>
                <td><span className="lm-cell-muted">{h.actedBy}</span></td>
                <td><span className="lm-cell-muted">{fmtDate(h.actedOn)}</span></td>
                <td><span className="lm-cell-muted" style={{ maxWidth: 180, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.remarks}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
/**
 * LeaveManagement — enterprise-grade leave management dashboard.
 * Prefix: lm-  |  testid pattern: school-{type}-lm-{name}
 */
export default function LeaveManagement() {
  const [requests,    setRequests]    = useState(MOCK_LEAVE_REQUESTS);
  const [leaveTypes,  setLeaveTypes]  = useState(MOCK_LEAVE_TYPES);
  const [search,      setSearch]      = useState("");
  const [filterDept,  setFilterDept]  = useState("all");
  const [filterType,  setFilterType]  = useState("all");
  const [filterStatus,setFilterStatus]= useState("all");
  const [activeTab,   setActiveTab]   = useState("requests");
  const [page,        setPage]        = useState(1);
  const [viewMode,    setViewMode]    = useState("table");
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [selRequest,  setSelRequest]  = useState(null);
  const [toast,       setToast]       = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [calYear,     setCalYear]     = useState(new Date().getFullYear());
  const [calMonth,    setCalMonth]    = useState(new Date().getMonth());

  // ── Computed ───────────────────────────────────────────────────────────────
  const filtered = useMemo(() => requests.filter(r =>
    (filterStatus === "all" || r.status === filterStatus) &&
    (filterDept   === "all" || r.dept === filterDept) &&
    (filterType   === "all" || r.leaveType === filterType) &&
    (search === "" || r.name.toLowerCase().includes(search.toLowerCase()) || r.reason.toLowerCase().includes(search.toLowerCase()) || r.dept.toLowerCase().includes(search.toLowerCase()))
  ), [requests, search, filterStatus, filterDept, filterType]);

  const metrics = useMemo(() => computeMetrics(requests), [requests]);

  const tabCounts = useMemo(() => ({
    requests: requests.filter(r => r.status === "pending").length,
    types: leaveTypes.length,
    balances: MOCK_BALANCES.length,
    calendar: requests.filter(r => r.status === "approved").length,
    substitutes: MOCK_SUBSTITUTES.length,
    history: MOCK_HISTORY.length,
  }), [requests, leaveTypes]);

  const hasActiveFilters = search || filterDept !== "all" || filterType !== "all" || filterStatus !== "all";

  // ── Handlers ───────────────────────────────────────────────────────────────
  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const closeModal = useCallback(() => { setActiveModal(null); setSelRequest(null); }, []);

  const resetFilters = useCallback(() => {
    setSearch(""); setFilterDept("all"); setFilterType("all"); setFilterStatus("all"); setPage(1);
  }, []);

  const handleView    = useCallback((r) => { setSelRequest(r); setActiveModal("view");    }, []);
  const handleApprove = useCallback((r) => { setSelRequest(r); setActiveModal("approve"); }, []);
  const handleReject  = useCallback((r) => { setSelRequest(r); setActiveModal("reject");  }, []);

  const confirmAction = useCallback((req, remarks, action) => {
    setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: action, approvedBy: "Principal", remarks } : r));
    closeModal();
    showToast(`Leave request ${action === "approved" ? "approved" : "rejected"} for ${req.name}.`, action === "approved" ? "success" : "warn");
  }, [closeModal, showToast]);

  const handleSaveRequest = useCallback((data) => {
    const next = {
      ...data,
      id: requests.length + 1,
      employeeId: `E${String(requests.length + 1).padStart(3, "0")}`,
      initials: data.name.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase(),
      avatarColor: "#c9a962",
      desig: "Staff",
    };
    setRequests(prev => [next, ...prev]);
    closeModal();
    showToast("Leave request submitted successfully.", "success");
  }, [requests.length, closeModal, showToast]);

  const handleToggleLeaveTypeStatus = useCallback((id) => {
    setLeaveTypes(prev => prev.map(t => t.id === id ? { ...t, status: t.status === "active" ? "inactive" : "active" } : t));
  }, []);

  const handleCreateLeaveType = useCallback((data) => {
    setLeaveTypes(prev => [...prev, data]);
    closeModal();
    showToast(`Leave type "${data.name}" created.`, "success");
  }, [closeModal, showToast]);

  const handleToggleSelect = useCallback((id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const handleSelectAll = useCallback((items, checked) => {
    if (checked) setSelectedIds(prev => [...new Set([...prev, ...items.map(r => r.id)])]);
    else setSelectedIds(prev => prev.filter(id => !items.map(r => r.id).includes(id)));
  }, []);

  const handleBulkApprove = useCallback(() => {
    setRequests(prev => prev.map(r => selectedIds.includes(r.id) && r.status === "pending" ? { ...r, status: "approved", approvedBy: "Principal" } : r));
    showToast(`${selectedIds.length} requests approved.`, "success");
    setSelectedIds([]);
  }, [selectedIds, showToast]);

  const handleBulkReject = useCallback(() => {
    setRequests(prev => prev.map(r => selectedIds.includes(r.id) && r.status === "pending" ? { ...r, status: "rejected", approvedBy: "Principal" } : r));
    showToast(`${selectedIds.length} requests rejected.`, "warn");
    setSelectedIds([]);
  }, [selectedIds, showToast]);

  const handleBulkExport = useCallback(() => {
    const csv = ["ID,Name,Department,Type,Start,End,Days,Status"]
      .concat(requests.filter(r => selectedIds.includes(r.id)).map(r =>
        [r.id, r.name, r.dept, r.leaveType, r.startDate, r.endDate, r.totalDays, r.status].join(",")
      )).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "leave_requests.csv"; a.click();
    URL.revokeObjectURL(url);
    showToast("Export downloaded.", "info");
  }, [requests, selectedIds, showToast]);

  const TABS = [
    { id: "requests",   label: "Requests",    countKey: "requests"   },
    { id: "types",      label: "Leave Types", countKey: "types"      },
    { id: "balances",   label: "Balances",    countKey: "balances"   },
    { id: "calendar",   label: "Calendar",    countKey: "calendar"   },
    { id: "substitutes",label: "Substitutes", countKey: "substitutes"},
    { id: "history",    label: "History",     countKey: "history"    },
  ];

  return (
    <div className="lm-root" data-testid="school-page-lm">

      <ManagementPageHeader
        breadcrumbs={[
          { label: "Dashboard" },
          { label: "Leave Management" },
        ]}
        title="Leave Management"
        subtitle="Manage employee leave requests, balances, and approvals."
        actions={(
          <>
            <button className="lm-btn lm-btn--ghost" onClick={() => showToast("Report generated.", "info")} data-testid="school-button-lm-report">📊 Report</button>
            <button className="lm-btn lm-btn--primary" onClick={() => setActiveModal("apply")} data-testid="school-button-lm-apply">+ Apply Leave</button>
          </>
        )}
      />

      {/* ── Metrics ────────────────────────────────────────────────────────── */}
      <div className="lm-metrics" data-testid="school-grid-lm-metrics">
        {LEAVE_METRICS_DEF.map(m => (
          <div key={m.id} className={`lm-metric-card lm-metric-card--${m.color}`} data-testid={`school-metric-lm-${m.id}`}>
            <div className="lm-metric-card__icon">{m.icon}</div>
            <div className="lm-metric-card__body">
              <span className="lm-metric-card__value">{metrics[m.id]}</span>
              <span className="lm-metric-card__label">{m.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────────────── */}
      <div className="lm-tabs" role="tablist" data-testid="school-tabs-lm">
        {TABS.map(t => (
          <button
            key={t.id}
            role="tab"
            className={`lm-tab${activeTab === t.id ? " lm-tab--active" : ""}`}
            onClick={() => { setActiveTab(t.id); setPage(1); setSelectedIds([]); }}
            aria-selected={activeTab === t.id}
            data-testid={`school-tab-lm-${t.id}`}
          >
            {t.label}
            <span className="lm-tab__count">{tabCounts[t.countKey]}</span>
          </button>
        ))}
      </div>

      {/* ── Toolbar (requests tab only) ────────────────────────────────────── */}
      {activeTab === "requests" && (
        <>
          <div className="lm-toolbar" data-testid="school-toolbar-lm">
            <div className="lm-search" data-testid="school-search-lm">
              <span className="lm-search__icon">🔍</span>
              <input
                type="text"
                placeholder="Search by name, department, reason…"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                aria-label="Search leave requests"
                data-testid="school-input-lm-search"
              />
              {search && (
                <button className="lm-search__clear" onClick={() => { setSearch(""); setPage(1); }} aria-label="Clear search" data-testid="school-button-lm-clear-search">✕</button>
              )}
            </div>

            <button
              className="lm-toolbar__filters-toggle"
              onClick={() => setFiltersOpen(p => !p)}
              aria-expanded={filtersOpen}
              data-testid="school-button-lm-toggle-filters"
            >
              ⚙ Filters {filtersOpen ? "▲" : "▼"}
            </button>

            <div className={`lm-toolbar__filters${filtersOpen ? "" : " lm-toolbar__filters--hidden"}`}>
              <select className="lm-filter-select" value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }} aria-label="Filter by status" data-testid="school-dropdown-lm-status">
                {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <select className="lm-filter-select" value={filterDept} onChange={e => { setFilterDept(e.target.value); setPage(1); }} aria-label="Filter by department" data-testid="school-dropdown-lm-dept">
                {DEPT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <select className="lm-filter-select" value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1); }} aria-label="Filter by leave type" data-testid="school-dropdown-lm-type">
                {TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              {hasActiveFilters && (
                <button className="lm-btn lm-btn--ghost lm-btn--sm" onClick={resetFilters} data-testid="school-button-lm-clear-filters">✕ Clear</button>
              )}
            </div>

            <div className="lm-toolbar__right">
              <div className="lm-view-toggle" aria-label="Toggle view mode" data-testid="school-view-toggle-lm">
                <button className={viewMode === "table" ? "active" : ""} onClick={() => setViewMode("table")} title="Table view" data-testid="school-button-lm-view-table">☰</button>
                <button className={viewMode === "cards" ? "active" : ""} onClick={() => setViewMode("cards")} title="Card view"  data-testid="school-button-lm-view-cards">⊞</button>
              </div>
            </div>
          </div>

          <div className="lm-results-bar" data-testid="school-results-bar-lm">
            <span className="lm-results-bar__count">
              {filtered.length} request{filtered.length !== 1 ? "s" : ""}
              {hasActiveFilters && <span style={{ color: "#c9a962", marginLeft: ".375rem" }}>· filtered</span>}
            </span>
          </div>
        </>
      )}

      {/* ── Tab Content ────────────────────────────────────────────────────── */}
      <div role="tabpanel" data-testid={`school-panel-lm-${activeTab}`}>
        {activeTab === "requests" && (
          <RequestsView
            requests={filtered}
            viewMode={viewMode}
            onView={handleView}
            onApprove={handleApprove}
            onReject={handleReject}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onSelectAll={handleSelectAll}
            onBulkApprove={handleBulkApprove}
            onBulkReject={handleBulkReject}
            onBulkExport={handleBulkExport}
            page={page}
            setPage={setPage}
          />
        )}
        {activeTab === "types" && (
          <LeaveTypesView
            leaveTypes={leaveTypes}
            onCreateType={() => setActiveModal("create-type")}
            onToggleStatus={handleToggleLeaveTypeStatus}
          />
        )}
        {activeTab === "balances"    && <BalancesView balances={MOCK_BALANCES} />}
        {activeTab === "calendar"    && <CalendarView requests={requests} calYear={calYear} calMonth={calMonth} setCalYear={setCalYear} setCalMonth={setCalMonth} />}
        {activeTab === "substitutes" && <SubstitutesView substitutes={MOCK_SUBSTITUTES} />}
        {activeTab === "history"     && <HistoryView history={MOCK_HISTORY} />}
      </div>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      {activeModal === "apply" && (
        <ApplyLeaveModal onClose={closeModal} onSave={handleSaveRequest} editData={null} />
      )}
      {activeModal === "view" && selRequest && (
        <ViewRequestModal
          request={selRequest}
          onClose={closeModal}
          onApprove={(r) => { closeModal(); setTimeout(() => handleApprove(r), 50); }}
          onReject={(r)  => { closeModal(); setTimeout(() => handleReject(r),  50); }}
        />
      )}
      {activeModal === "approve" && selRequest && (
        <ApprovalModal request={selRequest} action="approve" onClose={closeModal} onConfirm={(r, rm) => confirmAction(r, rm, "approved")} />
      )}
      {activeModal === "reject" && selRequest && (
        <ApprovalModal request={selRequest} action="reject"  onClose={closeModal} onConfirm={(r, rm) => confirmAction(r, rm, "rejected")} />
      )}
      {activeModal === "create-type" && (
        <CreateLeaveTypeModal onClose={closeModal} onSave={handleCreateLeaveType} />
      )}

      {/* ── Toast ──────────────────────────────────────────────────────────── */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

