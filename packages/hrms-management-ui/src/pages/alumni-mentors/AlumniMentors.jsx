import React, { useState, useMemo, useCallback, useEffect } from "react";
import "../../Assets/styles/Alumni.scss";
import ManagementPageHeader from "../../app/components/common/ManagementPageHeader";
import {
  MOCK_ALUMNI,
  MOCK_MENTORSHIP_REQUESTS,
  MOCK_EVENTS,
  MOCK_ACHIEVEMENTS,
  BATCH_YEARS,
  INDUSTRIES,
  MENTOR_CATEGORIES,
  VERIFICATION_STATUSES,
} from "./alumniMockData";

// ─── Helpers ──────────────────────────────────────────────────────────────────
/**
 * Format ISO date string as locale date.
 * @param {string} iso
 */
const fmtDate = (iso) => {
  if (!iso || iso === "—") return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

/**
 * Get industry label.
 * @param {string} val
 */
const getIndustryLabel = (val) => INDUSTRIES.find((i) => i.value === val)?.label || val;

/**
 * Get mentor category config.
 * @param {string} val
 */
const getMentorCat = (val) => MENTOR_CATEGORIES.find((c) => c.value === val) || { icon: "🎓", label: val };

/**
 * Get verification status config.
 * @param {string} val
 */
const getVerif = (val) => VERIFICATION_STATUSES.find((v) => v.value === val) || { color: "#6b7280", bg: "rgba(107,114,128,.1)", label: val };

// ─── Gallery data ─────────────────────────────────────────────────────────────
const GALLERY_SECTIONS = {
  reunion: {
    label: "Alumni Reunions",
    items: [
      { img: "https://picsum.photos/seed/reunion1/600/450", caption: "Annual Alumni Meet 2025 — Main Campus" },
      { img: "https://picsum.photos/seed/reunion2/600/450", caption: "Batch 2018 Reunion — Auditorium" },
      { img: "https://picsum.photos/seed/reunion3/600/450", caption: "Silver Jubilee Celebration 2024" },
      { img: "https://picsum.photos/seed/reunion4/600/450", caption: "Batch 2015 Decade Reunion" },
    ],
  },
  mentorship: {
    label: "Mentorship Sessions",
    items: [
      { img: "https://picsum.photos/seed/mentor1/600/450", caption: "One-on-one career guidance session" },
      { img: "https://picsum.photos/seed/mentor2/600/450", caption: "Student mentoring workshop — Tech careers" },
      { img: "https://picsum.photos/seed/mentor3/600/450", caption: "Panel Q&A with alumni professionals" },
      { img: "https://picsum.photos/seed/mentor4/600/450", caption: "Entrepreneurship talk by Arun Sharma" },
    ],
  },
  graduation: {
    label: "Graduation & Achievements",
    items: [
      { img: "https://picsum.photos/seed/grad1/600/450", caption: "Convocation Day 2024 — Batch 2020" },
      { img: "https://picsum.photos/seed/grad2/600/450", caption: "Award ceremony for top performers" },
      { img: "https://picsum.photos/seed/grad3/600/450", caption: "UPSC success celebration — Priya Krishnan" },
      { img: "https://picsum.photos/seed/grad4/600/450", caption: "Forbes 30 Under 30 recognition night" },
    ],
  },
  memories: {
    label: "School Memories",
    items: [
      { img: "https://picsum.photos/seed/mem1/600/450", caption: "Science lab experiments — Batch 2019" },
      { img: "https://picsum.photos/seed/mem2/600/450", caption: "Annual Sports Day — Track events" },
      { img: "https://picsum.photos/seed/mem3/600/450", caption: "Cultural fest rehearsals on stage" },
      { img: "https://picsum.photos/seed/mem4/600/450", caption: "Farewell day — Campus grounds" },
    ],
  },
};

// ─── Small UI Primitives ──────────────────────────────────────────────────────
const VerifBadge = ({ status }) => {
  const v = getVerif(status);
  return (
    <span
      className={`alm-badge alm-badge--${status}`}
      style={{ color: v.color, background: v.bg }}
    >
      {status === "verified" ? "✓ " : status === "pending" ? "⏳ " : "✕ "}
      {v.label}
    </span>
  );
};

const MentorBadge = ({ isMentor, mentorStatus }) => {
  if (!isMentor) return null;
  return (
    <span className="alm-badge alm-badge--mentor">
      🎓 {mentorStatus === "active" ? "Active Mentor" : "Mentor"}
    </span>
  );
};

const Toast = ({ msg, type = "success", onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 3500);
    return () => clearTimeout(t);
  }, [onDone]);
  const icons = { success: "✅", error: "❌", warn: "⚠️", info: "ℹ️" };
  return (
    <div className={`alm-toast alm-toast--${type}`} role="alert">
      {icons[type]} {msg}
    </div>
  );
};

