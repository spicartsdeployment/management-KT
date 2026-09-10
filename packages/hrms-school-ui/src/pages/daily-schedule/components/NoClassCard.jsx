import React from "react";
import PropTypes from 'prop-types';

/* ─────────────────────────────────────────────────────────────────────────────
 * FREE_PERIOD_THEMES
 * 8 distinct themes — each period slot gets one deterministically.
 * All illustrations are inline SVG, zero external assets.
 * ───────────────────────────────────────────────────────────────────────────── */
const FREE_PERIOD_THEMES = [
  /* 1 — Relax on the sofa */
  {
    message: "Enjoy your free period!",
    subLabel: "Sit back & unwind",
    gradient: "linear-gradient(145deg,#fff7ed 0%,#fed7aa 60%,#fbbf24 100%)",
    tagBg: "rgba(251,146,60,0.16)",
    tagColor: "#c2410c",
    illustration: (
      <svg viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="ncGrad1" x1="0" y1="0" x2="160" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff7ed"/><stop offset="1" stopColor="#fde68a"/>
          </linearGradient>
        </defs>
        <rect width="160" height="100" fill="url(#ncGrad1)"/>
        {/* sofa */}
        <rect x="18" y="52" width="18" height="26" rx="7" fill="#ea580c"/>
        <rect x="124" y="52" width="18" height="26" rx="7" fill="#ea580c"/>
        <rect x="28" y="44" width="104" height="22" rx="8" fill="#f97316" opacity="0.9"/>
        <rect x="28" y="60" width="104" height="24" rx="10" fill="#fb923c" opacity="0.85"/>
        <rect x="38" y="84" width="8" height="10" rx="3" fill="#c2410c"/>
        <rect x="114" y="84" width="8" height="10" rx="3" fill="#c2410c"/>
        {/* cushion */}
        <ellipse cx="80" cy="60" rx="22" ry="8" fill="#fed7aa" opacity="0.85"/>
        {/* student body */}
        <ellipse cx="80" cy="48" rx="10" ry="11" fill="#fbbf24"/>
        {/* head */}
        <circle cx="80" cy="31" r="11" fill="#fde68a"/>
        <ellipse cx="80" cy="21" rx="11" ry="6" fill="#92400e"/>
        <ellipse cx="75.5" cy="31" rx="1.4" ry="1.8" fill="#1f2937"/>
        <ellipse cx="84.5" cy="31" rx="1.4" ry="1.8" fill="#1f2937"/>
        <path d="M76 36 Q80 40 84 36" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        {/* book */}
        <rect x="62" y="51" width="14" height="18" rx="3" fill="#6366f1"/>
        <line x1="69" y1="51" x2="69" y2="69" stroke="white" strokeWidth="1"/>
        <line x1="63" y1="57" x2="68" y2="57" stroke="white" strokeWidth="1" opacity="0.7"/>
        <line x1="63" y1="62" x2="68" y2="62" stroke="white" strokeWidth="1" opacity="0.7"/>
        {/* sparkles */}
        <circle cx="132" cy="18" r="2.5" fill="#fbbf24" opacity="0.7"/>
        <circle cx="142" cy="34" r="1.5" fill="#fb923c" opacity="0.6"/>
        <circle cx="24" cy="26" r="2" fill="#a78bfa" opacity="0.5"/>
        <circle cx="18" cy="40" r="1.5" fill="#f472b6" opacity="0.45"/>
      </svg>
    ),
  },
  /* 2 — Study desk */
  {
    message: "Self study session",
    subLabel: "Focus & level up",
    gradient: "linear-gradient(145deg,#f0fdf4 0%,#d1fae5 60%,#6ee7b7 100%)",
    tagBg: "rgba(16,185,129,0.14)",
    tagColor: "#047857",
    illustration: (
      <svg viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="ncGrad2" x1="0" y1="0" x2="160" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ecfdf5"/><stop offset="1" stopColor="#6ee7b7"/>
          </linearGradient>
        </defs>
        <rect width="160" height="100" fill="url(#ncGrad2)"/>
        {/* desk */}
        <rect x="20" y="68" width="120" height="7" rx="4" fill="#6b7280" opacity="0.28"/>
        <rect x="30" y="75" width="6" height="18" rx="3" fill="#6b7280" opacity="0.22"/>
        <rect x="124" y="75" width="6" height="18" rx="3" fill="#6b7280" opacity="0.22"/>
        {/* laptop */}
        <rect x="50" y="44" width="60" height="37" rx="5" fill="#1f2937"/>
        <rect x="53" y="47" width="54" height="29" rx="3" fill="#38bdf8" opacity="0.85"/>
        <rect x="57" y="51" width="30" height="3" rx="2" fill="white" opacity="0.7"/>
        <rect x="57" y="57" width="44" height="2" rx="1" fill="white" opacity="0.4"/>
        <rect x="57" y="62" width="38" height="2" rx="1" fill="white" opacity="0.4"/>
        <rect x="57" y="67" width="25" height="2" rx="1" fill="white" opacity="0.4"/>
        <rect x="42" y="81" width="76" height="6" rx="3" fill="#374151" opacity="0.55"/>
        {/* books */}
        <rect x="118" y="56" width="18" height="12" rx="2" fill="#f59e0b"/>
        <rect x="118" y="49" width="18" height="10" rx="2" fill="#6366f1"/>
        <rect x="118" y="43" width="18" height="9" rx="2" fill="#ec4899"/>
        {/* head */}
        <circle cx="80" cy="28" r="12" fill="#fde68a"/>
        <ellipse cx="80" cy="17" rx="12" ry="7" fill="#92400e"/>
        <ellipse cx="74.5" cy="28" rx="1.4" ry="1.7" fill="#1f2937"/>
        <ellipse cx="85.5" cy="28" rx="1.4" ry="1.7" fill="#1f2937"/>
        {/* thought dots */}
        <circle cx="96" cy="18" r="2" fill="#6366f1" opacity="0.7"/>
        <circle cx="103" cy="13" r="1.5" fill="#6366f1" opacity="0.5"/>
        <circle cx="109" cy="9" r="1" fill="#6366f1" opacity="0.35"/>
        {/* pencil */}
        <rect x="20" y="52" width="4" height="22" rx="2" fill="#fbbf24" transform="rotate(-22 20 52)"/>
        <polygon points="18,73 22,73 20,80" fill="#f87171" transform="rotate(-22 20 52)"/>
      </svg>
    ),
  },
  /* 3 — Coffee break */
  {
    message: "Take a quick refresh break",
    subLabel: "Recharge your mind",
    gradient: "linear-gradient(145deg,#eff6ff 0%,#dbeafe 60%,#93c5fd 100%)",
    tagBg: "rgba(59,130,246,0.12)",
    tagColor: "#1d4ed8",
    illustration: (
      <svg viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="ncGrad3" x1="0" y1="0" x2="160" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#eff6ff"/><stop offset="1" stopColor="#bfdbfe"/>
          </linearGradient>
        </defs>
        <rect width="160" height="100" fill="url(#ncGrad3)"/>
        {/* mug */}
        <rect x="50" y="46" width="44" height="40" rx="8" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1.5"/>
        <path d="M94 56 Q110 56 110 66 Q110 76 94 76" stroke="#d1d5db" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <rect x="54" y="56" width="36" height="27" rx="5" fill="#92400e" opacity="0.72"/>
        <ellipse cx="72" cy="56" rx="18" ry="5" fill="#fef3c7" opacity="0.9"/>
        {/* steam */}
        <path d="M60 39 Q63 32 60 25" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M72 36 Q75 29 72 22" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M84 39 Q87 32 84 25" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" fill="none"/>
        {/* plate */}
        <ellipse cx="72" cy="86" rx="30" ry="5" fill="#e5e7eb" opacity="0.65"/>
        {/* cookie */}
        <circle cx="116" cy="70" r="12" fill="#fbbf24" opacity="0.85"/>
        <circle cx="112" cy="67" r="2" fill="#92400e" opacity="0.6"/>
        <circle cx="118" cy="72" r="2" fill="#92400e" opacity="0.6"/>
        <circle cx="114" cy="76" r="1.5" fill="#92400e" opacity="0.5"/>
        {/* plant */}
        <rect x="22" y="66" width="8" height="17" rx="3" fill="#92400e" opacity="0.38"/>
        <ellipse cx="26" cy="61" rx="10" ry="10" fill="#22c55e" opacity="0.68"/>
        <ellipse cx="19" cy="66" rx="7" ry="7" fill="#16a34a" opacity="0.58"/>
        <ellipse cx="33" cy="65" rx="7" ry="7" fill="#15803d" opacity="0.5"/>
        {/* stars */}
        <circle cx="140" cy="20" r="2" fill="#fbbf24" opacity="0.6"/>
        <circle cx="130" cy="11" r="1.5" fill="#60a5fa" opacity="0.5"/>
        <circle cx="146" cy="33" r="1.5" fill="#a78bfa" opacity="0.5"/>
      </svg>
    ),
  },
  /* 4 — Backpack / prep */
  {
    message: "Prepare for your next class",
    subLabel: "Get ready to shine",
    gradient: "linear-gradient(145deg,#fdf4ff 0%,#f3e8ff 60%,#c4b5fd 100%)",
    tagBg: "rgba(168,85,247,0.12)",
    tagColor: "#7e22ce",
    illustration: (
      <svg viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="ncGrad4" x1="0" y1="0" x2="160" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fdf4ff"/><stop offset="1" stopColor="#d8b4fe"/>
          </linearGradient>
        </defs>
        <rect width="160" height="100" fill="url(#ncGrad4)"/>
        {/* backpack */}
        <rect x="52" y="32" width="50" height="57" rx="12" fill="#8b5cf6"/>
        <rect x="65" y="26" width="24" height="14" rx="8" fill="#7c3aed"/>
        <path d="M52 44 Q43 52 43 67 Q43 80 52 84" stroke="#6d28d9" strokeWidth="3" strokeLinecap="round" fill="none"/>
        <path d="M102 44 Q111 52 111 67 Q111 80 102 84" stroke="#6d28d9" strokeWidth="3" strokeLinecap="round" fill="none"/>
        <rect x="60" y="63" width="34" height="20" rx="8" fill="#7c3aed"/>
        <line x1="68" y1="63" x2="86" y2="63" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="86" cy="63" r="2.5" fill="#c4b5fd"/>
        <line x1="60" y1="49" x2="94" y2="49" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round"/>
        {/* books peeking */}
        <rect x="60" y="18" width="10" height="17" rx="2" fill="#f59e0b"/>
        <rect x="72" y="16" width="10" height="19" rx="2" fill="#ef4444"/>
        <rect x="84" y="19" width="10" height="16" rx="2" fill="#22c55e"/>
        {/* checklist */}
        <rect x="118" y="54" width="28" height="34" rx="5" fill="white" opacity="0.84"/>
        <line x1="124" y1="64" x2="140" y2="64" stroke="#d1d5db" strokeWidth="1.5"/>
        <line x1="124" y1="71" x2="140" y2="71" stroke="#d1d5db" strokeWidth="1.5"/>
        <line x1="124" y1="78" x2="136" y2="78" stroke="#d1d5db" strokeWidth="1.5"/>
        <circle cx="121" cy="64" r="2" fill="#22c55e"/>
        <circle cx="121" cy="71" r="2" fill="#22c55e"/>
        <circle cx="121" cy="78" r="2" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1"/>
        {/* sparkles */}
        <circle cx="26" cy="22" r="3" fill="#fbbf24" opacity="0.55"/>
        <circle cx="20" cy="38" r="2" fill="#f472b6" opacity="0.45"/>
        <circle cx="136" cy="20" r="2.5" fill="#a78bfa" opacity="0.55"/>
        <circle cx="143" cy="36" r="2" fill="#60a5fa" opacity="0.45"/>
      </svg>
    ),
  },
  /* 5 — Waiting for substitute */
  {
    message: "Waiting for sub teacher",
    subLabel: "Hang tight!",
    gradient: "linear-gradient(145deg,#fff1f2 0%,#ffe4e6 60%,#fda4af 100%)",
    tagBg: "rgba(244,63,94,0.11)",
    tagColor: "#be123c",
    illustration: (
      <svg viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="ncGrad5" x1="0" y1="0" x2="160" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff1f2"/><stop offset="1" stopColor="#fda4af"/>
          </linearGradient>
        </defs>
        <rect width="160" height="100" fill="url(#ncGrad5)"/>
        {/* blackboard */}
        <rect x="28" y="12" width="100" height="55" rx="6" fill="#1e3a2f"/>
        <rect x="32" y="16" width="92" height="47" rx="4" fill="#166534" opacity="0.8"/>
        <text x="50" y="46" fontSize="24" fill="white" opacity="0.45" fontFamily="Georgia,serif">?</text>
        <text x="76" y="43" fontSize="18" fill="white" opacity="0.32" fontFamily="Georgia,serif">?</text>
        <text x="98" y="48" fontSize="20" fill="white" opacity="0.38" fontFamily="Georgia,serif">?</text>
        <rect x="28" y="65" width="100" height="6" rx="2" fill="#374151" opacity="0.45"/>
        <rect x="48" y="66" width="10" height="4" rx="2" fill="white" opacity="0.75"/>
        <rect x="62" y="66" width="8" height="4" rx="2" fill="#fde68a" opacity="0.75"/>
        {/* empty chair */}
        <rect x="58" y="74" width="40" height="5" rx="2" fill="#92400e" opacity="0.45"/>
        <rect x="61" y="79" width="6" height="14" rx="2" fill="#92400e" opacity="0.4"/>
        <rect x="89" y="79" width="6" height="14" rx="2" fill="#92400e" opacity="0.4"/>
        <rect x="58" y="84" width="40" height="4" rx="2" fill="#92400e" opacity="0.35"/>
        {/* clock */}
        <circle cx="128" cy="30" r="14" fill="white" opacity="0.85" stroke="#fda4af" strokeWidth="2"/>
        <circle cx="128" cy="30" r="2" fill="#be123c"/>
        <line x1="128" y1="30" x2="128" y2="19" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="128" y1="30" x2="136" y2="33" stroke="#be123c" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="128" y1="16" x2="128" y2="18" stroke="#9ca3af" strokeWidth="1"/>
        <line x1="128" y1="42" x2="128" y2="44" stroke="#9ca3af" strokeWidth="1"/>
        <line x1="114" y1="30" x2="116" y2="30" stroke="#9ca3af" strokeWidth="1"/>
        <line x1="140" y1="30" x2="142" y2="30" stroke="#9ca3af" strokeWidth="1"/>
        {/* animated waiting dots */}
        <circle cx="18" cy="58" r="3" fill="#fb7185" opacity="0.7">
          <animate attributeName="opacity" values="0.7;0.15;0.7" dur="1.2s" begin="0s" repeatCount="indefinite"/>
        </circle>
        <circle cx="28" cy="58" r="3" fill="#fb7185" opacity="0.7">
          <animate attributeName="opacity" values="0.7;0.15;0.7" dur="1.2s" begin="0.4s" repeatCount="indefinite"/>
        </circle>
        <circle cx="38" cy="58" r="3" fill="#fb7185" opacity="0.7">
          <animate attributeName="opacity" values="0.7;0.15;0.7" dur="1.2s" begin="0.8s" repeatCount="indefinite"/>
        </circle>
      </svg>
    ),
  },
  /* 6 — Outdoor recharge */
  {
    message: "Time to recharge!",
    subLabel: "Deep breath & relax",
    gradient: "linear-gradient(145deg,#f0fdf4 0%,#dcfce7 60%,#86efac 100%)",
    tagBg: "rgba(34,197,94,0.12)",
    tagColor: "#15803d",
    illustration: (
      <svg viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="ncGrad6" x1="0" y1="0" x2="160" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f0fdf4"/><stop offset="1" stopColor="#86efac"/>
          </linearGradient>
        </defs>
        <rect width="160" height="100" fill="url(#ncGrad6)"/>
        {/* ground */}
        <ellipse cx="80" cy="96" rx="72" ry="12" fill="#86efac" opacity="0.38"/>
        {/* tree */}
        <rect x="75" y="58" width="10" height="30" rx="4" fill="#92400e" opacity="0.45"/>
        <ellipse cx="80" cy="50" rx="26" ry="22" fill="#22c55e" opacity="0.72"/>
        <ellipse cx="63" cy="59" rx="17" ry="15" fill="#16a34a" opacity="0.62"/>
        <ellipse cx="97" cy="57" rx="17" ry="15" fill="#15803d" opacity="0.55"/>
        {/* sun */}
        <circle cx="131" cy="21" r="13" fill="#fbbf24" opacity="0.8"/>
        <line x1="131" y1="4" x2="131" y2="8" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
        <line x1="131" y1="34" x2="131" y2="38" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
        <line x1="114" y1="21" x2="118" y2="21" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
        <line x1="144" y1="21" x2="148" y2="21" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
        <line x1="118" y1="8" x2="121" y2="11" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
        <line x1="144" y1="34" x2="141" y2="31" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
        {/* student under tree */}
        <circle cx="36" cy="63" r="10" fill="#fde68a"/>
        <ellipse cx="36" cy="54" rx="10" ry="6" fill="#92400e" opacity="0.68"/>
        <ellipse cx="36" cy="73" rx="12" ry="8" fill="#6366f1" opacity="0.72"/>
        <ellipse cx="28" cy="83" rx="7" ry="4" fill="#6366f1" opacity="0.55"/>
        <ellipse cx="44" cy="83" rx="7" ry="4" fill="#6366f1" opacity="0.55"/>
        <path d="M31 65 Q36 69 41 65" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        {/* closed eyes */}
        <path d="M32 62 Q34 60 36 62" stroke="#1f2937" strokeWidth="1" strokeLinecap="round" fill="none"/>
        <path d="M36 62 Q38 60 40 62" stroke="#1f2937" strokeWidth="1" strokeLinecap="round" fill="none"/>
        {/* birds */}
        <path d="M15 22 Q18 19 21 22" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M22 18 Q25 15 28 18" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        {/* cloud */}
        <ellipse cx="16" cy="38" rx="11" ry="7" fill="white" opacity="0.7"/>
        <ellipse cx="24" cy="34" rx="8" ry="7" fill="white" opacity="0.7"/>
        <ellipse cx="10" cy="34" rx="6" ry="5" fill="white" opacity="0.62"/>
      </svg>
    ),
  },
  /* 7 — Friends chat */
  {
    message: "Catch up with friends!",
    subLabel: "Stay social & energised",
    gradient: "linear-gradient(145deg,#fffbeb 0%,#fef3c7 60%,#fcd34d 100%)",
    tagBg: "rgba(245,158,11,0.12)",
    tagColor: "#b45309",
    illustration: (
      <svg viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="ncGrad7" x1="0" y1="0" x2="160" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fffbeb"/><stop offset="1" stopColor="#fcd34d"/>
          </linearGradient>
        </defs>
        <rect width="160" height="100" fill="url(#ncGrad7)"/>
        {/* ground strip */}
        <rect x="10" y="78" width="140" height="5" rx="3" fill="#fbbf24" opacity="0.28"/>
        {/* student 1 */}
        <circle cx="42" cy="36" r="12" fill="#fde68a"/>
        <ellipse cx="42" cy="25" rx="12" ry="7" fill="#92400e" opacity="0.68"/>
        <ellipse cx="42" cy="49" rx="14" ry="10" fill="#6366f1" opacity="0.78"/>
        <path d="M37 38 Q42 42 47 38" stroke="#92400e" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        {/* student 2 */}
        <circle cx="80" cy="33" r="12" fill="#fcd34d"/>
        <ellipse cx="80" cy="22" rx="12" ry="7" fill="#1f2937" opacity="0.68"/>
        <ellipse cx="80" cy="46" rx="14" ry="10" fill="#f43f5e" opacity="0.78"/>
        <path d="M75 35 Q80 39 85 35" stroke="#92400e" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        {/* student 3 */}
        <circle cx="118" cy="36" r="12" fill="#fde68a"/>
        <ellipse cx="118" cy="25" rx="12" ry="7" fill="#c2410c" opacity="0.62"/>
        <ellipse cx="118" cy="49" rx="14" ry="10" fill="#22c55e" opacity="0.78"/>
        <path d="M113 38 Q118 42 123 38" stroke="#92400e" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        {/* speech bubble from student 2 */}
        <rect x="88" y="10" width="40" height="18" rx="8" fill="white" opacity="0.88"/>
        <polygon points="98,28 106,28 102,34" fill="white" opacity="0.88"/>
        <circle cx="98" cy="19" r="2.5" fill="#f59e0b"/>
        <circle cx="108" cy="19" r="2.5" fill="#f59e0b"/>
        <circle cx="118" cy="19" r="2.5" fill="#f59e0b"/>
        {/* sparkles */}
        <circle cx="20" cy="18" r="2.5" fill="#f472b6" opacity="0.55"/>
        <circle cx="28" cy="10" r="1.5" fill="#a78bfa" opacity="0.48"/>
        <circle cx="146" cy="64" r="2" fill="#60a5fa" opacity="0.48"/>
      </svg>
    ),
  },
  /* 8 — Review notes */
  {
    message: "Review your notes",
    subLabel: "Reinforce what you know",
    gradient: "linear-gradient(145deg,#f8fafc 0%,#e2e8f0 60%,#94a3b8 100%)",
    tagBg: "rgba(100,116,139,0.12)",
    tagColor: "#334155",
    illustration: (
      <svg viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="ncGrad8" x1="0" y1="0" x2="160" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f8fafc"/><stop offset="1" stopColor="#94a3b8"/>
          </linearGradient>
        </defs>
        <rect width="160" height="100" fill="url(#ncGrad8)"/>
        {/* notebook */}
        <rect x="36" y="16" width="68" height="74" rx="8" fill="#1e40af"/>
        <rect x="42" y="22" width="56" height="62" rx="5" fill="white"/>
        {/* spiral */}
        <circle cx="36" cy="30" r="4" fill="#60a5fa" stroke="white" strokeWidth="1"/>
        <circle cx="36" cy="43" r="4" fill="#60a5fa" stroke="white" strokeWidth="1"/>
        <circle cx="36" cy="56" r="4" fill="#60a5fa" stroke="white" strokeWidth="1"/>
        <circle cx="36" cy="69" r="4" fill="#60a5fa" stroke="white" strokeWidth="1"/>
        <circle cx="36" cy="79" r="4" fill="#60a5fa" stroke="white" strokeWidth="1"/>
        {/* lines */}
        <line x1="48" y1="34" x2="90" y2="34" stroke="#e2e8f0" strokeWidth="1.5"/>
        <line x1="48" y1="43" x2="90" y2="43" stroke="#e2e8f0" strokeWidth="1.5"/>
        <line x1="48" y1="52" x2="90" y2="52" stroke="#e2e8f0" strokeWidth="1.5"/>
        <line x1="48" y1="61" x2="90" y2="61" stroke="#e2e8f0" strokeWidth="1.5"/>
        <line x1="48" y1="70" x2="76" y2="70" stroke="#e2e8f0" strokeWidth="1.5"/>
        {/* written text */}
        <rect x="48" y="30" width="32" height="3" rx="1.5" fill="#6366f1" opacity="0.6"/>
        <rect x="48" y="39" width="40" height="2.5" rx="1.2" fill="#374151" opacity="0.28"/>
        <rect x="48" y="48" width="36" height="2.5" rx="1.2" fill="#374151" opacity="0.28"/>
        <rect x="48" y="57" width="42" height="2.5" rx="1.2" fill="#374151" opacity="0.28"/>
        <rect x="48" y="66" width="26" height="2.5" rx="1.2" fill="#374151" opacity="0.28"/>
        {/* highlighter */}
        <rect x="112" y="28" width="6" height="52" rx="3" fill="#fbbf24" transform="rotate(16 112 28)"/>
        <polygon points="112,78 118,78 115,86" fill="#f59e0b" transform="rotate(16 112 28)"/>
        {/* sticky notes */}
        <rect x="116" y="18" width="26" height="24" rx="3" fill="#fde68a" opacity="0.88"/>
        <line x1="120" y1="26" x2="138" y2="26" stroke="#f59e0b" strokeWidth="1" opacity="0.65"/>
        <line x1="120" y1="31" x2="138" y2="31" stroke="#f59e0b" strokeWidth="1" opacity="0.65"/>
        <line x1="120" y1="36" x2="131" y2="36" stroke="#f59e0b" strokeWidth="1" opacity="0.65"/>
        <rect x="112" y="52" width="26" height="22" rx="3" fill="#bbf7d0" opacity="0.88" transform="rotate(-5 112 52)"/>
        {/* magnifying glass */}
        <circle cx="22" cy="57" r="14" fill="none" stroke="#94a3b8" strokeWidth="2.5"/>
        <circle cx="22" cy="57" r="10" fill="white" opacity="0.55"/>
        <line x1="32" y1="67" x2="42" y2="77" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    ),
  },
];

