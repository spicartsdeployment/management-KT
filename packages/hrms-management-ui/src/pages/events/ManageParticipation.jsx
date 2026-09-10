import React, { useState, useMemo } from 'react';
import '../../Assets/styles/ManageEvents.scss';
import ManagementPageHeader from '../../app/components/common/ManagementPageHeader';

// ── Mock Data ──────────────────────────────────────────────────────────────────
const MOCK_PARTICIPATION = [
  { id: 1,  event: "Annual Sports Day",       type: "Sports",    house: "All",    registered: 420, capacity: 500, waitlisted: 12, status: "open",     date: "2026-05-20", coordinator: "Mr. Rajan Kumar"   },
  { id: 2,  event: "Science Fair 2026",       type: "Academic",  house: "All",    registered: 148, capacity: 200, waitlisted: 0,  status: "open",     date: "2026-05-25", coordinator: "Mrs. Priya Verma"  },
  { id: 3,  event: "Cultural Fest",           type: "Cultural",  house: "All",    registered: 285, capacity: 350, waitlisted: 8,  status: "open",     date: "2026-06-01", coordinator: "Ms. Sunita Singh"  },
  { id: 4,  event: "Math Olympiad",           type: "Academic",  house: "Yellow", registered: 88,  capacity: 100, waitlisted: 0,  status: "closed",   date: "2026-05-15", coordinator: "Mr. Suresh Nair"   },
  { id: 5,  event: "Blue House Athletics",    type: "Sports",    house: "Blue",   registered: 95,  capacity: 110, waitlisted: 3,  status: "open",     date: "2026-05-22", coordinator: "Mr. Rajan Kumar"   },
  { id: 6,  event: "Red House Drama Show",    type: "Cultural",  house: "Red",    registered: 52,  capacity: 80,  waitlisted: 0,  status: "open",     date: "2026-05-28", coordinator: "Ms. Kavitha Rao"   },
  { id: 7,  event: "Annual Day 2026",         type: "Special",   house: "All",    registered: 540, capacity: 600, waitlisted: 24, status: "open",     date: "2026-06-15", coordinator: "Principal Sharma"  },
  { id: 8,  event: "Photography Workshop",   type: "Workshop",  house: "All",    registered: 35,  capacity: 40,  waitlisted: 6,  status: "full",     date: "2026-05-30", coordinator: "Mr. Deepak Jain"   },
  { id: 9,  event: "Chess Club Championship",type: "Club",      house: "Green",  registered: 32,  capacity: 32,  waitlisted: 0,  status: "closed",   date: "2026-05-18", coordinator: "Mr. Vikram Singh"  },
  { id: 10, event: "Swimming Competition",    type: "Sports",    house: "All",    registered: 72,  capacity: 80,  waitlisted: 0,  status: "open",     date: "2026-05-29", coordinator: "Mr. Karan Mehta"   },
  { id: 11, event: "Art Exhibition",          type: "Arts",      house: "All",    registered: 86,  capacity: 100, waitlisted: 2,  status: "open",     date: "2026-05-26", coordinator: "Ms. Pooja Desai"   },
  { id: 12, event: "Book Fair",              type: "Academic",  house: "All",    registered: 298, capacity: 350, waitlisted: 0,  status: "closed",   date: "2026-05-19", coordinator: "Mrs. Rashmi Bhatt" },
];

const TYPE_OPTS   = ["All Types", "Sports", "Academic", "Cultural", "Special", "Workshop", "Club", "Arts"];
const STATUS_OPTS = ["all", "open", "closed", "full"];

function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function fillPct(reg, cap) {
  if (!cap) return 0;
  return Math.min(100, Math.round((reg / cap) * 100));
}

function fillColor(pct) {
  if (pct >= 95) return "#dc2626";
  if (pct >= 75) return "#d97706";
  return "#16a34a";
}

function houseBadge(h) {
  const m = { Blue: "blue", Red: "red", Yellow: "yellow", Green: "green", All: "all" };
  return `em-house-badge em-house-badge--${m[h] || "all"}`;
}

/**
 * ManageParticipation - track and manage event registrations and participation.
 * @returns {JSX.Element}
 */
