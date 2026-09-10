import React from "react";
import { createInitialState } from "../../utils/createReducer";
import { grievancesReducer } from "./reducer";
import { computeMetrics } from "./grievancesMockData";

export const GrievancesContext = React.createContext();

export const initialState = createInitialState({
  // Data
  grievances: [],

  // Filtering & Sorting
  filters: {
    search: '',
    category: null,
    priority: null,
    status: null,
    assignedTo: null,
    complainantType: null,
    dateRange: null,
  },
  sort: { field: 'createdDate', order: 'desc' },
  currentPage: 1,
  pageSize: 10,

  // Selection (Bulk Operations)
  selectedGrievances: [],

  // UI State - Drawer
  drawerOpen: false,
  selectedGrievanceId: null,

  // UI State - Modals
  modal: null, // { type: 'assign'|'escalate'|'resolve'|'note'|'bulk'|'confirm', data: {...} }

  // UI State - Notifications
  toast: null, // { message: '', type: 'success'|'error'|'warning' }

  // Loading & Error States
  loading: false,
  error: null,

  // Metrics (auto-computed)
  metrics: computeMetrics([]),
});

export { grievancesReducer };
