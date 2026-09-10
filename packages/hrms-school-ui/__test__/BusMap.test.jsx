
jest.mock('react-leaflet', () => {
  const React = require('react');
  const PropTypes = require('prop-types');
  const MockMapContainer = React.forwardRef(({ children }, ref) => <div ref={ref} data-testid="school-map-leaflet-container">{children}</div>);
  MockMapContainer.propTypes = { children: PropTypes.node };
  const MockMarker = React.forwardRef(({ children }, ref) => <div ref={ref} data-testid="marker">{children}</div>);
  MockMarker.propTypes = { children: PropTypes.node };
  const MockPopup = React.forwardRef(({ children }, ref) => <div ref={ref} data-testid="popup">{children}</div>);
  MockPopup.propTypes = { children: PropTypes.node };
  return {
    MapContainer: MockMapContainer,
    TileLayer: () => <div>TileLayer</div>,
    Marker: MockMarker,
    Popup: MockPopup,
    useMap: () => ({ setView: jest.fn() })
  };
});

jest.mock('leaflet', () => ({
  divIcon: jest.fn(() => ({})),
  Icon: { Default: { prototype: {}, mergeOptions: jest.fn() } }
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import BusMap from '../src/components/BusMap';

describe('BusMap', () => {
  const busLocation = { latitude: 17.5, longitude: 78.4, speed: 40 };
  const prevBusLocation = { latitude: 17.49, longitude: 78.39, speed: 35 };
  const pickupLocation = { latitude: 17.48, longitude: 78.39, name: 'My Stop' };

  it('renders map container and markers', () => {
    render(
      <BusMap
        busLocation={busLocation}
        prevBusLocation={prevBusLocation}
        pickupLocation={pickupLocation}
        distance={2.5}
        eta={10}
        status="moving"
      />
    );
    expect(screen.getByTestId('school-busmap-container')).toBeInTheDocument();
    expect(screen.getByTestId('school-map-leaflet-container')).toBeInTheDocument();
    expect(screen.getAllByTestId('marker').length).toBeGreaterThanOrEqual(2); // bus + pickup
    expect(screen.getAllByTestId('popup').length).toBeGreaterThanOrEqual(2);
  });

  it('renders with default locations if no props provided', () => {
    render(<BusMap />);
    expect(screen.getByTestId('school-busmap-container')).toBeInTheDocument();
    expect(screen.getByTestId('school-map-leaflet-container')).toBeInTheDocument();
  });

  it('shows ETA and distance in popup', () => {
    render(
      <BusMap
        busLocation={busLocation}
        prevBusLocation={prevBusLocation}
        pickupLocation={pickupLocation}
        distance={3.2}
        eta={7}
        status="delayed"
      />
    );
    expect(screen.getByText(/ETA: 7 minutes/)).toBeInTheDocument();
    expect(screen.getByText(/Distance:/)).toBeInTheDocument();
  });
});
