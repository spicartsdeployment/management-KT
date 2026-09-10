import React, { useState, useMemo, useCallback, useEffect } from "react";
import "../../Assets/styles/RoleManagement.scss";
import ManagementPageHeader from "../../app/components/common/ManagementPageHeader";
import {
  MOCK_ROLES,
  ROLE_METRICS,
  PERMISSION_GROUPS,
  PERMISSION_TYPES,
  emptyPermissions,
} from "./rolesMockData";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const fmtRelative = (iso) => {
  const diff = Math.floor((Date.now() - new Date(iso)) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return `${diff}d ago`;
};

const PERM_ICONS = { view: "👁", create: "➕", edit: "✏️", delete: "🗑️" };
const PERM_LABELS = { view: "View", create: "Create", edit: "Edit", delete: "Delete" };
const ROLE_COLORS = ["#c9a962","#2563eb","#16a34a","#d97706","#0d9488","#7c3aed","#e11d48","#0891b2","#65a30d","#6b7280","#9333ea","#ea580c"];

const countPermissions = (perms) =>
  Object.values(perms).reduce(
    (sum, g) => sum + Object.values(g).filter(Boolean).length,
    0
  );

// ─── Mock Audit Log ───────────────────────────────────────────────────────────
const MOCK_AUDIT = [
  { id: "a1", type: "create", icon: "➕", title: "Role 'Academic Coordinator' created",  actor: "Admin",   time: "2026-05-24T10:30:00Z" },
  { id: "a2", type: "edit",   icon: "✏️", title: "Permissions updated for 'HR Manager'", actor: "Admin",   time: "2026-05-23T14:15:00Z" },
  { id: "a3", type: "status", icon: "⏸",  title: "Role 'Viewer' deactivated",            actor: "Admin",   time: "2026-05-22T09:00:00Z" },
  { id: "a4", type: "create", icon: "➕", title: "Role 'Campus Supervisor' created",      actor: "Principal", time: "2026-05-20T11:45:00Z" },
  { id: "a5", type: "edit",   icon: "✏️", title: "Description updated for 'Teacher'",    actor: "HR Manager", time: "2026-05-19T16:30:00Z" },
  { id: "a6", type: "perms",  icon: "🔑", title: "Transport permissions expanded",        actor: "Admin",   time: "2026-05-18T08:20:00Z" },
  { id: "a7", type: "delete", icon: "🗑️", title: "Draft role 'Intern' removed",          actor: "Admin",   time: "2026-05-15T13:10:00Z" },
  { id: "a8", type: "edit",   icon: "✏️", title: "Accountant role color updated",         actor: "Admin",   time: "2026-05-14T10:00:00Z" },
];

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ msg, type = "success", onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 3500);
    return () => clearTimeout(t);
  }, [onDone]);
  const icons = { success: "✅", error: "❌", warn: "⚠️", info: "ℹ️" };
  return (
    <div className={`rm-toast rm-toast--${type}`} role="alert">
      {icons[type]} {msg}
    </div>
  );
};

