import React from "react";
import "../../Assets/styles/ManageEvents.scss";
import ManagementPageHeader from "../../app/components/common/ManagementPageHeader";

// ── Mock Data ──────────────────────────────────────────────────────────────────
const MOCK_EVENTS = [
  { id: 1,  name: "Annual Sports Day",         category: "sports",    type: "House Competition",  date: "2026-05-20", time: "08:00 AM", venue: "Main Ground",         house: "All",    coordinator: "Mr. Rajan Kumar",     status: "completed", participants: 420, attendees: 398, galleryCount: 24, desc: "Annual inter-house sports championship with track, field, and team events.", tags: ["Sports", "Annual"] },
  { id: 2,  name: "Science Fair 2026",         category: "science",   type: "Inter-School",       date: "2026-05-25", time: "09:00 AM", venue: "Science Block",       house: "All",    coordinator: "Mrs. Priya Verma",    status: "upcoming",  participants: 180, attendees: 0,   galleryCount: 0,  desc: "Students showcase science projects; judges from partner institutions.",     tags: ["Science", "Competition"] },
  { id: 3,  name: "Cultural Fest",             category: "cultural",  type: "Intra-School",       date: "2026-06-01", time: "10:00 AM", venue: "Auditorium",          house: "All",    coordinator: "Ms. Sunita Singh",    status: "upcoming",  participants: 310, attendees: 0,   galleryCount: 0,  desc: "Celebrating diverse cultures through dance, music and art performances.",   tags: ["Cultural", "Arts"] },
  { id: 4,  name: "Math Olympiad",             category: "academics", type: "House Competition",  date: "2026-05-15", time: "09:30 AM", venue: "Classroom Block A",   house: "Yellow", coordinator: "Mr. Suresh Nair",     status: "completed", participants: 88,  attendees: 86,  galleryCount: 4,  desc: "Inter-house mathematics olympiad for Grades 6–10.",                        tags: ["Math", "Competition"] },
  { id: 5,  name: "Blue House Athletics",      category: "sports",    type: "House Competition",  date: "2026-05-22", time: "07:30 AM", venue: "Sports Ground",       house: "Blue",   coordinator: "Mr. Rajan Kumar",     status: "active",    participants: 95,  attendees: 92,  galleryCount: 8,  desc: "Blue House exclusive athletics event with sprints, jumps and relay.",       tags: ["Sports", "Blue House"] },
  { id: 6,  name: "Red House Drama Show",      category: "cultural",  type: "House Competition",  date: "2026-05-28", time: "05:00 PM", venue: "Auditorium",          house: "Red",    coordinator: "Ms. Kavitha Rao",     status: "upcoming",  participants: 60,  attendees: 0,   galleryCount: 0,  desc: "Red House presents a dramatic production for parents and students.",        tags: ["Drama", "Red House"] },
  { id: 7,  name: "Annual Day 2026",           category: "annual",    type: "Special Program",    date: "2026-06-15", time: "04:00 PM", venue: "Main Auditorium",     house: "All",    coordinator: "Principal Sharma",    status: "upcoming",  participants: 600, attendees: 0,   galleryCount: 0,  desc: "Flagship annual ceremony with awards, performances and prize distribution.", tags: ["Annual", "Ceremony"] },
  { id: 8,  name: "Photography Workshop",      category: "arts",      type: "Workshop",           date: "2026-05-30", time: "02:00 PM", venue: "Media Room",          house: "All",    coordinator: "Mr. Deepak Jain",     status: "upcoming",  participants: 40,  attendees: 0,   galleryCount: 0,  desc: "Hands-on photography fundamentals workshop for senior students.",           tags: ["Workshop", "Photography"] },
  { id: 9,  name: "Morning Assembly Special",  category: "assembly",  type: "Assembly",           date: "2026-05-22", time: "07:45 AM", venue: "School Ground",       house: "All",    coordinator: "VP Nair",             status: "ongoing",   participants: 850, attendees: 830, galleryCount: 2,  desc: "Monthly special assembly with guest speaker and awards.",                   tags: ["Assembly"] },
  { id: 10, name: "Chess Club Championship",   category: "academics", type: "Club Activity",      date: "2026-05-18", time: "03:30 PM", venue: "Library Hall",        house: "Green",  coordinator: "Mr. Vikram Singh",    status: "completed", participants: 32,  attendees: 32,  galleryCount: 6,  desc: "Intra-house chess championship finals with live commentary.",               tags: ["Chess", "Club"] },
  { id: 11, name: "Green House Talent Show",   category: "cultural",  type: "House Competition",  date: "2026-06-05", time: "05:30 PM", venue: "Auditorium",          house: "Green",  coordinator: "Mrs. Lalitha",        status: "upcoming",  participants: 75,  attendees: 0,   galleryCount: 0,  desc: "Green House showcases student talents in music, dance and spoken word.",    tags: ["Talent", "Green House"] },
  { id: 12, name: "Inter-School Debate",       category: "academics", type: "Inter-School",       date: "2026-06-10", time: "10:00 AM", venue: "Conference Hall",     house: "All",    coordinator: "Mr. Pradeep Menon",   status: "upcoming",  participants: 48,  attendees: 0,   galleryCount: 0,  desc: "Competitive debate event hosted for regional school teams.",                tags: ["Debate", "Inter-School"] },
  { id: 13, name: "Yellow House Sports Day",   category: "sports",    type: "House Competition",  date: "2026-05-24", time: "08:00 AM", venue: "Sports Ground",       house: "Yellow", coordinator: "Mrs. Sneha Iyer",     status: "active",    participants: 100, attendees: 98,  galleryCount: 5,  desc: "Yellow House sports day with house-specific athletics events.",             tags: ["Sports", "Yellow House"] },
  { id: 14, name: "Art Exhibition",            category: "arts",      type: "Intra-School",       date: "2026-05-26", time: "11:00 AM", venue: "Art Gallery Hall",    house: "All",    coordinator: "Ms. Pooja Desai",     status: "upcoming",  participants: 90,  attendees: 0,   galleryCount: 0,  desc: "Annual art exhibition displaying student artwork from all classes.",        tags: ["Art", "Exhibition"] },
  { id: 15, name: "Science Club Workshop",     category: "science",   type: "Club Activity",      date: "2026-05-21", time: "03:30 PM", venue: "Science Lab",         house: "Blue",   coordinator: "Mr. Nikhil Joshi",    status: "active",    participants: 28,  attendees: 26,  galleryCount: 3,  desc: "Robotics and electronics hands-on activity for Science Club members.",      tags: ["Science", "Robotics"] },
  { id: 16, name: "CCA Dance Practice",        category: "cultural",  type: "CCA",                date: "2026-05-22", time: "04:00 PM", venue: "Dance Studio",        house: "All",    coordinator: "Ms. Ananya Krishnan", status: "ongoing",   participants: 35,  attendees: 35,  galleryCount: 1,  desc: "CCA dance troupe rehearsal session for Annual Day performance.",            tags: ["CCA", "Dance"] },
  { id: 17, name: "Parent-Teacher Meeting",    category: "assembly",  type: "Special Program",    date: "2026-06-08", time: "09:00 AM", venue: "All Classrooms",      house: "All",    coordinator: "Principal Sharma",    status: "upcoming",  participants: 500, attendees: 0,   galleryCount: 0,  desc: "Semester progress meeting with parents and class teachers.",               tags: ["Parents", "Meeting"] },
  { id: 18, name: "Swimming Competition",      category: "sports",    type: "House Competition",  date: "2026-05-29", time: "07:30 AM", venue: "Swimming Pool",       house: "All",    coordinator: "Mr. Karan Mehta",     status: "upcoming",  participants: 80,  attendees: 0,   galleryCount: 0,  desc: "Inter-house swimming gala with freestyle, backstroke and relay events.",    tags: ["Sports", "Swimming"] },
  { id: 19, name: "Book Fair",                 category: "academics", type: "Special Program",    date: "2026-05-19", time: "09:00 AM", venue: "Library Hall",        house: "All",    coordinator: "Mrs. Rashmi Bhatt",   status: "completed", participants: 320, attendees: 290, galleryCount: 7,  desc: "Annual book fair featuring publishers, author talks and student discounts.", tags: ["Books", "Library"] },
  { id: 20, name: "Red House Cricket",         category: "sports",    type: "House Competition",  date: "2026-05-27", time: "08:30 AM", venue: "Cricket Ground",      house: "Red",    coordinator: "Mr. Arjun Reddy",     status: "upcoming",  participants: 44,  attendees: 0,   galleryCount: 0,  desc: "Red House inter-class cricket match with umpire and scorecard tracking.",   tags: ["Cricket", "Red House"] },
];

