// ─── System Preferences Mock Data ────────────────────────────────────────────

export const SP_METRICS = [
  { id: "preference-profiles", icon: "🎛️", value: 3,     label: "Active Preference Profiles", trend: "1 active this session", color: "primary" },
  { id: "customized-settings", icon: "⚙️", value: 47,    label: "Customized Settings",         trend: "vs 0 defaults",          color: "info" },
  { id: "a11y-features",       icon: "♿", value: 4,     label: "Accessibility Features On",   trend: "high contrast, reduced motion +2", color: "success" },
  { id: "active-sessions",     icon: "🖥️", value: 2,     label: "Active Sessions",             trend: "2 tabs open",             color: "warning" },
  { id: "theme-usage",         icon: "🎨", value: "Dark", label: "Current Theme",              trend: "system sync enabled",     color: "secondary" },
  { id: "device-type",         icon: "📱", value: "Desktop", label: "Device Mode",            trend: "1440px viewport",         color: "neutral" },
];

export const DASHBOARD_WIDGETS = [
  { id: "enrollment-summary",  label: "Enrollment Summary",   visible: true,  pinned: true  },
  { id: "fee-collection",      label: "Fee Collection",        visible: true,  pinned: true  },
  { id: "attendance-overview", label: "Attendance Overview",   visible: true,  pinned: false },
  { id: "academic-calendar",   label: "Academic Calendar",     visible: false, pinned: false },
  { id: "staff-directory",     label: "Staff Directory",       visible: true,  pinned: false },
  { id: "transport-status",    label: "Transport Status",      visible: false, pinned: false },
  { id: "notice-board",        label: "Notice Board",          visible: true,  pinned: false },
  { id: "pending-approvals",   label: "Pending Approvals",     visible: true,  pinned: true  },
  { id: "analytics-snapshot",  label: "Analytics Snapshot",    visible: false, pinned: false },
  { id: "grievance-tracker",   label: "Grievance Tracker",     visible: false, pinned: false },
];

export const LANDING_PAGE_OPTIONS = [
  { value: "dashboard",    label: "Dashboard" },
  { value: "students",     label: "Student Enrollment" },
  { value: "fee",          label: "Fee Management" },
  { value: "attendance",   label: "Attendance" },
  { value: "academic",     label: "Academic Setup" },
  { value: "staff",        label: "Staff Directory" },
  { value: "transport",    label: "Transport" },
  { value: "announcements",label: "Announcements" },
];

export const REFRESH_INTERVALS = [
  { value: "off",    label: "Off" },
  { value: "30s",    label: "30 seconds" },
  { value: "1min",   label: "1 minute" },
  { value: "5min",   label: "5 minutes" },
  { value: "15min",  label: "15 minutes" },
  { value: "30min",  label: "30 minutes" },
];

export const LANGUAGE_OPTIONS = [
  { value: "en-US",  label: "English (US)" },
  { value: "en-GB",  label: "English (UK)" },
  { value: "hi-IN",  label: "Hindi (India)" },
  { value: "ta-IN",  label: "Tamil (India)" },
  { value: "te-IN",  label: "Telugu (India)" },
  { value: "ml-IN",  label: "Malayalam" },
  { value: "fr-FR",  label: "French" },
  { value: "ar-SA",  label: "Arabic" },
  { value: "zh-CN",  label: "Chinese (Simplified)" },
];

export const TIMEZONE_OPTIONS = [
  { value: "Asia/Kolkata",       label: "IST — India Standard Time (UTC+5:30)" },
  { value: "America/New_York",   label: "EST — Eastern Standard Time (UTC-5)" },
  { value: "America/Los_Angeles",label: "PST — Pacific Standard Time (UTC-8)" },
  { value: "Europe/London",      label: "GMT — Greenwich Mean Time (UTC+0)" },
  { value: "Europe/Paris",       label: "CET — Central European Time (UTC+1)" },
  { value: "Asia/Dubai",         label: "GST — Gulf Standard Time (UTC+4)" },
  { value: "Asia/Singapore",     label: "SGT — Singapore Time (UTC+8)" },
  { value: "Australia/Sydney",   label: "AEST — Australian Eastern Time (UTC+10)" },
];

export const DATE_FORMAT_OPTIONS = [
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY (e.g. 21/05/2026)" },
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY (e.g. 05/21/2026)" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD (e.g. 2026-05-21)" },
  { value: "D MMM YYYY", label: "D MMM YYYY (e.g. 21 May 2026)" },
  { value: "MMM D, YYYY",label: "MMM D, YYYY (e.g. May 21, 2026)" },
];

export const NUMBER_FORMAT_OPTIONS = [
  { value: "en-IN", label: "Indian (1,00,000.00)" },
  { value: "en-US", label: "US (100,000.00)" },
  { value: "de-DE", label: "European (100.000,00)" },
];

export const CURRENCY_DISPLAY_OPTIONS = [
  { value: "symbol", label: "Symbol (₹)" },
  { value: "code",   label: "Code (INR)" },
  { value: "name",   label: "Name (Indian Rupee)" },
];

export const PAGE_SIZE_OPTIONS = [
  { value: "10",  label: "10 rows" },
  { value: "20",  label: "20 rows" },
  { value: "25",  label: "25 rows" },
  { value: "50",  label: "50 rows" },
  { value: "100", label: "100 rows" },
];

export const EXPORT_FORMAT_OPTIONS = [
  { value: "xlsx", label: "Excel (.xlsx)" },
  { value: "csv",  label: "CSV (.csv)" },
  { value: "pdf",  label: "PDF (.pdf)" },
  { value: "json", label: "JSON (.json)" },
];

