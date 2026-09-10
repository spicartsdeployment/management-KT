import { createReducer } from "../../utils/createReducer";
import { computeMetrics } from "./grievancesMockData";

const grievancesSpecificHandler = (state, action) => {
  switch (action.type) {
    // ─── Data Management ─────────────────────────────────────────
    case "SET_GRIEVANCES":
      return {
        ...state,
        grievances: action.payload,
        metrics: computeMetrics(action.payload),
      };

    case "UPDATE_GRIEVANCE":
      return {
        ...state,
        grievances: state.grievances.map((g) =>
          g.id === action.payload.id ? { ...g, ...action.payload.data, lastUpdated: new Date().toISOString() } : g
        ),
        metrics: computeMetrics(state.grievances.map((g) =>
          g.id === action.payload.id ? { ...g, ...action.payload.data } : g
        )),
      };

    case "DELETE_GRIEVANCE":
      const filtered = state.grievances.filter((g) => g.id !== action.payload);
      return {
        ...state,
        grievances: filtered,
        metrics: computeMetrics(filtered),
      };

    // ─── Filtering & Sorting ───────────────────────────────────────
    case "SET_FILTER_SEARCH":
      return { ...state, filters: { ...state.filters, search: action.payload }, currentPage: 1 };

    case "SET_FILTER_CATEGORY":
      return { ...state, filters: { ...state.filters, category: action.payload }, currentPage: 1 };

    case "SET_FILTER_PRIORITY":
      return { ...state, filters: { ...state.filters, priority: action.payload }, currentPage: 1 };

    case "SET_FILTER_STATUS":
      return { ...state, filters: { ...state.filters, status: action.payload }, currentPage: 1 };

    case "SET_FILTER_ASSIGNED_TO":
      return { ...state, filters: { ...state.filters, assignedTo: action.payload }, currentPage: 1 };

    case "SET_FILTER_COMPLAINANT_TYPE":
      return { ...state, filters: { ...state.filters, complainantType: action.payload }, currentPage: 1 };

    case "SET_FILTER_DATE_RANGE":
      return { ...state, filters: { ...state.filters, dateRange: action.payload }, currentPage: 1 };

    case "CLEAR_FILTERS":
      return {
        ...state,
        filters: {
          search: '',
          category: null,
          priority: null,
          status: null,
          assignedTo: null,
          complainantType: null,
          dateRange: null,
        },
        currentPage: 1,
      };

    case "SET_SORT":
      return { ...state, sort: action.payload, currentPage: 1 };

    case "SET_PAGE":
      return { ...state, currentPage: action.payload };

    // ─── Selection (Bulk Operations) ────────────────────────────────
    case "TOGGLE_GRIEVANCE_SELECT":
      return {
        ...state,
        selectedGrievances: state.selectedGrievances.includes(action.payload)
          ? state.selectedGrievances.filter((id) => id !== action.payload)
          : [...state.selectedGrievances, action.payload],
      };

    case "SELECT_ALL_GRIEVANCES":
      return {
        ...state,
        selectedGrievances: action.payload ? state.grievances.map((g) => g.id) : [],
      };

    case "CLEAR_SELECTION":
      return { ...state, selectedGrievances: [] };

    // ─── Drawer (Details View) ─────────────────────────────────────
    case "OPEN_DRAWER":
      return { ...state, drawerOpen: true, selectedGrievanceId: action.payload };

    case "CLOSE_DRAWER":
      return { ...state, drawerOpen: false, selectedGrievanceId: null };

    // ─── Modal Management ──────────────────────────────────────────
    case "SET_MODAL":
      return { ...state, modal: action.payload };

    case "CLOSE_MODAL":
      return { ...state, modal: null };

    // ─── Toast Notifications ───────────────────────────────────────
    case "SET_TOAST":
      return { ...state, toast: action.payload };

    case "CLEAR_TOAST":
      return { ...state, toast: null };

    // ─── Grievance Actions ─────────────────────────────────────────
    case "ASSIGN_GRIEVANCE":
      return {
        ...state,
        grievances: state.grievances.map((g) =>
          g.id === action.payload.grievanceId
            ? { ...g, assignedTo: action.payload.roleId, status: 'assigned', lastUpdated: new Date().toISOString() }
            : g
        ),
        modal: null,
        toast: { message: 'Grievance assigned successfully', type: 'success' },
      };

    case "REASSIGN_GRIEVANCE":
      return {
        ...state,
        grievances: state.grievances.map((g) =>
          g.id === action.payload.grievanceId
            ? { ...g, assignedTo: action.payload.roleId, lastUpdated: new Date().toISOString() }
            : g
        ),
        modal: null,
        toast: { message: 'Grievance reassigned successfully', type: 'success' },
      };

    case "ESCALATE_GRIEVANCE":
      return {
        ...state,
        grievances: state.grievances.map((g) =>
          g.id === action.payload
            ? { ...g, status: 'escalated', priority: 'critical', lastUpdated: new Date().toISOString() }
            : g
        ),
        modal: null,
        toast: { message: 'Grievance escalated successfully', type: 'success' },
      };

    case "RESOLVE_GRIEVANCE":
      return {
        ...state,
        grievances: state.grievances.map((g) =>
          g.id === action.payload.grievanceId
            ? { ...g, status: 'resolved', lastUpdated: new Date().toISOString() }
            : g
        ),
        modal: null,
        toast: { message: 'Grievance resolved successfully', type: 'success' },
      };

    case "CLOSE_GRIEVANCE":
      return {
        ...state,
        grievances: state.grievances.map((g) =>
          g.id === action.payload
            ? { ...g, status: 'closed', lastUpdated: new Date().toISOString() }
            : g
        ),
        toast: { message: 'Grievance closed successfully', type: 'success' },
      };

    case "ADD_INTERNAL_NOTE":
      return {
        ...state,
        grievances: state.grievances.map((g) =>
          g.id === action.payload.grievanceId
            ? {
                ...g,
                internalNotes: [
                  ...g.internalNotes,
                  action.payload.note,
                ],
                lastUpdated: new Date().toISOString(),
              }
            : g
        ),
        modal: null,
        toast: { message: 'Internal note added', type: 'success' },
      };

    // ─── Bulk Operations ──────────────────────────────────────────
    case "BULK_ASSIGN":
      return {
        ...state,
        grievances: state.grievances.map((g) =>
          state.selectedGrievances.includes(g.id)
            ? { ...g, assignedTo: action.payload.roleId, status: 'assigned', lastUpdated: new Date().toISOString() }
            : g
        ),
        selectedGrievances: [],
        modal: null,
        toast: { message: `${state.selectedGrievances.length} grievances assigned successfully`, type: 'success' },
      };

    case "BULK_RESOLVE":
      return {
        ...state,
        grievances: state.grievances.map((g) =>
          state.selectedGrievances.includes(g.id)
            ? { ...g, status: 'resolved', lastUpdated: new Date().toISOString() }
            : g
        ),
        selectedGrievances: [],
        modal: null,
        toast: { message: `${state.selectedGrievances.length} grievances resolved successfully`, type: 'success' },
      };

    case "BULK_CLOSE":
      return {
        ...state,
        grievances: state.grievances.map((g) =>
          state.selectedGrievances.includes(g.id)
            ? { ...g, status: 'closed', lastUpdated: new Date().toISOString() }
            : g
        ),
        selectedGrievances: [],
        modal: null,
        toast: { message: `${state.selectedGrievances.length} grievances closed successfully`, type: 'success' },
      };

    // ─── Loading & Error States ───────────────────────────────────
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };

    default:
      return null;
  }
};

export const grievancesReducer = createReducer(grievancesSpecificHandler);
