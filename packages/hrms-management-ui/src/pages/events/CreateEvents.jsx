import React, { useState, useEffect } from "react";
import "../../Assets/styles/ManageEvents.scss";
import ManagementPageHeader from "../../app/components/common/ManagementPageHeader";

// ── Constants ──────────────────────────────────────────────────────────────────
const CATEGORY_LIST = ["sports", "academics", "cultural", "annual", "science", "arts", "workshop", "assembly", "cca"];
const TYPE_LIST     = ["House Competition", "Inter-School", "Intra-School", "Special Program", "Club Activity", "Workshop", "Assembly", "CCA"];
const HOUSE_LIST    = ["All", "Blue", "Red", "Yellow", "Green"];
const COORDINATORS  = ["Mr. Rajan Kumar", "Mrs. Priya Verma", "Ms. Sunita Singh", "Mr. Suresh Nair", "Principal Sharma", "VP Nair", "Mr. Deepak Jain", "Mr. Vikram Singh"];
const STATUS_LIST   = ["upcoming", "active", "ongoing", "completed", "cancelled"];
const AUDIENCE_LIST = ["All Students", "All Teachers", "Parents", "External Guests", "Alumni", "Staff Only"];

const BANNER_BG    = { sports:"#dbeafe", academics:"#d1fae5", cultural:"#ede9fe", annual:"#fef3c7", science:"#d1fae5", arts:"#fce7f3", workshop:"#fef9c3", assembly:"#f3f4f6", cca:"#dbeafe" };
const BANNER_EMOJI = { sports:"🏅", academics:"📚", cultural:"🎭", annual:"🎓", science:"🔬", arts:"🎨", workshop:"🛠️", assembly:"🎙️", cca:"💃" };

const EMPTY_FORM = {
  name: "", category: "", type: "", date: "", endDate: "", time: "", endTime: "",
  venue: "", venueCapacity: "", house: "All", coordinator: "", status: "upcoming",
  description: "", audience: [], tags: "", allowRegistration: false,
  requireApproval: false, sendNotification: true, maxParticipants: "",
};

/**
 * CreateEvents - Plan and schedule school events.
 * @returns {JSX.Element}
 */
