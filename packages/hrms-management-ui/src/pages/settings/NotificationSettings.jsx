import React, { useState, useCallback, useMemo } from 'react';
import '../../Assets/styles/NotificationSettings.scss';
import ManagementPageHeader from '../../app/components/common/ManagementPageHeader';
import {
  METRICS, CHANNELS_STATUS, NOTIFICATION_TEMPLATES, SCHEDULED_QUEUE,
  NOTIFICATION_HISTORY, DELIVERY_LOGS, AUTOMATION_RULES, REMINDER_CONFIG,
  EMERGENCY_ALERTS,
} from './notificationsMockData';

// ─── Navigation ───────────────────────────────────────────────────────────────
const NOTIFICATIONS_NAV = [
  { id: 'dashboard',   label: 'Notification Dashboard',   icon: '📊' },
  { id: 'templates',   label: 'Notification Templates',   icon: '📋' },
  { id: 'broadcast',   label: 'Broadcast Messaging',      icon: '📢' },
  { id: 'scheduled',   label: 'Scheduled Notifications',  icon: '🕐' },
  { id: 'history',     label: 'Notification History',     icon: '📜' },
  { id: 'delivery',    label: 'Delivery Logs',            icon: '📬' },
  { id: 'channels',    label: 'Communication Channels',   icon: '🔗' },
  { id: 'automation',  label: 'Automation Rules',         icon: '⚡' },
  { id: 'reminders',   label: 'Reminder Configuration',   icon: '⏰' },
  { id: 'emergency',   label: 'Emergency Alerts',         icon: '🚨' },
  { id: 'email',       label: 'Email Configuration',      icon: '✉️' },
  { id: 'sms',         label: 'SMS Configuration',        icon: '📱' },
  { id: 'whatsapp',    label: 'WhatsApp Configuration',   icon: '💬' },
  { id: 'push',        label: 'Push Notifications',       icon: '🔔' },
  { id: 'preferences', label: 'User Preferences',         icon: '👤' },
];

// ─── Shared Primitives ────────────────────────────────────────────────────────
/** @param {{ on: boolean, onChange: function, testId?: string }} props */
function Toggle({ on, onChange, testId }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      className={`ns-toggle${on ? ' ns-toggle--on' : ''}`}
      onClick={() => onChange(!on)}
      data-testid={testId}
      type="button"
    >
      <span className="ns-toggle__thumb" />
    </button>
  );
}

/** @param {{ label: string, desc?: string, on: boolean, onChange: function, testId?: string }} props */
function ToggleRow({ label, desc, on, onChange, testId }) {
  return (
    <div className="ns-toggle-row">
      <div className="ns-toggle-row__text">
        <span className="ns-toggle-row__label">{label}</span>
        {desc && <span className="ns-toggle-row__desc">{desc}</span>}
      </div>
      <Toggle on={on} onChange={onChange} testId={testId} />
    </div>
  );
}

/** @param {{ status: string }} props */
function NsBadge({ status }) {
  const key = (status || '').toLowerCase().replace(/\s+/g, '-');
  return <span className={`ns-badge ns-badge--${key}`}>{status}</span>;
}

/** @param {{ label: string, desc?: string, children: React.ReactNode }} props */
function Field({ label, desc, children }) {
  return (
    <div className="ns-field">
      <label className="ns-field__label">{label}</label>
      {desc && <span className="ns-field__hint">{desc}</span>}
      {children}
    </div>
  );
}

/** @param {{ title: string, desc?: string, children: React.ReactNode, action?: React.ReactNode, testId?: string }} props */
function SettingCard({ title, desc, children, action, testId }) {
  return (
    <div className="ns-card" data-testid={testId}>
      <div className="ns-card__head">
        <div>
          <div className="ns-card__title">{title}</div>
          {desc && <div className="ns-card__desc">{desc}</div>}
        </div>
        {action && <div className="ns-card__action">{action}</div>}
      </div>
      <div className="ns-card__body">{children}</div>
    </div>
  );
}

/** @param {{ icon: string, title: string, desc?: string }} props */
function SectionHeader({ icon, title, desc }) {
  return (
    <div className="ns-section-header">
      <span className="ns-section-header__icon" aria-hidden="true">{icon}</span>
      <div>
        <h2 className="ns-section-header__title">{title}</h2>
        {desc && <p className="ns-section-header__desc">{desc}</p>}
      </div>
    </div>
  );
}

// ─── Modal Shell ──────────────────────────────────────────────────────────────
function Modal({ title, onClose, children, wide = false }) {
  const handleKey = useCallback((e) => { if (e.key === 'Escape') onClose(); }, [onClose]);
  return (
    <div
      className="ns-modal-backdrop"
      role="dialog"
      aria-modal="true"
      onKeyDown={handleKey}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`ns-modal${wide ? ' ns-modal--wide' : ''}`}>
        <div className="ns-modal__header">
          <span className="ns-modal__title">{title}</span>
          <button className="ns-modal__close" onClick={onClose} aria-label="Close" type="button">✕</button>
        </div>
        <div className="ns-modal__body">{children}</div>
      </div>
    </div>
  );
}

