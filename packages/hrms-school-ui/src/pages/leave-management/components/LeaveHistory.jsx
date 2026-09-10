import React, { useState } from "react";
import PropTypes from "prop-types";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const STATUS_CONFIG = {
  approved: { class: "sch-lm-status-approved", label: "approved" },
  pending: { class: "sch-lm-status-pending", label: "pending" },
  rejected: { class: "sch-lm-status-rejected", label: "rejected" },
};

function getStatusBadge(status) {
  return STATUS_CONFIG[status] || STATUS_CONFIG.pending;
}

function buildLeaveItemHtml(leave, index) {
  return `
    <div class="leave-item">
      <div class="leave-header">
        <div class="leave-type">${index + 1}. ${leave.type}</div>
        <span class="status status-${leave.status}">${leave.status}</span>
      </div>
      <div class="leave-dates"><strong>Period:</strong> ${formatDate(leave.from)} → ${formatDate(leave.to)} (${leave.days} ${leave.days === 1 ? "day" : "days"})</div>
      <div class="leave-reason"><strong>Reason:</strong> ${leave.reason}</div>
      <div class="leave-footer">
        <span>Applied: ${formatDate(leave.appliedDate)}</span>
        <span>${leave.approvedBy ? `Approved By: ${leave.approvedBy}` : "Pending Approval"}</span>
      </div>
    </div>`;
}

function buildSummaryHtml(leaves) {
  return `
    <div class="summary">
      <h2>Summary</h2>
      <div class="summary-grid">
        <div class="summary-item"><div class="summary-value">${leaves.length}</div><div class="summary-label">Total Leaves</div></div>
        <div class="summary-item"><div class="summary-value">${leaves.filter((l) => l.status === "approved").length}</div><div class="summary-label">Approved</div></div>
        <div class="summary-item"><div class="summary-value">${leaves.filter((l) => l.status === "pending").length}</div><div class="summary-label">Pending</div></div>
        <div class="summary-item"><div class="summary-value">${leaves.filter((l) => l.status === "rejected").length}</div><div class="summary-label">Rejected</div></div>
      </div>
    </div>`;
}

const PDF_STYLES = `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
.header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #3b82f6; padding-bottom: 15px; }
.header h1 { margin: 0; color: #1a1a1a; font-size: 28px; } .header p { margin: 5px 0; color: #666; font-size: 14px; }
.leave-item { margin-bottom: 25px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; background: #f9fafb; page-break-inside: avoid; }
.leave-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.leave-type { font-size: 18px; font-weight: bold; color: #1a1a1a; }
.status { padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
.status-approved { background: #d1fae5; color: #065f46; } .status-pending { background: #fef3c7; color: #92400e; } .status-rejected { background: #fee2e2; color: #991b1b; }
.leave-dates { font-size: 14px; color: #4b5563; margin-bottom: 8px; } .leave-dates strong { color: #1a1a1a; }
.leave-reason { font-size: 14px; color: #6b7280; margin-bottom: 10px; font-style: italic; }
.leave-footer { font-size: 13px; color: #9ca3af; display: flex; justify-content: space-between; border-top: 1px solid #e5e7eb; padding-top: 10px; margin-top: 10px; }
.summary { margin-top: 30px; padding: 20px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #3b82f6; }
.summary h2 { margin: 0 0 15px 0; color: #1a1a1a; font-size: 20px; }
.summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }
.summary-item { text-align: center; } .summary-value { font-size: 24px; font-weight: bold; color: #3b82f6; }
.summary-label { font-size: 12px; color: #666; text-transform: uppercase; margin-top: 5px; }`;

