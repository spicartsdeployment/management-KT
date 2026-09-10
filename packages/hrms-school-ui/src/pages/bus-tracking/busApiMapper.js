/**
 * Maps the raw /bus/info API response to the Bus Tracking UI state shape.
 * All components read from the mapped state — no API shape leaks into JSX.
 *
 * Usage:
 *   import { mapBusInfoResponse } from './busApiMapper';
 *   const payload = mapBusInfoResponse(apiResponse.data);
 */

/** API status string → internal status key used for CSS class lookups. */
const STATUS_MAP = {
  'On Route': 'on-route',
  'At Stop': 'at-stop',
  'Delayed': 'delayed',
  'Breakdown': 'breakdown',
  'Idle': 'idle',
};

const mapStatus = (s) => STATUS_MAP[s] || 'on-route';

/** Parse a numeric string and strip trailing zeros for display. */
const fmtNum = (v) => String(parseFloat(v) || 0);

/** Certification label → badge colour class used in the UI. */
const CERT_COLOR_MAP = {
  'Safety Certified': 'pink',
  'Hygiene Certified': 'purple',
  'Transport Licensed': 'blue',
};

// ---------------------------------------------------------------------------
// Individual mappers
// ---------------------------------------------------------------------------

/**
 * Maps `data.currentStatus` → `busCurrentStatus` shape.
 * @param {Object} cs - API currentStatus object
 */
export function mapCurrentStatus(cs) {
  if (!cs) return null;
  return {
    status: mapStatus(cs.status),
    busNumber: cs.busNumber || '-',
    route: cs.routeName || '-',
    nextStop: cs.nextStop || '-',
    currentLocation: {
      lat: 17.502184,
      lng: 78.394876,
      address: 'Currently on route',
      timestamp: Date.now(),
    },
  };
}

/**
 * Maps `data.driverDetails` → `driverInfo` shape.
 * @param {Object} dd - API driverDetails object
 */
export function mapDriverInfo(dd) {
  if (!dd) return null;
  return {
    id: `DRV-${dd.staffId || ''}`,
    name: dd.driverName || '-',
    avatar: '',
    license: dd.licenseNumber || '-',
    yearsOfExperience: dd.experienceYears || 0,
    phone: dd.contactNumber || '-',
    isVerified: dd.verificationStatus === 'Verified Driver',
    rating: null,
    totalTrips: null,
  };
}

/**
 * Maps `data.supportStaff` array → `supportStaff` shape.
 * @param {Array} arr - API supportStaff array
 */
export function mapSupportStaff(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map((member) => ({
    id: member.staffId,
    role: member.role || '-',
    name: member.staffName || '-',
    avatar: '',
    phone: '',
    certification: member.certification || '-',
    certificationColor: CERT_COLOR_MAP[member.certification] || 'gray',
    staffId: member.staffId,
  }));
}

/**
 * Maps `data.liveTracking` → `busTimings` shape.
 * @param {Object} lt - API liveTracking object
 */
export function mapLiveTracking(lt) {
  if (!lt) return null;
  return {
    pickupTime: lt.pickupTime || '-',
    pickupLabel: 'Morning pickup',
    dropTime: lt.dropTime || '-',
    dropLabel: 'School arrival',
    estimatedArrival: '25 min',
    totalTravelTime: '25 min',
  };
}

/**
 * Maps `data.dailyPerformance` → `dailyPerformance` shape.
 * @param {Object} dp - API dailyPerformance object
 */
export function mapDailyPerformance(dp) {
  if (!dp) return null;
  const { onTimePercent, totalStudents, routeKm, etaMinutes, excellentBadge } = dp;
  return {
    onTimeRate: onTimePercent,
    totalStudents,
    routeDistance: routeKm,
    estimatedTimeArrival: etaMinutes,
    statusMessage: excellentBadge,
    statusIcon: '🏆',
    metrics: [
      {
        id: 1,
        label: 'On Time',
        value: onTimePercent,
        color: 'green',
        bgColor: 'sch-bus-metric-bg-green',
        textColor: 'sch-bus-metric-text-green',
      },
      {
        id: 2,
        label: 'Students',
        value: totalStudents,
        color: 'blue',
        bgColor: 'sch-bus-metric-bg-blue',
        textColor: 'sch-bus-metric-text-blue',
      },
      {
        id: 3,
        label: 'km Route',
        value: routeKm,
        color: 'yellow',
        bgColor: 'sch-bus-metric-bg-yellow',
        textColor: 'sch-bus-metric-text-yellow',
      },
      {
        id: 4,
        label: 'min ETA',
        value: etaMinutes,
        color: 'purple',
        bgColor: 'sch-bus-metric-bg-purple',
        textColor: 'sch-bus-metric-text-purple',
      },
    ],
  };
}

