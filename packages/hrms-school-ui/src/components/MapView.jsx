import React, { useEffect, useRef } from 'react';
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
 * Create custom bus icon with status-based colors
 * @param {string} status - Bus status (active, warning, success)
 * @returns {L.DivIcon} Leaflet div icon
 */
const createBusIcon = (status = 'active') => {
  const color = status === 'active' ? '#3b82f6' : status === 'warning' ? '#f59e0b' : '#10b981';
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
 * Component to handle map bounds when buses update
 */
const MapController = ({ buses }) => {
  const map = useMap();
  
  useEffect(() => {
    if (buses && buses.length > 0) {
      const bounds = buses.map(bus => [bus.lat, bus.lng]);
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      }
    }
  }, [buses, map]);

  return null;
};

/**
 * MapView Component
 * Displays real-time bus locations on an interactive map
 * 
 * @param {Array} buses - Array of bus objects with lat, lng, and other properties
 * @param {Function} onBusClick - Callback when bus marker is clicked
 */
const MapView = ({ buses = [], onBusClick }) => {
  const mapRef = useRef(null);
  const center = buses.length > 0 ? [buses[0].lat, buses[0].lng] : [17.502184, 78.394876];

  const handleMarkerClick = (bus) => {
    if (onBusClick) {
      onBusClick(bus);
    }
  };

  return (
    <div className="mapview-container">
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
        .custom-bus-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-container {
          height: 100%;
          width: 100%;
          z-index: 1;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
        }
      `}</style>
      <MapContainer 
        center={center} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        data-testid="school-map-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController buses={buses} />
        
        {buses.map((bus) => (
          <Marker 
            key={bus.id} 
            position={[bus.lat, bus.lng]}
            icon={createBusIcon(bus.status || 'active')}
            eventHandlers={{
              click: () => handleMarkerClick(bus)
            }}
          >
            <Popup>
              <div className="mapview-popup">
                <h3 className="mapview-popup-title">{bus.name || `Bus ${bus.id}`}</h3>
                <div className="mapview-popup-details">
                  <p><span className="mapview-popup-label">Route:</span> {bus.route}</p>
                  <p><span className="mapview-popup-label">Speed:</span> {bus.speed} km/h</p>
                  {bus.driver && <p><span className="mapview-popup-label">Driver:</span> {bus.driver}</p>}
                  {bus.nextStop && <p><span className="mapview-popup-label">Next Stop:</span> {bus.nextStop}</p>}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
