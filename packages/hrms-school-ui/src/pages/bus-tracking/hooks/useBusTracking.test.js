import { renderHook, act, waitFor } from '@testing-library/react';
import { useBusTracking, __nav } from './useBusTracking';
import socket from '../../../services/socket/busSocket';
import * as busTrackingData from '../../../constants/busTrackingData';
import { mapBusInfoResponse } from '../busApiMapper';

// Local mock data for bus tracking tests
const MOCK_BUS_INFO = {
  success: true,
  data: {
    currentStatus: {
      busNumber: 'SC-BUS-01',
      routeName: 'Madhapur Route',
      status: 'On Route',
      nextStop: 'School Campus',
    },
    driverDetails: {
      driverName: 'Ramesh Kumar',
      licenseNumber: 'TS09-20150123456',
      experienceYears: 8,
      contactNumber: '9000020001',
      verificationStatus: 'Verified Driver',
    },
    liveTracking: {
      pickupTime: '08:00:00',
      dropTime: '08:25:00',
    },
    dailyPerformance: {
      onTimePercent: 'NA',
      totalStudents: 'NA',
      routeKm: 'NA',
      etaMinutes: 'NA',
      excellentBadge: 'NA',
    },
    supportStaff: [],
    routeSchedule: [
      { sequenceNo: 1, stopName: 'Stop 1', arrivalTime: '08:00', stopStatus: 'current' },
      { sequenceNo: 2, stopName: 'Stop 2', arrivalTime: '08:15', stopStatus: 'upcoming' },
    ],
    safetyAndAlerts: {
      totalStudents: 'NA',
      boardedStudents: 'NA',
      boardedPercentage: 'NA',
    },
    weeklyAnalytics: {
      avgOnTimeRate: '95.000000',
      totalDistanceKm: '245.00',
      fuelEfficiencyKmPerLitre: '7.100000',
      avgAttendancePercent: '73.330000000000',
    },
    transportIncharge: {
      staffId: 55003,
      inchargeName: 'Ramesh Kumar',
      designation: 'Transport Admin',
      experienceYears: 9,
      availabilityStatus: 'Available 24/7',
      contactNumber: '9000030005',
    },
  },
};

// mock-prefixed fn so babel-jest allows it in jest.mock factory
const mockUseBusInfoQuery = jest.fn();

// Mock fetchBusInfo so it always rejects, triggering the static-data fallback path
jest.mock('../../../services/busTracking.api', () => ({
  getBusInfo: jest.fn(() => Promise.reject(new Error('Network error'))),
  getBusLocation: jest.fn(() => Promise.reject(new Error('Network error'))),
}));

// Mock socket
jest.mock('../../../services/socket/busSocket', () => ({
  on: jest.fn(),
  off: jest.fn(),
  emit: jest.fn()
}));

// Mock busTracking React Query hook to avoid QueryClientProvider requirement
jest.mock('../../../services/busTracking.queries', () => ({
  useBusInfoQuery: (...args) => mockUseBusInfoQuery(...args),
}));

// Mock bus tracking data
jest.mock('../../../constants/busTrackingData', () => ({
  busCurrentStatus: {
    status: 'on-route',
    busNumber: 'SC-BUS-01',
    route: 'Madhapur Route',
    nextStop: 'School Campus',
    currentLocation: {
      lat: 17.502184,
      lng: 78.394876,
      address: 'Currently on route',
      timestamp: 1774977198772,
    },
  },
  driverInfo: {
    id: 'DRV-2023-001',
    name: 'Ramesh Kumar',
    avatar: '',
    license: 'TS09-20150123456',
    yearsOfExperience: 8,
    phone: '9000020001',
    isVerified: true,
    rating: 4.8,
    totalTrips: 1250,
  },
  supportStaff: [
    {
      id: 55001,
      role: 'Helper',
      name: 'Ramu',
      avatar: '',
      phone: '',
      certification: 'Safety Certified',
      certificationColor: 'pink',
      staffId: 55001,
    },
    {
      id: 55003,
      role: 'Transport Admin',
      name: 'Ramesh Kumar',
      avatar: '',
      phone: '',
      certification: 'Transport Licensed',
      certificationColor: 'blue',
      staffId: 55003,
    },
  ],
  dailyPerformance: {
    metrics: [],
    statusIcon: '✓',
    statusMessage: 'Good',
  },
  safetyAlerts: [],
  weeklyAnalytics: { stats: [] },
  routeSchedule: []
}));

