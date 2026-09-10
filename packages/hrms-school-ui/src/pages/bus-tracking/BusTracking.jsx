import React from 'react';
import PropTypes from 'prop-types';
import { Context } from './context';
import { useBusTracking } from './hooks/useBusTracking';
import MapView from '../../components/MapView';
import Card from '@school-hrms/common-components/Card';
import PageLoader from '../../components/PageLoader';
import {
  TruckIcon, PhoneIcon, ExclamationTriangleIcon, ClockIcon, ArrowPathIcon
} from '@heroicons/react/24/outline';
import { statusColors } from '../../constants/busTrackingData';
import '../../assets/scss/BusTracking.scss';

/** Renders the status badge content inside the Current Status card */
const BusStatusBadge = ({ currentStatus }) => (
  <div className={`bt-status-badge ${statusColors[currentStatus.status]?.bg}`} data-testid="school-badge-bus-status">
    <div className={`sch-bus-status-icon ${statusColors[currentStatus.status]?.badge}`} data-testid="school-icon-bus-status">
      <TruckIcon className="icon" />
    </div>
    <div className="status-content">
      <div className="status-indicator">
        <div className={`status-dot ${statusColors[currentStatus.status]?.badge}`} data-testid="school-indicator-status-dot" />
        <span className={`status-label ${statusColors[currentStatus.status]?.text}`} data-testid="school-text-status-label">
          {statusColors[currentStatus.status]?.label || 'Unknown'}
        </span>
      </div>
      <p className="bus-number" data-testid="school-text-bus-number">{currentStatus.busNumber}</p>
      <p className="bus-route" data-testid="school-text-bus-route">{currentStatus.route}</p>
      <p className="next-stop" data-testid="school-text-next-stop">Next Stop: {currentStatus.nextStop}</p>
    </div>
  </div>
);
BusStatusBadge.propTypes = { currentStatus: PropTypes.shape({ status: PropTypes.string, busNumber: PropTypes.string, route: PropTypes.string, nextStop: PropTypes.string }) };

/** Current Status card */
const CurrentStatusCard = ({ currentStatus }) => (
  <Card className="status-card" data-testid="school-card-current-status">
    <h3 className="card-title" data-testid="school-text-status-title">Current Status</h3>
    <div className="current-status-card" data-testid="school-container-current-status">
      {currentStatus && <BusStatusBadge currentStatus={currentStatus} />}
    </div>
  </Card>
);
CurrentStatusCard.propTypes = { currentStatus: PropTypes.shape({ status: PropTypes.string }) };

/** Driver avatar and detail fields */
const DriverDetails = ({ driverInfo }) => (
  <div className="driver-content">
    <div className="driver-avatar" data-testid="school-avatar-driver">
      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="Driver" data-testid="school-image-driver-avatar" />
    </div>
    <div className="driver-details">
      <p className="driver-name" data-testid="school-text-driver-name">{driverInfo.name}</p>
      <p className="driver-license" data-testid="school-text-driver-license">License: {driverInfo.license}</p>
      <div className="driver-experience" data-testid="school-text-driver-experience">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
        </svg>
        <span>{driverInfo.yearsOfExperience} years experience</span>
      </div>
      {driverInfo?.isVerified && <span className="verified-badge" data-testid="school-badge-driver-verified">Verified Driver</span>}
    </div>
  </div>
);
DriverDetails.propTypes = { driverInfo: PropTypes.shape({ name: PropTypes.string, license: PropTypes.string, yearsOfExperience: PropTypes.number, isVerified: PropTypes.bool }) };

/** Driver Information card */
const DriverInfoCard = ({ driverInfo }) => (
  <Card className="driver-card" data-testid="school-card-driver-info">
    <div className="card-header">
      <h3 className="card-title" data-testid="school-text-driver-title">Driver Information</h3>
      {driverInfo?.phone && (
        <a href={`tel:${driverInfo.phone}`} className="call-button" data-testid="school-button-call-driver" aria-label="Call Driver">
          <PhoneIcon className="icon" />
        </a>
      )}
    </div>
    {driverInfo && <DriverDetails driverInfo={driverInfo} />}
  </Card>
);
DriverInfoCard.propTypes = { driverInfo: PropTypes.shape({ name: PropTypes.string, phone: PropTypes.string }) };