export default function CreateEvents() {
  const [form,        setForm]        = useState({ ...EMPTY_FORM });
  const [errors,      setErrors]      = useState({});
  const [toast,       setToast]       = useState(null);
  const [successModal, setSuccessModal] = useState(false);
  const [step,        setStep]        = useState(1); // 1=Details, 2=Logistics, 3=Settings

  // ── Helpers ────────────────────────────────────────────────────────────────
  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: undefined }));
  };

  const toggleAudience = (val) => {
    setForm(f => ({
      ...f,
      audience: f.audience.includes(val) ? f.audience.filter(a => a !== val) : [...f.audience, val],
    }));
  };

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  }

  // ── Validation ─────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Event name is required.";
    if (!form.category)       e.category = "Please select a category.";
    if (!form.date)           e.date    = "Event date is required.";
    if (!form.venue.trim())   e.venue   = "Venue is required.";
    if (!form.coordinator)    e.coordinator = "Select a coordinator.";
    if (!form.audience.length) e.audience = "Select at least one audience.";
    return e;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleCreate = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); showToast("Please fix the errors before submitting.", "error"); return; }
    setSuccessModal(true);
  };

  const handleDraft = () => {
    setForm(f => ({ ...f, status: "draft" }));
    showToast("Event saved as draft.", "info");
  };

  const handleReset = () => {
    setForm({ ...EMPTY_FORM });
    setErrors({});
    setStep(1);
  };

  const catEmoji = BANNER_EMOJI[form.category] || "📅";
  const catBg    = BANNER_BG[form.category]    || "#f3f4f6";

  const STEPS = [
    { id: 1, label: "Event Details",   icon: "📋" },
    { id: 2, label: "Logistics",       icon: "📍" },
    { id: 3, label: "Participants",    icon: "👥" },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="em-root" data-testid="school-page-create-events">

      <ManagementPageHeader
        breadcrumbs={[
          { label: "Management" },
          { label: "Events" },
          { label: "Create" },
        ]}
        title="Create Event"
        subtitle="Plan and schedule a new school event or activity"
        actions={(
          <>
            <button className="em-btn em-btn--ghost" onClick={handleReset} data-testid="school-button-ce-reset">↺ Reset</button>
            <button className="em-btn em-btn--ghost" onClick={handleDraft} data-testid="school-button-ce-draft">📝 Save Draft</button>
            <button className="em-btn em-btn--primary" onClick={handleCreate} data-testid="school-button-ce-create">🚀 Create Event</button>
          </>
        )}
      />

      {/* ── Step Indicator ── */}
      <div className="em-tabs" role="tablist" data-testid="school-steps-ce-root">
        {STEPS.map(s => (
          <button key={s.id} role="tab" aria-selected={step === s.id}
            className={`em-tab${step === s.id ? " em-tab--active" : ""}`}
            onClick={() => setStep(s.id)}
            data-testid={`school-tab-ce-step-${s.id}`}>
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      {/* ── Two-column layout ── */}
      <div style={{ gridTemplateColumns: "1fr 340px", gap: "1.5rem", alignItems: "start" }}
           className="ce-layout" data-testid="school-layout-ce-root">

        {/* ── MAIN FORM ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" , marginBottom: "1rem"}}>


          {/* STEP 1 — Event Details */}
          {step === 1 && (
            <div className="em-table-wrap" data-testid="school-section-ce-details">
              <div style={{ padding: "1.125rem 1.375rem", borderBottom: "1px solid var(--em-line)" }}>
                <div style={{ fontWeight: 700, fontSize: ".9375rem", color: "var(--em-text)" }}>📋 Event Details</div>
                <div style={{ fontSize: ".8125rem", color: "#6b7280", marginTop: ".125rem" }}>Basic information about the event</div>
              </div>
              <div style={{ padding: "1.375rem" }}>
                <div className="em-form">
                  <div className="em-field">
                    <label className="em-field__label">Event Name *</label>
                    <input
                      value={form.name}
                      onChange={e => set("name", e.target.value)}
                      placeholder="e.g. Annual Sports Day 2026"
                      data-testid="school-field-ce-name"
                      style={{ borderColor: errors.name ? "#dc2626" : undefined }}
                    />
                    {errors.name && <span className="em-field__error">{errors.name}</span>}
                  </div>

                  <div className="em-form-grid">
                    <div className="em-field">
                      <label className="em-field__label">Category *</label>
                      <select
                        value={form.category}
                        onChange={e => set("category", e.target.value)}
                        data-testid="school-dropdown-ce-category"
                        style={{ borderColor: errors.category ? "#dc2626" : undefined }}>
                        <option value="">Select category…</option>
                        {CATEGORY_LIST.map(c => (
                          <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                        ))}
                      </select>
                      {errors.category && <span className="em-field__error">{errors.category}</span>}
                    </div>
                    <div className="em-field">
                      <label className="em-field__label">Event Type</label>
                      <select value={form.type} onChange={e => set("type", e.target.value)} data-testid="school-dropdown-ce-type">
                        <option value="">Select type…</option>
                        {TYPE_LIST.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="em-field">
                    <label className="em-field__label">Description</label>
                    <textarea
                      rows={4}
                      value={form.description}
                      onChange={e => set("description", e.target.value)}
                      placeholder="Describe the event, its purpose, and what participants can expect…"
                      data-testid="school-field-ce-desc"
                    />
                  </div>

                  <div className="em-form-grid">
                    <div className="em-field">
                      <label className="em-field__label">Assigned House</label>
                      <select value={form.house} onChange={e => set("house", e.target.value)} data-testid="school-dropdown-ce-house">
                        {HOUSE_LIST.map(h => <option key={h} value={h}>{h === "All" ? "All Houses" : `${h} House`}</option>)}
                      </select>
                    </div>
                    <div className="em-field">
                      <label className="em-field__label">Initial Status</label>
                      <select value={form.status} onChange={e => set("status", e.target.value)} data-testid="school-dropdown-ce-status">
                        {STATUS_LIST.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="em-field">
                    <label className="em-field__label">Tags <span style={{ color: "#6b7280", fontWeight: 400 }}>(comma separated)</span></label>
                    <input
                      value={form.tags}
                      onChange={e => set("tags", e.target.value)}
                      placeholder="e.g. Annual, Sports, Outdoor"
                      data-testid="school-field-ce-tags"
                    />
                    {form.tags && (
                      <div style={{ display: "flex", gap: ".3rem", flexWrap: "wrap", marginTop: ".25rem" }}>
                        {form.tags.split(",").map(t => t.trim()).filter(Boolean).map(t => (
                          <span key={t} className="em-chip" data-testid={`school-chip-ce-tag-${t}`}>{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — Logistics */}
          {step === 2 && (
            <div className="em-table-wrap" data-testid="school-section-ce-logistics">
              <div style={{ padding: "1.125rem 1.375rem", borderBottom: "1px solid var(--em-line)" }}>
                <div style={{ fontWeight: 700, fontSize: ".9375rem", color: "var(--em-text)" }}>📍 Scheduling & Venue</div>
                <div style={{ fontSize: ".8125rem", color: "#6b7280", marginTop: ".125rem" }}>Set the date, time, and location details</div>
              </div>
              <div style={{ padding: "1.375rem" }}>
                <div className="em-form">
                  <div className="em-form-grid">
                    <div className="em-field">
                      <label className="em-field__label">Start Date *</label>
                      <input
                        type="date" value={form.date}
                        onChange={e => set("date", e.target.value)}
                        data-testid="school-field-ce-date"
                        style={{ borderColor: errors.date ? "#dc2626" : undefined }}
                      />
                      {errors.date && <span className="em-field__error">{errors.date}</span>}
                    </div>
                    <div className="em-field">
                      <label className="em-field__label">End Date</label>
                      <input type="date" value={form.endDate} onChange={e => set("endDate", e.target.value)} data-testid="school-field-ce-end-date" />
                    </div>
                    <div className="em-field">
                      <label className="em-field__label">Start Time</label>
                      <input value={form.time} onChange={e => set("time", e.target.value)} placeholder="09:00 AM" data-testid="school-field-ce-time" />
                    </div>
                    <div className="em-field">
                      <label className="em-field__label">End Time</label>
                      <input value={form.endTime} onChange={e => set("endTime", e.target.value)} placeholder="05:00 PM" data-testid="school-field-ce-end-time" />
                    </div>
                  </div>

                  <div className="em-form-section">Venue Details</div>

                  <div className="em-field">
                    <label className="em-field__label">Venue / Location *</label>
                    <input
                      value={form.venue}
                      onChange={e => set("venue", e.target.value)}
                      placeholder="e.g. Main Ground, Auditorium, Science Block"
                      data-testid="school-field-ce-venue"
                      style={{ borderColor: errors.venue ? "#dc2626" : undefined }}
                    />
                    {errors.venue && <span className="em-field__error">{errors.venue}</span>}
                  </div>

                  <div className="em-form-grid">
                    <div className="em-field">
                      <label className="em-field__label">Venue Capacity</label>
                      <input
                        type="number" min="1"
                        value={form.venueCapacity}
                        onChange={e => set("venueCapacity", e.target.value)}
                        placeholder="500"
                        data-testid="school-field-ce-venue-capacity"
                      />
                    </div>
                    <div className="em-field">
                      <label className="em-field__label">Coordinator *</label>
                      <select
                        value={form.coordinator}
                        onChange={e => set("coordinator", e.target.value)}
                        data-testid="school-dropdown-ce-coordinator"
                        style={{ borderColor: errors.coordinator ? "#dc2626" : undefined }}>
                        <option value="">Assign coordinator…</option>
                        {COORDINATORS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {errors.coordinator && <span className="em-field__error">{errors.coordinator}</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 — Participants & Settings */}
          {step === 3 && (
            <>
              <div className="em-table-wrap" data-testid="school-section-ce-participants">
                <div style={{ padding: "1.125rem 1.375rem", borderBottom: "1px solid var(--em-line)" }}>
                  <div style={{ fontWeight: 700, fontSize: ".9375rem", color: "var(--em-text)" }}>👥 Participants & Audience</div>
                  <div style={{ fontSize: ".8125rem", color: "#6b7280", marginTop: ".125rem" }}>Who can attend or participate in this event</div>
                </div>
                <div style={{ padding: "1.375rem" }}>
                  <div className="em-form">
                    <div>
                      <div className="em-field__label" style={{ marginBottom: ".5rem" }}>Audience *</div>
                      <div className="em-field__label1" style={{ display: "grid", gap: ".625rem" }}>
                        {AUDIENCE_LIST.map(aud => (
                          <label key={aud} style={{ display: "flex", alignItems: "center", gap: ".5rem", fontSize: ".8125rem", cursor: "pointer", padding: ".625rem .875rem", border: `1px solid ${form.audience.includes(aud) ? "#c9a962" : "var(--em-line)"}`, borderRadius: ".375rem", background: form.audience.includes(aud) ? "rgba(201,169,98,.07)" : "var(--em-input)", transition: "all .15s" }}>
                            <input
                              type="checkbox"
                              checked={form.audience.includes(aud)}
                              onChange={() => toggleAudience(aud)}
                              data-testid={`school-field-ce-audience-${aud.toLowerCase().replace(/\s/g,"-")}`}
                            />
                            <span>{aud}</span>
                          </label>
                        ))}
                      </div>
                      {errors.audience && <span className="em-field__error" style={{ marginTop: ".25rem", display: "block" }}>{errors.audience}</span>}
                    </div>

                    <div className="em-field">
                      <label className="em-field__label">Max Participants</label>
                      <input
                        type="number" min="1"
                        value={form.maxParticipants}
                        onChange={e => set("maxParticipants", e.target.value)}
                        placeholder="Leave blank for unlimited"
                        data-testid="school-field-ce-max-participants"
                      />
                    </div>

                    <div className="em-form-section">Event Settings</div>

                    <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
                      {[
                        { key: "allowRegistration", label: "Allow Online Registration", desc: "Students and parents can register via the portal" },
                        { key: "requireApproval",   label: "Require Approval",          desc: "Registrations need admin approval before confirmation" },
                        { key: "sendNotification",  label: "Send Notification",         desc: "Notify all relevant users when event is created" },
                      ].map(opt => (
                        <label key={opt.key} style={{ display: "flex", alignItems: "flex-start", gap: ".75rem", cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            checked={form[opt.key]}
                            onChange={e => set(opt.key, e.target.checked)}
                            style={{ marginTop: ".2rem" }}
                            data-testid={`school-field-ce-${opt.key}`}
                          />
                          <div>
                            <div style={{ fontSize: ".8125rem", fontWeight: 600, color: "var(--em-text)" }}>{opt.label}</div>
                            <div style={{ fontSize: ".75rem", color: "#6b7280" }}>{opt.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Step Navigation */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button
              className="em-btn em-btn--ghost"
              onClick={() => setStep(s => Math.max(1, s - 1))}
              disabled={step === 1}
              data-testid="school-button-ce-step-prev">
              ‹ Previous
            </button>
            <span className="em-step-indicator" style={{ fontSize: ".75rem", color: "#6b7280" }}>Step {step} of {STEPS.length}</span>
            {step < STEPS.length ? (
              <button
                className="em-btn em-btn--primary"
                onClick={() => setStep(s => Math.min(STEPS.length, s + 1))}
                data-testid="school-button-ce-step-next">
                Next ›
              </button>
            ) : (
              <button className="em-btn em-btn--primary" onClick={handleCreate} data-testid="school-button-ce-submit">
                🚀 Create Event
              </button>
            )}
          </div>
        </div>

        {/* ── SIDEBAR ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Preview card */}
          <div className="em-table-wrap" data-testid="school-preview-ce-card">
            <div style={{ padding: ".875rem 1.125rem", borderBottom: "1px solid var(--em-line)", fontWeight: 700, fontSize: ".875rem", color: "var(--em-text)" }}>
              👁️ Live Preview
            </div>
            <div>
              {/* Banner */}
              <div style={{ height: 90, background: catBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem" }}>
                {catEmoji}
              </div>
              <div style={{ padding: "1rem" }}>
                <div style={{ fontWeight: 800, fontSize: "1rem", color: "var(--em-text)", marginBottom: ".5rem" }}>
                  {form.name || <span style={{ color: "#9ca3af", fontStyle: "italic" }}>Event name…</span>}
                </div>
                <div style={{ display: "flex", gap: ".35rem", flexWrap: "wrap", marginBottom: ".625rem" }}>
                  {form.category && <span className={`em-cat-badge em-cat-badge--${form.category}`}>{form.category.charAt(0).toUpperCase() + form.category.slice(1)}</span>}
                  {form.house && <span className={`em-house-badge em-house-badge--${form.house.toLowerCase()}`}>{form.house === "All" ? "All Houses" : `${form.house} House`}</span>}
                  {form.status && <span className={`em-status-badge em-status-badge--${form.status}`}>{form.status.charAt(0).toUpperCase() + form.status.slice(1)}</span>}
                </div>
                <div style={{ fontSize: ".75rem", color: "#6b7280", display: "flex", flexDirection: "column", gap: ".25rem" }}>
                  {form.date   && <span>📅 {new Date(form.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}{form.time ? ` · ${form.time}` : ""}</span>}
                  {form.venue  && <span>📍 {form.venue}</span>}
                  {form.coordinator && <span>👤 {form.coordinator}</span>}
                  {form.audience.length > 0 && <span>👥 {form.audience.join(", ")}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Completion checklist */}
          <div className="em-table-wrap" data-testid="school-checklist-ce-card">
            <div style={{ padding: ".875rem 1.125rem", borderBottom: "1px solid var(--em-line)", fontWeight: 700, fontSize: ".875rem", color: "var(--em-text)" }}>
              ✅ Completion Checklist
            </div>
            <div style={{ padding: "1rem" }}>
              {[
                { key: "name",        label: "Event name",    done: !!form.name.trim()      },
                { key: "category",    label: "Category",      done: !!form.category          },
                { key: "date",        label: "Event date",    done: !!form.date              },
                { key: "venue",       label: "Venue",         done: !!form.venue.trim()      },
                { key: "coordinator", label: "Coordinator",   done: !!form.coordinator       },
                { key: "audience",    label: "Audience set",  done: form.audience.length > 0 },
              ].map(item => (
                <div key={item.key} style={{ display: "flex", alignItems: "center", gap: ".5rem", padding: ".3rem 0", fontSize: ".8125rem" }}>
                  <span style={{ color: item.done ? "#16a34a" : "#d1d5db", fontSize: "1rem" }}>{item.done ? "✅" : "○"}</span>
                  <span style={{ color: item.done ? "var(--em-text)" : "#9ca3af" }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="em-table-wrap" data-testid="school-actions-ce-sidebar">
            <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: ".625rem" }}>
              <button className="em-btn em-btn--primary" style={{ width: "100%", justifyContent: "center" }} onClick={handleCreate} data-testid="school-button-ce-create-sidebar">
                🚀 Create Event
              </button>
              <button className="em-btn em-btn--ghost"   style={{ width: "100%", justifyContent: "center" }} onClick={handleDraft}  data-testid="school-button-ce-draft-sidebar">
                📝 Save as Draft
              </button>
              <button className="em-btn em-btn--ghost"   style={{ width: "100%", justifyContent: "center" }} onClick={handleReset}  data-testid="school-button-ce-reset-sidebar">
                ↺ Reset Form
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Success Modal ── */}
      {successModal && (
        <div className="em-modal-backdrop" onClick={() => setSuccessModal(false)} data-testid="school-modal-ce-success">
          <div className="em-modal em-modal--sm" onClick={e => e.stopPropagation()}>
            <div className="em-modal__header">
              <span className="em-modal__title">✅ Event Created!</span>
              <button className="em-modal__close" onClick={() => setSuccessModal(false)} data-testid="school-button-ce-success-close">✕</button>
            </div>
            <div className="em-modal__body">
              <div style={{ textAlign: "center", padding: ".5rem 0 1rem" }}>
                <div style={{ fontSize: "3rem", marginBottom: ".75rem" }}>{catEmoji}</div>
                <div style={{ fontWeight: 800, fontSize: "1.125rem", color: "var(--em-text)" }}>{form.name}</div>
                <div style={{ fontSize: ".875rem", color: "#6b7280", marginTop: ".375rem" }}>Event has been created successfully!</div>
                <div style={{ display: "flex", gap: ".375rem", justifyContent: "center", marginTop: ".75rem", flexWrap: "wrap" }}>
                  {form.category && <span className={`em-cat-badge em-cat-badge--${form.category}`}>{form.category.charAt(0).toUpperCase() + form.category.slice(1)}</span>}
                  {form.status   && <span className={`em-status-badge em-status-badge--${form.status}`}>{form.status.charAt(0).toUpperCase() + form.status.slice(1)}</span>}
                </div>
              </div>
            </div>
            <div className="em-modal__footer">
              <button className="em-btn em-btn--ghost" onClick={() => { setSuccessModal(false); handleReset(); }} data-testid="school-button-ce-create-another">
                + Create Another
              </button>
              <button className="em-btn em-btn--primary" onClick={() => setSuccessModal(false)} data-testid="school-button-ce-success-done">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className={`em-toast${toast.type === "error" ? " em-toast--error" : toast.type === "warn" ? " em-toast--warn" : toast.type === "info" ? " em-toast--info" : ""}`}
          data-testid="school-toast-ce-notification">
          <span>{toast.type === "success" ? "✅" : toast.type === "warn" ? "⚠️" : toast.type === "error" ? "❌" : "ℹ️"}</span>
          <span>{toast.msg}</span>
          <button className="em-toast__close" onClick={() => setToast(null)} data-testid="school-button-ce-toast-close">✕</button>
        </div>
      )}
    </div>
  );
}
