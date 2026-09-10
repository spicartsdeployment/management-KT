import React, { useState, useMemo, useCallback } from "react";
import "../../Assets/styles/Users.scss";
import ManagementPageHeader from "../../app/components/common/ManagementPageHeader";
import {
  USER_METRICS,
  DEPARTMENTS,
  ROLES,
  ASSIGNABLE_ROLES,
  STATUS_OPTIONS,
  DATE_JOINED_OPTIONS,
  MOCK_USERS,
} from "./usersMockData";

// ── helpers ────────────────────────────────────────────────────────────────────
const fmtDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const isInRange = (isoDate, range) => {
  if (range === "all" || !isoDate) return true;
  const d = new Date(isoDate);
  const now = new Date();
  if (range === "today") {
    return d.toDateString() === now.toDateString();
  }
  const diff = (now - d) / 864e5;
  if (range === "week") return diff <= 7;
  if (range === "month") return diff <= 30;
  if (range === "quarter") return diff <= 90;
  if (range === "year") return diff <= 365;
  return true;
};

const EMPTY_FORM = {
  name: "", email: "", phone: "", empId: "",
  department: "", role: "", status: "active",
  password: "", confirmPassword: "",
};

// ── Sub-components ─────────────────────────────────────────────────────────────

const Avatar = ({ color, initials, size = "sm" }) => (
  <span
    className="um-avatar"
    style={{
      backgroundColor: color,
      width: size === "lg" ? 72 : 36,
      height: size === "lg" ? 72 : 36,
      fontSize: size === "lg" ? "1.375rem" : ".75rem",
    }}
  >
    {initials}
  </span>
);

