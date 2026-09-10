import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import "../../Assets/styles/Gallery.scss";
import ManagementPageHeader from "../../app/components/common/ManagementPageHeader";
import {
  GALLERY_METRICS,
  CATEGORIES,
  ALBUMS,
  MEDIA_BY_ALBUM,
  VIDEOS,
  CAMPUS_LIFE,
  ACHIEVEMENTS,
  FACULTY_EVENTS,
  CLUBS,
  TIMELINE_DATA,
  GALLERY_ANALYTICS,
  UPLOAD_LOGS,
} from "./galleryMockData";

// --- Constants ----------------------------------------------------------------

const TABS = [
  { key: "overview", label: "🖼️ Overview" },
  { key: "albums", label: "📁 Albums" },
  { key: "videos", label: "🎬 Videos" },
  { key: "campus-life", label: "🌿 Campus Life" },
  { key: "achievements", label: "🏆 Achievements" },
  { key: "faculty", label: "👨‍🏫 Faculty & Clubs" },
  { key: "timeline", label: "📅 Timeline" },
  { key: "analytics", label: "📊 Analytics" },
  { key: "upload", label: "📤 Upload" },
];

const FEATURED = ALBUMS.filter((a) => a.featured);
const VIS_OPTIONS = [
  "Public",
  "School Only",
  "Parents Only",
  "Specific Class",
  "Specific Department",
];

// --- Shared Primitives --------------------------------------------------------

function ProgressBar({ pct, color = "#c9a962" }) {
  return (
    <div className="cg-progress">
      <div className="cg-progress__track">
        <div
          className="cg-progress__fill"
          style={{ width: `${Math.min(pct, 100)}%`, background: color }}
        />
      </div>
      <span className="cg-progress__label">{pct}%</span>
    </div>
  );
}

function VisBadge({ v }) {
  const key = (v || "").toLowerCase().replace(/\s+/g, "-");
  return <span className={`cg-badge cg-badge--${key}`}>{v}</span>;
}

function BackBtn({ onClick, label = "Back" }) {
  return (
    <button
      className="cg-back-btn"
      onClick={onClick}
      data-testid="school-button-cg-back"
    >
      ← {label}
    </button>
  );
}

// --- Modal Shell --------------------------------------------------------------

function Modal({ title, onClose, children, wide = false }) {
  const ref = useRef();
  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div
      className="cg-modal-backdrop"
      ref={ref}
      onClick={(e) => e.target === ref.current && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`cg-modal${wide ? " cg-modal--wide" : ""}`}
        aria-label={title}
      >
        <div className="cg-modal__header">
          <h3 className="cg-modal__title">{title}</h3>
          <button
            className="cg-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="cg-modal__body">{children}</div>
      </div>
    </div>
  );
}

// --- Upload Modal -------------------------------------------------------------

