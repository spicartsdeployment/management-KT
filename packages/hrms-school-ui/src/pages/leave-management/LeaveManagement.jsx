import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Calendar from './components/Calendar';
import LeaveForm from './components/LeaveForm';
import LeaveTrendGraph from './components/LeaveTrendGraph';
import LeaveHistory from './components/LeaveHistory';
import PageLoader from '../../components/PageLoader';
import { useLeaveStatisticsQuery } from '../../services/leave.queries';
import { getSessionParams } from '../../config/sessionParams';
import '../../assets/scss/LeaveManagement.scss';

function ErrorBanner({ message, onRetry }) {
  return (
    <div className="sch-lm-error-banner" role="alert" data-testid="school-banner-error">
      <div className="sch-lm-error-banner__content">
        <svg className="sch-lm-error-banner__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span className="sch-lm-error-banner__message">{message}</span>
      </div>
      <button className="sch-lm-error-banner__retry" onClick={onRetry} data-testid="school-button-retry">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 1 0 .49-3.13" />
        </svg>
        Retry
      </button>
    </div>
  );
}

ErrorBanner.propTypes = {
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func.isRequired,
};

function TopSection({ data, selectedRange, setSelectedRange, sessionParams }) {
  return (
    <div className="sch-lm-top-section-parent">
      <div className="sch-lm-top-section">
        <div className="sch-lm-calendar-column">
          <Calendar selectedRange={selectedRange} setSelectedRange={setSelectedRange}
            holidays={data.holidays} leaveHistory={data.history} />
        </div>
        <div className="sch-lm-form-column">
          <LeaveForm selectedRange={selectedRange} setSelectedRange={setSelectedRange}
            sessionParams={sessionParams} />
        </div>
      </div>
    </div>
  );
}

TopSection.propTypes = {
  data: PropTypes.object.isRequired,
  selectedRange: PropTypes.object.isRequired,
  setSelectedRange: PropTypes.func.isRequired,
  sessionParams: PropTypes.object.isRequired,
};

function BottomSection({ data }) {
  return (
    <div className="sch-lm-bottom-section">
      <div className="sch-lm-trend-column">
        <LeaveTrendGraph monthlyTrends={data.monthlyTrends} leaveHistory={data.history}
          trendStats={data.trendStats} />
      </div>
      <div className="sch-lm-history-column">
        <LeaveHistory leaveHistory={data.history} />
      </div>
    </div>
  );
}

BottomSection.propTypes = { data: PropTypes.object.isRequired };

function LeaveManagementContent({ data, selectedRange, setSelectedRange, sessionParams }) {
  return (
    <>
      <div className="sch-lm-page-header">
        <div><h1 className="sch-lm-page-title">Leave Management</h1></div>
      </div>
      <TopSection data={data} selectedRange={selectedRange} setSelectedRange={setSelectedRange} sessionParams={sessionParams} />
      <BottomSection data={data} />
    </>
  );
}

LeaveManagementContent.propTypes = {
  data: PropTypes.object.isRequired,
  selectedRange: PropTypes.object.isRequired,
  setSelectedRange: PropTypes.func.isRequired,
  sessionParams: PropTypes.object.isRequired,
};

const _emptyLeaveData = {
  stats: { approvedCount: 10, pendingCount: 2, totalThisYear: 12 },
  holidays: [
    { name: "Independence Day", date: "2026-08-15", daysRemaining: "102 days" },
    { name: "Teachers Day", date: "2026-09-05", daysRemaining: "123 days" },
    { name: "Diwali", date: "2026-11-01", daysRemaining: "180 days" },
    { name: "Christmas", date: "2026-12-25", daysRemaining: "234 days" },
  ],
  history: [
    { id: 1, type: "Sick Leave", status: "approved", from: "2026-04-20", to: "2026-04-22", days: 3, reason: "Medical appointment", appliedDate: "2026-04-18", approvedBy: "Mr. Sharma" },
    { id: 2, type: "Casual Leave", status: "approved", from: "2026-03-15", to: "2026-03-17", days: 3, reason: "Family event", appliedDate: "2026-03-10", approvedBy: "Mr. Sharma" },
    { id: 3, type: "Sick Leave", status: "pending", from: "2026-05-10", to: "2026-05-12", days: 3, reason: "Recovering from flu", appliedDate: "2026-05-05", approvedBy: null },
    { id: 4, type: "Casual Leave", status: "approved", from: "2026-02-20", to: "2026-02-22", days: 3, reason: "Personal work", appliedDate: "2026-02-15", approvedBy: "Ms. Patel" },
    { id: 5, type: "Half Day", status: "approved", from: "2026-01-30", to: "2026-01-30", days: 0.5, reason: "Doctor visit", appliedDate: "2026-01-28", approvedBy: "Mr. Sharma" },
  ],
  monthlyTrends: [
    { month: "Jan", leaves: 2 },
    { month: "Feb", leaves: 3 },
    { month: "Mar", leaves: 3 },
    { month: "Apr", leaves: 3 },
    { month: "May", leaves: 2 },
    { month: "Jun", leaves: 0 },
    { month: "Jul", leaves: 1 },
    { month: "Aug", leaves: 0 },
    { month: "Sep", leaves: 0 },
    { month: "Oct", leaves: 0 },
    { month: "Nov", leaves: 0 },
    { month: "Dec", leaves: 0 },
  ],
  trendStats: { mostCommonType: "Sick Leave", mostCommonCount: 2, thisMonthLeaves: 2, currentMonth: "May", totalLeaves: 17 },
};

function useLeaveData() {
  const { data: leaveData, isLoading: isPageLoading, isError, refetch } = useLeaveStatisticsQuery();
  return { isPageLoading, isSlowLoading: false, error: isError ? 'Failed to load leave data' : null, leaveData: leaveData ?? _emptyLeaveData, loadData: refetch };
}


/**
 * LeaveManagement page component
 * Fetches leave statistics on mount and passes data to child components.
 * @returns {JSX.Element} Leave management UI
 */
const LeaveManagement = () => {
  const [selectedRange, setSelectedRange] = useState({ start: null, end: null });
  const { isPageLoading, isSlowLoading, error, leaveData, loadData } = useLeaveData();

  const sessionParams = {
    ...getSessionParams(),
    submittedByName: 'Parent',
    submittedByRole: 'Parent',
  };

  const handleRetry = () => {
    loadData();
  };

  return (
    <div className="sch-lm-page" data-testid="school-container-leave-management">
      {isPageLoading && (
        <PageLoader
          title="Loading Leave Management"
          subtitle={isSlowLoading ? "Taking longer than usual... Please wait" : "Fetching your leave history..."}
          icon="🗒️"
        />
      )}
      {!isPageLoading && error && <ErrorBanner message={error} onRetry={handleRetry} />}
      {!isPageLoading && (
        <LeaveManagementContent data={leaveData} selectedRange={selectedRange}
          setSelectedRange={setSelectedRange} sessionParams={sessionParams} />
      )}
    </div>
  );
};

export default LeaveManagement;