describe('useBusTracking Hook', () => {
  let mockSocketCallbacks = {};

  beforeEach(() => {
    jest.clearAllMocks();
    mockSocketCallbacks = {};

    // Provide real bus info data to the query mock
    mockUseBusInfoQuery.mockReturnValue({ data: MOCK_BUS_INFO.data, isLoading: false, isError: false });
    
    // Capture socket.on callbacks
    socket.on.mockImplementation((event, callback) => {
      mockSocketCallbacks[event] = callback;
    });

    // Mock alert
    global.alert = jest.fn();
    global.console.log = jest.fn();
    // Replace the nav helper so tests don't trigger real navigation
    __nav.go = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with correct default state', async () => {
      const { result } = renderHook(() => useBusTracking());

      await waitFor(() => {
        expect(result.current.state.buses).toEqual([]);
        expect(result.current.state.selectedBus).toBeNull();
        expect(result.current.state.isLoading).toBe(false);
        expect(result.current.state.error).toBeNull();
      });
    });

    it('should load mock data on mount when API fails', async () => {
      const { result } = renderHook(() => useBusTracking());
      const mapped = mapBusInfoResponse(MOCK_BUS_INFO.data);

      await waitFor(() => {
        // currentStatus — allow dynamic timestamp
        expect(result.current.state.currentStatus).toMatchObject({
          ...mapped.currentStatus,
          currentLocation: {
            ...mapped.currentStatus.currentLocation,
            timestamp: expect.any(Number),
          },
        });
        expect(result.current.state.driverInfo).toEqual(mapped.driverInfo);
        expect(result.current.state.supportStaff).toEqual(mapped.supportStaff);
        expect(result.current.state.dailyPerformance).toEqual(mapped.dailyPerformance);
        expect(result.current.state.safetyAlerts).toEqual(busTrackingData.safetyAlerts);
        expect(result.current.state.weeklyAnalytics).toEqual(mapped.weeklyAnalytics);
        // Verify route schedule includes current and pending stops
        expect(result.current.state.routeSchedule).toEqual(mapped.routeSchedule);
        const statuses = result.current.state.routeSchedule.map(s => s.status);
        expect(statuses).toContain('current');
        expect(statuses).toContain('pending');
      });
    });

    it('should set up socket listener for bus_locations', () => {
      renderHook(() => useBusTracking());

      expect(socket.on).toHaveBeenCalledWith('bus_locations', expect.any(Function));
    });

    it('should clean up socket listener on unmount', () => {
      const { unmount } = renderHook(() => useBusTracking());

      unmount();

      expect(socket.off).toHaveBeenCalledWith('bus_locations', expect.any(Function));
    });
  });

  describe('Real-time Bus Updates', () => {
    it('should update buses when receiving socket data', async () => {
      const { result } = renderHook(() => useBusTracking());

      const mockBusData = [
        { id: 'BUS001', lat: 17.502184, lng: 78.394876, speed: 35, status: 'on-route' },
        { id: 'BUS002', lat: 17.512184, lng: 78.404876, speed: 40, status: 'on-route' }
      ];

      act(() => {
        mockSocketCallbacks['bus_locations'](mockBusData);
      });

      await waitFor(() => {
        expect(result.current.state.buses).toEqual(mockBusData);
      });
    });

    it('should update individual bus in existing list', async () => {
      const { result } = renderHook(() => useBusTracking());

      // Initial bus data
      const initialBuses = [
        { id: 'BUS001', lat: 17.502184, lng: 78.394876, speed: 35 },
        { id: 'BUS002', lat: 17.512184, lng: 78.404876, speed: 40 }
      ];

      act(() => {
        mockSocketCallbacks['bus_locations'](initialBuses);
      });

      // Updated bus data
      const updatedBuses = [
        { id: 'BUS001', lat: 17.503184, lng: 78.395876, speed: 38 },
        { id: 'BUS002', lat: 17.512184, lng: 78.404876, speed: 40 }
      ];

      act(() => {
        mockSocketCallbacks['bus_locations'](updatedBuses);
      });

      await waitFor(() => {
        expect(result.current.state.buses[0].speed).toBe(38);
        expect(result.current.state.buses[0].lat).toBe(17.503184);
      });
    });
  });

  describe('Handler Functions', () => {
    describe('handleBusClick', () => {
      it('should set selected bus when clicked', () => {
        const { result } = renderHook(() => useBusTracking());

        const mockBus = { 
          id: 'BUS001', 
          route: 'Route A', 
          lat: 17.502184, 
          lng: 78.394876 
        };

        act(() => {
          result.current.handlers.handleBusClick(mockBus);
        });

        expect(result.current.state.selectedBus).toEqual(mockBus);
      });

      it('should log bus information when clicked', () => {
        const { result } = renderHook(() => useBusTracking());

        const mockBus = { id: 'BUS001', route: 'Route A' };

        act(() => {
          result.current.handlers.handleBusClick(mockBus);
        });

        expect(console.log).toHaveBeenCalledWith('Bus clicked:', mockBus);
      });
    });

    describe('handleCallDriver', () => {
      it('should initiate phone call when driver has phone number', async () => {
        const { result } = renderHook(() => useBusTracking());

        // Wait for static data to load (driverInfo.phone = '9000020001')
        await waitFor(() => {
          expect(result.current.state.driverInfo).not.toBeNull();
        });

        act(() => {
          result.current.handlers.handleCallDriver();
        });

        expect(__nav.go).toHaveBeenCalledWith(`tel:${busTrackingData.driverInfo.phone}`);
      });

      it('should not initiate call if driver has no phone', async () => {
        const { result } = renderHook(() => useBusTracking());

        // Wait for initial load then clear driverInfo phone via dispatch
        await waitFor(() => {
          expect(result.current.state.driverInfo).not.toBeNull();
        });

        const hrefBefore = window.location.href;

        act(() => {
          result.current.dispatch({
            type: 'UPDATE_STATE_FIELD',
            field: 'driverInfo',
            value: { name: 'John Doe', license: 'DL12345', phone: null },
          });
        });

        act(() => {
          result.current.handlers.handleCallDriver();
        });

        expect(__nav.go).not.toHaveBeenCalled();
      });
    });

    describe('handleEmergencySOS', () => {
      it('should log emergency activation', () => {
        const { result } = renderHook(() => useBusTracking());

        act(() => {
          result.current.handlers.handleEmergencySOS();
        });

        expect(console.log).toHaveBeenCalledWith('Emergency SOS triggered');
      });

      it('should show alert when emergency is activated', () => {
        const { result } = renderHook(() => useBusTracking());

        act(() => {
          result.current.handlers.handleEmergencySOS();
        });

        expect(alert).toHaveBeenCalledWith('Emergency SOS activated! Contacting authorities...');
      });
    });

    describe('handleViewReport', () => {
      it('should log when view report is clicked', () => {
        const { result } = renderHook(() => useBusTracking());

        act(() => {
          result.current.handlers.handleViewReport();
        });

        expect(console.log).toHaveBeenCalledWith('View full report clicked');
      });
    });
  });

  describe('State Management', () => {
    it('should provide dispatch function', () => {
      const { result } = renderHook(() => useBusTracking());

      expect(result.current.dispatch).toBeDefined();
      expect(typeof result.current.dispatch).toBe('function');
    });

    it('should provide all required handlers', () => {
      const { result } = renderHook(() => useBusTracking());

      expect(result.current.handlers).toHaveProperty('handleBusClick');
      expect(result.current.handlers).toHaveProperty('handleCallDriver');
      expect(result.current.handlers).toHaveProperty('handleEmergencySOS');
      expect(result.current.handlers).toHaveProperty('handleViewReport');
    });

    it('should return state with all required properties', () => {
      const { result } = renderHook(() => useBusTracking());

      expect(result.current.state).toHaveProperty('buses');
      expect(result.current.state).toHaveProperty('currentStatus');
      expect(result.current.state).toHaveProperty('driverInfo');
      expect(result.current.state).toHaveProperty('supportStaff');
      expect(result.current.state).toHaveProperty('dailyPerformance');
      expect(result.current.state).toHaveProperty('safetyAlerts');
      expect(result.current.state).toHaveProperty('weeklyAnalytics');
      expect(result.current.state).toHaveProperty('routeSchedule');
      expect(result.current.state).toHaveProperty('isLoading');
      expect(result.current.state).toHaveProperty('error');
      expect(result.current.state).toHaveProperty('selectedBus');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid socket data gracefully', () => {
      const { result } = renderHook(() => useBusTracking());

      act(() => {
        mockSocketCallbacks['bus_locations'](null);
      });

      // Should not crash, state should remain stable
      expect(result.current.state.buses).toBeDefined();
    });

    it('should handle empty bus array from socket', () => {
      const { result } = renderHook(() => useBusTracking());

      act(() => {
        mockSocketCallbacks['bus_locations']([]);
      });

      expect(result.current.state.buses).toEqual([]);
    });
  });

  describe('Integration', () => {
    it('should correctly wire up all data and handlers', async () => {
      const { result } = renderHook(() => useBusTracking());

      // Verify data is loaded
      await waitFor(() => {
        expect(result.current.state.currentStatus).toBeDefined();
        expect(result.current.state.driverInfo).toBeDefined();
      });

      // Verify handlers work
      const mockBus = { id: 'BUS001' };
      act(() => {
        result.current.handlers.handleBusClick(mockBus);
      });

      expect(result.current.state.selectedBus).toEqual(mockBus);

      // Verify socket updates work
      const newBuses = [{ id: 'BUS002', lat: 17.5, lng: 78.4 }];
      act(() => {
        mockSocketCallbacks['bus_locations'](newBuses);
      });

      await waitFor(() => {
        expect(result.current.state.buses).toEqual(newBuses);
      });
    });
  });
});