/**
 * Derives a visually darker/more opaque version of an rgba background color
 * for use as the period tag chip background.
 * @param {string} rgbaColor
 * @returns {string}
 */
function getDarkerTagColor(rgbaColor) {
  if (!rgbaColor) return 'rgba(55, 65, 81, 0.2)';
  const m = rgbaColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d.]+)?\)/);
  if (m) {
    const r = Math.round(parseInt(m[1]) * 0.7);
    const g = Math.round(parseInt(m[2]) * 0.7);
    const b = Math.round(parseInt(m[3]) * 0.7);
    const a = Math.min(parseFloat(m[4] || 1) * 3, 0.5);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  return 'rgba(55, 65, 81, 0.2)';
}

/**
 * NoClassCard Component
 * Renders an engaging, themed free-period card.
 * When image + color props are provided (injected by normalizeTimetable),
 * shows a real Unsplash subject banner and soft tinted background.
 * Falls back to the original inline SVG themed illustrations when no props.
 * @param {number} period - Period number (1–8)
 * @param {string} from - Start time e.g. "08:00"
 * @param {string} to - End time e.g. "08:45"
 * @param {string} [image] - Unsplash banner image URL (from subjectVisuals fallback)
 * @param {string} [color] - rgba background tint (from subjectVisuals fallback)
 * @returns {JSX.Element}
 */
