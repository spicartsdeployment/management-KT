import React, { useState, useMemo, useCallback, useEffect } from "react";
import "../../Assets/styles/SystemPreferences.scss";
import ManagementPageHeader from "../../app/components/common/ManagementPageHeader";
import {
  SP_METRICS,
  DASHBOARD_WIDGETS,
  LANDING_PAGE_OPTIONS,
  REFRESH_INTERVALS,
  LANGUAGE_OPTIONS,
  TIMEZONE_OPTIONS,
  DATE_FORMAT_OPTIONS,
  NUMBER_FORMAT_OPTIONS,
  CURRENCY_DISPLAY_OPTIONS,
  PAGE_SIZE_OPTIONS,
  EXPORT_FORMAT_OPTIONS,
  FONT_SCALE_OPTIONS,
  UI_DENSITY_OPTIONS,
  SIDEBAR_WIDTH_OPTIONS,
  THEME_COLOR_PRESETS,
  IDLE_TIMEOUT_OPTIONS,
  AUTO_LOGOUT_OPTIONS,
  MULTI_TAB_OPTIONS,
  DEFAULT_SORT_OPTIONS,
  CONTENT_WIDTH_OPTIONS,
  NAVIGATION_MODE_OPTIONS,
  MODAL_DRAWER_OPTIONS,
  DEFAULT_PREFERENCES,
} from "./systemPreferencesMockData";

// ── Sidebar nav items ─────────────────────────────────────────────────────────
const SP_NAV = [
  { id: "overview",     icon: "📊", label: "Overview" },
  { id: "dashboard",    icon: "🏠", label: "Dashboard Preferences" },
  { id: "layout",       icon: "⬜", label: "Layout Preferences" },
  { id: "sidebar",      icon: "◀", label: "Sidebar Preferences" },
  { id: "theme",        icon: "🎨", label: "Theme Preferences" },
  { id: "accessibility",icon: "♿", label: "Accessibility Settings" },
  { id: "localization", icon: "🌐", label: "Localization Preferences" },
  { id: "datetime",     icon: "🕐", label: "Date & Time Preferences" },
  { id: "session",      icon: "🔐", label: "Session Preferences" },
  { id: "navigation",   icon: "🧭", label: "Default Navigation" },
  { id: "table",        icon: "📋", label: "Table & Pagination" },
  { id: "search",       icon: "🔍", label: "Search Preferences" },
  { id: "refresh",      icon: "🔄", label: "Auto Refresh Preferences" },
  { id: "files",        icon: "📁", label: "File Handling Preferences" },
  { id: "download",     icon: "⬇️", label: "Download Preferences" },
  { id: "workflow",     icon: "🔀", label: "Workflow Preferences" },
  { id: "device",       icon: "🖥️", label: "Device & Display" },
];

// ── Shared primitives ─────────────────────────────────────────────────────────

/** @param {{ on: boolean, onChange: () => void, testId?: string }} */
const Toggle = ({ on, onChange, testId }) => (
  <button
    role="switch"
    aria-checked={on}
    data-testid={testId}
    className={`sp-toggle${on ? " sp-toggle--on" : ""}`}
    onClick={onChange}
  >
    <span className="sp-toggle__thumb" />
  </button>
);

/** @param {{ label: string, desc?: string, on: boolean, onChange: () => void, testId?: string }} */
const ToggleRow = ({ label, desc, on, onChange, testId }) => (
  <div className="sp-toggle-row">
    <div className="sp-toggle-row__text">
      <span className="sp-toggle-row__label">{label}</span>
      {desc && <span className="sp-toggle-row__desc">{desc}</span>}
    </div>
    <Toggle on={on} onChange={onChange} testId={testId} />
  </div>
);

/** @param {{ value: string, options: Array<{value,label}>, onChange: (v:string) => void, testId?: string }} */
const SelField = ({ label, hint, value, options, onChange, testId }) => (
  <div className="sp-field">
    {label && <label className="sp-field__label">{label}</label>}
    {hint  && <span  className="sp-field__hint">{hint}</span>}
    <select
      className="sp-field__select"
      value={value}
      onChange={e => onChange(e.target.value)}
      data-testid={testId}
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </div>
);

/** @param {{ title: string, icon?: string, desc?: string, children: React.ReactNode }} */
const PrefCard = ({ title, icon, desc, children, testId }) => (
  <div className="sp-card" data-testid={testId}>
    <div className="sp-card__head">
      <div className="sp-card__meta">
        <div className="sp-card__title">
          {icon && <span className="sp-card__icon">{icon}</span>}
          {title}
        </div>
        {desc && <div className="sp-card__desc">{desc}</div>}
      </div>
    </div>
    <div className="sp-card__body">{children}</div>
  </div>
);

/** Radio-style pill group */
const RadioGroup = ({ value, options, onChange, testId }) => (
  <div className="sp-radio-group" data-testid={testId}>
    {options.map(o => (
      <button
        key={o.value}
        type="button"
        className={`sp-radio-btn${value === o.value ? " sp-radio-btn--active" : ""}`}
        onClick={() => onChange(o.value)}
        data-testid={`${testId}-${o.value}`}
      >
        {o.label}
      </button>
    ))}
  </div>
);

// ── Section components ────────────────────────────────────────────────────────