function buildHtmlReport(leaves) {
  const generated = new Date().toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Leave History Report</title><style>${PDF_STYLES}</style></head>
<body>
<div class="header"><h1>Leave History Report</h1><p>Generated on: ${generated}</p></div>
${leaves.map((leave, i) => buildLeaveItemHtml(leave, i)).join("")}
${buildSummaryHtml(leaves)}
<script>window.onload = function() { setTimeout(function() { window.print(); setTimeout(function() { window.close(); }, 100); }, 500); };</script>
</body></html>`;
}

function HistoryItem({ leave }) {
  const statusInfo = getStatusBadge(leave.status);
  return (
    <div className={`sch-lm-history-item ${leave.status}`} data-testid={`school-item-history-${leave.id}`}>
      <div className="sch-lm-history-item-header">
        <div className="sch-lm-history-type">{leave.type}</div>
        <span className={`sch-lm-status-badge ${statusInfo.class}`}>{statusInfo.label}</span>
      </div>
      <div className="sch-lm-history-dates">
        <span className="sch-lm-date-range">
          {formatDate(leave.from)} → {formatDate(leave.to)}
          <span className="sch-lm-days-count">({leave.days} {leave.days === 1 ? "day" : "days"})</span>
        </span>
      </div>
      <div className="sch-lm-history-reason">{leave.reason}</div>
      <div className="sch-lm-history-footer">
        <div className="sch-lm-history-days-taken">{leave.days} {leave.days === 1 ? "day" : "days"}</div>
        {leave.approvedBy && <div className="sch-lm-history-approved-by">{leave.approvedBy}</div>}
      </div>
    </div>
  );
}

HistoryItem.propTypes = {
  leave: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.string, status: PropTypes.string, from: PropTypes.string,
    to: PropTypes.string, days: PropTypes.number, reason: PropTypes.string, approvedBy: PropTypes.string,
  }).isRequired,
};

function PaginationControls({ currentPage, totalPages, startIndex, endIndex, total, onPrev, onNext }) {
  return (
    <div className="sch-lm-pagination-controls" data-testid="school-pagination-history">
      <button className="sch-lm-pagination-button" onClick={onPrev} disabled={currentPage === 1} data-testid="school-button-prev-page">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Previous
      </button>
      <div className="sch-lm-pagination-info">
        <span className="sch-lm-page-number">Page {currentPage} of {totalPages}</span>
        <span className="sch-lm-items-info">Showing {startIndex + 1}-{Math.min(endIndex, total)} of {total}</span>
      </div>
      <button className="sch-lm-pagination-button" onClick={onNext} disabled={currentPage === totalPages} data-testid="school-button-next-page">
        Next
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

PaginationControls.propTypes = {
  currentPage: PropTypes.number.isRequired, totalPages: PropTypes.number.isRequired,
  startIndex: PropTypes.number.isRequired, endIndex: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired, onPrev: PropTypes.func.isRequired, onNext: PropTypes.func.isRequired,
};

function useLeaveHistory(itemsPerPage, leaveHistory) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(leaveHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLeaves = leaveHistory.slice(startIndex, endIndex);
  const handleExportToPDF = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(buildHtmlReport(leaveHistory));
    printWindow.document.close();
  };
  return { currentPage, setCurrentPage, totalPages, startIndex, endIndex, currentLeaves, handleExportToPDF };
}

export default function LeaveHistory({ leaveHistory = [] }) {
  const { currentPage, setCurrentPage, totalPages, startIndex, endIndex, currentLeaves, handleExportToPDF } = useLeaveHistory(3, leaveHistory);
  return (
    <div className="sch-lm-history-container" data-testid="school-container-leave-history">
      <div className="sch-lm-history-header">
        <h3>Leave History</h3>
        <button className="sch-lm-export-button" onClick={handleExportToPDF} data-testid="school-button-export" title="Export to PDF">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>
      </div>
      <div className="sch-lm-history-list">
        {currentLeaves.map((leave) => <HistoryItem key={leave.id} leave={leave} />)}
      </div>
      {totalPages > 1 && (
        <PaginationControls currentPage={currentPage} totalPages={totalPages}
          startIndex={startIndex} endIndex={endIndex} total={leaveHistory.length}
          onPrev={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          onNext={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
        />
      )}
    </div>
  );
}

LeaveHistory.propTypes = {
  leaveHistory: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.string, status: PropTypes.string, from: PropTypes.string,
    to: PropTypes.string, days: PropTypes.number, reason: PropTypes.string,
    approvedBy: PropTypes.string, appliedDate: PropTypes.string,
  })).isRequired,
};
