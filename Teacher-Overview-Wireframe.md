# LOW-FIDELITY WIREFRAME
## Teacher Overview Page

**Viewport:** Desktop 1440px · **Grid:** 12-column content · **Style:** B/W skeleton only

**Source:** UI Design Documentation (Overview) — layout order preserved.  
**No tabs** on this page · **No formal modals** · Overlays: Notifications, Profile menu, AI Assistant

**View tip:** Use a monospace font (Consolas, Courier New, Menlo) so ASCII boxes align.

---

## A. FULL-PAGE DESKTOP WIREFRAME

```
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│ APP HEADER                                                                                     │
│ [≡]  [LOGO] Brand                              [ Theme ]  [ Bell (3) ]  (○) Name  Role  [v]   │
│                                                                                                │
│ (No page title / No search in header — per documentation)                                      │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
┌──────────────┬─────────────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR      │ MAIN CONTENT (scroll)                                                           │
│              │                                                                                 │
│ [ < ]        │  ┌─ GREETING ROW ───────────────────────────────────────────────────────────┐   │
│              │  │ ▬▬ Good Morning, [Name] 👋                                               │   │
│ ■ Overview   │  │ ▬▬ Here’s what’s happening with your classes today                       │   │
│   (ACTIVE)   │  │                                              [ □  Date · Day             ] │   │
│ □ Live Classes│  └─────────────────────────────────────────────────────────────────────────┘   │
│ □ My Classes │                                                                                 │
│ □ My Schedule│  ┌──────────────── LEFT (~7 cols) ──────────┐ ┌──── RIGHT (~5 cols) ───────┐  │
│ □ Sports     │  │                                          │ │                            │  │
│ □ Request…   │  │ ┌─ TODAY’S CLASSES ───────────────────┐  │ │ ┌─ TODAY’S SUMMARY ──────┐ │  │
│ □ Community  │  │ │ TODAY’S CLASSES   Mar 14 · Tuesday  │  │ │ │ TODAY’S SUMMARY        │ │  │
│ □ Grievance  │  │ │              [ View Full Schedule ] │  │ │ │                        │ │  │
│ □ Staff Conn.│  │ │                                     │  │ │ │ ┌────┐ ┌────┐ ┌────┐  │ │  │
│              │  │ │ ● 08:00  Class Name     [ Done ]    │  │ │ │ │ □  │ │ □  │ │ □  │  │ │  │
│              │  │ │          (muted row)                │  │ │ │ │ 5  │ │ 2  │ │ 12 │  │ │  │
│              │  │ ├─────────────────────────────────────┤  │ │ │ │Clas │ │Meet │ │Assn │  │ │  │
│              │  │ │ ● 09:30  Class Name  [● LIVE NOW]   │  │ │ │ └────┘ └────┘ └────┘  │ │  │
│              │  │ │   ▬ attendance % · N Present        │  │ │ └────────────────────────┘ │  │
│              │  │ │   ▬ Room · Duration                 │  │ │                            │  │
│              │  │ │              [ Mark Attendance ]    │  │ │ ┌─ YOUR WORK ────────────┐ │  │
│              │  │ ├─────────────────────────────────────┤  │ │ │ Assignments to Review  │ │  │
│              │  │ │ ● 11:00  Class Name   [ Upcoming ]  │  │ │ │ [N]     [ Review Now →]│ │  │
│              │  │ │ ● 14:00  Class Name   [ Upcoming ]  │  │ │ │                        │ │  │
│              │  │ └─────────────────────────────────────┘  │ │ │ ┌────────┐ ┌────────┐  │ │  │
│              │  │                                          │ │ │ │ [□]    │ │ [□]    │  │ │  │
│              │  │ ┌─ STUDENT ALERTS ────────────────────┐  │ │ │ │Upload  │ │Create  │  │ │  │
│              │  │ │ [□] Student Alerts    [ 8 Active ]  │  │ │ │ │Resource│ │Assign. │  │ │  │
│              │  │ │                                     │  │ │ │ └────────┘ └────────┘  │ │  │
│              │  │ │ ┌─────────────────────────────────┐ │  │ │ └────────────────────────┘ │  │
│              │  │ │ │ [□] Continuous Absences         │ │  │ │                            │  │
│              │  │ │ │ ▬▬ student detail text…         │ │  │ │ ┌─ ANNOUNCEMENTS ────────┐ │  │
│              │  │ │ │ ▬ time ago                      │ │  │ │ │ Announcements           │ │  │
│              │  │ │ └─────────────────────────────────┘ │  │ │ │ ┌────────────────────┐ │ │  │
│              │  │ │ ┌─────────────────────────────────┐ │  │ │ │ │ ▬ Title             │ │ │  │
│              │  │ │ │ [□] Low Performers              │ │  │ │ │ │ ▬ subtitle line     │ │ │  │
│              │  │ │ │ ▬▬ detail · time                │ │  │ │ │ └────────────────────┘ │ │  │
│              │  │ │ └─────────────────────────────────┘ │  │ │ │ ┌────────────────────┐ │ │  │
│              │  │ │ ┌─────────────────────────────────┐ │  │ │ │ │ ▬ Title             │ │ │  │
│              │  │ │ │ [□] Birthdays / New Admissions… │ │  │ │ │ │ ▬ subtitle line     │ │ │  │
│              │  │ │ │ ▬▬ detail · time                │ │  │ │ │ └────────────────────┘ │ │  │
│              │  │ │ └─────────────────────────────────┘ │  │ │ │                        │ │  │
│              │  │ │ (+ more alert cards in stack)       │  │ │ │      [ View All ]      │ │  │
│              │  │ └─────────────────────────────────────┘  │ │ └────────────────────────┘ │  │
│              │  │                                          │ │                            │  │
│              │  │ ┌─ NOTICE BOARD ──────────────────────┐  │ │ ┌─ YOUR TASKS ───────────┐ │  │
│              │  │ │ [□] Notice Board                    │  │ │ │ [□] Your Tasks          │ │  │
│              │  │ │ ▬ Latest updates & announcements    │  │ │ │ ▬ Manage daily workflow │ │  │
│              │  │ │                      [ 12 New ]     │  │ │ │         COMPLETED  [%] │ │  │
│              │  │ │                                     │  │ │ │                        │ │  │
│              │  │ │ ┌─────────────────────────────────┐ │  │ │ │ [✓] Task title         │ │  │
│              │  │ │ │ [■] Title                       │ │  │ │ │     ▬ category · due   │ │  │
│              │  │ │ │ ▬▬ long description…            │ │  │ │ │     [HIGH] [urgency]   │ │  │
│              │  │ │ │ [ALERT] [tag] · time            │ │  │ │ ├────────────────────────┤ │  │
│              │  │ │ │                         [ eye ] │ │  │ │ │ [ ] Task title         │ │  │
│              │  │ │ └─────────────────────────────────┘ │  │ │ │     ▬ … [HIGH] [due…] │ │  │
│              │  │ │ ┌─────────────────────────────────┐ │  │ │ ├────────────────────────┤ │  │
│              │  │ │ │ [■] Title · tags · [READ]       │ │  │ │ │ [ ] Task title …       │ │  │
│              │  │ │ └─────────────────────────────────┘ │  │ │ │                        │ │  │
│              │  │ │                                     │  │ │ │ Overall Progress       │ │  │
│              │  │ │ [ Submit Notice Acknowledgment ✓ ]  │  │ │ │ [████████░░░░░░] %%    │ │  │
│              │  │ └─────────────────────────────────────┘  │ │ │                        │ │  │
│              │  │                                          │ │ │ [ Submit Completed     │ │  │
│              │  └──────────────────────────────────────────┘ │ │   Tasks ✓ ]             │ │  │
│              │                                               │ └────────────────────────┘ │  │
│              │                                               └────────────────────────────┘  │
│              │                                                                                 │
│              │  ┌─ PERFORMANCE ANALYTICS (full width · 12 cols) ───────────────────────────┐  │
│              │  │ [□] Performance Analytics                                                │  │
│              │  │ ● AI-Powered Real-time Insights                    [ Last Month ]        │  │
│              │  │                                                                          │  │
│              │  │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐                     │  │
│              │  │ │ [□]      │ │ [□]      │ │ [□]      │ │ [□]      │                     │  │
│              │  │ │ CLASS    │ │ ASSIGN.  │ │ TOP      │ │ NEED     │                     │  │
│              │  │ │ AVERAGE  │ │ RATE     │ │ PERFORM. │ │ ATTN.    │                     │  │
│              │  │ │ 82%      │ │ 91%      │ │ 12       │ │ 4        │                     │  │
│              │  │ │ ▬ +12%   │ │ ▬ +5%    │ │ ▬ +8%    │ │ ▬ -2     │                     │  │
│              │  │ └──────────┘ └──────────┘ └──────────┘ └──────────┘                     │  │
│              │  │                                                                          │  │
│              │  │ ┌─ PERFORMANCE TREND (chart placeholder) ─────────────────────────────┐  │  │
│              │  │ │  100│                                                               │  │  │
│              │  │ │     │     ██                                                        │  │  │
│              │  │ │   50│  ██ ██ ██                                                     │  │  │
│              │  │ │     │  ██ ██ ██ ██                                                  │  │  │
│              │  │ │    0└──────────────────────                                         │  │  │
│              │  │ │       Aug Sep Oct Nov     (bar chart · hover tooltip)               │  │  │
│              │  │ └─────────────────────────────────────────────────────────────────────┘  │  │
│              │  │                                                                          │  │
│              │  │ ┌─ TOP PERFORMERS ─────────────┐  ┌─ NEEDS ATTENTION ─────────────────┐ │  │
│              │  │ │ 1. (○) Name · Class · ## ↑   │  │ 1. (○) Name · Class · ## ↓        │ │  │
│              │  │ │ 2. (○) Name · Class · ## ↑   │  │ 2. (○) Name · Class · ## ↓        │ │  │
│              │  │ │ 3. (○) Name · Class · ## ↑   │  │ 3. (○) Name · Class · ## ↓        │ │  │
│              │  │ └──────────────────────────────┘  └───────────────────────────────────┘ │  │
│              │  └──────────────────────────────────────────────────────────────────────────┘  │
│              │                                                                                 │
│              │                                                         ┌─ FLOATING AI ─────┐  │
│              │                                                         │      ( ★ )        │  │
│              │                                                         │   FAB closed      │  │
│              │                                                         └───────────────────┘  │
└──────────────┴─────────────────────────────────────────────────────────────────────────────────┘
│ FOOTER: none                                                                                   │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 12-col content map

| Cols | Region |
|------|--------|
| 1–7 | Left: Today’s Classes → Student Alerts → Notice Board |
| 8–12 | Right: Today’s Summary → Your Work → Announcements → Your Tasks |
| 1–12 | Performance Analytics (full width below) |

---

## B. OVERLAY — NOTIFICATIONS PANEL

*(Opens from header Bell · not a modal dialog)*

```
                                        ┌─ NOTIFICATIONS PANEL ──────────────────┐
                                        │ Notifications          [ Mark all read ]│
                                        ├─────────────────────────────────────────┤
                                        │ ●  ▬ Notification title                 │
                                        │    ▬ description text                   │
                                        │    ▬ time ago                           │
                                        ├─────────────────────────────────────────┤
                                        │ ●  ▬ Notification title                 │
                                        │    ▬ description · time                 │
                                        ├─────────────────────────────────────────┤
                                        │ ○  ▬ Read item title                    │
                                        │    ▬ description · time                 │
                                        └─────────────────────────────────────────┘
