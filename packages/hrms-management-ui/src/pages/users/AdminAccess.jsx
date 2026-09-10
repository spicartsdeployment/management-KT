import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import "../../Assets/styles/AdminAccess.scss";
import ManagementPageHeader from "../../app/components/common/ManagementPageHeader";
import {
  MOCK_ADMINS,
  ACCESS_LEVELS,
  ADMIN_METRICS,
  DEPARTMENTS,
  SAMPLE_USERS,
  LEVEL_OPTIONS,
  STATUS_OPTIONS,
  computeMetrics,
} from "./adminAccessMockData";

// ─── Helpers ──────────────────────────────────────────────────────────────────
/**
 * Format an ISO timestamp as a relative string (e.g. "12m ago").
 * @param {string|null} iso
 * @returns {string}
 */
const fmtRelative = (iso) => {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

/**
 * Returns ACCESS_LEVELS config for a given value.
 * @param {string} val
 * @returns {object}
 */
const getLevel = (val) =>
  ACCESS_LEVELS.find((l) => l.value === val) || { color: "#6b7280", bg: "rgba(107,114,128,.1)", label: val };

// ─── Sub-components ───────────────────────────────────────────────────────────
/**
 * Circular avatar with initials.
 */
const AdminAvatar = ({ admin, size = 36 }) => (
  <span
    className="aa-avatar"
    style={{ width: size, height: size, fontSize: size * 0.35, background: admin.avatarColor }}
    aria-label={admin.name}
  >
    {admin.initials}
  </span>
);

/**
 * Colored access-level chip.
 */
const LevelBadge = ({ value }) => {
  const lvl = getLevel(value);
  return (
    <span
      className="aa-level-badge"
      style={{ color: lvl.color, background: lvl.bg, borderColor: lvl.color + "33" }}
    >
      {lvl.label}
    </span>
  );
};

/**
 * Status pill (active / inactive / suspended).
 */
const StatusBadge = ({ status }) => (
  <span className={`aa-badge aa-badge--${status}`}>{status}</span>
);

/**
 * Session indicator dot.
 */
const SessionDot = ({ status }) => (
  <span className="aa-session">
    <span className={`aa-session__dot aa-session__dot--${status}`} />
    {status === "online" ? "Online" : "Offline"}
  </span>
);

// ─── Modals ───────────────────────────────────────────────────────────────────

/** Grant Admin Access modal */
const GrantModal = ({ onClose, onGrant }) => {
  const [userSearch, setUserSearch]       = useState("");
  const [showDrop, setShowDrop]           = useState(false);
  const [selectedUser, setSelectedUser]   = useState(null);
  const [accessLevel, setAccessLevel]     = useState("");
  const [department, setDepartment]       = useState("");
  const [status, setStatus]               = useState("active");
  const [remarks, setRemarks]             = useState("");
  const [errors, setErrors]               = useState({});
  const dropRef = useRef(null);

  const filteredUsers = useMemo(() => {
    const q = userSearch.toLowerCase();
    return SAMPLE_USERS.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q)
    );
  }, [userSearch]);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setShowDrop(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const validate = () => {
    const e = {};
    if (!selectedUser) e.user = "Please select a user.";
    if (!accessLevel)  e.accessLevel = "Please select an access level.";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onGrant({ selectedUser, accessLevel, department: department || selectedUser.department, status, remarks });
  };

  return (
    <div className="aa-modal-backdrop" role="dialog" aria-modal="true" aria-label="Grant Admin Access" data-testid="school-modal-aa-grant">
      <div className="aa-modal">
        <div className="aa-modal__header">
          <span className="aa-modal__title">🛡️ Grant Admin Access</span>
          <button className="aa-modal__close" onClick={onClose} aria-label="Close" data-testid="school-button-aa-modal-close-grant">✕</button>
        </div>
        <div className="aa-modal__body">
          <div className="aa-form">
            <span className="aa-form-section">Select User</span>

            <div className="aa-field">
              <label className="aa-field__label">User *</label>
              <div className="aa-user-search" ref={dropRef} data-testid="school-field-aa-user-select">
                <div className="aa-user-search__input-wrap">
                  <span>🔍</span>
                  <input
                    type="text"
                    placeholder={selectedUser ? selectedUser.name : "Search by name, email or department…"}
                    value={userSearch}
                    onChange={(e) => { setUserSearch(e.target.value); setShowDrop(true); }}
                    onFocus={() => setShowDrop(true)}
                    autoComplete="off"
                    data-testid="school-input-aa-user-search"
                  />
                  {selectedUser && (
                    <button
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: ".75rem" }}
                      onClick={() => { setSelectedUser(null); setUserSearch(""); }}
                      aria-label="Clear selected user"
                    >✕</button>
                  )}
                </div>
                {showDrop && (
                  <div className="aa-user-search__dropdown">
                    {filteredUsers.length === 0 ? (
                      <div className="aa-user-search__empty">No users found</div>
                    ) : (
                      filteredUsers.map((u) => (
                        <div
                          key={u.id}
                          className={`aa-user-search__option${selectedUser?.id === u.id ? " aa-user-search__option--selected" : ""}`}
                          onClick={() => { setSelectedUser(u); setUserSearch(""); setShowDrop(false); setErrors((p) => ({ ...p, user: undefined })); }}
                          data-testid={`school-option-aa-user-${u.id}`}
                        >
                          <div>
                            <div className="aa-user-search__opt-name">{u.name}</div>
                            <div className="aa-user-search__opt-email">{u.email}</div>
                          </div>
                          <span className="aa-user-search__opt-dept">{u.department}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              {errors.user && <span className="aa-field__error">{errors.user}</span>}
            </div>

            <span className="aa-form-section">Access Configuration</span>

            <div className="aa-form-grid">
              <div className="aa-field">
                <label className="aa-field__label">Access Level *</label>
                <select
                  className={`aa-field__select${errors.accessLevel ? " aa-field__select--error" : ""}`}
                  value={accessLevel}
                  onChange={(e) => { setAccessLevel(e.target.value); setErrors((p) => ({ ...p, accessLevel: undefined })); }}
                  data-testid="school-dropdown-aa-grant-level"
                >
                  <option value="">Select level…</option>
                  {ACCESS_LEVELS.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
                {errors.accessLevel && <span className="aa-field__error">{errors.accessLevel}</span>}
              </div>

              <div className="aa-field">
                <label className="aa-field__label">Department</label>
                <select
                  className="aa-field__select"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  data-testid="school-dropdown-aa-grant-dept"
                >
                  <option value="">Auto (from user)</option>
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="aa-field">
                <label className="aa-field__label">Initial Status</label>
                <select
                  className="aa-field__select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  data-testid="school-dropdown-aa-grant-status"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="aa-field aa-form-grid__full">
                <label className="aa-field__label">Remarks</label>
                <textarea
                  className="aa-field__textarea"
                  placeholder="Optional: reason for granting access…"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  maxLength={300}
                  data-testid="school-field-aa-grant-remarks"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="aa-modal__footer">
          <button className="aa-btn aa-btn--ghost" onClick={onClose} data-testid="school-button-aa-grant-cancel">Cancel</button>
          <button className="aa-btn aa-btn--primary" onClick={handleSubmit} data-testid="school-button-aa-grant-submit">
            🛡️ Grant Access
          </button>
        </div>
      </div>
    </div>
  );
};

/** View Access Details modal */
const ViewModal = ({ admin, onClose }) => {
  if (!admin) return null;
  const lvl = getLevel(admin.accessLevel);
  return (
    <div className="aa-modal-backdrop" role="dialog" aria-modal="true" aria-label="View Admin Access" data-testid="school-modal-aa-view">
      <div className="aa-modal aa-modal--view">
        <div className="aa-modal__header">
          <span className="aa-modal__title">🔎 Admin Access Details</span>
          <button className="aa-modal__close" onClick={onClose} aria-label="Close" data-testid="school-button-aa-modal-close-view">✕</button>
        </div>
        <div className="aa-modal__body">
          <div className="aa-view">
            <div className="aa-view__hero">
              <AdminAvatar admin={admin} size={48} />
              <div>
                <p className="aa-view__name">{admin.name}</p>
                <p className="aa-view__role">{admin.role} · {admin.empId}</p>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <LevelBadge value={admin.accessLevel} />
              </div>
            </div>

            <span className="aa-view__section">Account Status</span>
            <div className="aa-view__grid">
              <div className="aa-view__field">
                <span className="aa-view__field-label">Status</span>
                <StatusBadge status={admin.status} />
              </div>
              <div className="aa-view__field">
                <span className="aa-view__field-label">Session</span>
                <SessionDot status={admin.sessionStatus} />
              </div>
              <div className="aa-view__field">
                <span className="aa-view__field-label">Last Active</span>
                <span className="aa-view__field-value">{fmtRelative(admin.lastActive)}</span>
              </div>
              <div className="aa-view__field">
                <span className="aa-view__field-label">Department</span>
                <span className="aa-view__field-value">{admin.department}</span>
              </div>
            </div>

            <span className="aa-view__section">Access Grant Info</span>
            <div className="aa-view__grid">
              <div className="aa-view__field">
                <span className="aa-view__field-label">Access Level</span>
                <LevelBadge value={admin.accessLevel} />
              </div>
              <div className="aa-view__field">
                <span className="aa-view__field-label">Admin ID</span>
                <span className="aa-view__field-value" style={{ fontFamily: "monospace" }}>{admin.id}</span>
              </div>
              <div className="aa-view__field">
                <span className="aa-view__field-label">Granted Date</span>
                <span className="aa-view__field-value">{admin.grantedDate}</span>
              </div>
              <div className="aa-view__field">
                <span className="aa-view__field-label">Granted By</span>
                <span className="aa-view__field-value">{admin.grantedBy}</span>
              </div>
            </div>

            {admin.remarks && (
              <>
                <span className="aa-view__section">Remarks</span>
                <div className="aa-view__field" style={{ gridColumn: "1/-1" }}>
                  <span className="aa-view__field-label">Notes</span>
                  <span className="aa-view__field-value" style={{ fontStyle: "italic", opacity: .85 }}>{admin.remarks}</span>
                </div>
              </>
            )}

            <div className="aa-view__shield">
              🔒 Access controlled by system policy — changes are logged.
            </div>
          </div>
        </div>
        <div className="aa-modal__footer">
          <button className="aa-btn aa-btn--ghost" onClick={onClose} data-testid="school-button-aa-view-close">Close</button>
        </div>
      </div>
    </div>
  );
};

/** Suspend confirmation modal */
const SuspendModal = ({ admin, onClose, onConfirm }) => (
  <div className="aa-modal-backdrop" role="dialog" aria-modal="true" data-testid="school-modal-aa-suspend">
    <div className="aa-modal aa-modal--sm">
      <div className="aa-modal__header">
        <span className="aa-modal__title">⚠️ Suspend Access</span>
        <button className="aa-modal__close" onClick={onClose} aria-label="Close">✕</button>
      </div>
      <div className="aa-modal__body">
        <div className="aa-confirm">
          <div className="aa-confirm__icon">⚠️</div>
          <p className="aa-confirm__msg">
            You are about to suspend admin access for <strong>{admin?.name}</strong>.
            They will not be able to log in until access is restored.
          </p>
          <p className="aa-confirm__warn">This action can be reversed by restoring access.</p>
        </div>
      </div>
      <div className="aa-modal__footer">
        <button className="aa-btn aa-btn--ghost" onClick={onClose} data-testid="school-button-aa-suspend-cancel">Cancel</button>
        <button className="aa-btn aa-btn--warning" onClick={onConfirm} data-testid="school-button-aa-suspend-confirm">Suspend</button>
      </div>
    </div>
  </div>
);

/** Restore confirmation modal */
const RestoreModal = ({ admin, onClose, onConfirm }) => (
  <div className="aa-modal-backdrop" role="dialog" aria-modal="true" data-testid="school-modal-aa-restore">
    <div className="aa-modal aa-modal--sm">
      <div className="aa-modal__header">
        <span className="aa-modal__title">✅ Restore Access</span>
        <button className="aa-modal__close" onClick={onClose} aria-label="Close">✕</button>
      </div>
      <div className="aa-modal__body">
        <div className="aa-confirm">
          <div className="aa-confirm__icon">✅</div>
          <p className="aa-confirm__msg">
            Restore admin access for <strong>{admin?.name}</strong>? Their account will be
            set back to <strong>Active</strong>.
          </p>
        </div>
      </div>
      <div className="aa-modal__footer">
        <button className="aa-btn aa-btn--ghost" onClick={onClose} data-testid="school-button-aa-restore-cancel">Cancel</button>
        <button className="aa-btn aa-btn--success" onClick={onConfirm} data-testid="school-button-aa-restore-confirm">Restore</button>
      </div>
    </div>
  </div>
);

/** Revoke confirmation modal */
const RevokeModal = ({ admin, onClose, onConfirm }) => (
  <div className="aa-modal-backdrop" role="dialog" aria-modal="true" data-testid="school-modal-aa-revoke">
    <div className="aa-modal aa-modal--sm">
      <div className="aa-modal__header">
        <span className="aa-modal__title">🚫 Revoke Access</span>
        <button className="aa-modal__close" onClick={onClose} aria-label="Close">✕</button>
      </div>
      <div className="aa-modal__body">
        <div className="aa-confirm">
          <div className="aa-confirm__icon">🚫</div>
          <p className="aa-confirm__msg">
            You are about to <strong>permanently revoke</strong> admin access for{" "}
            <strong>{admin?.name}</strong>. This will remove their administrator record entirely.
          </p>
          <p className="aa-confirm__danger">This action cannot be undone.</p>
        </div>
      </div>
      <div className="aa-modal__footer">
        <button className="aa-btn aa-btn--ghost" onClick={onClose} data-testid="school-button-aa-revoke-cancel">Cancel</button>
        <button className="aa-btn aa-btn--danger" onClick={onConfirm} data-testid="school-button-aa-revoke-confirm">Revoke Access</button>
      </div>
    </div>
  </div>
);

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ msg, type = "success", onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone]);
  const icon = type === "error" ? "❌" : type === "warn" ? "⚠️" : "✅";
  return (
    <div className={`aa-toast aa-toast--${type}`} role="alert">
      {icon} {msg}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
/**
 * AdminAccess page — manages privileged administrator accounts, access levels,
 * session monitoring, and access lifecycle (grant / view / suspend / restore / revoke).
 */
const AdminAccess = () => {
  // ── State ──────────────────────────────────────────────────────────────────
  const [admins,      setAdmins]      = useState(MOCK_ADMINS);
  const [search,      setSearch]      = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterStatus,setFilterStatus]= useState("all");
  const [page,        setPage]        = useState(1);
  const PAGE_SIZE = 10;

  const [activeModal, setActiveModal] = useState(null); // 'grant'|'view'|'suspend'|'restore'|'revoke'|null
  const [modalAdmin,  setModalAdmin]  = useState(null);
  const [toast,       setToast]       = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(true);

  // ── Derived ────────────────────────────────────────────────────────────────
  const filteredAdmins = useMemo(() => {
    const q = search.toLowerCase().trim();
    return admins.filter((a) => {
      const matchesSearch =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        a.empId.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q) ||
        a.department.toLowerCase().includes(q);
      const matchesLevel  = filterLevel  === "all" || a.accessLevel === filterLevel;
      const matchesStatus = filterStatus === "all" || a.status      === filterStatus;
      return matchesSearch && matchesLevel && matchesStatus;
    });
  }, [admins, search, filterLevel, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredAdmins.length / PAGE_SIZE));
  const pageAdmins = filteredAdmins.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const metrics    = useMemo(() => computeMetrics(admins), [admins]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const showToast = useCallback((msg, type = "success") => setToast({ msg, type }), []);
  const closeModal = useCallback(() => { setActiveModal(null); setModalAdmin(null); }, []);

  const openView    = useCallback((adm) => { setModalAdmin(adm); setActiveModal("view"); }, []);
  const openSuspend = useCallback((adm) => { setModalAdmin(adm); setActiveModal("suspend"); }, []);
  const openRestore = useCallback((adm) => { setModalAdmin(adm); setActiveModal("restore"); }, []);
  const openRevoke  = useCallback((adm) => { setModalAdmin(adm); setActiveModal("revoke"); }, []);

  const handleGrant = useCallback((data) => {
    const u = data.selectedUser;
    const newAdmin = {
      id:            `ADM-${String(admins.length + 1).padStart(4, "0")}`,
      name:          u.name,
      email:         u.email,
      empId:         u.id,
      role:          "Administrator",
      accessLevel:   data.accessLevel,
      department:    data.department,
      status:        data.status,
      lastActive:    null,
      sessionStatus: "offline",
      grantedDate:   new Date().toISOString().slice(0, 10),
      grantedBy:     "Current User",
      remarks:       data.remarks || "",
      avatarColor:   "#c9a962",
      initials:      u.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase(),
    };
    setAdmins((prev) => [newAdmin, ...prev]);
    closeModal();
    showToast(`Admin access granted to ${u.name}.`);
  }, [admins.length, closeModal, showToast]);

  const handleSuspend = useCallback(() => {
    if (!modalAdmin) return;
    setAdmins((prev) =>
      prev.map((a) => a.id === modalAdmin.id ? { ...a, status: "suspended", sessionStatus: "offline" } : a)
    );
    closeModal();
    showToast(`Access suspended for ${modalAdmin.name}.`, "warn");
  }, [modalAdmin, closeModal, showToast]);

  const handleRestore = useCallback(() => {
    if (!modalAdmin) return;
    setAdmins((prev) =>
      prev.map((a) => a.id === modalAdmin.id ? { ...a, status: "active" } : a)
    );
    closeModal();
    showToast(`Access restored for ${modalAdmin.name}.`);
  }, [modalAdmin, closeModal, showToast]);

  const handleRevoke = useCallback(() => {
    if (!modalAdmin) return;
    const name = modalAdmin.name;
    setAdmins((prev) => prev.filter((a) => a.id !== modalAdmin.id));
    closeModal();
    showToast(`Admin access revoked for ${name}.`, "error");
  }, [modalAdmin, closeModal, showToast]);

  const handleSearchChange  = (e) => { setSearch(e.target.value); setPage(1); };
  const handleLevelChange   = (e) => { setFilterLevel(e.target.value); setPage(1); };
  const handleStatusChange  = (e) => { setFilterStatus(e.target.value); setPage(1); };

  const resetFilters = () => {
    setSearch("");
    setFilterLevel("all");
    setFilterStatus("all");
    setPage(1);
  };

  // ── Page numbers ───────────────────────────────────────────────────────────
  const pageNumbers = useMemo(() => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  }, [totalPages]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="aa-root" data-testid="school-page-aa-admin-access">

      {/* Security Banner */}
      <div className="aa-security-banner">
        <span className="aa-security-banner__icon">🔒</span>
        <div className="aa-security-banner__text">
          <strong>Restricted Area:</strong> Admin Access management is limited to authorized
          Super Admins only. All changes are audit-logged.
        </div>
      </div>

      <ManagementPageHeader
        breadcrumbs={[
          { label: "User Management" },
          { label: "Admin Access" },
        ]}
        title="Admin Access"
        subtitle="Manage privileged admin accounts, access levels, and session activity."
        actions={(
          <>
            <button
              className="aa-btn aa-btn--ghost"
              onClick={() => showToast("Export initiated — file will download shortly.")}
              data-testid="school-button-aa-export"
              aria-label="Export admin list"
            >
              ⬇ Export
            </button>
            <button
              className="aa-btn aa-btn--primary"
              onClick={() => setActiveModal("grant")}
              data-testid="school-button-aa-grant-access"
              aria-label="Grant Admin Access"
            >
              🛡️ Grant Admin Access
            </button>
          </>
        )}
      />

      {/* Metrics */}
      <div className="aa-metrics" data-testid="school-grid-aa-metrics">
        {ADMIN_METRICS.map((m) => (
          <div
            key={m.id}
            className={`aa-metric-card aa-metric-card--${m.color}`}
            data-testid={`school-metric-aa-${m.id}`}
          >
            <span className="aa-metric-card__icon">{m.icon}</span>
            <div className="aa-metric-card__body">
              <span className="aa-metric-card__value">{metrics[m.id]}</span>
              <span className="aa-metric-card__label">{m.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="aa-toolbar" data-testid="school-toolbar-aa">
        <div className="aa-toolbar__search" data-testid="school-search-aa">
          <span className="aa-toolbar__search__icon">🔍</span>
          <input
            type="text"
            placeholder="Search by name, email, ID, role or department…"
            value={search}
            onChange={handleSearchChange}
            aria-label="Search admins"
            data-testid="school-input-aa-search"
          />
          {search && (
            <button className="aa-toolbar__search__clear"
              onClick={() => { setSearch(""); setPage(1); }}
              aria-label="Clear search"
            >✕</button>
          )}
        </div>

        <button
          className="aa-toolbar__toggle"
          onClick={() => setFiltersOpen((p) => !p)}
          aria-expanded={filtersOpen}
          data-testid="school-button-aa-toggle-filters"
        >
          ⚙ Filters {filtersOpen ? "▲" : "▼"}
        </button>

        <div className={`aa-toolbar__filters${filtersOpen ? "" : " aa-toolbar__filters--collapsed"}`}>
          <select
            className="aa-filter-select"
            value={filterLevel}
            onChange={handleLevelChange}
            aria-label="Filter by access level"
            data-testid="school-dropdown-aa-level-filter"
          >
            {LEVEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          <select
            className="aa-filter-select"
            value={filterStatus}
            onChange={handleStatusChange}
            aria-label="Filter by status"
            data-testid="school-dropdown-aa-status-filter"
          >
            {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {(search || filterLevel !== "all" || filterStatus !== "all") && (
            <button className="aa-btn aa-btn--ghost aa-btn--sm" onClick={resetFilters} data-testid="school-button-aa-clear-filters">✕ Clear</button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="aa-table-wrap" data-testid="school-table-aa-admins">
        <div className="aa-results-bar">
          <span className="aa-results-bar__count">
            Showing {pageAdmins.length} of {filteredAdmins.length} admin{filteredAdmins.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="aa-table-scroll">
          <table className="aa-table" aria-label="Admin access table">
            <thead>
              <tr>
                <th>Admin</th>
                <th>Role</th>
                <th>Access Level</th>
                <th>Department</th>
                <th>Last Active</th>
                <th>Status</th>
                <th>Session</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageAdmins.length === 0 ? (
                <tr className="aa-table__empty">
                  <td colSpan={8}>No admin accounts match your filters.</td>
                </tr>
              ) : (
                pageAdmins.map((adm) => (
                  <tr key={adm.id}>
                    <td>
                      <div className="aa-admin-cell">
                        <AdminAvatar admin={adm} size={34} />
                        <div>
                          <div className="aa-admin-cell__name">{adm.name}</div>
                          <div className="aa-admin-cell__email">
                            {adm.empId} · {adm.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="aa-cell-muted">{adm.role}</td>
                    <td><LevelBadge value={adm.accessLevel} /></td>
                    <td className="aa-cell-muted">{adm.department}</td>
                    <td className="aa-cell-muted">{fmtRelative(adm.lastActive)}</td>
                    <td><StatusBadge status={adm.status} /></td>
                    <td><SessionDot status={adm.sessionStatus} /></td>
                    <td>
                      <div className="aa-actions">
                        <button
                          className="aa-action-btn"
                          title="View Details"
                          onClick={() => openView(adm)}
                          aria-label={`View ${adm.name}`}
                          data-testid={`school-button-aa-view-${adm.id}`}
                        >🔎</button>

                        {adm.status === "suspended" ? (
                          <button
                            className="aa-action-btn aa-action-btn--success"
                            title="Restore Access"
                            onClick={() => openRestore(adm)}
                            aria-label={`Restore ${adm.name}`}
                            data-testid={`school-button-aa-restore-${adm.id}`}
                          >♻️</button>
                        ) : (
                          <button
                            className="aa-action-btn aa-action-btn--warning"
                            title="Suspend Access"
                            onClick={() => openSuspend(adm)}
                            aria-label={`Suspend ${adm.name}`}
                            data-testid={`school-button-aa-suspend-${adm.id}`}
                          >⏸</button>
                        )}

                        <button
                          className="aa-action-btn aa-action-btn--danger"
                          title="Revoke Access"
                          onClick={() => openRevoke(adm)}
                          aria-label={`Revoke ${adm.name}`}
                          data-testid={`school-button-aa-revoke-${adm.id}`}
                        >🚫</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="aa-pagination">
            <span className="aa-pagination__info">
              Page {page} of {totalPages}
            </span>
            <div className="aa-pagination__pages">
              <button
                className="aa-page-btn"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                aria-label="Previous page"
                data-testid="school-button-aa-page-prev"
              >‹</button>
              {pageNumbers.map((n) => (
                <button
                  key={n}
                  className={`aa-page-btn${page === n ? " aa-page-btn--active" : ""}`}
                  onClick={() => setPage(n)}
                  aria-label={`Page ${n}`}
                  aria-current={page === n ? "page" : undefined}
                  data-testid={`school-button-aa-page-${n}`}
                >{n}</button>
              ))}
              <button
                className="aa-page-btn"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                aria-label="Next page"
                data-testid="school-button-aa-page-next"
              >›</button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {activeModal === "grant"   && <GrantModal   onClose={closeModal} onGrant={handleGrant} />}
      {activeModal === "view"    && <ViewModal     admin={modalAdmin} onClose={closeModal} />}
      {activeModal === "suspend" && <SuspendModal  admin={modalAdmin} onClose={closeModal} onConfirm={handleSuspend} />}
      {activeModal === "restore" && <RestoreModal  admin={modalAdmin} onClose={closeModal} onConfirm={handleRestore} />}
      {activeModal === "revoke"  && <RevokeModal   admin={modalAdmin} onClose={closeModal} onConfirm={handleRevoke} />}

      {/* Toast */}
      {toast && (
        <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />
      )}
    </div>
  );
};

export default AdminAccess;
