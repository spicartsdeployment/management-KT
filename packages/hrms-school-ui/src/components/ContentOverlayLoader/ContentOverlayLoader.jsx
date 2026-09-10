import React, { useMemo } from 'react';
import '../../assets/scss/ContentOverlayLoader.scss';

/* ─── Per-page config ─────────────────────────────────────────────────────── */
const PAGE_CONFIGS = {
  'dashboard': {
    icon: '📊', title: 'Loading Dashboard', subtitle: 'Crunching your numbers…',
    g1: '#6366f1', g2: '#8b5cf6', bar: 'columns', cols: 5,
  },
  'bus-tracking': {
    icon: '🚌', title: 'Finding Your Bus', subtitle: 'Tracking live location…',
    g1: '#f59e0b', g2: '#ef4444', bar: 'train',
  },
  'daily-schedule': {
    icon: '📅', title: 'Building Schedule', subtitle: 'Loading your timetable…',
    g1: '#0ea5e9', g2: '#6366f1', bar: 'segments', segs: 7,
  },
  'fee-management': {
    icon: '💰', title: 'Fee Records', subtitle: 'Counting your coins…',
    g1: '#10b981', g2: '#34d399', bar: 'shimmer',
  },
  'alumni-network': {
    icon: '🎓', title: 'Alumni Network', subtitle: 'Connecting graduates…',
    g1: '#7c3aed', g2: '#d97706', bar: 'orbit', dots: 3,
  },
  'leave-management': {
    icon: '📝', title: 'Leave Records', subtitle: 'Fetching your history…',
    g1: '#f97316', g2: '#facc15', bar: 'shimmer',
  },
  'performance-analytics': {
    icon: '📈', title: 'Analytics', subtitle: 'Processing your scores…',
    g1: '#06b6d4', g2: '#818cf8', bar: 'columns', cols: 6,
  },
  'health-updates': {
    icon: '🩺', title: 'Health Check', subtitle: 'Reviewing your vitals…',
    g1: '#f43f5e', g2: '#ec4899', bar: 'pulse',
  },
  'communication-hub': {
    icon: '💬', title: 'Loading Chats', subtitle: 'Connecting to hub…',
    g1: '#6366f1', g2: '#0ea5e9', bar: 'wave',
  },
  'meeting-scheduler': {
    icon: '🗓️', title: 'Scheduler', subtitle: 'Checking your calendar…',
    g1: '#14b8a6', g2: '#10b981', bar: 'segments', segs: 8,
  },
  'grievance-system': {
    icon: '⚖️', title: 'Grievances', subtitle: 'Reviewing your requests…',
    g1: '#64748b', g2: '#6366f1', bar: 'orbit', dots: 4,
  },
  'community-forum': {
    icon: '🌐', title: 'Community', subtitle: 'Loading the forum…',
    g1: '#ec4899', g2: '#f97316', bar: 'wave',
  },
  'global-announcements': {
    icon: '📢', title: 'Announcements', subtitle: 'Broadcasting latest news…',
    g1: '#f59e0b', g2: '#ef4444', bar: 'pulse',
  },
};

const DEFAULT_CONFIG = {
  icon: '✨', title: 'Loading', subtitle: 'Please wait a moment…',
  g1: '#6366f1', g2: '#ec4899', bar: 'shimmer',
};

function getConfig(pathname) {
  if (!pathname) return DEFAULT_CONFIG;
  const segment = pathname.split('/').filter(Boolean).pop() || '';
  return PAGE_CONFIGS[segment] || DEFAULT_CONFIG;
}

/* ─── Bar type: COLUMNS — bouncing bar-chart columns ─────────────────────── */
function BarColumns({ count = 5, g1, g2 }) {
  return (
    <div className="sch-col__bar sch-col__bar--columns" style={{ '--g1': g1, '--g2': g2 }}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="sch-col__bar-col" style={{ animationDelay: `${i * 0.12}s` }} />
      ))}
    </div>
  );
}

/* ─── Bar type: TRAIN — vehicle sliding along a road ─────────────────────── */
function BarTrain({ g1, g2 }) {
  return (
    <div className="sch-col__bar sch-col__bar--train" style={{ '--g1': g1, '--g2': g2 }}>
      <div className="sch-col__bar-road" />
      <span className="sch-col__bar-train-icon" aria-hidden="true">🚌</span>
    </div>
  );
}