```

---

## C. OVERLAY — PROFILE DROPDOWN

```
                                                    ┌─ PROFILE MENU ─────────────┐
                                                    │ (○) Name                    │
                                                    │ ▬ Role                      │
                                                    ├─────────────────────────────┤
                                                    │ [□] My Profile              │
                                                    │ [□] Settings                │
                                                    │ [□] Privacy & Security      │
                                                    │ [□] Dark / Light Mode       │
                                                    │ [□] Help & Support          │
                                                    ├─────────────────────────────┤
                                                    │ [□] Logout                  │
                                                    └─────────────────────────────┘
```

---

## D. OVERLAY — AI ASSISTANT (OPEN)

```
                                                  ┌─ AI ASSISTANT PANEL ─────────────┐
                                                  │ [□] AI Assistant           [ X ] │
                                                  ├──────────────────────────────────┤
                                                  │                                  │
                                                  │  ┌─ bot bubble ───────────────┐  │
                                                  │  │ ▬ greeting / help text     │  │
                                                  │  └────────────────────────────┘  │
                                                  │                                  │
                                                  │  [ Quick reply chip ]            │
                                                  │  [ Quick reply chip ]            │
                                                  │  [ Quick reply chip ]            │
                                                  │                                  │
                                                  │  ┌─ user bubble (optional) ───┐  │
                                                  │  │ ▬ message                  │  │
                                                  │  └────────────────────────────┘  │
                                                  │  ▬ ● ● ●  (typing)               │
                                                  ├──────────────────────────────────┤
                                                  │ [____________________] [Send] [mic]│
                                                  └──────────────────────────────────┘
                                                              ( ★ → X on FAB )