const Badge = ({ status }) => (
  <span className={`um-badge um-badge--${status}`}>
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

// ── Add / Edit Modal ──────────────────────────────────────────────────────────
const AddEditModal = ({ user, onClose, onSave }) => {
  const isEdit = !!user;
  const [form, setForm] = useState(
    isEdit
      ? { ...EMPTY_FORM, name: user.name, email: user.email, phone: user.phone,
          empId: user.empId, department: user.department, role: user.role,
          status: user.status, password: "", confirmPassword: "" }
      : { ...EMPTY_FORM }
  );
  const [errors, setErrors] = useState({});

  const set = useCallback((field, val) => {
    setForm((f) => ({ ...f, [field]: val }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name = "Full name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email.";
    if (!form.role)        e.role = "Role is required.";
    if (!form.department)  e.department = "Department is required.";
    if (!isEdit) {
      if (!form.password)  e.password = "Password is required.";
      else if (form.password.length < 8) e.password = "Minimum 8 characters.";
      if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match.";
    }
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form, user?.id);
  };

  return (
    <div className="um-modal-backdrop" data-testid="school-modal-um-add-edit">
      <div className="um-modal um-modal--lg">
        <div className="um-modal__header">
          <span className="um-modal__title">{isEdit ? "Edit User" : "Add New User"}</span>
          <button className="um-modal__close" onClick={onClose} data-testid="school-button-um-modal-close">✕</button>
        </div>

        <div className="um-modal__body">
          <div className="um-form">
            <div className="um-form-section">Personal Information</div>
            <div className="um-form-grid">
              <Field label="Full Name *" error={errors.name}>
                <input
                  className={`um-field__input${errors.name ? " um-field__input--error" : ""}`}
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g. Arjun Sharma"
                  data-testid="school-field-um-name"
                />
              </Field>
              <Field label="Email Address *" error={errors.email}>
                <input
                  className={`um-field__input${errors.email ? " um-field__input--error" : ""}`}
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="user@school.edu"
                  data-testid="school-field-um-email"
                />
              </Field>
              <Field label="Phone Number">
                <input
                  className="um-field__input"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="+91 98000 00000"
                  data-testid="school-field-um-phone"
                />
              </Field>
              <Field label="Employee / Student ID">
                <input
                  className="um-field__input"
                  value={form.empId}
                  onChange={(e) => set("empId", e.target.value)}
                  placeholder="EMP-0001"
                  data-testid="school-field-um-emp-id"
                />
              </Field>
            </div>

            <div className="um-divider" />
            <div className="um-form-section">Role & Access</div>
            <div className="um-form-grid">
              <Field label="Department *" error={errors.department}>
                <select
                  className={`um-field__select${errors.department ? " um-field__input--error" : ""}`}
                  value={form.department}
                  onChange={(e) => set("department", e.target.value)}
                  data-testid="school-dropdown-um-department"
                >
                  <option value="">Select Department</option>
                  {DEPARTMENTS.slice(1).map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </Field>
              <Field label="Assign Role *" error={errors.role}>
                <select
                  className={`um-field__select${errors.role ? " um-field__input--error" : ""}`}
                  value={form.role}
                  onChange={(e) => set("role", e.target.value)}
                  data-testid="school-dropdown-um-role"
                >
                  <option value="">Select Role</option>
                  {ASSIGNABLE_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </Field>
              <Field label="Status" error={errors.status} className="um-form-grid__full">
                <select
                  className="um-field__select"
                  value={form.status}
                  onChange={(e) => set("status", e.target.value)}
                  data-testid="school-dropdown-um-status"
                >
                  {STATUS_OPTIONS.slice(1).map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </Field>
            </div>

            {!isEdit && (
              <>
                <div className="um-divider" />
                <div className="um-form-section">Set Password</div>
                <div className="um-form-grid">
                  <Field label="Password *" error={errors.password}>
                    <input
                      type="password"
                      className={`um-field__input${errors.password ? " um-field__input--error" : ""}`}
                      value={form.password}
                      onChange={(e) => set("password", e.target.value)}
                      placeholder="Min. 8 characters"
                      data-testid="school-field-um-password"
                    />
                  </Field>
                  <Field label="Confirm Password *" error={errors.confirmPassword}>
                    <input
                      type="password"
                      className={`um-field__input${errors.confirmPassword ? " um-field__input--error" : ""}`}
                      value={form.confirmPassword}
                      onChange={(e) => set("confirmPassword", e.target.value)}
                      placeholder="Re-enter password"
                      data-testid="school-field-um-confirm-password"
                    />
                  </Field>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="um-modal__footer">
          <button className="um-btn um-btn--ghost" onClick={onClose} data-testid="school-button-um-modal-cancel">Cancel</button>
          <button className="um-btn um-btn--primary" onClick={handleSave} data-testid="school-button-um-modal-save">
            {isEdit ? "Save Changes" : "Create User"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, error, children, className = "" }) => (
  <div className={`um-field ${className}`}>
    <label className="um-field__label">{label}</label>
    {children}
    {error && <span className="um-field__error">{error}</span>}
  </div>
);

// ── View Profile Modal ─────────────────────────────────────────────────────────
const ViewProfileModal = ({ user, onClose, onEdit }) => (
  <div className="um-modal-backdrop" data-testid="school-modal-um-view-profile">
    <div className="um-modal um-modal--profile">
      <div className="um-modal__header">
        <span className="um-modal__title">User Profile</span>
        <button className="um-modal__close" onClick={onClose}>✕</button>
      </div>
      <div className="um-profile">
        <span className="um-profile__avatar" style={{ backgroundColor: user.avatarColor }}>
          {user.initials}
        </span>
        <div style={{ textAlign: "center" }}>
          <p className="um-profile__name">{user.name}</p>
          <p className="um-profile__role">{user.role} — {user.department}</p>
          <Badge status={user.status} />
        </div>
        <div className="um-profile__grid">
          {[
            ["Email",       user.email],
            ["Phone",       user.phone || "—"],
            ["Employee ID", user.empId],
            ["User ID",     user.id],
            ["Joined",      fmtDate(user.joinDate)],
            ["Last Login",  fmtDate(user.lastLogin)],
          ].map(([lbl, val]) => (
            <div key={lbl} className="um-profile__field">
              <span className="um-profile__field-label">{lbl}</span>
              <span className="um-profile__field-value">{val}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="um-modal__footer">
        <button className="um-btn um-btn--ghost" onClick={onClose}>Close</button>
        <button className="um-btn um-btn--primary" onClick={() => { onClose(); onEdit(user); }}
          data-testid={`school-button-um-edit-from-profile-${user.id}`}>
          Edit User
        </button>
      </div>
    </div>
  </div>
);

// ── Status Confirm Modal ───────────────────────────────────────────────────────
const StatusConfirmModal = ({ user, targetStatus, onClose, onConfirm }) => {
  const actionMap = {
    active:    { label: "Activate",   icon: "✅", btn: "um-btn--success" },
    inactive:  { label: "Deactivate", icon: "⛔", btn: "um-btn--danger"  },
    suspended: { label: "Suspend",    icon: "🚫", btn: "um-btn--danger"  },
  };
  const { label, icon, btn } = actionMap[targetStatus] ?? { label: "Update", icon: "ℹ️", btn: "um-btn--primary" };

  return (
    <div className="um-modal-backdrop" data-testid="school-modal-um-status-confirm">
      <div className="um-modal um-modal--sm">
        <div className="um-modal__header">
          <span className="um-modal__title">{label} User</span>
          <button className="um-modal__close" onClick={onClose}>✕</button>
        </div>
        <div className="um-modal__body">
          <div className="um-confirm">
            <div className="um-confirm__icon">{icon}</div>
            <p className="um-confirm__msg">
              Are you sure you want to <strong>{label.toLowerCase()}</strong> the account for{" "}
              <strong>{user.name}</strong>?
            </p>
            {targetStatus === "suspended" && (
              <p className="um-confirm__warn">⚠️ The user will immediately lose access to the system.</p>
            )}
          </div>
        </div>
        <div className="um-modal__footer">
          <button className="um-btn um-btn--ghost" onClick={onClose}>Cancel</button>
          <button className={`um-btn ${btn}`} onClick={onConfirm}
            data-testid={`school-button-um-confirm-status-${user.id}`}>
            {label}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Reset Password Modal ───────────────────────────────────────────────────────
const ResetPasswordModal = ({ user, onClose, onConfirm }) => (
  <div className="um-modal-backdrop" data-testid="school-modal-um-reset-password">
    <div className="um-modal um-modal--sm">
      <div className="um-modal__header">
        <span className="um-modal__title">Reset Password</span>
        <button className="um-modal__close" onClick={onClose}>✕</button>
      </div>
      <div className="um-modal__body">
        <div className="um-confirm">
          <div className="um-confirm__icon">🔑</div>
          <p className="um-confirm__msg">
            A password reset link will be sent to <strong>{user.email}</strong>.
          </p>
        </div>
      </div>
      <div className="um-modal__footer">
        <button className="um-btn um-btn--ghost" onClick={onClose}>Cancel</button>
        <button className="um-btn um-btn--primary" onClick={onConfirm}
          data-testid={`school-button-um-confirm-reset-${user.id}`}>
          Send Reset Link
        </button>
      </div>
    </div>
  </div>
);

// ── Toast ──────────────────────────────────────────────────────────────────────
const Toast = ({ message, type = "success", onDone }) => {
  React.useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className={`um-toast um-toast--${type}`}>
      {type === "success" ? "✅" : "⚠️"} {message}
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
const Users = () => {
  const [users, setUsers] = useState(MOCK_USERS);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All Roles");
  const [filterDept, setFilterDept] = useState("All Departments");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // modal state
  const [activeModal, setActiveModal] = useState(null); // 'add'|'edit'|'view'|'status-confirm'|'reset-password'
  const [modalUser, setModalUser] = useState(null);
  const [pendingStatus, setPendingStatus] = useState(null);

  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => setToast({ message, type });

  // ── filtered list ───────────────────────────────────────────────────────────
  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      if (q) {
        const hit = [u.name, u.email, u.phone, u.id, u.empId]
          .some((v) => v && v.toLowerCase().includes(q));
        if (!hit) return false;
      }
      if (filterRole !== "All Roles" && u.role !== filterRole) return false;
      if (filterDept !== "All Departments" && u.department !== filterDept) return false;
      if (filterStatus !== "all" && u.status !== filterStatus) return false;
      if (!isInRange(u.joinDate, filterDate)) return false;
      return true;
    });
  }, [users, search, filterRole, filterDept, filterStatus, filterDate]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const pagedUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);

  const resetPage = () => setPage(1);

  const resetFilters = () => {
    setSearch("");
    setFilterRole("All Roles");
    setFilterDept("All Departments");
    setFilterStatus("all");
    setFilterDate("all");
    setPage(1);
  };

  // ── handlers ────────────────────────────────────────────────────────────────
  const handleSaveUser = (form, existingId) => {
    if (existingId) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === existingId ? { ...u, ...form } : u
        )
      );
      showToast("User updated successfully.");
    } else {
      const newId = `USR-${String(users.length + 1).padStart(4, "0")}`;
      const initials = form.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
      const colors = ["#c9a962","#2563eb","#16a34a","#dc2626","#7c3aed","#0d9488"];
      setUsers((prev) => [
        ...prev,
        { ...form, id: newId, initials, avatarColor: colors[prev.length % colors.length],
          joinDate: new Date().toISOString().slice(0, 10), lastLogin: null },
      ]);
      showToast("User created successfully.");
    }
    setActiveModal(null);
  };

  const handleStatusChange = () => {
    setUsers((prev) =>
      prev.map((u) => (u.id === modalUser.id ? { ...u, status: pendingStatus } : u))
    );
    showToast(`User ${pendingStatus === "active" ? "activated" : pendingStatus}.`);
    setActiveModal(null);
  };

  const handleResetPassword = () => {
    showToast(`Password reset link sent to ${modalUser.email}.`);
    setActiveModal(null);
  };

  const openStatusConfirm = (user) => {
    const next = user.status === "active" ? "inactive" : "active";
    setModalUser(user);
    setPendingStatus(next);
    setActiveModal("status-confirm");
  };

  const handleSearch = (e) => { setSearch(e.target.value); resetPage(); };

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <div className="um-root" data-testid="school-page-um-users">

      <ManagementPageHeader
        breadcrumbs={[
          { label: "Management" },
          { label: "Users" },
        ]}
        title="User Management"
        subtitle="Manage ERP user accounts, roles, and access."
        actions={(
          <>
            <button className="um-btn um-btn--ghost" data-testid="school-button-um-export"
              onClick={() => showToast("Export feature coming soon.", "warn")}>
              ↓ Export Users
            </button>
            <button className="um-btn um-btn--primary" data-testid="school-button-um-add-user"
              onClick={() => { setModalUser(null); setActiveModal("add"); }}>
              + Add User
            </button>
          </>
        )}
      />

      {/* Metrics */}
      <div className="um-metrics">
        {USER_METRICS.map((m) => (
          <div key={m.id} className={`um-metric-card um-metric-card--${m.color}`}
            data-testid={`school-metric-um-${m.id}`}>
            <span className="um-metric-card__icon">{m.icon}</span>
            <div className="um-metric-card__body">
              <span className="um-metric-card__value">{m.value}</span>
              <span className="um-metric-card__label">{m.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="um-toolbar" data-testid="school-toolbar-um">
        <div className="um-toolbar__search" data-testid="school-search-um">
          <span className="um-toolbar__search__icon">🔍</span>
          <input
            value={search}
            onChange={handleSearch}
            placeholder="Search by name, email, phone or ID…"
            data-testid="school-field-um-search"
          />
          {search && <button style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: 0 }} onClick={() => { setSearch(""); setPage(1); }}>✕</button>}
        </div>

        <button className="um-toolbar__toggle" onClick={() => setFiltersOpen((o) => !o)}
          aria-expanded={filtersOpen}
          data-testid="school-button-um-toggle-filters">
          ⚙ Filters {filtersOpen ? "▲" : "▼"}
        </button>

        <div className={`um-toolbar__filters${filtersOpen ? "" : " um-toolbar__filters--collapsed"}`}>
          <select className="um-filter-select" value={filterRole}
            onChange={(e) => { setFilterRole(e.target.value); resetPage(); }}
            data-testid="school-dropdown-um-role-filter">
            {ROLES.map((r) => <option key={r}>{r}</option>)}
          </select>
          <select className="um-filter-select" value={filterDept}
            onChange={(e) => { setFilterDept(e.target.value); resetPage(); }}
            data-testid="school-dropdown-um-dept-filter">
            {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
          </select>
          <select className="um-filter-select" value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); resetPage(); }}
            data-testid="school-dropdown-um-status-filter">
            {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <select className="um-filter-select" value={filterDate}
            onChange={(e) => { setFilterDate(e.target.value); resetPage(); }}
            data-testid="school-dropdown-um-date-filter">
            {DATE_JOINED_OPTIONS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
          {(search || filterRole !== "All Roles" || filterDept !== "All Departments" || filterStatus !== "all" || filterDate !== "all") && (
            <button className="um-btn um-btn--ghost um-btn--sm" onClick={resetFilters} data-testid="school-button-um-clear-filters">✕ Clear</button>
          )}
        </div>
      </div>

      {/* Results bar + Table */}
      <div className="um-table-wrap">
        <div className="um-results-bar" style={{ padding: ".625rem 1rem" }}>
          <span className="um-results-bar__count">
            Showing {pagedUsers.length} of {filteredUsers.length} users
          </span>
        </div>

        <div className="um-table-scroll">
          <table className="um-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Phone</th>
                <th>User ID</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedUsers.length === 0 ? (
                <tr className="um-table__empty">
                  <td colSpan={9}>No users match the current filters.</td>
                </tr>
              ) : (
                pagedUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="um-user-cell">
                        <Avatar color={u.avatarColor} initials={u.initials} />
                        <div>
                          <div className="um-user-cell__name">{u.name}</div>
                          <div className="um-user-cell__id">{u.empId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="um-cell-muted">{u.email}</td>
                    <td className="um-cell-muted">{u.phone || "—"}</td>
                    <td className="um-cell-mono">{u.id}</td>
                    <td>{u.role}</td>
                    <td className="um-cell-muted">{u.department}</td>
                    <td><Badge status={u.status} /></td>
                    <td className="um-cell-muted">{fmtDate(u.lastLogin)}</td>
                    <td>
                      <div className="um-actions">
                        <button className="um-action-btn" title="View Profile"
                          data-testid={`school-button-um-view-${u.id}`}
                          onClick={() => { setModalUser(u); setActiveModal("view"); }}>
                          👁
                        </button>
                        <button className="um-action-btn" title="Edit User"
                          data-testid={`school-button-um-edit-${u.id}`}
                          onClick={() => { setModalUser(u); setActiveModal("edit"); }}>
                          ✏️
                        </button>
                        <button
                          className={`um-action-btn ${u.status === "active" ? "um-action-btn--danger" : "um-action-btn--success"}`}
                          title={u.status === "active" ? "Deactivate" : "Activate"}
                          data-testid={`school-toggle-um-status-${u.id}`}
                          onClick={() => openStatusConfirm(u)}>
                          {u.status === "active" ? "⛔" : "✅"}
                        </button>
                        <button className="um-action-btn" title="Reset Password"
                          data-testid={`school-button-um-reset-pwd-${u.id}`}
                          onClick={() => { setModalUser(u); setActiveModal("reset-password"); }}>
                          🔑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="um-pagination">
          <span className="um-pagination__info">
            Page {page} of {totalPages} · {filteredUsers.length} results
          </span>
          <div className="um-pagination__pages">
            <button className="um-page-btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}
              data-testid="school-button-um-prev-page">
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p}
                className={`um-page-btn${p === page ? " um-page-btn--active" : ""}`}
                onClick={() => setPage(p)}
                data-testid={`school-button-um-page-${p}`}>
                {p}
              </button>
            ))}
            <button className="um-page-btn" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}
              data-testid="school-button-um-next-page">
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {(activeModal === "add" || activeModal === "edit") && (
        <AddEditModal
          user={activeModal === "edit" ? modalUser : null}
          onClose={() => setActiveModal(null)}
          onSave={handleSaveUser}
        />
      )}
      {activeModal === "view" && modalUser && (
        <ViewProfileModal
          user={modalUser}
          onClose={() => setActiveModal(null)}
          onEdit={(u) => { setModalUser(u); setActiveModal("edit"); }}
        />
      )}
      {activeModal === "status-confirm" && modalUser && (
        <StatusConfirmModal
          user={modalUser}
          targetStatus={pendingStatus}
          onClose={() => setActiveModal(null)}
          onConfirm={handleStatusChange}
        />
      )}
      {activeModal === "reset-password" && modalUser && (
        <ResetPasswordModal
          user={modalUser}
          onClose={() => setActiveModal(null)}
          onConfirm={handleResetPassword}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />
      )}
    </div>
  );
};

export default Users;