// ─── Role View Modal ──────────────────────────────────────────────────────────
const RoleViewModal = ({ role, onClose, onEdit }) => (
  <div className="rm-modal-backdrop" role="dialog" aria-modal="true" data-testid="school-modal-rm-view">
    <div className="rm-modal rm-modal--xl">
      <div className="rm-modal__header">
        <span className="rm-modal__title">
          <span style={{ width:"1.75rem", height:"1.75rem", borderRadius:"50%", background: role.color, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:".875rem", color:"#fff" }}>🛡️</span>
          {role.name}
        </span>
        <button className="rm-modal__close" onClick={onClose} aria-label="Close" data-testid="school-button-rm-view-close">✕</button>
      </div>
      <div className="rm-modal__body">
        {/* Info */}
        <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap" }}>
          <div style={{ flex:1, minWidth:"12rem" }}>
            <div style={{ fontSize:".6875rem", color:"var(--rm-muted)", marginBottom:".25rem", textTransform:"uppercase", letterSpacing:".04em" }}>Description</div>
            <p style={{ fontSize:".875rem", color:"var(--rm-text)", lineHeight:1.6, margin:0 }}>{role.description}</p>
          </div>
          <div style={{ display:"flex", gap:".75rem", flexShrink:0, flexWrap:"wrap" }}>
            {[
              { label:"Type",    value: role.type === "system" ? "System" : "Custom",  badge: `rm-badge rm-badge--${role.type}` },
              { label:"Status",  value: role.status === "active" ? "Active" : "Inactive", badge: `rm-badge rm-badge--${role.status}` },
              { label:"Users",   value: role.totalUsers,    badge: null },
              { label:"Permissions", value: countPermissions(role.permissions), badge: null },
              { label:"Created", value: fmtDate(role.createdDate), badge: null },
            ].map(m => (
              <div key={m.label} style={{ background:"var(--rm-input)", border:"1px solid var(--rm-line)", borderRadius:".375rem", padding:".5rem .875rem", minWidth:"6rem", textAlign:"center" }}>
                <div style={{ fontSize:"1rem", fontWeight:700, color:"var(--rm-text)" }}>
                  {m.badge ? <span className={m.badge}>{m.value}</span> : m.value}
                </div>
                <div style={{ fontSize:".625rem", color:"var(--rm-muted)", textTransform:"uppercase", letterSpacing:".04em", marginTop:".1rem" }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Permission Matrix */}
        <div>
          <div style={{ fontSize:".75rem", fontWeight:600, color:"var(--rm-text)", textTransform:"uppercase", letterSpacing:".06em", marginBottom:".625rem" }}>Permission Matrix</div>
          <div className="rm-matrix">
            <div className="rm-matrix-scroll">
              <table className="rm-matrix-table" aria-label="Permission matrix">
                <thead>
                  <tr>
                    <th>Module / Group</th>
                    {PERMISSION_TYPES.map(t => (
                      <th key={t} className="center">{PERM_ICONS[t]} {PERM_LABELS[t]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PERMISSION_GROUPS.map(grp => (
                    <tr key={grp}>
                      <td className="rm-matrix-group">{grp}</td>
                      {PERMISSION_TYPES.map(t => (
                        <td key={t} className="center">
                          {role.permissions[grp]?.[t]
                            ? <span className="rm-check-icon rm-check-yes">✓</span>
                            : <span className="rm-check-icon rm-check-no">—</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="rm-modal__footer">
        {role.type === "custom" && (
          <button className="rm-btn rm-btn--primary" onClick={onEdit} data-testid="school-button-rm-view-edit">✏️ Edit Role</button>
        )}
        <button className="rm-btn rm-btn--ghost" onClick={onClose} data-testid="school-button-rm-view-close-btn">Close</button>
      </div>
    </div>
  </div>
);

// ─── Role Form Modal ──────────────────────────────────────────────────────────
const RoleFormModal = ({ role, onClose, onSave }) => {
  const isEdit = Boolean(role);
  const [form, setForm] = useState({
    name: role?.name || "",
    description: role?.description || "",
    color: role?.color || ROLE_COLORS[0],
    status: role?.status || "active",
    permissions: role?.permissions ? JSON.parse(JSON.stringify(role.permissions)) : emptyPermissions(),
  });
  const [errors, setErrors] = useState({});

  const setField = (f, v) => setForm(p => ({ ...p, [f]: v }));
  const togglePerm = (grp, type) =>
    setForm(p => ({
      ...p,
      permissions: { ...p.permissions, [grp]: { ...p.permissions[grp], [type]: !p.permissions[grp][type] } },
    }));
  const toggleAll = (grp) => {
    const allOn = PERMISSION_TYPES.every(t => form.permissions[grp][t]);
    setForm(p => ({
      ...p,
      permissions: {
        ...p.permissions,
        [grp]: Object.fromEntries(PERMISSION_TYPES.map(t => [t, !allOn])),
      },
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Role name is required";
    if (form.name.trim().length > 50) e.name = "Max 50 characters";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ ...form, name: form.name.trim(), description: form.description.trim() });
  };

  return (
    <div className="rm-modal-backdrop" role="dialog" aria-modal="true" data-testid="school-modal-rm-form">
      <div className="rm-modal rm-modal--lg">
        <div className="rm-modal__header">
          <span className="rm-modal__title">
            {isEdit ? "✏️ Edit Role" : "➕ Create Role"}
          </span>
          <button className="rm-modal__close" onClick={onClose} aria-label="Close" data-testid="school-button-rm-form-close">✕</button>
        </div>
        <div className="rm-modal__body">
          {/* Basic Info */}
          <div className="rm-form-grid">
            <div className={`rm-field${errors.name ? "" : ""}`}>
              <label htmlFor="rm-name">Role Name *</label>
              <input
                id="rm-name"
                type="text"
                value={form.name}
                onChange={e => { setField("name", e.target.value); setErrors(p => ({ ...p, name: "" })); }}
                placeholder="e.g. Transport Manager"
                maxLength={50}
                data-testid="school-input-rm-name"
              />
              {errors.name && <span className="rm-field__error">{errors.name}</span>}
            </div>
            <div className="rm-field">
              <label htmlFor="rm-status">Status</label>
              <select id="rm-status" value={form.status} onChange={e => setField("status", e.target.value)} data-testid="school-dropdown-rm-status">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="rm-field rm-field--full">
              <label htmlFor="rm-desc">Description</label>
              <textarea id="rm-desc" value={form.description} onChange={e => setField("description", e.target.value)} placeholder="Brief description of this role's responsibilities…" data-testid="school-input-rm-desc" />
            </div>
            <div className="rm-field rm-field--full">
              <label>Color</label>
              <div className="rm-color-swatches">
                {ROLE_COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    className={`rm-color-swatch${form.color === c ? " rm-color-swatch--active" : ""}`}
                    style={{ background: c }}
                    onClick={() => setField("color", c)}
                    aria-label={`Select color ${c}`}
                    data-testid={`school-button-rm-color-${c.replace("#","")}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div>
            <div style={{ fontSize:".75rem", fontWeight:600, color:"var(--rm-text)", textTransform:"uppercase", letterSpacing:".06em", marginBottom:".625rem" }}>
              Permissions
              <span style={{ fontWeight:400, color:"var(--rm-muted)", marginLeft:".5rem", textTransform:"none", letterSpacing:0 }}>
                ({countPermissions(form.permissions)} granted)
              </span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:".5rem" }}>
              {PERMISSION_GROUPS.map(grp => {
                const allOn = PERMISSION_TYPES.every(t => form.permissions[grp][t]);
                return (
                  <div key={grp} className="rm-perm-section">
                    <div className="rm-perm-section__header">
                      <span className="rm-perm-section__name">{grp}</span>
                      <button
                        type="button"
                        className={`rm-perm-toggle${allOn ? " rm-perm-toggle--active" : ""}`}
                        onClick={() => toggleAll(grp)}
                        data-testid={`school-button-rm-perm-all-${grp.replace(/\s/g,"-").toLowerCase()}`}
                      >
                        {allOn ? "✓ All On" : "All Off"}
                      </button>
                    </div>
                    <div className="rm-perm-section__checks">
                      {PERMISSION_TYPES.map(t => (
                        <button
                          key={t}
                          type="button"
                          className={`rm-perm-toggle${form.permissions[grp][t] ? " rm-perm-toggle--active" : ""}`}
                          onClick={() => togglePerm(grp, t)}
                          data-testid={`school-button-rm-perm-${grp.replace(/\s/g,"-").toLowerCase()}-${t}`}
                        >
                          {PERM_ICONS[t]} {PERM_LABELS[t]}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="rm-modal__footer">
          <button className="rm-btn rm-btn--ghost" onClick={onClose} data-testid="school-button-rm-form-cancel">Cancel</button>
          <button className="rm-btn rm-btn--primary" onClick={handleSave} data-testid="school-button-rm-form-save">
            {isEdit ? "✅ Save Changes" : "➕ Create Role"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
const DeleteModal = ({ role, onClose, onConfirm }) => (
  <div className="rm-modal-backdrop" role="dialog" aria-modal="true" data-testid="school-modal-rm-delete">
    <div className="rm-modal rm-modal--sm">
      <div className="rm-modal__header">
        <span className="rm-modal__title">🗑️ Delete Role</span>
        <button className="rm-modal__close" onClick={onClose} aria-label="Close">✕</button>
      </div>
      <div className="rm-modal__body">
        <p style={{ fontSize:".875rem", color:"var(--rm-muted)", lineHeight:1.6 }}>
          Are you sure you want to delete the <strong style={{ color:"var(--rm-text)" }}>{role.name}</strong> role?
          This action cannot be undone and will affect {role.totalUsers} assigned user{role.totalUsers !== 1 ? "s" : ""}.
        </p>
      </div>
      <div className="rm-modal__footer">
        <button className="rm-btn rm-btn--ghost" onClick={onClose} data-testid="school-button-rm-delete-cancel">Cancel</button>
        <button className="rm-btn rm-btn--danger" onClick={onConfirm} data-testid="school-button-rm-delete-confirm">🗑️ Delete</button>
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
/**
 * RoleManagement — roles & permissions management hub.
 * Features: role listing (cards/table), permission matrix, audit log.
 */
export default function RoleManagement() {
  const [roles,        setRoles]        = useState(MOCK_ROLES);
  const [activeTab,    setActiveTab]    = useState("roles");
  const [viewMode,     setViewMode]     = useState("cards");
  const [search,       setSearch]       = useState("");
  const [filterType,   setFilterType]   = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filtersOpen,  setFiltersOpen]  = useState(true);
  const [page,         setPage]         = useState(1);
  const PAGE_SIZE = 9;

  const [activeModal,  setActiveModal]  = useState(null);
  const [selRole,      setSelRole]      = useState(null);
  const [toast,        setToast]        = useState(null);

  // ── Metrics ──────────────────────────────────────────────────────────────────
  const metrics = useMemo(() => ({
    total:   roles.length,
    active:  roles.filter(r => r.status === "active").length,
    custom:  roles.filter(r => r.type === "custom").length,
    groups:  PERMISSION_GROUPS.length,
  }), [roles]);

  // ── Filtered Roles ────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return roles.filter(r => {
      const matchQ      = !q || r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
      const matchType   = filterType   === "all" || r.type   === filterType;
      const matchStatus = filterStatus === "all" || r.status === filterStatus;
      return matchQ && matchType && matchStatus;
    });
  }, [roles, search, filterType, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const hasFilters = search || filterType !== "all" || filterStatus !== "all";
  const resetFilters = () => { setSearch(""); setFilterType("all"); setFilterStatus("all"); setPage(1); };

  // ── Handlers ──────────────────────────────────────────────────────────────────
  const showToast  = useCallback((msg, type = "success") => setToast({ msg, type }), []);
  const closeModal = useCallback(() => { setActiveModal(null); setSelRole(null); }, []);

  const handleView   = useCallback(r => { setSelRole(r);  setActiveModal("view");   }, []);
  const handleEdit   = useCallback(r => { setSelRole(r);  setActiveModal("form");   }, []);
  const handleDelete = useCallback(r => { setSelRole(r);  setActiveModal("delete"); }, []);

  const handleSave = useCallback((data) => {
    if (selRole) {
      // Edit
      setRoles(prev => prev.map(r => r.id === selRole.id
        ? { ...r, ...data, get permissionsCount() { return countPermissions(this.permissions); } }
        : r
      ));
      showToast(`Role "${data.name}" updated.`, "success");
    } else {
      // Create
      const newRole = {
        id: `role-${Date.now()}`,
        type: "custom",
        totalUsers: 0,
        createdDate: new Date().toISOString().slice(0,10),
        ...data,
        get permissionsCount() { return countPermissions(this.permissions); },
      };
      setRoles(prev => [...prev, newRole]);
      showToast(`Role "${data.name}" created.`, "success");
    }
    closeModal();
  }, [selRole, showToast, closeModal]);

  const handleConfirmDelete = useCallback(() => {
    if (!selRole) return;
    setRoles(prev => prev.filter(r => r.id !== selRole.id));
    showToast(`Role "${selRole.name}" deleted.`, "warn");
    closeModal();
  }, [selRole, showToast, closeModal]);

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="rm-root" data-testid="school-page-rm-roles">

      <ManagementPageHeader
        breadcrumbs={[
          { label: "Management" },
          { label: "Roles & Permissions" },
        ]}
        title="Roles & Permissions"
        subtitle="Define and manage role-based access control across all modules and departments."
        actions={(
          <>
            <button
              className="rm-btn rm-btn--ghost"
              onClick={() => showToast("Exporting roles data…", "info")}
              data-testid="school-button-rm-export"
            >
              ⬇ Export
            </button>
            <button
              className="rm-btn rm-btn--primary"
              onClick={() => { setSelRole(null); setActiveModal("form"); }}
              data-testid="school-button-rm-create"
            >
              ➕ Create Role
            </button>
          </>
        )}
      />

      {/* Metrics */}
      <div className="rm-metrics" data-testid="school-grid-rm-metrics">
        {[
          { id: "total",  icon: "🛡️",  value: metrics.total,  label: "Total Roles",       color: "primary" },
          { id: "active", icon: "✅",  value: metrics.active, label: "Active Roles",      color: "success" },
          { id: "custom", icon: "⚙️", value: metrics.custom, label: "Custom Roles",      color: "info"    },
          { id: "groups", icon: "📋",  value: metrics.groups, label: "Permission Groups", color: "warning" },
        ].map(m => (
          <div key={m.id} className={`rm-metric-card rm-metric-card--${m.color}`} data-testid={`school-metric-rm-${m.id}`}>
            <div className="rm-metric-card__icon">{m.icon}</div>
            <div className="rm-metric-card__body">
              <span className="rm-metric-card__value">{m.value}</span>
              <span className="rm-metric-card__label">{m.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="rm-tabs" role="tablist" data-testid="school-tabs-rm">
        {[
          { id: "roles",  label: "Roles",            count: roles.length         },
          { id: "matrix", label: "Permission Matrix", count: null                },
          { id: "audit",  label: "Audit Log",         count: MOCK_AUDIT.length   },
        ].map(t => (
          <button
            key={t.id}
            role="tab"
            className={`rm-tab${activeTab === t.id ? " rm-tab--active" : ""}`}
            onClick={() => setActiveTab(t.id)}
            data-testid={`school-tab-rm-${t.id}`}
          >
            {t.label}
            {t.count != null && <span className="rm-tab__count">{t.count}</span>}
          </button>
        ))}
      </div>

      {/* ── Roles Tab ── */}
      {activeTab === "roles" && (
        <>
          {/* Toolbar */}
          <div className="rm-toolbar" data-testid="school-toolbar-rm">
            <div className="rm-search" data-testid="school-search-rm">
              <span className="rm-search__icon">🔍</span>
              <input
                type="text"
                placeholder="Search roles by name or description…"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                aria-label="Search roles"
                data-testid="school-input-rm-search"
              />
              {search && (
                <button className="rm-search__clear" onClick={() => { setSearch(""); setPage(1); }} aria-label="Clear">✕</button>
              )}
            </div>

            <button
              className="rm-btn rm-btn--ghost rm-btn--sm"
              onClick={() => setFiltersOpen(p => !p)}
              aria-expanded={filtersOpen}
              data-testid="school-button-rm-toggle-filters"
            >
              ⚙ Filters {filtersOpen ? "▲" : "▼"}
            </button>

            <div className={`rm-toolbar__filters${filtersOpen ? "" : " rm-toolbar__filters--hidden"}`}>
              <select
                className="rm-filter-select"
                value={filterType}
                onChange={e => { setFilterType(e.target.value); setPage(1); }}
                aria-label="Filter by type"
                data-testid="school-dropdown-rm-type"
              >
                <option value="all">All Types</option>
                <option value="system">System</option>
                <option value="custom">Custom</option>
              </select>
              <select
                className="rm-filter-select"
                value={filterStatus}
                onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
                aria-label="Filter by status"
                data-testid="school-dropdown-rm-status"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              {hasFilters && (
                <button className="rm-btn rm-btn--ghost rm-btn--sm" onClick={resetFilters} data-testid="school-button-rm-reset-filters">✕ Clear</button>
              )}
            </div>

            <div className="rm-toolbar__right">
              <div className="rm-view-toggle" aria-label="Toggle view mode">
                <button className={viewMode === "cards" ? "active" : ""} onClick={() => setViewMode("cards")} title="Card view" data-testid="school-button-rm-view-cards">⊞</button>
                <button className={viewMode === "table" ? "active" : ""} onClick={() => setViewMode("table")} title="Table view" data-testid="school-button-rm-view-table">☰</button>
              </div>
            </div>
          </div>

          <div className="rm-results-bar">
            <span className="rm-results-bar__count">{filtered.length} role{filtered.length !== 1 ? "s" : ""} found</span>
          </div>

          {/* Cards View */}
          {viewMode === "cards" ? (
            pageItems.length === 0 ? (
              <div className="rm-empty">
                <span className="rm-empty__icon">🛡️</span>
                <span className="rm-empty__title">No roles found</span>
                <span className="rm-empty__sub">Try adjusting your search or filters.</span>
              </div>
            ) : (
              <div className="rm-cards" data-testid="school-cards-rm">
                {pageItems.map(r => (
                  <div
                    key={r.id}
                    className={`rm-role-card${r.status === "inactive" ? " rm-role-card--inactive" : ""}`}
                    style={{ borderTopColor: r.color }}
                    data-testid={`school-card-rm-${r.id}`}
                  >
                    <div className="rm-role-card__top">
                      <div className="rm-role-card__color-dot" style={{ background: r.color }}>🛡️</div>
                      <div className="rm-role-card__name-wrap">
                        <div className="rm-role-card__name">{r.name}</div>
                        <div className="rm-role-card__type-badge">
                          <span className={`rm-badge rm-badge--${r.type}`}>{r.type === "system" ? "⚙ System" : "✦ Custom"}</span>
                          {" "}
                          <span className={`rm-badge rm-badge--${r.status}`}>{r.status === "active" ? "✓ Active" : "⏸ Inactive"}</span>
                        </div>
                      </div>
                      <div className="rm-role-card__actions">
                        <button className="rm-action-btn rm-action-btn--view" title="View" onClick={() => handleView(r)} data-testid={`school-button-rm-view-${r.id}`}>🔎</button>
                        {r.type === "custom" && (
                          <>
                            <button className="rm-action-btn rm-action-btn--edit" title="Edit" onClick={() => handleEdit(r)} data-testid={`school-button-rm-edit-${r.id}`}>✏️</button>
                            <button className="rm-action-btn rm-action-btn--delete" title="Delete" onClick={() => handleDelete(r)} data-testid={`school-button-rm-delete-${r.id}`}>🗑️</button>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="rm-role-card__desc">{r.description}</p>
                    <div className="rm-role-card__stats">
                      <div className="rm-role-card__stat">
                        <span className="rm-role-card__stat-val">{r.totalUsers}</span>
                        <span className="rm-role-card__stat-lbl">Assigned Users</span>
                      </div>
                      <div className="rm-role-card__stat">
                        <span className="rm-role-card__stat-val">{countPermissions(r.permissions)}</span>
                        <span className="rm-role-card__stat-lbl">Permissions</span>
                      </div>
                    </div>
                    <div className="rm-role-card__footer">
                      <span style={{ fontSize:".6875rem", color:"var(--rm-muted)" }}>Created {fmtDate(r.createdDate)}</span>
                      <button
                        className="rm-btn rm-btn--ghost rm-btn--xs"
                        onClick={() => handleView(r)}
                        data-testid={`school-button-rm-card-view-${r.id}`}
                      >
                        View Permissions
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            /* Table View */
            <div className="rm-table-wrap" data-testid="school-table-rm">
              <div className="rm-table-scroll">
                <table className="rm-table" aria-label="Roles table">
                  <thead>
                    <tr>
                      <th>Role</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Users</th>
                      <th>Permissions</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageItems.length === 0 ? (
                      <tr className="rm-table__empty">
                        <td colSpan={7}>
                          <div className="rm-empty">
                            <span className="rm-empty__icon">🛡️</span>
                            <span className="rm-empty__title">No roles found</span>
                          </div>
                        </td>
                      </tr>
                    ) : pageItems.map(r => (
                      <tr key={r.id}>
                        <td>
                          <div className="rm-cell-emp">
                            <div className="rm-cell-dot" style={{ background: r.color }}>🛡️</div>
                            <div>
                              <div className="rm-cell-title">{r.name}</div>
                              <div className="rm-cell-sub" style={{ maxWidth:"18rem", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{r.description}</div>
                            </div>
                          </div>
                        </td>
                        <td><span className={`rm-badge rm-badge--${r.type}`}>{r.type === "system" ? "⚙ System" : "✦ Custom"}</span></td>
                        <td><span className={`rm-badge rm-badge--${r.status}`}>{r.status === "active" ? "✓ Active" : "⏸ Inactive"}</span></td>
                        <td className="rm-cell-muted">{r.totalUsers}</td>
                        <td className="rm-cell-muted">{countPermissions(r.permissions)}</td>
                        <td className="rm-cell-muted">{fmtDate(r.createdDate)}</td>
                        <td>
                          <div style={{ display:"flex", gap:".25rem" }}>
                            <button className="rm-action-btn rm-action-btn--view"   title="View"   onClick={() => handleView(r)}   data-testid={`school-button-rm-tbl-view-${r.id}`}>🔎</button>
                            {r.type === "custom" && (
                              <>
                                <button className="rm-action-btn rm-action-btn--edit"   title="Edit"   onClick={() => handleEdit(r)}   data-testid={`school-button-rm-tbl-edit-${r.id}`}>✏️</button>
                                <button className="rm-action-btn rm-action-btn--delete" title="Delete" onClick={() => handleDelete(r)} data-testid={`school-button-rm-tbl-delete-${r.id}`}>🗑️</button>
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
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="rm-pagination" data-testid="school-pagination-rm">
              <button className="rm-page-btn" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} aria-label="Previous" data-testid="school-button-rm-page-prev">‹</button>
              {Array.from({ length: totalPages }, (_, i) => i+1).map(n => (
                <button
                  key={n}
                  className={`rm-page-btn${page===n ? " rm-page-btn--active" : ""}`}
                  onClick={() => setPage(n)}
                  aria-current={page===n ? "page" : undefined}
                  data-testid={`school-button-rm-page-${n}`}
                >{n}</button>
              ))}
              <button className="rm-page-btn" onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages} aria-label="Next" data-testid="school-button-rm-page-next">›</button>
            </div>
          )}
        </>
      )}

      {/* ── Permission Matrix Tab ── */}
      {activeTab === "matrix" && (
        <>
          <div className="rm-results-bar">
            <span className="rm-results-bar__count">Full permission matrix — all roles across all modules</span>
          </div>
          <div className="rm-matrix">
            <div className="rm-matrix-scroll">
              <table className="rm-matrix-table" aria-label="Full permission matrix">
                <thead>
                  <tr>
                    <th style={{ minWidth:"13rem" }}>Module</th>
                    {roles.filter(r => r.status === "active").map(r => (
                      <th key={r.id} className="center" style={{ minWidth:"7rem" }}>
                        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:".25rem" }}>
                          <div style={{ width:"1.5rem", height:"1.5rem", borderRadius:"50%", background: r.color, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:".625rem", color:"#fff" }}>🛡</div>
                          <span style={{ fontSize:".6875rem", fontWeight:600, color:"var(--rm-text)", whiteSpace:"nowrap" }}>{r.name}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PERMISSION_GROUPS.map(grp => (
                    <tr key={grp}>
                      <td className="rm-matrix-group">{grp}</td>
                      {roles.filter(r => r.status === "active").map(r => {
                        const grpPerms = r.permissions[grp] || {};
                        const count = Object.values(grpPerms).filter(Boolean).length;
                        const total = PERMISSION_TYPES.length;
                        return (
                          <td key={r.id} className="center">
                            {count === 0
                              ? <span className="rm-check-icon rm-check-no">—</span>
                              : count === total
                                ? <span className="rm-check-icon rm-check-yes" title="Full access">✓</span>
                                : <span style={{ fontSize:".75rem", color:"var(--rm-warning)", fontWeight:600 }} title={`${count}/${total}`}>{count}/{total}</span>
                            }
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div style={{ fontSize:".75rem", color:"var(--rm-muted)", padding:".5rem 0" }}>
            ✓ = Full access &nbsp;·&nbsp; n/m = Partial access &nbsp;·&nbsp; — = No access
          </div>
        </>
      )}

      {/* ── Audit Log Tab ── */}
      {activeTab === "audit" && (
        <>
          <div className="rm-results-bar">
            <span className="rm-results-bar__count">{MOCK_AUDIT.length} recent changes</span>
            <button className="rm-btn rm-btn--ghost rm-btn--sm" onClick={() => showToast("Exporting audit log…", "info")} data-testid="school-button-rm-export-audit">⬇ Export</button>
          </div>
          <div className="rm-audit-list" data-testid="school-list-rm-audit">
            {MOCK_AUDIT.map(a => (
              <div key={a.id} className="rm-audit-item" data-testid={`school-audit-item-rm-${a.id}`}>
                <div className={`rm-audit-item__icon rm-audit-item__icon--${a.type}`}>{a.icon}</div>
                <div className="rm-audit-item__body">
                  <div className="rm-audit-item__title">{a.title}</div>
                  <div className="rm-audit-item__meta">by {a.actor}</div>
                </div>
                <div className="rm-audit-item__time">{fmtRelative(a.time)}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modals */}
      {activeModal === "view"   && selRole && <RoleViewModal   role={selRole} onClose={closeModal} onEdit={() => { closeModal(); setTimeout(() => handleEdit(selRole), 0); }} />}
      {activeModal === "form"              && <RoleFormModal   role={selRole} onClose={closeModal} onSave={handleSave} />}
      {activeModal === "delete" && selRole && <DeleteModal     role={selRole} onClose={closeModal} onConfirm={handleConfirmDelete} />}

      {/* Toast */}
      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}