```

---

## E. COMPONENT DETAIL SKELETONS

### Today’s Class Row — states

```
Completed:   ●  HH:MM  ▬ Class / Subject          [ Done ]
             (row muted)

Live:        ●  HH:MM  ▬ Class / Subject       [● LIVE NOW]
             ▬ attendance % · N Present · Room · Duration
                                      [ Mark Attendance ]

Upcoming:    ●  HH:MM  ▬ Class / Subject        [ Upcoming ]
```

### Student Alert Card

```
┌────────────────────────────────┐
│ [□] Alert title                │
│ ▬▬ student detail line         │
│ ▬ relative time                │
└────────────────────────────────┘
```

### Notice Card

```
┌────────────────────────────────┐
│ [■] Notice title               │
│ ▬▬ body text…                  │
│ [ALERT] [tag] · timestamp  [eye] / [READ]
└────────────────────────────────┘
```

### Your Work action tiles

```
┌──────────────┐  ┌──────────────┐
│     [□]      │  │     [□]      │
│ Upload       │  │ Create       │
│ Resource     │  │ Assignment   │
└──────────────┘  └──────────────┘
```

### Task row

```
[ ] / [✓]  ▬ Task title
           ▬ category · due date
           [HIGH]  [ 2d overdue | Due Today | 1d left ]