/* ─── Bar type: SEGMENTS — blocks lighting up in sequence ────────────────── */
function BarSegments({ count = 7, g1, g2 }) {
  return (
    <div className="sch-col__bar sch-col__bar--segments" style={{ '--g1': g1, '--g2': g2 }}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="sch-col__bar-seg" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  );
}

/* ─── Bar type: SHIMMER — gradient fill with moving shine ────────────────── */
function BarShimmer({ g1, g2 }) {
  return (
    <div className="sch-col__bar sch-col__bar--shimmer" style={{ '--g1': g1, '--g2': g2 }}>
      <div className="sch-col__bar-fill" />
      <div className="sch-col__bar-shine" />
    </div>
  );
}

/* ─── Bar type: PULSE — ECG heartbeat line drawing itself ────────────────── */
function BarPulse({ g1, g2 }) {
  return (
    <div className="sch-col__bar sch-col__bar--pulse" style={{ '--g1': g1, '--g2': g2 }}>
      <svg className="sch-col__bar-ecg" viewBox="0 0 200 50" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="col-ecg-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={g1} />
            <stop offset="100%" stopColor={g2} />
          </linearGradient>
        </defs>
        <polyline
          className="sch-col__bar-ecg-line"
          style={{ stroke: 'url(#col-ecg-grad)' }}
          points="0,25 25,25 35,5 45,45 55,25 70,25 80,10 90,40 100,25 115,25 125,8 135,42 145,25 200,25"
        />
      </svg>
    </div>
  );
}

/* ─── Bar type: WAVE — equalizer-style animated bars ────────────────────── */
const WAVE_HEIGHTS = [0.4, 0.75, 1, 0.85, 0.55, 0.9, 0.6];
function BarWave({ g1, g2 }) {
  return (
    <div className="sch-col__bar sch-col__bar--wave" style={{ '--g1': g1, '--g2': g2 }}>
      {WAVE_HEIGHTS.map((h, i) => (
        <div
          key={i}
          className="sch-col__bar-wave-col"
          style={{ '--wave-h': `${Math.round(h * 40)}px`, animationDelay: `${i * 0.11}s` }}
        />
      ))}
    </div>
  );
}

/* ─── Bar type: ORBIT — dots orbiting a central glow ────────────────────── */
function BarOrbit({ dots = 3, g1, g2 }) {
  return (
    <div className="sch-col__bar sch-col__bar--orbit" style={{ '--g1': g1, '--g2': g2 }}>
      <div className="sch-col__bar-orbit-center" />
      {Array.from({ length: dots }, (_, i) => (
        <div
          key={i}
          className="sch-col__bar-orbit-dot"
          style={{ animationDelay: `-${(i * 1.6) / dots}s` }}
        />
      ))}
    </div>
  );
}

function renderBar(config) {
  const { bar, cols, segs, dots, g1, g2 } = config;
  switch (bar) {
    case 'columns': return <BarColumns count={cols} g1={g1} g2={g2} />;
    case 'train': return <BarTrain g1={g1} g2={g2} />;
    case 'segments': return <BarSegments count={segs} g1={g1} g2={g2} />;
    case 'shimmer': return <BarShimmer g1={g1} g2={g2} />;
    case 'pulse': return <BarPulse g1={g1} g2={g2} />;
    case 'wave': return <BarWave g1={g1} g2={g2} />;
    case 'orbit': return <BarOrbit dots={dots} g1={g1} g2={g2} />;
    default: return <BarShimmer g1={g1} g2={g2} />;
  }
}

/**
 * Full-viewport overlay shown while a lazy page loads.
 * Accepts optional pathname to render a unique themed loader per page.
 *
 * @param {{ pathname?: string }} props
 * @returns {JSX.Element}
 */
export default function ContentOverlayLoader({ pathname } = {}) {
  const config = useMemo(() => getConfig(pathname), [pathname]);

  return (
    <div
      className="sch-overlay-loader"
      data-testid="school-loader-overlay"
      aria-busy="true"
      aria-label="Loading page, please wait…"
      role="status"
    >
      <div className="sch-col__card" style={{ '--g1': config.g1, '--g2': config.g2 }}>
        <div className="sch-col__icon" aria-hidden="true">{config.icon}</div>
        <div className="sch-col__text">
          <p className="sch-col__title">{config.title}</p>
          <p className="sch-col__subtitle">{config.subtitle}</p>
        </div>
        {renderBar(config)}
      </div>
    </div>
  );
}
