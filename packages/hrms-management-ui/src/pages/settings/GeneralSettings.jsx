import React, { useState, useCallback, useEffect, useMemo } from 'react';
import '../../Assets/styles/GeneralSettings.scss';
import ManagementPageHeader from '../../app/components/common/ManagementPageHeader';
import {
  INSTITUTION_DEFAULTS, CAMPUSES, INTEGRATIONS, BACKUP_HISTORY,
  AUDIT_LOGS, FINANCE_DEFAULTS, NOTIFICATION_PREFS, TEMPLATES,
  HEALTH_DATA, PAYMENT_GATEWAYS,
} from './settingsMockData';

// ─── Navigation ───────────────────────────────────────────────────────────────
const SETTINGS_NAV = [
  { id: 'institution',   label: 'Institution Info',      icon: '🏛️' },
  { id: 'campuses',      label: 'Campuses & Branches',   icon: '🏢' },
  { id: 'academic',      label: 'Academic Settings',     icon: '🎓' },
  { id: 'auth',          label: 'Authentication',        icon: '🔐' },
  { id: 'branding',      label: 'Branding & Appearance', icon: '🎨' },
  { id: 'communication', label: 'Communication',         icon: '📬' },
  { id: 'attendance',    label: 'Attendance Settings',   icon: '📅' },
  { id: 'finance',       label: 'Fee & Finance',         icon: '💰' },
  { id: 'examination',   label: 'Examination',           icon: '📝' },
  { id: 'timetable',     label: 'Timetable',             icon: '📆' },
  { id: 'transport',     label: 'Transport Settings',    icon: '🚌' },
  { id: 'hostel',        label: 'Hostel Settings',       icon: '🏠' },
  { id: 'library',       label: 'Library Settings',      icon: '📚' },
  { id: 'security',      label: 'Security & Privacy',    icon: '🛡️' },
  { id: 'backup',        label: 'Backup & Restore',      icon: '💾' },
  { id: 'api',           label: 'API & Integrations',    icon: '🔌' },
  { id: 'templates',     label: 'Templates & Docs',      icon: '📄' },
  { id: 'localization',  label: 'Language & Locale',     icon: '🌍' },
  { id: 'notifications', label: 'Notifications',         icon: '🔔' },
  { id: 'system',        label: 'System Preferences',    icon: '⚙️' },
  { id: 'maintenance',   label: 'Maintenance',           icon: '🖥️' },
  { id: 'audit',         label: 'Audit Logs',            icon: '📋' },
];

// ─── Shared Primitives ────────────────────────────────────────────────────────
/**
 * @param {{ on: boolean, onChange: function, testId?: string }} props
 */
function Toggle({ on, onChange, testId }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      className={`gs-toggle${on ? ' gs-toggle--on' : ''}`}
      onClick={() => onChange(!on)}
      data-testid={testId}
      type="button"
    >
      <span className="gs-toggle__thumb" />
    </button>
  );
}

/**
 * @param {{ label: string, desc?: string, on: boolean, onChange: function, testId?: string }} props
 */
function ToggleRow({ label, desc, on, onChange, testId }) {
  return (
    <div className="gs-toggle-row">
      <div className="gs-toggle-row__text">
        <span className="gs-toggle-row__label">{label}</span>
        {desc && <span className="gs-toggle-row__desc">{desc}</span>}
      </div>
      <Toggle on={on} onChange={onChange} testId={testId} />
    </div>
  );
}

/** @param {{ status: string }} props */
function GsBadge({ status }) {
  const key = (status || '').toLowerCase().replace(/\s+/g, '-');
  return <span className={`gs-badge gs-badge--${key}`}>{status}</span>;
}

/** @param {{ label: string, desc?: string, children: React.ReactNode }} props */
function Field({ label, desc, children }) {
  return (
    <div className="gs-field">
      <label className="gs-field__label">{label}</label>
      {desc && <span className="gs-field__hint">{desc}</span>}
      {children}
    </div>
  );
}

/**
 * @param {{ title: string, desc?: string, children: React.ReactNode, action?: React.ReactNode, testId?: string }} props
 */
function SettingCard({ title, desc, children, action, testId }) {
  return (
    <div className="gs-card" data-testid={testId}>
      <div className="gs-card__head">
        <div>
          <div className="gs-card__title">{title}</div>
          {desc && <div className="gs-card__desc">{desc}</div>}
        </div>
        {action && <div className="gs-card__action">{action}</div>}
      </div>
      <div className="gs-card__body">{children}</div>
    </div>
  );
}

/** @param {{ icon: string, title: string, desc?: string }} props */
function SectionHeader({ icon, title, desc }) {
  return (
    <div className="gs-section-header">
      <span className="gs-section-header__icon" aria-hidden="true">{icon}</span>
      <div>
        <h2 className="gs-section-header__title">{title}</h2>
        {desc && <p className="gs-section-header__desc">{desc}</p>}
      </div>
    </div>
  );
}

// ─── Modal Shell ──────────────────────────────────────────────────────────────
function Modal({ title, onClose, children, wide = false }) {
  const handleKey = useCallback((e) => { if (e.key === 'Escape') onClose(); }, [onClose]);
  return (
    <div
      className="gs-modal-backdrop"
      role="dialog"
      aria-modal="true"
      onKeyDown={handleKey}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`gs-modal${wide ? ' gs-modal--wide' : ''}`}>
        <div className="gs-modal__header">
          <span className="gs-modal__title">{title}</span>
          <button className="gs-modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="gs-modal__body">{children}</div>
      </div>
    </div>
  );
}

// ─── Modal Components ─────────────────────────────────────────────────────────
function AddCampusModal({ data, onClose }) {
  return (
    <Modal title={data ? 'Edit Campus' : 'Add Campus'} onClose={onClose} wide>
      <div className="gs-form gs-form-grid">
        <Field label="Campus Name">
          <input className="gs-field__input" defaultValue={data?.name || ''} placeholder="Campus name" data-testid="school-field-gs-campus-name" />
        </Field>
        <Field label="Campus Code">
          <input className="gs-field__input" defaultValue={data?.code || ''} placeholder="CIA-XXX" data-testid="school-field-gs-campus-code" />
        </Field>
        <Field label="City">
          <input className="gs-field__input" defaultValue={data?.city || ''} placeholder="City" data-testid="school-field-gs-campus-city" />
        </Field>
        <Field label="State">
          <input className="gs-field__input" defaultValue={data?.state || ''} placeholder="State" data-testid="school-field-gs-campus-state" />
        </Field>
        <Field label="Timezone">
          <select className="gs-field__select" defaultValue={data?.timezone || ''} data-testid="school-select-gs-campus-tz">
            <option>IST (UTC+5:30)</option><option>EST (UTC-5:00)</option><option>UTC</option>
          </select>
        </Field>
        <Field label="Working Hours">
          <input className="gs-field__input" defaultValue={data?.workingHours || ''} placeholder="8 AM – 5 PM" data-testid="school-field-gs-campus-hours" />
        </Field>
      </div>
      <div className="gs-form__actions">
        <button className="gs-btn gs-btn--ghost gs-btn--sm" onClick={onClose} data-testid="school-button-gs-campus-cancel">Cancel</button>
        <button className="gs-btn gs-btn--primary gs-btn--sm" data-testid="school-button-gs-campus-save">{data ? 'Update Campus' : 'Add Campus'}</button>
      </div>
    </Modal>
  );
}