```

### Performance Trend hover

```
        ┌ tooltip ┐
        │ Month   │
        │ Score % │
        └─────────┘
           ██
```

---

## F. EMPTY STATES

**Not documented** for Overview (lists show populated content). No separate empty-state wireframes.

---

## G. ALTERNATE TAB VIEWS

**None** — Overview has no tab bar.

---

## H. SECTION LABEL INDEX (for Figma layers)

| Layer name | Type |
|------------|------|
| App Header | Chrome |
| Sidebar | Nav · Overview active |
| Greeting Row | Header strip |
| Today’s Classes | Left panel |
| Student Alerts | Left panel |
| Notice Board | Left panel |
| Today’s Summary | Right · 3 KPI tiles |
| Your Work | Right panel |
| Announcements | Right list |
| Your Tasks | Right checklist + progress |
| Performance Analytics | Full-width |
| Performance KPIs (×4) | KPI row |
| Performance Trend | Chart placeholder |
| Top Performers | List |
| Needs Attention | List |
| Floating AI FAB | Floating |
| Notifications Panel | Overlay |
| Profile Dropdown | Overlay |
| AI Assistant Panel | Overlay |

---

## I. HIERARCHY / WORKFLOW ALIGNMENT

Scan order matches documented workflow:

1. Greeting + date
2. Today’s Summary (right) + Today’s Classes (left)
3. Mark Attendance / View Full Schedule
4. Student Alerts → Notice Board
5. Your Work → Announcements → Your Tasks
6. Performance Analytics (KPIs → chart → lists)
7. Optional AI / header overlays

---

## Hand-off note for Figma

Recreate boxes, lines, and placeholders as-is; apply brand, color, and imagery only in a later visual-design pass.
