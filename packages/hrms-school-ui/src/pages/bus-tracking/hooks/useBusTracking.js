import { useReducer, useEffect, useState, useRef, useCallback } from 'react';
import { Context, reducer, initialState } from '../context';
import socket from '../../../services/socket/busSocket';
import { getBusLocation } from '../../../services/busTracking.api';
import { useBusInfoQuery } from '../../../services/busTracking.queries';
import { mapBusInfoResponse } from '../busApiMapper';

/** Navigation helper – exported so tests can replace it without touching window.location */
export const __nav = { go: (url) => { window.location.href = url; } };
import {
  calculateDistance,
  calculateETA,
  getStatusMessage,
  getBusStatus,
  formatDistance,
  formatETA,
  isWithinGeofence
} from '../../../utils/busTrackingUtils';
import {
  safetyAlerts,
  emergencyContact,
} from '../../../constants/busTrackingData';

/**
 * Custom hook for Bus Tracking business logic
 * Handles API polling, state management, ETA calculations, and live tracking
 * 
 * @returns {Object} Context provider value and handlers
 */
export const useBusTracking = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  // Live tracking state
  const [busLocation, setBusLocation] = useState(null);
  const [prevBusLocation, setPrevBusLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [eta, setEta] = useState(null);
  const [statusMessage, setStatusMessage] = useState('Waiting for bus location...');
  const [busStatus, setBusStatus] = useState('moving');
  
  // Fixed pickup location (this should come from user profile or API)
  const pickupLocation = {
    latitude: 17.485837,
    longitude: 78.389164,
    name: 'Main Street Pickup Point'
  };
  
  // Polling interval reference
  const pollingIntervalRef = useRef(null);
  const locationHistoryRef = useRef([]);
  // Ref to always hold the latest callback, avoiding stale closures in setInterval
  const fetchAndUpdateRef = useRef(null);

  // Static bus info via React Query (replaces manual fetchBusInfo useEffect)
  const { data: busInfoData } = useBusInfoQuery();

  useEffect(() => {
    if (!busInfoData) return;
    dispatch({ type: 'INIT_DATA', payload: { ...mapBusInfoResponse(busInfoData), emergencyContact, safetyAlerts } });
  }, [busInfoData]);

  /**
   * Fetch bus location from API
   * This function is called every 5 seconds
   */
  const fetchAndUpdateBusLocation = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', value: true });
      
      const busNumber = state.currentStatus?.busNumber;
      if (!busNumber) {
        console.warn('[BusTracking] No bus number specified. Skipping location fetch.');
        dispatch({ type: 'SET_LOADING', value: false });
        return;
      }
      const locationData = await getBusLocation({ busNumber });
      
      // Store previous location for smooth animation
      if (busLocation) {
        setPrevBusLocation(busLocation);
      }
      
      // Update current location
      setBusLocation(locationData);
      
      // Add to location history (keep last 20 points for calculations)
      locationHistoryRef.current = [
        ...locationHistoryRef.current.slice(-19),
        locationData
      ];
      
      // Calculate distance from pickup location
      const dist = calculateDistance(locationData, pickupLocation);
      setDistance(dist);
      
      // Calculate ETA
      const calculatedETA = calculateETA(dist, locationData.speed);
      setEta(calculatedETA);
      
      // Get status message
      const message = getStatusMessage(calculatedETA, dist);
      setStatusMessage(message);
      
      // Determine bus status
      const status = getBusStatus(locationData.speed);
      setBusStatus(status);
      
      // Check if bus is within geofence (500m radius)
      const isNearby = isWithinGeofence(locationData, pickupLocation, 500);
      if (isNearby && !state.notificationSent) {
        // Send notification (implement your notification logic here)
        console.log('🚌 Bus is nearby! Get ready.');
        dispatch({ type: 'UPDATE_STATE_FIELD', field: 'notificationSent', value: true });
      }
      
      dispatch({ type: 'SET_LOADING', value: false });
      dispatch({ type: 'SET_ERROR', value: null });
      
    } catch (error) {
      console.error('Error fetching bus location:', error);
      // Location polling failures don't surface to the main error state
      // — the component continues to show static bus info from the query
      
      // Use mock data if API fails (for development/demo)
      if (process.env.NODE_ENV !== 'production') {
        const mockLocation = {
          latitude: 17.502184 + (Math.random() - 0.5) * 0.01,
          longitude: 78.394876 + (Math.random() - 0.5) * 0.01,
          speed: 30 + Math.random() * 20,
          timestamp: Date.now()
        };
        
        if (busLocation) {
          setPrevBusLocation(busLocation);
        }
        setBusLocation(mockLocation);
        
        const dist = calculateDistance(mockLocation, pickupLocation);
        setDistance(dist);
        const calculatedETA = calculateETA(dist, mockLocation.speed);
        setEta(calculatedETA);
        setStatusMessage(getStatusMessage(calculatedETA, dist));
        setBusStatus(getBusStatus(mockLocation.speed));
      }

      dispatch({ type: 'SET_LOADING', value: false });
    }
  }, [busLocation, pickupLocation, state.notificationSent]);


  // Keep ref in sync with the latest callback to avoid stale closures in the interval
  useEffect(() => {
    fetchAndUpdateRef.current = fetchAndUpdateBusLocation;
  }, [fetchAndUpdateBusLocation]);

  /**
   * Start polling for bus location every 5 seconds
   */

  useEffect(() => {
    // Initial fetch
    fetchAndUpdateRef.current?.();

    // Set up polling interval - always calls latest callback via ref
    pollingIntervalRef.current = setInterval(() => {
      fetchAndUpdateRef.current?.();
    }, 5000);

    // Cleanup on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []); // Empty array ensures only one interval is set

  /**
   * Set up WebSocket connection for real-time bus updates
   */
  useEffect(() => {
    const handleBusLocations = (data) => {
      if (!data) return;
      dispatch({ type: 'SET_BUSES', value: data });
    };

    socket.on('bus_locations', handleBusLocations);

    return () => {
      socket.off('bus_locations', handleBusLocations);
    };
  }, []);

  /**
   * Handle bus marker click
   */
  const handleBusClick = (bus) => {
    dispatch({ type: 'SET_SELECTED_BUS', value: bus });
    // TODO: Open detailed bus info modal
    console.log('Bus clicked:', bus);
  };

  /**
   * Handle driver phone call
   */
  const handleCallDriver = () => {
    if (state.driverInfo && state.driverInfo.phone) {
      __nav.go(`tel:${state.driverInfo.phone}`);
    }
  };

  /**
   * Handle emergency SOS button
   */
  const handleEmergencySOS = () => {
    console.log('Emergency SOS triggered');
    alert('Emergency SOS activated! Contacting authorities...');
  };

  /**
   * Handle view full report
   */
  const handleViewReport = () => {
    // TODO: Navigate to full analytics report
    console.log('View full report clicked');
  };

  /**
   * Manually refresh bus location
   */
  const handleRefreshLocation = () => {
    fetchAndUpdateBusLocation();
  };

  return {
    state: {
      ...state,
      busLocation,
      prevBusLocation,
      distance,
      eta,
      statusMessage,
      busStatus,
      pickupLocation,
      formattedDistance: distance ? formatDistance(distance) : 'Calculating...',
      formattedETA: eta !== null ? formatETA(eta) : 'Calculating...'
    },
    dispatch,
    handlers: {
      handleBusClick,
      handleCallDriver,
      handleEmergencySOS,
      handleViewReport,
      handleRefreshLocation
    }
  };
};