/** Single staff member row */
const StaffItem = ({ staff, index }) => (
  <div className="staff-item" data-testid={`school-item-support-${index}`}>
    <div className="staff-info">
      <div className="staff-avatar">
        <img src={staff.img || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'} alt={staff.name} />
      </div>
      <div className="staff-details">
        <p className="staff-role" data-testid={`school-text-staff-role-${index}`}>{staff.role}</p>
        <p className="staff-name" data-testid={`school-text-staff-name-${index}`}>{staff.name}</p>
        {staff.staffId && <p className="staff-id">ID: {staff.staffId}</p>}
        <span 
          className={`staff-certification-badge ${
            staff.certificationColor === 'pink' ? 'safety-certified' : 
            staff.certificationColor === 'purple' ? 'hygiene-certified' :
            staff.certificationColor === 'blue' ? 'transport-licensed' : ''
          }`}
          data-testid={`school-badge-staff-cert-${index}`}
        >
          {staff.certification || staff.label}
        </span>
      </div>
    </div>
  </div>
);
StaffItem.propTypes = { staff: PropTypes.shape({ img: PropTypes.string, name: PropTypes.string, role: PropTypes.string, staffId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), certification: PropTypes.string, certificationColor: PropTypes.string, label: PropTypes.string }), index: PropTypes.number };

/** Support Staff card */
const SupportStaffCard = ({ supportStaff }) => (
  <Card className="support-staff-card" data-testid="school-card-support-staff">
    <h3 className="card-title" data-testid="school-text-support-staff-title">Support Staff</h3>
    <div className="support-staff-list">
      {(supportStaff && supportStaff.length > 0)
        ? supportStaff.map((staff, index) => <StaffItem key={staff.id || index} staff={staff} index={index} />)
        : null}
    </div>
  </Card>
);
SupportStaffCard.propTypes = { supportStaff: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), name: PropTypes.string, role: PropTypes.string, certification: PropTypes.string })) };

/** Transport incharge details */
const InchargeDetails = ({ transportIncharge }) => (
  <div className="incharge-details">
    <p className="incharge-name" data-testid="school-text-incharge-name">{transportIncharge?.name || 'N/A'}</p>
    <p className="incharge-role" data-testid="school-text-incharge-role">{transportIncharge?.role || 'N/A'}</p>
    <p className="incharge-id" data-testid="school-text-incharge-id">ID: {transportIncharge?.staffId || 'N/A'}</p>
    <div className="incharge-experience" data-testid="school-text-incharge-experience">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
      </svg>
      <span>{transportIncharge?.yearsOfExperience ?? 0} years experience</span>
    </div>
    <span className="availability-badge" data-testid="school-badge-incharge-availability">{transportIncharge?.availability || 'Available 24/7'}</span>
  </div>
);
InchargeDetails.propTypes = { transportIncharge: PropTypes.shape({ name: PropTypes.string, role: PropTypes.string, staffId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), yearsOfExperience: PropTypes.number, availability: PropTypes.string }) };

/** Transport Incharge card */
const TransportInchargeCard = ({ transportIncharge }) => (
  <Card className="transport-incharge-card" data-testid="school-card-transport-incharge">
    <div className="card-header">
      <h3 className="card-title" data-testid="school-text-incharge-title">Transport Incharge</h3>
      {transportIncharge?.phone && (
        <a href={`tel:${transportIncharge.phone}`} className="call-button" data-testid="school-button-call-incharge" aria-label="Call Transport Incharge">
          <PhoneIcon className="icon" />
        </a>
      )}
    </div>
    <div className="incharge-content">
      <div className="incharge-avatar" data-testid="school-avatar-incharge">
        <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" alt="Transport Incharge" data-testid="school-image-incharge-avatar" />
      </div>
      {transportIncharge && <InchargeDetails transportIncharge={transportIncharge} />}
    </div>
  </Card>
);
TransportInchargeCard.propTypes = { transportIncharge: PropTypes.shape({ phone: PropTypes.string }) };

/** Pickup/drop timing grid */
const TimingGrid = ({ liveTracking }) => {
  const pickupTime = liveTracking?.pickupTime ? liveTracking.pickupTime.substring(0, 5) : '--:--';
  const dropTime = liveTracking?.dropTime ? liveTracking.dropTime.substring(0, 5) : '--:--';
  return (
    <div className="timing-grid" data-testid="school-grid-timings">
      <div className="timing-card pickup" data-testid="school-card-pickup-time">
        <div className="timing-header"><ClockIcon className="icon" /><span data-testid="school-text-pickup-label">Pickup Time</span></div>
        <p className="timing-value" data-testid="school-text-pickup-time">{pickupTime}</p>
        <p className="timing-desc" data-testid="school-text-pickup-desc">Morning pickup</p>
      </div>
      <div className="timing-card drop" data-testid="school-card-drop-time">
        <div className="timing-header"><ClockIcon className="icon" /><span data-testid="school-text-drop-label">Drop Time</span></div>
        <p className="timing-value" data-testid="school-text-drop-time">{dropTime}</p>
        <p className="timing-desc" data-testid="school-text-drop-desc">School arrival</p>
      </div>
    </div>
  );
};
TimingGrid.propTypes = { liveTracking: PropTypes.shape({ pickupTime: PropTypes.string, dropTime: PropTypes.string }) };