// ─── Alumni Profile Modal ─────────────────────────────────────────────────────
/**
 * AlumniProfileModal — detailed view of a single alumnus profile.
 */
const AlumniProfileModal = ({ alumni, onClose, showToast }) => {
  return (
    <div className="alm-modal-backdrop" role="dialog" aria-modal="true" data-testid="school-modal-alm-profile">
      <div className="alm-modal alm-modal--lg">
        <div className="alm-modal__header">
          <span className="alm-modal__title">👤 Alumni Profile</span>
          <button className="alm-modal__close" onClick={onClose} aria-label="Close" data-testid="school-button-alm-profile-close">✕</button>
        </div>

        <div className="alm-modal__body">
          {/* Hero */}
          <div className="alm-profile__hero">
            <div className="alm-profile__avatar" style={{ background: alumni.avatarColor }}>
              {alumni.avatarImg
                ? <img src={alumni.avatarImg} alt={alumni.name} />
                : alumni.initials}
            </div>
            <div className="alm-profile__info">
              <div className="alm-profile__name">{alumni.name}</div>
              <div className="alm-profile__role">{alumni.designation} · {alumni.company}</div>
              <div className="alm-profile__badges">
                <VerifBadge status={alumni.verificationStatus} />
                <MentorBadge isMentor={alumni.isMentor} mentorStatus={alumni.mentorStatus} />
                {alumni.isAbroad && <span className="alm-badge alm-badge--abroad">✈ Abroad</span>}
                {alumni.featured && <span className="alm-badge alm-badge--featured">⭐ Featured</span>}
              </div>
            </div>
          </div>

          {/* Bio */}
          {alumni.bio && (
            <>
              <div className="alm-profile__section">About</div>
              <p className="alm-profile__bio">{alumni.bio}</p>
            </>
          )}

          {/* Key Details */}
          <div className="alm-profile__section">Details</div>
          <div className="alm-profile__grid">
            <div className="alm-profile__field">
              <span className="alm-profile__field-label">Admission No.</span>
              <span className="alm-profile__field-value" style={{ fontFamily: "monospace" }}>{alumni.admissionNo}</span>
            </div>
            <div className="alm-profile__field">
              <span className="alm-profile__field-label">Batch</span>
              <span className="alm-profile__field-value">{alumni.batch}</span>
            </div>
            <div className="alm-profile__field">
              <span className="alm-profile__field-label">Graduation</span>
              <span className="alm-profile__field-value">{alumni.graduation}</span>
            </div>
            <div className="alm-profile__field">
              <span className="alm-profile__field-label">Industry</span>
              <span className="alm-profile__field-value">{getIndustryLabel(alumni.industry)}</span>
            </div>
            <div className="alm-profile__field">
              <span className="alm-profile__field-label">Location</span>
              <span className="alm-profile__field-value">{alumni.location}, {alumni.country}</span>
            </div>
            <div className="alm-profile__field">
              <span className="alm-profile__field-label">Experience</span>
              <span className="alm-profile__field-value">{alumni.experience}</span>
            </div>
          </div>

          {/* Higher Education */}
          {alumni.higherEd && (
            <>
              <div className="alm-profile__section">Higher Education</div>
              <div className="alm-profile__grid">
                <div className="alm-profile__field">
                  <span className="alm-profile__field-label">Degree</span>
                  <span className="alm-profile__field-value">{alumni.higherEd.degree}</span>
                </div>
                <div className="alm-profile__field">
                  <span className="alm-profile__field-label">Institution</span>
                  <span className="alm-profile__field-value">{alumni.higherEd.institution}</span>
                </div>
              </div>
            </>
          )}

          {/* Achievements */}
          {alumni.achievements?.length > 0 && (
            <>
              <div className="alm-profile__section">Achievements</div>
              <ul className="alm-profile__achievements">
                {alumni.achievements.map((a, i) => <li key={i}>🏆 {a}</li>)}
              </ul>
            </>
          )}

          {/* Tags */}
          {alumni.tags?.length > 0 && (
            <div className="alm-profile__tags">
              {alumni.tags.map((t) => <span key={t} className="alm-tag">{t}</span>)}
            </div>
          )}
        </div>

        <div className="alm-modal__footer">
          {alumni.isMentor && (
            <button
              className="alm-btn alm-btn--success"
              onClick={() => { showToast(`Connecting with ${alumni.name}…`, "info"); onClose(); }}
              data-testid="school-button-alm-profile-connect"
            >
              🤝 Connect
            </button>
          )}
          <button
            className="alm-btn alm-btn--ghost"
            onClick={() => showToast("Profile exported!", "success")}
            data-testid="school-button-alm-profile-export"
          >
            ⬇ Export
          </button>
          <button className="alm-btn alm-btn--primary" onClick={onClose} data-testid="school-button-alm-profile-close-btn">Close</button>
        </div>
      </div>
    </div>
  );
};