// ─── Modal Components ─────────────────────────────────────────────────────────
function CreateTemplateModal({ data, onClose }) {
  const isEdit = Boolean(data);
  return (
    <Modal title={isEdit ? 'Edit Template' : 'Create Template'} onClose={onClose} wide>
      <div className="ns-form ns-form-grid">
        <Field label="Template Name">
          <input className="ns-field__input" defaultValue={data?.name || ''} placeholder="Template name" data-testid="school-field-ns-tmpl-name" />
        </Field>
        <Field label="Notification Type">
          <select className="ns-field__select" defaultValue={data?.type || ''} data-testid="school-select-ns-tmpl-type">
            {['Fee', 'Attendance', 'Exam', 'Transport', 'Leave', 'Emergency', 'Hostel', 'Academic', 'System'].map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Trigger">
          <select className="ns-field__select" defaultValue={data?.trigger || ''} data-testid="school-select-ns-tmpl-trigger">
            {['Manual', 'Auto', 'Scheduled', 'Manual / Auto'].map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Channels" desc="Select all applicable channels">
          <div className="ns-chip-select">
            {['SMS', 'Email', 'WhatsApp', 'Push', 'In-App'].map((ch) => (
              <label key={ch} className="ns-chip-select__item">
                <input type="checkbox" defaultChecked={data?.channel?.includes(ch)} />
                {ch}
              </label>
            ))}
          </div>
        </Field>
      </div>
      <Field label="Message Body" desc="Use {student_name}, {amount}, {date} for dynamic fields">
        <textarea className="ns-field__textarea" rows={4} placeholder="Enter notification message…" data-testid="school-field-ns-tmpl-body" />
      </Field>
      <div className="ns-form__actions">
        <button className="ns-btn ns-btn--ghost ns-btn--sm" onClick={onClose} data-testid="school-button-ns-tmpl-cancel">Cancel</button>
        <button className="ns-btn ns-btn--primary ns-btn--sm" data-testid="school-button-ns-tmpl-save">{isEdit ? 'Update Template' : 'Create Template'}</button>
      </div>
    </Modal>
  );
}

function PreviewTemplateModal({ data, onClose }) {
  return (
    <Modal title={`Preview: ${data?.name || ''}`} onClose={onClose}>
      <div className="ns-preview-box">
        <div className="ns-preview-box__header">
          <span>{data?.icon || '🔔'}</span>
          <strong>{data?.name}</strong>
        </div>
        <p className="ns-preview-box__body">
          Dear {'{student_name}'}, this is a sample notification from Cambridge International Academy.
          Please check your dashboard for more details. — CIA School ERP
        </p>
        <div className="ns-preview-box__footer">
          {data?.channel?.map((ch) => <span key={ch} className="ns-chip">{ch}</span>)}
        </div>
      </div>
      <div className="ns-form__actions">
        <button className="ns-btn ns-btn--primary ns-btn--sm" onClick={onClose} data-testid="school-button-ns-preview-close">Close</button>
      </div>
    </Modal>
  );
}

function SendBroadcastModal({ data, onClose }) {
  return (
    <Modal title="Confirm Broadcast" onClose={onClose}>
      <p className="ns-modal__info">
        You are about to send a broadcast to <strong>{data?.recipients || 'selected recipients'}</strong> via{' '}
        <strong>{Object.entries(data?.channels || {}).filter(([, v]) => v).map(([k]) => k.toUpperCase()).join(', ') || 'selected channels'}</strong>.
        This action cannot be undone.
      </p>
      <div className="ns-form__actions">
        <button className="ns-btn ns-btn--ghost ns-btn--sm" onClick={onClose} data-testid="school-button-ns-broadcast-cancel">Cancel</button>
        <button className="ns-btn ns-btn--primary ns-btn--sm" onClick={onClose} data-testid="school-button-ns-broadcast-confirm">Send Now</button>
      </div>
    </Modal>
  );
}

function CreateAutomationModal({ onClose }) {
  return (
    <Modal title="Create Automation Rule" onClose={onClose} wide>
      <div className="ns-form ns-form-grid">
        <Field label="Rule Name"><input className="ns-field__input" placeholder="Rule name" data-testid="school-field-ns-auto-name" /></Field>
        <Field label="Trigger Event">
          <select className="ns-field__select" data-testid="school-select-ns-auto-trigger">
            {['Fee overdue', 'Student absent', 'Exam upcoming', 'Leave approved', 'Emergency raised', 'Transport delay'].map((v) => <option key={v}>{v}</option>)}
          </select>
        </Field>
        <Field label="Trigger After (days)"><input className="ns-field__input" type="number" defaultValue={1} data-testid="school-field-ns-auto-days" /></Field>
        <Field label="Repeat Frequency">
          <select className="ns-field__select" data-testid="school-select-ns-auto-freq">
            {['Immediate', 'Daily', 'Weekly', 'Once', 'Every 5 mins'].map((v) => <option key={v}>{v}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Channels">
        <div className="ns-chip-select">
          {['SMS', 'Email', 'WhatsApp', 'Push'].map((ch) => (
            <label key={ch} className="ns-chip-select__item"><input type="checkbox" />{ch}</label>
          ))}
        </div>
      </Field>
      <div className="ns-form__actions">
        <button className="ns-btn ns-btn--ghost ns-btn--sm" onClick={onClose} data-testid="school-button-ns-auto-cancel">Cancel</button>
        <button className="ns-btn ns-btn--primary ns-btn--sm" data-testid="school-button-ns-auto-save">Create Rule</button>
      </div>
    </Modal>
  );
}

function SendEmergencyModal({ onClose }) {
  return (
    <Modal title="🚨 Send Emergency Alert" onClose={onClose} wide>
      <div className="ns-emergency-modal-notice">
        ⚠️ Emergency alerts are sent immediately to ALL recipients across ALL active channels.
      </div>
      <div className="ns-form">
        <Field label="Alert Title"><input className="ns-field__input" placeholder="e.g. School Closure — Heavy Rain" data-testid="school-field-ns-emr-title" /></Field>
        <Field label="Alert Type">
          <select className="ns-field__select" data-testid="school-select-ns-emr-type">
            {['Weather', 'Medical', 'Safety', 'Security', 'Infrastructure', 'Other'].map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Message Body">
          <textarea className="ns-field__textarea" rows={3} placeholder="Describe the emergency situation clearly…" data-testid="school-field-ns-emr-body" />
        </Field>
      </div>
      <div className="ns-form__actions">
        <button className="ns-btn ns-btn--ghost ns-btn--sm" onClick={onClose} data-testid="school-button-ns-emr-cancel">Cancel</button>
        <button className="ns-btn ns-btn--danger ns-btn--sm" onClick={onClose} data-testid="school-button-ns-emr-send">🚨 Send Emergency Alert</button>
      </div>
    </Modal>
  );
}

// ─── Section Components ───────────────────────────────────────────────────────
function DashboardSection() {
  return (
    <>
      <SectionHeader icon="📊" title="Notification Dashboard" desc="Real-time overview of notification delivery performance and channel health" />
      <div className="ns-metrics-grid">
        {METRICS.map((m) => (
          <div key={m.id} className={`ns-metric-card ns-metric-card--${m.color}`} data-testid={`school-card-ns-metric-${m.id}`}>
            <span className="ns-metric-card__icon" aria-hidden="true">{m.icon}</span>
            <div className="ns-metric-card__body">
              <span className="ns-metric-card__value">{m.value}</span>
              <span className="ns-metric-card__label">{m.label}</span>
            </div>
            <span className="ns-metric-card__trend">{m.trend}</span>
          </div>
        ))}
      </div>
      <SettingCard title="Channel Health" desc="Live delivery status across all communication channels" testId="school-card-ns-channel-health">
        <div className="ns-channel-health">
          {CHANNELS_STATUS.map((ch) => (
            <div key={ch.id} className="ns-channel-health-row" data-testid={`school-row-ns-channel-${ch.id}`}>
              <span className="ns-channel-health-row__icon" aria-hidden="true">{ch.icon}</span>
              <span className="ns-channel-health-row__name">{ch.name}</span>
              <span className="ns-channel-health-row__provider">{ch.provider}</span>
              <span className="ns-channel-health-row__sent">{ch.sentToday.toLocaleString()} sent today</span>
              <NsBadge status={ch.status} />
              <span className="ns-channel-health-row__fail">{ch.failRate} fail rate</span>
            </div>
          ))}
        </div>
      </SettingCard>
    </>
  );
}

function TemplatesSection({ openModal }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const types = ['All', 'Fee', 'Attendance', 'Exam', 'Transport', 'Leave', 'Emergency', 'Hostel', 'Academic', 'System'];
  const filtered = useMemo(() => NOTIFICATION_TEMPLATES.filter((t) =>
    (typeFilter === 'All' || t.type === typeFilter) &&
    (!search || t.name.toLowerCase().includes(search.toLowerCase()))
  ), [search, typeFilter]);
  return (
    <>
      <SectionHeader icon="📋" title="Notification Templates" desc="Manage reusable message templates across all channels" />
      <SettingCard
        title="Template Library"
        testId="school-card-ns-templates"
        action={<button className="ns-btn ns-btn--primary ns-btn--sm" onClick={() => openModal('create-template', null)} data-testid="school-button-ns-create-template" type="button">＋ New Template</button>}
      >
        <div className="ns-table-filters">
          <input className="ns-field__input ns-table-filters__search" placeholder="Search templates…" value={search} onChange={(e) => setSearch(e.target.value)} data-testid="school-field-ns-tmpl-search" />
          <select className="ns-field__select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} data-testid="school-select-ns-tmpl-type">
            {types.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="ns-table-wrap">
          <table className="ns-table" data-testid="school-table-ns-templates">
            <thead><tr><th>Name</th><th>Type</th><th>Channels</th><th>Trigger</th><th>Last Used</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} data-testid={`school-row-ns-tmpl-${t.id}`}>
                  <td className="ns-table__bold">{t.name}</td>
                  <td><NsBadge status={t.type} /></td>
                  <td className="ns-table__chips">{t.channel.map((ch) => <span key={ch} className="ns-chip">{ch}</span>)}</td>
                  <td>{t.trigger}</td>
                  <td>{t.lastUsed}</td>
                  <td><NsBadge status={t.status} /></td>
                  <td>
                    <button className="ns-btn ns-btn--ghost ns-btn--xs" onClick={() => openModal('preview-template', t)} data-testid={`school-button-ns-preview-tmpl-${t.id}`} type="button">Preview</button>
                    <button className="ns-btn ns-btn--ghost ns-btn--xs" onClick={() => openModal('create-template', t)} data-testid={`school-button-ns-edit-tmpl-${t.id}`} type="button">Edit</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} className="ns-table__empty">No templates match the current filter.</td></tr>}
            </tbody>
          </table>
        </div>
      </SettingCard>
    </>
  );
}

function BroadcastSection({ openModal }) {
  const [form, setForm] = useState({ template: '', recipients: 'All Parents', subject: '', body: '', channels: { sms: true, email: true, whatsapp: false, push: false } });
  const set = (f, v) => setForm((p) => ({ ...p, [f]: v }));
  const toggleCh = (ch) => setForm((p) => ({ ...p, channels: { ...p.channels, [ch]: !p.channels[ch] } }));
  const CHANNEL_OPTS = [['sms', 'SMS 📱'], ['email', 'Email ✉️'], ['whatsapp', 'WhatsApp 💬'], ['push', 'Push 🔔']];
  return (
    <>
      <SectionHeader icon="📢" title="Broadcast Messaging" desc="Compose and send bulk notifications to specific recipient groups" />
      <SettingCard title="Compose Broadcast" testId="school-card-ns-broadcast">
        <div className="ns-form-grid">
          <Field label="Notification Template" desc="Select a template or compose a custom message">
            <select className="ns-field__select" value={form.template} onChange={(e) => set('template', e.target.value)} data-testid="school-select-ns-broadcast-template">
              <option value="">— Custom Message —</option>
              {NOTIFICATION_TEMPLATES.filter((t) => t.status === 'Active').map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </Field>
          <Field label="Target Recipients">
            <select className="ns-field__select" value={form.recipients} onChange={(e) => set('recipients', e.target.value)} data-testid="school-select-ns-broadcast-recipients">
              {['All Parents', 'All Students', 'All Staff', 'Class Teachers', 'Transport Users', 'Hostel Students', 'All Users'].map((r) => <option key={r}>{r}</option>)}
            </select>
          </Field>
          <Field label="Subject / Title" desc="Required for Email and Push channels">
            <input className="ns-field__input" value={form.subject} onChange={(e) => set('subject', e.target.value)} placeholder="Enter notification title…" data-testid="school-field-ns-broadcast-subject" />
          </Field>
        </div>
        <Field label="Message Body" desc="Dynamic variables: {student_name}, {amount}, {date}, {class}">
          <textarea className="ns-field__textarea" rows={4} value={form.body} onChange={(e) => set('body', e.target.value)} placeholder="Type your message here…" data-testid="school-field-ns-broadcast-body" />
        </Field>
        {form.body && (
          <div className="ns-preview-box ns-preview-box--compact">
            <div className="ns-preview-box__header"><span>🔔</span><strong>Message Preview</strong></div>
            <p className="ns-preview-box__body">{form.body}</p>
          </div>
        )}
        <div className="ns-channel-toggles">
          <span className="ns-channel-toggles__label">Send via:</span>
          {CHANNEL_OPTS.map(([key, label]) => (
            <button key={key} className={`ns-channel-btn${form.channels[key] ? ' ns-channel-btn--on' : ''}`} onClick={() => toggleCh(key)} type="button" data-testid={`school-toggle-ns-broadcast-${key}`}>{label}</button>
          ))}
        </div>
        <div className="ns-broadcast-actions">
          <button className="ns-btn ns-btn--ghost ns-btn--sm" type="button" data-testid="school-button-ns-save-draft">Save Draft</button>
          <button className="ns-btn ns-btn--outline ns-btn--sm" type="button" data-testid="school-button-ns-schedule-broadcast">🕐 Schedule</button>
          <button className="ns-btn ns-btn--primary ns-btn--sm" onClick={() => openModal('send-broadcast', form)} type="button" data-testid="school-button-ns-send-broadcast">📢 Send Now</button>
        </div>
      </SettingCard>
    </>
  );
}

function ScheduledSection() {
  const [queue, setQueue] = useState(SCHEDULED_QUEUE.map((s) => ({ ...s })));
  const cancel = (id) => setQueue((q) => q.map((s) => s.id === id ? { ...s, status: 'Cancelled' } : s));
  return (
    <>
      <SectionHeader icon="🕐" title="Scheduled Notifications" desc="Manage the notification dispatch queue and pending deliveries" />
      <SettingCard title="Notification Queue" testId="school-card-ns-scheduled">
        <div className="ns-table-wrap">
          <table className="ns-table" data-testid="school-table-ns-scheduled">
            <thead><tr><th>ID</th><th>Name</th><th>Channel</th><th>Recipients</th><th>Scheduled At</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {queue.map((s) => (
                <tr key={s.id} data-testid={`school-row-ns-sched-${s.id}`}>
                  <td>{s.id}</td>
                  <td className="ns-table__bold">{s.name}</td>
                  <td><span className="ns-tag">{s.channel}</span></td>
                  <td>{s.recipients.toLocaleString()}</td>
                  <td>{s.scheduledAt}</td>
                  <td><NsBadge status={s.status} /></td>
                  <td>
                    {s.status === 'Pending' && (
                      <>
                        <button className="ns-btn ns-btn--ghost ns-btn--xs" type="button" data-testid={`school-button-ns-edit-sched-${s.id}`}>Edit</button>
                        <button className="ns-btn ns-btn--danger ns-btn--xs" onClick={() => cancel(s.id)} type="button" data-testid={`school-button-ns-cancel-sched-${s.id}`}>Cancel</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingCard>
    </>
  );
}

function HistorySection() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const types = ['All', 'Fee', 'Attendance', 'Transport', 'Reminder', 'Exam', 'Hostel', 'Emergency'];
  const filtered = useMemo(() => NOTIFICATION_HISTORY.filter((h) =>
    (typeFilter === 'All' || h.type === typeFilter) &&
    (!search || h.name.toLowerCase().includes(search.toLowerCase()))
  ), [search, typeFilter]);
  return (
    <>
      <SectionHeader icon="📜" title="Notification History" desc="Searchable record of all batch notifications sent" />
      <SettingCard title="Sent Notifications" testId="school-card-ns-history">
        <div className="ns-table-filters">
          <input className="ns-field__input ns-table-filters__search" placeholder="Search by name…" value={search} onChange={(e) => setSearch(e.target.value)} data-testid="school-field-ns-history-search" />
          <select className="ns-field__select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} data-testid="school-select-ns-history-type">
            {types.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="ns-table-wrap">
          <table className="ns-table" data-testid="school-table-ns-history">
            <thead><tr><th>ID</th><th>Name</th><th>Type</th><th>Channel</th><th>Recipients</th><th>Sent</th><th>Failed</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.map((h) => (
                <tr key={h.id} data-testid={`school-row-ns-history-${h.id}`}>
                  <td>{h.id}</td>
                  <td className="ns-table__bold">{h.name}</td>
                  <td><NsBadge status={h.type} /></td>
                  <td><span className="ns-tag">{h.channel}</span></td>
                  <td>{h.recipients.toLocaleString()}</td>
                  <td className="ns-table__success">{h.sent.toLocaleString()}</td>
                  <td className={h.failed > 0 ? 'ns-table__danger' : ''}>{h.failed}</td>
                  <td>{h.sentAt}</td>
                  <td><NsBadge status={h.status} /></td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={9} className="ns-table__empty">No history matches the filter.</td></tr>}
            </tbody>
          </table>
        </div>
      </SettingCard>
    </>
  );
}

function DeliverySection() {
  const [logs, setLogs] = useState(DELIVERY_LOGS.map((l) => ({ ...l })));
  const [statusFilter, setStatusFilter] = useState('All');
  const [channelFilter, setChannelFilter] = useState('All');
  const statuses = ['All', 'Delivered', 'Opened', 'Pending', 'Failed', 'Retrying'];
  const channels = ['All', 'SMS', 'Email', 'WhatsApp', 'Push'];
  const filtered = useMemo(() => logs.filter((l) =>
    (statusFilter === 'All' || l.status === statusFilter) &&
    (channelFilter === 'All' || l.channel === channelFilter)
  ), [logs, statusFilter, channelFilter]);
  const retry = (id) => setLogs((prev) => prev.map((l) => l.id === id ? { ...l, status: 'Retrying', retries: l.retries + 1 } : l));
  return (
    <>
      <SectionHeader icon="📬" title="Delivery Logs" desc="Individual notification delivery tracking with retry management" />
      <SettingCard title="Delivery Log" testId="school-card-ns-delivery-logs">
        <div className="ns-table-filters">
          <select className="ns-field__select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} data-testid="school-select-ns-delivery-status">
            {statuses.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select className="ns-field__select" value={channelFilter} onChange={(e) => setChannelFilter(e.target.value)} data-testid="school-select-ns-delivery-channel">
            {channels.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="ns-table-wrap">
          <table className="ns-table" data-testid="school-table-ns-delivery">
            <thead><tr><th>ID</th><th>Recipient</th><th>Type</th><th>Channel</th><th>Status</th><th>Sent At</th><th>Delivered At</th><th>Retries</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} data-testid={`school-row-ns-dlv-${l.id}`}>
                  <td>{l.id}</td>
                  <td className="ns-table__bold">{l.recipient}</td>
                  <td>{l.type}</td>
                  <td>{l.channel}</td>
                  <td><NsBadge status={l.status} /></td>
                  <td>{l.sentAt}</td>
                  <td>{l.deliveredAt}</td>
                  <td>{l.retries}{l.failReason && <span className="ns-fail-reason" title={l.failReason}>⚠</span>}</td>
                  <td>
                    {(l.status === 'Failed' || l.status === 'Retrying') && (
                      <button className="ns-btn ns-btn--outline ns-btn--xs" onClick={() => retry(l.id)} type="button" data-testid={`school-button-ns-retry-${l.id}`}>Retry</button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={9} className="ns-table__empty">No logs match the current filter.</td></tr>}
            </tbody>
          </table>
        </div>
      </SettingCard>
    </>
  );
}

function ChannelsSection() {
  return (
    <>
      <SectionHeader icon="🔗" title="Communication Channels" desc="Status and health of all active notification channels" />
      <div className="ns-channels-grid">
        {CHANNELS_STATUS.map((ch) => (
          <div key={ch.id} className={`ns-channel-card ns-channel-card--${ch.status.toLowerCase()}`} data-testid={`school-card-ns-channel-${ch.id}`}>
            <div className="ns-channel-card__icon" aria-hidden="true">{ch.icon}</div>
            <div className="ns-channel-card__body">
              <span className="ns-channel-card__name">{ch.name}</span>
              <span className="ns-channel-card__provider">{ch.provider}</span>
              <div className="ns-channel-card__stats">
                <span>{ch.sentToday.toLocaleString()} sent today</span>
                <span>{ch.failRate} fail rate</span>
              </div>
            </div>
            <div className="ns-channel-card__footer">
              <NsBadge status={ch.status} />
              <button className="ns-btn ns-btn--ghost ns-btn--xs" type="button" data-testid={`school-button-ns-test-channel-${ch.id}`}>Test</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function AutomationSection({ openModal }) {
  const [rules, setRules] = useState(AUTOMATION_RULES.map((r) => ({ ...r })));
  const toggleRule = (id) => setRules((prev) => prev.map((r) => r.id === id ? { ...r, status: r.status === 'Active' ? 'Paused' : 'Active' } : r));
  return (
    <>
      <SectionHeader icon="⚡" title="Automation Rules" desc="Configure event-triggered notification workflows" />
      <SettingCard
        title="Active Automation Rules"
        testId="school-card-ns-automation"
        action={<button className="ns-btn ns-btn--primary ns-btn--sm" onClick={() => openModal('create-automation', null)} type="button" data-testid="school-button-ns-create-automation">＋ New Rule</button>}
      >
        <div className="ns-automation-list">
          {rules.map((r) => (
            <div key={r.id} className={`ns-automation-row${r.status === 'Paused' ? ' ns-automation-row--paused' : ''}`} data-testid={`school-row-ns-auto-${r.id}`}>
              <div className="ns-automation-row__info">
                <span className="ns-automation-row__name">{r.name}</span>
                <span className="ns-automation-row__trigger">{r.trigger} · {r.frequency}</span>
                <div className="ns-automation-row__channels">
                  {r.channels.map((ch) => <span key={ch} className="ns-chip">{ch}</span>)}
                </div>
              </div>
              <NsBadge status={r.status} />
              <Toggle on={r.status === 'Active'} onChange={() => toggleRule(r.id)} testId={`school-toggle-ns-auto-${r.id}`} />
            </div>
          ))}
        </div>
      </SettingCard>
    </>
  );
}

function RemindersSection() {
  const [reminders, setReminders] = useState(REMINDER_CONFIG.map((r) => ({ ...r })));
  const setField = (id, f, v) => setReminders((prev) => prev.map((r) => r.id === id ? { ...r, [f]: v } : r));
  return (
    <>
      <SectionHeader icon="⏰" title="Reminder Configuration" desc="Configure automated reminder intervals, frequency and channels" />
      <SettingCard title="Reminder Rules" testId="school-card-ns-reminders">
        <div className="ns-reminder-list">
          {reminders.map((r) => (
            <div key={r.id} className="ns-reminder-row" data-testid={`school-row-ns-reminder-${r.id}`}>
              <div className="ns-reminder-row__header">
                <span className="ns-reminder-row__label">{r.label}</span>
                <Toggle on={r.active} onChange={(v) => setField(r.id, 'active', v)} testId={`school-toggle-ns-reminder-${r.id}`} />
              </div>
              <div className="ns-reminder-row__config">
                <Field label="Trigger After (days)">
                  <input className="ns-field__input ns-field__input--sm" type="number" value={r.triggerDays} min={0} onChange={(e) => setField(r.id, 'triggerDays', +e.target.value)} data-testid={`school-field-ns-reminder-days-${r.id}`} />
                </Field>
                <Field label="Max Reminders">
                  <input className="ns-field__input ns-field__input--sm" type="number" value={r.maxCount} min={1} onChange={(e) => setField(r.id, 'maxCount', +e.target.value)} data-testid={`school-field-ns-reminder-count-${r.id}`} />
                </Field>
                <Field label="Channels">
                  <div className="ns-chip-group">
                    {r.channels.map((ch) => <span key={ch} className="ns-chip">{ch}</span>)}
                  </div>
                </Field>
              </div>
            </div>
          ))}
        </div>
      </SettingCard>
    </>
  );
}

function EmergencySection({ openModal }) {
  return (
    <>
      <SectionHeader icon="🚨" title="Emergency Alerts" desc="Send instant emergency notifications to all stakeholders across all channels" />
      <div className="ns-emergency-banner" data-testid="school-card-ns-emergency-send">
        <div className="ns-emergency-banner__text">
          <h3>Emergency Broadcast</h3>
          <p>Instantly notify all parents, students and staff via SMS, Email, WhatsApp and Push simultaneously.</p>
        </div>
        <button className="ns-btn ns-btn--danger ns-btn--emergency" onClick={() => openModal('send-emergency', null)} type="button" data-testid="school-button-ns-send-emergency">
          🚨 Send Emergency Alert
        </button>
      </div>
      <SettingCard title="Emergency Alert History" testId="school-card-ns-emergency-history">
        <div className="ns-table-wrap">
          <table className="ns-table" data-testid="school-table-ns-emergency">
            <thead><tr><th>ID</th><th>Title</th><th>Type</th><th>Sent At</th><th>Recipients</th><th>Acknowledged</th><th>Status</th></tr></thead>
            <tbody>
              {EMERGENCY_ALERTS.map((a) => (
                <tr key={a.id} data-testid={`school-row-ns-emr-${a.id}`}>
                  <td>{a.id}</td>
                  <td className="ns-table__bold">{a.title}</td>
                  <td><NsBadge status={a.type} /></td>
                  <td>{a.sentAt}</td>
                  <td>{a.recipients.toLocaleString()}</td>
                  <td>{a.acknowledged.toLocaleString()} ({Math.round((a.acknowledged / a.recipients) * 100)}%)</td>
                  <td><NsBadge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingCard>
    </>
  );
}

function EmailConfigSection() {
  const [cfg, setCfg] = useState({ host: 'smtp.sendgrid.net', port: 587, secure: true, fromName: 'CIA School ERP', fromEmail: 'noreply@ciaschool.edu.in', replyTo: 'support@ciaschool.edu.in' });
  const set = (f, v) => setCfg((p) => ({ ...p, [f]: v }));
  return (
    <>
      <SectionHeader icon="✉️" title="Email Configuration" desc="SMTP provider settings, sender identity and delivery options" />
      <SettingCard title="SMTP Settings" testId="school-card-ns-email-smtp">
        <div className="ns-form-grid">
          <Field label="SMTP Host"><input className="ns-field__input" value={cfg.host} onChange={(e) => set('host', e.target.value)} data-testid="school-field-ns-email-host" /></Field>
          <Field label="SMTP Port"><input className="ns-field__input" type="number" value={cfg.port} onChange={(e) => set('port', +e.target.value)} data-testid="school-field-ns-email-port" /></Field>
          <Field label="Username / API Key"><input className="ns-field__input" type="password" placeholder="••••••••••••" data-testid="school-field-ns-email-key" /></Field>
          <Field label="Sender Name"><input className="ns-field__input" value={cfg.fromName} onChange={(e) => set('fromName', e.target.value)} data-testid="school-field-ns-email-from-name" /></Field>
          <Field label="Sender Email"><input className="ns-field__input" type="email" value={cfg.fromEmail} onChange={(e) => set('fromEmail', e.target.value)} data-testid="school-field-ns-email-from" /></Field>
          <Field label="Reply-To Email"><input className="ns-field__input" type="email" value={cfg.replyTo} onChange={(e) => set('replyTo', e.target.value)} data-testid="school-field-ns-email-reply" /></Field>
        </div>
        <div className="ns-divider" />
        <ToggleRow label="SSL/TLS Encryption" desc="Use secure connection for SMTP" on={cfg.secure} onChange={(v) => set('secure', v)} testId="school-toggle-ns-email-ssl" />
        <div className="ns-config-actions">
          <button className="ns-btn ns-btn--outline ns-btn--sm" type="button" data-testid="school-button-ns-test-email">Send Test Email</button>
          <button className="ns-btn ns-btn--primary ns-btn--sm" type="button" data-testid="school-button-ns-save-email">Save Configuration</button>
        </div>
      </SettingCard>
    </>
  );
}

function SMSConfigSection() {
  const [cfg, setCfg] = useState({ provider: 'Twilio', senderId: 'CIASCH', region: 'IN', deliveryReport: true });
  const set = (f, v) => setCfg((p) => ({ ...p, [f]: v }));
  return (
    <>
      <SectionHeader icon="📱" title="SMS Configuration" desc="SMS gateway provider settings and sender identity" />
      <SettingCard title="SMS Gateway Settings" testId="school-card-ns-sms">
        <div className="ns-form-grid">
          <Field label="SMS Provider">
            <select className="ns-field__select" value={cfg.provider} onChange={(e) => set('provider', e.target.value)} data-testid="school-select-ns-sms-provider">
              {['Twilio', 'MSG91', 'TextLocal', 'Exotel', 'AWS SNS'].map((p) => <option key={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="Sender ID / From"><input className="ns-field__input" value={cfg.senderId} onChange={(e) => set('senderId', e.target.value)} data-testid="school-field-ns-sms-sender" /></Field>
          <Field label="Account SID / API Key"><input className="ns-field__input" type="password" placeholder="••••••••••••" data-testid="school-field-ns-sms-key" /></Field>
          <Field label="Auth Token / Secret"><input className="ns-field__input" type="password" placeholder="••••••••••••" data-testid="school-field-ns-sms-secret" /></Field>
          <Field label="Region">
            <select className="ns-field__select" value={cfg.region} onChange={(e) => set('region', e.target.value)} data-testid="school-select-ns-sms-region">
              {['IN', 'US', 'UK', 'UAE', 'SG'].map((r) => <option key={r}>{r}</option>)}
            </select>
          </Field>
        </div>
        <div className="ns-divider" />
        <ToggleRow label="Delivery Reports" desc="Request delivery status callbacks from gateway" on={cfg.deliveryReport} onChange={(v) => set('deliveryReport', v)} testId="school-toggle-ns-sms-delivery" />
        <div className="ns-config-actions">
          <button className="ns-btn ns-btn--outline ns-btn--sm" type="button" data-testid="school-button-ns-test-sms">Send Test SMS</button>
          <button className="ns-btn ns-btn--primary ns-btn--sm" type="button" data-testid="school-button-ns-save-sms">Save Configuration</button>
        </div>
      </SettingCard>
    </>
  );
}

function WhatsAppConfigSection() {
  const [cfg, setCfg] = useState({ businessId: 'CIA-WA-001', phoneNumber: '+91-484-0000000', webhookUrl: 'https://api.ciaschool.edu.in/webhook/whatsapp', readReceipts: true });
  const set = (f, v) => setCfg((p) => ({ ...p, [f]: v }));
  return (
    <>
      <SectionHeader icon="💬" title="WhatsApp Configuration" desc="WhatsApp Business API credentials and webhook settings" />
      <SettingCard title="WhatsApp Business API" testId="school-card-ns-whatsapp">
        <div className="ns-form-grid">
          <Field label="Business Account ID"><input className="ns-field__input" value={cfg.businessId} onChange={(e) => set('businessId', e.target.value)} data-testid="school-field-ns-wa-business-id" /></Field>
          <Field label="Phone Number ID"><input className="ns-field__input" value={cfg.phoneNumber} onChange={(e) => set('phoneNumber', e.target.value)} data-testid="school-field-ns-wa-phone" /></Field>
          <Field label="Access Token"><input className="ns-field__input" type="password" placeholder="••••••••••••" data-testid="school-field-ns-wa-token" /></Field>
          <Field label="App Secret"><input className="ns-field__input" type="password" placeholder="••••••••••••" data-testid="school-field-ns-wa-secret" /></Field>
          <Field label="Webhook URL" desc="Receives delivery status callbacks">
            <input className="ns-field__input ns-form-grid__full" value={cfg.webhookUrl} onChange={(e) => set('webhookUrl', e.target.value)} data-testid="school-field-ns-wa-webhook" />
          </Field>
        </div>
        <div className="ns-divider" />
        <ToggleRow label="Read Receipts" desc="Track when recipients open WhatsApp messages" on={cfg.readReceipts} onChange={(v) => set('readReceipts', v)} testId="school-toggle-ns-wa-receipts" />
        <div className="ns-config-actions">
          <button className="ns-btn ns-btn--outline ns-btn--sm" type="button" data-testid="school-button-ns-test-whatsapp">Send Test Message</button>
          <button className="ns-btn ns-btn--primary ns-btn--sm" type="button" data-testid="school-button-ns-save-whatsapp">Save Configuration</button>
        </div>
      </SettingCard>
    </>
  );
}

function PushConfigSection() {
  const [cfg, setCfg] = useState({ platform: 'Firebase FCM', projectId: 'cia-school-erp', badgeCount: true, sound: true });
  const set = (f, v) => setCfg((p) => ({ ...p, [f]: v }));
  return (
    <>
      <SectionHeader icon="🔔" title="Push Notification Configuration" desc="Firebase FCM credentials and push delivery preferences" />
      <SettingCard title="Push Provider Settings" testId="school-card-ns-push">
        <div className="ns-form-grid">
          <Field label="Push Platform">
            <select className="ns-field__select" value={cfg.platform} onChange={(e) => set('platform', e.target.value)} data-testid="school-select-ns-push-platform">
              {['Firebase FCM', 'OneSignal', 'AWS SNS', 'Pusher Beams'].map((p) => <option key={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="Project ID"><input className="ns-field__input" value={cfg.projectId} onChange={(e) => set('projectId', e.target.value)} data-testid="school-field-ns-push-project" /></Field>
          <Field label="Server Key / API Key"><input className="ns-field__input" type="password" placeholder="••••••••••••" data-testid="school-field-ns-push-key" /></Field>
          <Field label="VAPID Public Key"><input className="ns-field__input" type="password" placeholder="••••••••••••" data-testid="school-field-ns-push-vapid-pub" /></Field>
          <Field label="VAPID Private Key"><input className="ns-field__input" type="password" placeholder="••••••••••••" data-testid="school-field-ns-push-vapid-priv" /></Field>
        </div>
        <div className="ns-divider" />
        <ToggleRow label="Badge Count" desc="Show unread count badge on app icon" on={cfg.badgeCount} onChange={(v) => set('badgeCount', v)} testId="school-toggle-ns-push-badge" />
        <ToggleRow label="Notification Sound" desc="Play sound on push notification delivery" on={cfg.sound} onChange={(v) => set('sound', v)} testId="school-toggle-ns-push-sound" />
        <div className="ns-config-actions">
          <button className="ns-btn ns-btn--outline ns-btn--sm" type="button" data-testid="school-button-ns-test-push">Send Test Push</button>
          <button className="ns-btn ns-btn--primary ns-btn--sm" type="button" data-testid="school-button-ns-save-push">Save Configuration</button>
        </div>
      </SettingCard>
    </>
  );
}

function PreferencesSection() {
  const [prefs, setPrefs] = useState({ email: true, sms: true, whatsapp: true, push: true, inapp: true, emergency: true, quietStart: '22:00', quietEnd: '06:00', quietEnabled: false });
  const set = (f, v) => setPrefs((p) => ({ ...p, [f]: v }));
  const channels = [
    { key: 'email',     label: 'Email Notifications',     desc: 'Receive notifications via email' },
    { key: 'sms',       label: 'SMS Alerts',               desc: 'Receive SMS for critical notifications' },
    { key: 'whatsapp',  label: 'WhatsApp Alerts',          desc: 'Receive messages on WhatsApp' },
    { key: 'push',      label: 'Push Notifications',       desc: 'Receive browser and mobile push' },
    { key: 'inapp',     label: 'In-App Notifications',     desc: 'Show notifications inside the dashboard' },
    { key: 'emergency', label: 'Emergency Alerts',         desc: 'Always receive emergency alerts (all channels)' },
  ];
  return (
    <>
      <SectionHeader icon="👤" title="User Notification Preferences" desc="Institution-wide default notification preferences for all users" />
      <SettingCard title="Default Channel Preferences" testId="school-card-ns-user-prefs">
        {channels.map(({ key, label, desc }) => (
          <ToggleRow key={key} label={label} desc={desc} on={prefs[key]} onChange={(v) => set(key, v)} testId={`school-toggle-ns-pref-${key}`} />
        ))}
      </SettingCard>
      <SettingCard title="Quiet Hours" desc="Suppress non-emergency notifications during these hours" testId="school-card-ns-quiet-hours">
        <ToggleRow label="Enable Quiet Hours" desc="Block notifications during the configured time window" on={prefs.quietEnabled} onChange={(v) => set('quietEnabled', v)} testId="school-toggle-ns-quiet-enabled" />
        {prefs.quietEnabled && (
          <div className="ns-form-grid ns-quiet-grid">
            <Field label="Quiet From"><input className="ns-field__input" type="time" value={prefs.quietStart} onChange={(e) => set('quietStart', e.target.value)} data-testid="school-field-ns-quiet-start" /></Field>
            <Field label="Quiet Until"><input className="ns-field__input" type="time" value={prefs.quietEnd} onChange={(e) => set('quietEnd', e.target.value)} data-testid="school-field-ns-quiet-end" /></Field>
          </div>
        )}
      </SettingCard>
    </>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function NotificationsSidebar({ active, onSelect, isOpen, onClose, search }) {
  const filtered = useMemo(
    () => NOTIFICATIONS_NAV.filter((n) => !search || n.label.toLowerCase().includes(search.toLowerCase())),
    [search],
  );
  return (
    <>
      {isOpen && <div className="ns-sidebar-backdrop" onClick={onClose} aria-hidden="true" />}
      <nav className={`ns-sidebar${isOpen ? ' ns-sidebar--open' : ''}`} aria-label="Notifications navigation" data-testid="school-nav-ns-sidebar">
        <div className="ns-sidebar__header">
          <span className="ns-sidebar__title">Notifications</span>
          <button className="ns-sidebar__close" onClick={onClose} aria-label="Close menu" type="button">✕</button>
        </div>
        <ul className="ns-sidebar__list" role="list">
          {filtered.map((item) => (
            <li key={item.id}>
              <button
                className={`ns-sidebar__item${active === item.id ? ' ns-sidebar__item--active' : ''}`}
                onClick={() => { onSelect(item.id); onClose(); }}
                type="button"
                data-testid={`school-navitem-ns-${item.id}`}
              >
                <span className="ns-sidebar__icon" aria-hidden="true">{item.icon}</span>
                <span className="ns-sidebar__label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

// ─── Modal Registry ───────────────────────────────────────────────────────────
const MODAL_REGISTRY = {
  'create-template':   (data, close) => <CreateTemplateModal data={data} onClose={close} />,
  'preview-template':  (data, close) => <PreviewTemplateModal data={data} onClose={close} />,
  'send-broadcast':    (data, close) => <SendBroadcastModal data={data} onClose={close} />,
  'create-automation': (_d, close)   => <CreateAutomationModal onClose={close} />,
  'send-emergency':    (_d, close)   => <SendEmergencyModal onClose={close} />,
};

// ─── Section Registry ─────────────────────────────────────────────────────────
const SECTION_REGISTRY = {
  dashboard:   (p) => <DashboardSection {...p} />,
  templates:   (p) => <TemplatesSection {...p} />,
  broadcast:   (p) => <BroadcastSection {...p} />,
  scheduled:   (p) => <ScheduledSection {...p} />,
  history:     (p) => <HistorySection {...p} />,
  delivery:    (p) => <DeliverySection {...p} />,
  channels:    (p) => <ChannelsSection {...p} />,
  automation:  (p) => <AutomationSection {...p} />,
  reminders:   (p) => <RemindersSection {...p} />,
  emergency:   (p) => <EmergencySection {...p} />,
  email:       (p) => <EmailConfigSection {...p} />,
  sms:         (p) => <SMSConfigSection {...p} />,
  whatsapp:    (p) => <WhatsAppConfigSection {...p} />,
  push:        (p) => <PushConfigSection {...p} />,
  preferences: (p) => <PreferencesSection {...p} />,
};

// ─── NotificationSettings ─────────────────────────────────────────────────────
/**
 * Notification Settings module — enterprise communication engine.
 * Layout: Policies/Alumni-style horizontal navigation tabs + full-width content.
 */
export default function NotificationSettings() {
  const [activeSection, setActiveSection] = useState('dashboard');
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

  const activeLabel = useMemo(() => NOTIFICATIONS_NAV.find((n) => n.id === activeSection)?.label || '', [activeSection]);
  const renderSection = SECTION_REGISTRY[activeSection];

  return (
    <div className="ns-root" data-testid="school-page-notification-settings">
      <ManagementPageHeader
        breadcrumbs={[
          { label: "Settings" },
          { label: activeLabel },
        ]}
        title="Notification Settings"
        subtitle="Manage notification delivery, automation, and channel configuration"
        actions={(
          <>
            {saved && <span className="ns-saved-toast" role="status" data-testid="school-toast-ns-saved">✓ Saved</span>}
            <button className="ns-btn ns-btn--ghost ns-btn--sm" type="button" data-testid="school-button-ns-reset">Reset</button>
            <button className="ns-btn ns-btn--primary ns-btn--sm" onClick={handleSave} type="button" data-testid="school-button-ns-save">Save Changes</button>
          </>
        )}
      />

      {/* ── Horizontal Navigation Tabs ───────────────────────────────────── */}
      <div className="ns-cat-bar" role="tablist" aria-label="Notification sections" data-testid="school-nav-ns-tabs">
        {NOTIFICATIONS_NAV.map((item) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={activeSection === item.id}
            className={`ns-cat-chip${activeSection === item.id ? ' ns-cat-chip--active' : ''}`}
            onClick={() => setActiveSection(item.id)}
            type="button"
            data-testid={`school-navitem-ns-${item.id}`}
          >
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      {/* ── Section Content ──────────────────────────────────────────────── */}
      <div className="ns-body" role="tabpanel">
        {renderSection ? renderSection({ openModal }) : <div className="ns-empty">Section not found.</div>}
      </div>

      {/* ── Footer Save Bar ──────────────────────────────────────────────── */}
      <div className="ns-save-bar" data-testid="school-savebar-ns">
        <span className="ns-save-bar__info">💡 Changes are not saved until you click Save Changes.</span>
        <div className="ns-save-bar__actions">
          <button className="ns-btn ns-btn--ghost ns-btn--sm" type="button" data-testid="school-button-ns-reset-bar">Reset</button>
          <button className="ns-btn ns-btn--primary ns-btn--sm" onClick={handleSave} type="button" data-testid="school-button-ns-save-bar">Save Changes</button>
        </div>
      </div>

      {activeModal && MODAL_REGISTRY[activeModal]?.(modalData, closeModal)}
    </div>
  );
}