/** Live distance/ETA/speed bar */
const TrackingInfoBar = ({ formattedDistance, formattedETA, speed }) => (
  <div className="tracking-info-bar" data-testid="school-bar-tracking-info">
    <div className="info-item"><span className="info-label">Distance:</span><span className="info-value">{formattedDistance}</span></div>
    <div className="info-item"><span className="info-label">ETA:</span><span className="info-value eta-highlight">{formattedETA}</span></div>
    <div className="info-item"><span className="info-label">Speed:</span><span className="info-value">{speed} km/h</span></div>
  </div>
);
TrackingInfoBar.propTypes = { formattedDistance: PropTypes.string, formattedETA: PropTypes.string, speed: PropTypes.string };

/** Bus status message banner */
const StatusMessageBanner = ({ busStatus, statusMessage }) => (
  <div className={`status-message-banner ${busStatus}`} data-testid="school-banner-status-message">
    <span className="banner-icon">
      {busStatus === 'moving' && '🚌'}
      {busStatus === 'stopped' && '🛑'}
      {busStatus === 'delayed' && '⚠️'}
    </span>
    <span className="status-text">{statusMessage}</span>
  </div>
);
StatusMessageBanner.propTypes = { busStatus: PropTypes.string, statusMessage: PropTypes.string };

/** Single route stop item */
const RouteStopItem = ({ stop, index }) => {
  const isCompleted = stop.status === 'completed';
  const isCurrent = stop.status === 'current';
  const statusClass = isCompleted ? 'completed' : isCurrent ? 'current' : 'pending';
  return (
    <div className={`route-stop ${statusClass}`} data-testid={`school-item-route-stop-${index}`}>
      <div className="stop-icon" data-testid={`school-icon-stop-${index}`}>
        {isCompleted ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        ) : isCurrent ? <div className="current-dot" /> : <div className="empty-circle" />}
      </div>
      <div className="stop-details">
        <p className="stop-name" data-testid={`school-text-stop-name-${index}`}>Stop {stop.stopNumber} - {stop.name}</p>
      </div>
      <span className="stop-time" data-testid={`school-text-stop-time-${index}`}>{stop.time}</span>
    </div>
  );
};
RouteStopItem.propTypes = { stop: PropTypes.shape({ status: PropTypes.string, stopNumber: PropTypes.number, name: PropTypes.string, time: PropTypes.string, id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]) }), index: PropTypes.number };

/** Live Location & Map card */
const LiveLocationCard = ({ state, handlers }) => {
  const { buses, busLocation, statusMessage, busStatus, formattedDistance, formattedETA, isLoading, liveTracking } = state;
  const speed = busLocation?.speed?.toFixed(1) || '0.0';
  const onBusClick = handlers.handleBusClick || (() => {});
  return (
    <Card className="location-card" data-testid="school-card-live-location">
      <div className="card-header">
        <h2 className="card-title" data-testid="school-text-location-title">Live Location & Timing</h2>
        <button className="refresh-button" onClick={handlers.handleRefreshLocation} data-testid="school-button-refresh-location" aria-label="Refresh Location" disabled={isLoading}>
          <ArrowPathIcon className={`icon ${isLoading ? 'spinning' : ''}`} />
        </button>
      </div>
      <TrackingInfoBar formattedDistance={formattedDistance} formattedETA={formattedETA} speed={speed} />
      <StatusMessageBanner busStatus={busStatus} statusMessage={statusMessage} />
      <TimingGrid liveTracking={liveTracking} />
      <div className="map-container" data-testid="school-container-map">
        <MapView buses={buses} onBusClick={onBusClick} data-testid="school-map-live-tracking" />
      </div>
    </Card>
  );
};
LiveLocationCard.propTypes = { state: PropTypes.shape({ buses: PropTypes.array, busLocation: PropTypes.object, statusMessage: PropTypes.string, busStatus: PropTypes.string, formattedDistance: PropTypes.string, formattedETA: PropTypes.string, isLoading: PropTypes.bool }), handlers: PropTypes.shape({ handleRefreshLocation: PropTypes.func, handleBusClick: PropTypes.func }) };