const MOCK_HOUSES = [
  { id: "blue",   name: "Blue House",   icon: "🔵", color: "#2563eb", points: 480, events: 8, wins: 5, rank: 1, members: 210,
    involved: [
      { name: "Blue House Athletics",  status: "active"    },
      { name: "Science Club Workshop", status: "active"    },
      { name: "Annual Sports Day",     status: "completed" },
      { name: "Math Olympiad",         status: "upcoming"  },
    ],
  },
  { id: "green",  name: "Green House",  icon: "🟢", color: "#16a34a", points: 455, events: 7, wins: 3, rank: 2, members: 198,
    involved: [
      { name: "Chess Club Championship", status: "completed" },
      { name: "Green House Talent Show", status: "upcoming"  },
      { name: "Annual Sports Day",       status: "completed" },
      { name: "Inter-School Debate",     status: "upcoming"  },
    ],
  },
  { id: "red",    name: "Red House",    icon: "🔴", color: "#dc2626", points: 420, events: 7, wins: 3, rank: 3, members: 205,
    involved: [
      { name: "Red House Drama Show",   status: "upcoming"  },
      { name: "Red House Cricket",      status: "upcoming"  },
      { name: "Annual Sports Day",      status: "completed" },
      { name: "Swimming Competition",   status: "upcoming"  },
    ],
  },
  { id: "yellow", name: "Yellow House", icon: "🟡", color: "#d97706", points: 390, events: 6, wins: 2, rank: 4, members: 195,
    involved: [
      { name: "Math Olympiad",           status: "completed" },
      { name: "Yellow House Sports Day", status: "active"    },
      { name: "Annual Sports Day",       status: "completed" },
      { name: "Cultural Fest",           status: "upcoming"  },
    ],
  },
];

const MOCK_ACTIVITIES = [
  { id: 1, type: "assembly", icon: "🎙️", title: "Morning Assembly",        time: "07:45 – 08:10 AM", venue: "School Ground", days: "Mon–Fri",  participants: 850, status: "ongoing"  },
  { id: 2, type: "cca",      icon: "💃", title: "CCA Dance",                time: "04:00 – 05:30 PM", venue: "Dance Studio",  days: "Mon, Wed", participants: 35,  status: "ongoing"  },
  { id: 3, type: "club",     icon: "♟️", title: "Chess Club",               time: "03:30 – 04:30 PM", venue: "Library Hall",  days: "Tue, Thu", participants: 28,  status: "active"   },
  { id: 4, type: "club",     icon: "🔬", title: "Science Club",             time: "03:30 – 05:00 PM", venue: "Science Lab",   days: "Mon, Fri", participants: 30,  status: "active"   },
  { id: 5, type: "workshop", icon: "📸", title: "Photography Workshop",     time: "02:00 – 04:00 PM", venue: "Media Room",    days: "Sat",      participants: 40,  status: "upcoming" },
  { id: 6, type: "special",  icon: "🏊", title: "Swim Training",            time: "06:30 – 08:00 AM", venue: "Swimming Pool", days: "Tue, Thu", participants: 60,  status: "active"   },
  { id: 7, type: "cca",      icon: "🎨", title: "Art CCA",                  time: "04:00 – 05:30 PM", venue: "Art Room",      days: "Wed, Fri", participants: 22,  status: "active"   },
  { id: 8, type: "club",     icon: "📖", title: "Book Club",                time: "01:00 – 02:00 PM", venue: "Library",       days: "Fri",      participants: 18,  status: "active"   },
  { id: 9, type: "special",  icon: "🎓", title: "Academic Support Program", time: "03:00 – 04:30 PM", venue: "Classroom 2B",  days: "Mon–Thu",  participants: 45,  status: "active"   },
];

const GALLERY_ITEMS = [
  { id: 1,  emoji: "🏃", bg: "#dbeafe", label: "100m Sprint Finish",       event: "Annual Sports Day",       featured: true  },
  { id: 2,  emoji: "🏆", bg: "#fef3c7", label: "Trophy Ceremony",          event: "Annual Sports Day",       featured: true  },
  { id: 3,  emoji: "🔬", bg: "#d1fae5", label: "Experiment Display",       event: "Science Fair 2026",       featured: false },
  { id: 4,  emoji: "♟️", bg: "#ede9fe", label: "Chess Finals",             event: "Chess Club Championship", featured: false },
  { id: 5,  emoji: "📚", bg: "#fef9c3", label: "Book Stalls",              event: "Book Fair",               featured: false },
  { id: 6,  emoji: "🎭", bg: "#fce7f3", label: "Drama Rehearsal",          event: "Red House Drama Show",    featured: false },
  { id: 7,  emoji: "🌿", bg: "#d1fae5", label: "Green House Celebration",  event: "Annual Sports Day",       featured: false },
  { id: 8,  emoji: "🤸", bg: "#dbeafe", label: "Relay Race",               event: "Blue House Athletics",    featured: false },
  { id: 9,  emoji: "🎵", bg: "#ede9fe", label: "Musical Performance",      event: "Cultural Fest",           featured: false },
  { id: 10, emoji: "🖼️", bg: "#fef3c7", label: "Artwork Display",          event: "Art Exhibition",          featured: false },
  { id: 11, emoji: "🏊", bg: "#dbeafe", label: "Diving Competition",       event: "Swimming Competition",    featured: false },
  { id: 12, emoji: "📸", bg: "#f3f4f6", label: "Workshop in Progress",     event: "Photography Workshop",    featured: false },
];

const COORDINATORS  = ["All", "Mr. Rajan Kumar", "Mrs. Priya Verma", "Ms. Sunita Singh", "Mr. Suresh Nair", "Principal Sharma", "VP Nair"];
const STATUS_LIST   = ["all", "active", "upcoming", "completed", "cancelled", "ongoing"];
const CATEGORY_LIST = ["all", "sports", "academics", "cultural", "annual", "science", "arts", "workshop", "assembly", "cca"];
const HOUSE_LIST    = ["All", "Blue", "Red", "Yellow", "Green"];
const TYPE_LIST     = ["All Types", "House Competition", "Inter-School", "Intra-School", "Special Program", "Club Activity", "Workshop", "Assembly", "CCA"];