export const FONT_SCALE_OPTIONS = [
  { value: "xs",  label: "Extra Small (80%)" },
  { value: "sm",  label: "Small (90%)" },
  { value: "md",  label: "Normal (100%)" },
  { value: "lg",  label: "Large (110%)" },
  { value: "xl",  label: "Extra Large (125%)" },
];

export const UI_DENSITY_OPTIONS = [
  { value: "compact",     label: "Compact" },
  { value: "comfortable", label: "Comfortable" },
  { value: "spacious",    label: "Spacious" },
];

export const SIDEBAR_WIDTH_OPTIONS = [
  { value: "220px", label: "Narrow (220px)" },
  { value: "260px", label: "Default (260px)" },
  { value: "300px", label: "Wide (300px)" },
];

export const THEME_COLOR_PRESETS = [
  { value: "gold",   label: "Gold (Default)", hex: "#C9A962" },
  { value: "blue",   label: "Blue",           hex: "#2563EB" },
  { value: "purple", label: "Purple",         hex: "#7C3AED" },
  { value: "green",  label: "Green",          hex: "#16A34A" },
  { value: "teal",   label: "Teal",           hex: "#0D9488" },
  { value: "rose",   label: "Rose",           hex: "#E11D48" },
];

export const IDLE_TIMEOUT_OPTIONS = [
  { value: "5",   label: "5 minutes" },
  { value: "10",  label: "10 minutes" },
  { value: "15",  label: "15 minutes" },
  { value: "30",  label: "30 minutes" },
  { value: "60",  label: "1 hour" },
  { value: "never", label: "Never" },
];

export const AUTO_LOGOUT_OPTIONS = [
  { value: "15",    label: "15 minutes" },
  { value: "30",    label: "30 minutes" },
  { value: "60",    label: "1 hour" },
  { value: "120",   label: "2 hours" },
  { value: "480",   label: "8 hours (full day)" },
  { value: "never", label: "Never" },
];

export const MULTI_TAB_OPTIONS = [
  { value: "allow",   label: "Allow multiple tabs" },
  { value: "warn",    label: "Warn on duplicate tab" },
  { value: "single",  label: "Enforce single tab" },
];

export const DEFAULT_SORT_OPTIONS = [
  { value: "asc",  label: "Ascending (A → Z)" },
  { value: "desc", label: "Descending (Z → A)" },
  { value: "none", label: "No default sort" },
];

export const CONTENT_WIDTH_OPTIONS = [
  { value: "fluid",  label: "Fluid (full width)" },
  { value: "1280",   label: "Capped (1280px)" },
  { value: "1440",   label: "Capped (1440px)" },
  { value: "1600",   label: "Capped (1600px)" },
];

export const NAVIGATION_MODE_OPTIONS = [
  { value: "sidebar",     label: "Sidebar Navigation" },
  { value: "topbar",      label: "Top Navigation Bar" },
  { value: "hybrid",      label: "Hybrid (Sidebar + Topbar)" },
];

export const MODAL_DRAWER_OPTIONS = [
  { value: "modal",  label: "Modal Dialogs" },
  { value: "drawer", label: "Side Drawers" },
  { value: "auto",   label: "Auto (device-based)" },
];

export const DEFAULT_PREFERENCES = {
  // Dashboard
  landingPage:         "dashboard",
  dashboardDensity:    "comfortable",
  dashboardRefresh:    "5min",
  dashboardLayoutMode: "grid",
  // Layout
  navigationMode:      "sidebar",
  sidebarWidth:        "260px",
  sidebarCollapsible:  true,
  sidebarFixed:        true,
  sidebarCompact:      false,
  contentWidth:        "fluid",
  // Theme
  theme:               "dark",
  systemThemeSync:     true,
  fontScale:           "md",
  uiDensity:           "comfortable",
  themeColor:          "gold",
  // Accessibility
  highContrast:        false,
  reducedMotion:       false,
  keyboardNavigation:  true,
  screenReaderOpt:     false,
  largerText:          false,
  focusVisibility:     true,
  // Localization
  language:            "en-US",
  timezone:            "Asia/Kolkata",
  dateFormat:          "DD/MM/YYYY",
  numberFormat:        "en-IN",
  currencyDisplay:     "symbol",
  // Date & Time
  use24Hour:           false,
  showSeconds:         false,
  showRelativeTime:    true,
  // Session
  autoLogout:          "60",
  idleTimeout:         "15",
  rememberSession:     true,
  multiTabBehavior:    "allow",
  sessionRestore:      true,
  // Navigation
  defaultNav:          "dashboard",
  rememberLastPage:    true,
  breadcrumbs:         true,
  quickAccess:         true,
  // Table & Pagination
  pageSize:            "20",
  stickyHeaders:       true,
  tableDensity:        "comfortable",
  defaultSort:         "asc",
  showColumnControls:  true,
  exportOnOpen:        false,
  // Search
  instantSearch:       true,
  recentSearches:      true,
  searchSuggestions:   true,
  globalSearch:        true,
  // Auto Refresh
  liveData:            true,
  autoSync:            true,
  backgroundRefresh:   false,
  globalRefreshRate:   "5min",
  // File & Download
  exportFormat:        "xlsx",
  autoDownload:        false,
  previewAttachments:  true,
  // Workflow
  confirmDialogs:      true,
  autosave:            true,
  modalPreference:     "modal",
  navigationMemory:    true,
  workflowShortcuts:   true,
  // Device & Display
  touchOptimization:   false,
  fullscreenMode:      false,
  displayDensity:      "comfortable",
  responsiveScaling:   true,
};
