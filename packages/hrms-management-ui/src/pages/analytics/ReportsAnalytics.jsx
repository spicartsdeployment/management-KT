/* eslint-disable react/prop-types */
import React, { useState, useMemo, useCallback } from "react";
import "../../Assets/styles/ReportsAnalytics.scss";
import ManagementPageHeader from "../../app/components/common/ManagementPageHeader";

// ─── Design tokens ────────────────────────────────────────────────────────────
const GOLD   = "#c9a962";
const GREEN  = "#16a34a";
const RED    = "#dc2626";
const BLUE   = "#2563eb";
const AMBER  = "#d97706";
const PURPLE = "#7c3aed";
const TEAL   = "#0891b2";

// ─── Tab definitions ─────────────────────────────────────────────────────────
const TABS = [
  { id: "overview",      label: "Overview",             icon: "🏠" },
  { id: "fees",          label: "Fees Analytics",        icon: "💰" },
  { id: "attendance",    label: "Attendance Analytics",  icon: "📅" },
  { id: "transport",     label: "Transport Analytics",   icon: "🚌" },
  { id: "academic",      label: "Academic Analytics",    icon: "🎓" },
  { id: "staff",         label: "Staff Analytics",       icon: "👥" },
  { id: "events",        label: "Events Analytics",      icon: "🎭" },
  { id: "grievance",     label: "Grievance Analytics",   icon: "📣" },
  { id: "alumni",        label: "Alumni Analytics",      icon: "🏛️" },
  { id: "operational",   label: "Operational Insights",  icon: "⚙️" },
  { id: "export",        label: "Export & Reports",      icon: "📤" },
];

const BRANCH_OPTIONS  = ["All Branches","North Campus","South Campus","East Wing"];
const CLASS_OPTIONS   = ["All Classes","Class 1","Class 6","Class 9","Class 10","Class 12"];
const SECTION_OPTIONS = ["All Sections","Section A","Section B","Section C"];
const YEAR_OPTIONS    = ["2025-26","2024-25","2023-24"];
const TERM_OPTIONS    = ["All Terms","Term 1","Term 2","Term 3"];
const FEE_STATUS      = ["All Status","Paid","Pending","Overdue","Partial"];

// ─── SVG Primitives ───────────────────────────────────────────────────────────
const SparkLine = ({ data, color = GOLD, h = 40, w = 120 }) => {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} className="ra-sparkline">
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={pts} />
      <circle cx={pts.split(" ").pop().split(",")[0]} cy={pts.split(" ").pop().split(",")[1]} r="3" fill={color} />
    </svg>
  );
};

const DonutChart = ({ value, total, color = GOLD, size = 72, label }) => {
  const pct   = total > 0 ? (value / total) * 100 : 0;
  const r     = (size - 10) / 2;
  const circ  = 2 * Math.PI * r;
  const dash  = (pct / 100) * circ;
  return (
    <div className="ra-donut">
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--ra-line)" strokeWidth="8" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round" />
      </svg>
      <div className="ra-donut__center">
        <span className="ra-donut__pct">{Math.round(pct)}%</span>
        {label && <span className="ra-donut__lbl">{label}</span>}
      </div>
    </div>
  );
};

const MiniBar = ({ value, max, color = GOLD }) => (
  <div className="ra-minibar">
    <div className="ra-minibar__fill" style={{ width: `${Math.min(100,(value/max)*100)}%`, background: color }} />
  </div>
);

const BarChart = ({ data, color = GOLD, h = 120 }) => {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div className="ra-barchart" style={{ height: h }}>
      {data.map((d, i) => (
        <div key={i} className="ra-barchart__col">
          <div className="ra-barchart__bar" style={{ height: `${(d.value/max)*100}%`, background: color }} />
          <span className="ra-barchart__lbl">{d.label}</span>
        </div>
      ))}
    </div>
  );
};