function UploadModal({ onClose }) {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [form, setForm] = useState({ album: "", visibility: "School Only" });
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));
  return (
    <Modal title="Upload Media" onClose={onClose} wide>
      <div className="cg-modal__form">
        <div
          className={`cg-dropzone${dragging ? " cg-dropzone--active" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            setFiles(Array.from(e.dataTransfer.files));
          }}
          data-testid="school-field-cg-dropzone"
        >
          <span className="cg-dropzone__icon">📤</span>
          <p className="cg-dropzone__label">
            Drag & drop photos, videos or PDFs here
          </p>
          <p className="cg-dropzone__sub">
            JPG, PNG, MP4, MOV, PDF · Max 500 MB per file
          </p>
          {files.length > 0 && (
            <p className="cg-dropzone__count">
              ✓ {files.length} file(s) selected
            </p>
          )}
        </div>
        <div className="cg-form-row">
          <div className="cg-form-col">
            <label className="cg-label">Album</label>
            <select
              className="cg-input"
              value={form.album}
              onChange={set("album")}
              data-testid="school-dropdown-cg-upload-album"
            >
              <option value="">Select album�</option>
              {ALBUMS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title}
                </option>
              ))}
            </select>
          </div>
          <div className="cg-form-col">
            <label className="cg-label">Visibility</label>
            <select
              className="cg-input"
              value={form.visibility}
              onChange={set("visibility")}
              data-testid="school-dropdown-cg-upload-visibility"
            >
              {VIS_OPTIONS.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="cg-modal__actions">
          <button className="cg-btn cg-btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="cg-btn cg-btn--primary"
            data-testid="school-button-cg-upload-submit"
          >
            📤 Upload Media
          </button>
        </div>
      </div>
    </Modal>
  );
}

// --- Create Album Modal -------------------------------------------------------

function CreateAlbumModal({ onClose }) {
  const [form, setForm] = useState({
    title: "",
    category: "",
    date: "",
    visibility: "School Only",
    desc: "",
  });
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));
  return (
    <Modal title="Create Album" onClose={onClose}>
      <div className="cg-modal__form">
        <div className="cg-form-col--full">
          <label className="cg-label">Album Title</label>
          <input
            className="cg-input"
            value={form.title}
            onChange={set("title")}
            placeholder="e.g. Annual Day 2026"
            data-testid="school-field-cg-album-title"
          />
        </div>
        <div className="cg-form-row">
          <div className="cg-form-col">
            <label className="cg-label">Category</label>
            <select
              className="cg-input"
              value={form.category}
              onChange={set("category")}
              data-testid="school-dropdown-cg-album-category"
            >
              <option value="">Select�</option>
              {CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="cg-form-col">
            <label className="cg-label">Event Date</label>
            <input
              type="date"
              className="cg-input"
              value={form.date}
              onChange={set("date")}
              data-testid="school-field-cg-album-date"
            />
          </div>
        </div>
        <div className="cg-form-col--full">
          <label className="cg-label">Visibility</label>
          <select
            className="cg-input"
            value={form.visibility}
            onChange={set("visibility")}
            data-testid="school-dropdown-cg-album-visibility"
          >
            {VIS_OPTIONS.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </div>
        <div className="cg-form-col--full">
          <label className="cg-label">Description</label>
          <textarea
            className="cg-textarea"
            value={form.desc}
            onChange={set("desc")}
            placeholder="Album description�"
            data-testid="school-field-cg-album-desc"
          />
        </div>
        <div className="cg-modal__actions">
          <button className="cg-btn cg-btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="cg-btn cg-btn--primary"
            data-testid="school-button-cg-album-create"
          >
            Create Album
          </button>
        </div>
      </div>
    </Modal>
  );
}

// --- Share Modal --------------------------------------------------------------

function ShareModal({ item, onClose }) {
  const link = `https://school.edu/gallery/${item?.id || ""}`;
  return (
    <Modal title="Share" onClose={onClose}>
      <div className="cg-modal__form">
        {item && (
          <div
            className="cg-share-preview"
            style={{ background: item.gradient }}
          >
            <span className="cg-share-preview__emoji">{item.emoji}</span>
            <p className="cg-share-preview__title">{item.title}</p>
          </div>
        )}
        <div className="cg-form-col--full" style={{ marginTop: "1rem" }}>
          <label className="cg-label">Shareable Link</label>
          <div className="cg-copy-row">
            <input
              className="cg-input"
              readOnly
              value={link}
              data-testid="school-field-cg-share-link"
            />
            <button
              className="cg-btn cg-btn--ghost cg-btn--sm"
              data-testid="school-button-cg-copy-link"
            >
              Copy
            </button>
          </div>
        </div>
        <div
          className="cg-qr-placeholder"
          data-testid="school-card-cg-qr-placeholder"
        >
          <span>📱 QR Code Placeholder</span>
        </div>
        <div className="cg-modal__actions">
          <button className="cg-btn cg-btn--ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

// --- Delete Confirm Modal -----------------------------------------------------

function DeleteModal({ item, onClose }) {
  return (
    <Modal title="Delete Confirmation" onClose={onClose}>
      <div className="cg-modal__form">
        <p className="cg-modal__desc">
          Are you sure you want to delete{" "}
          <strong>{item?.title || "this item"}</strong>? This action cannot be
          undone.
        </p>
        <div className="cg-modal__actions">
          <button className="cg-btn cg-btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="cg-btn cg-btn--danger"
            data-testid="school-button-cg-delete-confirm"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}

// --- Fullscreen Viewer --------------------------------------------------------

function FullscreenViewer({ media, allMedia, onClose }) {
  const [idx, setIdx] = useState(() =>
    allMedia.findIndex((m) => m.id === media.id),
  );
  const current = allMedia[idx] || media;

  const prev = useCallback(() => setIdx((i) => Math.max(0, i - 1)), []);
  const next = useCallback(
    () => setIdx((i) => Math.min(allMedia.length - 1, i + 1)),
    [allMedia.length],
  );

  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose, prev, next]);

  return (
    <div
      className="cg-viewer"
      role="dialog"
      aria-modal="true"
      data-testid="school-modal-cg-viewer"
    >
      <div className="cg-viewer__backdrop" onClick={onClose} />
      <button
        className="cg-viewer__close"
        onClick={onClose}
        aria-label="Close viewer"
      >
        ✕
      </button>

      <button
        className="cg-viewer__nav cg-viewer__nav--prev"
        onClick={prev}
        disabled={idx === 0}
        aria-label="Previous"
        data-testid="school-button-cg-viewer-prev"
      >
        �
      </button>
      <button
        className="cg-viewer__nav cg-viewer__nav--next"
        onClick={next}
        disabled={idx === allMedia.length - 1}
        aria-label="Next"
        data-testid="school-button-cg-viewer-next"
      >
        �
      </button>

      <div className="cg-viewer__stage">
        <div
          className="cg-viewer__media"
          style={{ background: current.img ? "transparent" : current.gradient }}
          data-testid="school-card-cg-viewer-media"
        >
          {current.img ? (
            <img
              src={current.img}
              alt={current.title}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              loading="lazy"
            />
          ) : (
            <span className="cg-viewer__emoji">{current.emoji}</span>
          )}
          {current.type === "video" && (
            <div className="cg-viewer__play-overlay">▶</div>
          )}
        </div>
      </div>

      <div className="cg-viewer__panel">
        <p className="cg-viewer__title">{current.title}</p>
        <p className="cg-viewer__caption">{current.caption}</p>
        {current.tags?.length > 0 && (
          <div className="cg-viewer__tags">
            {current.tags.map((t) => (
              <span key={t} className="cg-viewer__tag">
                #{t}
              </span>
            ))}
          </div>
        )}
        <div className="cg-viewer__actions">
          <button
            className="cg-btn cg-btn--ghost cg-btn--sm"
            data-testid="school-button-cg-viewer-download"
          >
            ⬇️ Download
          </button>
          <button
            className="cg-btn cg-btn--ghost cg-btn--sm"
            data-testid="school-button-cg-viewer-share"
          >
            🔗 Share
          </button>
          <button
            className="cg-btn cg-btn--ghost cg-btn--sm"
            data-testid="school-button-cg-viewer-fav"
          >
            ❤️ {current.likes}
          </button>
          <button
            className="cg-btn cg-btn--ghost cg-btn--sm"
            data-testid="school-button-cg-viewer-report"
          >
            ⚠️ Report
          </button>
        </div>
        <p className="cg-viewer__counter">
          {idx + 1} / {allMedia.length}
        </p>
      </div>
    </div>
  );
}

// --- Overview Tab -------------------------------------------------------------

function OverviewTab({ setActiveTab, openModal }) {
  const [slide, setSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState("all");
  const len = FEATURED.length;

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % len), 4200);
    return () => clearInterval(t);
  }, [len]);

  const filteredAlbums = useMemo(
    () =>
      activeCategory === "all"
        ? ALBUMS
        : ALBUMS.filter((a) => a.category === activeCategory),
    [activeCategory],
  );

  return (
    <div className="cg-tab-content">
      {/* Metrics */}
      <div className="cg-metrics-grid">
        {GALLERY_METRICS.map((m) => (
          <div
            key={m.key}
            className={`cg-metric-card cg-metric-card--${m.tone}`}
            data-testid={`school-card-cg-metric-${m.key}`}
          >
            <div className="cg-metric-card__icon">{m.icon}</div>
            <div className="cg-metric-card__body">
              <div className="cg-metric-card__value">{m.value}</div>
              <div className="cg-metric-card__label">{m.label}</div>
              <div className="cg-metric-card__sub">{m.sub}</div>
            </div>
          </div>
        ))}
        {" "}
      </div>

      {/* Featured Carousel */}
      <div className="cg-carousel" data-testid="school-card-cg-carousel">
        <div
          className="cg-carousel__track"
          style={{ transform: `translateX(-${slide * 100}%)` }}
        >
          {FEATURED.map((album) => (
            <div
              key={album.id}
              className="cg-carousel__slide"
              style={album.coverImg ? {} : { background: album.gradient }}
            >
              {album.coverImg && (
                <img
                  src={album.coverImg}
                  alt={album.title}
                  className="cg-carousel__slide-img"
                  loading="lazy"
                />
              )}
              <div className="cg-carousel__overlay">
                <span className="cg-carousel__hero-emoji">{album.emoji}</span>
                <div className="cg-carousel__content">
                  <span className="cg-carousel__cat-tag">{album.category}</span>
                  <h2 className="cg-carousel__title">{album.title}</h2>
                  <p className="cg-carousel__desc">{album.desc}</p>
                  <div className="cg-carousel__cta">
                    <button
                      className="cg-btn cg-btn--white"
                      onClick={() => setActiveTab("albums")}
                      data-testid="school-button-cg-carousel-view"
                    >
                      View Album →
                    </button>
                    <span className="cg-carousel__stat">
                      📷 {album.photos} · 🎬 {album.videos} · 👁️{" "}
                      {album.views.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          className="cg-carousel__arrow cg-carousel__arrow--prev"
          onClick={() => setSlide((s) => (s - 1 + len) % len)}
          aria-label="Previous slide"
          data-testid="school-button-cg-carousel-prev"
        >
          �
        </button>
        <button
          className="cg-carousel__arrow cg-carousel__arrow--next"
          onClick={() => setSlide((s) => (s + 1) % len)}
          aria-label="Next slide"
          data-testid="school-button-cg-carousel-next"
        >
          �
        </button>
        <div className="cg-carousel__dots">
          {FEATURED.map((_, i) => (
            <button
              key={i}
              className={`cg-carousel__dot${i === slide ? " cg-carousel__dot--active" : ""}`}
              onClick={() => setSlide(i)}
              aria-label={`Slide ${i + 1}`}
              data-testid={`school-button-cg-carousel-dot-${i}`}
            />
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="cg-section-row" style={{ marginTop: "1.5rem" }}>
        <h3 className="cg-section-title">Browse by Category</h3>
        <button
          className="cg-btn cg-btn--ghost cg-btn--sm"
          onClick={() => setActiveTab("albums")}
          data-testid="school-button-cg-view-all-albums"
        >
          View All Albums →
        </button>
      </div>
      <div className="cg-cat-scroll">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            className={`cg-cat-chip${activeCategory === c.id ? " cg-cat-chip--active" : ""}`}
            onClick={() => setActiveCategory(c.id)}
            data-testid={`school-button-cg-category-${c.id}`}
          >
            {c.icon} {c.label}{" "}
            <span className="cg-cat-chip__count">{c.count}</span>
          </button>
        ))}
      </div>

      {/* Album Preview Grid */}
      <div className="cg-album-grid" style={{ marginTop: "1rem" }}>
        {filteredAlbums.slice(0, 6).map((album) => (
          <div
            key={album.id}
            className="cg-album-card"
            onClick={() => setActiveTab("albums")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setActiveTab("albums")}
            data-testid={`school-card-cg-overview-album-${album.id}`}
          >
            <div
              className="cg-album-card__cover"
              style={album.coverImg ? {} : { background: album.gradient }}
            >
              {album.coverImg ? (
                <img
                  src={album.coverImg}
                  alt={album.title}
                  className="cg-album-card__cover-img"
                  loading="lazy"
                />
              ) : (
                <span className="cg-album-card__emoji">{album.emoji}</span>
              )}
              <div className="cg-album-card__hover-overlay">View Album →</div>
              <div className="cg-album-card__vis">
                <VisBadge v={album.visibility} />
              </div>
            </div>
            <div className="cg-album-card__info">
              <p className="cg-album-card__title">{album.title}</p>
              <p className="cg-album-card__meta">
                {album.date} · {album.uploadedBy}
              </p>
              <div className="cg-album-card__stats">
                <span>📷 {album.photos}</span>
                <span>🎬 {album.videos}</span>
                <span>👁️ {album.views.toLocaleString()}</span>
                <span>❤️ {album.likes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Media Grid ---------------------------------------------------------------

function MediaGrid({ album, onBack, onMediaSelect }) {
  const items = MEDIA_BY_ALBUM[album.id] || [];
  const [filter, setFilter] = useState("all");
  const filtered =
    filter === "all" ? items : items.filter((m) => m.type === filter);

  return (
    <div>
      <BackBtn onClick={onBack} label="Back to Albums" />
      <div className="cg-album-detail">
        <div
          className="cg-album-detail__cover"
          style={album.coverImg ? {} : { background: album.gradient }}
        >
          {album.coverImg ? (
            <img
              src={album.coverImg}
              alt={album.title}
              className="cg-album-detail__cover-img"
              loading="lazy"
            />
          ) : (
            <span>{album.emoji}</span>
          )}
        </div>
        <div className="cg-album-detail__info">
          <h2 className="cg-section-title" style={{ margin: 0 }}>
            {album.title}
          </h2>
          <p className="cg-muted">{album.desc}</p>
          <div className="cg-album-detail__stats">
            <span>📷 {album.photos} photos</span>
            <span>🎬 {album.videos} videos</span>
            <span>👁️ {album.views.toLocaleString()} views</span>
            <span>❤️ {album.likes} likes</span>
            <VisBadge v={album.visibility} />
          </div>
        </div>
      </div>

      <div className="cg-filters">
        {["all", "photo", "video"].map((f) => (
          <button
            key={f}
            className={`cg-filter-btn${filter === f ? " cg-filter-btn--active" : ""}`}
            onClick={() => setFilter(f)}
            data-testid={`school-button-cg-media-filter-${f}`}
          >
            {f === "all" ? "All" : f === "photo" ? "📷 Photos" : "🎬 Videos"}
          </button>
        ))}
        <div className="cg-filters__spacer" />
        <button
          className="cg-btn cg-btn--ghost cg-btn--sm"
          data-testid="school-button-cg-download-album"
        >
          ⬇️ Download Album
        </button>
        <button
          className="cg-btn cg-btn--ghost cg-btn--sm"
          data-testid="school-button-cg-share-album"
        >
          🔗 Share Album
        </button>
      </div>

      <div className="cg-media-grid">
        {filtered.map((item, i) => (
          <div
            key={item.id}
            className={`cg-media-item${i % 7 === 0 ? " cg-media-item--tall" : ""}${i % 11 === 0 ? " cg-media-item--wide" : ""}`}
            onClick={() => onMediaSelect(item)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onMediaSelect(item)}
            data-testid={`school-card-cg-media-${item.id}`}
          >
            <div
              className="cg-media-item__inner"
              style={item.img ? {} : { background: item.gradient }}
            >
              {item.img ? (
                <img
                  src={item.img}
                  alt={item.title}
                  className="cg-media-item__img"
                  loading="lazy"
                />
              ) : (
                <span className="cg-media-item__emoji">{item.emoji}</span>
              )}
              {item.type === "video" && (
                <div className="cg-media-item__video-badge">
                  ▶ {item.duration}
                </div>
              )}
              <div className="cg-media-item__hover">
                <div className="cg-media-item__hover-actions">
                  <button
                    onClick={(e) => e.stopPropagation()}
                    data-testid={`school-button-cg-media-fav-${item.id}`}
                  >
                    ❤️ {item.likes}
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    data-testid={`school-button-cg-media-share-${item.id}`}
                  >
                    🔗
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    data-testid={`school-button-cg-media-dl-${item.id}`}
                  >
                    ⬇️
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Albums Tab ---------------------------------------------------------------

function AlbumsTab({ openModal }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const filtered = useMemo(
    () =>
      ALBUMS.filter((a) => {
        const matchCat = category === "all" || a.category === category;
        const q = search.toLowerCase();
        const matchSearch =
          !q ||
          a.title.toLowerCase().includes(q) ||
          a.uploadedBy.toLowerCase().includes(q);
        return matchCat && matchSearch;
      }),
    [search, category],
  );

  if (selectedMedia && selectedAlbum) {
    return (
      <FullscreenViewer
        media={selectedMedia}
        allMedia={MEDIA_BY_ALBUM[selectedAlbum.id] || []}
        onClose={() => setSelectedMedia(null)}
      />
    );
  }

  if (selectedAlbum) {
    return (
      <MediaGrid
        album={selectedAlbum}
        onBack={() => setSelectedAlbum(null)}
        onMediaSelect={setSelectedMedia}
      />
    );
  }

  return (
    <div className="cg-tab-content">
      <div className="cg-section-row">
        <h3 className="cg-section-title">All Albums</h3>
        <button
          className="cg-btn cg-btn--primary cg-btn--sm"
          onClick={() => openModal("create-album")}
          data-testid="school-button-cg-create-album"
        >
          + Create Album
        </button>
      </div>

      <div className="cg-filters">
        <input
          className="cg-search"
          placeholder="Search albums, events, uploaded by�"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-testid="school-field-cg-album-search"
        />
        <select
          className="cg-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          data-testid="school-dropdown-cg-album-category"
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.icon} {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="cg-cat-scroll">
        {CATEGORIES.slice(0, 9).map((c) => (
          <button
            key={c.id}
            className={`cg-cat-chip${category === c.id ? " cg-cat-chip--active" : ""}`}
            onClick={() => setCategory(c.id)}
            data-testid={`school-button-cg-album-cat-${c.id}`}
          >
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="cg-empty">No albums found for your search.</div>
      ) : (
        <div className="cg-album-grid">
          {filtered.map((album) => (
            <div
              key={album.id}
              className="cg-album-card"
              onClick={() => setSelectedAlbum(album)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setSelectedAlbum(album)}
              data-testid={`school-card-cg-album-${album.id}`}
            >
              <div
                className="cg-album-card__cover"
                style={album.coverImg ? {} : { background: album.gradient }}
              >
                {album.coverImg ? (
                  <img
                    src={album.coverImg}
                    alt={album.title}
                    className="cg-album-card__cover-img"
                    loading="lazy"
                  />
                ) : (
                  <span className="cg-album-card__emoji">{album.emoji}</span>
                )}
                <div className="cg-album-card__hover-overlay">View Album →</div>
                <div className="cg-album-card__vis">
                  <VisBadge v={album.visibility} />
                </div>
                {album.featured && (
                  <span className="cg-album-card__featured">⭐ Featured</span>
                )}
              </div>
              <div className="cg-album-card__info">
                <p className="cg-album-card__title">{album.title}</p>
                <p className="cg-album-card__meta">
                  {album.date} · by {album.uploadedBy}
                </p>
                <div className="cg-album-card__stats">
                  <span>📷 {album.photos}</span>
                  <span>🎬 {album.videos}</span>
                  <span>👁️ {album.views.toLocaleString()}</span>
                  <span>❤️ {album.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Videos Tab ---------------------------------------------------------------

function VideosTab() {
  const [search, setSearch] = useState("");
  const [playing, setPlaying] = useState(null);

  const filtered = useMemo(
    () =>
      VIDEOS.filter(
        (v) => !search || v.title.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  return (
    <div className="cg-tab-content">
      <div className="cg-section-row">
        <h3 className="cg-section-title">Video Gallery</h3>
        <span className="cg-muted">{VIDEOS.length} videos</span>
      </div>

      <div className="cg-filters">
        <input
          className="cg-search"
          placeholder="Search videos�"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-testid="school-field-cg-video-search"
        />
      </div>

      <div className="cg-video-grid">
        {filtered.map((v) => (
          <div
            key={v.id}
            className="cg-video-card"
            data-testid={`school-card-cg-video-${v.id}`}
          >
            <div
              className="cg-video-card__thumb"
              style={v.thumb ? {} : { background: v.gradient }}
              onClick={() => setPlaying(v)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setPlaying(v)}
            >
              {v.thumb ? (
                <img
                  src={v.thumb}
                  alt={v.title}
                  className="cg-video-card__thumb-img"
                  loading="lazy"
                />
              ) : (
                <span className="cg-video-card__emoji">{v.emoji}</span>
              )}
              <div className="cg-video-card__play">▶</div>
              <span className="cg-video-card__duration">{v.duration}</span>
            </div>
            <div className="cg-video-card__info">
              <p className="cg-video-card__title">{v.title}</p>
              <p className="cg-video-card__meta">
                {v.date} � ??? {v.views.toLocaleString()}
              </p>
              <p className="cg-video-card__by">by {v.uploadedBy}</p>
            </div>
          </div>
        ))}
      </div>

      {playing && (
        <Modal title={playing.title} onClose={() => setPlaying(null)} wide>
          <div
            className="cg-video-player"
            style={{ background: playing.gradient }}
            data-testid="school-modal-cg-video-player"
          >
            <span className="cg-video-player__emoji">{playing.emoji}</span>
            <div className="cg-video-player__play">▶</div>
            <p className="cg-video-player__note">
              Video Player Placeholder � {playing.duration}
            </p>
          </div>
          <p className="cg-muted" style={{ padding: "0.75rem 0 0" }}>
            {playing.desc}
          </p>
        </Modal>
      )}
    </div>
  );
}

// --- Campus Life Tab ----------------------------------------------------------

function CampusLifeTab() {
  return (
    <div className="cg-tab-content">
      <div className="cg-section-header">
        <h3 className="cg-section-title">Campus Life Showcase</h3>
        <p className="cg-muted">
          A curated visual tour of campus facilities and spaces � perfect for
          admissions and storytelling.
        </p>
      </div>
      <div className="cg-campus-grid">
        {CAMPUS_LIFE.map((cl, i) => (
          <div
            key={cl.id}
            className={`cg-campus-card${i === 0 ? " cg-campus-card--featured" : ""}`}
            data-testid={`school-card-cg-campus-${cl.id}`}
          >
            <div
              className="cg-campus-card__visual"
              style={cl.img ? {} : { background: cl.gradient }}
            >
              {cl.img ? (
                <img
                  src={cl.img}
                  alt={cl.label}
                  className="cg-campus-card__img"
                  loading="lazy"
                />
              ) : (
                <span className="cg-campus-card__emoji">{cl.emoji}</span>
              )}
              <div className="cg-campus-card__overlay">Explore →</div>
            </div>
            <div className="cg-campus-card__info">
              <span className="cg-campus-card__tag">{cl.tag}</span>
              <h4 className="cg-campus-card__title">{cl.label}</h4>
              <p className="cg-campus-card__desc">{cl.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Achievements Tab ---------------------------------------------------------

function AchievementsTab() {
  return (
    <div className="cg-tab-content">
      <div className="cg-section-header">
        <h3 className="cg-section-title">Student Achievements</h3>
        <p className="cg-muted">
          Spotlighting our champions, innovators, and stars.
        </p>
      </div>
      <div className="cg-ach-grid">
        {ACHIEVEMENTS.map((a, i) => (
          <div
            key={a.id}
            className={`cg-ach-card${i === 0 ? " cg-ach-card--spotlight" : ""}`}
            data-testid={`school-card-cg-achievement-${a.id}`}
          >
            <div
              className="cg-ach-card__avatar"
              style={a.img ? {} : { background: a.gradient }}
            >
              {a.img ? (
                <img
                  src={a.img}
                  alt={a.name}
                  className="cg-ach-card__avatar-img"
                  loading="lazy"
                />
              ) : (
                <span>{a.emoji}</span>
              )}
            </div>
            <div className="cg-ach-card__body">
              <h4 className="cg-ach-card__title">{a.title}</h4>
              <p className="cg-ach-card__name">{a.name}</p>
              <p className="cg-ach-card__event">{a.event}</p>
              <p className="cg-ach-card__date">{a.date}</p>
              <p className="cg-ach-card__desc">{a.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Faculty & Clubs Tab ------------------------------------------------------

function FacultyClubsTab() {
  const [view, setView] = useState("faculty");
  return (
    <div className="cg-tab-content">
      <div className="cg-section-row">
        <h3 className="cg-section-title">
          {view === "faculty" ? "Faculty Events" : "Clubs & Activities"}
        </h3>
        <div className="cg-view-toggle">
          <button
            className={`cg-btn cg-btn--sm${view === "faculty" ? " cg-btn--primary" : " cg-btn--ghost"}`}
            onClick={() => setView("faculty")}
            data-testid="school-button-cg-view-faculty"
          >
            Faculty Events
          </button>
          <button
            className={`cg-btn cg-btn--sm${view === "clubs" ? " cg-btn--primary" : " cg-btn--ghost"}`}
            onClick={() => setView("clubs")}
            data-testid="school-button-cg-view-clubs"
          >
            Clubs & Activities
          </button>
        </div>
      </div>

      {view === "faculty" ? (
        <div className="cg-faculty-grid">
          {FACULTY_EVENTS.map((fe) => (
            <div
              key={fe.id}
              className="cg-faculty-card"
              data-testid={`school-card-cg-faculty-${fe.id}`}
            >
              <div
                className="cg-faculty-card__visual"
                style={fe.img ? {} : { background: fe.gradient }}
              >
                {fe.img ? (
                  <img
                    src={fe.img}
                    alt={fe.title}
                    className="cg-faculty-card__visual-img"
                    loading="lazy"
                  />
                ) : (
                  <span>{fe.emoji}</span>
                )}
              </div>
              <div className="cg-faculty-card__info">
                <span className="cg-tag cg-tag--type">{fe.type}</span>
                <h4 className="cg-faculty-card__title">{fe.title}</h4>
                <p className="cg-faculty-card__meta">
                  {fe.date} � {fe.participants} participants
                </p>
                <p className="cg-muted">{fe.desc}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="cg-clubs-grid">
          {CLUBS.map((club) => (
            <div
              key={club.id}
              className="cg-club-card"
              data-testid={`school-card-cg-club-${club.id}`}
            >
              <div
                className="cg-club-card__header"
                style={club.img ? {} : { background: club.gradient }}
              >
                {club.img ? (
                  <img
                    src={club.img}
                    alt={club.name}
                    className="cg-club-card__header-img"
                    loading="lazy"
                  />
                ) : (
                  <span className="cg-club-card__emoji">{club.emoji}</span>
                )}
                <div className="cg-club-card__tags">
                  {club.tags.map((t) => (
                    <span key={t} className="cg-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="cg-club-card__body">
                <h4 className="cg-club-card__name">{club.name}</h4>
                <p className="cg-muted">{club.desc}</p>
                <div className="cg-club-card__stats">
                  <span>👥 {club.members} members</span>
                  <span>📅 {club.events} events</span>
                </div>
                <p className="cg-club-card__last">
                  Last event: {club.lastEvent}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Timeline Tab -------------------------------------------------------------

function TimelineTab() {
  const [expanded, setExpanded] = useState(() =>
    Object.fromEntries(TIMELINE_DATA.map((d, i) => [d.year, i === 0])),
  );
  const toggle = (yr) => setExpanded((p) => ({ ...p, [yr]: !p[yr] }));

  return (
    <div className="cg-tab-content">
      <h3 className="cg-section-title">Archive Timeline</h3>
      {TIMELINE_DATA.map(({ year, items }) => (
        <div
          key={year}
          className="cg-timeline-year"
          data-testid={`school-card-cg-timeline-${year}`}
        >
          <button
            className="cg-timeline-year__header"
            onClick={() => toggle(year)}
            data-testid={`school-button-cg-timeline-toggle-${year}`}
          >
            <span className="cg-timeline-year__label">📅 {year}</span>
            <span className="cg-timeline-year__count">
              {items.length} events
            </span>
            <span className="cg-timeline-year__arrow">
              {expanded[year] ? "▾" : "▸"}
            </span>
          </button>
          {expanded[year] && (
            <div className="cg-timeline-items">
              {items.map((item, i) => (
                <div
                  key={i}
                  className="cg-timeline-item"
                  data-testid={`school-card-cg-timeline-item-${year}-${i}`}
                >
                  <div className="cg-timeline-item__line" />
                  <div className="cg-timeline-item__dot">{item.icon}</div>
                  <div className="cg-timeline-item__body">
                    <p className="cg-timeline-item__label">{item.label}</p>
                    <p className="cg-timeline-item__meta">
                      {item.month} � {item.count} photos
                    </p>
                  </div>
                  <button
                    className="cg-btn cg-btn--ghost cg-btn--xs"
                    data-testid={`school-button-cg-timeline-view-${year}-${i}`}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// --- Analytics Tab ------------------------------------------------------------

function AnalyticsTab() {
  const a = GALLERY_ANALYTICS;
  const maxUp = Math.max(...a.uploadTrend.map((t) => t.uploads));

  return (
    <div className="cg-tab-content">
      <h3 className="cg-section-title">Gallery Analytics</h3>

      <div className="cg-analytics-stats">
        {[
          {
            label: "Total Views",
            value: a.totalViews.toLocaleString(),
            icon: "👁️",
            color: "#4f46e5",
          },
          {
            label: "Total Likes",
            value: a.totalLikes.toLocaleString(),
            icon: "❤️",
            color: "#e11d48",
          },
          {
            label: "Total Downloads",
            value: a.totalDownloads.toLocaleString(),
            icon: "⬇️",
            color: "#0d9488",
          },
          {
            label: "Storage Used",
            value: `${a.storageUsedPct}%`,
            icon: "💾",
            color: "#d97706",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="cg-analytics-stat"
            data-testid={`school-card-cg-analytics-${s.label.replace(/\s+/g, "-").toLowerCase()}`}
          >
            <span className="cg-analytics-stat__icon">{s.icon}</span>
            <span
              className="cg-analytics-stat__value"
              style={{ color: s.color }}
            >
              {s.value}
            </span>
            <span className="cg-analytics-stat__label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="cg-analytics-panels">
        {/* Top Albums */}
        <div
          className="cg-analytics-panel"
          data-testid="school-card-cg-analytics-top-albums"
        >
          <h4 className="cg-analytics-panel__title">Most Viewed Albums</h4>
          <div className="cg-analytics-rows">
            {a.topAlbums.map((item) => (
              <div key={item.title} className="cg-analytics-row">
                <span className="cg-analytics-row__label">{item.title}</span>
                <div className="cg-analytics-row__track">
                  <div
                    className="cg-analytics-row__fill"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
                <span className="cg-analytics-row__val">
                  {item.views.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Trend */}
        <div
          className="cg-analytics-panel"
          data-testid="school-card-cg-analytics-upload-trend"
        >
          <h4 className="cg-analytics-panel__title">Monthly Upload Activity</h4>
          <div className="cg-bar-chart">
            {a.uploadTrend.map((t) => (
              <div key={t.month} className="cg-bar-chart__col">
                <span className="cg-bar-chart__val">{t.uploads}</span>
                <div
                  className="cg-bar-chart__bar"
                  style={{ height: `${(t.uploads / maxUp) * 100}%` }}
                />
                <span className="cg-bar-chart__label">{t.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Storage */}
        <div
          className="cg-analytics-panel"
          data-testid="school-card-cg-analytics-storage"
        >
          <h4 className="cg-analytics-panel__title">Storage Usage</h4>
          <div className="cg-storage-visual">
            <div
              className="cg-storage-ring"
              style={{ "--pct": a.storageUsedPct }}
            >
              <span className="cg-storage-ring__pct">{a.storageUsedPct}%</span>
              <span className="cg-storage-ring__sub">Used</span>
            </div>
            <div className="cg-storage-legend">
              <div className="cg-storage-legend__item cg-storage-legend__item--used">
                � 284 GB Used
              </div>
              <div className="cg-storage-legend__item cg-storage-legend__item--free">
                � 216 GB Free
              </div>
            </div>
          </div>
          <ProgressBar pct={a.storageUsedPct} color="#d97706" />
        </div>
      </div>
    </div>
  );
}

// --- Upload Tab ---------------------------------------------------------------

function UploadTab({ openModal }) {
  const [dragging, setDragging] = useState(false);
  return (
    <div className="cg-tab-content">
      <div className="cg-section-row">
        <h3 className="cg-section-title">Upload Management</h3>
        <button
          className="cg-btn cg-btn--primary"
          onClick={() => openModal("upload")}
          data-testid="school-button-cg-upload-open"
        >
          📤 Upload Media
        </button>
      </div>

      <div
        className={`cg-dropzone cg-dropzone--large${dragging ? " cg-dropzone--active" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
        }}
        data-testid="school-field-cg-upload-dropzone"
      >
        <span className="cg-dropzone__icon">📤</span>
        <p className="cg-dropzone__label">
          Drag & drop photos, videos or PDFs here
        </p>
        <p className="cg-dropzone__sub">
          Supported: JPG, PNG, MP4, MOV, PDF · Max 500 MB per file
        </p>
        <button
          className="cg-btn cg-btn--outline"
          style={{ marginTop: "0.75rem" }}
          data-testid="school-button-cg-browse-files"
        >
          Browse Files
        </button>
      </div>

      <h4 className="cg-section-title" style={{ marginTop: "1.5rem" }}>
        Recent Upload Activity
      </h4>
      <div className="cg-table-wrap">
        <table className="cg-table">
          <thead className="cg-table__head">
            <tr>
              <th>File</th>
              <th>Type</th>
              <th>Size</th>
              <th>Count</th>
              <th>Uploaded By</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {UPLOAD_LOGS.map((log) => (
              <tr key={log.id} className="cg-table__row">
                <td className="cg-table__cell--bold">{log.filename}</td>
                <td>{log.type}</td>
                <td>{log.size}</td>
                <td>{log.count}</td>
                <td>{log.uploadedBy}</td>
                <td>{log.date}</td>
                <td>
                  <span
                    className={`cg-badge cg-badge--${log.status.toLowerCase()}`}
                  >
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- Modal Registry -----------------------------------------------------------

const MODAL_REGISTRY = {
  upload: (props) => <UploadModal {...props} />,
  "create-album": (props) => <CreateAlbumModal {...props} />,
  share: (props) => <ShareModal {...props} />,
  delete: (props) => <DeleteModal {...props} />,
};

// --- Main Gallery Component ---------------------------------------------------

const Gallery = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [openModal, setOpenModal] = useState(null);
  const [modalData, setModalData] = useState(null);
  const tabBarRef = useRef();

  const handleOpenModal = useCallback((key, data = null) => {
    setOpenModal(key);
    setModalData(data);
  }, []);
  const handleCloseModal = useCallback(() => {
    setOpenModal(null);
    setModalData(null);
  }, []);

  useEffect(() => {
    const el = tabBarRef.current?.querySelector(".cg-tab--active");
    if (el)
      el.scrollIntoView({
        block: "nearest",
        inline: "center",
        behavior: "smooth",
      });
  }, [activeTab]);

  const TAB_CONTENT = {
    overview: (
      <OverviewTab setActiveTab={setActiveTab} openModal={handleOpenModal} />
    ),
    albums: <AlbumsTab openModal={handleOpenModal} />,
    videos: <VideosTab />,
    "campus-life": <CampusLifeTab />,
    achievements: <AchievementsTab />,
    faculty: <FacultyClubsTab />,
    timeline: <TimelineTab />,
    analytics: <AnalyticsTab />,
    upload: <UploadTab openModal={handleOpenModal} />,
  };

  const ModalComp = openModal ? MODAL_REGISTRY[openModal] : null;

  return (
    <div className="cg-root">
      <ManagementPageHeader
        breadcrumbs={[
          { label: "Campus" },
          { label: "Gallery" },
        ]}
        title="Campus Gallery"
        subtitle="A premium digital memories platform and campus storytelling hub."
        actions={(
          <>
            <button
              className="cg-btn cg-btn--primary"
              onClick={() => handleOpenModal("upload")}
              data-testid="school-button-cg-upload-media"
            >
              📤 Upload Media
            </button>
            <button
              className="cg-btn cg-btn--ghost"
              onClick={() => handleOpenModal("create-album")}
              data-testid="school-button-cg-create-album-header"
            >
              + Create Album
            </button>
          </>
        )}
      />

      {/* Tab Bar */}
      <div className="cg-tabs-wrap">
        <div className="cg-tabs" ref={tabBarRef} role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`cg-tab${activeTab === tab.key ? " cg-tab--active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
              role="tab"
              aria-selected={activeTab === tab.key}
              data-testid={`school-tab-cg-${tab.key}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="cg-content" role="tabpanel">
        {TAB_CONTENT[activeTab]}
      </div>

      {/* Modal */}
      {ModalComp && <ModalComp onClose={handleCloseModal} item={modalData} />}
    </div>
  );
};

export default Gallery;