export default function ManageParticipation() {
  const [search,       setSearch]       = useState("");
  const [filterType,   setFilterType]   = useState("All Types");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage,  setCurrentPage]  = useState(1);
  const [detailRow,    setDetailRow]    = useState(null);
  const [toast,        setToast]        = useState(null);
  const PAGE_SIZE = 8;

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return MOCK_PARTICIPATION.filter(p => {
      if (q && !p.event.toLowerCase().includes(q) && !p.coordinator.toLowerCase().includes(q)) return false;
      if (filterType   !== "All Types" && p.type   !== filterType)   return false;
      if (filterStatus !== "all"       && p.status !== filterStatus) return false;
      return true;
    });
  }, [search, filterType, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function clearFilters() { setSearch(""); setFilterType("All Types"); setFilterStatus("all"); setCurrentPage(1); }
  const hasFilters = !!(search || filterType !== "All Types" || filterStatus !== "all");

  const metrics = useMemo(() => ({
    total:       MOCK_PARTICIPATION.length,
    open:        MOCK_PARTICIPATION.filter(p => p.status === "open").length,
    full:        MOCK_PARTICIPATION.filter(p => p.status === "full").length,
    totalReg:    MOCK_PARTICIPATION.reduce((s, p) => s + p.registered, 0),
    waitlisted:  MOCK_PARTICIPATION.reduce((s, p) => s + p.waitlisted, 0),
    avgFill:     Math.round(MOCK_PARTICIPATION.reduce((s, p) => s + fillPct(p.registered, p.capacity), 0) / MOCK_PARTICIPATION.length),
  }), []);

  return (
    <div className="em-root" data-testid="school-page-manage-participation">

      <ManagementPageHeader
        breadcrumbs={[
          { label: "Management" },
          { label: "Events" },
          { label: "Participation" },
        ]}
        title="Manage Participation"
        subtitle="Track registrations, capacity, and waitlists across all events"
        actions={(
          <>
            <button className="em-btn em-btn--ghost" data-testid="school-button-mp-export">⬇️ Export</button>
            <button className="em-btn em-btn--primary" data-testid="school-button-mp-register">+ Register</button>
          </>
        )}
      />

      {/* ── Metric Cards ── */}
      <div className="em-metrics" data-testid="school-metrics-mp-root">
        <div className="em-metric-card em-metric-card--primary" data-testid="school-metric-mp-total">
          <div className="em-metric-card__icon">📋</div>
          <div className="em-metric-card__body"><div className="em-metric-card__value">{metrics.total}</div><div className="em-metric-card__label">Total Events</div></div>
        </div>
        <div className="em-metric-card em-metric-card--success" data-testid="school-metric-mp-open">
          <div className="em-metric-card__icon">✅</div>
          <div className="em-metric-card__body"><div className="em-metric-card__value">{metrics.open}</div><div className="em-metric-card__label">Open Events</div></div>
        </div>
        <div className="em-metric-card em-metric-card--danger" data-testid="school-metric-mp-full">
          <div className="em-metric-card__icon">🔒</div>
          <div className="em-metric-card__body"><div className="em-metric-card__value">{metrics.full}</div><div className="em-metric-card__label">Fully Booked</div></div>
        </div>
        <div className="em-metric-card em-metric-card--info" data-testid="school-metric-mp-registered">
          <div className="em-metric-card__icon">👤</div>
          <div className="em-metric-card__body"><div className="em-metric-card__value">{metrics.totalReg.toLocaleString()}</div><div className="em-metric-card__label">Total Registered</div></div>
        </div>
        <div className="em-metric-card em-metric-card--warning" data-testid="school-metric-mp-waitlist">
          <div className="em-metric-card__icon">⏳</div>
          <div className="em-metric-card__body"><div className="em-metric-card__value">{metrics.waitlisted}</div><div className="em-metric-card__label">Waitlisted</div></div>
        </div>
        <div className="em-metric-card em-metric-card--teal" data-testid="school-metric-mp-fill">
          <div className="em-metric-card__icon">📊</div>
          <div className="em-metric-card__body"><div className="em-metric-card__value">{metrics.avgFill}%</div><div className="em-metric-card__label">Avg Fill Rate</div></div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="em-toolbar" data-testid="school-toolbar-mp-root">
        <div className="em-search" data-testid="school-search-mp">
          <span className="em-search__icon">🔍</span>
          <input
            type="text" value={search} placeholder="Search events or coordinators…"
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            data-testid="school-field-mp-search"
          />
          {search && <button className="em-search__clear" onClick={() => { setSearch(""); setCurrentPage(1); }} data-testid="school-button-mp-search-clear">✕</button>}
        </div>
        <select className="em-filter-select" value={filterType} onChange={e => { setFilterType(e.target.value); setCurrentPage(1); }} data-testid="school-dropdown-mp-type">
          {TYPE_OPTS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select className="em-filter-select" value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }} data-testid="school-dropdown-mp-status">
          {STATUS_OPTS.map(s => <option key={s} value={s}>{s === "all" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <div className="em-toolbar__right">
          {hasFilters && <button className="em-clear-btn" onClick={clearFilters} data-testid="school-button-mp-clear-filters">✕ Clear</button>}
        </div>
      </div>

      {/* Results summary */}
      {hasFilters && (
        <div className="em-results-bar" data-testid="school-results-mp-bar">
          <span className="em-results-bar__count">{filtered.length} event{filtered.length !== 1 ? "s" : ""} found</span>
        </div>
      )}

      {/* ── Participation Table ── */}
      <div className="em-table-wrap" data-testid="school-table-mp-participation">
        <div className="em-table-scroll">
          <table className="em-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Type</th>
                <th>House</th>
                <th>Date</th>
                <th>Fill Rate</th>
                <th>Registered</th>
                <th>Waitlisted</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr className="em-table__empty">
                  <td colSpan={9}>
                    <div className="em-empty">
                      <div className="em-empty__icon">📭</div>
                      <div className="em-empty__title">No events found</div>
                      <div className="em-empty__sub">Adjust your filters</div>
                    </div>
                  </td>
                </tr>
              ) : paginated.map(p => {
                const pct   = fillPct(p.registered, p.capacity);
                const color = fillColor(pct);
                return (
                  <tr key={p.id} data-testid={`school-row-mp-event-${p.id}`}>
                    <td>
                      <div className="em-cell-title">{p.event}</div>
                      <div className="em-cell-sub">👤 {p.coordinator}</div>
                    </td>
                    <td>
                      <span className="em-type-badge">{p.type}</span>
                    </td>
                    <td>
                      <span className={houseBadge(p.house)}>{p.house === "All" ? "All Houses" : `${p.house} House`}</span>
                    </td>
                    <td>
                      <div className="em-cell-date">
                        <span className="em-cell-date__day">{fmtDate(p.date)}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: ".625rem", minWidth: 120 }}>
                        <div style={{ flex: 1, height: 6, background: "var(--em-line)", borderRadius: 999, overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 999, transition: "width .3s" }} />
                        </div>
                        <span style={{ fontSize: ".7rem", fontWeight: 700, color, minWidth: "2.5rem", textAlign: "right" }}>{pct}%</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: "var(--em-text)" }}>{p.registered}</div>
                      <div className="em-cell-sub">/ {p.capacity} capacity</div>
                    </td>
                    <td>
                      {p.waitlisted > 0
                        ? <span style={{ color: "#d97706", fontWeight: 700, fontSize: ".8125rem" }}>⏳ {p.waitlisted}</span>
                        : <span className="em-cell-muted">—</span>
                      }
                    </td>
                    <td>
                      <span className={`em-status-badge em-status-badge--${p.status === "open" ? "active" : p.status === "closed" ? "completed" : "cancelled"}`}>
                        {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div className="em-actions">
                        <button className="em-action-btn em-action-btn--info"    title="View Details"     onClick={() => setDetailRow(p)}                          data-testid={`school-button-mp-view-${p.id}`}>👁️</button>
                        <button className="em-action-btn em-action-btn--success" title="Open Registration" onClick={() => showToast(`"${p.event}" registration opened.`)} data-testid={`school-button-mp-open-${p.id}`}>✅</button>
                        <button className="em-action-btn em-action-btn--danger"  title="Close Registration" onClick={() => showToast(`"${p.event}" registration closed.`, "warn")} data-testid={`school-button-mp-close-${p.id}`}>🔒</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="em-pagination" data-testid="school-pagination-mp">
            <button className="em-page-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} data-testid="school-button-mp-page-prev">‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} className={`em-page-btn${p === currentPage ? " em-page-btn--active" : ""}`} onClick={() => setCurrentPage(p)} data-testid={`school-button-mp-page-${p}`}>{p}</button>
            ))}
            <button className="em-page-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} data-testid="school-button-mp-page-next">›</button>
          </div>
        )}
      </div>

      {/* ── Detail Modal ── */}
      {detailRow && (
        <div className="em-modal-backdrop" onClick={() => setDetailRow(null)} data-testid="school-modal-mp-detail">
          <div className="em-modal" onClick={e => e.stopPropagation()}>
            <div className="em-modal__header">
              <span className="em-modal__title">👥 Participation Details</span>
              <button className="em-modal__close" onClick={() => setDetailRow(null)} data-testid="school-button-mp-detail-close">✕</button>
            </div>
            <div className="em-modal__body">
              <div className="em-detail">
                <div className="em-detail__hero">
                  <div className="em-detail__title">{detailRow.event}</div>
                  <div className="em-detail__badges">
                    <span className={`em-status-badge em-status-badge--${detailRow.status === "open" ? "active" : detailRow.status === "closed" ? "completed" : "cancelled"}`}>
                      {detailRow.status.charAt(0).toUpperCase() + detailRow.status.slice(1)}
                    </span>
                    <span className="em-type-badge">{detailRow.type}</span>
                    <span className={houseBadge(detailRow.house)}>{detailRow.house === "All" ? "All Houses" : `${detailRow.house} House`}</span>
                  </div>
                  <div className="em-detail__meta">
                    <span>📅 {fmtDate(detailRow.date)}</span>
                    <span>👤 {detailRow.coordinator}</span>
                  </div>
                </div>
                <div className="em-detail__section">Registration Summary</div>
                <div className="em-detail__grid">
                  <div className="em-detail__field"><div className="em-detail__field-label">Registered</div><div className="em-detail__field-value">👥 {detailRow.registered}</div></div>
                  <div className="em-detail__field"><div className="em-detail__field-label">Capacity</div><div className="em-detail__field-value">🏟️ {detailRow.capacity}</div></div>
                  <div className="em-detail__field"><div className="em-detail__field-label">Available Seats</div><div className="em-detail__field-value">{Math.max(0, detailRow.capacity - detailRow.registered)}</div></div>
                  <div className="em-detail__field"><div className="em-detail__field-label">Waitlisted</div><div className="em-detail__field-value">⏳ {detailRow.waitlisted || 0}</div></div>
                </div>
                <div className="em-detail__section">Fill Rate</div>
                <div style={{ padding: ".75rem 1rem", background: "var(--em-input)", border: "1px solid var(--em-line)", borderRadius: ".375rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".75rem", color: "#6b7280", marginBottom: ".375rem" }}>
                    <span>{detailRow.registered} registered</span>
                    <span style={{ fontWeight: 700, color: fillColor(fillPct(detailRow.registered, detailRow.capacity)) }}>{fillPct(detailRow.registered, detailRow.capacity)}%</span>
                  </div>
                  <div style={{ height: 10, background: "var(--em-line)", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ width: `${fillPct(detailRow.registered, detailRow.capacity)}%`, height: "100%", background: fillColor(fillPct(detailRow.registered, detailRow.capacity)), borderRadius: 999 }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="em-modal__footer">
              <button className="em-btn em-btn--ghost" onClick={() => setDetailRow(null)} data-testid="school-button-mp-detail-cancel">Close</button>
              <button className="em-btn em-btn--success em-btn--sm" onClick={() => { showToast(`"${detailRow.event}" registration opened.`); setDetailRow(null); }} data-testid="school-button-mp-detail-open">✅ Open Registration</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className={`em-toast${toast.type === "warn" ? " em-toast--warn" : ""}`} data-testid="school-toast-mp">
          <span>{toast.type === "success" ? "✅" : "⚠️"}</span>
          <span>{toast.msg}</span>
          <button className="em-toast__close" onClick={() => setToast(null)} data-testid="school-button-mp-toast-close">✕</button>
        </div>
      )}
    </div>
  );
}
