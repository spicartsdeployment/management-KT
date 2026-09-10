import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

/* ─────────────────────────────────────────────────────────────────────────────
 * HOLIDAY CONFIG
 * Each holidayType maps to a distinct heading, emoji, badge color, and quotes.
 * "sunday"    — every Sunday
 * "holiday"   — public/festival holidays
 * "exam"      — exam break / study leave
 * "vacation"  — school vacation period
 * ───────────────────────────────────────────────────────────────────────────── */
const HOLIDAY_CONFIGS = {
  sunday: {
    badge: 'Weekend',
    heading: "It's Sunday!",
    emoji: '✨',
    accent: '#a78bfa',
    accentDark: '#c4b5fd',
    quotes: [
      "Take time to relax and recharge for the week ahead.",
      "Rest today, shine tomorrow.",
      "A calm Sunday prepares you for a successful week.",
      "Enjoy the little moments today.",
      "Sunday is the perfect day to recharge your soul.",
      "Peace is the greatest luxury on Sunday.",
    ],
  },
  holiday: {
    badge: 'Holiday',
    heading: "School's Off Today!",
    emoji: '🎉',
    accent: '#f59e0b',
    accentDark: '#fbbf24',
    quotes: [
      "Happy holiday! Make the most of your well-earned break.",
      "Rest, recharge, and come back stronger.",
      "The best holidays are the ones spent doing what you love.",
      "Time to celebrate — you've earned this!",
      "A great holiday leads to an even greater return.",
      "Enjoy every moment of your holiday.",
    ],
  },
  exam: {
    badge: 'Exam Break',
    heading: "Exam Break!",
    emoji: '📖',
    accent: '#10b981',
    accentDark: '#34d399',
    quotes: [
      "Use this break wisely — your future self will thank you.",
      "A focused revision session today means confidence tomorrow.",
      "You are smarter than you think. Keep going!",
      "Success is the sum of small efforts, repeated day in and day out.",
      "Every expert was once a beginner. Trust your process.",
      "Believe in yourself and your preparation.",
    ],
  },
  vacation: {
    badge: 'Vacation',
    heading: "School Vacation!",
    emoji: '🌴',
    accent: '#06b6d4',
    accentDark: '#22d3ee',
    quotes: [
      "Vacation mode: activated. Enjoy every second!",
      "Adventure awaits — go explore the world.",
      "Recharge fully so you return with full energy.",
      "The best part of vacation is the memories you create.",
      "Go places, make stories, come back inspired.",
      "Time to live, laugh, and take a big breath.",
    ],
  },
};

const DEFAULT_TYPE = 'sunday';

/**
 * SundayScheduleView / Holiday Empty State
 * Premium, animated, theme-aware empty-state card shown whenever school is closed:
 * Sundays, public/festival holidays, exam breaks, and vacations.
 *
 * @param {string} [holidayType] - "sunday" | "holiday" | "exam" | "vacation"
 * @param {string} [customMessage] - Optional override message
 * @returns {JSX.Element}
 */
