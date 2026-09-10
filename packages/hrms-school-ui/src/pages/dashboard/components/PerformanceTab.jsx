import React from 'react';
import PropTypes from 'prop-types';
import { usePerformanceDashboardQuery } from '../../../services/performance.queries';

const DEFAULT_PARAMS = { schoolId: 1, branchId: 11, studentId: 111101 };

/**
 * PerformanceTab — displays consolidated student performance data.
 *
 * Render states:
 *  1. Loading   — initial fetch in progress (no cached data yet)
 *  2. Error     — fetch failed and no cached data is available
 *  3. Data      — shows Academic, Sports, Behavior, Cultural summary cards
 *
 * Background refetch UX:
 *  - When a refetch runs while data is already on screen, a subtle "Updating…"
 *    badge appears without blocking user interaction.
 *
 * @param {{ studentId?: number, schoolId?: number, branchId?: number }} props
 */
export function PerformanceTab({
  studentId = DEFAULT_PARAMS.studentId,
  schoolId = DEFAULT_PARAMS.schoolId,
  branchId = DEFAULT_PARAMS.branchId,
}) {
  const params = { studentId, schoolId, branchId };

  const {
    data,
    isLoading,
    isError,
    isFetching,
    error,
    refetch,
  } = usePerformanceDashboardQuery(params);

  // ── 1. Initial loading ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div data-testid="school-state-loading" style={styles.centered}>
        <p style={styles.loadingText}>Loading performance data…</p>
      </div>
    );
  }

  // ── 2. Hard error (no cached data to fall back on) ─────────────────────────
  if (isError && !data) {
    return (
      <div data-testid="school-state-error" style={styles.errorCard}>
        <p style={styles.errorTitle}>Failed to load performance data</p>
        <p style={styles.errorMessage}>{error?.message ?? 'An unexpected error occurred.'}</p>
        <button
          data-testid="school-button-retry"
          onClick={() => refetch()}
          disabled={isFetching}
          style={styles.retryButton}
        >
          {isFetching ? 'Retrying…' : 'Try Again'}
        </button>
      </div>
    );
  }

  // ── 3. Data display ────────────────────────────────────────────────────────
  return (
    <div data-testid="school-tab-performance" style={styles.container}>
      {/* Header row */}
      <div style={styles.header}>
        <h2 style={styles.title}>Performance Overview</h2>
        <div style={styles.headerActions}>
          {isFetching && (
            <span data-testid="school-badge-updating" style={styles.updatingBadge}>
              Updating…
            </span>
          )}
          <button
            data-testid="school-button-refresh"
            onClick={() => refetch()}
            disabled={isFetching}
            style={isFetching ? styles.refreshButtonDisabled : styles.refreshButton}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Category sections */}
      <div style={styles.grid}>
        <PerformanceSection
          testId="school-section-academic"
          label="Academic"
          data={data?.academic}
        />
        <PerformanceSection
          testId="school-section-sports"
          label="Sports"
          data={data?.sports}
        />
        <PerformanceSection
          testId="school-section-behavior"
          label="Behavior"
          data={data?.behavior}
        />
        <PerformanceSection
          testId="school-section-cultural"
          label="Cultural"
          data={data?.cultural}
        />
      </div>
    </div>
  );
}

PerformanceTab.propTypes = {
  studentId: PropTypes.number,
  schoolId: PropTypes.number,
  branchId: PropTypes.number,
};

// ── Internal presentational component ────────────────────────────────────────

/**
 * Renders a single performance category card.
 * @param {{ testId: string, label: string, data: Object | null }} props
 */
function PerformanceSection({ testId, label, data }) {
  return (
    <div data-testid={testId} style={styles.card}>
      <h3 style={styles.cardTitle}>{label}</h3>
      {data ? (
        <DataEntries data={data} />
      ) : (
        <p style={styles.noData}>No data available</p>
      )}
    </div>
  );
}

PerformanceSection.propTypes = {
  testId: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  data: PropTypes.object,
};

/**
 * Renders key-value pairs from a data object, skipping internal fields.
 * @param {{ data: Object }} props
 */
function DataEntries({ data }) {
  const entries = Object.entries(data).filter(
    ([key]) => !key.startsWith('_') && typeof data[key] !== 'object'
  );

  if (entries.length === 0) {
    return <p style={styles.noData}>No details available</p>;
  }

  return (
    <ul style={styles.entryList}>
      {entries.map(([key, value]) => (
        <li key={key} style={styles.entryItem}>
          <span style={styles.entryKey}>{formatKey(key)}</span>
          <span style={styles.entryValue}>{String(value ?? '—')}</span>
        </li>
      ))}
    </ul>
  );
}

/** Converts camelCase or snake_case keys to readable labels. */
function formatKey(key) {
  return key
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

DataEntries.propTypes = { data: PropTypes.object.isRequired };

// ── Inline styles ─────────────────────────────────────────────────────────────

const styles = {
  container: {
    padding: '24px',
    fontFamily: 'inherit',
  },
  centered: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 24px',
    gap: '12px',
  },
  spinner: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: '3px solid #e5e7eb',
    borderTopColor: '#6366f1',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: {
    color: '#6b7280',
    fontSize: '14px',
    margin: 0,
  },
  errorCard: {
    padding: '24px',
    border: '1px solid #fca5a5',
    borderRadius: '8px',
    backgroundColor: '#fff1f2',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxWidth: '480px',
    margin: '24px auto',
  },
  errorTitle: {
    fontWeight: 600,
    color: '#b91c1c',
    margin: 0,
    fontSize: '15px',
  },
  errorMessage: {
    color: '#6b7280',
    fontSize: '13px',
    margin: 0,
  },
  retryButton: {
    alignSelf: 'flex-start',
    marginTop: '8px',
    padding: '6px 16px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#ef4444',
    color: '#fff',
    fontSize: '13px',
    cursor: 'pointer',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 600,
    color: '#111827',
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  updatingBadge: {
    fontSize: '12px',
    color: '#6366f1',
    backgroundColor: '#eef2ff',
    padding: '2px 10px',
    borderRadius: '999px',
    fontWeight: 500,
  },
  refreshButton: {
    padding: '6px 14px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    backgroundColor: '#fff',
    color: '#374151',
    fontSize: '13px',
    cursor: 'pointer',
  },
  refreshButtonDisabled: {
    padding: '6px 14px',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
    color: '#9ca3af',
    fontSize: '13px',
    cursor: 'not-allowed',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '16px',
  },
  card: {
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    backgroundColor: '#fff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  cardTitle: {
    margin: '0 0 12px 0',
    fontSize: '14px',
    fontWeight: 600,
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  noData: {
    color: '#9ca3af',
    fontSize: '13px',
    margin: 0,
  },
  entryList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  entryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
  },
  entryKey: {
    color: '#6b7280',
  },
  entryValue: {
    fontWeight: 500,
    color: '#111827',
  },
};

export default PerformanceTab;
