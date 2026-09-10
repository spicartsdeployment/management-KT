import React, { useState, useMemo, useCallback, useEffect } from "react";
import "../../Assets/styles/Policies.scss";
import ManagementPageHeader from "../../app/components/common/ManagementPageHeader";
import {
  MOCK_POLICIES,
  MOCK_VERSIONS,
  POLICY_CATEGORIES,
  POLICY_STATUSES,
  POLICY_METRICS_DEF,
  VISIBILITY_OPTIONS,
  APPROVAL_STAGES,
  CATEGORY_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
  VISIBILITY_FILTER_OPTIONS,
  ACK_FILTER_OPTIONS,
  computePolicyMetrics,
} from "./policiesMockData";

// ─── Helpers ──────────────────────────────────────────────────────────────────
/**
 * Format ISO date string as locale date.
 * @param {string} iso
 * @returns {string}
 */
const fmtDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

/**
 * Format ISO date as relative time.
 * @param {string} iso
 * @returns {string}
 */
const fmtRelative = (iso) => {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 1) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
};

/**
 * Get category config by id.
 * @param {string} id
 */
const getCat = (id) =>
  POLICY_CATEGORIES.find((c) => c.id === id) || { label: id, icon: "📄", color: "#6b7280", bg: "rgba(107,114,128,.09)" };

/**
 * Get status config by value.
 * @param {string} val
 */
const getStatus = (val) =>
  POLICY_STATUSES.find((s) => s.value === val) || { label: val, color: "#6b7280", bg: "rgba(107,114,128,.1)" };

/**
 * Compute acknowledgment percentage.
 * @param {object} policy
 * @returns {number}
 */
const ackPct = (policy) =>
  policy.ackRequired && policy.ackTotal > 0
    ? Math.round((policy.ackDone / policy.ackTotal) * 100)
    : null;

// ─── Small UI primitives ──────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const s = getStatus(status);
  return (
    <span
      className={`pm-status-badge pm-status-badge--${status}`}
      style={{ color: s.color, background: s.bg }}
    >
      {s.label}
    </span>
  );
};

const CatBadge = ({ categoryId }) => {
  const c = getCat(categoryId);
  return (
    <span className="pm-cat-badge" style={{ color: c.color, background: c.bg }}>
      {c.icon} {c.label}
    </span>
  );
};

const VersionBadge = ({ version }) => (
  <span className="pm-version-badge">{version}</span>
);

const VisBadges = ({ visibility }) => {
  const labels = visibility.includes("all")
    ? [{ value: "all", label: "All Users" }]
    : VISIBILITY_OPTIONS.filter((v) => visibility.includes(v.value));
  return (
    <div className="pm-vis-badges">
      {labels.map((v) => (
        <span key={v.value} className="pm-vis-badge">{v.label}</span>
      ))}
    </div>
  );
};

const AckBar = ({ policy, compact = false }) => {
  const pct = ackPct(policy);
  if (!policy.ackRequired) return <span className="pm-ack-badge pm-ack-badge--none">—</span>;
  return (
    <div className="pm-ack-bar">
      {!compact && (
        <div className="pm-ack-bar__top">
          <span>{policy.ackDone}/{policy.ackTotal} acknowledged</span>
          <span className="pm-ack-bar__pct">{pct}%</span>
        </div>
      )}
      <div className="pm-ack-bar__track">
        <div className="pm-ack-bar__fill" style={{ width: `${pct}%` }} />
      </div>
      {compact && <span style={{ fontSize: ".7rem", color: "#16a34a", fontWeight: 700 }}>{pct}%</span>}
    </div>
  );
};

const AttachChip = ({ att, onDownload }) => {
  const icons = { pdf: "📄", doc: "📃", image: "🖼️" };
  return (
    <button
      className="pm-attach"
      onClick={() => onDownload(att)}
      title={`Download ${att.name}`}
    >
      <span className="pm-attach__icon">{icons[att.type] || "📎"}</span>
      <span className="pm-attach__name">{att.name}</span>
      <span className="pm-attach__size">{att.size}</span>
    </button>
  );
};

const ApprovalFlow = ({ stage }) => {
  const idx = APPROVAL_STAGES.indexOf(stage);
  return (
    <div className="pm-approval-flow">
      {APPROVAL_STAGES.map((s, i) => (
        <React.Fragment key={s}>
          <div className={`pm-approval-flow__stage${i < idx ? " pm-approval-flow__stage--done" : i === idx ? " pm-approval-flow__stage--current" : ""}`}>
            <span className={`pm-approval-flow__stage-dot${i < idx ? " pm-approval-flow__stage-dot--done" : i === idx ? " pm-approval-flow__stage-dot--current" : ""}`} />
            {s}
          </div>
          {i < APPROVAL_STAGES.length - 1 && <span className="pm-approval-flow__arrow">›</span>}
        </React.Fragment>
      ))}
    </div>
  );
};

const Toast = ({ msg, type = "success", onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 3500);
    return () => clearTimeout(t);
  }, [onDone]);
  const icons = { success: "✅", error: "❌", warn: "⚠️", info: "ℹ️" };
  return (
    <div className={`pm-toast pm-toast--${type}`} role="alert">
      {icons[type]} {msg}
    </div>
  );
};