// ── Helpers ───────────────────────────────────────────────────────────────────
function catBadge(cat) {
  const m = { sports:"sports", academics:"academics", cultural:"cultural", annual:"annual", science:"science", arts:"arts", workshop:"workshop", assembly:"assembly", cca:"cca" };
  return `em-cat-badge em-cat-badge--${m[cat] || "assembly"}`;
}
function statusBadge(s)  { return `em-status-badge em-status-badge--${s}`; }
function houseBadge(h)   { return `em-house-badge em-house-badge--${(h || "all").toLowerCase()}`; }
function avatarColor(name) {
  const cols = ["#2563eb","#16a34a","#dc2626","#d97706","#7c3aed","#0891b2","#c9a962"];
  let h = 0; for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % cols.length;
  return cols[h];
}
function initials(name) { return name.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase(); }
function fmtDate(d)      { return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
function houseCls(h) {
  const m = { Blue:"blue", Red:"red", Yellow:"yellow", Green:"green", All:"all" };
  return `em-house-card em-house-card--${m[h] || "all"}`;
}

// ── Component ─────────────────────────────────────────────────────────────────
/**
 * ManageEvents - Monitor, edit, and track school events.
 * @returns {JSX.Element}
 */
export default function ManageEvents() {
  const [activeTab,        setActiveTab]        = React.useState("events");
  const [searchQuery,      setSearchQuery]      = React.useState("");
  const [filterStatus,     setFilterStatus]     = React.useState("all");
  const [filterCategory,   setFilterCategory]   = React.useState("all");
  const [filterHouse,      setFilterHouse]      = React.useState("All");
  const [filterType,       setFilterType]       = React.useState("All Types");
  const [filterCoord,      setFilterCoord]      = React.useState("All");
  const [filterDateFrom,   setFilterDateFrom]   = React.useState("");
  const [filterDateTo,     setFilterDateTo]     = React.useState("");
  const [showFilters,      setShowFilters]      = React.useState(false);
  const [viewMode,         setViewMode]         = React.useState("table");
  const [currentPage,      setCurrentPage]      = React.useState(1);
  const PAGE_SIZE = 8;

  const [detailEvent,      setDetailEvent]      = React.useState(null);
  const [editEvent,        setEditEvent]        = React.useState(null);
  const [editForm,         setEditForm]         = React.useState({});
  const [confirmModal,     setConfirmModal]     = React.useState(null);
  const [reschedule,       setReschedule]       = React.useState(null);
  const [rescheduleForm,   setRescheduleForm]   = React.useState({ date: "", time: "", reason: "" });
  const [galleryItem,      setGalleryItem]      = React.useState(null);
  const [toast,            setToast]            = React.useState(null);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  }

  // ── Filtering ───────────────────────────────────────────────────────────────
  const filtered = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return MOCK_EVENTS.filter(ev => {
      if (q && !ev.name.toLowerCase().includes(q) && !ev.coordinator.toLowerCase().includes(q) && !ev.venue.toLowerCase().includes(q) && !ev.category.toLowerCase().includes(q)) return false;
      if (filterStatus   !== "all"       && ev.status      !== filterStatus)     return false;
      if (filterCategory !== "all"       && ev.category    !== filterCategory)   return false;
      if (filterHouse    !== "All"       && ev.house       !== filterHouse)      return false;
      if (filterType     !== "All Types" && ev.type        !== filterType)       return false;
      if (filterCoord    !== "All"       && ev.coordinator !== filterCoord)      return false;
      if (filterDateFrom && ev.date < filterDateFrom) return false;
      if (filterDateTo   && ev.date > filterDateTo)   return false;
      return true;
    });
  }, [searchQuery, filterStatus, filterCategory, filterHouse, filterType, filterCoord, filterDateFrom, filterDateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function clearFilters() {
    setSearchQuery(""); setFilterStatus("all"); setFilterCategory("all");
    setFilterHouse("All"); setFilterType("All Types"); setFilterCoord("All");
    setFilterDateFrom(""); setFilterDateTo(""); setCurrentPage(1);
  }
  const hasActiveFilters = !!(searchQuery || filterStatus !== "all" || filterCategory !== "all" || filterHouse !== "All" || filterType !== "All Types" || filterCoord !== "All" || filterDateFrom || filterDateTo);

  // ── Metrics ─────────────────────────────────────────────────────────────────
  const metrics = React.useMemo(() => ({
    active:    MOCK_EVENTS.filter(e => e.status === "active").length,
    upcoming:  MOCK_EVENTS.filter(e => e.status === "upcoming").length,
    completed: MOCK_EVENTS.filter(e => e.status === "completed").length,
    cancelled: MOCK_EVENTS.filter(e => e.status === "cancelled").length,
    house:     MOCK_EVENTS.filter(e => e.type   === "House Competition").length,
    ongoing:   MOCK_EVENTS.filter(e => e.status === "ongoing").length,
  }), []);

  // ── Handlers ────────────────────────────────────────────────────────────────
  function openEdit(ev) {
    setEditForm({ name: ev.name, category: ev.category, type: ev.type, date: ev.date, time: ev.time, venue: ev.venue, house: ev.house, coordinator: ev.coordinator, status: ev.status, desc: ev.desc });
    setEditEvent(ev);
  }
  function handleEditSave()    { setEditEvent(null); showToast(`"${editForm.name}" updated successfully.`); }
  function openConfirm(type, ev) { setConfirmModal({ type, ev }); }
  function handleConfirm() {
    const { type, ev } = confirmModal;
    setConfirmModal(null);
    showToast(type === "cancel" ? `"${ev.name}" has been cancelled.` : `"${ev.name}" marked as completed.`, type === "cancel" ? "warn" : "success");
  }
  function openReschedule(ev) { setRescheduleForm({ date: ev.date, time: ev.time, reason: "" }); setReschedule(ev); }
  function handleRescheduleSave() { setReschedule(null); showToast(`"${reschedule.name}" rescheduled successfully.`); }

  // ── Chips ────────────────────────────────────────────────────────────────────
  const chips = [
    filterStatus   !== "all"       && { label: `Status: ${filterStatus}`,   onRemove: () => { setFilterStatus("all");       setCurrentPage(1); } },
    filterCategory !== "all"       && { label: `Cat: ${filterCategory}`,    onRemove: () => { setFilterCategory("all");     setCurrentPage(1); } },
    filterHouse    !== "All"       && { label: `House: ${filterHouse}`,     onRemove: () => { setFilterHouse("All");        setCurrentPage(1); } },
    filterType     !== "All Types" && { label: `Type: ${filterType}`,       onRemove: () => { setFilterType("All Types");   setCurrentPage(1); } },
    filterCoord    !== "All"       && { label: `Coord: ${filterCoord.split(" ").slice(-1)[0]}`, onRemove: () => { setFilterCoord("All"); setCurrentPage(1); } },
    filterDateFrom                 && { label: `From: ${fmtDate(filterDateFrom)}`, onRemove: () => { setFilterDateFrom(""); setCurrentPage(1); } },
    filterDateTo                   && { label: `To: ${fmtDate(filterDateTo)}`,     onRemove: () => { setFilterDateTo("");   setCurrentPage(1); } },
  ].filter(Boolean);

  const TABS = [
    { id: "events",      label: "Events",          icon: "📋", count: MOCK_EVENTS.length     },
    { id: "houses",      label: "House Tracking",  icon: "🏠", count: MOCK_HOUSES.length     },
    { id: "activities",  label: "Activities",      icon: "🗓️", count: MOCK_ACTIVITIES.length },
    { id: "timeline",    label: "Timeline",         icon: "⏱️", count: null                   },
    { id: "gallery",     label: "Gallery",          icon: "🖼️", count: GALLERY_ITEMS.length   },
    { id: "performance", label: "Performance",     icon: "📊", count: null                   },
  ];

  const activityCls = t => `em-activity-card em-activity-card--${({ assembly:"assembly", cca:"cca", club:"club", workshop:"workshop", special:"special" }[t] || "special")}`;
  const BANNER_BG    = { sports:"#dbeafe", academics:"#d1fae5", cultural:"#ede9fe", annual:"#fef3c7", science:"#d1fae5", arts:"#fce7f3", workshop:"#fef9c3", assembly:"#f3f4f6", cca:"#dbeafe" };
  const BANNER_EMOJI = { sports:"🏅", academics:"📚", cultural:"🎭", annual:"🎓", science:"🔬", arts:"🎨", workshop:"🛠️", assembly:"🎙️", cca:"💃" };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="em-root" data-testid="school-page-eme-manage-events">

      <ManagementPageHeader
        breadcrumbs={[
          { label: "Home" },
          { label: "Events" },
          { label: "Manage Events" },
        ]}
        title="Manage Events"
        subtitle="Monitor, track, and control all school events and activities"
        actions={(
          <>
            <button className="em-btn em-btn--ghost" data-testid="school-button-eme-view-calendar">📅 View Calendar</button>
            <button className="em-btn em-btn--ghost" data-testid="school-button-eme-archive">🗄️ Archive Events</button>
            <button className="em-btn em-btn--primary" data-testid="school-button-eme-export">⬇️ Export Events</button>
          </>
        )}
      />

      {/* ── Metric Cards ── */}
      <div className="em-metrics" data-testid="school-metrics-eme-root">
        <div className="em-metric-card em-metric-card--success" data-testid="school-metric-eme-active">
          <div className="em-metric-card__icon">🔴</div>
          <div className="em-metric-card__body"><div className="em-metric-card__value">{metrics.active}</div><div className="em-metric-card__label">Active Events</div></div>
        </div>
        <div className="em-metric-card em-metric-card--info" data-testid="school-metric-eme-upcoming">
          <div className="em-metric-card__icon">📅</div>
          <div className="em-metric-card__body"><div className="em-metric-card__value">{metrics.upcoming}</div><div className="em-metric-card__label">Upcoming Events</div></div>
        </div>
        <div className="em-metric-card em-metric-card--neutral" data-testid="school-metric-eme-completed">
          <div className="em-metric-card__icon">✅</div>
          <div className="em-metric-card__body"><div className="em-metric-card__value">{metrics.completed}</div><div className="em-metric-card__label">Completed Events</div></div>
        </div>
        <div className="em-metric-card em-metric-card--danger" data-testid="school-metric-eme-cancelled">
          <div className="em-metric-card__icon">🚫</div>
          <div className="em-metric-card__body"><div className="em-metric-card__value">{metrics.cancelled}</div><div className="em-metric-card__label">Cancelled Events</div></div>
        </div>
        <div className="em-metric-card em-metric-card--primary" data-testid="school-metric-eme-house">
          <div className="em-metric-card__icon">🏠</div>
          <div className="em-metric-card__body"><div className="em-metric-card__value">{metrics.house}</div><div className="em-metric-card__label">House Competitions</div></div>
        </div>
        <div className="em-metric-card em-metric-card--teal" data-testid="school-metric-eme-ongoing">
          <div className="em-metric-card__icon">⚡</div>
          <div className="em-metric-card__body"><div className="em-metric-card__value">{metrics.ongoing}</div><div className="em-metric-card__label">Ongoing Activities</div></div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="em-tabs" role="tablist" data-testid="school-tabs-eme-root">
        {TABS.map(t => (
          <button key={t.id} role="tab" aria-selected={activeTab === t.id}
            className={`em-tab${activeTab === t.id ? " em-tab--active" : ""}`}
            onClick={() => setActiveTab(t.id)}
            data-testid={`school-tab-eme-${t.id}`}>
            {t.icon} {t.label}
            {t.count != null && <span className="em-tab__count">{t.count}</span>}
          </button>
        ))}
      </div>

      {/* ════ TAB: EVENTS ════ */}
      {activeTab === "events" && (
        <>
          {/* Toolbar */}
          <div className="em-toolbar" data-testid="school-toolbar-eme-events">
            <div className="em-search" data-testid="school-search-eme-events">
              <span className="em-search__icon">🔍</span>
              <input type="text" value={searchQuery} placeholder="Search events, venues, coordinators..."
                onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                data-testid="school-field-eme-search" />
              {searchQuery && (
                <button className="em-search__clear" onClick={() => { setSearchQuery(""); setCurrentPage(1); }} data-testid="school-button-eme-search-clear">✕</button>
              )}
            </div>
            <div className={`em-toolbar__filters${showFilters ? "" : " em-toolbar__filters--hidden"}`}>
              <select className="em-filter-select" value={filterStatus}   onChange={e => { setFilterStatus(e.target.value);   setCurrentPage(1); }} data-testid="school-dropdown-eme-status">
                {STATUS_LIST.map(s    => <option key={s} value={s}>{s === "all" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
              <select className="em-filter-select" value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setCurrentPage(1); }} data-testid="school-dropdown-eme-category">
                {CATEGORY_LIST.map(c  => <option key={c} value={c}>{c === "all" ? "All Categories" : c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
              <select className="em-filter-select" value={filterHouse}    onChange={e => { setFilterHouse(e.target.value);    setCurrentPage(1); }} data-testid="school-dropdown-eme-house">
                {HOUSE_LIST.map(h     => <option key={h} value={h}>{h === "All" ? "All Houses" : `${h} House`}</option>)}
              </select>
              <select className="em-filter-select" value={filterType}     onChange={e => { setFilterType(e.target.value);     setCurrentPage(1); }} data-testid="school-dropdown-eme-type">
                {TYPE_LIST.map(t      => <option key={t} value={t}>{t}</option>)}
              </select>
              <select className="em-filter-select" value={filterCoord}    onChange={e => { setFilterCoord(e.target.value);    setCurrentPage(1); }} data-testid="school-dropdown-eme-coordinator">
                {COORDINATORS.map(c   => <option key={c} value={c}>{c === "All" ? "All Coordinators" : c}</option>)}
              </select>
              <input type="date" className="em-filter-date" value={filterDateFrom} onChange={e => { setFilterDateFrom(e.target.value); setCurrentPage(1); }} title="From date" data-testid="school-field-eme-date-from" />
              <input type="date" className="em-filter-date" value={filterDateTo}   onChange={e => { setFilterDateTo(e.target.value);   setCurrentPage(1); }} title="To date"   data-testid="school-field-eme-date-to"   />
            </div>
            <div className="em-toolbar__right">
              <button className="em-toolbar__filters-toggle" onClick={() => setShowFilters(v => !v)} data-testid="school-button-eme-toggle-filters">
                🔧 {showFilters ? "Hide Filters" : "Filters"}
              </button>
              {hasActiveFilters && (
                <button className="em-clear-btn" onClick={clearFilters} data-testid="school-button-eme-clear-filters">✕ Clear</button>
              )}
              <div className="em-view-toggle" data-testid="school-toggle-eme-view-mode">
                <button className={viewMode === "table" ? "active" : ""} onClick={() => setViewMode("table")} data-testid="school-button-eme-view-table" title="Table view">☰</button>
                <button className={viewMode === "cards" ? "active" : ""} onClick={() => setViewMode("cards")} data-testid="school-button-eme-view-cards" title="Card view">⊞</button>
              </div>
            </div>
          </div>

          {/* Results bar */}
          {(hasActiveFilters || filtered.length !== MOCK_EVENTS.length) && (
            <div className="em-results-bar" data-testid="school-results-eme-bar">
              <span className="em-results-bar__count">{filtered.length} event{filtered.length !== 1 ? "s" : ""} found</span>
              <div className="em-results-bar__chips">
                {chips.map((c, i) => (
                  <span key={i} className="em-chip" data-testid={`school-chip-eme-filter-${i}`}>
                    {c.label}
                    <button className="em-chip__remove" onClick={c.onRemove} aria-label={`Remove ${c.label}`}>✕</button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Table view */}
          {viewMode === "table" && (
            <div className="em-table-wrap" data-testid="school-table-eme-events">
              <div className="em-table-scroll">
                <table className="em-table">
                  <thead>
                    <tr>
                      <th>Event Name</th><th>Category</th><th>Type</th><th>Date</th>
                      <th>Venue</th><th>House</th><th>Coordinator</th><th>Status</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.length === 0 ? (
                      <tr className="em-table__empty"><td colSpan={9}>
                        <div className="em-empty"><div className="em-empty__icon">📭</div><div className="em-empty__title">No events found</div><div className="em-empty__sub">Adjust your search or filters</div></div>
                      </td></tr>
                    ) : paginated.map(ev => (
                      <tr key={ev.id} data-testid={`school-row-eme-event-${ev.id}`}>
                        <td>
                          <div className="em-cell-title">{ev.name}</div>
                          <div className="em-cell-sub">👥 {ev.participants} participants</div>
                        </td>
                        <td><span className={catBadge(ev.category)}>{ev.category.charAt(0).toUpperCase() + ev.category.slice(1)}</span></td>
                        <td><span className="em-type-badge">{ev.type}</span></td>
                        <td>
                          <div className="em-cell-date">
                            <span className="em-cell-date__day">{fmtDate(ev.date)}</span>
                            <span className="em-cell-date__time">{ev.time}</span>
                          </div>
                        </td>
                        <td className="em-cell-muted">{ev.venue}</td>
                        <td><span className={houseBadge(ev.house)}>{ev.house === "All" ? "All Houses" : `${ev.house} House`}</span></td>
                        <td>
                          <div className="em-cell-coord">
                            <span className="em-cell-avatar" style={{ background: avatarColor(ev.coordinator) }}>{initials(ev.coordinator)}</span>
                            <span className="em-cell-muted">{ev.coordinator}</span>
                          </div>
                        </td>
                        <td><span className={statusBadge(ev.status)}>{ev.status.charAt(0).toUpperCase() + ev.status.slice(1)}</span></td>
                        <td>
                          <div className="em-actions">
                            <button className="em-action-btn em-action-btn--info"    title="View Event"      onClick={() => setDetailEvent(ev)}       data-testid={`school-button-eme-view-${ev.id}`}>👁️</button>
                            <button className="em-action-btn"                        title="Edit Event"      onClick={() => openEdit(ev)}              data-testid={`school-button-eme-edit-${ev.id}`}>✏️</button>
                            <button className="em-action-btn em-action-btn--warning" title="Reschedule"      onClick={() => openReschedule(ev)}        data-testid={`school-button-eme-reschedule-${ev.id}`}>📆</button>
                            <button className="em-action-btn em-action-btn--success" title="Mark Completed"  onClick={() => openConfirm("complete", ev)} data-testid={`school-button-eme-complete-${ev.id}`}>✅</button>
                            <button className="em-action-btn em-action-btn--danger"  title="Cancel Event"    onClick={() => openConfirm("cancel", ev)}  data-testid={`school-button-eme-cancel-${ev.id}`}>🚫</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="em-pagination" data-testid="school-pagination-eme-events">
                  <button className="em-page-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} data-testid="school-button-eme-page-prev">‹</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} className={`em-page-btn${p === currentPage ? " em-page-btn--active" : ""}`} onClick={() => setCurrentPage(p)} data-testid={`school-button-eme-page-${p}`}>{p}</button>
                  ))}
                  <button className="em-page-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} data-testid="school-button-eme-page-next">›</button>
                </div>
              )}
            </div>
          )}

          {/* Cards view */}
          {viewMode === "cards" && (
            <div className="em-event-cards" data-testid="school-cards-eme-events">
              {paginated.length === 0 ? (
                <div className="em-empty" style={{ gridColumn: "1 / -1" }}>
                  <div className="em-empty__icon">📭</div>
                  <div className="em-empty__title">No events found</div>
                  <div className="em-empty__sub">Adjust your filters</div>
                </div>
              ) : paginated.map(ev => (
                <div key={ev.id} className="em-event-card" data-testid={`school-card-eme-event-${ev.id}`}>
                  <div className="em-event-card__banner" style={{ background: BANNER_BG[ev.category] || "#f3f4f6" }}>
                    <span style={{ fontSize: "2.5rem" }}>{BANNER_EMOJI[ev.category] || "📋"}</span>
                    <span className="em-event-card__status-dot"><span className={statusBadge(ev.status)}>{ev.status.charAt(0).toUpperCase() + ev.status.slice(1)}</span></span>
                  </div>
                  <div className="em-event-card__body">
                    <div className="em-event-card__name">{ev.name}</div>
                    <div className="em-event-card__meta">
                      <span>📅 {fmtDate(ev.date)}</span>
                      <span>📍 {ev.venue}</span>
                    </div>
                    <div className="em-event-card__badges">
                      <span className={catBadge(ev.category)}>{ev.category.charAt(0).toUpperCase() + ev.category.slice(1)}</span>
                      <span className={houseBadge(ev.house)}>{ev.house === "All" ? "All Houses" : ev.house}</span>
                    </div>
                  </div>
                  <div className="em-event-card__footer">
                    <button className="em-btn em-btn--ghost em-btn--sm" onClick={() => setDetailEvent(ev)} data-testid={`school-button-eme-card-view-${ev.id}`}>👁️ View</button>
                    <button className="em-btn em-btn--ghost em-btn--sm" onClick={() => openEdit(ev)}       data-testid={`school-button-eme-card-edit-${ev.id}`}>✏️ Edit</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ════ TAB: HOUSES ════ */}
      {activeTab === "houses" && (
        <div className="em-house-grid" data-testid="school-section-eme-houses">
          {MOCK_HOUSES.map(house => (
            <div key={house.id} className={houseCls(house.name.split(" ")[0])} data-testid={`school-card-eme-house-${house.id}`}>
              <div className="em-house-card__header">
                <span className="em-house-card__icon">{house.icon}</span>
                <div>
                  <div className="em-house-card__name">{house.name}</div>
                  <div style={{ fontSize: ".7rem", color: "#6b7280" }}>{house.members} members</div>
                </div>
                <div className="em-house-card__rank" style={{ background: house.color }}>{house.rank}</div>
              </div>
              <div className="em-house-card__stats">
                <div className="em-house-card__stat"><div className="em-house-card__stat-val">{house.events}</div><div className="em-house-card__stat-lbl">Events</div></div>
                <div className="em-house-card__stat"><div className="em-house-card__stat-val">{house.wins}</div><div className="em-house-card__stat-lbl">Wins</div></div>
                <div className="em-house-card__stat"><div className="em-house-card__stat-val">{house.points}</div><div className="em-house-card__stat-lbl">Points</div></div>
              </div>
              <div className="em-house-card__points">
                <div className="em-house-card__points-header">
                  <span>Points Progress</span>
                  <span className="em-house-card__points-total">{house.points}</span>
                </div>
                <div className="em-house-card__points-track">
                  <div className="em-house-card__points-fill" style={{ width: `${(house.points / 480) * 100}%`, background: house.color }} />
                </div>
              </div>
              <div className="em-house-card__events">
                <div style={{ fontSize: ".7rem", fontWeight: 700, color: "#6b7280", marginBottom: ".25rem", textTransform: "uppercase", letterSpacing: ".04em" }}>Event Involvement</div>
                {house.involved.map((ev, i) => (
                  <div key={i} className="em-house-card__event-row" data-testid={`school-row-eme-house-event-${house.id}-${i}`}>
                    <span className="em-house-card__event-row-name">{ev.name}</span>
                    <span className={statusBadge(ev.status)}>{ev.status.charAt(0).toUpperCase() + ev.status.slice(1)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ════ TAB: ACTIVITIES ════ */}
      {activeTab === "activities" && (
        <>
          <div className="em-panel" data-testid="school-section-eme-activities">
            <div className="em-panel__header">
              <div className="em-panel__header-title">🗓️ Weekly / Daily Activities</div>
              <button className="em-btn em-btn--primary em-btn--sm" data-testid="school-button-eme-add-activity">+ Add Activity</button>
            </div>
          </div>
          <div className="em-activity-grid" data-testid="school-grid-eme-activities">
            {MOCK_ACTIVITIES.map(act => (
              <div key={act.id} className={activityCls(act.type)} data-testid={`school-card-eme-activity-${act.id}`}>
                <div className="em-activity-card__top">
                  <div style={{ fontSize: "1.5rem", flexShrink: 0 }}>{act.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div className="em-activity-card__title">{act.title}</div>
                    <div className="em-activity-card__time">⏰ {act.time}</div>
                    <div className="em-activity-card__venue">📍 {act.venue}</div>
                  </div>
                  <span className={statusBadge(act.status)}>{act.status.charAt(0).toUpperCase() + act.status.slice(1)}</span>
                </div>
                <div className="em-activity-card__footer">
                  <span className="em-cat-badge em-cat-badge--assembly">📅 {act.days}</span>
                  <span className="em-cat-badge em-cat-badge--academics">👥 {act.participants}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ════ TAB: TIMELINE ════ */}
      {activeTab === "timeline" && (
        <div className="em-timeline" data-testid="school-section-eme-timeline">
          <div className="em-timeline__header">
            <div className="em-timeline__header-title">⏱️ Event Timeline</div>
            <div style={{ display: "flex", gap: ".5rem" }}>
              {["ongoing", "active", "upcoming", "completed"].map(s => (
                <span key={s} className={statusBadge(s)} data-testid={`school-legend-eme-${s}`}>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
              ))}
            </div>
          </div>
          {[...MOCK_EVENTS].sort((a, b) => a.date.localeCompare(b.date)).map(ev => (
            <div key={ev.id} className="em-timeline-item" data-testid={`school-timeline-eme-item-${ev.id}`}>
              <div className={`em-timeline-item__dot em-timeline-item__dot--${ev.status}`} />
              <div className="em-timeline-item__content">
                <div className="em-timeline-item__name">{ev.name}</div>
                <div className="em-timeline-item__meta">
                  <span>📍 {ev.venue}</span>
                  <span>🏠 {ev.house === "All" ? "All Houses" : `${ev.house} House`}</span>
                  <span>👤 {ev.coordinator}</span>
                  <span className={catBadge(ev.category)}>{ev.category.charAt(0).toUpperCase() + ev.category.slice(1)}</span>
                </div>
              </div>
              <div className="em-timeline-item__date">
                <div className="em-timeline-item__day">{fmtDate(ev.date)}</div>
                <div className="em-timeline-item__time">{ev.time}</div>
                <span className={statusBadge(ev.status)} style={{ marginTop: ".3rem" }}>{ev.status.charAt(0).toUpperCase() + ev.status.slice(1)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ════ TAB: GALLERY ════ */}
      {activeTab === "gallery" && (
        <div data-testid="school-section-eme-gallery">
          <div className="em-gallery-header">
            <div className="em-gallery-header__title">🖼️ Event Gallery</div>
            <div style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
              <span className="em-gallery-header__count">{GALLERY_ITEMS.length} photos</span>
              <button className="em-btn em-btn--primary em-btn--sm" data-testid="school-button-eme-upload-photo">📤 Upload Photos</button>
            </div>
          </div>
          <div className="em-gallery-grid">
            {GALLERY_ITEMS.map(item => (
              <div key={item.id} className="em-gallery-item" onClick={() => setGalleryItem(item)} data-testid={`school-gallery-eme-item-${item.id}`}>
                <div className="em-gallery-item__thumb" style={{ background: item.bg }}>
                  <span style={{ fontSize: "3rem" }}>{item.emoji}</span>
                </div>
                {item.featured && <span className="em-gallery-item__featured-badge">⭐ Featured</span>}
                <div className="em-gallery-item__overlay">
                  <div className="em-gallery-item__label">{item.label}</div>
                  <div className="em-gallery-item__event">{item.event}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="em-upload-zone" style={{ marginTop: "1rem" }} data-testid="school-zone-eme-upload">
            <div className="em-upload-zone__icon">📤</div>
            <div className="em-upload-zone__title">Drop photos here or click to upload</div>
            <div className="em-upload-zone__sub">Supports JPEG, PNG, WEBP · Max 10 MB per file</div>
          </div>
        </div>
      )}

      {/* ════ TAB: PERFORMANCE ════ */}
      {activeTab === "performance" && (
        <div className="em-perf-grid" data-testid="school-section-eme-performance">
          <div className="em-perf-card">
            <div className="em-perf-card__header">📊 Attendance Rate by Event</div>
            <div className="em-perf-card__body">
              {MOCK_EVENTS.filter(e => e.attendees > 0).map(ev => (
                <div key={ev.id} className="em-bar-row" data-testid={`school-bar-eme-attendance-${ev.id}`}>
                  <div className="em-bar-row__label" title={ev.name}>{ev.name}</div>
                  <div className="em-bar-row__track"><div className="em-bar-row__fill" style={{ width: `${Math.round((ev.attendees / ev.participants) * 100)}%`, background: "#16a34a" }} /></div>
                  <div className="em-bar-row__val">{Math.round((ev.attendees / ev.participants) * 100)}%</div>
                </div>
              ))}
            </div>
          </div>
          <div className="em-perf-card">
            <div className="em-perf-card__header">👥 Participation by Category</div>
            <div className="em-perf-card__body">
              {(() => {
                const bycat = {};
                MOCK_EVENTS.forEach(e => { bycat[e.category] = (bycat[e.category] || 0) + e.participants; });
                const maxVal = Math.max(...Object.values(bycat));
                const cols   = { sports:"#2563eb", academics:"#16a34a", cultural:"#7c3aed", annual:"#c9a962", science:"#0891b2", arts:"#dc2626", workshop:"#d97706", assembly:"#6b7280", cca:"#2563eb" };
                return Object.entries(bycat).sort((a, b) => b[1] - a[1]).map(([cat, val]) => (
                  <div key={cat} className="em-bar-row" data-testid={`school-bar-eme-cat-${cat}`}>
                    <div className="em-bar-row__label">{cat.charAt(0).toUpperCase() + cat.slice(1)}</div>
                    <div className="em-bar-row__track"><div className="em-bar-row__fill" style={{ width: `${(val / maxVal) * 100}%`, background: cols[cat] || "#c9a962" }} /></div>
                    <div className="em-bar-row__val">{val}</div>
                  </div>
                ));
              })()}
            </div>
          </div>
          <div className="em-perf-card">
            <div className="em-perf-card__header">✅ Event Completion Status</div>
            <div className="em-perf-card__body">
              {STATUS_LIST.filter(s => s !== "all").map(s => {
                const count  = MOCK_EVENTS.filter(e => e.status === s).length;
                const maxVal = Math.max(...STATUS_LIST.filter(x => x !== "all").map(x => MOCK_EVENTS.filter(e => e.status === x).length));
                const cols   = { active:"#16a34a", upcoming:"#2563eb", completed:"#6b7280", cancelled:"#dc2626", ongoing:"#c9a962" };
                return (
                  <div key={s} className="em-bar-row" data-testid={`school-bar-eme-status-${s}`}>
                    <div className="em-bar-row__label">{s.charAt(0).toUpperCase() + s.slice(1)}</div>
                    <div className="em-bar-row__track"><div className="em-bar-row__fill" style={{ width: maxVal ? `${(count / maxVal) * 100}%` : "0%", background: cols[s] || "#c9a962" }} /></div>
                    <div className="em-bar-row__val">{count}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="em-perf-card">
            <div className="em-perf-card__header">🏆 House Points Standings</div>
            <div className="em-perf-card__body">
              {[...MOCK_HOUSES].sort((a, b) => b.points - a.points).map(h => {
                const hcols = { blue:"#2563eb", red:"#dc2626", yellow:"#d97706", green:"#16a34a" };
                return (
                  <div key={h.id} className="em-bar-row" data-testid={`school-bar-eme-house-${h.id}`}>
                    <div className="em-bar-row__label">{h.icon} {h.name.split(" ")[0]}</div>
                    <div className="em-bar-row__track"><div className="em-bar-row__fill" style={{ width: `${(h.points / 480) * 100}%`, background: hcols[h.id] }} /></div>
                    <div className="em-bar-row__val">{h.points}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ════ MODAL: VIEW DETAIL ════ */}
      {detailEvent && (
        <div className="em-modal-backdrop" onClick={() => setDetailEvent(null)} data-testid="school-modal-eme-detail">
          <div className="em-modal em-modal--lg" onClick={e => e.stopPropagation()}>
            <div className="em-modal__header">
              <span className="em-modal__title">🗂️ Event Details</span>
              <button className="em-modal__close" onClick={() => setDetailEvent(null)} data-testid="school-button-eme-detail-close">✕</button>
            </div>
            <div className="em-modal__body">
              <div className="em-detail">
                <div className="em-detail__hero">
                  <div className="em-detail__title">{detailEvent.name}</div>
                  <div className="em-detail__badges">
                    <span className={statusBadge(detailEvent.status)}>{detailEvent.status.charAt(0).toUpperCase() + detailEvent.status.slice(1)}</span>
                    <span className={catBadge(detailEvent.category)}>{detailEvent.category.charAt(0).toUpperCase() + detailEvent.category.slice(1)}</span>
                    <span className={houseBadge(detailEvent.house)}>{detailEvent.house === "All" ? "All Houses" : `${detailEvent.house} House`}</span>
                    <span className="em-type-badge">{detailEvent.type}</span>
                  </div>
                  <div className="em-detail__meta">
                    <span>📅 {fmtDate(detailEvent.date)} at {detailEvent.time}</span>
                    <span>📍 {detailEvent.venue}</span>
                    <span>👤 {detailEvent.coordinator}</span>
                  </div>
                </div>
                <div className="em-detail__section">Event Information</div>
                <div className="em-detail__grid">
                  <div className="em-detail__field"><div className="em-detail__field-label">Category</div><div className="em-detail__field-value">{detailEvent.category.charAt(0).toUpperCase() + detailEvent.category.slice(1)}</div></div>
                  <div className="em-detail__field"><div className="em-detail__field-label">Event Type</div><div className="em-detail__field-value">{detailEvent.type}</div></div>
                  <div className="em-detail__field"><div className="em-detail__field-label">Date & Time</div><div className="em-detail__field-value">{fmtDate(detailEvent.date)}, {detailEvent.time}</div></div>
                  <div className="em-detail__field"><div className="em-detail__field-label">Venue</div><div className="em-detail__field-value">{detailEvent.venue}</div></div>
                  <div className="em-detail__field"><div className="em-detail__field-label">Assigned House</div><div className="em-detail__field-value">{detailEvent.house === "All" ? "All Houses" : `${detailEvent.house} House`}</div></div>
                  <div className="em-detail__field"><div className="em-detail__field-label">Coordinator</div><div className="em-detail__field-value">{detailEvent.coordinator}</div></div>
                  <div className="em-detail__field"><div className="em-detail__field-label">Participants</div><div className="em-detail__field-value">👥 {detailEvent.participants}</div></div>
                  <div className="em-detail__field"><div className="em-detail__field-label">Attendees</div><div className="em-detail__field-value">{detailEvent.attendees > 0 ? `✅ ${detailEvent.attendees}` : "—"}</div></div>
                  <div className="em-detail__field"><div className="em-detail__field-label">Gallery Photos</div><div className="em-detail__field-value">🖼️ {detailEvent.galleryCount}</div></div>
                  <div className="em-detail__field"><div className="em-detail__field-label">Status</div><div className="em-detail__field-value"><span className={statusBadge(detailEvent.status)}>{detailEvent.status.charAt(0).toUpperCase() + detailEvent.status.slice(1)}</span></div></div>
                </div>
                <div className="em-detail__section">Description</div>
                <div className="em-detail__desc">{detailEvent.desc}</div>
                {detailEvent.tags.length > 0 && (
                  <>
                    <div className="em-detail__section">Tags</div>
                    <div style={{ display: "flex", gap: ".375rem", flexWrap: "wrap" }}>
                      {detailEvent.tags.map(tag => <span key={tag} className="em-chip" data-testid={`school-tag-eme-detail-${tag}`}>{tag}</span>)}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="em-modal__footer">
              <button className="em-btn em-btn--ghost"   onClick={() => setDetailEvent(null)} data-testid="school-button-eme-detail-cancel">Close</button>
              <button className="em-btn em-btn--primary" onClick={() => { setDetailEvent(null); openEdit(detailEvent); }} data-testid="school-button-eme-detail-edit">✏️ Edit Event</button>
            </div>
          </div>
        </div>
      )}

      {/* ════ MODAL: EDIT ════ */}
      {editEvent && (
        <div className="em-modal-backdrop" onClick={() => setEditEvent(null)} data-testid="school-modal-eme-edit">
          <div className="em-modal em-modal--lg" onClick={e => e.stopPropagation()}>
            <div className="em-modal__header">
              <span className="em-modal__title">✏️ Edit Event</span>
              <button className="em-modal__close" onClick={() => setEditEvent(null)} data-testid="school-button-eme-edit-close">✕</button>
            </div>
            <div className="em-modal__body">
              <div className="em-form">
                <div className="em-form-section">Basic Information</div>
                <div className="em-field">
                  <label className="em-field__label">Event Name *</label>
                  <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} placeholder="Event name" data-testid="school-field-eme-edit-name" />
                </div>
                <div className="em-form-grid">
                  <div className="em-field">
                    <label className="em-field__label">Category</label>
                    <select value={editForm.category} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))} data-testid="school-dropdown-eme-edit-category">
                      {CATEGORY_LIST.filter(c => c !== "all").map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                    </select>
                  </div>
                  <div className="em-field">
                    <label className="em-field__label">Event Type</label>
                    <select value={editForm.type} onChange={e => setEditForm(f => ({ ...f, type: e.target.value }))} data-testid="school-dropdown-eme-edit-type">
                      {TYPE_LIST.filter(t => t !== "All Types").map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="em-field">
                    <label className="em-field__label">Date</label>
                    <input type="date" value={editForm.date} onChange={e => setEditForm(f => ({ ...f, date: e.target.value }))} data-testid="school-field-eme-edit-date" />
                  </div>
                  <div className="em-field">
                    <label className="em-field__label">Time</label>
                    <input value={editForm.time} onChange={e => setEditForm(f => ({ ...f, time: e.target.value }))} placeholder="09:00 AM" data-testid="school-field-eme-edit-time" />
                  </div>
                  <div className="em-field">
                    <label className="em-field__label">Venue</label>
                    <input value={editForm.venue} onChange={e => setEditForm(f => ({ ...f, venue: e.target.value }))} placeholder="Venue" data-testid="school-field-eme-edit-venue" />
                  </div>
                  <div className="em-field">
                    <label className="em-field__label">Assigned House</label>
                    <select value={editForm.house} onChange={e => setEditForm(f => ({ ...f, house: e.target.value }))} data-testid="school-dropdown-eme-edit-house">
                      {HOUSE_LIST.map(h => <option key={h} value={h}>{h === "All" ? "All Houses" : `${h} House`}</option>)}
                    </select>
                  </div>
                  <div className="em-field">
                    <label className="em-field__label">Coordinator</label>
                    <select value={editForm.coordinator} onChange={e => setEditForm(f => ({ ...f, coordinator: e.target.value }))} data-testid="school-dropdown-eme-edit-coordinator">
                      {COORDINATORS.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="em-field">
                    <label className="em-field__label">Status</label>
                    <select value={editForm.status} onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))} data-testid="school-dropdown-eme-edit-status">
                      {STATUS_LIST.filter(s => s !== "all").map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </div>
                </div>
                <div className="em-field">
                  <label className="em-field__label">Description</label>
                  <textarea rows={3} value={editForm.desc} onChange={e => setEditForm(f => ({ ...f, desc: e.target.value }))} placeholder="Event description..." data-testid="school-field-eme-edit-desc" />
                </div>
              </div>
            </div>
            <div className="em-modal__footer">
              <button className="em-btn em-btn--ghost"   onClick={() => setEditEvent(null)} data-testid="school-button-eme-edit-cancel">Cancel</button>
              <button className="em-btn em-btn--primary" onClick={handleEditSave}           data-testid="school-button-eme-edit-save">💾 Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ════ MODAL: RESCHEDULE ════ */}
      {reschedule && (
        <div className="em-modal-backdrop" onClick={() => setReschedule(null)} data-testid="school-modal-eme-reschedule">
          <div className="em-modal em-modal--sm" onClick={e => e.stopPropagation()}>
            <div className="em-modal__header">
              <span className="em-modal__title">📆 Reschedule Event</span>
              <button className="em-modal__close" onClick={() => setReschedule(null)} data-testid="school-button-eme-reschedule-close">✕</button>
            </div>
            <div className="em-modal__body">
              <div className="em-form">
                <div style={{ fontSize: ".8125rem", color: "#6b7280", marginBottom: ".25rem" }}>
                  Rescheduling: <strong style={{ color: "var(--em-text)" }}>{reschedule.name}</strong>
                </div>
                <div className="em-form-grid">
                  <div className="em-field">
                    <label className="em-field__label">New Date *</label>
                    <input type="date" value={rescheduleForm.date} onChange={e => setRescheduleForm(f => ({ ...f, date: e.target.value }))} data-testid="school-field-eme-reschedule-date" />
                  </div>
                  <div className="em-field">
                    <label className="em-field__label">New Time *</label>
                    <input value={rescheduleForm.time} onChange={e => setRescheduleForm(f => ({ ...f, time: e.target.value }))} placeholder="09:00 AM" data-testid="school-field-eme-reschedule-time" />
                  </div>
                </div>
                <div className="em-field">
                  <label className="em-field__label">Reason for Rescheduling</label>
                  <textarea rows={3} value={rescheduleForm.reason} onChange={e => setRescheduleForm(f => ({ ...f, reason: e.target.value }))} placeholder="Explain the reason..." data-testid="school-field-eme-reschedule-reason" />
                </div>
              </div>
            </div>
            <div className="em-modal__footer">
              <button className="em-btn em-btn--ghost"   onClick={() => setReschedule(null)} data-testid="school-button-eme-reschedule-cancel">Cancel</button>
              <button className="em-btn em-btn--warning" onClick={handleRescheduleSave}      data-testid="school-button-eme-reschedule-save">📆 Reschedule</button>
            </div>
          </div>
        </div>
      )}

      {/* ════ MODAL: CONFIRM ════ */}
      {confirmModal && (
        <div className="em-modal-backdrop" onClick={() => setConfirmModal(null)} data-testid="school-modal-eme-confirm">
          <div className="em-modal em-modal--sm" onClick={e => e.stopPropagation()}>
            <div className="em-modal__header">
              <span className="em-modal__title">{confirmModal.type === "cancel" ? "🚫 Cancel Event" : "✅ Mark Completed"}</span>
              <button className="em-modal__close" onClick={() => setConfirmModal(null)} data-testid="school-button-eme-confirm-close">✕</button>
            </div>
            <div className="em-modal__body">
              <div className="em-confirm">
                <div className="em-confirm__icon">{confirmModal.type === "cancel" ? "🚫" : "✅"}</div>
                <div className="em-confirm__title">{confirmModal.type === "cancel" ? "Cancel this event?" : "Mark as completed?"}</div>
                <p className="em-confirm__msg">
                  You are about to <strong>{confirmModal.type === "cancel" ? "cancel" : "mark as completed"}</strong>:{" "}
                  <strong>"{confirmModal.ev.name}"</strong>.
                </p>
                {confirmModal.type === "cancel" && <p className="em-confirm__warn">⚠️ This will notify all registered participants.</p>}
              </div>
            </div>
            <div className="em-modal__footer">
              <button className="em-btn em-btn--ghost" onClick={() => setConfirmModal(null)} data-testid="school-button-eme-confirm-back">No, Go Back</button>
              <button className={`em-btn ${confirmModal.type === "cancel" ? "em-btn--danger" : "em-btn--success"}`} onClick={handleConfirm} data-testid="school-button-eme-confirm-proceed">
                {confirmModal.type === "cancel" ? "🚫 Yes, Cancel" : "✅ Yes, Complete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════ MODAL: GALLERY PREVIEW ════ */}
      {galleryItem && (
        <div className="em-modal-backdrop" onClick={() => setGalleryItem(null)} data-testid="school-modal-eme-gallery-preview">
          <div className="em-modal em-modal--sm" onClick={e => e.stopPropagation()}>
            <div className="em-modal__header">
              <span className="em-modal__title">🖼️ Photo Preview</span>
              <button className="em-modal__close" onClick={() => setGalleryItem(null)} data-testid="school-button-eme-gallery-close">✕</button>
            </div>
            <div className="em-modal__body">
              <div style={{ display: "flex", flexDirection: "column", gap: ".875rem", alignItems: "center" }}>
                <div style={{ width: "100%", height: 180, borderRadius: ".625rem", display: "flex", alignItems: "center", justifyContent: "center", background: galleryItem.bg, fontSize: "5rem" }}>
                  {galleryItem.emoji}
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--em-text)" }}>{galleryItem.label}</div>
                  <div style={{ fontSize: ".8125rem", color: "#6b7280", marginTop: ".25rem" }}>📋 {galleryItem.event}</div>
                </div>
                {galleryItem.featured && <span className="em-status-badge em-status-badge--active">⭐ Featured Photo</span>}
              </div>
            </div>
            <div className="em-modal__footer">
              <button className="em-btn em-btn--ghost"  onClick={() => setGalleryItem(null)} data-testid="school-button-eme-gallery-cancel">Close</button>
              <button className="em-btn em-btn--danger em-btn--sm" data-testid="school-button-eme-gallery-delete">🗑️ Remove</button>
              <button className="em-btn em-btn--primary" data-testid="school-button-eme-gallery-feature">⭐ {galleryItem.featured ? "Unfeature" : "Set Featured"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className={`em-toast${toast.type === "error" ? " em-toast--error" : toast.type === "warn" ? " em-toast--warn" : toast.type === "info" ? " em-toast--info" : ""}`}
          data-testid="school-toast-eme-notification">
          <span>{toast.type === "success" ? "✅" : toast.type === "warn" ? "⚠️" : toast.type === "error" ? "❌" : "ℹ️"}</span>
          <span>{toast.msg}</span>
          <button className="em-toast__close" onClick={() => setToast(null)} data-testid="school-button-eme-toast-close">✕</button>
        </div>
      )}
    </div>
  );
}