/**
 * Maps `data.routeSchedule` array → `routeSchedule` shape.
 * @param {Array} arr - API routeSchedule array
 */
export function mapRouteSchedule(arr) {
  if (!Array.isArray(arr)) return [];
  const totalStops = arr.length;
  return arr.map((stop) => ({
    id: stop.sequenceNo,
    stopNumber: stop.sequenceNo,
    name: stop.stopName || '-',
    address: '',
    time: stop.arrivalTime || '-',
    status: (stop.stopStatus || '').toLowerCase() === 'upcoming' ? 'pending' : (stop.stopStatus || '').toLowerCase(),
    lat: null,
    lng: null,
    studentsBoarded: 0,
    estimatedWaitTime: 0,
    isDestination: stop.sequenceNo === totalStops,
  }));
}

/**
 * Maps `data.weeklyAnalytics` → `weeklyAnalytics` shape.
 * Parses numeric strings and formats display values without trailing zeros.
 * @param {Object} wa - API weeklyAnalytics object
 */
export function mapWeeklyAnalytics(wa) {
  if (!wa) return null;
  const onTimeRate = parseFloat(wa.avgOnTimeRate) || 0;
  const distance = parseFloat(wa.totalDistanceKm) || 0;
  const fuel = parseFloat(wa.fuelEfficiencyKmPerLitre) || 0;
  const attendance = parseFloat(wa.avgAttendancePercent) || 0;
  return {
    averageOnTimeRate: onTimeRate,
    totalDistance: distance,
    fuelEfficiency: fuel,
    studentAttendance: attendance,
    stats: [
      {
        id: 1,
        label: 'Average On-Time Rate',
        value: `${fmtNum(onTimeRate)}%`,
        color: 'green',
        textColor: 'sch-bus-stat-text-green',
      },
      {
        id: 2,
        label: 'Total Distance',
        value: `${fmtNum(distance)} km`,
        color: 'blue',
        textColor: 'sch-bus-stat-text-blue',
      },
      {
        id: 3,
        label: 'Fuel Efficiency',
        value: `${fmtNum(fuel)} km/L`,
        color: 'orange',
        textColor: 'sch-bus-stat-text-orange',
      },
      {
        id: 4,
        label: 'Student Attendance',
        value: `${fmtNum(attendance)}%`,
        color: 'purple',
        textColor: 'sch-bus-stat-text-purple',
      },
    ],
  };
}

/**
 * Maps `data.transportIncharge` → `transportIncharge` shape.
 * @param {Object} ti - API transportIncharge object
 */
export function mapTransportIncharge(ti) {
  if (!ti) return null;
  return {
    id: `TI-${ti.staffId}`,
    name: ti.inchargeName || '-',
    role: ti.designation || '-',
    phone: ti.contactNumber || '-',
    yearsOfExperience: ti.experienceYears || 0,
    availability: ti.availabilityStatus || '-',
    isVerified: true,
    staffId: ti.staffId,
  };
}

// ---------------------------------------------------------------------------
// Root mapper
// ---------------------------------------------------------------------------

/**
 * Maps the full `data` object from the /bus/info API response to the
 * Bus Tracking INIT_DATA payload shape.
 *
 * @param {Object} data - `response.data` from the /bus/info API
 * @returns {Object} Payload ready for `dispatch({ type: 'INIT_DATA', payload })`
 */
export function mapBusInfoResponse(data) {
  return {
    currentStatus: mapCurrentStatus(data.currentStatus),
    driverInfo: mapDriverInfo(data.driverDetails),
    supportStaff: mapSupportStaff(data.supportStaff),
    liveTracking: mapLiveTracking(data.liveTracking),
    dailyPerformance: mapDailyPerformance(data.dailyPerformance),
    routeSchedule: mapRouteSchedule(data.routeSchedule),
    weeklyAnalytics: mapWeeklyAnalytics(data.weeklyAnalytics),
    transportIncharge: mapTransportIncharge(data.transportIncharge),
  };
}