const AreaChart = ({ data, color = GOLD, h = 80, w = 300 }) => {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 6) - 3;
    return [x, y];
  });
  const area = `M${pts[0][0]},${h} ` + pts.map(p => `L${p[0]},${p[1]}`).join(" ") + ` L${pts[pts.length-1][0]},${h} Z`;
  const line = `M${pts.map(p => `${p[0]},${p[1]}`).join(" L")}`;
  return (
    <svg width={w} height={h} className="ra-area" preserveAspectRatio="none" style={{ width: "100%", height: h }}>
      <defs>
        <linearGradient id={`ag-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0.03" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#ag-${color.replace("#","")})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const ProgressRow = ({ label, value, max, color, suffix = "%" }) => (
  <div className="ra-prog-row">
    <span className="ra-prog-row__lbl">{label}</span>
    <div className="ra-prog-row__track"><div className="ra-prog-row__fill" style={{ width: `${Math.min(100,(value/max)*100)}%`, background: color }} /></div>
    <span className="ra-prog-row__val" style={{ color }}>{value}{suffix}</span>
  </div>
);

const StatChip = ({ label, value, delta, color }) => (
  <div className="ra-stat-chip">
    <span className="ra-stat-chip__lbl">{label}</span>
    <span className="ra-stat-chip__val" style={{ color: color || GOLD }}>{value}</span>
    {delta && <span className={`ra-stat-chip__delta ${delta.startsWith("+") ? "ra-stat-chip__delta--up" : "ra-stat-chip__delta--dn"}`}>{delta}</span>}
  </div>
);

const AlertCard = ({ level, title, detail }) => (
  <div className={`ra-alert-card ra-alert-card--${level}`}>
    <span className="ra-alert-card__dot" />
    <div>
      <p className="ra-alert-card__title">{title}</p>
      <p className="ra-alert-card__detail">{detail}</p>
    </div>
  </div>
);

const InsightCard = ({ icon, title, body, type = "info" }) => (
  <div className={`ra-insight-card ra-insight-card--${type}`}>
    <span className="ra-insight-card__icon">{icon}</span>
    <div>
      <p className="ra-insight-card__title">{title}</p>
      <p className="ra-insight-card__body">{body}</p>
    </div>
  </div>
);

// ─── Metric Card ─────────────────────────────────────────────────────────────
const MetricCard = ({ icon, label, value, sub, color = "primary", spark }) => (
  <div className={`ra-metric ra-metric--${color}`}>
    <div className="ra-metric__top">
      <span className="ra-metric__icon">{icon}</span>
      {spark && <SparkLine data={spark} color={color === "primary" ? GOLD : color === "success" ? GREEN : color === "danger" ? RED : color === "info" ? BLUE : AMBER} h={32} w={64} />}
    </div>
    <p className="ra-metric__val">{value}</p>
    <p className="ra-metric__lbl">{label}</p>
    {sub && <p className="ra-metric__sub">{sub}</p>}
  </div>
);

// ─── Section ─────────────────────────────────────────────────────────────────
const Section = ({ title, children, action }) => (
  <div className="ra-section">
    <div className="ra-section__hd">
      <h3 className="ra-section__title">{title}</h3>
      {action && <div className="ra-section__action">{action}</div>}
    </div>
    <div className="ra-section__body">{children}</div>
  </div>
);

// ─── Data Table ──────────────────────────────────────────────────────────────
const DataTable = ({ cols, rows }) => (
  <div className="ra-tbl-wrap">
    <table className="ra-tbl">
      <thead><tr>{cols.map(c => <th key={c.key || c}>{c.label || c}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => (
        <tr key={i}>{cols.map(c => <td key={c.key || c} style={c.style?.(r[c.key||c])||{}}>{c.render ? c.render(r[c.key||c], r) : r[c.key||c]}</td>)}</tr>
      ))}</tbody>
    </table>
  </div>
);

// ─── FILTER TOOLBAR ──────────────────────────────────────────────────────────
const Toolbar = ({ filters, onChange, onClear }) => {
  const hasFilters = Object.values(filters).some(v => v && v !== filters._defaults?.[Object.keys(filters).find(k => filters[k] === v)]);
  return (
    <div className="ra-toolbar" data-testid="school-toolbar-reports-analytics">
      <div className="ra-toolbar__search-wrap">
        <span className="ra-toolbar__search-icon">🔍</span>
        <input className="ra-toolbar__search" placeholder="Search reports, classes, students…"
          value={filters.q} onChange={e => onChange("q", e.target.value)} data-testid="school-field-reports-search" />
      </div>
      <select className="ra-toolbar__sel" value={filters.branch} onChange={e => onChange("branch", e.target.value)} data-testid="school-dropdown-reports-branch">
        {BRANCH_OPTIONS.map(o => <option key={o}>{o}</option>)}
      </select>
      <select className="ra-toolbar__sel" value={filters.cls} onChange={e => onChange("cls", e.target.value)} data-testid="school-dropdown-reports-class">
        {CLASS_OPTIONS.map(o => <option key={o}>{o}</option>)}
      </select>
      <select className="ra-toolbar__sel" value={filters.section} onChange={e => onChange("section", e.target.value)} data-testid="school-dropdown-reports-section">
        {SECTION_OPTIONS.map(o => <option key={o}>{o}</option>)}
      </select>
      <select className="ra-toolbar__sel" value={filters.year} onChange={e => onChange("year", e.target.value)} data-testid="school-dropdown-reports-year">
        {YEAR_OPTIONS.map(o => <option key={o}>{o}</option>)}
      </select>
      <select className="ra-toolbar__sel" value={filters.term} onChange={e => onChange("term", e.target.value)} data-testid="school-dropdown-reports-term">
        {TERM_OPTIONS.map(o => <option key={o}>{o}</option>)}
      </select>
      <input type="date" className="ra-toolbar__date" value={filters.from} onChange={e => onChange("from", e.target.value)} data-testid="school-field-reports-from" />
      <input type="date" className="ra-toolbar__date" value={filters.to}   onChange={e => onChange("to", e.target.value)}   data-testid="school-field-reports-to" />
      {hasFilters && (
        <button className="ra-toolbar__clear" onClick={onClear} data-testid="school-button-reports-clear-filters">✕ Clear</button>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
//  TAB: OVERVIEW
// ══════════════════════════════════════════════════════════════════════════════
const OverviewTab = () => {
  const kpis = [
    { icon:"👨‍🎓", label:"Total Students",        value:"2,847",  sub:"+124 this year",    color:"primary", spark:[2600,2650,2700,2723,2760,2800,2847] },
    { icon:"👩‍🏫", label:"Total Staff",            value:"312",    sub:"28 departments",    color:"info",    spark:[290,295,300,305,308,310,312] },
    { icon:"📅", label:"Avg Attendance",          value:"88.4%",  sub:"+1.2% vs last term", color:"success", spark:[84,85,86,87,87,88,88.4] },
    { icon:"💰", label:"Fee Collection",          value:"91.2%",  sub:"₹48.6L collected",  color:"primary", spark:[84,86,87,89,90,91,91.2] },
    { icon:"⚠️", label:"Overdue Fees",            value:"324",    sub:"₹8.4L pending",     color:"danger",  spark:[380,370,360,350,340,330,324] },
    { icon:"🚌", label:"Active Buses",            value:"22",     sub:"2 under maintenance",color:"info",    spark:[22,21,22,22,23,22,22] },
    { icon:"📣", label:"Grievances Pending",      value:"17",     sub:"-5 this week",       color:"warning", spark:[28,25,24,22,20,18,17] },
    { icon:"🎭", label:"Events Conducted",        value:"38",     sub:"this academic year", color:"purple",  spark:[4,8,12,18,24,32,38] },
    { icon:"📝", label:"Leave Requests Pending",  value:"29",     sub:"14 emergency",       color:"warning", spark:[22,25,28,26,30,28,29] },
  ];

  const feeMonths  = [72, 68, 75, 80, 84, 88, 91, 89, 91, 93, 91, 91.2];
  const attMonths  = [81, 82, 83, 84, 85, 84, 86, 87, 88, 87, 88, 88.4];
  const evtMonths  = [2, 3, 4, 4, 5, 4, 5, 4, 3, 2, 3, 1];

  const topClasses = [
    { name:"Class 12-A", att:96.4, color:GREEN  },
    { name:"Class 11-B", att:94.8, color:TEAL   },
    { name:"Class 10-A", att:93.2, color:BLUE   },
    { name:"Class 9-C",  att:92.1, color:PURPLE },
    { name:"Class 8-A",  att:91.6, color:GOLD   },
  ];
  const weakClasses = [
    { name:"Class 6-D",  att:74.2, color:RED    },
    { name:"Class 7-B",  att:76.8, color:AMBER  },
    { name:"Class 5-C",  att:78.4, color:AMBER  },
  ];

  return (
    <div className="ra-tab-body">
      {/* KPI Grid */}
      <Section title="School-Wide KPIs">
        <div className="ra-metrics-grid ra-metrics-grid--9">
          {kpis.map(k => <MetricCard key={k.label} {...k} />)}
        </div>
      </Section>

      {/* Charts row */}
      <div className="ra-charts-row">
        <Section title="Fee Collection Trend — Monthly">
          <div className="ra-chart-box">
            <AreaChart data={feeMonths} color={GOLD} h={120} />
            <div className="ra-chart-xlbls">
              {["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"].map(m => <span key={m}>{m}</span>)}
            </div>
          </div>
          <div className="ra-chart-legend">
            <StatChip label="Peak" value="93%" delta="+2% Mar" color={GOLD} />
            <StatChip label="Low"  value="68%" color={RED} />
            <StatChip label="YTD"  value="91.2%" delta="+5.4% YoY" color={GREEN} />
          </div>
        </Section>

        <Section title="Attendance Trend — Monthly">
          <div className="ra-chart-box">
            <AreaChart data={attMonths} color={TEAL} h={120} />
            <div className="ra-chart-xlbls">
              {["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"].map(m => <span key={m}>{m}</span>)}
            </div>
          </div>
          <div className="ra-chart-legend">
            <StatChip label="Peak" value="88.4%" delta="+7.4% vs Apr" color={TEAL} />
            <StatChip label="Low"  value="81%"   color={RED} />
            <StatChip label="Avg"  value="85.3%" color={BLUE} />
          </div>
        </Section>

        <Section title="Events Distribution">
          <div className="ra-chart-box">
            <BarChart data={[
              {label:"Apr",value:2},{label:"May",value:3},{label:"Jun",value:4},
              {label:"Jul",value:4},{label:"Aug",value:5},{label:"Sep",value:4},
              {label:"Oct",value:5},{label:"Nov",value:4},{label:"Dec",value:3},
              {label:"Jan",value:2},{label:"Feb",value:3},{label:"Mar",value:1},
            ]} color={PURPLE} h={120} />
          </div>
          <div className="ra-chart-legend">
            <StatChip label="Total"  value="38"  color={PURPLE} />
            <StatChip label="Avg/Mo" value="3.2" color={BLUE} />
          </div>
        </Section>
      </div>

      {/* Top & weak performers + quick insights */}
      <div className="ra-two-col">
        <Section title="Top Attendance — Classes">
          {topClasses.map(c => <ProgressRow key={c.name} label={c.name} value={c.att} max={100} color={c.color} />)}
        </Section>
        <Section title="Attention Required — Classes">
          {weakClasses.map(c => <ProgressRow key={c.name} label={c.name} value={c.att} max={100} color={c.color} />)}
          <div style={{marginTop:"1rem"}}>
            <AlertCard level="warn"  title="9B attendance declining" detail="3-week consecutive drop. Current: 79.2%" />
            <AlertCard level="danger" title="6D below threshold" detail="74.2% — eligible for remedial action" />
          </div>
        </Section>
      </div>

      {/* Quick Insights */}
      <Section title="Quick Operational Insights">
        <div className="ra-insights-grid">
          <InsightCard icon="💡" type="info"    title="Fee peak in March" body="93% collection achieved in March — highest this academic year." />
          <InsightCard icon="⚠️" type="warn"    title="Bus Route C delays" body="Bus 12 on Route C delayed 9 of last 15 trips. Avg delay: 18 min." />
          <InsightCard icon="✅" type="success"  title="Grievance resolution up" body="Average resolution time dropped from 6.2 to 3.8 days this term." />
          <InsightCard icon="📈" type="info"    title="Staff attendance stable" body="Staff attendance steady at 96.4% — above 95% benchmark." />
          <InsightCard icon="🚨" type="danger"  title="Overdue fee cluster" body="Class 7 has highest overdue rate at 18.4%. Intervention recommended." />
          <InsightCard icon="🎓" type="success"  title="Academic performance up" body="Term 2 pass rate: 94.8% — 3.2% improvement over Term 1." />
        </div>
      </Section>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
//  TAB: FEES ANALYTICS
// ══════════════════════════════════════════════════════════════════════════════
const FeesTab = () => {
  const kpis = [
    { icon:"💵", label:"Expected Fees",      value:"₹53.2L", sub:"AY 2025-26",         color:"primary" },
    { icon:"✅", label:"Collected",          value:"₹48.6L", sub:"91.2% collection",   color:"success" },
    { icon:"⏳", label:"Pending",            value:"₹3.2L",  sub:"6.1% of total",      color:"warning" },
    { icon:"🔴", label:"Overdue",            value:"₹1.4L",  sub:"324 students",       color:"danger"  },
    { icon:"🏷️", label:"Discounts Applied",  value:"₹0.8L",  sub:"148 students",       color:"info"    },
    { icon:"🎓", label:"Scholarships",       value:"₹0.6L",  sub:"62 beneficiaries",   color:"purple"  },
    { icon:"📊", label:"Collection %",       value:"91.2%",  sub:"+2.4% vs last year", color:"success" },
  ];

  const classWise = [
    { cls:"Class 12", expected:920000, collected:875000, pct:95.1, color:GREEN  },
    { cls:"Class 11", expected:880000, collected:820000, pct:93.2, color:TEAL   },
    { cls:"Class 10", expected:840000, collected:772800, pct:92.0, color:BLUE   },
    { cls:"Class  9", expected:800000, collected:720000, pct:90.0, color:GOLD   },
    { cls:"Class  8", expected:760000, collected:670000, pct:88.2, color:AMBER  },
    { cls:"Class  7", expected:720000, collected:587520, pct:81.6, color:RED    },
    { cls:"Class  6", expected:680000, collected:577640, pct:84.9, color:AMBER  },
  ];

  const paymentModes = [
    { mode:"Online (UPI)", pct:52, count:1480, color:BLUE   },
    { mode:"Net Banking",  pct:24, count:684,  color:TEAL   },
    { mode:"Cash",         pct:16, count:456,  color:AMBER  },
    { mode:"Cheque",       pct:5,  count:143,  color:PURPLE },
    { mode:"Failed/Retry", pct:3,  count:85,   color:RED    },
  ];

  const trend = [72, 75, 78, 82, 85, 88, 91, 89, 92, 93, 91, 91.2];

  return (
    <div className="ra-tab-body">
      <Section title="Financial KPIs">
        <div className="ra-metrics-grid ra-metrics-grid--7">
          {kpis.map(k => <MetricCard key={k.label} {...k} />)}
        </div>
      </Section>

      <div className="ra-two-col">
        <Section title="Collection Trend">
          <div className="ra-chart-box">
            <AreaChart data={trend} color={GOLD} h={140} />
            <div className="ra-chart-xlbls">
              {["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"].map(m=><span key={m}>{m}</span>)}
            </div>
          </div>
        </Section>

        <Section title="Payment Mode Distribution">
          <div style={{display:"flex",gap:"1rem",alignItems:"center",flexWrap:"wrap"}}>
            <DonutChart value={52} total={100} color={BLUE} size={100} label="Online" />
            <div style={{flex:1,minWidth:"10rem"}}>
              {paymentModes.map(p => (
                <div key={p.mode} style={{display:"flex",alignItems:"center",gap:".5rem",marginBottom:".5rem"}}>
                  <span style={{width:10,height:10,borderRadius:"50%",background:p.color,flexShrink:0}} />
                  <span style={{fontSize:".75rem",flex:1}}>{p.mode}</span>
                  <span style={{fontSize:".75rem",fontWeight:600,color:p.color}}>{p.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </div>

      <Section title="Class-Wise Fee Collection">
        <DataTable
          cols={[
            { key:"cls",       label:"Class"     },
            { key:"expected",  label:"Expected",  render: v => `₹${(v/100000).toFixed(2)}L` },
            { key:"collected", label:"Collected", render: v => `₹${(v/100000).toFixed(2)}L` },
            { key:"pct",       label:"Collection %", render:(v,r)=>(
              <div style={{display:"flex",alignItems:"center",gap:".5rem"}}>
                <MiniBar value={v} max={100} color={r.color} />
                <span style={{color:r.color,fontWeight:600,fontSize:".8rem"}}>{v}%</span>
              </div>
            )},
          ]}
          rows={classWise}
        />
      </Section>

      <Section title="Overdue Analysis">
        <div className="ra-insights-grid">
          <InsightCard icon="🔴" type="danger"  title="Class 7 highest overdue" body="18.4% overdue rate. 83 students with pending fees over 60 days." />
          <InsightCard icon="⚠️" type="warn"    title="Transport fee lag" body="Transport fee collection at 82.4% — below 90% target." />
          <InsightCard icon="💡" type="info"    title="Q4 collection surge" body="Last-quarter fees surge pattern detected. Plan early reminders." />
          <InsightCard icon="✅" type="success"  title="Class 12 on track" body="95.1% collection. Only 44 students with minor balances." />
        </div>
      </Section>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
//  TAB: ATTENDANCE ANALYTICS
// ══════════════════════════════════════════════════════════════════════════════
const AttendanceTab = () => {
  const kpis = [
    { icon:"📊", label:"Average Attendance",   value:"88.4%", sub:"+1.2% vs last term",  color:"success" },
    { icon:"🔴", label:"Low Attendance (<75%)", value:"142",   sub:"students at risk",    color:"danger"  },
    { icon:"👩‍🏫", label:"Staff Attendance",     value:"96.4%", sub:"305 of 312 staff",    color:"success" },
    { icon:"🏫", label:"Classes Below 80%",    value:"8",     sub:"needs attention",     color:"warning" },
    { icon:"📅", label:"Avg Absent Days",       value:"4.2",   sub:"per student/month",   color:"info"    },
    { icon:"⏰", label:"Late Arrivals (Today)", value:"38",    sub:"1.3% of students",    color:"warning" },
  ];

  const branchAtt = [
    { branch:"North Campus", pct:90.2, color:GREEN  },
    { branch:"South Campus", pct:87.4, color:TEAL   },
    { branch:"East Wing",    pct:85.6, color:BLUE   },
  ];

  const trend = [81,82,83,84,85,84,86,87,88,87,88,88.4];
  const absentPattern = [
    { day:"Monday",   pct:12.4, color:RED    },
    { day:"Tuesday",  pct:7.2,  color:AMBER  },
    { day:"Wednesday",pct:6.8,  color:GOLD   },
    { day:"Thursday", pct:7.4,  color:AMBER  },
    { day:"Friday",   pct:13.8, color:RED    },
  ];

  return (
    <div className="ra-tab-body">
      <Section title="Attendance KPIs">
        <div className="ra-metrics-grid ra-metrics-grid--6">
          {kpis.map(k => <MetricCard key={k.label} {...k} />)}
        </div>
      </Section>

      <div className="ra-two-col">
        <Section title="Attendance Trend — Monthly">
          <div className="ra-chart-box">
            <AreaChart data={trend} color={TEAL} h={140} />
            <div className="ra-chart-xlbls">
              {["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"].map(m=><span key={m}>{m}</span>)}
            </div>
          </div>
        </Section>

        <Section title="Absentee Pattern by Day">
          <BarChart data={absentPattern.map(d=>({label:d.day.slice(0,3),value:d.pct}))} color={RED} h={120} />
          <p style={{fontSize:".75rem",color:"var(--ra-muted)",marginTop:".5rem"}}>Friday has highest absenteeism at 13.8%</p>
        </Section>
      </div>

      <Section title="Branch-Wise Attendance">
        {branchAtt.map(b => <ProgressRow key={b.branch} label={b.branch} value={b.pct} max={100} color={b.color} />)}
      </Section>

      <Section title="Attendance Alerts">
        <div className="ra-insights-grid">
          <AlertCard level="danger" title="142 students below 75%" detail="Exam eligibility risk. Parents notified for 89 students." />
          <AlertCard level="warn"   title="Class 9B declining trend" detail="3-week consecutive drop. Currently at 79.2%." />
          <AlertCard level="warn"   title="Friday spike pattern" detail="13.8% absenteeism every Friday — investigate root cause." />
          <AlertCard level="info"   title="Chronic absentees: 27" detail="Students absent >20% of days. Counselling recommended." />
        </div>
      </Section>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
//  TAB: TRANSPORT ANALYTICS
// ══════════════════════════════════════════════════════════════════════════════
const TransportTab = () => {
  const kpis = [
    { icon:"🚌", label:"Active Buses",        value:"22",    sub:"2 under maintenance", color:"primary" },
    { icon:"🔧", label:"Under Maintenance",   value:"2",     sub:"ETA: 3 days",         color:"warning" },
    { icon:"⏱️", label:"Punctuality Rate",    value:"87.4%", sub:"-2.1% vs last month", color:"success" },
    { icon:"👥", label:"Occupancy Rate",      value:"81.6%", sub:"2,318 of 2,840 seats",color:"info"    },
    { icon:"⚠️", label:"Delayed Trips Today", value:"4",     sub:"Routes B, C, F, H",   color:"danger"  },
    { icon:"⛽", label:"Fuel Efficiency",     value:"9.2km/L",sub:"vs 8.8 last month",  color:"success" },
  ];

  const buses = [
    { id:"BUS-101", route:"Route A — North", occ:38, cap:40, onTime:"96%", driver:"Raju Singh",   status:"on-time",  color:GREEN  },
    { id:"BUS-102", route:"Route B — South", occ:32, cap:40, onTime:"84%", driver:"Mohan Das",    status:"delayed",  color:RED    },
    { id:"BUS-103", route:"Route C — East",  occ:36, cap:40, onTime:"81%", driver:"Suresh Kumar", status:"delayed",  color:RED    },
    { id:"BUS-104", route:"Route D — West",  occ:28, cap:35, onTime:"94%", driver:"Arun Pillai",  status:"on-time",  color:GREEN  },
    { id:"BUS-105", route:"Route E — Central",occ:30, cap:35, onTime:"91%", driver:"Ramesh N",    status:"on-time",  color:GREEN  },
    { id:"BUS-201", route:"Route F — Outer", occ:22, cap:40, onTime:"78%", driver:"Deepak J",     status:"delayed",  color:AMBER  },
  ];

  return (
    <div className="ra-tab-body">
      <Section title="Transport KPIs">
        <div className="ra-metrics-grid ra-metrics-grid--6">
          {kpis.map(k => <MetricCard key={k.label} {...k} />)}
        </div>
      </Section>

      <Section title="Bus Performance Overview">
        <DataTable
          cols={[
            { key:"id",     label:"Bus ID",  style:()=>({fontWeight:600,color:GOLD}) },
            { key:"route",  label:"Route"   },
            { key:"occ",    label:"Occupancy", render:(v,r)=>(
              <div style={{display:"flex",alignItems:"center",gap:".5rem"}}>
                <MiniBar value={v} max={r.cap} color={r.color} />
                <span style={{fontSize:".8rem"}}>{v}/{r.cap}</span>
              </div>
            )},
            { key:"onTime", label:"On-Time %", style:v=>({color:parseFloat(v)>=90?GREEN:parseFloat(v)>=80?AMBER:RED,fontWeight:600}) },
            { key:"driver", label:"Driver"   },
            { key:"status", label:"Status",   render:v=>(
              <span className={`ra-badge ra-badge--${v==="on-time"?"success":v==="delayed"?"danger":"warning"}`}>{v}</span>
            )},
          ]}
          rows={buses}
        />
      </Section>

      <Section title="Transport Alerts">
        <div className="ra-insights-grid">
          <AlertCard level="danger" title="Bus 102 delayed — Route B" detail="Avg delay 22 min. 4 incidents this week. Driver review needed." />
          <AlertCard level="danger" title="Bus 103 repeated delays — Route C" detail="9 of last 15 trips delayed. Route C traffic analysis required." />
          <AlertCard level="warn"   title="BUS-201 occupancy low" detail="55% occupancy on Route F. Route optimization recommended." />
          <AlertCard level="info"   title="BUS-302 maintenance due" detail="Scheduled maintenance in 3 days. Alternate arranged." />
        </div>
      </Section>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
//  TAB: ACADEMIC ANALYTICS
// ══════════════════════════════════════════════════════════════════════════════
const AcademicTab = () => {
  const kpis = [
    { icon:"✅", label:"Pass Rate",         value:"94.8%",  sub:"+3.2% vs Term 1",    color:"success" },
    { icon:"📊", label:"Average Grade",     value:"72.4%",  sub:"B+ category",        color:"info"    },
    { icon:"🏆", label:"Distinction (>80%)",value:"38.4%",  sub:"1,093 students",     color:"primary" },
    { icon:"📉", label:"Below 40%",         value:"5.2%",   sub:"148 students",       color:"danger"  },
    { icon:"📚", label:"Best Subject",      value:"Science",sub:"Avg: 78.6%",         color:"success" },
    { icon:"⚠️", label:"Weakest Subject",   value:"Maths",  sub:"Avg: 64.2%",         color:"warning" },
  ];

  const subjects = [
    { subj:"Science",  avg:78.6, pass:97.2, color:GREEN  },
    { subj:"English",  avg:76.8, pass:96.4, color:TEAL   },
    { subj:"Social",   avg:74.4, pass:95.8, color:BLUE   },
    { subj:"Hindi",    avg:72.2, pass:94.2, color:GOLD   },
    { subj:"Computer", avg:70.8, pass:93.6, color:PURPLE },
    { subj:"Commerce", avg:68.4, pass:91.8, color:AMBER  },
    { subj:"Maths",    avg:64.2, pass:88.4, color:RED    },
  ];

  const gradeData = [
    { grade:"A+ (>90%)", count:342,  color:GREEN  },
    { grade:"A  (80-90)",count:751,  color:TEAL   },
    { grade:"B+ (70-80)",count:892,  color:BLUE   },
    { grade:"B  (60-70)",count:534,  color:GOLD   },
    { grade:"C  (50-60)",count:180,  color:AMBER  },
    { grade:"D  (40-50)",count:148,  color:RED    },
    { grade:"F  (<40%)", count: 0,   color:RED    },
  ];
  const maxG = Math.max(...gradeData.map(g=>g.count));

  return (
    <div className="ra-tab-body">
      <Section title="Academic KPIs">
        <div className="ra-metrics-grid ra-metrics-grid--6">
          {kpis.map(k => <MetricCard key={k.label} {...k} />)}
        </div>
      </Section>

      <div className="ra-two-col">
        <Section title="Subject-Wise Performance">
          {subjects.map(s=>(
            <div key={s.subj} className="ra-subj-row">
              <span className="ra-subj-row__name">{s.subj}</span>
              <MiniBar value={s.avg} max={100} color={s.color} />
              <span style={{fontSize:".75rem",color:s.color,fontWeight:600,minWidth:"2.5rem"}}>{s.avg}%</span>
              <span style={{fontSize:".7rem",color:"var(--ra-muted)"}}>Pass: {s.pass}%</span>
            </div>
          ))}
        </Section>

        <Section title="Grade Distribution">
          {gradeData.map(g=>(
            <div key={g.grade} className="ra-prog-row">
              <span className="ra-prog-row__lbl" style={{minWidth:"4rem",fontSize:".75rem"}}>{g.grade}</span>
              <div className="ra-prog-row__track"><div className="ra-prog-row__fill" style={{width:`${(g.count/maxG)*100}%`,background:g.color}} /></div>
              <span className="ra-prog-row__val" style={{color:g.color}}>{g.count}</span>
            </div>
          ))}
        </Section>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
//  TAB: STAFF ANALYTICS
// ══════════════════════════════════════════════════════════════════════════════
const StaffTab = () => {
  const kpis = [
    { icon:"👥", label:"Total Staff",        value:"312",   sub:"28 departments",    color:"primary" },
    { icon:"📅", label:"Staff Attendance",   value:"96.4%", sub:"305 present today", color:"success" },
    { icon:"📝", label:"Leave Requests",     value:"29",    sub:"14 pending action", color:"warning" },
    { icon:"🏥", label:"On Leave Today",     value:"7",     sub:"2.2% of staff",     color:"info"    },
    { icon:"⚖️", label:"Avg Workload",       value:"28h/w", sub:"per teacher",       color:"primary" },
    { icon:"🎓", label:"Training Completed", value:"184",   sub:"58.9% staff",       color:"success" },
  ];

  const depts = [
    { dept:"Mathematics",   staff:42, att:97.6, leave:2, color:GOLD   },
    { dept:"Science",       staff:38, att:96.4, leave:3, color:GREEN  },
    { dept:"English",       staff:32, att:95.8, leave:1, color:TEAL   },
    { dept:"Administration",staff:28, att:98.2, leave:0, color:BLUE   },
    { dept:"IT",            staff:18, att:94.4, leave:2, color:PURPLE },
    { dept:"Finance",       staff:14, att:97.1, leave:1, color:AMBER  },
  ];

  return (
    <div className="ra-tab-body">
      <Section title="Staff KPIs">
        <div className="ra-metrics-grid ra-metrics-grid--6">
          {kpis.map(k => <MetricCard key={k.label} {...k} />)}
        </div>
      </Section>

      <Section title="Department-Wise Overview">
        <DataTable
          cols={[
            { key:"dept",  label:"Department"      },
            { key:"staff", label:"Staff Count",    style:()=>({fontWeight:600}) },
            { key:"att",   label:"Attendance %",   style:v=>({color:v>=97?GREEN:v>=95?TEAL:AMBER,fontWeight:600}) },
            { key:"leave", label:"On Leave Today", style:v=>({color:v>2?RED:v>0?AMBER:GREEN,fontWeight:600}) },
          ]}
          rows={depts}
        />
      </Section>

      <Section title="Staff Insights">
        <div className="ra-insights-grid">
          <InsightCard icon="📈" type="success"  title="98.2% admin attendance" body="Administrative staff leading attendance this month." />
          <InsightCard icon="⚠️" type="warn"     title="IT dept leave spike" body="4 IT staff on leave simultaneously — coverage gap risk." />
          <InsightCard icon="💡" type="info"     title="Training uptake" body="58.9% staff completed mandatory training. Deadline in 3 weeks." />
          <InsightCard icon="✅" type="success"  title="Leave turnaround" body="Avg leave approval time: 1.8 days (target: 2 days)." />
        </div>
      </Section>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
//  TAB: EVENTS ANALYTICS
// ══════════════════════════════════════════════════════════════════════════════
const EventsTab = () => {
  const kpis = [
    { icon:"🎭", label:"Events Conducted",    value:"38",   sub:"this academic year",  color:"purple"  },
    { icon:"👥", label:"Total Participation", value:"12,480",sub:"across all events",  color:"primary" },
    { icon:"📊", label:"Avg Participation",   value:"328",  sub:"per event",           color:"info"    },
    { icon:"🏆", label:"Top House",           value:"Phoenix",sub:"2,840 points",      color:"primary" },
    { icon:"🎯", label:"Student Engagement",  value:"84.2%",sub:"of student body",     color:"success" },
  ];

  const houses = [
    { house:"Phoenix",  pts:2840, color:RED,    events:24 },
    { house:"Falcon",   pts:2720, color:BLUE,   events:22 },
    { house:"Vanguard", pts:2610, color:GREEN,  events:21 },
    { house:"Sapphire", pts:2480, color:TEAL,   events:20 },
  ];
  const maxH = Math.max(...houses.map(h=>h.pts));

  const eventCats = [
    { cat:"Sports",       count:14, part:4820, color:GREEN  },
    { cat:"Cultural",     count:10, part:3640, color:PURPLE },
    { cat:"Academic",     count:8,  part:2880, color:BLUE   },
    { cat:"Science",      count:4,  part:720,  color:TEAL   },
    { cat:"Outreach",     count:2,  part:420,  color:AMBER  },
  ];

  return (
    <div className="ra-tab-body">
      <Section title="Events KPIs">
        <div className="ra-metrics-grid ra-metrics-grid--5">
          {kpis.map(k => <MetricCard key={k.label} {...k} />)}
        </div>
      </Section>

      <div className="ra-two-col">
        <Section title="House Performance">
          {houses.map(h=>(
            <div key={h.house} className="ra-prog-row">
              <span className="ra-prog-row__lbl">{h.house}</span>
              <div className="ra-prog-row__track"><div className="ra-prog-row__fill" style={{width:`${(h.pts/maxH)*100}%`,background:h.color}} /></div>
              <span className="ra-prog-row__val" style={{color:h.color}}>{h.pts.toLocaleString()}</span>
            </div>
          ))}
        </Section>

        <Section title="Events by Category">
          <DataTable
            cols={[
              { key:"cat",   label:"Category"       },
              { key:"count", label:"Events", style:()=>({fontWeight:600}) },
              { key:"part",  label:"Participants", render:v=>v.toLocaleString() },
            ]}
            rows={eventCats}
          />
        </Section>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
//  TAB: GRIEVANCE ANALYTICS
// ══════════════════════════════════════════════════════════════════════════════
const GrievanceTab = () => {
  const kpis = [
    { icon:"📣", label:"Total Grievances",    value:"284",  sub:"this academic year",  color:"primary" },
    { icon:"⏳", label:"Pending",             value:"17",   sub:"-5 this week",        color:"warning" },
    { icon:"✅", label:"Resolved",            value:"261",  sub:"91.9% resolution",    color:"success" },
    { icon:"🔺", label:"Escalated",           value:"6",    sub:"to principal level",  color:"danger"  },
    { icon:"⏱️", label:"Avg Resolution",      value:"3.8d", sub:"-2.4d vs last term",  color:"success" },
  ];

  const categories = [
    { cat:"Fee Related",      count:84, pct:29.6, color:GOLD    },
    { cat:"Academic",         count:68, pct:23.9, color:BLUE    },
    { cat:"Facilities",       count:52, pct:18.3, color:TEAL    },
    { cat:"Staff Conduct",    count:38, pct:13.4, color:AMBER   },
    { cat:"Transport",        count:28, pct: 9.9, color:PURPLE  },
    { cat:"Others",           count:14, pct: 4.9, color:"#6b7280"},
  ];

  return (
    <div className="ra-tab-body">
      <Section title="Grievance KPIs">
        <div className="ra-metrics-grid ra-metrics-grid--5">
          {kpis.map(k => <MetricCard key={k.label} {...k} />)}
        </div>
      </Section>

      <div className="ra-two-col">
        <Section title="Category Breakdown">
          {categories.map(c=>(
            <div key={c.cat} className="ra-prog-row">
              <span className="ra-prog-row__lbl">{c.cat}</span>
              <div className="ra-prog-row__track"><div className="ra-prog-row__fill" style={{width:`${c.pct}%`,background:c.color}} /></div>
              <span className="ra-prog-row__val" style={{color:c.color}}>{c.count}</span>
            </div>
          ))}
        </Section>

        <Section title="Resolution Efficiency">
          <div style={{display:"flex",gap:"1.5rem",justifyContent:"center",flexWrap:"wrap",padding:".5rem 0"}}>
            <DonutChart value={261} total={284} color={GREEN}  size={100} label="Resolved" />
            <DonutChart value={17}  total={284} color={AMBER}  size={80}  label="Pending"  />
            <DonutChart value={6}   total={284} color={RED}    size={80}  label="Escalated"/>
          </div>
          <InsightCard icon="✅" type="success" title="Resolution time improving" body="Average 3.8 days this term vs 6.2 days last term — 38.7% improvement." />
        </Section>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
//  TAB: ALUMNI ANALYTICS
// ══════════════════════════════════════════════════════════════════════════════
const AlumniTab = () => {
  const kpis = [
    { icon:"🏛️", label:"Registered Alumni",    value:"1,842", sub:"across all batches",  color:"primary" },
    { icon:"✅", label:"Verified Profiles",    value:"1,384", sub:"75.1% verified",      color:"success" },
    { icon:"🎓", label:"Active Mentors",       value:"124",   sub:"accepting requests",  color:"info"    },
    { icon:"📬", label:"Mentorship Requests",  value:"38",    sub:"22 pending review",   color:"warning" },
    { icon:"🎭", label:"Alumni Participation", value:"284",   sub:"in school events",    color:"purple"  },
  ];

  const industries = [
    { ind:"Technology",   pct:32, color:BLUE   },
    { ind:"Education",    pct:18, color:GREEN  },
    { ind:"Healthcare",   pct:14, color:TEAL   },
    { ind:"Finance",      pct:12, color:GOLD   },
    { ind:"Engineering",  pct:10, color:PURPLE },
    { ind:"Government",   pct: 8, color:AMBER  },
    { ind:"Others",       pct: 6, color:"#6b7280"},
  ];

  return (
    <div className="ra-tab-body">
      <Section title="Alumni KPIs">
        <div className="ra-metrics-grid ra-metrics-grid--5">
          {kpis.map(k => <MetricCard key={k.label} {...k} />)}
        </div>
      </Section>

      <div className="ra-two-col">
        <Section title="Industry Distribution">
          {industries.map(i=>(
            <div key={i.ind} className="ra-prog-row">
              <span className="ra-prog-row__lbl">{i.ind}</span>
              <div className="ra-prog-row__track"><div className="ra-prog-row__fill" style={{width:`${i.pct}%`,background:i.color}} /></div>
              <span className="ra-prog-row__val" style={{color:i.color}}>{i.pct}%</span>
            </div>
          ))}
        </Section>

        <Section title="Engagement Overview">
          <div style={{display:"flex",gap:"1.5rem",justifyContent:"center",flexWrap:"wrap",padding:".5rem 0"}}>
            <DonutChart value={1384} total={1842} color={GREEN} size={100} label="Verified" />
            <DonutChart value={124}  total={1842} color={GOLD}  size={80}  label="Mentors"  />
            <DonutChart value={284}  total={1842} color={BLUE}  size={80}  label="Active"   />
          </div>
          <InsightCard icon="📈" type="info" title="Mentorship demand rising" body="38 new requests this month — 42% increase vs last month." />
        </Section>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
//  TAB: OPERATIONAL INSIGHTS
// ══════════════════════════════════════════════════════════════════════════════
const OperationalTab = () => {
  const smartInsights = [
    { icon:"📉", type:"danger",  title:"Class 9B attendance declining",        body:"3-week consecutive drop from 87.4% to 79.2%. Recommend counsellor intervention." },
    { icon:"🚌", type:"warn",    title:"Bus 12 repeatedly delayed — Route C",   body:"9 of last 15 trips late. Avg 18-min delay. Route rescheduling needed." },
    { icon:"💰", type:"warn",    title:"Class 7 overdue fee cluster",           body:"18.4% overdue rate — highest in school. 83 students over 60 days pending." },
    { icon:"📣", type:"info",    title:"Grievance spike in Finance dept",       body:"12 complaints in last 30 days vs avg 3/month. Dept review recommended." },
    { icon:"🏆", type:"success", title:"Phoenix house strong lead",             body:"2,840 points — 120 ahead of nearest rival. Momentum building." },
    { icon:"📚", type:"warn",    title:"Maths performance below target",        body:"64.2% average — 10.4% below school target. Extra classes proposed." },
    { icon:"👥", type:"info",    title:"IT dept leave cluster",                 body:"4 of 18 IT staff on leave simultaneously — coverage risk." },
    { icon:"🎓", type:"success", title:"Training completion on track",          body:"58.9% completed mandatory training. 30 days to deadline." },
  ];

  const bottlenecks = [
    { zone:"Class 9B",         issue:"Attendance",  severity:"critical", action:"Counsellor review" },
    { zone:"Route C (Bus 12)", issue:"Transport",   severity:"high",     action:"Route replan"       },
    { zone:"Class 7 (Fees)",   issue:"Fee overdue", severity:"high",     action:"Parent meeting"     },
    { zone:"Finance Dept",     issue:"Grievances",  severity:"medium",   action:"Dept audit"         },
    { zone:"Maths Dept",       issue:"Academic",    severity:"medium",   action:"Extra classes"      },
  ];

  return (
    <div className="ra-tab-body">
      <Section title="Smart Predictive Insights">
        <div className="ra-insights-grid">
          {smartInsights.map((s,i) => <InsightCard key={i} {...s} />)}
        </div>
      </Section>

      <Section title="Operational Bottlenecks">
        <DataTable
          cols={[
            { key:"zone",     label:"Zone / Area"                },
            { key:"issue",    label:"Issue Type"                 },
            { key:"severity", label:"Severity", render:v=>(
              <span className={`ra-badge ra-badge--${v==="critical"?"danger":v==="high"?"warning":"info"}`}>{v}</span>
            )},
            { key:"action",   label:"Recommended Action", style:()=>({color:GOLD,fontWeight:500}) },
          ]}
          rows={bottlenecks}
        />
      </Section>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
//  TAB: EXPORT & REPORTS
// ══════════════════════════════════════════════════════════════════════════════
const ExportTab = () => {
  const categories = [
    { label:"Fee Reports",        icon:"💰", color:GOLD,   reports:[
      "Fee Collection Summary","Class-wise Fee Report","Overdue Fee Report","Payment Mode Analysis","Scholarship Report"]
    },
    { label:"Attendance Reports", icon:"📅", color:TEAL,   reports:[
      "Daily Attendance Summary","Class-wise Attendance","Low Attendance Students","Branch Attendance Report","Staff Attendance Report"]
    },
    { label:"Transport Reports",  icon:"🚌", color:BLUE,   reports:[
      "Bus Utilization Report","Route Performance Report","Driver Report","Maintenance Log","Delay Analysis"]
    },
    { label:"Academic Reports",   icon:"🎓", color:PURPLE, reports:[
      "Term Result Summary","Subject-wise Report","Grade Distribution","Topper List","Exam Schedule Report"]
    },
    { label:"Staff Reports",      icon:"👥", color:GREEN,  reports:[
      "Staff Attendance Report","Leave Summary","Department Strength","Training Compliance","Payroll Summary"]
    },
    { label:"Event Reports",      icon:"🎭", color:AMBER,  reports:[
      "Event Calendar","House Points Report","Participation Report","Category Analysis","Budget Report"]
    },
  ];

  const fmts = [
    { fmt:"PDF",   icon:"📄", color:RED    },
    { fmt:"Excel", icon:"📊", color:GREEN  },
    { fmt:"CSV",   icon:"📋", color:BLUE   },
    { fmt:"Print", icon:"🖨️", color:AMBER  },
  ];

  return (
    <div className="ra-tab-body">
      <Section title="Export Formats">
        <div className="ra-export-fmts">
          {fmts.map(f=>(
            <button key={f.fmt} className="ra-export-btn" style={{"--btn-color":f.color}} data-testid={`school-button-export-${f.fmt.toLowerCase()}`}>
              <span>{f.icon}</span> Export as {f.fmt}
            </button>
          ))}
        </div>
      </Section>

      <div className="ra-export-grid">
        {categories.map(cat=>(
          <Section key={cat.label} title={cat.label}>
            <ul className="ra-report-list">
              {cat.reports.map(r=>(
                <li key={r} className="ra-report-item">
                  <span className="ra-report-item__icon" style={{color:cat.color}}>{cat.icon}</span>
                  <span className="ra-report-item__name">{r}</span>
                  <div className="ra-report-item__actions">
                    <button className="ra-report-item__btn" style={{"--c":RED}}    data-testid={`school-button-dl-pdf-${r.replace(/\s+/g,"-").toLowerCase()}`}>PDF</button>
                    <button className="ra-report-item__btn" style={{"--c":GREEN}}  data-testid={`school-button-dl-excel-${r.replace(/\s+/g,"-").toLowerCase()}`}>Excel</button>
                    <button className="ra-report-item__btn" style={{"--c":BLUE}}   data-testid={`school-button-dl-csv-${r.replace(/\s+/g,"-").toLowerCase()}`}>CSV</button>
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        ))}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
const TAB_COMPONENTS = {
  overview:    OverviewTab,
  fees:        FeesTab,
  attendance:  AttendanceTab,
  transport:   TransportTab,
  academic:    AcademicTab,
  staff:       StaffTab,
  events:      EventsTab,
  grievance:   GrievanceTab,
  alumni:      AlumniTab,
  operational: OperationalTab,
  export:      ExportTab,
};

const INIT_FILTERS = { q:"", branch:"All Branches", cls:"All Classes", section:"All Sections", year:"2025-26", term:"All Terms", from:"", to:"", feeStatus:"All Status" };

/**
 * ReportsAnalytics — unified school intelligence dashboard.
 */
export default function ReportsAnalytics() {
  const [activeTab, setActiveTab] = useState("overview");
  const [filters, setFilters]     = useState(INIT_FILTERS);

  const handleFilter = useCallback((key, val) => setFilters(p => ({ ...p, [key]: val })), []);
  const clearFilters = useCallback(() => setFilters(INIT_FILTERS), []);

  const ActivePanel = useMemo(() => TAB_COMPONENTS[activeTab] || OverviewTab, [activeTab]);

  return (
    <div className="ra-root" data-testid="school-page-reports-analytics">
      <ManagementPageHeader
        breadcrumbs={[
          { label: "Management" },
          { label: "Reports & Analytics" },
        ]}
        title="Reports & Analytics"
        subtitle="School intelligence command center — operational insights & executive reporting"
        actions={(
          <>
            <button className="ra-btn ra-btn--ghost" data-testid="school-button-reports-print">🖨️ Print</button>
            <button className="ra-btn ra-btn--primary" data-testid="school-button-reports-export-all">📤 Export All</button>
          </>
        )}
      />

      {/* Toolbar */}
      <Toolbar filters={filters} onChange={handleFilter} onClear={clearFilters} />

      {/* Segmented Tabs */}
      <div className="ra-tabs" role="tablist" aria-label="Analytics sections">
        {TABS.map(t => (
          <button
            key={t.id}
            role="tab"
            aria-selected={activeTab === t.id}
            className={`ra-tab${activeTab === t.id ? " ra-tab--active" : ""}`}
            onClick={() => setActiveTab(t.id)}
            data-testid={`school-tab-reports-${t.id}`}
          >
            <span className="ra-tab__icon">{t.icon}</span>
            <span className="ra-tab__label">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Panel */}
      <ActivePanel />
    </div>
  );
}