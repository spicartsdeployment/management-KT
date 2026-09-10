
jest.mock('react-leaflet', () => {
  const React = require('react');
  const PropTypes = require('prop-types');
  const MockMapContainer = React.forwardRef(({ children }, ref) => <div ref={ref} data-testid="school-map-container">{children}</div>);
  MockMapContainer.propTypes = { children: PropTypes.node };
  const MockMarker = React.forwardRef(({ children, eventHandlers }, ref) => <div ref={ref} data-testid="marker" onClick={eventHandlers?.click}>{children}</div>);
  MockMarker.propTypes = {
    children: PropTypes.node,
    eventHandlers: PropTypes.any
  };
  const MockPopup = React.forwardRef(({ children }, ref) => <div ref={ref} data-testid="popup">{children}</div>);
  MockPopup.propTypes = { children: PropTypes.node };
  return {
    MapContainer: MockMapContainer,
    TileLayer: () => <div>TileLayer</div>,
    Marker: MockMarker,
    Popup: MockPopup,
    useMap: () => ({ fitBounds: jest.fn() })
  };
});

jest.mock('leaflet', () => ({
  divIcon: jest.fn(() => ({})),
  Icon: { Default: { prototype: {}, mergeOptions: jest.fn() } }
}));

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MapView from '../src/components/MapView';

describe('MapView', () => {
  const buses = [
    { id: 1, lat: 17.5, lng: 78.4, name: 'Bus 1', route: 'A', speed: 40, status: 'active', driver: 'John', nextStop: 'Stop 1' },
    { id: 2, lat: 17.51, lng: 78.41, name: 'Bus 2', route: 'B', speed: 35, status: 'warning', driver: 'Jane', nextStop: 'Stop 2' }
  ];

  it('renders map container and markers', () => {
    render(<MapView buses={buses} />);
    expect(screen.getByTestId('school-map-container')).toBeInTheDocument();
    expect(screen.getAllByTestId('marker').length).toBe(2);
    expect(screen.getAllByTestId('popup').length).toBe(2);
  });

  it('renders with no buses', () => {
    render(<MapView />);
    expect(screen.getByTestId('school-map-container')).toBeInTheDocument();
  });

  it('calls onBusClick when marker is clicked', () => {
    const handleBusClick = jest.fn();
    render(<MapView buses={buses} onBusClick={handleBusClick} />);
    const markers = screen.getAllByTestId('marker');
    fireEvent.click(markers[0]);
    expect(handleBusClick).toHaveBeenCalledWith(buses[0]);
  });
});