// ─── Mentorship Action Modal ──────────────────────────────────────────────────
const MentorshipActionModal = ({ request, action, onClose, onConfirm }) => {
  const isApprove = action === "approve";
  return (
    <div className="alm-modal-backdrop" role="dialog" aria-modal="true" data-testid="school-modal-alm-mentor-action">
      <div className="alm-modal alm-modal--sm">
        <div className="alm-modal__header">
          <span className="alm-modal__title">{isApprove ? "✅ Approve Request" : "✕ Reject Request"}</span>
          <button className="alm-modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="alm-modal__body">
          <p style={{ fontSize: ".875rem", color: "var(--alm-muted)", lineHeight: 1.6 }}>
            {isApprove
              ? `Approve mentorship request from ${request.alumniName} (${request.profession} at ${request.company})?`
              : `Reject mentorship request from ${request.alumniName}?`}
          </p>
          {request.note && (
            <div style={{ padding: ".75rem", background: "var(--alm-input)", borderRadius: ".375rem", border: "1px solid var(--alm-line)", fontSize: ".8125rem", color: "var(--alm-muted)" }}>
              📝 "{request.note}"
            </div>
          )}
        </div>
        <div className="alm-modal__footer">
          <button className="alm-btn alm-btn--ghost" onClick={onClose} data-testid="school-button-alm-mentor-action-cancel">Cancel</button>
          <button
            className={`alm-btn alm-btn--${isApprove ? "success" : "danger"}`}
            onClick={onConfirm}
            data-testid="school-button-alm-mentor-action-confirm"
          >
            {isApprove ? "✅ Approve" : "✕ Reject"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
/**
 * AlumniMentors — alumni network management hub.
 * Features: alumni directory, mentor listings, mentorship requests, events, achievements, gallery.
 */
export default function AlumniMentors() {
  const [activeTab,    setActiveTab]    = useState("directory");
  const [viewMode,     setViewMode]     = useState("cards");
  const [search,       setSearch]       = useState("");
  const [filterBatch,  setFilterBatch]  = useState("all");
  const [filterInd,    setFilterInd]    = useState("all");
  const [filterVerif,  setFilterVerif]  = useState("all");
  const [filterMentor, setFilterMentor] = useState("all");
  const [filtersOpen,  setFiltersOpen]  = useState(true);
  const [page,         setPage]         = useState(1);
  const PAGE_SIZE = 12;

  const [mentorRequests,   setMentorRequests]   = useState(MOCK_MENTORSHIP_REQUESTS);
  const [activeModal,      setActiveModal]       = useState(null);
  const [selAlumni,        setSelAlumni]         = useState(null);
  const [selRequest,       setSelRequest]        = useState(null);
  const [mentorAction,     setMentorAction]      = useState(null);
  const [gallerySection,   setGallerySection]    = useState("reunion");
  const [toast,            setToast]             = useState(null);

  // ── Metrics ─────────────────────────────────────────────────────────────────
  const metrics = useMemo(() => ({
    total:    MOCK_ALUMNI.length,
    verified: MOCK_ALUMNI.filter((a) => a.verificationStatus === "verified").length,
    mentors:  MOCK_ALUMNI.filter((a) => a.isMentor && a.mentorStatus === "active").length,
    abroad:   MOCK_ALUMNI.filter((a) => a.isAbroad).length,
    requests: mentorRequests.filter((r) => r.status === "pending").length,
    events:   MOCK_EVENTS.filter((e) => e.status === "upcoming").length,
  }), [mentorRequests]);

  // ── Filtered Directory ───────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return MOCK_ALUMNI.filter((a) => {
      const matchSearch = !q
        || a.name.toLowerCase().includes(q)
        || a.designation.toLowerCase().includes(q)
        || a.company.toLowerCase().includes(q)
        || a.location.toLowerCase().includes(q)
        || (a.tags || []).some((t) => t.toLowerCase().includes(q));
      const matchBatch  = filterBatch  === "all" || a.batch                === filterBatch;
      const matchInd    = filterInd    === "all" || a.industry             === filterInd;
      const matchVerif  = filterVerif  === "all" || a.verificationStatus   === filterVerif;
      const matchMentor = filterMentor === "all"
        || (filterMentor === "mentor"     && a.isMentor)
        || (filterMentor === "non-mentor" && !a.isMentor);
      return matchSearch && matchBatch && matchInd && matchVerif && matchMentor;
    });
  }, [search, filterBatch, filterInd, filterVerif, filterMentor]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeMentors = useMemo(() => MOCK_ALUMNI.filter((a) => a.isMentor && a.mentorStatus === "active"), []);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const showToast  = useCallback((msg, type = "success") => setToast({ msg, type }), []);
  const closeModal = useCallback(() => {
    setActiveModal(null);
    setSelAlumni(null);
    setSelRequest(null);
    setMentorAction(null);
  }, []);

  const handleViewAlumni    = useCallback((a)       => { setSelAlumni(a);  setActiveModal("profile");      }, []);
  const handleMentorAction  = useCallback((req, act) => { setSelRequest(req); setMentorAction(act); setActiveModal("mentorAction"); }, []);

  const confirmMentorAction = useCallback(() => {
    if (!selRequest) return;
    const newStatus = mentorAction === "approve" ? "approved" : "rejected";
    setMentorRequests((prev) => prev.map((r) => r.id === selRequest.id ? { ...r, status: newStatus } : r));
    showToast(
      mentorAction === "approve"
        ? `${selRequest.alumniName}'s request approved.`
        : `${selRequest.alumniName}'s request rejected.`,
      mentorAction === "approve" ? "success" : "warn"
    );
    closeModal();
  }, [selRequest, mentorAction, showToast, closeModal]);

  const resetFilters = () => {
    setSearch(""); setFilterBatch("all"); setFilterInd("all");
    setFilterVerif("all"); setFilterMentor("all"); setPage(1);
  };

  const hasFilters = search || filterBatch !== "all" || filterInd !== "all" || filterVerif !== "all" || filterMentor !== "all";

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="alm-root" data-testid="school-page-alm-alumni">

      <ManagementPageHeader
        breadcrumbs={[
          { label: "Management" },
          { label: "Alumni Network" },
        ]}
        title="Alumni Network"
        subtitle="Connect, track, and engage with your institution&apos;s alumni community — mentors, achievers, and events."
        actions={(
          <>
            <button
              className="alm-btn alm-btn--ghost"
              onClick={() => showToast("Exporting alumni data…", "info")}
              data-testid="school-button-alm-export"
            >
              ⬇ Export
            </button>
            <button
              className="alm-btn alm-btn--primary"
              onClick={() => showToast("Alumni registration link copied!", "success")}
              data-testid="school-button-alm-invite"
            >
              📩 Invite Alumni
            </button>
          </>
        )}
      />

      {/* ── Metrics ── */}
      <div className="alm-metrics" data-testid="school-grid-alm-metrics">
        {[
          { id: "total",    icon: "👥", value: metrics.total,    label: "Total Alumni",     color: "primary" },
          { id: "verified", icon: "✅", value: metrics.verified, label: "Verified",         color: "success" },
          { id: "mentors",  icon: "🎓", value: metrics.mentors,  label: "Active Mentors",   color: "warning" },
          { id: "abroad",   icon: "✈", value: metrics.abroad,   label: "Alumni Abroad",    color: "info"    },
          { id: "requests", icon: "📋", value: metrics.requests, label: "Pending Requests", color: "danger"  },
          { id: "events",   icon: "📅", value: metrics.events,   label: "Upcoming Events",  color: "purple"  },
        ].map((m) => (
          <div
            key={m.id}
            className={`alm-metric-card alm-metric-card--${m.color}`}
            data-testid={`school-metric-alm-${m.id}`}
          >
            <div className="alm-metric-card__icon">{m.icon}</div>
            <div className="alm-metric-card__body">
              <span className="alm-metric-card__value">{m.value}</span>
              <span className="alm-metric-card__label">{m.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="alm-tabs" role="tablist" data-testid="school-tabs-alm">
        {[
          { id: "directory",    label: "Directory",           count: MOCK_ALUMNI.length   },
          { id: "mentors",      label: "Mentors",             count: activeMentors.length },
          { id: "requests",     label: "Mentorship Requests", count: metrics.requests     },
          { id: "events",       label: "Events",              count: MOCK_EVENTS.length   },
          { id: "achievements", label: "Achievements",        count: MOCK_ACHIEVEMENTS.length },
          { id: "gallery",      label: "Gallery",             count: null                 },
        ].map((t) => (
          <button
            key={t.id}
            role="tab"
            className={`alm-tab${activeTab === t.id ? " alm-tab--active" : ""}`}
            onClick={() => setActiveTab(t.id)}
            data-testid={`school-tab-alm-${t.id}`}
          >
            {t.label}
            {t.count != null && (
              <span className="alm-tab__count">{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Directory Tab ── */}
      {activeTab === "directory" && (
        <>
          {/* Toolbar */}
          <div className="alm-toolbar" data-testid="school-toolbar-alm">
            <div className="alm-search" data-testid="school-search-alm">
              <span className="alm-search__icon">🔍</span>
              <input
                type="text"
                placeholder="Search by name, company, location…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                aria-label="Search alumni"
                data-testid="school-input-alm-search"
              />
              {search && (
                <button className="alm-search__clear" onClick={() => { setSearch(""); setPage(1); }} aria-label="Clear search">✕</button>
              )}
            </div>

            <button
              className="alm-toolbar__filters-toggle"
              onClick={() => setFiltersOpen((p) => !p)}
              aria-expanded={filtersOpen}
              data-testid="school-button-alm-toggle-filters"
            >
              ⚙ Filters {filtersOpen ? "▲" : "▼"}
            </button>

            <div className={`alm-toolbar__filters${filtersOpen ? "" : " alm-toolbar__filters--hidden"}`}>
              <select
                className="alm-filter-select"
                value={filterBatch}
                onChange={(e) => { setFilterBatch(e.target.value); setPage(1); }}
                aria-label="Filter by batch"
                data-testid="school-dropdown-alm-batch"
              >
                <option value="all">All Batches</option>
                {BATCH_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>

              <select
                className="alm-filter-select"
                value={filterInd}
                onChange={(e) => { setFilterInd(e.target.value); setPage(1); }}
                aria-label="Filter by industry"
                data-testid="school-dropdown-alm-industry"
              >
                <option value="all">All Industries</option>
                {INDUSTRIES.map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}
              </select>

              <select
                className="alm-filter-select"
                value={filterVerif}
                onChange={(e) => { setFilterVerif(e.target.value); setPage(1); }}
                aria-label="Filter by verification"
                data-testid="school-dropdown-alm-verif"
              >
                <option value="all">All Statuses</option>
                {VERIFICATION_STATUSES.map((v) => <option key={v.value} value={v.value}>{v.label}</option>)}
              </select>

              <select
                className="alm-filter-select"
                value={filterMentor}
                onChange={(e) => { setFilterMentor(e.target.value); setPage(1); }}
                aria-label="Filter by mentor status"
                data-testid="school-dropdown-alm-mentor"
              >
                <option value="all">Mentors &amp; Non-mentors</option>
                <option value="mentor">Mentors Only</option>
                <option value="non-mentor">Non-mentors</option>
              </select>

              {hasFilters && (
                <button
                  className="alm-btn alm-btn--ghost alm-btn--sm"
                  onClick={resetFilters}
                  data-testid="school-button-alm-reset-filters"
                >
                  ✕ Clear
                </button>
              )}
            </div>

            <div className="alm-toolbar__right">
              <div className="alm-view-toggle" aria-label="Toggle view mode">
                <button
                  className={viewMode === "cards" ? "active" : ""}
                  onClick={() => setViewMode("cards")}
                  title="Card view"
                  data-testid="school-button-alm-view-cards"
                >⊞</button>
                <button
                  className={viewMode === "table" ? "active" : ""}
                  onClick={() => setViewMode("table")}
                  title="Table view"
                  data-testid="school-button-alm-view-table"
                >☰</button>
              </div>
            </div>
          </div>

          {/* Results bar */}
          <div className="alm-results-bar">
            <span className="alm-results-bar__count">
              {filtered.length} alumni found
            </span>
          </div>

          {/* Cards View */}
          {viewMode === "cards" ? (
            pageItems.length === 0 ? (
              <div className="alm-empty">
                <span className="alm-empty__icon">🔍</span>
                <span className="alm-empty__title">No alumni found</span>
                <span className="alm-empty__sub">Try adjusting your search or filters.</span>
              </div>
            ) : (
              <div className="alm-cards" data-testid="school-cards-alm">
                {pageItems.map((a) => (
                  <div
                    key={a.id}
                    className={`alm-card${a.featured ? " alm-card--featured" : ""}`}
                    data-testid={`school-card-alm-${a.id}`}
                  >
                    <div className="alm-card__header">
                      <div className="alm-card__avatar" style={{ background: a.avatarColor }}>
                        {a.avatarImg ? <img src={a.avatarImg} alt={a.name} /> : a.initials}
                      </div>
                      <div className="alm-card__info">
                        <div className="alm-card__name">{a.name}</div>
                        <div className="alm-card__role">{a.designation}</div>
                        <div className="alm-card__role" style={{ fontSize: ".6875rem" }}>{a.company}</div>
                        <div className="alm-card__badges">
                          <VerifBadge status={a.verificationStatus} />
                          {a.isMentor && <MentorBadge isMentor={a.isMentor} mentorStatus={a.mentorStatus} />}
                          {a.isAbroad && <span className="alm-badge alm-badge--abroad">✈</span>}
                        </div>
                      </div>
                    </div>
                    {a.bio && <p className="alm-card__bio">{a.bio}</p>}
                    <div className="alm-card__meta">
                      <span>📅 Batch {a.batch}</span>
                      <span>📍 {a.location}</span>
                      <span>💼 {getIndustryLabel(a.industry)}</span>
                    </div>
                    {a.tags?.length > 0 && (
                      <div className="alm-card__tags">
                        {a.tags.map((t) => <span key={t} className="alm-tag">{t}</span>)}
                      </div>
                    )}
                    <div className="alm-card__footer">
                      <div className="alm-card__actions">
                        <button
                          className="alm-action-btn"
                          title="View Profile"
                          onClick={() => handleViewAlumni(a)}
                          data-testid={`school-button-alm-view-${a.id}`}
                        >🔎</button>
                        {a.isMentor && (
                          <button
                            className="alm-action-btn alm-action-btn--approve"
                            title="Connect"
                            onClick={() => showToast(`Connecting with ${a.name}…`, "info")}
                            data-testid={`school-button-alm-connect-${a.id}`}
                          >🤝</button>
                        )}
                        <button
                          className="alm-action-btn"
                          title="Message"
                          onClick={() => showToast(`Message sent to ${a.name}`, "success")}
                          data-testid={`school-button-alm-msg-${a.id}`}
                        >✉</button>
                      </div>
                      <span style={{ fontSize: ".6875rem", color: "var(--alm-muted)" }}>
                        {a.experience} exp.
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            /* Table View */
            <div className="alm-table-wrap" data-testid="school-table-alm">
              <div className="alm-table-scroll">
                <table className="alm-table" aria-label="Alumni listing table">
                  <thead>
                    <tr>
                      <th>Alumni</th>
                      <th>Batch</th>
                      <th>Role &amp; Company</th>
                      <th>Industry</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageItems.length === 0 ? (
                      <tr className="alm-table__empty">
                        <td colSpan={7}>
                          <div className="alm-empty">
                            <span className="alm-empty__icon">🔍</span>
                            <span className="alm-empty__title">No alumni found</span>
                          </div>
                        </td>
                      </tr>
                    ) : pageItems.map((a) => (
                      <tr key={a.id}>
                        <td>
                          <div className="alm-cell-emp">
                            <div className="alm-cell-avatar" style={{ background: a.avatarColor }}>
                              {a.avatarImg ? <img src={a.avatarImg} alt={a.name} /> : a.initials}
                            </div>
                            <div>
                              <div className="alm-cell-title">{a.name}</div>
                              <div className="alm-cell-sub" style={{ fontFamily: "monospace" }}>{a.admissionNo}</div>
                            </div>
                          </div>
                        </td>
                        <td className="alm-cell-muted">{a.batch}</td>
                        <td>
                          <div className="alm-cell-title">{a.designation}</div>
                          <div className="alm-cell-sub">{a.company}</div>
                        </td>
                        <td className="alm-cell-muted">{getIndustryLabel(a.industry)}</td>
                        <td className="alm-cell-muted">{a.location}{a.isAbroad ? " ✈" : ""}</td>
                        <td>
                          <div style={{ display: "flex", flexDirection: "column", gap: ".25rem" }}>
                            <VerifBadge status={a.verificationStatus} />
                            {a.isMentor && <MentorBadge isMentor={a.isMentor} mentorStatus={a.mentorStatus} />}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: ".25rem" }}>
                            <button className="alm-action-btn" title="View" onClick={() => handleViewAlumni(a)} data-testid={`school-button-alm-tbl-view-${a.id}`}>🔎</button>
                            {a.isMentor && (
                              <button
                                className="alm-action-btn alm-action-btn--approve"
                                title="Connect"
                                onClick={() => showToast(`Connecting with ${a.name}…`, "info")}
                                data-testid={`school-button-alm-tbl-connect-${a.id}`}
                              >🤝</button>
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
            <div className="alm-pagination" data-testid="school-pagination-alm">
              <button className="alm-page-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} aria-label="Previous page" data-testid="school-button-alm-page-prev">‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  className={`alm-page-btn${page === n ? " alm-page-btn--active" : ""}`}
                  onClick={() => setPage(n)}
                  aria-current={page === n ? "page" : undefined}
                  data-testid={`school-button-alm-page-${n}`}
                >{n}</button>
              ))}
              <button className="alm-page-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label="Next page" data-testid="school-button-alm-page-next">›</button>
            </div>
          )}
        </>
      )}

      {/* ── Mentors Tab ── */}
      {activeTab === "mentors" && (
        <>
          <div className="alm-results-bar">
            <span className="alm-results-bar__count">{activeMentors.length} active mentors</span>
          </div>
          {activeMentors.length === 0 ? (
            <div className="alm-empty">
              <span className="alm-empty__icon">🎓</span>
              <span className="alm-empty__title">No active mentors</span>
              <span className="alm-empty__sub">No alumni have registered as active mentors yet.</span>
            </div>
          ) : (
            <div className="alm-mentor-grid" data-testid="school-grid-alm-mentors">
              {activeMentors.map((a) => {
                const cat = getMentorCat(a.mentorCategory);
                return (
                  <div key={a.id} className="alm-mentor-card" data-testid={`school-card-alm-mentor-${a.id}`}>
                    <div className="alm-mentor-card__header">
                      <div className="alm-mentor-card__avatar" style={{ background: a.avatarColor }}>
                        {a.avatarImg ? <img src={a.avatarImg} alt={a.name} /> : a.initials}
                      </div>
                      <div className="alm-mentor-card__info">
                        <div className="alm-mentor-card__name">{a.name}</div>
                        <div className="alm-mentor-card__role">{a.designation} · {a.company}</div>
                        <div className="alm-mentor-card__cat">
                          <span>{cat.icon}</span> {cat.label}
                        </div>
                      </div>
                    </div>
                    {a.bio && <p className="alm-mentor-card__bio">{a.bio}</p>}
                    <div className="alm-mentor-card__stats">
                      <div className="alm-mentor-card__stat">
                        <span className="alm-mentor-card__stat-val">{a.batch}</span>
                        <span className="alm-mentor-card__stat-lbl">Batch</span>
                      </div>
                      <div className="alm-mentor-card__stat">
                        <span className="alm-mentor-card__stat-val">{a.experience}</span>
                        <span className="alm-mentor-card__stat-lbl">Experience</span>
                      </div>
                      <div className="alm-mentor-card__stat">
                        <span className="alm-mentor-card__stat-val">{a.location}</span>
                        <span className="alm-mentor-card__stat-lbl">Location</span>
                      </div>
                    </div>
                    <div className="alm-mentor-card__footer">
                      <button
                        className="alm-btn alm-btn--primary alm-btn--sm"
                        onClick={() => showToast(`Request sent to ${a.name}!`, "success")}
                        data-testid={`school-button-alm-mentor-req-${a.id}`}
                      >
                        🤝 Request Mentorship
                      </button>
                      <button
                        className="alm-btn alm-btn--ghost alm-btn--sm"
                        onClick={() => handleViewAlumni(a)}
                        data-testid={`school-button-alm-mentor-profile-${a.id}`}
                      >
                        🔎 Profile
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ── Mentorship Requests Tab ── */}
      {activeTab === "requests" && (
        <>
          <div className="alm-results-bar">
            <span className="alm-results-bar__count">
              {mentorRequests.length} requests · {metrics.requests} pending
            </span>
          </div>
          <div className="alm-req-table-wrap" data-testid="school-table-alm-requests">
            <div className="alm-table-scroll">
              <table className="alm-table" aria-label="Mentorship requests table">
                <thead>
                  <tr>
                    <th>Alumni</th>
                    <th>Category</th>
                    <th>Company</th>
                    <th>Availability</th>
                    <th>Submitted</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mentorRequests.map((r) => {
                    const cat = getMentorCat(r.category);
                    return (
                      <tr key={r.id}>
                        <td>
                          <div className="alm-cell-emp">
                            <div className="alm-cell-avatar" style={{ background: r.avatarColor }}>
                              {r.initials}
                            </div>
                            <div>
                              <div className="alm-cell-title">{r.alumniName}</div>
                              <div className="alm-cell-sub">{r.profession}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{ display: "flex", alignItems: "center", gap: ".25rem", fontSize: ".8125rem" }}>
                            {cat.icon} {cat.label}
                          </span>
                        </td>
                        <td className="alm-cell-muted">{r.company}</td>
                        <td className="alm-cell-muted">{r.availability}</td>
                        <td className="alm-cell-muted">{fmtDate(r.submittedAt)}</td>
                        <td>
                          <span className={`alm-badge alm-badge--${r.status === "approved" ? "verified" : r.status === "rejected" ? "rejected" : "pending"}`}>
                            {r.status === "approved" ? "✓ Approved" : r.status === "rejected" ? "✕ Rejected" : "⏳ Pending"}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: ".25rem" }}>
                            {r.status === "pending" && (
                              <>
                                <button className="alm-action-btn alm-action-btn--approve" title="Approve" onClick={() => handleMentorAction(r, "approve")} data-testid={`school-button-alm-req-approve-${r.id}`}>✅</button>
                                <button className="alm-action-btn alm-action-btn--reject" title="Reject" onClick={() => handleMentorAction(r, "reject")} data-testid={`school-button-alm-req-reject-${r.id}`}>✕</button>
                              </>
                            )}
                            <button className="alm-action-btn" title="View note" onClick={() => showToast(r.note || "No note provided.", "info")} data-testid={`school-button-alm-req-note-${r.id}`}>📝</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── Events Tab ── */}
      {activeTab === "events" && (
        <>
          <div className="alm-results-bar">
            <span className="alm-results-bar__count">
              {MOCK_EVENTS.length} events · {metrics.events} upcoming
            </span>
            <button
              className="alm-btn alm-btn--primary alm-btn--sm"
              onClick={() => showToast("Event creation coming soon!", "info")}
              data-testid="school-button-alm-create-event"
            >
              📅 Create Event
            </button>
          </div>
          <div className="alm-events" data-testid="school-grid-alm-events">
            {MOCK_EVENTS.map((e) => (
              <div
                key={e.id}
                className={`alm-event-card alm-event-card--${e.status}`}
                data-testid={`school-card-alm-event-${e.id}`}
              >
                <div className="alm-event-card__top">
                  <span className="alm-event-card__title">{e.title}</span>
                  <div className="alm-event-card__badges">
                    <span className={`alm-badge alm-badge--${e.status === "upcoming" ? "verified" : "pending"}`}>
                      {e.status === "upcoming" ? "Upcoming" : "Past"}
                    </span>
                    <span className="alm-badge" style={{ background: "var(--alm-line)", color: "var(--alm-muted)", textTransform: "capitalize" }}>
                      {e.type}
                    </span>
                  </div>
                </div>
                <div className="alm-event-card__meta">
                  <span>📅 {fmtDate(e.date)}</span>
                  <span>📍 {e.venue}</span>
                </div>
                <p className="alm-event-card__desc">{e.description}</p>
                <div className="alm-event-card__footer">
                  <span className="alm-event-card__count">
                    👥 {e.participationCount} participants
                  </span>
                  <div style={{ display: "flex", gap: ".375rem" }}>
                    {e.registrationStatus === "open" && (
                      <button
                        className="alm-btn alm-btn--primary alm-btn--sm"
                        onClick={() => showToast("Registration link copied!", "success")}
                        data-testid={`school-button-alm-event-register-${e.id}`}
                      >
                        📩 Share Link
                      </button>
                    )}
                    <button
                      className="alm-btn alm-btn--ghost alm-btn--sm"
                      onClick={() => showToast("Event details exported!", "info")}
                      data-testid={`school-button-alm-event-view-${e.id}`}
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Achievements Tab ── */}
      {activeTab === "achievements" && (
        <>
          <div className="alm-results-bar">
            <span className="alm-results-bar__count">{MOCK_ACHIEVEMENTS.length} notable achievements</span>
            <button
              className="alm-btn alm-btn--ghost alm-btn--sm"
              onClick={() => showToast("Exporting achievements…", "info")}
              data-testid="school-button-alm-export-achievements"
            >
              ⬇ Export
            </button>
          </div>
          <div className="alm-achievements" data-testid="school-grid-alm-achievements">
            {MOCK_ACHIEVEMENTS.map((ach) => (
              <div
                key={ach.id}
                className={`alm-ach-card${ach.featured ? " alm-ach-card--featured" : ""}`}
                data-testid={`school-card-alm-ach-${ach.id}`}
              >
                <div className="alm-ach-card__avatar" style={{ background: ach.avatarColor }}>
                  {ach.initials}
                </div>
                <div className="alm-ach-card__body">
                  <div className="alm-ach-card__title">🏆 {ach.title}</div>
                  <div className="alm-ach-card__by">
                    {ach.alumniName} · Batch {ach.batch} · <span className="alm-ach-card__year">{ach.year}</span>
                  </div>
                  <p className="alm-ach-card__desc">{ach.description}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Gallery Tab ── */}
      {activeTab === "gallery" && (
        <div className="alm-gallery" data-testid="school-gallery-alm">
          <div className="alm-gallery__header">
            <span className="alm-gallery__header-title">📸 Alumni Gallery</span>
            <span style={{ fontSize: ".75rem", color: "var(--alm-muted)" }}>School memories &amp; milestones</span>
          </div>

          <div className="alm-gallery__tabs">
            {Object.entries(GALLERY_SECTIONS).map(([key, sec]) => (
              <button
                key={key}
                className={`alm-tab${gallerySection === key ? " alm-tab--active" : ""}`}
                onClick={() => setGallerySection(key)}
                data-testid={`school-tab-alm-gallery-${key}`}
              >
                {sec.label}
              </button>
            ))}
          </div>

          <div className="alm-gallery__grid">
            {GALLERY_SECTIONS[gallerySection].items.map((item, i) => (
              <div
                key={i}
                className="alm-gallery-item"
                onClick={() => showToast(item.caption, "info")}
                data-testid={`school-gallery-item-alm-${gallerySection}-${i}`}
              >
                <img src={item.img} alt={item.caption} loading="lazy" />
                <div className="alm-gallery-item__overlay">
                  <span className="alm-gallery-item__caption">{item.caption}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      {activeModal === "profile" && selAlumni && (
        <AlumniProfileModal alumni={selAlumni} onClose={closeModal} showToast={showToast} />
      )}
      {activeModal === "mentorAction" && selRequest && (
        <MentorshipActionModal
          request={selRequest}
          action={mentorAction}
          onClose={closeModal}
          onConfirm={confirmMentorAction}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />
      )}
    </div>
  );
}
