import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import "../../Assets/styles/Infrastructure.scss";
import ManagementPageHeader from "../../app/components/common/ManagementPageHeader";
import {
  OVERVIEW_METRICS,
  BUILDINGS,
  CLASSROOMS,
  LABS,
  LIBRARY,
  SPORTS_FACILITIES,
  TRANSPORT_VEHICLES,
  TRANSPORT_METRICS,
  HOSTEL_BLOCKS,
  SECURITY,
  IT_INFRA,
  MAINTENANCE_REQUESTS,
  UTILITIES,
  ASSETS,
} from "./campusMockData";

// --- CONSTANTS ----------------------------------------------------------------

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "buildings", label: "Buildings" },
  { key: "classrooms", label: "Classrooms" },
  { key: "laboratories", label: "Laboratories" },
  { key: "library", label: "Library" },
  { key: "sports", label: "Sports" },
  { key: "transport", label: "Transport" },
  { key: "hostel", label: "Hostel" },
  { key: "security", label: "Security" },
  { key: "it", label: "IT Infrastructure" },
  { key: "maintenance", label: "Maintenance" },
  { key: "utilities", label: "Utilities" },
  { key: "assets", label: "Assets" },
  { key: "map", label: "Campus Map" },
];

const PAGE_SIZE = 10;

// --- SHARED PRIMITIVES -------------------------------------------------------

function ProgressBar({ pct, tone = "green" }) {
  const c = {
    green: "#22c55e",
    amber: "#f59e0b",
    red: "#ef4444",
    blue: "#6366f1",
    gold: "#c9a962",
    sky: "#38bdf8",
    teal: "#14b8a6",
    yellow: "#eab308",
  };
  return (
    <div className="ci-progress">
      <div className="ci-progress__track">
        <div
          className="ci-progress__fill"
          style={{
            width: `${Math.min(pct, 100)}%`,
            background: c[tone] || c.green,
          }}
        />
      </div>
      <span className="ci-progress__label">{pct}%</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const s = (status || "").toLowerCase().replace(/\s+/g, "-");
  return <span className={`ci-badge ci-badge--${s}`}>{status}</span>;
}

function SeverityBadge({ severity }) {
  const s = (severity || "").toLowerCase();
  return <span className={`ci-severity ci-severity--${s}`}>{severity}</span>;
}

function BackBtn({ onClick, label = "Back" }) {
  return (
    <button
      className="ci-back-btn"
      onClick={onClick}
      data-testid="school-button-ci-back"
    >
      ? {label}
    </button>
  );
}

// --- MODAL SYSTEM -------------------------------------------------------------

function Modal({ title, onClose, children }) {
  const ref = useRef();
  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div
      className="ci-modal-backdrop"
      ref={ref}
      onClick={(e) => e.target === ref.current && onClose()}
    >
      <div
        className="ci-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="ci-modal__header">
          <h3 className="ci-modal__title">{title}</h3>
          <button
            className="ci-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            ?
          </button>
        </div>
        <div className="ci-modal__body">{children}</div>
      </div>
    </div>
  );
}

function AddBuildingModal({ onClose }) {
  const [form, setForm] = useState({
    name: "",
    block: "",
    floors: "",
    capacity: "",
    year: "",
  });
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));
  return (
    <Modal title="Add Building" onClose={onClose}>
      <div className="ci-modal__form">
        <div className="ci-form-row">
          <div className="ci-form-col">
            <label className="ci-label">Building Name</label>
            <input
              className="ci-input"
              value={form.name}
              onChange={set("name")}
              placeholder="e.g. Science Block"
              data-testid="school-field-ci-building-name"
            />
          </div>
          <div className="ci-form-col">
            <label className="ci-label">Block</label>
            <input
              className="ci-input"
              value={form.block}
              onChange={set("block")}
              placeholder="e.g. A, B, C"
              data-testid="school-field-ci-building-block"
            />
          </div>
        </div>
        <div className="ci-form-row">
          <div className="ci-form-col">
            <label className="ci-label">Total Floors</label>
            <input
              className="ci-input"
              type="number"
              value={form.floors}
              onChange={set("floors")}
              min={1}
              data-testid="school-field-ci-building-floors"
            />
          </div>
          <div className="ci-form-col">
            <label className="ci-label">Capacity</label>
            <input
              className="ci-input"
              type="number"
              value={form.capacity}
              onChange={set("capacity")}
              data-testid="school-field-ci-building-capacity"
            />
          </div>
        </div>
        <div className="ci-form-row">
          <div className="ci-form-col">
            <label className="ci-label">Construction Year</label>
            <input
              className="ci-input"
              type="number"
              value={form.year}
              onChange={set("year")}
              placeholder="e.g. 2010"
              data-testid="school-field-ci-building-year"
            />
          </div>
        </div>
        <div className="ci-modal__actions">
          <button
            className="ci-btn ci-btn--ghost"
            onClick={onClose}
            data-testid="school-button-ci-building-cancel"
          >
            Cancel
          </button>
          <button
            className="ci-btn ci-btn--primary"
            onClick={onClose}
            data-testid="school-button-ci-building-save"
          >
            Add Building
          </button>
        </div>
      </div>
    </Modal>
  );
}