// ─── Create / Edit Modal ──────────────────────────────────────────────────────
const EMPTY_FORM = {
  title: "", category: "", description: "", content: "",
  effectiveDate: "", expiryDate: "",
  visibility: ["students"],
  status: "draft", approvalStage: "Draft",
  ackRequired: false, attachments: [],
};

const CreateEditModal = ({ policy, onClose, onSave }) => {
  const isEdit = Boolean(policy);
  const [form, setForm]     = useState(isEdit ? { ...policy } : { ...EMPTY_FORM });
  const [errors, setErrors] = useState({});

  const set = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const toggleVis = (val) => {
    setForm((p) => {
      const cur = p.visibility || [];
      return {
        ...p,
        visibility: cur.includes(val) ? cur.filter((v) => v !== val) : [...cur, val],
      };
    });
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim())    e.title    = "Title is required.";
    if (!form.category)        e.category = "Category is required.";
    if (!form.effectiveDate)   e.effectiveDate = "Effective date is required.";
    if (!form.visibility?.length) e.visibility = "Select at least one audience.";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form, isEdit);
  };

  return (
    <div className="pm-modal-backdrop" role="dialog" aria-modal="true" data-testid="school-modal-pm-create-edit">
      <div className="pm-modal pm-modal--lg">
        <div className="pm-modal__header">
          <span className="pm-modal__title">{isEdit ? "✏️ Edit Policy" : "📄 Create Policy"}</span>
          <button className="pm-modal__close" onClick={onClose} aria-label="Close" data-testid="school-button-pm-modal-close-form">✕</button>
        </div>

        <div className="pm-modal__body">
          <div className="pm-form">
            <span className="pm-form-section">Basic Information</span>

            <div className="pm-field">
              <label className="pm-field__label">Policy Title *</label>
              <input
                className={`pm-field__input${errors.title ? " pm-field__input--error" : ""}`}
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. Student Academic Integrity Policy"
                data-testid="school-field-pm-title"
              />
              {errors.title && <span className="pm-field__error">{errors.title}</span>}
            </div>

            <div className="pm-form-grid">
              <div className="pm-field">
                <label className="pm-field__label">Category *</label>
                <select
                  className={`pm-field__select${errors.category ? " pm-field__select--error" : ""}`}
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  data-testid="school-dropdown-pm-category"
                >
                  <option value="">Select category…</option>
                  {POLICY_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                  ))}
                </select>
                {errors.category && <span className="pm-field__error">{errors.category}</span>}
              </div>

              <div className="pm-field">
                <label className="pm-field__label">Status</label>
                <select
                  className="pm-field__select"
                  value={form.status}
                  onChange={(e) => set("status", e.target.value)}
                  data-testid="school-dropdown-pm-status"
                >
                  {POLICY_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pm-field">
              <label className="pm-field__label">Short Description</label>
              <input
                className="pm-field__input"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="One-line summary of this policy…"
                data-testid="school-field-pm-description"
              />
            </div>

            <div className="pm-field pm-form-grid__full">
              <label className="pm-field__label">Detailed Content</label>
              <textarea
                className="pm-field__textarea"
                style={{ minHeight: "120px" }}
                value={form.content}
                onChange={(e) => set("content", e.target.value)}
                placeholder="Full policy text…"
                data-testid="school-field-pm-content"
              />
              <span className="pm-field__hint">Plain text. Rich editor integration placeholder.</span>
            </div>

            <span className="pm-form-section">Dates & Visibility</span>

            <div className="pm-form-grid">
              <div className="pm-field">
                <label className="pm-field__label">Effective Date *</label>
                <input
                  type="date"
                  className={`pm-field__input${errors.effectiveDate ? " pm-field__input--error" : ""}`}
                  value={form.effectiveDate}
                  onChange={(e) => set("effectiveDate", e.target.value)}
                  data-testid="school-field-pm-effective-date"
                />
                {errors.effectiveDate && <span className="pm-field__error">{errors.effectiveDate}</span>}
              </div>

              <div className="pm-field">
                <label className="pm-field__label">Expiry Date</label>
                <input
                  type="date"
                  className="pm-field__input"
                  value={form.expiryDate}
                  onChange={(e) => set("expiryDate", e.target.value)}
                  data-testid="school-field-pm-expiry-date"
                />
              </div>
            </div>

            <div className="pm-field">
              <label className="pm-field__label">Visibility Audience *</label>
              <div className="pm-vis-checkboxes" data-testid="school-field-pm-visibility">
                {VISIBILITY_OPTIONS.map((v) => (
                  <label key={v.value}>
                    <input
                      type="checkbox"
                      checked={form.visibility?.includes(v.value)}
                      onChange={() => toggleVis(v.value)}
                      data-testid={`school-check-pm-vis-${v.value}`}
                    />
                    {v.label}
                  </label>
                ))}
              </div>
              {errors.visibility && <span className="pm-field__error">{errors.visibility}</span>}
            </div>

            <span className="pm-form-section">Settings & Attachments</span>

            <div className="pm-toggle-row">
              <div>
                <div className="pm-toggle-row__label">Require Acknowledgment</div>
                <div className="pm-toggle-row__desc">Recipients must digitally acknowledge this policy.</div>
              </div>
              <label className="pm-toggle" data-testid="school-toggle-pm-ack-required">
                <input
                  type="checkbox"
                  checked={form.ackRequired}
                  onChange={(e) => set("ackRequired", e.target.checked)}
                />
                <span className="pm-toggle__track" />
              </label>
            </div>

            <div className="pm-field">
              <label className="pm-field__label">Approval Stage</label>
              <select
                className="pm-field__select"
                value={form.approvalStage}
                onChange={(e) => set("approvalStage", e.target.value)}
                data-testid="school-dropdown-pm-approval"
              >
                {APPROVAL_STAGES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="pm-field">
              <label className="pm-field__label">Attachments</label>
              <div
                className="pm-file-drop"
                onClick={() => {}}
                role="button"
                tabIndex={0}
                aria-label="Upload attachments"
                data-testid="school-upload-pm-attachments"
              >
                <span className="pm-file-drop__icon">📎</span>
                Click to upload PDF, DOC/DOCX, or image files
                <div className="pm-file-drop__hint">Max 20MB per file · PDF, DOC, DOCX, PNG, JPG</div>
              </div>
              {form.attachments?.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem", marginTop: ".375rem" }}>
                  {form.attachments.map((a, i) => (
                    <AttachChip key={i} att={a} onDownload={() => {}} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pm-modal__footer">
          <button className="pm-btn pm-btn--ghost" onClick={onClose} data-testid="school-button-pm-form-cancel">Cancel</button>
          <button className="pm-btn pm-btn--primary" onClick={handleSubmit} data-testid="school-button-pm-form-save">
            {isEdit ? "💾 Save Changes" : "📄 Create Policy"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── View Policy Modal ────────────────────────────────────────────────────────
const ViewModal = ({ policy, onClose, onEdit, onArchive, showToast }) => {
  const [activeSection, setActiveSection] = useState("details");
  const versions = MOCK_VERSIONS[policy.id] || [];
  const cat = getCat(policy.category);
  const pct = ackPct(policy);

  return (
    <div className="pm-modal-backdrop" role="dialog" aria-modal="true" data-testid="school-modal-pm-view">
      <div className="pm-modal pm-modal--view">
        <div className="pm-modal__header">
          <span className="pm-modal__title">{cat.icon} {policy.title}</span>
          <button className="pm-modal__close" onClick={onClose} aria-label="Close" data-testid="school-button-pm-view-close">✕</button>
        </div>

        {/* Section tabs */}
        <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--pm-line)", padding: "0 1.375rem", flexShrink: 0 }}>
          {["details", "versions", "acknowledgments"].map((s) => (
            <button
              key={s}
              className={`pm-tab${activeSection === s ? " pm-tab--active" : ""}`}
              onClick={() => setActiveSection(s)}
              data-testid={`school-tab-pm-view-${s}`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <div className="pm-modal__body">
          {activeSection === "details" && (
            <div className="pm-detail">
              <div className="pm-detail__hero">
                <div className="pm-detail__hero-top">
                  <h2 className="pm-detail__title">{policy.title}</h2>
                  <div className="pm-detail__badges">
                    <StatusBadge status={policy.status} />
                    <VersionBadge version={policy.version} />
                  </div>
                </div>
                {policy.description && <p className="pm-detail__desc">{policy.description}</p>}
                <div className="pm-detail__meta">
                  <span className="pm-detail__meta-item">📅 Effective: {fmtDate(policy.effectiveDate)}</span>
                  {policy.expiryDate && <span className="pm-detail__meta-item">🔚 Expires: {fmtDate(policy.expiryDate)}</span>}
                  <span className="pm-detail__meta-item">🔄 Updated: {fmtRelative(policy.lastUpdated)}</span>
                  <span className="pm-detail__meta-item">✍️ {policy.updatedBy}</span>
                </div>
                <ApprovalFlow stage={policy.approvalStage} />
              </div>

              <span className="pm-detail__section">Policy Details</span>
              <div className="pm-detail__grid">
                <div className="pm-detail__field">
                  <span className="pm-detail__field-label">Category</span>
                  <CatBadge categoryId={policy.category} />
                </div>
                <div className="pm-detail__field">
                  <span className="pm-detail__field-label">Version</span>
                  <VersionBadge version={policy.version} />
                </div>
                <div className="pm-detail__field">
                  <span className="pm-detail__field-label">Effective Date</span>
                  <span className="pm-detail__field-value">{fmtDate(policy.effectiveDate)}</span>
                </div>
                <div className="pm-detail__field">
                  <span className="pm-detail__field-label">Expiry Date</span>
                  <span className="pm-detail__field-value">{fmtDate(policy.expiryDate)}</span>
                </div>
                <div className="pm-detail__field" style={{ gridColumn: "1/-1" }}>
                  <span className="pm-detail__field-label">Visibility</span>
                  <VisBadges visibility={policy.visibility} />
                </div>
                <div className="pm-detail__field">
                  <span className="pm-detail__field-label">Acknowledgment</span>
                  <span className="pm-detail__field-value">{policy.ackRequired ? "Required" : "Not required"}</span>
                </div>
                <div className="pm-detail__field">
                  <span className="pm-detail__field-label">Policy ID</span>
                  <span className="pm-detail__field-value" style={{ fontFamily: "monospace" }}>{policy.id}</span>
                </div>
              </div>

              {policy.content && (
                <>
                  <span className="pm-detail__section">Policy Content</span>
                  <div className="pm-detail__content">{policy.content}</div>
                </>
              )}

              {policy.attachments?.length > 0 && (
                <>
                  <span className="pm-detail__section">Attachments ({policy.attachments.length})</span>
                  <div className="pm-detail__attachments">
                    {policy.attachments.map((a, i) => (
                      <AttachChip key={i} att={a} onDownload={() => showToast(`Downloading ${a.name}…`, "info")} />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {activeSection === "versions" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="pm-detail__section">Version History</div>
              {versions.length === 0 ? (
                <div className="pm-empty">
                  <span className="pm-empty__icon">📋</span>
                  <span className="pm-empty__title">No version history available</span>
                </div>
              ) : (
                <div className="pm-versions">
                  {versions.map((v, i) => (
                    <div key={v.version} className="pm-version-item">
                      <div className={`pm-version-item__dot${i === 0 ? " pm-version-item__dot--current" : ""}`} />
                      <div className="pm-version-item__body">
                        <div className="pm-version-item__row">
                          <VersionBadge version={v.version} />
                          <span className="pm-version-item__date">{fmtDate(v.date)}</span>
                          <span className="pm-version-item__by">by {v.by}</span>
                          {i > 0 && (
                            <button
                              className="pm-btn pm-btn--ghost pm-btn--sm pm-version-item__restore"
                              onClick={() => showToast(`Restored to ${v.version}`, "success")}
                              data-testid={`school-button-pm-restore-${v.version}`}
                            >
                              ♻ Restore
                            </button>
                          )}
                        </div>
                        <div className="pm-version-item__summary">{v.summary}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === "acknowledgments" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="pm-detail__section">Acknowledgment Status</div>
              {!policy.ackRequired ? (
                <div className="pm-empty">
                  <span className="pm-empty__icon">✅</span>
                  <span className="pm-empty__title">Acknowledgment not required</span>
                  <span className="pm-empty__sub">This policy does not require digital acknowledgment from users.</span>
                </div>
              ) : (
                <div className="pm-ack-tracker">
                  <div className="pm-ack-tracker__stats">
                    <div className="pm-ack-tracker__stat">
                      <div className="pm-ack-tracker__stat-value">{policy.ackTotal}</div>
                      <div className="pm-ack-tracker__stat-label">Total Required</div>
                    </div>
                    <div className="pm-ack-tracker__stat">
                      <div className="pm-ack-tracker__stat-value" style={{ color: "#16a34a" }}>{policy.ackDone}</div>
                      <div className="pm-ack-tracker__stat-label">Acknowledged</div>
                    </div>
                    <div className="pm-ack-tracker__stat">
                      <div className="pm-ack-tracker__stat-value" style={{ color: "#dc2626" }}>{policy.ackPending}</div>
                      <div className="pm-ack-tracker__stat-label">Pending</div>
                    </div>
                  </div>
                  <div className="pm-ack-tracker__big-bar">
                    <div className="pm-ack-bar__top">
                      <span>Overall Progress</span>
                      <span className="pm-ack-bar__pct">{ackPct(policy)}%</span>
                    </div>
                    <div className="pm-ack-bar__track">
                      <div className="pm-ack-bar__fill" style={{ width: `${ackPct(policy)}%` }} />
                    </div>
                  </div>
                  <div
                    style={{
                      padding: ".875rem 1rem",
                      background: "var(--pm-input)",
                      borderRadius: ".375rem",
                      fontSize: ".8125rem",
                      color: "var(--pm-muted)",
                      border: "1px solid var(--pm-line)",
                    }}
                  >
                    📌 Acknowledgment is tracked per user group. Applicable for:{" "}
                    <strong>{policy.visibility.join(", ")}</strong>. Detailed per-user tracking
                    available in the Compliance Reports module.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="pm-modal__footer">
          {policy.status !== "archived" && (
            <button
              className="pm-btn pm-btn--ghost"
              onClick={() => onArchive(policy)}
              data-testid="school-button-pm-view-archive"
            >
              🗄 Archive
            </button>
          )}
          <button
            className="pm-btn pm-btn--ghost"
            onClick={() => showToast("Policy sent to print…", "info")}
            data-testid="school-button-pm-view-print"
          >
            🖨 Print
          </button>
          <button
            className="pm-btn pm-btn--ghost"
            onClick={() => showToast("Share link copied!", "success")}
            data-testid="school-button-pm-view-share"
          >
            🔗 Share
          </button>
          <button
            className="pm-btn pm-btn--primary"
            onClick={() => onEdit(policy)}
            data-testid="school-button-pm-view-edit"
          >
            ✏️ Edit
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Archive / Status Confirm Modals ─────────────────────────────────────────
const ArchiveModal = ({ policy, onClose, onConfirm }) => (
  <div className="pm-modal-backdrop" role="dialog" aria-modal="true" data-testid="school-modal-pm-archive">
    <div className="pm-modal pm-modal--sm">
      <div className="pm-modal__header">
        <span className="pm-modal__title">🗄 Archive Policy</span>
        <button className="pm-modal__close" onClick={onClose} aria-label="Close">✕</button>
      </div>
      <div className="pm-modal__body">
        <div className="pm-confirm">
          <div className="pm-confirm__icon">🗄️</div>
          <div className="pm-confirm__title">Archive this policy?</div>
          <p className="pm-confirm__msg">
            <strong>{policy?.title}</strong> will be moved to the archive. It will remain
            accessible in Archived Policies but will no longer be visible to users.
          </p>
          <p className="pm-confirm__warn">This action can be reversed by restoring the policy.</p>
        </div>
      </div>
      <div className="pm-modal__footer">
        <button className="pm-btn pm-btn--ghost" onClick={onClose} data-testid="school-button-pm-archive-cancel">Cancel</button>
        <button className="pm-btn pm-btn--danger" onClick={onConfirm} data-testid="school-button-pm-archive-confirm">Archive</button>
      </div>
    </div>
  </div>
);

const ActivateModal = ({ policy, onClose, onConfirm }) => (
  <div className="pm-modal-backdrop" role="dialog" aria-modal="true" data-testid="school-modal-pm-activate">
    <div className="pm-modal pm-modal--sm">
      <div className="pm-modal__header">
        <span className="pm-modal__title">✅ Publish Policy</span>
        <button className="pm-modal__close" onClick={onClose} aria-label="Close">✕</button>
      </div>
      <div className="pm-modal__body">
        <div className="pm-confirm">
          <div className="pm-confirm__icon">✅</div>
          <div className="pm-confirm__title">Publish this policy?</div>
          <p className="pm-confirm__msg">
            <strong>{policy?.title}</strong> will be set to <strong>Active</strong> and made
            visible to the configured audience.
          </p>
        </div>
      </div>
      <div className="pm-modal__footer">
        <button className="pm-btn pm-btn--ghost" onClick={onClose} data-testid="school-button-pm-activate-cancel">Cancel</button>
        <button className="pm-btn pm-btn--success" onClick={onConfirm} data-testid="school-button-pm-activate-confirm">Publish</button>
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
/**
 * PolicyManagement — centralized institutional policy repository and governance hub.
 * Features: metrics, category filter, search/filter toolbar, policy table + card views,
 * create/edit/view/archive modals, version history, acknowledgment tracking, recent updates.
 */
const PolicyManagement = () => {
  // ── Core state ──────────────────────────────────────────────────────────────
  const [policies,     setPolicies]     = useState(MOCK_POLICIES);
  const [search,       setSearch]       = useState("");
  const [filterCat,    setFilterCat]    = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterVis,    setFilterVis]    = useState("all");
  const [filterAck,    setFilterAck]    = useState("all");
  const [activeTab,    setActiveTab]    = useState("all");
  const [page,         setPage]         = useState(1);
  const PAGE_SIZE = 10;

  const [viewMode,     setViewMode]     = useState("table");
  const [filtersOpen,  setFiltersOpen]  = useState(true);

  const [activeModal,  setActiveModal]  = useState(null);
  const [selPolicy,    setSelPolicy]    = useState(null);
  const [toast,        setToast]        = useState(null);

  // ── Derived ─────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return policies.filter((p) => {
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.includes(q)) ||
        getCat(p.category).label.toLowerCase().includes(q);

      const matchCat    = filterCat    === "all" || p.category === filterCat;
      const matchStatus = filterStatus === "all" || p.status   === filterStatus;
      const matchTab    = activeTab    === "all" || p.status   === activeTab;
      const matchVis    = filterVis    === "all" || p.visibility.includes(filterVis) || p.visibility.includes("all");
      const matchAck    =
        filterAck === "all" ||
        (filterAck === "required" && p.ackRequired) ||
        (filterAck === "pending"  && p.ackPending > 0) ||
        (filterAck === "complete" && p.ackRequired && p.ackPending === 0 && p.ackDone > 0);

      return matchSearch && matchCat && matchStatus && matchTab && matchVis && matchAck;
    });
  }, [policies, search, filterCat, filterStatus, activeTab, filterVis, filterAck]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const metrics    = useMemo(() => computePolicyMetrics(policies), [policies]);

  const recentPolicies = useMemo(
    () => [...policies]
      .filter((p) => p.status !== "archived")
      .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
      .slice(0, 6),
    [policies]
  );

  // ── Handlers ────────────────────────────────────────────────────────────────
  const showToast   = useCallback((msg, type = "success") => setToast({ msg, type }), []);
  const closeModal  = useCallback(() => { setActiveModal(null); setSelPolicy(null); }, []);

  const handleView    = useCallback((p) => { setSelPolicy(p); setActiveModal("view");    }, []);
  const handleEdit    = useCallback((p) => { setSelPolicy(p); setActiveModal("edit");    }, []);
  const handleArchive = useCallback((p) => { setSelPolicy(p); setActiveModal("archive"); }, []);
  const handleActivate= useCallback((p) => { setSelPolicy(p); setActiveModal("activate");}, []);

  const handleSave = useCallback((form, isEdit) => {
    if (isEdit) {
      setPolicies((prev) =>
        prev.map((p) => p.id === form.id ? { ...form, lastUpdated: new Date().toISOString().slice(0, 10) } : p)
      );
      showToast("Policy updated successfully.");
    } else {
      const newPolicy = {
        ...form,
        id: `POL-${String(policies.length + 1).padStart(4, "0")}`,
        version: "v1.0",
        lastUpdated: new Date().toISOString().slice(0, 10),
        updatedBy: "Current User",
        ackTotal: 0, ackDone: 0, ackPending: 0,
        tags: [],
      };
      setPolicies((prev) => [newPolicy, ...prev]);
      showToast("Policy created successfully.");
    }
    closeModal();
  }, [policies.length, closeModal, showToast]);

  const confirmArchive = useCallback(() => {
    if (!selPolicy) return;
    const title = selPolicy.title;
    setPolicies((prev) =>
      prev.map((p) => p.id === selPolicy.id ? { ...p, status: "archived" } : p)
    );
    closeModal();
    showToast(`"${title}" archived.`, "warn");
  }, [selPolicy, closeModal, showToast]);

  const confirmActivate = useCallback(() => {
    if (!selPolicy) return;
    const title = selPolicy.title;
    setPolicies((prev) =>
      prev.map((p) => p.id === selPolicy.id ? { ...p, status: "active", approvalStage: "Published" } : p)
    );
    closeModal();
    showToast(`"${title}" published as active.`);
  }, [selPolicy, closeModal, showToast]);

  const handleDownload = useCallback((policy) => {
    showToast(`Downloading ${policy.title}…`, "info");
  }, [showToast]);

  const resetFilters = () => {
    setSearch(""); setFilterCat("all"); setFilterStatus("all");
    setFilterVis("all"); setFilterAck("all"); setActiveTab("all"); setPage(1);
  };

  const tabCounts = useMemo(() => ({
    all:      policies.length,
    active:   policies.filter((p) => p.status === "active").length,
    draft:    policies.filter((p) => p.status === "draft").length,
    archived: policies.filter((p) => p.status === "archived").length,
  }), [policies]);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="pm-root" data-testid="school-page-pm-policies">

      <ManagementPageHeader
        breadcrumbs={[
          { label: "Management" },
          { label: "Policies" },
        ]}
        title="Policy Management"
        subtitle="Centralized institutional policy repository — manage, version, publish, and track compliance."
        actions={(
          <>
            <button
              className="pm-btn pm-btn--ghost"
              onClick={() => showToast("Exporting policies…", "info")}
              data-testid="school-button-pm-export"
            >
              ⬇ Export
            </button>
            <button
              className="pm-btn pm-btn--primary"
              onClick={() => setActiveModal("create")}
              data-testid="school-button-pm-create"
            >
              📄 Create Policy
            </button>
          </>
        )}
      />

      {/* ── Metrics ── */}
      <div className="pm-metrics" data-testid="school-grid-pm-metrics">
        {POLICY_METRICS_DEF.map((m) => (
          <div
            key={m.id}
            className={`pm-metric-card pm-metric-card--${m.color}`}
            data-testid={`school-metric-pm-${m.id}`}
          >
            <span className="pm-metric-card__icon">{m.icon}</span>
            <div className="pm-metric-card__body">
              <span className="pm-metric-card__value">{metrics[m.id]}</span>
              <span className="pm-metric-card__label">{m.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Category Bar ── */}
      <div className="pm-cat-bar" role="navigation" aria-label="Filter by category" data-testid="school-cat-bar-pm">
        <button
          className={`pm-cat-chip${filterCat === "all" ? " pm-cat-chip--active" : ""}`}
          onClick={() => { setFilterCat("all"); setPage(1); }}
          data-testid="school-cat-pm-all"
        >
          📋 All
        </button>
        {POLICY_CATEGORIES.map((c) => (
          <button
            key={c.id}
            className={`pm-cat-chip${filterCat === c.id ? " pm-cat-chip--active" : ""}`}
            onClick={() => { setFilterCat(c.id); setPage(1); }}
            data-testid={`school-cat-pm-${c.id}`}
          >
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="pm-toolbar" data-testid="school-toolbar-pm">
        <div className="pm-search" data-testid="school-search-pm">
          <span className="pm-search__icon">🔍</span>
          <input
            type="text"
            placeholder="Search by title, category, keyword, tag…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            aria-label="Search policies"
            data-testid="school-input-pm-search"
          />
          {search && (
            <button
              style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: 0 }}
              onClick={() => { setSearch(""); setPage(1); }}
              aria-label="Clear search"
            >✕</button>
          )}
        </div>

        <button
          className="pm-toolbar__filters-toggle"
          onClick={() => setFiltersOpen((p) => !p)}
          aria-expanded={filtersOpen}
          data-testid="school-button-pm-toggle-filters"
        >
          ⚙ Filters {filtersOpen ? "▲" : "▼"}
        </button>

        <div className={`pm-toolbar__filters${filtersOpen ? "" : " pm-toolbar__filters--hidden"}`}>
          <select
            className="pm-filter-select"
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            aria-label="Filter by status"
            data-testid="school-dropdown-pm-status-filter"
          >
            {STATUS_FILTER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          <select
            className="pm-filter-select"
            value={filterVis}
            onChange={(e) => { setFilterVis(e.target.value); setPage(1); }}
            aria-label="Filter by visibility"
            data-testid="school-dropdown-pm-vis-filter"
          >
            {VISIBILITY_FILTER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          <select
            className="pm-filter-select"
            value={filterAck}
            onChange={(e) => { setFilterAck(e.target.value); setPage(1); }}
            aria-label="Filter by acknowledgment"
            data-testid="school-dropdown-pm-ack-filter"
          >
            {ACK_FILTER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {(search || filterCat !== "all" || filterStatus !== "all" || filterVis !== "all" || filterAck !== "all") && (
            <button
              className="pm-btn pm-btn--ghost pm-btn--sm"
              onClick={resetFilters}
              data-testid="school-button-pm-reset-filters"
            >
              ✕ Clear
            </button>
          )}
        </div>

        <div className="pm-toolbar__right">
          <div className="pm-view-toggle" aria-label="Toggle view mode">
            <button
              className={viewMode === "table" ? "active" : ""}
              onClick={() => setViewMode("table")}
              title="Table view"
              data-testid="school-button-pm-view-table"
            >☰</button>
            <button
              className={viewMode === "cards" ? "active" : ""}
              onClick={() => setViewMode("cards")}
              title="Card view"
              data-testid="school-button-pm-view-cards"
            >⊞</button>
          </div>
        </div>
      </div>

      {/* ── Table / Cards ── */}
      <div className="pm-table-wrap" data-testid="school-table-wrap-pm">
        <div className="pm-results-bar">
          <div className="pm-results-bar__tabs">
            {["all", "active", "draft", "archived"].map((t) => (
              <button
                key={t}
                className={`pm-tab${activeTab === t ? " pm-tab--active" : ""}`}
                onClick={() => { setActiveTab(t); setPage(1); }}
                data-testid={`school-tab-pm-${t}`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)} ({tabCounts[t]})
              </button>
            ))}
          </div>
          <span className="pm-results-bar__count">
            {filtered.length} polic{filtered.length !== 1 ? "ies" : "y"}
          </span>
        </div>

        {viewMode === "table" ? (
          <>
            <div className="pm-table-scroll">
              <table className="pm-table" aria-label="Policy listing table">
                <thead>
                  <tr>
                    <th>Policy</th>
                    <th>Category</th>
                    <th>Version</th>
                    <th>Effective</th>
                    <th>Updated</th>
                    <th>Visibility</th>
                    <th>Status</th>
                    <th>Ack %</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.length === 0 ? (
                    <tr className="pm-table__empty">
                      <td colSpan={9}>
                        <div className="pm-empty">
                          <span className="pm-empty__icon">🔍</span>
                          <span className="pm-empty__title">No policies found</span>
                          <span className="pm-empty__sub">Try adjusting your search or filters.</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    pageItems.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <div className="pm-cell-title">{p.title}</div>
                          <div className="pm-cell-sub pm-cell-mono">{p.id}</div>
                        </td>
                        <td><CatBadge categoryId={p.category} /></td>
                        <td><VersionBadge version={p.version} /></td>
                        <td className="pm-cell-muted">{fmtDate(p.effectiveDate)}</td>
                        <td className="pm-cell-muted">{fmtRelative(p.lastUpdated)}</td>
                        <td><VisBadges visibility={p.visibility} /></td>
                        <td><StatusBadge status={p.status} /></td>
                        <td style={{ minWidth: "90px" }}>
                          {p.ackRequired ? (
                            <AckBar policy={p} compact />
                          ) : (
                            <span className="pm-cell-muted" style={{ fontSize: ".75rem" }}>N/A</span>
                          )}
                        </td>
                        <td>
                          <div className="pm-actions">
                            <button
                              className="pm-action-btn"
                              title="View Policy"
                              onClick={() => handleView(p)}
                              data-testid={`school-button-pm-view-${p.id}`}
                            >🔎</button>
                            <button
                              className="pm-action-btn"
                              title="Edit Policy"
                              onClick={() => handleEdit(p)}
                              data-testid={`school-button-pm-edit-${p.id}`}
                            >✏️</button>
                            <button
                              className="pm-action-btn pm-action-btn--info"
                              title="Download Policy"
                              onClick={() => handleDownload(p)}
                              data-testid={`school-button-pm-download-${p.id}`}
                            >⬇</button>
                            {p.status === "draft" && (
                              <button
                                className="pm-action-btn pm-action-btn--success"
                                title="Publish Policy"
                                onClick={() => handleActivate(p)}
                                data-testid={`school-button-pm-publish-${p.id}`}
                              >✅</button>
                            )}
                            {p.status !== "archived" && (
                              <button
                                className="pm-action-btn pm-action-btn--danger"
                                title="Archive Policy"
                                onClick={() => handleArchive(p)}
                                data-testid={`school-button-pm-archive-${p.id}`}
                              >🗄</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div style={{ padding: "1rem" }}>
            {pageItems.length === 0 ? (
              <div className="pm-empty">
                <span className="pm-empty__icon">🔍</span>
                <span className="pm-empty__title">No policies found</span>
                <span className="pm-empty__sub">Try adjusting your search or filters.</span>
              </div>
            ) : (
              <div className="pm-cards">
                {pageItems.map((p) => {
                  const cat = getCat(p.category);
                  return (
                    <div key={p.id} className="pm-policy-card" style={{ borderTopColor: cat.color }} data-testid={`school-card-pm-${p.id}`}>
                      <div className="pm-policy-card__top">
                        <span className="pm-policy-card__icon">{cat.icon}</span>
                        <div className="pm-policy-card__badges">
                          <StatusBadge status={p.status} />
                          <VersionBadge version={p.version} />
                        </div>
                      </div>
                      <h3 className="pm-policy-card__title">{p.title}</h3>
                      {p.description && <p className="pm-policy-card__desc">{p.description}</p>}
                      <div className="pm-policy-card__meta">
                        <span className="pm-policy-card__meta-item">📅 {fmtDate(p.effectiveDate)}</span>
                        <span className="pm-policy-card__meta-item">🔄 {fmtRelative(p.lastUpdated)}</span>
                      </div>
                      <VisBadges visibility={p.visibility} />
                      {p.ackRequired && (
                        <div className="pm-policy-card__ack">
                          <AckBar policy={p} />
                        </div>
                      )}
                      <div className="pm-policy-card__actions">
                        <button className="pm-btn pm-btn--ghost pm-btn--sm" onClick={() => handleView(p)} data-testid={`school-button-pm-card-view-${p.id}`}>🔎 View</button>
                        <button className="pm-btn pm-btn--ghost pm-btn--sm" onClick={() => handleEdit(p)} data-testid={`school-button-pm-card-edit-${p.id}`}>✏️ Edit</button>
                        <button className="pm-btn pm-btn--ghost pm-btn--sm" onClick={() => handleDownload(p)} data-testid={`school-button-pm-card-dl-${p.id}`}>⬇ Download</button>
                        {p.status !== "archived" && (
                          <button className="pm-btn pm-btn--ghost pm-btn--sm" onClick={() => handleArchive(p)} data-testid={`school-button-pm-card-archive-${p.id}`}>🗄</button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pm-pagination">
            <span className="pm-pagination__info">
              Page {page} of {totalPages} · {filtered.length} results
            </span>
            <div className="pm-pagination__pages">
              <button
                className="pm-page-btn"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                aria-label="Previous page"
                data-testid="school-button-pm-page-prev"
              >‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  className={`pm-page-btn${page === n ? " pm-page-btn--active" : ""}`}
                  onClick={() => setPage(n)}
                  aria-current={page === n ? "page" : undefined}
                  data-testid={`school-button-pm-page-${n}`}
                >{n}</button>
              ))}
              <button
                className="pm-page-btn"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                aria-label="Next page"
                data-testid="school-button-pm-page-next"
              >›</button>
            </div>
          </div>
        )}
      </div>

      {/* ── Recent Updates ── */}
      <div className="pm-recent" data-testid="school-recent-pm">
        <div className="pm-recent__header">
          <span className="pm-recent__header-title">🕐 Recently Updated Policies</span>
          <span style={{ fontSize: ".75rem", color: "#6b7280" }}>Last 30 days</span>
        </div>
        <div className="pm-recent__list">
          {recentPolicies.length === 0 ? (
            <div className="pm-empty" style={{ padding: "2rem" }}>
              <span className="pm-empty__icon">📭</span>
              <span className="pm-empty__title">No recent updates</span>
            </div>
          ) : (
            recentPolicies.map((p) => {
              const cat = getCat(p.category);
              return (
                <div
                  key={p.id}
                  className="pm-recent__item"
                  onClick={() => handleView(p)}
                  data-testid={`school-recent-item-pm-${p.id}`}
                >
                  <span className="pm-recent__icon">{cat.icon}</span>
                  <div className="pm-recent__body">
                    <div className="pm-recent__title">{p.title}</div>
                    <div className="pm-recent__meta">
                      <span>{fmtRelative(p.lastUpdated)}</span>
                      <span>by {p.updatedBy}</span>
                      <VersionBadge version={p.version} />
                    </div>
                  </div>
                  <div className="pm-recent__badge">
                    <StatusBadge status={p.status} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      {activeModal === "create" && (
        <CreateEditModal policy={null}    onClose={closeModal} onSave={handleSave} />
      )}
      {activeModal === "edit" && selPolicy && (
        <CreateEditModal policy={selPolicy} onClose={closeModal} onSave={handleSave} />
      )}
      {activeModal === "view" && selPolicy && (
        <ViewModal
          policy={selPolicy}
          onClose={closeModal}
          onEdit={(p) => { closeModal(); setTimeout(() => handleEdit(p), 50); }}
          onArchive={(p) => { closeModal(); setTimeout(() => handleArchive(p), 50); }}
          showToast={showToast}
        />
      )}
      {activeModal === "archive" && selPolicy && (
        <ArchiveModal policy={selPolicy} onClose={closeModal} onConfirm={confirmArchive} />
      )}
      {activeModal === "activate" && selPolicy && (
        <ActivateModal policy={selPolicy} onClose={closeModal} onConfirm={confirmActivate} />
      )}

      {/* ── Toast ── */}
      {toast && (
        <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />
      )}
    </div>
  );
};

export default PolicyManagement;