function ConfigureIntegrationModal({ data, onClose }) {
  return (
    <Modal title={`Configure ${data?.name || 'Integration'}`} onClose={onClose} wide>
      <div className="gs-form">
        <Field label="API Key / Client ID">
          <input className="gs-field__input" type="password" placeholder="Enter API key" data-testid="school-field-gs-integration-key" />
        </Field>
        <Field label="API Secret / Client Secret">
          <input className="gs-field__input" type="password" placeholder="Enter secret" data-testid="school-field-gs-integration-secret" />
        </Field>
        <Field label="Webhook URL">
          <input className="gs-field__input" placeholder="https://..." data-testid="school-field-gs-integration-webhook" />
        </Field>
        <Field label="Environment">
          <select className="gs-field__select" data-testid="school-select-gs-integration-env">
            <option>Live</option><option>Sandbox</option>
          </select>
        </Field>
      </div>
      <div className="gs-form__actions">
        <button className="gs-btn gs-btn--ghost gs-btn--sm" onClick={onClose} data-testid="school-button-gs-integration-cancel">Cancel</button>
        <button className="gs-btn gs-btn--primary gs-btn--sm" data-testid="school-button-gs-integration-save">Save & Connect</button>
      </div>
    </Modal>
  );
}

function BackupConfirmModal({ onClose }) {
  return (
    <Modal title="Generate Backup" onClose={onClose}>
      <p className="gs-modal__info">A full system backup will be created and stored to the cloud. This may take a few minutes.</p>
      <div className="gs-form__actions">
        <button className="gs-btn gs-btn--ghost gs-btn--sm" onClick={onClose} data-testid="school-button-gs-backup-cancel">Cancel</button>
        <button className="gs-btn gs-btn--primary gs-btn--sm" onClick={onClose} data-testid="school-button-gs-backup-confirm">Start Backup</button>
      </div>
    </Modal>
  );
}

function RestoreConfirmModal({ data, onClose }) {
  return (
    <Modal title="Restore Backup" onClose={onClose}>
      <p className="gs-modal__info">
        Restoring backup <strong>{data?.id}</strong> ({data?.date}) will overwrite the current data.
        This action cannot be undone.
      </p>
      <div className="gs-form__actions">
        <button className="gs-btn gs-btn--ghost gs-btn--sm" onClick={onClose} data-testid="school-button-gs-restore-cancel">Cancel</button>
        <button className="gs-btn gs-btn--danger gs-btn--sm" onClick={onClose} data-testid="school-button-gs-restore-confirm">Restore</button>
      </div>
    </Modal>
  );
}

