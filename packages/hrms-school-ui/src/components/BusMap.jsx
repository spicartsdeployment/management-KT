import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

/**
 * Create custom animated bus icon
 * @param {string} status - Bus status (moving, stopped, delayed)
 * @returns {L.DivIcon} Leaflet div icon
 */
const createBusIcon = (status = 'moving') => {
  const colorMap = {
    moving: '#10b981',
    stopped: '#f59e0b',
    delayed: '#ef4444'
  };
  const color = colorMap[status] || colorMap.moving;
  
  return L.divIcon({
    className: 'custom-bus-marker',
    html: `
      <div style="position: relative;">
        <div style="
          width: 40px;
          height: 40px;
          background: ${color};
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          animation: pulse 2s infinite;
        ">
          🚌
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });
};

/**
 * Create custom pickup location icon
 * @returns {L.DivIcon} Leaflet div icon
 */
const createPickupIcon = () => {
  return L.divIcon({
    className: 'custom-pickup-marker',
    html: `
      <div style="
        width: 35px;
        height: 35px;
        background: #3b82f6;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
      ">
        📍
      </div>
    `,
    iconSize: [35, 35],
    iconAnchor: [17.5, 17.5],
    popupAnchor: [0, -17.5]
  });
};

/**
 * Component to smoothly animate marker position
 * Uses requestAnimationFrame for smooth 60fps updates
 */
const AnimatedMarker = ({ position, prevPosition, icon, popupContent }) => {
  const markerRef = useRef(null);
  const [currentPos, setCurrentPos] = useState(position);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  const ANIMATION_DURATION = 1000; // 1 second smooth transition

  useEffect(() => {
    // If no previous position or positions are the same, just set current position
    if (!prevPosition || (prevPosition[0] === position[0] && prevPosition[1] === position[1])) {
      setCurrentPos(position);
      return;
    }

    // Cancel any ongoing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    startTimeRef.current = Date.now();
    const startLat = currentPos[0];
    const startLng = currentPos[1];
    const endLat = position[0];
    const endLng = position[1];

    // Smooth interpolation using easeInOutQuad
    const easeInOutQuad = (t) => {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
      const easedProgress = easeInOutQuad(progress);

      const newLat = startLat + (endLat - startLat) * easedProgress;
      const newLng = startLng + (endLng - startLng) * easedProgress;

      setCurrentPos([newLat, newLng]);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [position, prevPosition]);

  return (
    <Marker 
      ref={markerRef}
      position={currentPos}
      icon={icon}
    >
      <Popup>
        <div className="mapview-popup">
          {popupContent}
        </div>
      </Popup>
    </Marker>
  );
};

/**
 * Component to auto-center map on bus location
 */
const MapCenterController = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom, { animate: true, duration: 0.5 });
    }
  }, [center, zoom, map]);

  return null;
};

/**
 * BusMap Component - Displays live bus tracking with smooth animations
 * 
 * @param {Object} busLocation - Current bus location { latitude, longitude, speed }
 * @param {Object} prevBusLocation - Previous bus location for smooth animation
 * @param {Object} pickupLocation - Fixed pickup location { latitude, longitude, name }
 * @param {number} distance - Distance in km
 * @param {number} eta - ETA in minutes
 * @param {string} status - Bus status (moving, stopped, delayed)
 */
const BusMap = ({ 
  busLocation, 
  prevBusLocation,
  pickupLocation,
  distance,
  eta,
  status = 'moving'
}) => {
  const [mapCenter, setMapCenter] = useState([17.502184, 78.394876]);
  const [mapZoom, setMapZoom] = useState(14);

  useEffect(() => {
    if (busLocation && busLocation.latitude && busLocation.longitude) {
      setMapCenter([busLocation.latitude, busLocation.longitude]);
    }
  }, [busLocation]);

  // Fallback to default location if no bus location
  const busPos = busLocation && busLocation.latitude && busLocation.longitude
    ? [busLocation.latitude, busLocation.longitude]
    : [17.502184, 78.394876];

  const prevBusPos = prevBusLocation && prevBusLocation.latitude && prevBusLocation.longitude
    ? [prevBusLocation.latitude, prevBusLocation.longitude]
    : busPos;

  const pickupPos = pickupLocation && pickupLocation.latitude && pickupLocation.longitude
    ? [pickupLocation.latitude, pickupLocation.longitude]
    : [17.485837, 78.389164]; // Default pickup location

  return (
    <div className="busmap-container" data-testid="school-busmap-container">
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
        .custom-bus-marker,
        .custom-pickup-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-container {
          height: 100%;
          width: 100%;
          z-index: 1;
          border-radius: 12px;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .mapview-popup {
          padding: 8px;
        }
        .mapview-popup-title {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 8px 0;
        }
        .mapview-popup-details {
          font-size: 13px;
          color: #4b5563;
        }
        .mapview-popup-details p {
          margin: 4px 0;
        }
        .mapview-popup-label {
          font-weight: 600;
          color: #1f2937;
        }
        .mapview-popup-eta {
          margin-top: 8px;
          padding: 6px 10px;
          background: #dbeafe;
          border-radius: 6px;
          color: #1e40af;
          font-weight: 600;
          text-align: center;
        }
        .busmap-container {
          height: 285px;
          min-height: 285px;
          width: 100%;
          position: relative;
          border-radius: 12px;
          overflow: hidden;
        }
      `}</style>
      
      <MapContainer 
        center={mapCenter} 
        zoom={mapZoom} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        data-testid="school-map-leaflet-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapCenterController center={mapCenter} zoom={mapZoom} />
        
        {/* Animated Bus Marker */}
        <AnimatedMarker
          position={busPos}
          prevPosition={prevBusPos}
          icon={createBusIcon(status)}
          popupContent={
            <>
              <h3 className="mapview-popup-title">🚌 School Bus</h3>
              <div className="mapview-popup-details">
                <p><span className="mapview-popup-label">Speed:</span> {busLocation?.speed || 0} km/h</p>
                <p><span className="mapview-popup-label">Status:</span> {status}</p>
                <p><span className="mapview-popup-label">Distance:</span> {distance?.toFixed(2) || '0.00'} km</p>
              </div>
              {eta !== null && eta !== undefined && (
                <div className="mapview-popup-eta">
                  ETA: {Math.round(eta)} minutes
                </div>
              )}
            </>
          }
        />

        {/* Pickup Location Marker */}
        <Marker 
          position={pickupPos}
          icon={createPickupIcon()}
        >
          <Popup>
            <div className="mapview-popup">
              <h3 className="mapview-popup-title">📍 Pickup Location</h3>
              <div className="mapview-popup-details">
                <p>{pickupLocation?.name || 'Your Pickup Point'}</p>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default BusMap;