export default function NoClassCard({ period, from, to, image, color }) {
  const idx = Math.max(0, (period || 1) - 1) % FREE_PERIOD_THEMES.length;
  const theme = FREE_PERIOD_THEMES[idx];

  return (
    <div
      className="sch-ds-free-period-card"
      style={{ background: color || theme.gradient }}
      data-testid="school-card-no-class"
      data-period={period}
    >
      {/* Header: period tag + "Free Period" chip */}
      <div className="sch-ds-free-period-card__header">
        <span
          className="sch-ds-free-period-card__tag"
          style={{
            background: color ? getDarkerTagColor(color) : theme.tagBg,
            color: color ? '#374151' : theme.tagColor,
          }}
          data-testid="school-label-free-period"
        >
          {period ? `Period ${period}` : 'Free'}
        </span>
        <span className="sch-ds-free-period-card__chip">Free Period</span>
      </div>

      {/* Illustration: Unsplash subject image when available, SVG theme otherwise */}
      <div className="sch-ds-free-period-card__illustration">
        {image ? (
          <img
            src={image}
            alt=""
            aria-hidden="true"
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div aria-hidden="true" style={{ width: '100%', height: '100%' }}>
            {theme.illustration}
          </div>
        )}
      </div>

      {/* Footer: message + time */}
      <div className="sch-ds-free-period-card__footer">
        <div className="sch-ds-free-period-card__message-group">
          <span className="sch-ds-free-period-card__message">{theme.message}</span>
          <span className="sch-ds-free-period-card__sublabel">{theme.subLabel}</span>
        </div>
        {from && to && (
          <div className="sch-ds-free-period-card__time">
            <svg
              className="sch-ds-free-period-card__time-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" strokeWidth="2"/>
              <path strokeWidth="2" d="M12 6v6l4 2"/>
            </svg>
            <span>{from} – {to}</span>
          </div>
        )}
      </div>
    </div>
  );
}

NoClassCard.propTypes = {
  period: PropTypes.number,
  from: PropTypes.string,
  to: PropTypes.string,
  image: PropTypes.string,
  color: PropTypes.string,
};