/** Route & Schedule card */
const RouteScheduleCard = ({ routeSchedule }) => (
  <Card className="route-card" data-testid="school-card-route-schedule">
    <div className="card-header">
      <h3 className="card-title" data-testid="school-text-route-title">Route & Schedule</h3>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l19-9-9 19-2-8-8-2z" /></svg>
    </div>
    <div className="route-list" data-testid="school-list-route-stops">
      {(routeSchedule && routeSchedule.length > 0)
        ? routeSchedule.map((stop, index) => <RouteStopItem key={stop.id} stop={stop} index={index} />)
        : null}
    </div>
  </Card>
);
RouteScheduleCard.propTypes = { routeSchedule: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), status: PropTypes.string })) };

/** Performance metrics grid */
const PerformanceMetrics = ({ metrics }) => (
  <div className="metrics-grid" data-testid="school-grid-performance-metrics">
    {metrics.map((metric, index) => (
      <div key={metric.id} className={`bus-metric-card ${metric.bgColor}`} data-testid={`school-card-metric-${index}`}>
        <p className={`metric-value ${metric.textColor}`} data-testid={`school-text-metric-value-${index}`}>{metric.value}</p>
        <p className={`metric-label ${metric.textColor}`} data-testid={`school-text-metric-label-${index}`}>{metric.label}</p>
      </div>
    ))}
  </div>
);
PerformanceMetrics.propTypes = { metrics: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), bgColor: PropTypes.string, textColor: PropTypes.string, value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), label: PropTypes.string })) };

/** Daily Performance card */
const DailyPerformanceCard = ({ dailyPerformance }) => (
  <Card className="performance-card" data-testid="school-card-daily-performance">
    <div className="card-header">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
      <h3 className="card-title" data-testid="school-text-performance-title">Daily Performance</h3>
    </div>
    {dailyPerformance ? (
      <>
        <PerformanceMetrics metrics={dailyPerformance.metrics} />
        <div className="status-message" data-testid="school-badge-performance-status">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2" />
          </svg>
          <span className="message">{dailyPerformance.statusMessage}</span>
        </div>
      </>
    ) : null}
  </Card>
);
DailyPerformanceCard.propTypes = { dailyPerformance: PropTypes.shape({ metrics: PropTypes.array, statusMessage: PropTypes.string }) };

/** Safety & Alerts card */
const SafetyAlertsCard = ({ safetyAlerts, emergencyContact }) => (
  <Card className="safety-card" data-testid="school-card-safety-alerts">
    <div className="card-header">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><circle cx="12" cy="10" r="3" />
      </svg>
      <h3 className="card-title" data-testid="school-text-safety-title">Safety & Alerts</h3>
    </div>
    <div className="alerts-list">
      {(safetyAlerts && safetyAlerts.length > 0)
        ? safetyAlerts.map((alert, index) => (
            <div key={alert.id} className={`alert-item ${alert.bgColor}`} data-testid={`school-item-alert-${index}`}>
              <div className="alert-header">
                <div className={`alert-icon ${alert.iconBg}`} data-testid={`school-icon-alert-${index}`}><span className="icon-text">{alert.icon}</span></div>
                <p className={`alert-title ${alert.textColor}`} data-testid={`school-text-alert-title-${index}`}>{alert.title}</p>
              </div>
              <p className="alert-message" data-testid={`school-text-alert-message-${index}`}>{alert.message}</p>
            </div>
          ))
        : null}
      {emergencyContact?.number && (
        <a href={`tel:${emergencyContact.number}`} className="emergency-button" data-testid="school-button-emergency-sos" aria-label="Emergency SOS">
          <ExclamationTriangleIcon className="icon" /><span className="text">Emergency SOS</span>
        </a>
      )}
    </div>
  </Card>
);
SafetyAlertsCard.propTypes = { safetyAlerts: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), bgColor: PropTypes.string, icon: PropTypes.string, iconBg: PropTypes.string, textColor: PropTypes.string, title: PropTypes.string, message: PropTypes.string })), emergencyContact: PropTypes.shape({ number: PropTypes.string }) };