// ─── Section Components ───────────────────────────────────────────────────────
function InstitutionSection() {
  const [form, setForm] = useState({ ...INSTITUTION_DEFAULTS });
  const set = (f, v) => setForm((p) => ({ ...p, [f]: v }));
  const fields = [
    { label: 'Institution Name', field: 'name', testId: 'school-field-gs-inst-name' },
    { label: 'Institution Code', field: 'code', testId: 'school-field-gs-inst-code' },
    { label: 'Affiliation Board', field: 'board', testId: 'school-field-gs-inst-board' },
    { label: 'Registration No.', field: 'regNumber', testId: 'school-field-gs-inst-reg' },
    { label: 'Academic Year', field: 'academicYear', testId: 'school-field-gs-inst-year' },
    { label: 'Established Year', field: 'established', testId: 'school-field-gs-inst-est' },
    { label: 'Principal Name', field: 'principal', testId: 'school-field-gs-inst-principal' },
    { label: 'School Category', field: 'category', testId: 'school-field-gs-inst-category' },
  ];
  return (
    <>
      <SectionHeader icon="🏛️" title="Institution Information" desc="Core details and branding for your institution" />
      <SettingCard title="Basic Information" testId="school-card-gs-institution-info">
        <div className="gs-form-grid">
          {fields.map(({ label, field, testId }) => (
            <Field key={field} label={label}>
              <input className="gs-field__input" value={form[field]} onChange={(e) => set(field, e.target.value)} data-testid={testId} />
            </Field>
          ))}
          <Field label="Website URL" desc="Public website URL">
            <input className="gs-field__input gs-form-grid__full" type="url" value={form.website} onChange={(e) => set('website', e.target.value)} data-testid="school-field-gs-inst-website" />
          </Field>
        </div>
      </SettingCard>
      <SettingCard title="Brand Assets" desc="Upload school logo, favicon and digital seal" testId="school-card-gs-brand-assets">
        <div className="gs-upload-row">
          {['School Logo', 'Favicon', 'Digital Seal'].map((label) => (
            <div key={label} className="gs-upload-box" data-testid={`school-upload-gs-${label.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className="gs-upload-box__icon">📷</div>
              <span className="gs-upload-box__label">{label}</span>
              <button className="gs-btn gs-btn--ghost gs-btn--xs" type="button">Upload</button>
            </div>
          ))}
        </div>
      </SettingCard>
    </>
  );
}

function CampusesSection({ openModal }) {
  return (
    <>
      <SectionHeader icon="🏢" title="Campuses & Branches" desc="Manage multi-campus configuration and operational details" />
      <SettingCard
        title="Campus List"
        testId="school-card-gs-campus-list"
        action={
          <button className="gs-btn gs-btn--primary gs-btn--sm" onClick={() => openModal('add-campus', null)} data-testid="school-button-gs-add-campus" type="button">
            ＋ Add Campus
          </button>
        }
      >
        <div className="gs-campus-list">
          {CAMPUSES.map((c) => (
            <div key={c.id} className="gs-campus-row" data-testid={`school-row-gs-campus-${c.id}`}>
              <div className="gs-campus-row__info">
                <span className="gs-campus-row__name">{c.name}</span>
                <span className="gs-campus-row__meta">{c.code} · {c.city}, {c.state} · {c.timezone}</span>
              </div>
              <span className="gs-campus-row__hours">{c.workingHours}</span>
              <GsBadge status={c.status} />
              <button className="gs-btn gs-btn--ghost gs-btn--xs" onClick={() => openModal('add-campus', c)} data-testid={`school-button-gs-edit-campus-${c.id}`} type="button">Edit</button>
            </div>
          ))}
        </div>
      </SettingCard>
    </>
  );
}

function AcademicSection() {
  const [cfg, setCfg] = useState({ year: '2025-2026', terms: '3', grading: 'Percentage', workingDays: '6', gpa: false, autoPromo: false, strictAtt: true });
  const set = (f, v) => setCfg((p) => ({ ...p, [f]: v }));
  return (
    <>
      <SectionHeader icon="🎓" title="Academic Settings" desc="Academic year, terms, grading and promotion rules" />
      <SettingCard title="Year & Term Configuration" testId="school-card-gs-academic-year">
        <div className="gs-form-grid">
          <Field label="Academic Year"><input className="gs-field__input" value={cfg.year} onChange={(e) => set('year', e.target.value)} data-testid="school-field-gs-academic-year" /></Field>
          <Field label="Term Structure">
            <select className="gs-field__select" value={cfg.terms} onChange={(e) => set('terms', e.target.value)} data-testid="school-select-gs-terms">
              {['2', '3', '4'].map((v) => <option key={v} value={v}>{v} Terms</option>)}
            </select>
          </Field>
          <Field label="Grading Mode">
            <select className="gs-field__select" value={cfg.grading} onChange={(e) => set('grading', e.target.value)} data-testid="school-select-gs-grading">
              {['Percentage', 'GPA', 'Grade Points', 'Letter Grade'].map((v) => <option key={v}>{v}</option>)}
            </select>
          </Field>
          <Field label="Working Days / Week"><input className="gs-field__input" type="number" min="5" max="7" value={cfg.workingDays} onChange={(e) => set('workingDays', e.target.value)} data-testid="school-field-gs-working-days" /></Field>
        </div>
        <div className="gs-divider" />
        <ToggleRow label="Auto Class Promotion" desc="Automatically promote students at end of academic year" on={cfg.autoPromo} onChange={(v) => set('autoPromo', v)} testId="school-toggle-gs-auto-promo" />
        <ToggleRow label="GPA Display Mode" desc="Show GPA alongside percentage in reports" on={cfg.gpa} onChange={(v) => set('gpa', v)} testId="school-toggle-gs-gpa" />
        <ToggleRow label="Strict Attendance Enforcement" desc="Block exam registration if attendance threshold not met" on={cfg.strictAtt} onChange={(v) => set('strictAtt', v)} testId="school-toggle-gs-strict-att" />
      </SettingCard>
    </>
  );
}

function AuthSection() {
  const [cfg, setCfg] = useState({ otp: true, sso: true, twofa: true, sessionTimeout: 60, maxAttempts: 5, pwdExpiry: 90 });
  const set = (f, v) => setCfg((p) => ({ ...p, [f]: v }));
  return (
    <>
      <SectionHeader icon="🔐" title="Authentication & Login" desc="Login methods, session rules and security enforcement" />
      <SettingCard title="Login Methods" testId="school-card-gs-auth-methods">
        <ToggleRow label="OTP-based Login" desc="Allow login via one-time password sent to registered mobile/email" on={cfg.otp} onChange={(v) => set('otp', v)} testId="school-toggle-gs-otp" />
        <ToggleRow label="Google SSO" desc="Allow staff and admin to sign in with Google Workspace" on={cfg.sso} onChange={(v) => set('sso', v)} testId="school-toggle-gs-sso" />
        <ToggleRow label="Two-Factor Authentication" desc="Require 2FA for all administrator accounts" on={cfg.twofa} onChange={(v) => set('twofa', v)} testId="school-toggle-gs-2fa" />
      </SettingCard>
      <SettingCard title="Password & Session Policy" testId="school-card-gs-auth-policy">
        <div className="gs-form-grid">
          <Field label="Session Timeout (minutes)"><input className="gs-field__input" type="number" value={cfg.sessionTimeout} onChange={(e) => set('sessionTimeout', +e.target.value)} data-testid="school-field-gs-session-timeout" /></Field>
          <Field label="Max Login Attempts"><input className="gs-field__input" type="number" value={cfg.maxAttempts} onChange={(e) => set('maxAttempts', +e.target.value)} data-testid="school-field-gs-max-attempts" /></Field>
          <Field label="Password Expiry (days)"><input className="gs-field__input" type="number" value={cfg.pwdExpiry} onChange={(e) => set('pwdExpiry', +e.target.value)} data-testid="school-field-gs-pwd-expiry" /></Field>
        </div>
      </SettingCard>
    </>
  );
}

function BrandingSection() {
  const [cfg, setCfg] = useState({ darkMode: false, compactMode: false, rtl: false, primaryColor: '#C9A962', accentColor: '#2C2C2C' });
  const set = (f, v) => setCfg((p) => ({ ...p, [f]: v }));
  return (
    <>
      <SectionHeader icon="🎨" title="Branding & Appearance" desc="Theme, colors and display preferences" />
      <SettingCard title="Display Preferences" testId="school-card-gs-branding-display">
        <ToggleRow label="Dark Mode" desc="Enable dark theme by default for all users" on={cfg.darkMode} onChange={(v) => set('darkMode', v)} testId="school-toggle-gs-dark-mode" />
        <ToggleRow label="Compact Mode" desc="Reduce padding and component sizes for a denser layout" on={cfg.compactMode} onChange={(v) => set('compactMode', v)} testId="school-toggle-gs-compact-mode" />
        <ToggleRow label="Right-to-Left (RTL) Mode" desc="Enable RTL text direction for Arabic / Urdu" on={cfg.rtl} onChange={(v) => set('rtl', v)} testId="school-toggle-gs-rtl" />
      </SettingCard>
      <SettingCard title="Brand Colors" testId="school-card-gs-brand-colors">
        <div className="gs-form-grid">
          <Field label="Primary Color"><input className="gs-field__input gs-field__color" type="color" value={cfg.primaryColor} onChange={(e) => set('primaryColor', e.target.value)} data-testid="school-field-gs-primary-color" /></Field>
          <Field label="Accent Color"><input className="gs-field__input gs-field__color" type="color" value={cfg.accentColor} onChange={(e) => set('accentColor', e.target.value)} data-testid="school-field-gs-accent-color" /></Field>
        </div>
      </SettingCard>
      <SettingCard title="Brand Assets" testId="school-card-gs-branding-assets">
        <div className="gs-upload-row">
          {['Login Page Banner', 'Email Header Logo', 'Report Header'].map((label) => (
            <div key={label} className="gs-upload-box" data-testid={`school-upload-gs-brand-${label.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className="gs-upload-box__icon">🖼️</div>
              <span className="gs-upload-box__label">{label}</span>
              <button className="gs-btn gs-btn--ghost gs-btn--xs" type="button">Upload</button>
            </div>
          ))}
        </div>
      </SettingCard>
    </>
  );
}

function CommunicationSection() {
  const [cfg, setCfg] = useState({ sms: true, email: true, whatsapp: true, push: true, smtpHost: 'smtp.sendgrid.net', smtpPort: 587, senderId: 'CIA-SCHOOL' });
  const set = (f, v) => setCfg((p) => ({ ...p, [f]: v }));
  return (
    <>
      <SectionHeader icon="📬" title="Communication Settings" desc="Channel enablement and provider configuration" />
      <SettingCard title="Communication Channels" testId="school-card-gs-comm-channels">
        <ToggleRow label="SMS Notifications" desc="Send SMS via configured Twilio / SMS gateway" on={cfg.sms} onChange={(v) => set('sms', v)} testId="school-toggle-gs-sms" />
        <ToggleRow label="Email Notifications" desc="Send emails via SMTP / SendGrid" on={cfg.email} onChange={(v) => set('email', v)} testId="school-toggle-gs-email" />
        <ToggleRow label="WhatsApp Notifications" desc="Send messages via WhatsApp Business API" on={cfg.whatsapp} onChange={(v) => set('whatsapp', v)} testId="school-toggle-gs-whatsapp" />
        <ToggleRow label="Push Notifications" desc="Browser and mobile push notifications" on={cfg.push} onChange={(v) => set('push', v)} testId="school-toggle-gs-push" />
      </SettingCard>
      <SettingCard title="SMTP / Email Provider" testId="school-card-gs-smtp">
        <div className="gs-form-grid">
          <Field label="SMTP Host"><input className="gs-field__input" value={cfg.smtpHost} onChange={(e) => set('smtpHost', e.target.value)} data-testid="school-field-gs-smtp-host" /></Field>
          <Field label="SMTP Port"><input className="gs-field__input" type="number" value={cfg.smtpPort} onChange={(e) => set('smtpPort', +e.target.value)} data-testid="school-field-gs-smtp-port" /></Field>
          <Field label="Sender ID / Name"><input className="gs-field__input" value={cfg.senderId} onChange={(e) => set('senderId', e.target.value)} data-testid="school-field-gs-sender-id" /></Field>
        </div>
        <button className="gs-btn gs-btn--outline gs-btn--sm gs-btn--margin-top" type="button" data-testid="school-button-gs-test-email">Send Test Email</button>
      </SettingCard>
    </>
  );
}

function AttendanceSection() {
  const [cfg, setCfg] = useState({ biometric: true, geoFencing: false, autoAbsent: true, lateThreshold: 15, halfDayThreshold: 3 });
  const set = (f, v) => setCfg((p) => ({ ...p, [f]: v }));
  return (
    <>
      <SectionHeader icon="📅" title="Attendance Settings" desc="Attendance policies, biometric sync and geo-fencing rules" />
      <SettingCard title="Attendance Policies" testId="school-card-gs-att-policies">
        <ToggleRow label="Biometric Sync" desc="Sync attendance automatically from biometric devices" on={cfg.biometric} onChange={(v) => set('biometric', v)} testId="school-toggle-gs-biometric" />
        <ToggleRow label="Geo-Fencing" desc="Restrict check-ins to campus GPS coordinates" on={cfg.geoFencing} onChange={(v) => set('geoFencing', v)} testId="school-toggle-gs-geo-fencing" />
        <ToggleRow label="Auto-Mark Absent" desc="Automatically mark absent if no check-in by threshold time" on={cfg.autoAbsent} onChange={(v) => set('autoAbsent', v)} testId="school-toggle-gs-auto-absent" />
      </SettingCard>
      <SettingCard title="Thresholds" testId="school-card-gs-att-thresholds">
        <div className="gs-form-grid">
          <Field label="Late Mark Threshold (minutes)" desc="Grace period before marking late"><input className="gs-field__input" type="number" value={cfg.lateThreshold} onChange={(e) => set('lateThreshold', +e.target.value)} data-testid="school-field-gs-late-threshold" /></Field>
          <Field label="Half-Day Threshold (hours)" desc="Below this triggers a half-day mark"><input className="gs-field__input" type="number" value={cfg.halfDayThreshold} onChange={(e) => set('halfDayThreshold', +e.target.value)} data-testid="school-field-gs-half-day-threshold" /></Field>
        </div>
      </SettingCard>
    </>
  );
}

function FinanceSection() {
  const [fin, setFin] = useState({ ...FINANCE_DEFAULTS });
  const set = (f, v) => setFin((p) => ({ ...p, [f]: v }));
  return (
    <>
      <SectionHeader icon="💰" title="Fee & Finance Settings" desc="Currency, taxation, invoicing and payment gateway configuration" />
      <SettingCard title="Currency & Taxation" testId="school-card-gs-finance-currency">
        <div className="gs-form-grid">
          <Field label="Currency">
            <select className="gs-field__select" value={fin.currency} onChange={(e) => set('currency', e.target.value)} data-testid="school-select-gs-currency">
              {['INR', 'USD', 'GBP', 'EUR', 'AED'].map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Tax Label"><input className="gs-field__input" value={fin.taxLabel} onChange={(e) => set('taxLabel', e.target.value)} data-testid="school-field-gs-tax-label" /></Field>
          <Field label="Tax Rate (%)"><input className="gs-field__input" type="number" value={fin.taxRate} onChange={(e) => set('taxRate', +e.target.value)} data-testid="school-field-gs-tax-rate" /></Field>
          <Field label="Late Fee Rate (%)"><input className="gs-field__input" type="number" value={fin.lateFeeRate} onChange={(e) => set('lateFeeRate', +e.target.value)} data-testid="school-field-gs-late-fee" /></Field>
          <Field label="Invoice Prefix"><input className="gs-field__input" value={fin.invoicePrefix} onChange={(e) => set('invoicePrefix', e.target.value)} data-testid="school-field-gs-inv-prefix" /></Field>
          <Field label="Invoice Start No."><input className="gs-field__input" type="number" value={fin.invoiceStartNo} onChange={(e) => set('invoiceStartNo', +e.target.value)} data-testid="school-field-gs-inv-start" /></Field>
          <Field label="Reminder Interval (days)"><input className="gs-field__input" type="number" value={fin.reminderInterval} onChange={(e) => set('reminderInterval', +e.target.value)} data-testid="school-field-gs-reminder-interval" /></Field>
        </div>
      </SettingCard>
      <SettingCard title="Payment Gateways" testId="school-card-gs-payment-gateways">
        <div className="gs-gateway-list">
          {PAYMENT_GATEWAYS.map((g) => (
            <div key={g.id} className="gs-gateway-row" data-testid={`school-row-gs-gateway-${g.id}`}>
              <span className="gs-gateway-row__name">{g.name}</span>
              <span className="gs-gateway-row__mode">{g.mode}</span>
              <GsBadge status={g.status} />
              <button className="gs-btn gs-btn--ghost gs-btn--xs" type="button" data-testid={`school-button-gs-gateway-config-${g.id}`}>Configure</button>
            </div>
          ))}
        </div>
      </SettingCard>
    </>
  );
}

function ExaminationSection() {
  const [cfg, setCfg] = useState({ scale: '100', passMark: 35, rank: true, revaluation: false });
  const set = (f, v) => setCfg((p) => ({ ...p, [f]: v }));
  return (
    <>
      <SectionHeader icon="📝" title="Examination Settings" desc="Grading scales, rank rules and report card options" />
      <SettingCard title="Grading & Pass Policy" testId="school-card-gs-exam-grading">
        <div className="gs-form-grid">
          <Field label="Grading Scale">
            <select className="gs-field__select" value={cfg.scale} onChange={(e) => set('scale', e.target.value)} data-testid="school-select-gs-exam-scale">
              {['100', 'GPA 4.0', 'GPA 10.0', 'A-F'].map((v) => <option key={v}>{v}</option>)}
            </select>
          </Field>
          <Field label="Pass Mark (%)"><input className="gs-field__input" type="number" value={cfg.passMark} onChange={(e) => set('passMark', +e.target.value)} data-testid="school-field-gs-pass-mark" /></Field>
        </div>
        <div className="gs-divider" />
        <ToggleRow label="Rank Calculation" desc="Calculate and display class and school rank in report cards" on={cfg.rank} onChange={(v) => set('rank', v)} testId="school-toggle-gs-rank" />
        <ToggleRow label="Revaluation Requests" desc="Allow students to request paper revaluation" on={cfg.revaluation} onChange={(v) => set('revaluation', v)} testId="school-toggle-gs-revaluation" />
      </SettingCard>
    </>
  );
}

function TimetableSection() {
  const [cfg, setCfg] = useState({ periodMins: 45, breakMins: 15, lunchMins: 30, autoGen: false });
  const set = (f, v) => setCfg((p) => ({ ...p, [f]: v }));
  return (
    <>
      <SectionHeader icon="📆" title="Timetable Settings" desc="Period durations, break timings and auto-generation" />
      <SettingCard title="Period & Break Durations" testId="school-card-gs-timetable">
        <div className="gs-form-grid">
          <Field label="Period Duration (minutes)"><input className="gs-field__input" type="number" value={cfg.periodMins} onChange={(e) => set('periodMins', +e.target.value)} data-testid="school-field-gs-period-mins" /></Field>
          <Field label="Short Break (minutes)"><input className="gs-field__input" type="number" value={cfg.breakMins} onChange={(e) => set('breakMins', +e.target.value)} data-testid="school-field-gs-break-mins" /></Field>
          <Field label="Lunch Break (minutes)"><input className="gs-field__input" type="number" value={cfg.lunchMins} onChange={(e) => set('lunchMins', +e.target.value)} data-testid="school-field-gs-lunch-mins" /></Field>
        </div>
        <div className="gs-divider" />
        <ToggleRow label="Auto-Generate Timetable" desc="Automatically generate conflict-free timetables using AI" on={cfg.autoGen} onChange={(v) => set('autoGen', v)} testId="school-toggle-gs-auto-timetable" />
      </SettingCard>
    </>
  );
}

function TransportSection() {
  const [cfg, setCfg] = useState({ gpsSyncInterval: 30, pickupAlerts: true, dropAlerts: true, routeOptimize: false });
  const set = (f, v) => setCfg((p) => ({ ...p, [f]: v }));
  return (
    <>
      <SectionHeader icon="🚌" title="Transport Settings" desc="GPS tracking, alert preferences and route defaults" />
      <SettingCard title="Tracking & Alerts" testId="school-card-gs-transport">
        <Field label="GPS Sync Interval (seconds)"><input className="gs-field__input" type="number" value={cfg.gpsSyncInterval} onChange={(e) => set('gpsSyncInterval', +e.target.value)} data-testid="school-field-gs-gps-interval" /></Field>
        <div className="gs-divider" />
        <ToggleRow label="Pickup Alerts" desc="Notify parents when bus is nearing pickup point" on={cfg.pickupAlerts} onChange={(v) => set('pickupAlerts', v)} testId="school-toggle-gs-pickup-alerts" />
        <ToggleRow label="Drop Alerts" desc="Notify parents when student has been dropped off" on={cfg.dropAlerts} onChange={(v) => set('dropAlerts', v)} testId="school-toggle-gs-drop-alerts" />
        <ToggleRow label="Route Optimisation" desc="Auto-optimise bus routes to minimise travel time" on={cfg.routeOptimize} onChange={(v) => set('routeOptimize', v)} testId="school-toggle-gs-route-optimize" />
      </SettingCard>
    </>
  );
}

function HostelSection() {
  const [cfg, setCfg] = useState({ visitorLog: true, nightCurfew: true, autoAllocation: false });
  const set = (f, v) => setCfg((p) => ({ ...p, [f]: v }));
  return (
    <>
      <SectionHeader icon="🏠" title="Hostel Settings" desc="Occupancy rules, visitor policies and room allocation" />
      <SettingCard title="Hostel Policies" testId="school-card-gs-hostel">
        <ToggleRow label="Visitor Log" desc="Require logging of all visitors before entry" on={cfg.visitorLog} onChange={(v) => set('visitorLog', v)} testId="school-toggle-gs-visitor-log" />
        <ToggleRow label="Night Curfew Alerts" desc="Notify warden of occupants outside campus after curfew hours" on={cfg.nightCurfew} onChange={(v) => set('nightCurfew', v)} testId="school-toggle-gs-night-curfew" />
        <ToggleRow label="Auto Room Allocation" desc="Automatically assign rooms based on capacity and preferences" on={cfg.autoAllocation} onChange={(v) => set('autoAllocation', v)} testId="school-toggle-gs-auto-room" />
      </SettingCard>
    </>
  );
}

function LibrarySection() {
  const [cfg, setCfg] = useState({ maxIssue: 3, issueDays: 14, finePerDay: 2, autoRenew: false });
  const set = (f, v) => setCfg((p) => ({ ...p, [f]: v }));
  return (
    <>
      <SectionHeader icon="📚" title="Library Settings" desc="Book issue limits, fine rules and renewal policies" />
      <SettingCard title="Issue & Fine Rules" testId="school-card-gs-library">
        <div className="gs-form-grid">
          <Field label="Max Books per Student"><input className="gs-field__input" type="number" value={cfg.maxIssue} onChange={(e) => set('maxIssue', +e.target.value)} data-testid="school-field-gs-max-issue" /></Field>
          <Field label="Issue Duration (days)"><input className="gs-field__input" type="number" value={cfg.issueDays} onChange={(e) => set('issueDays', +e.target.value)} data-testid="school-field-gs-issue-days" /></Field>
          <Field label="Fine per Day (₹)"><input className="gs-field__input" type="number" value={cfg.finePerDay} onChange={(e) => set('finePerDay', +e.target.value)} data-testid="school-field-gs-fine-per-day" /></Field>
        </div>
        <div className="gs-divider" />
        <ToggleRow label="Auto-Renewal" desc="Automatically renew books if no holds are pending" on={cfg.autoRenew} onChange={(v) => set('autoRenew', v)} testId="school-toggle-gs-auto-renew" />
      </SettingCard>
    </>
  );
}

function SecuritySection() {
  const [cfg, setCfg] = useState({ auditLog: true, encryptExports: true, exportRestrict: false, deviceMonitor: true, retentionYears: 7 });
  const set = (f, v) => setCfg((p) => ({ ...p, [f]: v }));
  return (
    <>
      <SectionHeader icon="🛡️" title="Security & Privacy" desc="Audit logging, encryption, export controls and data retention" />
      <SettingCard title="Security Controls" testId="school-card-gs-security">
        <ToggleRow label="Audit Logging" desc="Log all admin actions to the audit trail" on={cfg.auditLog} onChange={(v) => set('auditLog', v)} testId="school-toggle-gs-audit-log" />
        <ToggleRow label="Encrypt Exported Files" desc="Apply password protection to all data exports" on={cfg.encryptExports} onChange={(v) => set('encryptExports', v)} testId="school-toggle-gs-encrypt-exports" />
        <ToggleRow label="Restrict Data Exports" desc="Only super-admins may export student/staff data" on={cfg.exportRestrict} onChange={(v) => set('exportRestrict', v)} testId="school-toggle-gs-export-restrict" />
        <ToggleRow label="Device Monitoring" desc="Track and alert on logins from new or unrecognised devices" on={cfg.deviceMonitor} onChange={(v) => set('deviceMonitor', v)} testId="school-toggle-gs-device-monitor" />
      </SettingCard>
      <SettingCard title="Data Retention" testId="school-card-gs-retention">
        <Field label="Data Retention Period (years)" desc="Records older than this period may be archived or purged">
          <input className="gs-field__input gs-field__input--narrow" type="number" value={cfg.retentionYears} onChange={(e) => set('retentionYears', +e.target.value)} data-testid="school-field-gs-retention-years" />
        </Field>
      </SettingCard>
    </>
  );
}

function BackupSection({ openModal }) {
  const [cfg, setCfg] = useState({ autoBackup: true, schedule: 'Daily', cloudSync: true });
  const set = (f, v) => setCfg((p) => ({ ...p, [f]: v }));
  return (
    <>
      <SectionHeader icon="💾" title="Backup & Restore" desc="Automated backup schedule and restore management" />
      <SettingCard
        title="Backup Settings"
        testId="school-card-gs-backup-settings"
        action={<button className="gs-btn gs-btn--primary gs-btn--sm" onClick={() => openModal('backup-confirm', null)} type="button" data-testid="school-button-gs-generate-backup">Generate Backup</button>}
      >
        <ToggleRow label="Auto Backup" desc="Schedule automatic backups to the cloud" on={cfg.autoBackup} onChange={(v) => set('autoBackup', v)} testId="school-toggle-gs-auto-backup" />
        <ToggleRow label="Cloud Sync" desc="Sync backups to connected cloud storage" on={cfg.cloudSync} onChange={(v) => set('cloudSync', v)} testId="school-toggle-gs-cloud-sync" />
        <div className="gs-divider" />
        <Field label="Backup Schedule">
          <select className="gs-field__select gs-field__select--medium" value={cfg.schedule} onChange={(e) => set('schedule', e.target.value)} data-testid="school-select-gs-backup-schedule">
            {['Hourly', 'Daily', 'Weekly', 'Monthly'].map((v) => <option key={v}>{v}</option>)}
          </select>
        </Field>
      </SettingCard>
      <SettingCard title="Backup History" testId="school-card-gs-backup-history">
        <table className="gs-backup-table" data-testid="school-table-gs-backup-history">
          <thead>
            <tr><th>ID</th><th>Type</th><th>Date</th><th>Size</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {BACKUP_HISTORY.map((b) => (
              <tr key={b.id} data-testid={`school-row-gs-backup-${b.id}`}>
                <td>{b.id}</td>
                <td>{b.type}</td>
                <td>{b.date}</td>
                <td>{b.size}</td>
                <td><GsBadge status={b.status} /></td>
                <td>
                  {b.status === 'Success' && (
                    <>
                      <button className="gs-btn gs-btn--ghost gs-btn--xs" onClick={() => openModal('restore-confirm', b)} type="button" data-testid={`school-button-gs-restore-${b.id}`}>Restore</button>
                      <button className="gs-btn gs-btn--ghost gs-btn--xs" type="button" data-testid={`school-button-gs-download-${b.id}`}>Download</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SettingCard>
    </>
  );
}

function ApiSection({ openModal }) {
  return (
    <>
      <SectionHeader icon="🔌" title="API & Integrations" desc="Connected third-party services and API key management" />
      <SettingCard title="Integration Status" testId="school-card-gs-integrations">
        <div className="gs-integration-grid">
          {INTEGRATIONS.map((intg) => (
            <div key={intg.id} className={`gs-integration-card gs-integration-card--${intg.status.toLowerCase().replace(/\s+/g, '-')}`} data-testid={`school-card-gs-integration-${intg.id}`}>
              <div className="gs-integration-card__icon" aria-hidden="true">{intg.icon}</div>
              <div className="gs-integration-card__body">
                <span className="gs-integration-card__name">{intg.name}</span>
                <span className="gs-integration-card__cat">{intg.category}</span>
                {intg.lastSync !== '—' && <span className="gs-integration-card__sync">Synced: {intg.lastSync}</span>}
              </div>
              <div className="gs-integration-card__footer">
                <GsBadge status={intg.status} />
                <button className="gs-btn gs-btn--ghost gs-btn--xs" onClick={() => openModal('configure-integration', intg)} type="button" data-testid={`school-button-gs-configure-${intg.id}`}>Configure</button>
              </div>
            </div>
          ))}
        </div>
      </SettingCard>
    </>
  );
}

function TemplatesSection() {
  return (
    <>
      <SectionHeader icon="📄" title="Templates & Documents" desc="Manage report card, receipt and certificate templates" />
      <SettingCard title="Document Templates" testId="school-card-gs-templates">
        <div className="gs-template-list">
          {TEMPLATES.map((t) => (
            <div key={t.id} className="gs-template-row" data-testid={`school-row-gs-template-${t.id}`}>
              <div className="gs-template-row__info">
                <span className="gs-template-row__name">{t.name}</span>
                <span className="gs-template-row__meta">{t.type} · Last updated: {t.last}</span>
              </div>
              <GsBadge status={t.status} />
              <div className="gs-template-row__actions">
                <button className="gs-btn gs-btn--ghost gs-btn--xs" type="button" data-testid={`school-button-gs-preview-${t.id}`}>Preview</button>
                <button className="gs-btn gs-btn--ghost gs-btn--xs" type="button" data-testid={`school-button-gs-edit-template-${t.id}`}>Edit</button>
              </div>
            </div>
          ))}
        </div>
      </SettingCard>
    </>
  );
}

function LocalizationSection() {
  const [cfg, setCfg] = useState({ timezone: 'IST (UTC+5:30)', language: 'English', dateFormat: 'DD/MM/YYYY', timeFormat: '12-hour', numberFormat: 'Indian (1,00,000)' });
  const set = (f, v) => setCfg((p) => ({ ...p, [f]: v }));
  const opts = {
    timezone: ['IST (UTC+5:30)', 'UTC', 'EST (UTC-5:00)', 'PST (UTC-8:00)', 'GST (UTC+4:00)'],
    language: ['English', 'Hindi', 'Malayalam', 'Tamil', 'Telugu', 'Urdu'],
    dateFormat: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'],
    timeFormat: ['12-hour', '24-hour'],
    numberFormat: ['Indian (1,00,000)', 'International (100,000)'],
  };
  return (
    <>
      <SectionHeader icon="🌍" title="Language & Localization" desc="Timezone, language and regional format preferences" />
      <SettingCard title="Regional Settings" testId="school-card-gs-localization">
        <div className="gs-form-grid">
          {Object.entries(opts).map(([field, options]) => (
            <Field key={field} label={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}>
              <select className="gs-field__select" value={cfg[field]} onChange={(e) => set(field, e.target.value)} data-testid={`school-select-gs-${field}`}>
                {options.map((o) => <option key={o}>{o}</option>)}
              </select>
            </Field>
          ))}
        </div>
      </SettingCard>
    </>
  );
}

function NotificationsSection() {
  const [prefs, setPrefs] = useState(NOTIFICATION_PREFS.map((n) => ({ ...n })));
  const toggle = (id, ch) => setPrefs((p) => p.map((n) => n.id === id ? { ...n, [ch]: !n[ch] } : n));
  const channels = ['sms', 'email', 'push', 'whatsapp'];
  return (
    <>
      <SectionHeader icon="🔔" title="Notification Preferences" desc="Institution-wide default notification channel settings" />
      <SettingCard title="Notification Channel Matrix" testId="school-card-gs-notif-matrix">
        <div className="gs-notif-matrix">
          <table>
            <thead>
              <tr>
                <th>Notification Type</th>
                {channels.map((ch) => <th key={ch}>{ch.charAt(0).toUpperCase() + ch.slice(1)}</th>)}
              </tr>
            </thead>
            <tbody>
              {prefs.map((n) => (
                <tr key={n.id} data-testid={`school-row-gs-notif-${n.id}`}>
                  <td>{n.label}</td>
                  {channels.map((ch) => (
                    <td key={ch}>
                      <Toggle on={n[ch]} onChange={() => toggle(n.id, ch)} testId={`school-toggle-gs-notif-${n.id}-${ch}`} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingCard>
    </>
  );
}

function SystemSection() {
  const [cfg, setCfg] = useState({ landing: 'Dashboard', sidebarCollapsed: false, compactCards: false, refreshInterval: 30, showQuickLinks: true });
  const set = (f, v) => setCfg((p) => ({ ...p, [f]: v }));
  return (
    <>
      <SectionHeader icon="⚙️" title="System Preferences" desc="Default layout, refresh and dashboard behaviour" />
      <SettingCard title="Layout & Navigation" testId="school-card-gs-system-layout">
        <Field label="Default Landing Page">
          <select className="gs-field__select gs-field__select--medium" value={cfg.landing} onChange={(e) => set('landing', e.target.value)} data-testid="school-select-gs-landing">
            {['Dashboard', 'Attendance', 'Fee Management', 'Timetable', 'Reports'].map((v) => <option key={v}>{v}</option>)}
          </select>
        </Field>
        <div className="gs-divider" />
        <ToggleRow label="Collapsed Sidebar by Default" desc="Load the sidebar in a collapsed state" on={cfg.sidebarCollapsed} onChange={(v) => set('sidebarCollapsed', v)} testId="school-toggle-gs-sidebar-collapsed" />
        <ToggleRow label="Compact Card View" desc="Show dashboard cards in compact mode" on={cfg.compactCards} onChange={(v) => set('compactCards', v)} testId="school-toggle-gs-compact-cards" />
        <ToggleRow label="Show Quick Links Bar" desc="Display frequently used links at the top of the dashboard" on={cfg.showQuickLinks} onChange={(v) => set('showQuickLinks', v)} testId="school-toggle-gs-quick-links" />
      </SettingCard>
      <SettingCard title="Dashboard Refresh" testId="school-card-gs-system-refresh">
        <Field label="Auto-Refresh Interval (seconds)" desc="Set to 0 to disable auto-refresh">
          <input className="gs-field__input gs-field__input--narrow" type="number" value={cfg.refreshInterval} onChange={(e) => set('refreshInterval', +e.target.value)} data-testid="school-field-gs-refresh-interval" />
        </Field>
      </SettingCard>
    </>
  );
}

function MaintenanceSection() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  return (
    <>
      <SectionHeader icon="🖥️" title="Maintenance & System Health" desc="Server status, maintenance mode and resource usage" />
      <SettingCard title="System Health" testId="school-card-gs-health">
        <div className="gs-health-grid">
          {HEALTH_DATA.map((h) => (
            <div key={h.label} className={`gs-health-card gs-health-card--${h.status}`} data-testid={`school-card-gs-health-${h.label.toLowerCase().replace(/\s+/g, '-')}`}>
              <span className="gs-health-card__icon" aria-hidden="true">{h.icon}</span>
              <div className="gs-health-card__body">
                <span className="gs-health-card__value">{h.value}<small>{h.unit}</small></span>
                <span className="gs-health-card__label">{h.label}</span>
              </div>
            </div>
          ))}
        </div>
      </SettingCard>
      <SettingCard title="Maintenance Mode" testId="school-card-gs-maintenance-mode">
        {maintenanceMode && (
          <div className="gs-alert gs-alert--warning">
            ⚠️ Maintenance mode is active. All non-admin users will see a maintenance notice.
          </div>
        )}
        <ToggleRow
          label="Enable Maintenance Mode"
          desc="Put the system in maintenance mode — only admins can access the application"
          on={maintenanceMode}
          onChange={setMaintenanceMode}
          testId="school-toggle-gs-maintenance-mode"
        />
      </SettingCard>
    </>
  );
}

function AuditSection() {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const severities = ['All', 'Info', 'Medium', 'High', 'Warning'];
  const filtered = useMemo(() => AUDIT_LOGS.filter((a) => {
    const matchSearch = !search || [a.admin, a.module, a.action].some((f) => f.toLowerCase().includes(search.toLowerCase()));
    const matchSeverity = severityFilter === 'All' || a.severity === severityFilter;
    return matchSearch && matchSeverity;
  }), [search, severityFilter]);
  return (
    <>
      <SectionHeader icon="📋" title="Audit Logs" desc="Review admin activity and system event history" />
      <SettingCard title="Activity Log" testId="school-card-gs-audit-log">
        <div className="gs-audit-filters">
          <input className="gs-field__input gs-audit-filters__search" placeholder="Search by admin, module or action…" value={search} onChange={(e) => setSearch(e.target.value)} data-testid="school-field-gs-audit-search" />
          <select className="gs-field__select" value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} data-testid="school-select-gs-audit-severity">
            {severities.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <table className="gs-audit-table" data-testid="school-table-gs-audit-log">
          <thead>
            <tr><th>ID</th><th>Admin</th><th>Module</th><th>Action</th><th>Severity</th><th>Time</th></tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} data-testid={`school-row-gs-audit-${a.id}`}>
                <td>{a.id}</td>
                <td>{a.admin}</td>
                <td>{a.module}</td>
                <td>{a.action}</td>
                <td><GsBadge status={a.severity} /></td>
                <td>{a.time}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="gs-audit-table__empty">No audit logs match the current filter.</td></tr>
            )}
          </tbody>
        </table>
      </SettingCard>
    </>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
// ─── Modal Registry ───────────────────────────────────────────────────────────
const MODAL_REGISTRY = {
  'add-campus':             (data, close) => <AddCampusModal data={data} onClose={close} />,
  'configure-integration':  (data, close) => <ConfigureIntegrationModal data={data} onClose={close} />,
  'backup-confirm':         (_d, close)   => <BackupConfirmModal onClose={close} />,
  'restore-confirm':        (data, close) => <RestoreConfirmModal data={data} onClose={close} />,
};

// ─── Section Registry ─────────────────────────────────────────────────────────
const SECTION_REGISTRY = {
  institution:   (p) => <InstitutionSection {...p} />,
  campuses:      (p) => <CampusesSection {...p} />,
  academic:      (p) => <AcademicSection {...p} />,
  auth:          (p) => <AuthSection {...p} />,
  branding:      (p) => <BrandingSection {...p} />,
  communication: (p) => <CommunicationSection {...p} />,
  attendance:    (p) => <AttendanceSection {...p} />,
  finance:       (p) => <FinanceSection {...p} />,
  examination:   (p) => <ExaminationSection {...p} />,
  timetable:     (p) => <TimetableSection {...p} />,
  transport:     (p) => <TransportSection {...p} />,
  hostel:        (p) => <HostelSection {...p} />,
  library:       (p) => <LibrarySection {...p} />,
  security:      (p) => <SecuritySection {...p} />,
  backup:        (p) => <BackupSection {...p} />,
  api:           (p) => <ApiSection {...p} />,
  templates:     (p) => <TemplatesSection {...p} />,
  localization:  (p) => <LocalizationSection {...p} />,
  notifications: (p) => <NotificationsSection {...p} />,
  system:        (p) => <SystemSection {...p} />,
  maintenance:   (p) => <MaintenanceSection {...p} />,
  audit:         (p) => <AuditSection {...p} />,
};

// ─── GeneralSettings ──────────────────────────────────────────────────────────
/**
 * General Settings module — institution-wide ERP configuration.
 * Layout: Policies/Alumni-style horizontal navigation tabs + full-width content.
 */
export default function GeneralSettings() {
  const [activeSection, setActiveSection] = useState('institution');
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [saved, setSaved] = useState(false);

  const openModal = useCallback((key, data = null) => {
    setModalData(data);
    setActiveModal(key);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setModalData(null);
  }, []);

  const handleSave = useCallback(() => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }, []);

  const activeLabel = useMemo(() => SETTINGS_NAV.find((n) => n.id === activeSection)?.label || '', [activeSection]);

  const sectionProps = { openModal };
  const renderSection = SECTION_REGISTRY[activeSection];

  return (
    <div className="gs-root" data-testid="school-page-general-settings">
      <ManagementPageHeader
        breadcrumbs={[
          { label: "Settings" },
          { label: activeLabel },
        ]}
        title="General Settings"
        subtitle="Institution-wide ERP configuration and system administration"
        actions={(
          <>
            {saved && <span className="gs-saved-toast" role="status" data-testid="school-toast-gs-saved">✓ Settings saved</span>}
            <button className="gs-btn gs-btn--ghost gs-btn--sm" type="button" data-testid="school-button-gs-reset">Reset</button>
            <button className="gs-btn gs-btn--primary gs-btn--sm" onClick={handleSave} type="button" data-testid="school-button-gs-save">Save Changes</button>
          </>
        )}
      />

      {/* ── Horizontal Navigation Tabs ───────────────────────────────────── */}
      <div className="gs-cat-bar" role="tablist" aria-label="Settings sections" data-testid="school-nav-gs-tabs">
        {SETTINGS_NAV.map((item) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={activeSection === item.id}
            className={`gs-cat-chip${activeSection === item.id ? ' gs-cat-chip--active' : ''}`}
            onClick={() => setActiveSection(item.id)}
            type="button"
            data-testid={`school-navitem-gs-${item.id}`}
          >
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      {/* ── Section Content ──────────────────────────────────────────────── */}
      <div className="gs-body" role="tabpanel">
        {renderSection ? renderSection(sectionProps) : <div className="gs-empty">Section not found.</div>}
      </div>

      {/* ── Footer Save Bar ──────────────────────────────────────────────── */}
      <div className="gs-save-bar" data-testid="school-savebar-gs">
        <span className="gs-save-bar__info">💡 Changes are not saved until you click Save Changes.</span>
        <div className="gs-save-bar__actions">
          <button className="gs-btn gs-btn--ghost gs-btn--sm" type="button" data-testid="school-button-gs-reset-bar">Reset</button>
          <button className="gs-btn gs-btn--primary gs-btn--sm" onClick={handleSave} type="button" data-testid="school-button-gs-save-bar">Save Changes</button>
        </div>
      </div>

      {activeModal && MODAL_REGISTRY[activeModal]?.(modalData, closeModal)}
    </div>
  );
}