function AddClassroomModal({ onClose }) {
  const [form, setForm] = useState({
    room: "",
    building: "",
    floor: "",
    capacity: "",
    smart: false,
    ac: false,
  });
  const set = (f) => (e) =>
    setForm((p) => ({
      ...p,
      [f]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));
  return (
    <Modal title="Add Classroom" onClose={onClose}>
      <div className="ci-modal__form">
        <div className="ci-form-row">
          <div className="ci-form-col">
            <label className="ci-label">Room Number</label>
            <input
              className="ci-input"
              value={form.room}
              onChange={set("room")}
              placeholder="e.g. A101"
              data-testid="school-field-ci-classroom-room"
            />
          </div>
          <div className="ci-form-col">
            <label className="ci-label">Building</label>
            <input
              className="ci-input"
              value={form.building}
              onChange={set("building")}
              placeholder="e.g. A Block"
              data-testid="school-field-ci-classroom-building"
            />
          </div>
        </div>
        <div className="ci-form-row">
          <div className="ci-form-col">
            <label className="ci-label">Floor</label>
            <input
              className="ci-input"
              value={form.floor}
              onChange={set("floor")}
              placeholder="Ground / 1st �"
              data-testid="school-field-ci-classroom-floor"
            />
          </div>
          <div className="ci-form-col">
            <label className="ci-label">Capacity</label>
            <input
              className="ci-input"
              type="number"
              value={form.capacity}
              onChange={set("capacity")}
              data-testid="school-field-ci-classroom-capacity"
            />
          </div>
        </div>
        <div className="ci-form-row ci-form-row--checks">
          <label className="ci-check-label">
            <input
              type="checkbox"
              checked={form.smart}
              onChange={set("smart")}
              data-testid="school-field-ci-classroom-smart"
            />{" "}
            Smart Board
          </label>
          <label className="ci-check-label">
            <input
              type="checkbox"
              checked={form.ac}
              onChange={set("ac")}
              data-testid="school-field-ci-classroom-ac"
            />{" "}
            Air Conditioned
          </label>
        </div>
        <div className="ci-modal__actions">
          <button
            className="ci-btn ci-btn--ghost"
            onClick={onClose}
            data-testid="school-button-ci-classroom-cancel"
          >
            Cancel
          </button>
          <button
            className="ci-btn ci-btn--primary"
            onClick={onClose}
            data-testid="school-button-ci-classroom-save"
          >
            Add Classroom
          </button>
        </div>
      </div>
    </Modal>
  );
}

function MaintenanceRequestModal({ onClose }) {
  const [form, setForm] = useState({
    category: "",
    building: "",
    room: "",
    severity: "Medium",
    description: "",
  });
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));
  return (
    <Modal title="Raise Maintenance Request" onClose={onClose}>
      <div className="ci-modal__form">
        <div className="ci-form-row">
          <div className="ci-form-col">
            <label className="ci-label">Category</label>
            <select
              className="ci-select"
              value={form.category}
              onChange={set("category")}
              data-testid="school-dropdown-ci-maint-category"
            >
              <option value="">Select Category</option>
              {[
                "Electrical",
                "Plumbing",
                "Civil",
                "HVAC",
                "IT",
                "Housekeeping",
              ].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="ci-form-col">
            <label className="ci-label">Severity</label>
            <select
              className="ci-select"
              value={form.severity}
              onChange={set("severity")}
              data-testid="school-dropdown-ci-maint-severity"
            >
              {["Low", "Medium", "High", "Critical"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="ci-form-row">
          <div className="ci-form-col">
            <label className="ci-label">Building</label>
            <input
              className="ci-input"
              value={form.building}
              onChange={set("building")}
              placeholder="e.g. A Block"
              data-testid="school-field-ci-maint-building"
            />
          </div>
          <div className="ci-form-col">
            <label className="ci-label">Room / Area</label>
            <input
              className="ci-input"
              value={form.room}
              onChange={set("room")}
              placeholder="e.g. Rm 101"
              data-testid="school-field-ci-maint-room"
            />
          </div>
        </div>
        <div className="ci-form-row">
          <div className="ci-form-col ci-form-col--full">
            <label className="ci-label">Description</label>
            <textarea
              className="ci-textarea"
              rows={3}
              value={form.description}
              onChange={set("description")}
              placeholder="Describe the issue�"
              data-testid="school-field-ci-maint-desc"
            />
          </div>
        </div>
        <div className="ci-modal__actions">
          <button
            className="ci-btn ci-btn--ghost"
            onClick={onClose}
            data-testid="school-button-ci-maint-cancel"
          >
            Cancel
          </button>
          <button
            className="ci-btn ci-btn--primary"
            onClick={onClose}
            data-testid="school-button-ci-maint-submit"
          >
            Raise Request
          </button>
        </div>
      </div>
    </Modal>
  );
}

function FacilityBookingModal({ onClose }) {
  const [form, setForm] = useState({
    facility: "",
    date: "",
    time: "",
    purpose: "",
    contact: "",
  });
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));
  return (
    <Modal title="Book Facility" onClose={onClose}>
      <div className="ci-modal__form">
        <div className="ci-form-row">
          <div className="ci-form-col">
            <label className="ci-label">Facility</label>
            <select
              className="ci-select"
              value={form.facility}
              onChange={set("facility")}
              data-testid="school-dropdown-ci-book-facility"
            >
              <option value="">Select Facility</option>
              {SPORTS_FACILITIES.map((f) => (
                <option key={f.id}>{f.name}</option>
              ))}
            </select>
          </div>
          <div className="ci-form-col">
            <label className="ci-label">Date</label>
            <input
              className="ci-input"
              type="date"
              value={form.date}
              onChange={set("date")}
              data-testid="school-field-ci-book-date"
            />
          </div>
        </div>
        <div className="ci-form-row">
          <div className="ci-form-col">
            <label className="ci-label">Time Slot</label>
            <input
              className="ci-input"
              value={form.time}
              onChange={set("time")}
              placeholder="e.g. 10:00 � 12:00"
              data-testid="school-field-ci-book-time"
            />
          </div>
          <div className="ci-form-col">
            <label className="ci-label">Contact No.</label>
            <input
              className="ci-input"
              value={form.contact}
              onChange={set("contact")}
              placeholder="Phone number"
              data-testid="school-field-ci-book-contact"
            />
          </div>
        </div>
        <div className="ci-form-row">
          <div className="ci-form-col ci-form-col--full">
            <label className="ci-label">Purpose</label>
            <textarea
              className="ci-textarea"
              rows={2}
              value={form.purpose}
              onChange={set("purpose")}
              placeholder="e.g. Annual Sports Day practice"
              data-testid="school-field-ci-book-purpose"
            />
          </div>
        </div>
        <div className="ci-modal__actions">
          <button
            className="ci-btn ci-btn--ghost"
            onClick={onClose}
            data-testid="school-button-ci-book-cancel"
          >
            Cancel
          </button>
          <button
            className="ci-btn ci-btn--primary"
            onClick={onClose}
            data-testid="school-button-ci-book-confirm"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </Modal>
  );
}