/** Weekly Analytics card */
const WeeklyAnalyticsCard = ({ weeklyAnalytics, _onViewReport }) => (
  <Card className="analytics-card" data-testid="school-card-weekly-analytics">
    <div className="card-header">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3,17 9,11 13,15 21,7" /><polyline points="14,7 21,7 21,14" />
      </svg>
      <h3 className="card-title" data-testid="school-text-analytics-title">Weekly Analytics</h3>
    </div>
    {weeklyAnalytics && (
      <>
        <div className="stats-list" data-testid="school-list-analytics-stats">
          {weeklyAnalytics.stats.map((stat, index) => (
            <div key={stat.id} className="stat-item" data-testid={`school-item-stat-${index}`}>
              <span className="stat-label" data-testid={`school-text-stat-label-${index}`}>{stat.label}</span>
              <span className={`stat-value ${stat.textColor}`} data-testid={`school-text-stat-value-${index}`}>{stat.value}</span>
            </div>
          ))}
        </div>
        {/* <button className="report-button" onClick={onViewReport} data-testid="school-button-view-report" aria-label="View Full Report">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3,17 9,11 13,15 21,7" /><polyline points="14,7 21,7 21,14" />
          </svg>
          <span className="text">View Full Report</span>
        </button> */}
      </>
    )}
  </Card>
);
WeeklyAnalyticsCard.propTypes = { weeklyAnalytics: PropTypes.shape({ stats: PropTypes.array }), _onViewReport: PropTypes.func };

/**
 * Bus Tracking left panel
 * @param {{ state: object, handlers: object }} props
 */
const LeftPanel = ({ state, _handlers }) => (
  <div className="bus-tracking-panel" data-testid="school-panel-left">
    <CurrentStatusCard currentStatus={state.currentStatus} />
    <DriverInfoCard driverInfo={state.driverInfo} />
    <SupportStaffCard supportStaff={state.supportStaff} />
    <TransportInchargeCard transportIncharge={state.transportIncharge} />
  </div>
);
LeftPanel.propTypes = { state: PropTypes.shape({ currentStatus: PropTypes.object, driverInfo: PropTypes.object, supportStaff: PropTypes.array, transportIncharge: PropTypes.object }), _handlers: PropTypes.object };

/**
 * Bus Tracking center panel
 * @param {{ state: object, handlers: object }} props
 */
const CenterPanel = ({ state, handlers }) => (
  <div className="bus-tracking-center" data-testid="school-panel-center">
    <LiveLocationCard state={state} handlers={handlers} />
    <RouteScheduleCard routeSchedule={state.routeSchedule} />
  </div>
);
CenterPanel.propTypes = { state: PropTypes.shape({ routeSchedule: PropTypes.array }), handlers: PropTypes.object };

/**
 * Bus Tracking right panel
 * @param {{ state: object, handlers: object }} props
 */
const RightPanel = ({ state, _handlers }) => (
  <div className="bus-tracking-panel" data-testid="school-panel-right">
    <DailyPerformanceCard dailyPerformance={state.dailyPerformance} />
    <SafetyAlertsCard safetyAlerts={state.safetyAlerts} emergencyContact={state.emergencyContact} />
    <WeeklyAnalyticsCard weeklyAnalytics={state.weeklyAnalytics} />
  </div>
);
RightPanel.propTypes = { state: PropTypes.shape({ dailyPerformance: PropTypes.object, safetyAlerts: PropTypes.array, emergencyContact: PropTypes.object, weeklyAnalytics: PropTypes.object }), _handlers: PropTypes.object };

/**
 * Bus Tracking Component
 * Displays real-time bus tracking with driver info, route schedule, and safety alerts
 */
const BusTracking = () => {
  const { state, handlers } = useBusTracking();
  const { isLoading, currentStatus } = state;

  if (isLoading && !currentStatus) {
    return <PageLoader title="Loading Your Routes" subtitle="Tracking bus location..." icon="🚌" />;
  }

  return (
    <Context.Provider value={{ state, dispatch: () => {} }}>
      <div className="bus-tracking-container" data-testid="school-container-bus-tracking">
        <div className="bus-tracking-header" data-testid="school-header-bus-tracking">
          <h1 className="bus-tracking-title" data-testid="school-text-page-title">Transportation</h1>
          <p className="bus-tracking-subtitle" data-testid="school-text-page-subtitle">
            Real-time school bus tracking and staff information
          </p>
        </div>
        <div className="bus-tracking-grid">
          <LeftPanel state={state} handlers={handlers} />
          <CenterPanel state={state} handlers={handlers} />
          <RightPanel state={state} handlers={handlers} />
        </div>
      </div>
    </Context.Provider>
  );
};

export default BusTracking;