/** Overview — metrics + active summary */
const OverviewSection = ({ prefs }) => {
  const customizedCount = useMemo(() => {
    let count = 0;
    Object.keys(DEFAULT_PREFERENCES).forEach(k => {
      if (prefs[k] !== DEFAULT_PREFERENCES[k]) count++;
    });
    return count;
  }, [prefs]);

  const metrics = useMemo(() =>
    SP_METRICS.map(m =>
      m.id === "customized-settings" ? { ...m, value: customizedCount } : m
    ),
  [customizedCount]);

  return (
    <div className="sp-section-container sp-section-container--lg">
      <div className="sp-section-header">
        <span className="sp-section-header__icon">📊</span>
        <div>
          <h2 className="sp-section-header__title">System Preferences Overview</h2>
          <p className="sp-section-header__desc">
            Centralized ERP personalization dashboard — manage operational behavior, interface defaults, and system-wide experience.
          </p>
        </div>
      </div>

      <div className="sp-metrics-grid">
        {metrics.map(m => (
          <div key={m.id} className={`sp-metric-card sp-metric-card--${m.color}`} data-testid={`school-metric-sp-${m.id}`}>
            <span className="sp-metric-card__icon">{m.icon}</span>
            <div className="sp-metric-card__body">
              <span className="sp-metric-card__value">{m.value}</span>
              <span className="sp-metric-card__label">{m.label}</span>
              <span className="sp-metric-card__trend">{m.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="sp-info-box">
        💡 Changes made in each section are applied to your active session. Click <strong>Save Preferences</strong> to persist across sessions.
        Use <strong>Reset to Defaults</strong> to restore all settings to system defaults.
      </div>
    </div>
  );
};

/** Dashboard Preferences */
const DashboardSection = ({ prefs, onChange, widgets, onWidgetToggle, onWidgetPin }) => (
  <div className="sp-section-container">
    <div className="sp-section-header">
      <span className="sp-section-header__icon">🏠</span>
      <div>
        <h2 className="sp-section-header__title">Dashboard Preferences</h2>
        <p className="sp-section-header__desc">Configure your default landing page, widget visibility, layout mode, and refresh behavior.</p>
      </div>
    </div>

    <PrefCard title="Landing & Layout" icon="🏠" testId="school-card-sp-landing">
      <div className="sp-form-grid">
        <SelField
          label="Default Landing Page"
          hint="Page shown after login"
          value={prefs.landingPage}
          options={LANDING_PAGE_OPTIONS}
          onChange={v => onChange("landingPage", v)}
          testId="school-dropdown-sp-landing-page"
        />
        <SelField
          label="Dashboard Refresh Interval"
          hint="Auto-refresh live data tiles"
          value={prefs.dashboardRefresh}
          options={REFRESH_INTERVALS}
          onChange={v => onChange("dashboardRefresh", v)}
          testId="school-dropdown-sp-dashboard-refresh"
        />
        <div className="sp-field sp-form-grid__full">
          <label className="sp-field__label">Dashboard Layout Mode</label>
          <span className="sp-field__hint">How widgets are arranged on the dashboard</span>
          <RadioGroup
            value={prefs.dashboardLayoutMode}
            options={[{ value: "grid", label: "Grid" }, { value: "list", label: "List" }, { value: "masonry", label: "Masonry" }]}
            onChange={v => onChange("dashboardLayoutMode", v)}
            testId="school-radio-sp-dashboard-layout"
          />
        </div>
        <div className="sp-field sp-form-grid__full">
          <label className="sp-field__label">Dashboard Density</label>
          <RadioGroup
            value={prefs.dashboardDensity}
            options={UI_DENSITY_OPTIONS}
            onChange={v => onChange("dashboardDensity", v)}
            testId="school-radio-sp-dashboard-density"
          />
        </div>
      </div>
    </PrefCard>

    <PrefCard title="Widget Visibility & Pinning" icon="📌" desc="Control which widgets appear on your dashboard" testId="school-card-sp-widgets">
      <div className="sp-widget-grid">
        {widgets.map(w => (
          <div key={w.id} className={`sp-widget-row${w.pinned ? " sp-widget-row--pinned" : ""}`} data-testid={`school-widget-sp-${w.id}`}>
            <Toggle
              on={w.visible}
              onChange={() => onWidgetToggle(w.id)}
              testId={`school-toggle-sp-widget-${w.id}`}
            />
            <span className="sp-widget-row__label">{w.label}</span>
            <button
              type="button"
              className={`sp-widget-row__pin${w.pinned ? " sp-widget-row__pin--active" : ""}`}
              onClick={() => onWidgetPin(w.id)}
              data-testid={`school-button-sp-pin-${w.id}`}
              title={w.pinned ? "Unpin widget" : "Pin to top"}
            >
              {w.pinned ? "📌 Pinned" : "Pin"}
            </button>
          </div>
        ))}
      </div>
    </PrefCard>
  </div>
);

/** Layout Preferences */
const LayoutSection = ({ prefs, onChange }) => (
  <div className="sp-section-container">
    <div className="sp-section-header">
      <span className="sp-section-header__icon">⬜</span>
      <div>
        <h2 className="sp-section-header__title">Layout Preferences</h2>
        <p className="sp-section-header__desc">Configure navigation orientation, content width, and structural layout behavior.</p>
      </div>
    </div>

    <PrefCard title="Navigation Style" icon="🧭" testId="school-card-sp-nav-style">
      <div className="sp-field sp-field--spaced">
        <label className="sp-field__label">Navigation Mode</label>
        <RadioGroup
          value={prefs.navigationMode}
          options={NAVIGATION_MODE_OPTIONS}
          onChange={v => onChange("navigationMode", v)}
          testId="school-radio-sp-nav-mode"
        />
      </div>
      <div className="sp-field">
        <label className="sp-field__label">Content Width</label>
        <span className="sp-field__hint">Maximum width of the main content area</span>
        <RadioGroup
          value={prefs.contentWidth}
          options={CONTENT_WIDTH_OPTIONS}
          onChange={v => onChange("contentWidth", v)}
          testId="school-radio-sp-content-width"
        />
      </div>
    </PrefCard>
  </div>
);

/** Sidebar Preferences */
const SidebarSection = ({ prefs, onChange }) => (
  <div className="sp-section-container">
    <div className="sp-section-header">
      <span className="sp-section-header__icon">◀</span>
      <div>
        <h2 className="sp-section-header__title">Sidebar Preferences</h2>
        <p className="sp-section-header__desc">Control sidebar behavior, width, and compact navigation display.</p>
      </div>
    </div>

    <PrefCard title="Sidebar Behavior" icon="◀" testId="school-card-sp-sidebar">
      <ToggleRow
        label="Collapsible Sidebar"
        desc="Allow sidebar to collapse into icon-only mode"
        on={prefs.sidebarCollapsible}
        onChange={() => onChange("sidebarCollapsible", !prefs.sidebarCollapsible)}
        testId="school-toggle-sp-sidebar-collapsible"
      />
      <ToggleRow
        label="Fixed / Sticky Sidebar"
        desc="Sidebar stays fixed while scrolling content"
        on={prefs.sidebarFixed}
        onChange={() => onChange("sidebarFixed", !prefs.sidebarFixed)}
        testId="school-toggle-sp-sidebar-fixed"
      />
      <ToggleRow
        label="Compact Navigation Mode"
        desc="Reduce padding and spacing in sidebar items"
        on={prefs.sidebarCompact}
        onChange={() => onChange("sidebarCompact", !prefs.sidebarCompact)}
        testId="school-toggle-sp-sidebar-compact"
      />
      <div className="sp-divider" />
      <div className="sp-field">
        <label className="sp-field__label">Sidebar Width</label>
        <RadioGroup
          value={prefs.sidebarWidth}
          options={SIDEBAR_WIDTH_OPTIONS}
          onChange={v => onChange("sidebarWidth", v)}
          testId="school-radio-sp-sidebar-width"
        />
      </div>
    </PrefCard>
  </div>
);

/** Theme Preferences */
const ThemeSection = ({ prefs, onChange }) => (
  <div className="sp-section-container">
    <div className="sp-section-header">
      <span className="sp-section-header__icon">🎨</span>
      <div>
        <h2 className="sp-section-header__title">Theme Preferences</h2>
        <p className="sp-section-header__desc">Customize the visual appearance — color mode, typography, density, and accent color.</p>
      </div>
    </div>

    <PrefCard title="Color Mode" icon="🌗" testId="school-card-sp-theme-mode">
      <div className="sp-field sp-field--spaced">
        <label className="sp-field__label">Theme Mode</label>
        <RadioGroup
          value={prefs.theme}
          options={[{ value: "light", label: "☀️ Light" }, { value: "dark", label: "🌙 Dark" }, { value: "system", label: "💻 System" }]}
          onChange={v => onChange("theme", v)}
          testId="school-radio-sp-theme-mode"
        />
      </div>
      <ToggleRow
        label="System Theme Sync"
        desc="Automatically follow OS dark/light preference"
        on={prefs.systemThemeSync}
        onChange={() => onChange("systemThemeSync", !prefs.systemThemeSync)}
        testId="school-toggle-sp-system-theme-sync"
      />
    </PrefCard>

    <PrefCard title="Typography & Density" icon="🔤" testId="school-card-sp-typography">
      <div className="sp-field sp-field--spaced">
        <label className="sp-field__label">Font Scale</label>
        <RadioGroup
          value={prefs.fontScale}
          options={FONT_SCALE_OPTIONS}
          onChange={v => onChange("fontScale", v)}
          testId="school-radio-sp-font-scale"
        />
      </div>
      <div className="sp-field">
        <label className="sp-field__label">UI Density</label>
        <RadioGroup
          value={prefs.uiDensity}
          options={UI_DENSITY_OPTIONS}
          onChange={v => onChange("uiDensity", v)}
          testId="school-radio-sp-ui-density"
        />
      </div>
    </PrefCard>

    <PrefCard title="Accent Color" icon="🎨" desc="Choose your primary accent color for buttons, links, and highlights" testId="school-card-sp-color-preset">
      <div className="sp-color-presets">
        {THEME_COLOR_PRESETS.map(c => (
          <button
            key={c.value}
            type="button"
            className={`sp-color-swatch${prefs.themeColor === c.value ? " sp-color-swatch--active" : ""}`}
            onClick={() => onChange("themeColor", c.value)}
            data-testid={`school-button-sp-color-${c.value}`}
          >
            <span className="sp-color-swatch__dot" style={{ background: c.hex }} />
            {c.label}
          </button>
        ))}
      </div>
    </PrefCard>
  </div>
);

/** Accessibility Settings */
const AccessibilitySection = ({ prefs, onChange }) => (
  <div className="sp-section-container">
    <div className="sp-section-header">
      <span className="sp-section-header__icon">♿</span>
      <div>
        <h2 className="sp-section-header__title">Accessibility Settings</h2>
        <p className="sp-section-header__desc">Optimize the interface for assistive technologies, motor accessibility, and visual needs.</p>
      </div>
    </div>

    <PrefCard title="Visual & Motion" icon="👁️" testId="school-card-sp-a11y-visual">
      <ToggleRow label="High Contrast Mode"       desc="Increase color contrast for better readability"           on={prefs.highContrast}      onChange={() => onChange("highContrast",      !prefs.highContrast)}      testId="school-toggle-sp-high-contrast" />
      <ToggleRow label="Reduced Motion"            desc="Disable animations and transitions"                       on={prefs.reducedMotion}     onChange={() => onChange("reducedMotion",     !prefs.reducedMotion)}     testId="school-toggle-sp-reduced-motion" />
      <ToggleRow label="Larger Text Mode"          desc="Increase base font size across the ERP"                   on={prefs.largerText}        onChange={() => onChange("largerText",        !prefs.largerText)}        testId="school-toggle-sp-larger-text" />
      <ToggleRow label="Focus Visibility"          desc="Show persistent focus outlines on interactive elements"   on={prefs.focusVisibility}   onChange={() => onChange("focusVisibility",   !prefs.focusVisibility)}   testId="school-toggle-sp-focus-visibility" />
    </PrefCard>

    <PrefCard title="Interaction" icon="⌨️" testId="school-card-sp-a11y-interaction">
      <ToggleRow label="Keyboard Navigation Mode"   desc="Optimize tab order and keyboard shortcuts"                on={prefs.keyboardNavigation} onChange={() => onChange("keyboardNavigation", !prefs.keyboardNavigation)} testId="school-toggle-sp-keyboard-nav" />
      <ToggleRow label="Screen Reader Optimization" desc="Add ARIA labels and landmark regions for screen readers"  on={prefs.screenReaderOpt}    onChange={() => onChange("screenReaderOpt",    !prefs.screenReaderOpt)}    testId="school-toggle-sp-screen-reader" />
    </PrefCard>
  </div>
);

/** Localization Preferences */
const LocalizationSection = ({ prefs, onChange }) => (
  <div className="sp-section-container">
    <div className="sp-section-header">
      <span className="sp-section-header__icon">🌐</span>
      <div>
        <h2 className="sp-section-header__title">Localization Preferences</h2>
        <p className="sp-section-header__desc">Set your language, regional formats, timezone, and number display preferences.</p>
      </div>
    </div>

    <PrefCard title="Language & Region" icon="🌐" testId="school-card-sp-locale">
      <div className="sp-form-grid">
        <SelField label="Interface Language"   value={prefs.language}        options={LANGUAGE_OPTIONS}          onChange={v => onChange("language", v)}         testId="school-dropdown-sp-language" />
        <SelField label="Timezone"             value={prefs.timezone}        options={TIMEZONE_OPTIONS}          onChange={v => onChange("timezone", v)}         testId="school-dropdown-sp-timezone" />
        <SelField label="Number Format"        value={prefs.numberFormat}    options={NUMBER_FORMAT_OPTIONS}     onChange={v => onChange("numberFormat", v)}     testId="school-dropdown-sp-number-format" />
        <SelField label="Currency Display"     value={prefs.currencyDisplay} options={CURRENCY_DISPLAY_OPTIONS} onChange={v => onChange("currencyDisplay", v)}  testId="school-dropdown-sp-currency-display" />
      </div>
    </PrefCard>
  </div>
);

/** Date & Time Preferences */
const DateTimeSection = ({ prefs, onChange }) => (
  <div className="sp-section-container">
    <div className="sp-section-header">
      <span className="sp-section-header__icon">🕐</span>
      <div>
        <h2 className="sp-section-header__title">Date & Time Preferences</h2>
        <p className="sp-section-header__desc">Configure how dates and times are displayed throughout the ERP.</p>
      </div>
    </div>

    <PrefCard title="Date Format" icon="📅" testId="school-card-sp-date-format">
      <div className="sp-field sp-field--spaced sp-field--wide">
        <label className="sp-field__label">Date Display Format</label>
        <select
          className="sp-field__select"
          value={prefs.dateFormat}
          onChange={e => onChange("dateFormat", e.target.value)}
          data-testid="school-dropdown-sp-date-format"
        >
          {DATE_FORMAT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      <ToggleRow label="24-Hour Clock"         desc="Show times in 24-hour format (e.g. 14:30)"            on={prefs.use24Hour}         onChange={() => onChange("use24Hour",         !prefs.use24Hour)}         testId="school-toggle-sp-24hour" />
      <ToggleRow label="Show Seconds"          desc="Display seconds in time fields"                        on={prefs.showSeconds}       onChange={() => onChange("showSeconds",       !prefs.showSeconds)}       testId="school-toggle-sp-show-seconds" />
      <ToggleRow label="Relative Time Display" desc='Show "2 hours ago" style timestamps where applicable'  on={prefs.showRelativeTime}  onChange={() => onChange("showRelativeTime",  !prefs.showRelativeTime)}  testId="school-toggle-sp-relative-time" />
    </PrefCard>
  </div>
);

/** Session Preferences */
const SessionSection = ({ prefs, onChange }) => (
  <div className="sp-section-container">
    <div className="sp-section-header">
      <span className="sp-section-header__icon">🔐</span>
      <div>
        <h2 className="sp-section-header__title">Session Preferences</h2>
        <p className="sp-section-header__desc">Control session duration, idle behavior, tab management, and session restoration.</p>
      </div>
    </div>

    <PrefCard title="Timeouts" icon="⏱️" testId="school-card-sp-session-timeouts">
      <div className="sp-form-grid">
        <SelField label="Auto Logout Duration" hint="Session expires after inactivity" value={prefs.autoLogout}  options={AUTO_LOGOUT_OPTIONS}  onChange={v => onChange("autoLogout", v)}  testId="school-dropdown-sp-auto-logout" />
        <SelField label="Idle Timeout"         hint="Prompt after idle period"         value={prefs.idleTimeout} options={IDLE_TIMEOUT_OPTIONS} onChange={v => onChange("idleTimeout", v)} testId="school-dropdown-sp-idle-timeout" />
        <div className="sp-field sp-form-grid__full">
          <label className="sp-field__label">Multi-Tab Behavior</label>
          <RadioGroup
            value={prefs.multiTabBehavior}
            options={MULTI_TAB_OPTIONS}
            onChange={v => onChange("multiTabBehavior", v)}
            testId="school-radio-sp-multi-tab"
          />
        </div>
      </div>
    </PrefCard>

    <PrefCard title="Session Persistence" icon="💾" testId="school-card-sp-session-persist">
      <ToggleRow label="Remember Session" desc="Keep you logged in across browser restarts"  on={prefs.rememberSession} onChange={() => onChange("rememberSession", !prefs.rememberSession)} testId="school-toggle-sp-remember-session" />
      <ToggleRow label="Session Restore"  desc="Restore last active page on return"          on={prefs.sessionRestore}  onChange={() => onChange("sessionRestore",  !prefs.sessionRestore)}  testId="school-toggle-sp-session-restore" />
    </PrefCard>
  </div>
);

/** Default Navigation Preferences */
const NavigationSection = ({ prefs, onChange }) => (
  <div className="sp-section-container">
    <div className="sp-section-header">
      <span className="sp-section-header__icon">🧭</span>
      <div>
        <h2 className="sp-section-header__title">Default Navigation Preferences</h2>
        <p className="sp-section-header__desc">Configure navigation memory, breadcrumbs, and quick-access behavior.</p>
      </div>
    </div>

    <PrefCard title="Navigation Behavior" icon="🧭" testId="school-card-sp-nav-behavior">
      <ToggleRow label="Remember Last Page"    desc="Return to the last visited page on login"           on={prefs.rememberLastPage} onChange={() => onChange("rememberLastPage", !prefs.rememberLastPage)} testId="school-toggle-sp-remember-page" />
      <ToggleRow label="Breadcrumb Navigation" desc="Show breadcrumb trail at the top of each page"      on={prefs.breadcrumbs}      onChange={() => onChange("breadcrumbs",      !prefs.breadcrumbs)}      testId="school-toggle-sp-breadcrumbs" />
      <ToggleRow label="Quick Access Bar"      desc="Show pinned shortcuts in the top navigation bar"   on={prefs.quickAccess}      onChange={() => onChange("quickAccess",      !prefs.quickAccess)}      testId="school-toggle-sp-quick-access" />
    </PrefCard>
  </div>
);

/** Table & Pagination Preferences */
const TableSection = ({ prefs, onChange }) => (
  <div className="sp-section-container">
    <div className="sp-section-header">
      <span className="sp-section-header__icon">📋</span>
      <div>
        <h2 className="sp-section-header__title">Table & Pagination Preferences</h2>
        <p className="sp-section-header__desc">Set default row counts, table density, sorting, and column control behavior.</p>
      </div>
    </div>

    <PrefCard title="Table Display" icon="📋" testId="school-card-sp-table">
      <div className="sp-form-grid">
        <SelField label="Default Page Size" hint="Rows per page in all data tables" value={prefs.pageSize} options={PAGE_SIZE_OPTIONS} onChange={v => onChange("pageSize", v)} testId="school-dropdown-sp-page-size" />
        <div className="sp-field">
          <label className="sp-field__label">Default Sort Direction</label>
          <RadioGroup value={prefs.defaultSort} options={DEFAULT_SORT_OPTIONS} onChange={v => onChange("defaultSort", v)} testId="school-radio-sp-default-sort" />
        </div>
        <div className="sp-field sp-form-grid__full">
          <label className="sp-field__label">Table Density</label>
          <RadioGroup value={prefs.tableDensity} options={UI_DENSITY_OPTIONS} onChange={v => onChange("tableDensity", v)} testId="school-radio-sp-table-density" />
        </div>
      </div>
      <div className="sp-divider" />
      <ToggleRow label="Sticky Table Headers"      desc="Headers stay visible when scrolling long tables"      on={prefs.stickyHeaders}      onChange={() => onChange("stickyHeaders",      !prefs.stickyHeaders)}      testId="school-toggle-sp-sticky-headers" />
      <ToggleRow label="Column Visibility Controls" desc="Show column show/hide controls on all tables"        on={prefs.showColumnControls}  onChange={() => onChange("showColumnControls",  !prefs.showColumnControls)}  testId="school-toggle-sp-column-controls" />
      <ToggleRow label="Auto-Export on Open"        desc="Prompt for export when opening a data table view"    on={prefs.exportOnOpen}        onChange={() => onChange("exportOnOpen",        !prefs.exportOnOpen)}        testId="school-toggle-sp-export-on-open" />
    </PrefCard>
  </div>
);

/** Search Preferences */
const SearchSection = ({ prefs, onChange }) => (
  <div className="sp-section-container">
    <div className="sp-section-header">
      <span className="sp-section-header__icon">🔍</span>
      <div>
        <h2 className="sp-section-header__title">Search Preferences</h2>
        <p className="sp-section-header__desc">Configure instant search, suggestions, recent searches, and global search behavior.</p>
      </div>
    </div>

    <PrefCard title="Search Behavior" icon="🔍" testId="school-card-sp-search">
      <ToggleRow label="Instant Search"         desc="Show results as you type"                                on={prefs.instantSearch}     onChange={() => onChange("instantSearch",     !prefs.instantSearch)}     testId="school-toggle-sp-instant-search" />
      <ToggleRow label="Recent Searches"        desc="Show recent search history in the search bar"            on={prefs.recentSearches}    onChange={() => onChange("recentSearches",    !prefs.recentSearches)}    testId="school-toggle-sp-recent-searches" />
      <ToggleRow label="Search Suggestions"     desc="Show auto-complete suggestions while typing"             on={prefs.searchSuggestions} onChange={() => onChange("searchSuggestions", !prefs.searchSuggestions)} testId="school-toggle-sp-search-suggestions" />
      <ToggleRow label="Global Search"          desc="Enable cross-module search from the top navigation bar"  on={prefs.globalSearch}      onChange={() => onChange("globalSearch",      !prefs.globalSearch)}      testId="school-toggle-sp-global-search" />
    </PrefCard>
  </div>
);

/** Auto Refresh Preferences */
const RefreshSection = ({ prefs, onChange }) => (
  <div className="sp-section-container">
    <div className="sp-section-header">
      <span className="sp-section-header__icon">🔄</span>
      <div>
        <h2 className="sp-section-header__title">Auto Refresh Preferences</h2>
        <p className="sp-section-header__desc">Configure live data sync, auto-refresh intervals, and background data refresh.</p>
      </div>
    </div>

    <PrefCard title="Refresh & Sync" icon="🔄" testId="school-card-sp-refresh">
      <div className="sp-field sp-field--spaced sp-field--constraint">
        <label className="sp-field__label">Global Refresh Rate</label>
        <span className="sp-field__hint">Default for all live data tiles</span>
        <select
          className="sp-field__select"
          value={prefs.globalRefreshRate}
          onChange={e => onChange("globalRefreshRate", e.target.value)}
          data-testid="school-dropdown-sp-global-refresh"
        >
          {REFRESH_INTERVALS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      <ToggleRow label="Live Data"          desc="Receive real-time data updates in dashboard tiles"        on={prefs.liveData}          onChange={() => onChange("liveData",          !prefs.liveData)}          testId="school-toggle-sp-live-data" />
      <ToggleRow label="Auto Sync"          desc="Sync locally cached data with server periodically"       on={prefs.autoSync}          onChange={() => onChange("autoSync",          !prefs.autoSync)}          testId="school-toggle-sp-auto-sync" />
      <ToggleRow label="Background Refresh" desc="Refresh data when the browser tab is in the background"  on={prefs.backgroundRefresh} onChange={() => onChange("backgroundRefresh",  !prefs.backgroundRefresh)} testId="school-toggle-sp-bg-refresh" />
    </PrefCard>
  </div>
);

/** File Handling Preferences */
const FilesSection = ({ prefs, onChange }) => (
  <div className="sp-section-container">
    <div className="sp-section-header">
      <span className="sp-section-header__icon">📁</span>
      <div>
        <h2 className="sp-section-header__title">File Handling Preferences</h2>
        <p className="sp-section-header__desc">Set defaults for file uploads, attachment previews, and document handling.</p>
      </div>
    </div>

    <PrefCard title="File Behavior" icon="📁" testId="school-card-sp-files">
      <ToggleRow label="Preview Attachments" desc="Open attachments in inline preview instead of downloading" on={prefs.previewAttachments} onChange={() => onChange("previewAttachments", !prefs.previewAttachments)} testId="school-toggle-sp-preview-attachments" />
    </PrefCard>
  </div>
);

/** Download Preferences */
const DownloadSection = ({ prefs, onChange }) => (
  <div className="sp-section-container">
    <div className="sp-section-header">
      <span className="sp-section-header__icon">⬇️</span>
      <div>
        <h2 className="sp-section-header__title">Download Preferences</h2>
        <p className="sp-section-header__desc">Configure default export formats and download behavior across the ERP.</p>
      </div>
    </div>

    <PrefCard title="Export & Download" icon="⬇️" testId="school-card-sp-download">
      <div className="sp-field sp-field--spaced sp-field--constraint">
        <label className="sp-field__label">Default Export Format</label>
        <span className="sp-field__hint">Applied to all bulk export actions</span>
        <select
          className="sp-field__select"
          value={prefs.exportFormat}
          onChange={e => onChange("exportFormat", e.target.value)}
          data-testid="school-dropdown-sp-export-format"
        >
          {EXPORT_FORMAT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      <ToggleRow label="Auto-Download Files" desc="Trigger immediate download without showing a save dialog" on={prefs.autoDownload} onChange={() => onChange("autoDownload", !prefs.autoDownload)} testId="school-toggle-sp-auto-download" />
    </PrefCard>
  </div>
);

/** Workflow Preferences */
const WorkflowSection = ({ prefs, onChange }) => (
  <div className="sp-section-container">
    <div className="sp-section-header">
      <span className="sp-section-header__icon">🔀</span>
      <div>
        <h2 className="sp-section-header__title">Workflow Preferences</h2>
        <p className="sp-section-header__desc">Control confirmation dialogs, autosave, modal vs drawer behavior, and workflow shortcuts.</p>
      </div>
    </div>

    <PrefCard title="Interaction Defaults" icon="🔀" testId="school-card-sp-workflow">
      <ToggleRow label="Confirmation Dialogs"  desc="Show confirmation before irreversible actions"         on={prefs.confirmDialogs}    onChange={() => onChange("confirmDialogs",    !prefs.confirmDialogs)}    testId="school-toggle-sp-confirm-dialogs" />
      <ToggleRow label="Autosave"              desc="Automatically save form drafts every 30 seconds"       on={prefs.autosave}          onChange={() => onChange("autosave",          !prefs.autosave)}          testId="school-toggle-sp-autosave" />
      <ToggleRow label="Navigation Memory"     desc="Remember scroll position and form state on back navigation" on={prefs.navigationMemory} onChange={() => onChange("navigationMemory", !prefs.navigationMemory)} testId="school-toggle-sp-nav-memory" />
      <ToggleRow label="Workflow Shortcuts"    desc="Enable keyboard shortcuts for common ERP actions"       on={prefs.workflowShortcuts} onChange={() => onChange("workflowShortcuts", !prefs.workflowShortcuts)} testId="school-toggle-sp-workflow-shortcuts" />
      <div className="sp-divider" />
      <div className="sp-field">
        <label className="sp-field__label">Modal / Drawer Preference</label>
        <span className="sp-field__hint">How forms and detail panels open by default</span>
        <RadioGroup
          value={prefs.modalPreference}
          options={MODAL_DRAWER_OPTIONS}
          onChange={v => onChange("modalPreference", v)}
          testId="school-radio-sp-modal-pref"
        />
      </div>
    </PrefCard>
  </div>
);

/** Device & Display Preferences */
const DeviceSection = ({ prefs, onChange }) => (
  <div className="sp-section-container">
    <div className="sp-section-header">
      <span className="sp-section-header__icon">🖥️</span>
      <div>
        <h2 className="sp-section-header__title">Device & Display Preferences</h2>
        <p className="sp-section-header__desc">Optimize the interface for your device type, screen size, and display preferences.</p>
      </div>
    </div>

    <PrefCard title="Device Optimization" icon="🖥️" testId="school-card-sp-device">
      <ToggleRow label="Touch Optimization"  desc="Increase tap target sizes for touch/tablet interaction"  on={prefs.touchOptimization} onChange={() => onChange("touchOptimization", !prefs.touchOptimization)} testId="school-toggle-sp-touch" />
      <ToggleRow label="Fullscreen Mode"     desc="Expand the ERP to use the full browser viewport"         on={prefs.fullscreenMode}    onChange={() => onChange("fullscreenMode",    !prefs.fullscreenMode)}    testId="school-toggle-sp-fullscreen" />
      <ToggleRow label="Responsive Scaling"  desc="Automatically adapt layout to screen breakpoints"        on={prefs.responsiveScaling} onChange={() => onChange("responsiveScaling", !prefs.responsiveScaling)} testId="school-toggle-sp-responsive-scaling" />
      <div className="sp-divider" />
      <div className="sp-field">
        <label className="sp-field__label">Display Density</label>
        <RadioGroup
          value={prefs.displayDensity}
          options={UI_DENSITY_OPTIONS}
          onChange={v => onChange("displayDensity", v)}
          testId="school-radio-sp-display-density"
        />
      </div>
    </PrefCard>
  </div>
);

// ── Section registry ──────────────────────────────────────────────────────────
const SECTION_REGISTRY = {
  overview:      OverviewSection,
  dashboard:     DashboardSection,
  layout:        LayoutSection,
  sidebar:       SidebarSection,
  theme:         ThemeSection,
  accessibility: AccessibilitySection,
  localization:  LocalizationSection,
  datetime:      DateTimeSection,
  session:       SessionSection,
  navigation:    NavigationSection,
  table:         TableSection,
  search:        SearchSection,
  refresh:       RefreshSection,
  files:         FilesSection,
  download:      DownloadSection,
  workflow:      WorkflowSection,
  device:        DeviceSection,
};

// ── Reset confirmation modal ──────────────────────────────────────────────────
const ResetModal = ({ onConfirm, onClose }) => {
  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="sp-modal-backdrop" onClick={onClose} data-testid="school-modal-sp-reset-backdrop">
      <div className="sp-modal" onClick={e => e.stopPropagation()} data-testid="school-modal-sp-reset">
        <div className="sp-modal__header">
          <span className="sp-modal__title">Reset to Defaults</span>
          <button className="sp-modal__close" onClick={onClose} data-testid="school-button-sp-reset-modal-close">✕</button>
        </div>
        <div className="sp-modal__body">
          <p>
            This will restore <strong>all system preferences</strong> to their factory defaults.
            Any custom configurations will be lost.
          </p>
          <p>This action cannot be undone for the current session.</p>
        </div>
        <div className="sp-modal__footer">
          <button className="sp-btn sp-btn--ghost sp-btn--sm" onClick={onClose} data-testid="school-button-sp-reset-cancel">Cancel</button>
          <button className="sp-btn sp-btn--danger sp-btn--sm" onClick={onConfirm} data-testid="school-button-sp-reset-confirm">Reset All Preferences</button>
        </div>
      </div>
    </div>
  );
};

// ── Preview strip of changed prefs ────────────────────────────────────────────
const PreviewStrip = ({ prefs }) => {
  const changed = useMemo(() => {
    const labelMap = {
      landingPage: "Landing", dashboardDensity: "Density", theme: "Theme",
      fontScale: "Font", language: "Language", timezone: "TZ", dateFormat: "Date Fmt",
      pageSize: "Page Size", exportFormat: "Export Fmt", sidebarWidth: "Sidebar W",
      navigationMode: "Nav", contentWidth: "Content W",
    };
    return Object.keys(labelMap)
      .filter(k => prefs[k] !== DEFAULT_PREFERENCES[k])
      .map(k => ({ key: k, label: labelMap[k], value: prefs[k] }))
      .slice(0, 8);
  }, [prefs]);

  if (!changed.length) return null;

  return (
    <div className="sp-preview-strip">
      <div className="sp-preview-strip__label">Modified Preferences Preview</div>
      <div className="sp-preview-strip__items">
        {changed.map(c => (
          <span key={c.key} className="sp-preview-chip" data-testid={`school-chip-sp-preview-${c.key}`}>
            {c.label}: <strong>{String(c.value)}</strong>
          </span>
        ))}
      </div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
/**
 * SystemPreferences — ERP operational behavior, interface customization,
 * and system-wide experience settings.
 * Layout: Policies/Alumni-style horizontal navigation tabs + full-width content.
 */
const SystemPreferences = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [saved,         setSaved]         = useState(false);
  const [showReset,     setShowReset]     = useState(false);
  const [prefs,         setPrefs]         = useState({ ...DEFAULT_PREFERENCES });
  const [widgets,       setWidgets]       = useState(DASHBOARD_WIDGETS);

  const handleChange = useCallback((key, value) => {
    setPrefs(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleWidgetToggle = useCallback(id => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, visible: !w.visible } : w));
  }, []);

  const handleWidgetPin = useCallback(id => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, pinned: !w.pinned } : w));
  }, []);

  const handleSave = useCallback(() => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }, []);

  const handleReset = useCallback(() => {
    setPrefs({ ...DEFAULT_PREFERENCES });
    setWidgets(DASHBOARD_WIDGETS);
    setShowReset(false);
    setSaved(false);
  }, []);

  const activeLabel = useMemo(() =>
    SP_NAV.find(n => n.id === activeSection)?.label ?? "",
  [activeSection]);

  const SectionComponent = SECTION_REGISTRY[activeSection] ?? OverviewSection;

  const sectionProps = {
    prefs,
    onChange:       handleChange,
    widgets,
    onWidgetToggle: handleWidgetToggle,
    onWidgetPin:    handleWidgetPin,
  };

  return (
    <div className="sp-root" data-testid="school-page-system-preferences">
      <ManagementPageHeader
        breadcrumbs={[
          { label: "Settings" },
          { label: activeLabel },
        ]}
        title="System Preferences"
        subtitle="Customize ERP behavior, interface, and system-wide experience settings"
        actions={(
          <>
            {saved && (
              <span className="sp-saved-toast" role="status" data-testid="school-toast-sp-saved">
                ✓ Preferences saved
              </span>
            )}
            <button className="sp-btn sp-btn--ghost sp-btn--sm" onClick={() => setShowReset(true)} data-testid="school-button-sp-reset">
              ↺ Reset
            </button>
            <button className="sp-btn sp-btn--primary sp-btn--sm" onClick={handleSave} data-testid="school-button-sp-save-top">
              Save Preferences
            </button>
          </>
        )}
      />

      {/* ── Horizontal Navigation Tabs ───────────────────────────── */}
      <div className="sp-cat-bar" role="tablist" aria-label="Preferences sections" data-testid="school-nav-sp-tabs">
        {SP_NAV.map(item => (
          <button
            key={item.id}
            role="tab"
            aria-selected={activeSection === item.id}
            className={`sp-cat-chip${activeSection === item.id ? " sp-cat-chip--active" : ""}`}
            onClick={() => setActiveSection(item.id)}
            type="button"
            data-testid={`school-nav-sp-${item.id}`}
          >
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      {/* ── Section Content ──────────────────────────────────────── */}
      <div className="sp-body" role="tabpanel">
        <SectionComponent {...sectionProps} />
        <PreviewStrip prefs={prefs} />
      </div>

      {/* ── Footer Save Bar ──────────────────────────────────────── */}
      <div className="sp-save-bar" data-testid="school-savebar-sp">
        <span className="sp-save-bar__info">
          💡 Changes are previewed instantly. Save to persist across sessions.
        </span>
        <div className="sp-save-bar__actions">
          <button className="sp-btn sp-btn--ghost sp-btn--sm" onClick={() => setShowReset(true)} data-testid="school-button-sp-reset-bar">
            Reset to Defaults
          </button>
          <button className="sp-btn sp-btn--primary sp-btn--sm" onClick={handleSave} data-testid="school-button-sp-save-bar">
            Save Preferences
          </button>
        </div>
      </div>

      {showReset && (
        <ResetModal
          onConfirm={handleReset}
          onClose={() => setShowReset(false)}
        />
      )}
    </div>
  );
};

export default SystemPreferences;