function AssetAllocationModal({ onClose }) {
  const [form, setForm] = useState({
    asset: "",
    location: "",
    quantity: "",
    assignedTo: "",
  });
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));
  return (
    <Modal title="Allocate Asset" onClose={onClose}>
      <div className="ci-modal__form">
        <div className="ci-form-row">
          <div className="ci-form-col">
            <label className="ci-label">Asset</label>
            <select
              className="ci-select"
              value={form.asset}
              onChange={set("asset")}
              data-testid="school-dropdown-ci-alloc-asset"
            >
              <option value="">Select Asset</option>
              {ASSETS.map((a) => (
                <option key={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div className="ci-form-col">
            <label className="ci-label">Quantity</label>
            <input
              className="ci-input"
              type="number"
              value={form.quantity}
              onChange={set("quantity")}
              min={1}
              data-testid="school-field-ci-alloc-qty"
            />
          </div>
        </div>
        <div className="ci-form-row">
          <div className="ci-form-col">
            <label className="ci-label">Location / Block</label>
            <input
              className="ci-input"
              value={form.location}
              onChange={set("location")}
              placeholder="e.g. A Block"
              data-testid="school-field-ci-alloc-location"
            />
          </div>
          <div className="ci-form-col">
            <label className="ci-label">Assigned To</label>
            <input
              className="ci-input"
              value={form.assignedTo}
              onChange={set("assignedTo")}
              placeholder="Person / Dept."
              data-testid="school-field-ci-alloc-person"
            />
          </div>
        </div>
        <div className="ci-modal__actions">
          <button
            className="ci-btn ci-btn--ghost"
            onClick={onClose}
            data-testid="school-button-ci-alloc-cancel"
          >
            Cancel
          </button>
          <button
            className="ci-btn ci-btn--primary"
            onClick={onClose}
            data-testid="school-button-ci-alloc-confirm"
          >
            Allocate
          </button>
        </div>
      </div>
    </Modal>
  );
}

// --- OVERVIEW TAB -------------------------------------------------------------

function OverviewTab({ onOpenModal }) {
  return (
    <div className="ci-tab-content" data-testid="school-section-ci-overview">
      <div className="ci-metrics-grid">
        {OVERVIEW_METRICS.map((m) => (
          <div
            key={m.key}
            className={`ci-metric-card ci-metric-card--${m.tone}`}
            data-testid={`school-card-ci-metric-${m.key}`}
          >
            <div className="ci-metric-card__icon">{m.icon}</div>
            <div className="ci-metric-card__body">
              <div className="ci-metric-card__value">{m.value}</div>
              <div className="ci-metric-card__label">{m.label}</div>
              <div className="ci-metric-card__sub">{m.sub}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="ci-overview-grid">
        <div
          className="ci-analytics-card"
          data-testid="school-card-ci-analytics-occupancy"
        >
          <div className="ci-analytics-card__title">
            Infrastructure Utilisation
          </div>
          <div className="ci-analytics-rows">
            {[
              { label: "Classrooms", pct: 92, tone: "green" },
              { label: "Labs", pct: 74, tone: "blue" },
              { label: "Library", pct: 77, tone: "amber" },
              { label: "Sports Facilities", pct: 61, tone: "teal" },
              { label: "Hostel", pct: 85, tone: "gold" },
            ].map((r) => (
              <div key={r.label} className="ci-analytics-row">
                <span className="ci-analytics-row__label">{r.label}</span>
                <ProgressBar pct={r.pct} tone={r.tone} />
              </div>
            ))}
          </div>
        </div>
        <div
          className="ci-analytics-card"
          data-testid="school-card-ci-analytics-health"
        >
          <div className="ci-analytics-card__title">
            Infrastructure Health Score
          </div>
          <div className="ci-health-score">
            <div className="ci-health-score__ring">
              <span className="ci-health-score__val">92</span>
              <span className="ci-health-score__unit">/ 100</span>
            </div>
            <p className="ci-health-score__desc">
              Excellent overall condition. 17 maintenance requests pending.
            </p>
          </div>
          <div className="ci-analytics-rows">
            {[
              { label: "Buildings", pct: 94, tone: "green" },
              { label: "IT Systems", pct: 95, tone: "blue" },
              { label: "Security", pct: 94, tone: "teal" },
              { label: "Utilities", pct: 88, tone: "amber" },
            ].map((r) => (
              <div key={r.label} className="ci-analytics-row">
                <span className="ci-analytics-row__label">{r.label}</span>
                <ProgressBar pct={r.pct} tone={r.tone} />
              </div>
            ))}
          </div>
        </div>
        <div
          className="ci-analytics-card"
          data-testid="school-card-ci-quick-actions"
        >
          <div className="ci-analytics-card__title">Quick Actions</div>
          <div className="ci-quick-actions">
            <button
              className="ci-btn ci-btn--primary ci-btn--sm"
              onClick={() => onOpenModal("building")}
              data-testid="school-button-ci-qa-add-building"
            >
              + Add Building
            </button>
            <button
              className="ci-btn ci-btn--ghost ci-btn--sm"
              onClick={() => onOpenModal("maintenance")}
              data-testid="school-button-ci-qa-maintenance"
            >
              ?? Raise Maintenance
            </button>
            <button
              className="ci-btn ci-btn--ghost ci-btn--sm"
              onClick={() => onOpenModal("booking")}
              data-testid="school-button-ci-qa-book-facility"
            >
              ?? Book Facility
            </button>
            <button
              className="ci-btn ci-btn--ghost ci-btn--sm"
              onClick={() => onOpenModal("asset")}
              data-testid="school-button-ci-qa-allocate-asset"
            >
              ?? Allocate Asset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- BUILDINGS TAB ------------------------------------------------------------

function BuildingCard({ building, onClick }) {
  return (
    <div
      className="ci-card ci-card--clickable"
      onClick={() => onClick(building)}
      data-testid={`school-card-ci-building-${building.id}`}
    >
      <div className="ci-card__header">
        <span className="ci-card__icon">??</span>
        <div>
          <div className="ci-card__title">{building.name}</div>
          <div className="ci-card__sub">Block {building.block}</div>
        </div>
        <StatusBadge status={building.status} />
      </div>
      <div className="ci-kv-grid">
        <div className="ci-kv-item">
          <span>Floors</span>
          <strong>{building.floors}</strong>
        </div>
        <div className="ci-kv-item">
          <span>Rooms</span>
          <strong>{building.totalRooms}</strong>
        </div>
        <div className="ci-kv-item">
          <span>Capacity</span>
          <strong>{building.capacity}</strong>
        </div>
        <div className="ci-kv-item">
          <span>Built</span>
          <strong>{building.constructionYear}</strong>
        </div>
      </div>
      <div className="ci-card__depts">
        {building.departments.map((d) => (
          <span key={d} className="ci-tag">
            {d}
          </span>
        ))}
      </div>
      <div className="ci-card__footer">
        <span className="ci-card__footer-label">Occupancy</span>
        <ProgressBar
          pct={building.occupancyPct}
          tone={building.occupancyPct > 80 ? "amber" : "green"}
        />
      </div>
      <div
        className={`ci-card__safety ci-card__safety--${building.safetyCompliance === "Compliant" ? "ok" : "warn"}`}
      >
        {building.safetyCompliance === "Compliant" ? "?" : "??"} Safety:{" "}
        {building.safetyCompliance}
      </div>
    </div>
  );
}

function FloorView({ building, onBack }) {
  const [selectedFloor, setSelectedFloor] = useState(null);
  if (selectedFloor) {
    return (
      <div data-testid="school-section-ci-rooms">
        <BackBtn
          onClick={() => setSelectedFloor(null)}
          label={`${building.name} � ${selectedFloor.label}`}
        />
        <h3 className="ci-section-title">{selectedFloor.label} � Rooms</h3>
        <div className="ci-card-grid ci-card-grid--sm">
          {selectedFloor.rooms.map((room) => (
            <div
              key={room.id}
              className="ci-card"
              data-testid={`school-card-ci-room-${room.id}`}
            >
              <div className="ci-card__header">
                <span className="ci-card__icon">??</span>
                <div>
                  <div className="ci-card__title">Room {room.number}</div>
                  <div className="ci-card__sub">{room.type}</div>
                </div>
                <StatusBadge status={room.status} />
              </div>
              <div className="ci-kv-grid">
                <div className="ci-kv-item">
                  <span>Capacity</span>
                  <strong>{room.capacity}</strong>
                </div>
              </div>
              <ProgressBar pct={room.occupancyPct} tone="blue" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div data-testid="school-section-ci-floors">
      <BackBtn onClick={onBack} label="All Buildings" />
      <div className="ci-section-row">
        <h2 className="ci-section-title">{building.name} � Floors</h2>
        <StatusBadge status={building.status} />
      </div>
      <div className="ci-kv-grid ci-kv-grid--wide">
        <div className="ci-kv-item">
          <span>Block</span>
          <strong>{building.block}</strong>
        </div>
        <div className="ci-kv-item">
          <span>Total Rooms</span>
          <strong>{building.totalRooms}</strong>
        </div>
        <div className="ci-kv-item">
          <span>Capacity</span>
          <strong>{building.capacity}</strong>
        </div>
        <div className="ci-kv-item">
          <span>Safety</span>
          <strong>{building.safetyCompliance}</strong>
        </div>
      </div>
      <div className="ci-card-grid">
        {building.floors_data.map((floor) => (
          <div
            key={floor.id}
            className="ci-card ci-card--clickable"
            onClick={() => setSelectedFloor(floor)}
            data-testid={`school-card-ci-floor-${floor.id}`}
          >
            <div className="ci-card__header">
              <span className="ci-card__icon">???</span>
              <div>
                <div className="ci-card__title">{floor.label}</div>
                <div className="ci-card__sub">{floor.rooms.length} rooms</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BuildingsTab({ onOpenModal }) {
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(
    () =>
      BUILDINGS.filter((b) => {
        const q = search.toLowerCase();
        const matchesSearch =
          !q ||
          b.name.toLowerCase().includes(q) ||
          b.block.toLowerCase().includes(q);
        const matchesStatus =
          statusFilter === "all" || b.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [search, statusFilter],
  );

  if (selectedBuilding) {
    return (
      <FloorView
        building={selectedBuilding}
        onBack={() => setSelectedBuilding(null)}
      />
    );
  }
  return (
    <div className="ci-tab-content" data-testid="school-section-ci-buildings">
      <div className="ci-filters">
        <input
          className="ci-search"
          placeholder="Search buildings�"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-testid="school-search-ci-buildings"
        />
        <select
          className="ci-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          data-testid="school-dropdown-ci-building-status"
        >
          <option value="all">All Status</option>
          {["Active", "Maintenance", "Restricted"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <button
          className="ci-btn ci-btn--primary ci-btn--sm"
          onClick={() => onOpenModal("building")}
          data-testid="school-button-ci-add-building"
        >
          + Add Building
        </button>
      </div>
      <div className="ci-card-grid" data-testid="school-grid-ci-buildings">
        {filtered.map((b) => (
          <BuildingCard key={b.id} building={b} onClick={setSelectedBuilding} />
        ))}
        {filtered.length === 0 && (
          <div className="ci-empty">No buildings match your search.</div>
        )}
      </div>
    </div>
  );
}

// --- CLASSROOMS TAB -----------------------------------------------------------

function ClassroomsTab({ onOpenModal }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      CLASSROOMS.filter((c) => {
        const q = search.toLowerCase();
        const matchesSearch =
          !q ||
          c.roomNumber.toLowerCase().includes(q) ||
          c.building.toLowerCase().includes(q) ||
          c.assignedClass.toLowerCase().includes(q);
        const matchesStatus =
          statusFilter === "all" || c.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [search, statusFilter],
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="ci-tab-content" data-testid="school-section-ci-classrooms">
      <div className="ci-filters">
        <input
          className="ci-search"
          placeholder="Search classrooms�"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          data-testid="school-search-ci-classrooms"
        />
        <select
          className="ci-select"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          data-testid="school-dropdown-ci-classroom-status"
        >
          <option value="all">All Status</option>
          <option>Available</option>
          <option>Under Maintenance</option>
        </select>
        <button
          className="ci-btn ci-btn--primary ci-btn--sm"
          onClick={() => onOpenModal("classroom")}
          data-testid="school-button-ci-add-classroom"
        >
          + Add Classroom
        </button>
      </div>
      <div className="ci-table-wrap">
        <table className="ci-table" data-testid="school-table-ci-classrooms">
          <thead className="ci-table__head">
            <tr>
              <th>Room No.</th>
              <th>Building</th>
              <th>Floor</th>
              <th>Capacity</th>
              <th>Smart</th>
              <th>AC</th>
              <th>Assigned Class</th>
              <th>Utilisation</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((c) => (
              <tr
                key={c.id}
                className="ci-table__row"
                data-testid={`school-row-ci-classroom-${c.id}`}
              >
                <td className="ci-table__cell--bold">{c.roomNumber}</td>
                <td>{c.building}</td>
                <td>{c.floor}</td>
                <td>{c.capacity}</td>
                <td>{c.smartBoard ? "?" : "�"}</td>
                <td>{c.ac ? "?" : "�"}</td>
                <td>{c.assignedClass}</td>
                <td>
                  <ProgressBar
                    pct={c.utilizationPct}
                    tone={c.utilizationPct > 85 ? "amber" : "green"}
                  />
                </td>
                <td>
                  <StatusBadge status={c.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="ci-mobile-cards">
        {paged.map((c) => (
          <div
            key={c.id}
            className="ci-mobile-card"
            data-testid={`school-mcard-ci-classroom-${c.id}`}
          >
            <div className="ci-mobile-card__header">
              <span className="ci-mobile-card__title">{c.roomNumber}</span>
              <StatusBadge status={c.status} />
            </div>
            <div className="ci-kv-grid">
              <div className="ci-kv-item">
                <span>Building</span>
                <strong>{c.building}</strong>
              </div>
              <div className="ci-kv-item">
                <span>Floor</span>
                <strong>{c.floor}</strong>
              </div>
              <div className="ci-kv-item">
                <span>Capacity</span>
                <strong>{c.capacity}</strong>
              </div>
              <div className="ci-kv-item">
                <span>Assigned</span>
                <strong>{c.assignedClass}</strong>
              </div>
            </div>
            <ProgressBar pct={c.utilizationPct} tone="green" />
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div
          className="ci-pagination"
          data-testid="school-pagination-ci-classrooms"
        >
          <button
            className="ci-page-btn"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            data-testid="school-button-ci-classroom-prev"
          >
            � Prev
          </button>
          <span className="ci-pagination__info">
            Page {page} of {totalPages}
          </span>
          <button
            className="ci-page-btn"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            data-testid="school-button-ci-classroom-next"
          >
            Next �
          </button>
        </div>
      )}
    </div>
  );
}

// --- LABORATORIES TAB ---------------------------------------------------------

function LabsTab({ onOpenModal }) {
  const [selectedLab, setSelectedLab] = useState(null);

  if (selectedLab) {
    return (
      <div
        className="ci-tab-content"
        data-testid="school-section-ci-lab-detail"
      >
        <BackBtn onClick={() => setSelectedLab(null)} label="All Labs" />
        <div className="ci-section-row">
          <h2 className="ci-section-title" style={{ color: selectedLab.color }}>
            {selectedLab.icon} {selectedLab.name}
          </h2>
          <StatusBadge
            status={
              selectedLab.maintenanceStatus === "Due" ? "Maintenance" : "Active"
            }
          />
        </div>
        <div className="ci-metrics-grid ci-metrics-grid--sm">
          {[
            { label: "Capacity", value: selectedLab.capacity },
            { label: "Equipment", value: selectedLab.equipment },
            { label: "Active Sys.", value: selectedLab.activeSystems },
            { label: "In-Charge", value: selectedLab.inCharge },
            { label: "Safety", value: selectedLab.safetyStatus },
            { label: "Maintenance", value: selectedLab.maintenanceStatus },
          ].map((m) => (
            <div key={m.label} className="ci-metric-card ci-metric-card--flat">
              <div className="ci-metric-card__label">{m.label}</div>
              <div className="ci-metric-card__value">{m.value}</div>
            </div>
          ))}
        </div>
        <h3 className="ci-section-title">Utilisation</h3>
        <ProgressBar pct={selectedLab.utilizationPct} tone="blue" />
        <h3 className="ci-section-title" style={{ marginTop: "1.5rem" }}>
          Weekly Schedule
        </h3>
        <div className="ci-table-wrap">
          <table className="ci-table">
            <thead className="ci-table__head">
              <tr>
                <th>Day</th>
                <th>Time Slot</th>
                <th>Assigned Class</th>
              </tr>
            </thead>
            <tbody>
              {selectedLab.schedule.map((s, i) => (
                <tr key={i} className="ci-table__row">
                  <td>{s.day}</td>
                  <td>{s.time}</td>
                  <td>{s.class}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="ci-tab-content__actions">
          <button
            className="ci-btn ci-btn--ghost ci-btn--sm"
            onClick={() => onOpenModal("booking")}
            data-testid="school-button-ci-lab-book"
          >
            ?? Book Lab
          </button>
          <button
            className="ci-btn ci-btn--ghost ci-btn--sm"
            onClick={() => onOpenModal("maintenance")}
            data-testid="school-button-ci-lab-maintenance"
          >
            ?? Request Maintenance
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ci-tab-content" data-testid="school-section-ci-labs">
      <div className="ci-card-grid">
        {LABS.map((lab) => (
          <div
            key={lab.id}
            className="ci-card ci-card--clickable"
            onClick={() => setSelectedLab(lab)}
            data-testid={`school-card-ci-lab-${lab.id}`}
          >
            <div className="ci-card__header">
              <span className="ci-card__icon">{lab.icon}</span>
              <div>
                <div className="ci-card__title">{lab.name}</div>
                <div className="ci-card__sub">In-charge: {lab.inCharge}</div>
              </div>
            </div>
            <div className="ci-kv-grid">
              <div className="ci-kv-item">
                <span>Capacity</span>
                <strong>{lab.capacity}</strong>
              </div>
              <div className="ci-kv-item">
                <span>Equipment</span>
                <strong>{lab.equipment}</strong>
              </div>
              <div className="ci-kv-item">
                <span>Safety</span>
                <strong>{lab.safetyStatus}</strong>
              </div>
              <div className="ci-kv-item">
                <span>Maintenance</span>
                <strong>{lab.maintenanceStatus}</strong>
              </div>
            </div>
            <div className="ci-card__footer">
              <span className="ci-card__footer-label">Utilisation</span>
              <ProgressBar pct={lab.utilizationPct} tone="blue" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- LIBRARY TAB --------------------------------------------------------------

function LibraryTab() {
  const L = LIBRARY;
  return (
    <div className="ci-tab-content" data-testid="school-section-ci-library">
      <div className="ci-metrics-grid">
        {[
          {
            label: "Total Books",
            value: L.totalBooks.toLocaleString(),
            icon: "??",
            tone: "blue",
          },
          {
            label: "Seating Capacity",
            value: L.seatingCapacity,
            icon: "??",
            tone: "green",
          },
          {
            label: "Active Readers",
            value: L.activeReaders,
            icon: "??",
            tone: "amber",
          },
          {
            label: "Reading Rooms",
            value: L.readingRooms,
            icon: "??",
            tone: "teal",
          },
          {
            label: "Issued Today",
            value: L.issuedToday,
            icon: "??",
            tone: "indigo",
          },
          {
            label: "Returned Today",
            value: L.returnedToday,
            icon: "??",
            tone: "cyan",
          },
          {
            label: "Overdue Books",
            value: L.overdueBooks,
            icon: "??",
            tone: "red",
          },
          {
            label: "Digital Resources",
            value: `${L.digitalResources.length} types`,
            icon: "??",
            tone: "violet",
          },
        ].map((m) => (
          <div
            key={m.label}
            className={`ci-metric-card ci-metric-card--${m.tone}`}
            data-testid={`school-card-ci-library-${m.label.replace(/\s+/g, "-").toLowerCase()}`}
          >
            <div className="ci-metric-card__icon">{m.icon}</div>
            <div className="ci-metric-card__body">
              <div className="ci-metric-card__value">{m.value}</div>
              <div className="ci-metric-card__label">{m.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="ci-overview-grid">
        <div
          className="ci-analytics-card"
          data-testid="school-card-ci-library-staff"
        >
          <div className="ci-analytics-card__title">Library Staff</div>
          <div className="ci-kv-grid ci-kv-grid--wide">
            <div className="ci-kv-item">
              <span>Librarian</span>
              <strong>{L.librarian}</strong>
            </div>
            {L.assistants.map((a) => (
              <div key={a} className="ci-kv-item">
                <span>Assistant</span>
                <strong>{a}</strong>
              </div>
            ))}
          </div>
        </div>
        <div
          className="ci-analytics-card"
          data-testid="school-card-ci-library-digital"
        >
          <div className="ci-analytics-card__title">Digital Resources</div>
          {L.digitalResources.map((d) => (
            <div key={d.name} className="ci-analytics-row">
              <span className="ci-analytics-row__label">{d.name}</span>
              <span className="ci-analytics-row__val">
                {d.count.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
        <div
          className="ci-analytics-card"
          data-testid="school-card-ci-library-occupancy"
        >
          <div className="ci-analytics-card__title">Occupancy</div>
          <ProgressBar pct={L.occupancyPct} tone="amber" />
          <p className="ci-analytics-card__desc">
            {L.activeReaders} readers active out of {L.seatingCapacity} seats.
          </p>
        </div>
      </div>
    </div>
  );
}

// --- SPORTS TAB ---------------------------------------------------------------

function SportsTab({ onOpenModal }) {
  return (
    <div className="ci-tab-content" data-testid="school-section-ci-sports">
      <div className="ci-filters">
        <button
          className="ci-btn ci-btn--primary ci-btn--sm"
          onClick={() => onOpenModal("booking")}
          data-testid="school-button-ci-sports-book"
        >
          ?? Book Facility
        </button>
      </div>
      <div className="ci-card-grid">
        {SPORTS_FACILITIES.map((f) => (
          <div
            key={f.id}
            className="ci-card"
            data-testid={`school-card-ci-sports-${f.id}`}
          >
            <div className="ci-card__header">
              <span className="ci-card__icon">{f.icon}</span>
              <div>
                <div className="ci-card__title">{f.name}</div>
                <div className="ci-card__sub">Coach: {f.coach}</div>
              </div>
              <StatusBadge status={f.status} />
            </div>
            <div className="ci-kv-grid">
              <div className="ci-kv-item">
                <span>Capacity</span>
                <strong>{f.capacity}</strong>
              </div>
              <div className="ci-kv-item">
                <span>Condition</span>
                <strong>{f.condition}</strong>
              </div>
              <div className="ci-kv-item">
                <span>Next Maint.</span>
                <strong>{f.maintenanceDate}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- TRANSPORT TAB ------------------------------------------------------------

function TransportTab({ onOpenModal }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(
    () =>
      TRANSPORT_VEHICLES.filter((v) => {
        const q = search.toLowerCase();
        const matchesSearch =
          !q ||
          v.vehicleNumber.toLowerCase().includes(q) ||
          v.driver.toLowerCase().includes(q) ||
          v.route.toLowerCase().includes(q);
        const matchesStatus =
          statusFilter === "all" || v.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [search, statusFilter],
  );

  return (
    <div className="ci-tab-content" data-testid="school-section-ci-transport">
      <div className="ci-metrics-grid ci-metrics-grid--sm">
        {[
          {
            label: "Total Vehicles",
            value: TRANSPORT_METRICS.total,
            icon: "??",
            tone: "blue",
          },
          {
            label: "Active",
            value: TRANSPORT_METRICS.active,
            icon: "?",
            tone: "green",
          },
          {
            label: "GPS Enabled",
            value: TRANSPORT_METRICS.gpsEnabled,
            icon: "??",
            tone: "indigo",
          },
          {
            label: "Maint. Due",
            value: TRANSPORT_METRICS.maintenanceDue,
            icon: "??",
            tone: "red",
          },
        ].map((m) => (
          <div
            key={m.label}
            className={`ci-metric-card ci-metric-card--${m.tone}`}
            data-testid={`school-card-ci-transport-${m.label.replace(/\s+/g, "-").toLowerCase()}`}
          >
            <div className="ci-metric-card__icon">{m.icon}</div>
            <div className="ci-metric-card__body">
              <div className="ci-metric-card__value">{m.value}</div>
              <div className="ci-metric-card__label">{m.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="ci-filters">
        <input
          className="ci-search"
          placeholder="Search vehicles, driver, route�"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-testid="school-search-ci-transport"
        />
        <select
          className="ci-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          data-testid="school-dropdown-ci-transport-status"
        >
          <option value="all">All Status</option>
          <option>Active</option>
          <option>In Workshop</option>
        </select>
        <button
          className="ci-btn ci-btn--ghost ci-btn--sm"
          onClick={() => onOpenModal("maintenance")}
          data-testid="school-button-ci-transport-maint"
        >
          ?? Schedule Service
        </button>
      </div>
      <div className="ci-table-wrap">
        <table className="ci-table" data-testid="school-table-ci-transport">
          <thead className="ci-table__head">
            <tr>
              <th>Vehicle No.</th>
              <th>Route</th>
              <th>Driver</th>
              <th>Capacity</th>
              <th>Students</th>
              <th>Fuel</th>
              <th>GPS</th>
              <th>Maint.</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => (
              <tr
                key={v.id}
                className="ci-table__row"
                data-testid={`school-row-ci-vehicle-${v.id}`}
              >
                <td className="ci-table__cell--bold">{v.vehicleNumber}</td>
                <td>{v.route}</td>
                <td>{v.driver}</td>
                <td>{v.capacity}</td>
                <td>{v.studentsAssigned}</td>
                <td>
                  <span
                    className={`ci-fuel ci-fuel--${v.fuelStatus.toLowerCase()}`}
                  >
                    {v.fuelStatus}
                  </span>
                </td>
                <td>{v.gps ? "??" : "�"}</td>
                <td>
                  <StatusBadge
                    status={
                      v.maintenanceStatus === "Due" ? "Maintenance" : "Active"
                    }
                  />
                </td>
                <td>
                  <StatusBadge status={v.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="ci-mobile-cards">
        {filtered.map((v) => (
          <div
            key={v.id}
            className="ci-mobile-card"
            data-testid={`school-mcard-ci-vehicle-${v.id}`}
          >
            <div className="ci-mobile-card__header">
              <span className="ci-mobile-card__title">{v.vehicleNumber}</span>
              <StatusBadge status={v.status} />
            </div>
            <div className="ci-kv-grid">
              <div className="ci-kv-item">
                <span>Route</span>
                <strong>{v.route}</strong>
              </div>
              <div className="ci-kv-item">
                <span>Driver</span>
                <strong>{v.driver}</strong>
              </div>
              <div className="ci-kv-item">
                <span>GPS</span>
                <strong>{v.gps ? "Yes" : "No"}</strong>
              </div>
              <div className="ci-kv-item">
                <span>Fuel</span>
                <strong>{v.fuelStatus}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- HOSTEL TAB ---------------------------------------------------------------

function HostelTab() {
  return (
    <div className="ci-tab-content" data-testid="school-section-ci-hostel">
      <div className="ci-metrics-grid ci-metrics-grid--sm">
        {[
          {
            label: "Total Blocks",
            value: HOSTEL_BLOCKS.length,
            icon: "??",
            tone: "blue",
          },
          {
            label: "Total Beds",
            value: HOSTEL_BLOCKS.reduce((s, b) => s + b.bedCapacity, 0),
            icon: "???",
            tone: "green",
          },
          {
            label: "Occupied Beds",
            value: HOSTEL_BLOCKS.reduce((s, b) => s + b.occupiedBeds, 0),
            icon: "??",
            tone: "amber",
          },
          {
            label: "Pending Issues",
            value: HOSTEL_BLOCKS.reduce((s, b) => s + b.issues, 0),
            icon: "??",
            tone: "red",
          },
        ].map((m) => (
          <div
            key={m.label}
            className={`ci-metric-card ci-metric-card--${m.tone}`}
            data-testid={`school-card-ci-hostel-${m.label.replace(/\s+/g, "-").toLowerCase()}`}
          >
            <div className="ci-metric-card__icon">{m.icon}</div>
            <div className="ci-metric-card__body">
              <div className="ci-metric-card__value">{m.value}</div>
              <div className="ci-metric-card__label">{m.label}</div>
            </div>
          </div>
        ))}
        {" "}
      </div>
      <div className="ci-card-grid">
        {HOSTEL_BLOCKS.map((block) => {
          const occPct = Math.round(
            (block.occupiedBeds / block.bedCapacity) * 100,
          );
          return (
            <div
              key={block.id}
              className="ci-card"
              data-testid={`school-card-ci-hostel-${block.id}`}
            >
              <div className="ci-card__header">
                <span className="ci-card__icon">
                  {block.type === "Girls" ? "??" : "??"}
                </span>
                <div>
                  <div className="ci-card__title">{block.name}</div>
                  <div className="ci-card__sub">Warden: {block.warden}</div>
                </div>
                <span className={`ci-tag ci-tag--${block.type.toLowerCase()}`}>
                  {block.type}
                </span>
              </div>
              <div className="ci-kv-grid">
                <div className="ci-kv-item">
                  <span>Total Rooms</span>
                  <strong>{block.totalRooms}</strong>
                </div>
                <div className="ci-kv-item">
                  <span>Occupied</span>
                  <strong>{block.occupiedRooms}</strong>
                </div>
                <div className="ci-kv-item">
                  <span>Beds</span>
                  <strong>{block.bedCapacity}</strong>
                </div>
                <div className="ci-kv-item">
                  <span>Issues</span>
                  <strong>{block.issues}</strong>
                </div>
              </div>
              <div className="ci-card__footer">
                <span className="ci-card__footer-label">Bed Occupancy</span>
                <ProgressBar
                  pct={occPct}
                  tone={occPct > 90 ? "red" : occPct > 75 ? "amber" : "green"}
                />
              </div>
              <div className="ci-card__mess">
                {block.mess ? "? Mess Available" : "�  No Mess"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- SECURITY TAB -------------------------------------------------------------

function SecurityTab() {
  const S = SECURITY;
  const cctvPct = Math.round((S.activeCCTV / S.totalCCTV) * 100);
  return (
    <div className="ci-tab-content" data-testid="school-section-ci-security">
      <div className="ci-metrics-grid ci-metrics-grid--sm">
        {[
          { label: "Total CCTV", value: S.totalCCTV, icon: "??", tone: "blue" },
          {
            label: "Active CCTV",
            value: S.activeCCTV,
            icon: "?",
            tone: "green",
          },
          {
            label: "Access Points",
            value: S.accessPoints,
            icon: "??",
            tone: "indigo",
          },
          {
            label: "Biometrics",
            value: S.biometricDevices,
            icon: "???",
            tone: "violet",
          },
          {
            label: "Emergency Exits",
            value: S.emergencyExits,
            icon: "??",
            tone: "amber",
          },
          {
            label: "Security Staff",
            value: S.personnelCount,
            icon: "??",
            tone: "teal",
          },
        ].map((m) => (
          <div
            key={m.label}
            className={`ci-metric-card ci-metric-card--${m.tone}`}
            data-testid={`school-card-ci-security-${m.label.replace(/\s+/g, "-").toLowerCase()}`}
          >
            <div className="ci-metric-card__icon">{m.icon}</div>
            <div className="ci-metric-card__value">{m.value}</div>
            <div className="ci-metric-card__label">{m.label}</div>
          </div>
        ))}
      </div>
      <div className="ci-overview-grid">
        <div
          className="ci-analytics-card"
          data-testid="school-card-ci-cctv-coverage"
        >
          <div className="ci-analytics-card__title">CCTV Coverage</div>
          <ProgressBar pct={cctvPct} tone={cctvPct < 90 ? "amber" : "green"} />
          <p className="ci-analytics-card__desc">
            {S.offline} cameras offline. Please schedule maintenance.
          </p>
        </div>
        <div
          className="ci-analytics-card ci-analytics-card--full"
          data-testid="school-card-ci-incident-log"
        >
          <div className="ci-analytics-card__title">Recent Incidents</div>
          <div className="ci-table-wrap">
            <table className="ci-table">
              <thead className="ci-table__head">
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Severity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {S.incidents.map((inc) => (
                  <tr
                    key={inc.id}
                    className="ci-table__row"
                    data-testid={`school-row-ci-incident-${inc.id}`}
                  >
                    <td className="ci-table__cell--bold">{inc.id}</td>
                    <td>{inc.date}</td>
                    <td>{inc.type}</td>
                    <td>{inc.location}</td>
                    <td>
                      <SeverityBadge severity={inc.severity} />
                    </td>
                    <td>
                      <StatusBadge status={inc.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- IT INFRASTRUCTURE TAB ----------------------------------------------------

function ITTab() {
  const IT = IT_INFRA;
  return (
    <div className="ci-tab-content" data-testid="school-section-ci-it">
      <div className="ci-metrics-grid ci-metrics-grid--sm">
        {IT.devices.map((d) => (
          <div
            key={d.type}
            className="ci-metric-card ci-metric-card--blue"
            data-testid={`school-card-ci-it-${d.type.replace(/\s+/g, "-").toLowerCase()}`}
          >
            <div className="ci-metric-card__icon">{d.icon}</div>
            <div className="ci-metric-card__value">
              {d.active}
              <span className="ci-metric-card__total">/{d.total}</span>
            </div>
            <div className="ci-metric-card__label">{d.type}</div>
            <div className="ci-metric-card__sub">Active</div>
          </div>
        ))}
      </div>
      <div className="ci-overview-grid">
        <div
          className="ci-analytics-card"
          data-testid="school-card-ci-it-health"
        >
          <div className="ci-analytics-card__title">
            Infrastructure Health Score
          </div>
          <div className="ci-health-score">
            <div className="ci-health-score__ring">
              <span className="ci-health-score__val">{IT.healthScore}</span>
              <span className="ci-health-score__unit">/ 100</span>
            </div>
          </div>
          <ProgressBar pct={IT.healthScore} tone="blue" />
        </div>
        <div
          className="ci-analytics-card"
          data-testid="school-card-ci-it-network"
        >
          <div className="ci-analytics-card__title">Network Status</div>
          <div className="ci-kv-grid ci-kv-grid--wide">
            <div className="ci-kv-item">
              <span>Bandwidth</span>
              <strong>{IT.bandwidth}</strong>
            </div>
            <div className="ci-kv-item">
              <span>Uptime</span>
              <strong>{IT.uptimePct}%</strong>
            </div>
            <div className="ci-kv-item">
              <span>WiFi Zones</span>
              <strong>{IT.wifiZones.active} active</strong>
            </div>
            <div className="ci-kv-item">
              <span>ERP Kiosks</span>
              <strong>{IT.erpKiosks}</strong>
            </div>
          </div>
          <div className="ci-analytics-row" style={{ marginTop: "1rem" }}>
            <span className="ci-analytics-row__label">Network Utilisation</span>
          </div>
          <ProgressBar pct={IT.networkUtilisationPct} tone="green" />
        </div>
      </div>
    </div>
  );
}

// --- MAINTENANCE TAB ---------------------------------------------------------

const STATUS_ORDER = ["Pending", "In Progress", "Resolved", "Escalated"];

function MaintenanceTab({ onOpenModal }) {
  const [view, setView] = useState("kanban");
  const [search, setSearch] = useState("");
  const [sevFilter, setSevFilter] = useState("all");

  const filtered = useMemo(
    () =>
      MAINTENANCE_REQUESTS.filter((r) => {
        const q = search.toLowerCase();
        const matchesSearch =
          !q ||
          r.id.toLowerCase().includes(q) ||
          r.building.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q);
        const matchesSev = sevFilter === "all" || r.severity === sevFilter;
        return matchesSearch && matchesSev;
      }),
    [search, sevFilter],
  );

  const byStatus = useMemo(
    () =>
      STATUS_ORDER.reduce((acc, s) => {
        acc[s] = filtered.filter((r) => r.status === s);
        return acc;
      }, {}),
    [filtered],
  );

  return (
    <div className="ci-tab-content" data-testid="school-section-ci-maintenance">
      <div className="ci-filters">
        <input
          className="ci-search"
          placeholder="Search requests�"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-testid="school-search-ci-maintenance"
        />
        <select
          className="ci-select"
          value={sevFilter}
          onChange={(e) => setSevFilter(e.target.value)}
          data-testid="school-dropdown-ci-maint-sev"
        >
          <option value="all">All Severity</option>
          {["Low", "Medium", "High", "Critical"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <div className="ci-view-toggle">
          <button
            className={`ci-btn ci-btn--xs${view === "kanban" ? " ci-btn--primary" : " ci-btn--ghost"}`}
            onClick={() => setView("kanban")}
            data-testid="school-button-ci-maint-kanban"
          >
            Kanban
          </button>
          <button
            className={`ci-btn ci-btn--xs${view === "table" ? " ci-btn--primary" : " ci-btn--ghost"}`}
            onClick={() => setView("table")}
            data-testid="school-button-ci-maint-table"
          >
            Table
          </button>
        </div>
        <button
          className="ci-btn ci-btn--primary ci-btn--sm"
          onClick={() => onOpenModal("maintenance")}
          data-testid="school-button-ci-maint-raise"
        >
          + Raise Request
        </button>
      </div>
      {view === "kanban" ? (
        <div className="ci-kanban" data-testid="school-kanban-ci-maintenance">
          {STATUS_ORDER.map((status) => (
            <div
              key={status}
              className={`ci-kanban-col ci-kanban-col--${status.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <div className="ci-kanban-col__header">
                <span className="ci-kanban-col__title">{status}</span>
                <span className="ci-kanban-col__count">
                  {byStatus[status].length}
                </span>
              </div>
              {byStatus[status].map((req) => (
                <div
                  key={req.id}
                  className="ci-kanban-item"
                  data-testid={`school-card-ci-maint-${req.id}`}
                >
                  <div className="ci-kanban-item__id">{req.id}</div>
                  <div className="ci-kanban-item__title">{req.category}</div>
                  <div className="ci-kanban-item__sub">
                    {req.building} � {req.room}
                  </div>
                  <div className="ci-kanban-item__footer">
                    <SeverityBadge severity={req.severity} />
                    <span className="ci-kanban-item__tech">
                      {req.technician}
                    </span>
                  </div>
                </div>
              ))}
              {byStatus[status].length === 0 && (
                <div className="ci-kanban-item ci-kanban-item--empty">
                  No requests
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="ci-table-wrap">
          <table className="ci-table" data-testid="school-table-ci-maintenance">
            <thead className="ci-table__head">
              <tr>
                <th>ID</th>
                <th>Category</th>
                <th>Building / Room</th>
                <th>Technician</th>
                <th>Severity</th>
                <th>ETA</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  className="ci-table__row"
                  data-testid={`school-row-ci-maint-${r.id}`}
                >
                  <td className="ci-table__cell--bold">{r.id}</td>
                  <td>{r.category}</td>
                  <td>
                    {r.building} / {r.room}
                  </td>
                  <td>{r.technician}</td>
                  <td>
                    <SeverityBadge severity={r.severity} />
                  </td>
                  <td>{r.eta}</td>
                  <td>
                    <StatusBadge status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// --- UTILITIES TAB ------------------------------------------------------------

function UtilitiesTab() {
  const U = UTILITIES;
  return (
    <div className="ci-tab-content" data-testid="school-section-ci-utilities">
      <div className="ci-metrics-grid ci-metrics-grid--sm">
        {[
          {
            label: "Electricity (kW)",
            value: U.electricity.currentKw,
            icon: "?",
            tone: "amber",
            sub: `Trend ${U.electricity.trend}`,
          },
          {
            label: "Water (L/day)",
            value: U.water.currentLitres.toLocaleString(),
            icon: "??",
            tone: "blue",
            sub: `Trend ${U.water.trend}`,
          },
          {
            label: "Solar Coverage",
            value: `${U.solar.coverage}%`,
            icon: "??",
            tone: "yellow",
            sub: `Trend ${U.solar.trend}`,
          },
          {
            label: "Generator Fuel",
            value: `${U.generator.fuelLevel}%`,
            icon: "??",
            tone: "green",
            sub: U.generator.status,
          },
          {
            label: "Internet Uptime",
            value: `${U.internet.uptime}%`,
            icon: "??",
            tone: "teal",
            sub: `${U.internet.avgSpeedMbps} Mbps avg`,
          },
        ].map((m) => (
          <div
            key={m.label}
            className={`ci-metric-card ci-metric-card--${m.tone}`}
            data-testid={`school-card-ci-utility-${m.label.replace(/[\s()\/]+/g, "-").toLowerCase()}`}
          >
            <div className="ci-metric-card__icon">{m.icon}</div>
            <div className="ci-metric-card__value">{m.value}</div>
            <div className="ci-metric-card__label">{m.label}</div>
            <div className="ci-metric-card__sub">{m.sub}</div>
          </div>
        ))}
      </div>
      <div
        className="ci-analytics-card"
        data-testid="school-card-ci-utility-trends"
      >
        <div className="ci-analytics-card__title">
          Monthly Electricity Consumption (kWh)
        </div>
        <div className="ci-util-chart">
          {U.monthly.map((m) => {
            const maxElec = Math.max(...U.monthly.map((x) => x.elec));
            const pct = Math.round((m.elec / maxElec) * 100);
            return (
              <div key={m.month} className="ci-util-bar-col">
                <div
                  className="ci-util-bar"
                  style={{ height: `${pct}%` }}
                  title={`${m.month}: ${m.elec.toLocaleString()} kWh`}
                />
                <span className="ci-util-bar-label">{m.month}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="ci-overview-grid">
        <div
          className="ci-analytics-card"
          data-testid="school-card-ci-utility-costs"
        >
          <div className="ci-analytics-card__title">Cost Summary</div>
          <div className="ci-kv-grid ci-kv-grid--wide">
            <div className="ci-kv-item">
              <span>Electricity / month</span>
              <strong>?{U.electricity.cost.toLocaleString()}</strong>
            </div>
            <div className="ci-kv-item">
              <span>Water / month</span>
              <strong>?{U.water.cost.toLocaleString()}</strong>
            </div>
            <div className="ci-kv-item">
              <span>Solar saving est.</span>
              <strong>?{(U.electricity.cost * 0.3).toLocaleString()}</strong>
            </div>
          </div>
        </div>
        <div
          className="ci-analytics-card"
          data-testid="school-card-ci-utility-internet"
        >
          <div className="ci-analytics-card__title">Internet Details</div>
          <div className="ci-kv-grid ci-kv-grid--wide">
            <div className="ci-kv-item">
              <span>Provider</span>
              <strong>{U.internet.provider}</strong>
            </div>
            <div className="ci-kv-item">
              <span>Renewal</span>
              <strong>{U.internet.renewalDate}</strong>
            </div>
            <div className="ci-kv-item">
              <span>Uptime</span>
              <strong>{U.internet.uptime}%</strong>
            </div>
            <div className="ci-kv-item">
              <span>Avg Speed</span>
              <strong>{U.internet.avgSpeedMbps} Mbps</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- ASSETS TAB ---------------------------------------------------------------

function AssetsTab({ onOpenModal }) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [page, setPage] = useState(1);

  const cats = useMemo(
    () => ["all", ...new Set(ASSETS.map((a) => a.category))],
    [],
  );

  const filtered = useMemo(
    () =>
      ASSETS.filter((a) => {
        const q = search.toLowerCase();
        const matchesSearch =
          !q ||
          a.name.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q);
        const matchesCat = catFilter === "all" || a.category === catFilter;
        return matchesSearch && matchesCat;
      }),
    [search, catFilter],
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="ci-tab-content" data-testid="school-section-ci-assets">
      <div className="ci-filters">
        <input
          className="ci-search"
          placeholder="Search assets�"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          data-testid="school-search-ci-assets"
        />
        <select
          className="ci-select"
          value={catFilter}
          onChange={(e) => {
            setCatFilter(e.target.value);
            setPage(1);
          }}
          data-testid="school-dropdown-ci-asset-cat"
        >
          {cats.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "All Categories" : c}
            </option>
          ))}
        </select>
        <button
          className="ci-btn ci-btn--primary ci-btn--sm"
          onClick={() => onOpenModal("asset")}
          data-testid="school-button-ci-allocate-asset"
        >
          + Allocate Asset
        </button>
      </div>
      <div className="ci-table-wrap">
        <table className="ci-table" data-testid="school-table-ci-assets">
          <thead className="ci-table__head">
            <tr>
              <th>Asset ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Qty</th>
              <th>Location</th>
              <th>Condition</th>
              <th>Warranty</th>
              <th>Depreciation</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((a) => (
              <tr
                key={a.id}
                className="ci-table__row"
                data-testid={`school-row-ci-asset-${a.id}`}
              >
                <td className="ci-table__cell--bold">{a.id}</td>
                <td>{a.name}</td>
                <td>{a.category}</td>
                <td>{a.quantity}</td>
                <td>{a.location}</td>
                <td>
                  <StatusBadge status={a.condition} />
                </td>
                <td>{a.warrantyExpiry}</td>
                <td>{a.depreciation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="ci-mobile-cards">
        {paged.map((a) => (
          <div
            key={a.id}
            className="ci-mobile-card"
            data-testid={`school-mcard-ci-asset-${a.id}`}
          >
            <div className="ci-mobile-card__header">
              <span className="ci-mobile-card__title">{a.name}</span>
              <StatusBadge status={a.condition} />
            </div>
            <div className="ci-kv-grid">
              <div className="ci-kv-item">
                <span>Category</span>
                <strong>{a.category}</strong>
              </div>
              <div className="ci-kv-item">
                <span>Location</span>
                <strong>{a.location}</strong>
              </div>
              <div className="ci-kv-item">
                <span>Qty</span>
                <strong>{a.quantity}</strong>
              </div>
              <div className="ci-kv-item">
                <span>Warranty</span>
                <strong>{a.warrantyExpiry}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div
          className="ci-pagination"
          data-testid="school-pagination-ci-assets"
        >
          <button
            className="ci-page-btn"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            data-testid="school-button-ci-asset-prev"
          >
            � Prev
          </button>
          <span className="ci-pagination__info">
            Page {page} of {totalPages}
          </span>
          <button
            className="ci-page-btn"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            data-testid="school-button-ci-asset-next"
          >
            Next �
          </button>
        </div>
      )}
    </div>
  );
}

// --- CAMPUS MAP TAB -----------------------------------------------------------

function CampusMapTab() {
  return (
    <div className="ci-tab-content" data-testid="school-section-ci-map">
      <div className="ci-map-header">
        <p className="ci-map-header__desc">
          Interactive campus layout. Click on a building to see details.
        </p>
      </div>
      <div className="ci-map-grid">
        {BUILDINGS.map((b, i) => (
          <div
            key={b.id}
            className={`ci-map-building ci-map-building--${b.status.toLowerCase()}`}
            data-testid={`school-map-building-${b.id}`}
          >
            <div className="ci-map-building__name">?? {b.name}</div>
            <div className="ci-map-building__meta">
              {b.floors}F � {b.totalRooms} rooms
            </div>
            <StatusBadge status={b.status} />
          </div>
        ))}
      </div>
      <div className="ci-map-legend">
        <span className="ci-map-legend__item ci-map-legend__item--active">
          ? Active
        </span>
        <span className="ci-map-legend__item ci-map-legend__item--maintenance">
          ? Maintenance
        </span>
        <span className="ci-map-legend__item ci-map-legend__item--restricted">
          ? Restricted
        </span>
        <span className="ci-map-legend__item ci-map-legend__item--exit">
          ?? Emergency Exit
        </span>
      </div>
    </div>
  );
}

// --- ROOT COMPONENT ----------------------------------------------------------

const MODAL_COMPONENTS = {
  building: AddBuildingModal,
  classroom: AddClassroomModal,
  maintenance: MaintenanceRequestModal,
  booking: FacilityBookingModal,
  asset: AssetAllocationModal,
};

function Infrastructure() {
  const [activeTab, setActiveTab] = useState("overview");
  const [openModal, setOpenModal] = useState(null);
  const tabBarRef = useRef();

  const handleTabClick = useCallback((key) => {
    setActiveTab(key);
    if (tabBarRef.current) {
      const btn = tabBarRef.current.querySelector(`[data-tab="${key}"]`);
      if (btn)
        btn.scrollIntoView({
          block: "nearest",
          inline: "center",
          behavior: "smooth",
        });
    }
  }, []);

  const ModalComp = openModal ? MODAL_COMPONENTS[openModal] : null;

  return (
    <div className="ci-root" data-testid="school-page-ci-infrastructure">
      <ManagementPageHeader
        breadcrumbs={[
          { label: "Campus" },
          { label: "Infrastructure" },
        ]}
        title="Campus Infrastructure"
        subtitle="Smart campus operations and facilities management dashboard"
        actions={(
          <>
            <button
              className="ci-btn ci-btn--ghost ci-btn--sm"
              onClick={() => setOpenModal("maintenance")}
              data-testid="school-button-ci-header-maintenance"
            >
              ?? Maintenance
            </button>
            <button
              className="ci-btn ci-btn--primary ci-btn--sm"
              onClick={() => setOpenModal("building")}
              data-testid="school-button-ci-header-add"
            >
              + Add Building
            </button>
          </>
        )}
      />

      {/* Tab Navigation */}
      <div className="ci-tabs-wrap">
        <div
          className="ci-tabs"
          ref={tabBarRef}
          role="tablist"
          data-testid="school-tabbar-ci-infrastructure"
        >
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`ci-tab${activeTab === tab.key ? " ci-tab--active" : ""}`}
              role="tab"
              aria-selected={activeTab === tab.key}
              data-tab={tab.key}
              onClick={() => handleTabClick(tab.key)}
              data-testid={`school-tab-ci-${tab.key}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div
        className="ci-content"
        data-testid="school-content-ci-infrastructure"
      >
        {activeTab === "overview" && <OverviewTab onOpenModal={setOpenModal} />}
        {activeTab === "buildings" && (
          <BuildingsTab onOpenModal={setOpenModal} />
        )}
        {activeTab === "classrooms" && (
          <ClassroomsTab onOpenModal={setOpenModal} />
        )}
        {activeTab === "laboratories" && <LabsTab onOpenModal={setOpenModal} />}
        {activeTab === "library" && <LibraryTab />}
        {activeTab === "sports" && <SportsTab onOpenModal={setOpenModal} />}
        {activeTab === "transport" && (
          <TransportTab onOpenModal={setOpenModal} />
        )}
        {activeTab === "hostel" && <HostelTab />}
        {activeTab === "security" && <SecurityTab />}
        {activeTab === "it" && <ITTab />}
        {activeTab === "maintenance" && (
          <MaintenanceTab onOpenModal={setOpenModal} />
        )}
        {activeTab === "utilities" && <UtilitiesTab />}
        {activeTab === "assets" && <AssetsTab onOpenModal={setOpenModal} />}
        {activeTab === "map" && <CampusMapTab />}
      </div>

      {/* Modals */}
      {ModalComp && <ModalComp onClose={() => setOpenModal(null)} />}
    </div>
  );
}

export default Infrastructure;