export default function SundayScheduleView({ holidayType = DEFAULT_TYPE, customMessage }) {
  const config = HOLIDAY_CONFIGS[holidayType] || HOLIDAY_CONFIGS[DEFAULT_TYPE];

  // Stable random quote — only recomputed when holidayType changes
  const selectedQuote = useMemo(() => {
    const q = config.quotes;
    return q[Math.floor(Math.random() * q.length)];
  }, [holidayType]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="sch-ds-sunday-container"
      data-testid="school-container-sunday-schedule"
      data-holiday-type={holidayType}
    >
      {/* ── Decorative background orbs ── */}
      <div className="sch-ds-sunday-orb sch-ds-sunday-orb--1" aria-hidden="true" />
      <div className="sch-ds-sunday-orb sch-ds-sunday-orb--2" aria-hidden="true" />
      <div className="sch-ds-sunday-orb sch-ds-sunday-orb--3" aria-hidden="true" />

      {/* ── Floating particles ── */}
      <div className="sch-ds-sunday-particles" aria-hidden="true">
        {[...Array(12)].map((_, i) => (
          <span key={i} className={`sch-ds-sunday-particle sch-ds-sunday-particle--${i + 1}`} />
        ))}
      </div>

      {/* ── Illustration ── */}
      <div className="sch-ds-sunday-illustration">
        <svg
          viewBox="0 0 320 280"
          xmlns="http://www.w3.org/2000/svg"
          className="sch-ds-sunday-svg"
          aria-hidden="true"
          data-testid="school-svg-sunday-illustration"
        >
          <defs>
            {/* Sky wash */}
            <linearGradient id="pSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ddd6fe" stopOpacity="0.55" />
              <stop offset="60%" stopColor="#ede9fe" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#faf5ff" stopOpacity="0.2" />
            </linearGradient>
            {/* Moon */}
            <linearGradient id="pMoon" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fef9c3" />
              <stop offset="100%" stopColor="#fcd34d" />
            </linearGradient>
            {/* Moon glow */}
            <radialGradient id="pMoonGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
            </radialGradient>
            {/* Aurora streak */}
            <linearGradient id="pAurora" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity="0" />
              <stop offset="35%" stopColor="#c4b5fd" stopOpacity="0.32" />
              <stop offset="65%" stopColor="#a5f3fc" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
            </linearGradient>
            {/* Student body */}
            <linearGradient id="pBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#6d28d9" />
            </linearGradient>
            {/* Cushion */}
            <linearGradient id="pCushion" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
            {/* Book glow */}
            <radialGradient id="pBookGlow" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fef9c3" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#fef9c3" stopOpacity="0" />
            </radialGradient>
            {/* Rug */}
            <linearGradient id="pRug" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0" />
              <stop offset="25%" stopColor="#a78bfa" stopOpacity="0.45" />
              <stop offset="75%" stopColor="#a78bfa" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0" />
            </linearGradient>
            {/* Book gradients */}
            <linearGradient id="pBook1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" /><stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="pBook2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" /><stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <linearGradient id="pBook3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f472b6" /><stop offset="100%" stopColor="#db2777" />
            </linearGradient>
            {/* Drop shadow */}
            <filter id="pShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="#6d28d9" floodOpacity="0.13" />
            </filter>
            {/* Soft glow */}
            <filter id="pSoftGlow">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* ── Sky background ── */}
          <rect width="320" height="280" fill="url(#pSky)" rx="20" />

          {/* ── Aurora atmosphere streaks ── */}
          <path d="M0 82 Q80 65 160 78 Q240 90 320 70" stroke="url(#pAurora)" strokeWidth="22" fill="none" opacity="0.55" />
          <path d="M0 102 Q90 90 170 100 Q250 110 320 94" stroke="url(#pAurora)" strokeWidth="12" fill="none" opacity="0.35" />

          {/* ── Central scene glow ── */}
          <circle cx="160" cy="148" r="100" fill="url(#pMoonGlow)" opacity="0.45" className="sch-ds-sunday-svg-glow" />

          {/* ── Stars ── */}
          {[
            [24, 26, 2.2], [50, 14, 1.6], [84, 40, 1.9], [112, 20, 1.4],
            [148, 30, 1.7], [188, 12, 1.5], [30, 56, 1.4], [12, 80, 1.8],
            [296, 30, 2.0], [308, 56, 1.5],
          ].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="#fbbf24"
              opacity={0.45 + (i % 3) * 0.18}
              className={`sch-ds-sunday-star sch-ds-sunday-star--${(i % 10) + 1}`} />
          ))}

          {/* ── Moon (upper right, large) ── */}
          <circle cx="264" cy="52" r="58" fill="url(#pMoonGlow)" />
          <g className="sch-ds-sunday-moon">
            <circle cx="264" cy="52" r="38" fill="url(#pMoon)" filter="url(#pSoftGlow)" />
            {/* Crescent cutout */}
            <circle cx="282" cy="42" r="33" fill="#ede9fe" opacity="0.9" />
            {/* Crater details */}
            <circle cx="255" cy="58" r="2.8" fill="#fde68a" opacity="0.32" />
            <circle cx="268" cy="48" r="1.8" fill="#fde68a" opacity="0.22" />
            <circle cx="252" cy="46" r="1.4" fill="#fde68a" opacity="0.18" />
          </g>

          {/* ── Clouds ── */}
          <g className="sch-ds-sunday-cloud sch-ds-sunday-cloud--1" opacity="0.75">
            <ellipse cx="78" cy="60" rx="30" ry="12" fill="white" opacity="0.9" />
            <ellipse cx="62" cy="60" rx="20" ry="10" fill="white" opacity="0.9" />
            <ellipse cx="96" cy="62" rx="17" ry="9" fill="white" opacity="0.9" />
          </g>
          <g className="sch-ds-sunday-cloud sch-ds-sunday-cloud--2" opacity="0.55">
            <ellipse cx="196" cy="80" rx="22" ry="9" fill="white" opacity="0.85" />
            <ellipse cx="184" cy="80" rx="14" ry="8" fill="white" opacity="0.85" />
            <ellipse cx="210" cy="82" rx="13" ry="7" fill="white" opacity="0.85" />
          </g>

          {/* ── Rug / ground shadow ── */}
          <ellipse cx="160" cy="248" rx="128" ry="15" fill="url(#pRug)" className="sch-ds-sunday-rug" />
          <path d="M32 240 Q160 234 288 240" stroke="rgba(167,139,250,0.28)" strokeWidth="1.5" fill="none" />

          {/* ── Stacked books (left) ── */}
          <g className="sch-ds-sunday-books" filter="url(#pShadow)">
            {/* Bottom — wide green */}
            <rect x="44" y="206" width="54" height="30" rx="4.5" fill="url(#pBook1)" />
            <rect x="44" y="206" width="9" height="30" rx="3.5" fill="#047857" />
            <rect x="55" y="212" width="36" height="2.5" rx="1.5" fill="white" opacity="0.55" />
            <rect x="55" y="217" width="30" height="2" rx="1" fill="white" opacity="0.35" />
            <rect x="55" y="222" width="34" height="2" rx="1" fill="white" opacity="0.35" />
            {/* Middle — blue */}
            <rect x="48" y="186" width="46" height="22" rx="4" fill="url(#pBook2)" />
            <rect x="48" y="186" width="8" height="22" rx="3" fill="#1d4ed8" />
            <rect x="58" y="192" width="30" height="2.5" rx="1.5" fill="white" opacity="0.55" />
            <rect x="58" y="197" width="24" height="2" rx="1" fill="white" opacity="0.35" />
            {/* Top — pink */}
            <rect x="52" y="170" width="38" height="18" rx="3.5" fill="url(#pBook3)" />
            <rect x="52" y="170" width="7" height="18" rx="2.5" fill="#be185d" />
            <rect x="61" y="176" width="23" height="2" rx="1.5" fill="white" opacity="0.55" />
            <rect x="61" y="180" width="18" height="2" rx="1" fill="white" opacity="0.35" />
          </g>

          {/* ── Floating open book (upper right, animated) ── */}
          <g className="sch-ds-sunday-book-float" filter="url(#pShadow)">
            <ellipse cx="238" cy="152" rx="30" ry="17" fill="url(#pBookGlow)" opacity="0.75" />
            {/* Left page */}
            <path d="M210 142 Q224 138 238 142 L238 172 Q224 168 210 172 Z" fill="#fefce8" />
            {/* Right page */}
            <path d="M238 142 Q252 138 266 142 L266 172 Q252 168 238 172 Z" fill="#fff9c4" />
            {/* Spine */}
            <rect x="237" y="140" width="3" height="33" rx="1.5" fill="#d1d5db" />
            {/* Left page lines */}
            <line x1="216" y1="149" x2="234" y2="148" stroke="#c4b5fd" strokeWidth="1.3" opacity="0.65" />
            <line x1="216" y1="154" x2="234" y2="153" stroke="#c4b5fd" strokeWidth="1.3" opacity="0.65" />
            <line x1="216" y1="159" x2="234" y2="158" stroke="#c4b5fd" strokeWidth="1.3" opacity="0.5" />
            <line x1="216" y1="164" x2="232" y2="163" stroke="#c4b5fd" strokeWidth="1.3" opacity="0.45" />
            {/* Right page lines */}
            <line x1="242" y1="149" x2="260" y2="148" stroke="#a78bfa" strokeWidth="1.3" opacity="0.55" />
            <line x1="242" y1="154" x2="260" y2="153" stroke="#a78bfa" strokeWidth="1.3" opacity="0.55" />
            <line x1="242" y1="159" x2="258" y2="158" stroke="#a78bfa" strokeWidth="1.3" opacity="0.45" />
            <line x1="242" y1="164" x2="260" y2="163" stroke="#a78bfa" strokeWidth="1.3" opacity="0.4" />
          </g>

          {/* ── Coffee cup (right floor) ── */}
          <g className="sch-ds-sunday-coffee">
            <rect x="248" y="216" width="28" height="22" rx="5" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="1" />
            <path d="M276 221 Q287 221 287 229 Q287 237 276 237" stroke="#d1d5db" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <rect x="249" y="224" width="26" height="12" rx="3" fill="#78350f" opacity="0.6" />
            <ellipse cx="262" cy="224" rx="12.5" ry="3.5" fill="#fef3c7" opacity="0.85" />
            <path d="M255 212 Q257 207 255 202" stroke="#c4b5fd" strokeWidth="1.5" strokeLinecap="round" fill="none" className="sch-ds-sunday-steam sch-ds-sunday-steam--1" />
            <path d="M262 210 Q264 205 262 200" stroke="#c4b5fd" strokeWidth="1.5" strokeLinecap="round" fill="none" className="sch-ds-sunday-steam sch-ds-sunday-steam--2" />
            <path d="M269 212 Q271 207 269 202" stroke="#c4b5fd" strokeWidth="1.5" strokeLinecap="round" fill="none" className="sch-ds-sunday-steam sch-ds-sunday-steam--3" />
          </g>

          {/* ── Student — seated upright, cross-legged, reading ── */}
          <g className="sch-ds-sunday-student" filter="url(#pShadow)">
            {/* Cushion / mat */}
            <ellipse cx="160" cy="236" rx="50" ry="13" fill="url(#pCushion)" opacity="0.88" />
            <ellipse cx="160" cy="233" rx="44" ry="9" fill="#fed7aa" opacity="0.45" />
            {/* Left leg (cross-legged) */}
            <path d="M138 232 Q126 228 118 222 Q114 214 122 210 Q130 207 136 216 Q140 222 144 228" fill="#4f46e5" />
            {/* Right leg (cross-legged) */}
            <path d="M182 232 Q194 228 202 222 Q206 214 198 210 Q190 207 184 216 Q180 222 176 228" fill="#4f46e5" />
            {/* Shoes */}
            <ellipse cx="116" cy="218" rx="9" ry="5.5" fill="#1e1b4b" />
            <ellipse cx="204" cy="218" rx="9" ry="5.5" fill="#1e1b4b" />
            {/* Torso — upright */}
            <path d="M140 232 Q140 200 148 196 Q152 194 160 194 Q168 194 172 196 Q180 200 180 232 Z" fill="url(#pBody)" />
            {/* Collar */}
            <path d="M148 198 Q160 195 172 198" stroke="white" strokeWidth="1.5" fill="none" opacity="0.45" />
            {/* Left arm — relaxed on knee */}
            <path d="M142 210 Q132 218 124 226" stroke="#f4a580" strokeWidth="6" fill="none" strokeLinecap="round" />
            <circle cx="122" cy="228" r="5" fill="#f4a580" />
            {/* Right arm — holding open book */}
            <path d="M178 210 Q186 202 190 194" stroke="#f4a580" strokeWidth="6" fill="none" strokeLinecap="round" />
            {/* Book being held */}
            <g>
              {/* Left page */}
              <path d="M182 184 Q190 181 198 184 L198 206 Q190 203 182 206 Z" fill="#fefce8" />
              {/* Right page */}
              <path d="M198 184 Q206 181 214 184 L214 206 Q206 203 198 206 Z" fill="#fff9c4" />
              <rect x="197" y="183" width="2.5" height="24" rx="1" fill="#d1d5db" />
              <line x1="186" y1="190" x2="195" y2="189" stroke="#c4b5fd" strokeWidth="1.1" opacity="0.6" />
              <line x1="186" y1="194" x2="195" y2="193" stroke="#c4b5fd" strokeWidth="1.1" opacity="0.6" />
              <line x1="186" y1="198" x2="195" y2="197" stroke="#c4b5fd" strokeWidth="1.1" opacity="0.5" />
              <line x1="201" y1="190" x2="210" y2="189" stroke="#a78bfa" strokeWidth="1.1" opacity="0.55" />
              <line x1="201" y1="194" x2="210" y2="193" stroke="#a78bfa" strokeWidth="1.1" opacity="0.55" />
              <line x1="201" y1="198" x2="210" y2="197" stroke="#a78bfa" strokeWidth="1.1" opacity="0.45" />
            </g>
            {/* Head */}
            <circle cx="160" cy="186" r="18" fill="#f4a580" />
            {/* Hair */}
            <path d="M143 181 Q144 167 160 165 Q176 167 177 181 Q172 172 160 171 Q148 172 143 181" fill="#7c3aed" opacity="0.95" />
            {/* Ears */}
            <ellipse cx="142" cy="187" rx="3.5" ry="4.5" fill="#f4a580" />
            <ellipse cx="178" cy="187" rx="3.5" ry="4.5" fill="#f4a580" />
            {/* Eyes — focused downward reading */}
            <ellipse cx="154" cy="187" rx="3" ry="3.5" fill="#1e1b4b" />
            <ellipse cx="166" cy="187" rx="3" ry="3.5" fill="#1e1b4b" />
            <circle cx="155.2" cy="186" r="1" fill="white" />
            <circle cx="167.2" cy="186" r="1" fill="white" />
            {/* Eyebrows (focused) */}
            <path d="M151 182 Q154 180.5 157 182" stroke="#7c3aed" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            <path d="M163 182 Q166 180.5 169 182" stroke="#7c3aed" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            {/* Gentle smile */}
            <path d="M155 193 Q160 197 165 193" stroke="#92400e" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          </g>

          {/* ── Floating star (left, animated) ── */}
          <g className="sch-ds-sunday-floatstar">
            <path d="M50,122 L53.5,132 L64,132 L55.5,138.5 L59,148.5 L50,142 L41,148.5 L44.5,138.5 L36,132 L46.5,132 Z"
              fill="#fbbf24" opacity="0.82" />
          </g>

          {/* ── Hearts ── */}
          <g className="sch-ds-sunday-hearts">
            <path d="M28 152 C28 146 34 143 37 146 C40 143 46 146 46 152 C46 160 37 167 37 167 C37 167 28 160 28 152 Z"
              fill="#f472b6" opacity="0.68" className="sch-ds-sunday-heart sch-ds-sunday-heart--1" />
            <path d="M280 164 C280 159 285 157 287 159 C289 157 294 159 294 164 C294 171 287 177 287 177 C287 177 280 171 280 164 Z"
              fill="#fb7185" opacity="0.58" className="sch-ds-sunday-heart sch-ds-sunday-heart--2" />
          </g>

          {/* ── Sparkles ── */}
          <g className="sch-ds-sunday-sparkles">
            <g className="sch-ds-sunday-sparkle sch-ds-sunday-sparkle--1">
              <line x1="174" y1="100" x2="174" y2="110" stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="169" y1="105" x2="179" y2="105" stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" />
            </g>
            <g className="sch-ds-sunday-sparkle sch-ds-sunday-sparkle--2">
              <line x1="106" y1="88" x2="106" y2="96" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="102" y1="92" x2="110" y2="92" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round" />
            </g>
            <g className="sch-ds-sunday-sparkle sch-ds-sunday-sparkle--3">
              <line x1="224" y1="118" x2="224" y2="126" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="220" y1="122" x2="228" y2="122" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" />
            </g>
          </g>
        </svg>
      </div>

      {/* ── Content ── */}
      <div className="sch-ds-sunday-content">
        <span className="sch-ds-sunday-badge" data-testid="school-badge-holiday-type">
          {config.badge}
        </span>
        <h1 className="sch-ds-sunday-heading" data-testid="school-heading-sunday">
          {config.heading} <span className="sch-ds-sunday-emoji">{config.emoji}</span>
        </h1>
        <p className="sch-ds-sunday-quote" data-testid="school-text-sunday-quote">
          {customMessage || selectedQuote}
        </p>
        <p className="sch-ds-sunday-subtext">
          No classes today. Take time to relax and prepare for the week ahead.
        </p>
      </div>
    </div>
  );
}

SundayScheduleView.propTypes = {
  /** Holiday type key — determines messaging and accent */
  holidayType: PropTypes.oneOf(['sunday', 'holiday', 'exam', 'vacation']),
  /** Optional fixed override message (skips random quote) */
  customMessage: PropTypes.string,
};
