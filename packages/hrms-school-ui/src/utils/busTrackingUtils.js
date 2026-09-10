import { getDistance } from 'geolib';

/**
 * Calculate distance between two GPS coordinates
 * 
 * @param {Object} point1 - First point { latitude, longitude }
 * @param {Object} point2 - Second point { latitude, longitude }
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (point1, point2) => {
  try {
    // geolib returns distance in meters
    const distanceInMeters = getDistance(
      { latitude: point1.latitude, longitude: point1.longitude },
      { latitude: point2.latitude, longitude: point2.longitude }
    );
    
    // Convert to kilometers
    return distanceInMeters / 1000;
  } catch (error) {
    console.error('Error calculating distance:', error);
    return 0;
  }
};

/**
 * Calculate ETA (Estimated Time of Arrival)
 * Formula: ETA = distance / speed
 * 
 * @param {number} distance - Distance in kilometers
 * @param {number} speed - Speed in km/h
 * @returns {number} ETA in minutes
 */
export const calculateETA = (distance, speed) => {
  try {
    if (speed <= 0) {
      return null; // Bus is stopped, cannot calculate ETA
    }
    
    // ETA in hours = distance / speed
    const etaInHours = distance / speed;
    
    // Convert to minutes
    const etaInMinutes = etaInHours * 60;
    
    return etaInMinutes;
  } catch (error) {
    console.error('Error calculating ETA:', error);
    return null;
  }
};

/**
 * Get status message based on ETA
 * 
 * @param {number} eta - ETA in minutes
 * @param {number} distance - Distance in km
 * @returns {string} Status message
 */
export const getStatusMessage = (eta, distance) => {
  if (eta === null || eta === undefined) {
    return 'Bus is currently stopped';
  }
  
  if (distance < 0.1) {
    return 'Bus has arrived at your location!';
  }
  
  if (eta < 1) {
    return 'Bus is arriving now!';
  }
  
  if (eta < 5) {
    return `Bus is ${Math.round(eta)} minutes away - Get ready!`;
  }
  
  if (eta < 10) {
    return `Bus will arrive in approximately ${Math.round(eta)} minutes`;
  }
  
  return `Bus is ${Math.round(eta)} minutes away`;
};

/**
 * Determine bus status based on speed
 * 
 * @param {number} speed - Current speed in km/h
 * @returns {string} Status (moving, stopped, delayed)
 */
export const getBusStatus = (speed) => {
  if (speed < 1) return 'stopped';
  if (speed < 10) return 'delayed';
  return 'moving';
};

/**
 * Format distance for display
 * 
 * @param {number} distance - Distance in km
 * @returns {string} Formatted distance
 */
export const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} meters`;
  }
  return `${distance.toFixed(2)} km`;
};

/**
 * Format ETA for display
 * 
 * @param {number} eta - ETA in minutes
 * @returns {string} Formatted ETA
 */
export const formatETA = (eta) => {
  if (eta === null || eta === undefined) {
    return 'Bus stopped';
  }
  
  if (eta < 1) {
    return 'Arriving now';
  }
  
  if (eta < 60) {
    return `${Math.round(eta)} min`;
  }
  
  const hours = Math.floor(eta / 60);
  const minutes = Math.round(eta % 60);
  return `${hours}h ${minutes}m`;
};

/**
 * Check if bus is within geofence radius
 * 
 * @param {Object} busLocation - Bus location
 * @param {Object} targetLocation - Target location
 * @param {number} radiusInMeters - Geofence radius in meters
 * @returns {boolean} True if bus is within radius
 */
export const isWithinGeofence = (busLocation, targetLocation, radiusInMeters = 500) => {
  try {
    const distanceInMeters = getDistance(
      { latitude: busLocation.latitude, longitude: busLocation.longitude },
      { latitude: targetLocation.latitude, longitude: targetLocation.longitude }
    );
    
    return distanceInMeters <= radiusInMeters;
  } catch (error) {
    console.error('Error checking geofence:', error);
    return false;
  }
};

/**
 * Calculate average speed from location history
 * 
 * @param {Array} locationHistory - Array of location objects with timestamp
 * @returns {number} Average speed in km/h
 */
export const calculateAverageSpeed = (locationHistory) => {
  if (!locationHistory || locationHistory.length < 2) {
    return 0;
  }
  
  try {
    let totalSpeed = 0;
    let count = 0;
    
    for (let i = 1; i < locationHistory.length; i++) {
      const prev = locationHistory[i - 1];
      const curr = locationHistory[i];
      
      const distance = calculateDistance(prev, curr);
      const timeDiff = (curr.timestamp - prev.timestamp) / 1000 / 3600; // hours
      
      if (timeDiff > 0) {
        const speed = distance / timeDiff;
        totalSpeed += speed;
        count++;
      }
    }
    
    return count > 0 ? totalSpeed / count : 0;
  } catch (error) {
    console.error('Error calculating average speed:', error);
    return 0;
  }
};
