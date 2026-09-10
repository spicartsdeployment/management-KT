import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BusTracking from './BusTracking';
import * as BusTrackingImpl from './hooks/useBusTracking';

jest.mock('./hooks/useBusTracking', () => ({
  useBusTracking: jest.fn(),
}));

// Mock map component
/* eslint-disable react/prop-types */
jest.mock('../../components/MapView', () => {
  const MockMapView = ({ buses }) => (
    <div data-testid="school-map-view">
      {buses.map(bus => (
        <div 
          key={bus.id} 
          data-testid={`mock-bus-${bus.id}`}
        >
          Bus {bus.id}
        </div>
      ))}
    </div>
  );
  MockMapView.displayName = 'MockMapView';
  return MockMapView;
});

// Mock card component
jest.mock('@school-hrms/common-components/Card', () => {
  const MockCard = ({ children, className, ...props }) => (
    <div className={className} {...props}>
      {children}
    </div>
  );
  MockCard.displayName = 'MockCard';
  return MockCard;
});
/* eslint-enable react/prop-types */

/* eslint-disable max-lines-per-function */
describe('BusTracking Component', () => {
  const mockBuses = [
    {
      id: 'BUS001',
      route: 'Route A',
      lat: 17.502184,
      lng: 78.394876,
      speed: 35,
      status: 'on-route'
    },
    {
      id: 'BUS002',
      route: 'Route B',
      lat: 17.512184,
      lng: 78.404876,
      speed: 40,
      status: 'on-route'
    }
  ];

  const mockState = {
    buses: mockBuses,
    liveTracking: {
      pickupTime: '08:15:00',
      dropTime: '08:45:00',
    },
    currentStatus: {
      busNumber: 'BUS001',
      status: 'on-route',
      route: 'Route A',
      nextStop: 'Main Street'
    },
    driverInfo: {
      name: 'John Doe',
      license: 'DL12345',
      yearsOfExperience: 10,
      isVerified: true,
      avatar: null,
      phone: '+1-234-567-8900'
    },
    transportIncharge: {
      id: 'TI-2023-001',
      name: 'David Martinez',
      role: 'Transport Coordinator',
      phone: '+1-234-567-8900',
      yearsOfExperience: 15,
      availability: 'Available 24/7',
      isVerified: true,
      staffId: 'TI-2023-001'
    },
    emergencyContact: {
      id: 'EC-001',
      name: 'Emergency Services',
      number: '+1-234-567-8999',
      available24x7: true
    },
    supportStaff: [
      {
        id: 'STAFF001',
        name: 'Jane Smith',
        role: 'Attendant',
        certification: 'First Aid'
      }
    ],
    dailyPerformance: {
      metrics: [
        { id: 1, label: 'On Time', value: '98%', bgColor: 'bg-green-50', textColor: 'text-green-700' },
        { id: 2, label: 'Distance', value: '45km', bgColor: 'bg-blue-50', textColor: 'text-blue-700' }
      ],
      statusIcon: '✓',
      statusMessage: 'Excellent Performance'
    },
    safetyAlerts: [
      {
        id: 1,
        title: 'All Clear',
        message: 'No safety issues',
        icon: '✓',
        bgColor: 'bg-green-50',
        iconBg: 'bg-green-500',
        textColor: 'text-green-700'
      }
    ],
    weeklyAnalytics: {
      stats: [
        { id: 1, label: 'Avg Speed', value: '35 km/h', textColor: 'text-blue-700' },
        { id: 2, label: 'Distance', value: '225 km', textColor: 'text-green-700' }
      ]
    },
    routeSchedule: [
      { id: 1, stopNumber: 1, name: 'Start Point', time: '08:00', status: 'completed' },
      { id: 2, stopNumber: 2, name: 'Main Street', time: '08:15', status: 'current' },
      { id: 3, stopNumber: 3, name: 'School', time: '08:30', status: 'pending', isDestination: true }
    ],
    isLoading: false,
    error: null,
    selectedBus: null
  };

  const mockHandlers = {
    handleBusClick: jest.fn(),
    handleCallDriver: jest.fn(),
    handleEmergencySOS: jest.fn(),
    handleViewReport: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(BusTrackingImpl, 'useBusTracking').mockReturnValue({
      state: mockState,
      dispatch: jest.fn(),
      handlers: mockHandlers
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render main container with correct data-testid', () => {
      render(<BusTracking />);
      expect(screen.getByTestId('school-container-bus-tracking')).toBeInTheDocument();
    });

    it('should render page header with title and subtitle', () => {
      render(<BusTracking />);
      expect(screen.getByTestId('school-text-page-title')).toHaveTextContent('Transportation');
      expect(screen.getByTestId('school-text-page-subtitle')).toBeInTheDocument();
    });

    it('should render all three panels (left, center, right)', () => {
      render(<BusTracking />);
      expect(screen.getByTestId('school-panel-left')).toBeInTheDocument();
      expect(screen.getByTestId('school-panel-center')).toBeInTheDocument();
      expect(screen.getByTestId('school-panel-right')).toBeInTheDocument();
    });

    it('should render all required cards', () => {
      render(<BusTracking />);
      expect(screen.getByTestId('school-card-current-status')).toBeInTheDocument();
      expect(screen.getByTestId('school-card-driver-info')).toBeInTheDocument();
      expect(screen.getByTestId('school-card-support-staff')).toBeInTheDocument();
      expect(screen.getByTestId('school-card-live-location')).toBeInTheDocument();
      expect(screen.getByTestId('school-card-route-schedule')).toBeInTheDocument();
      expect(screen.getByTestId('school-card-daily-performance')).toBeInTheDocument();
      expect(screen.getByTestId('school-card-safety-alerts')).toBeInTheDocument();
      expect(screen.getByTestId('school-card-weekly-analytics')).toBeInTheDocument();
    });
  });

  describe('Current Status Card', () => {
    it('should display bus number and route', () => {
      render(<BusTracking />);
      expect(screen.getByTestId('school-text-bus-number')).toHaveTextContent('BUS001');
      expect(screen.getByTestId('school-text-bus-route')).toHaveTextContent('Route A');
    });

    it('should display next stop information', () => {
      render(<BusTracking />);
      expect(screen.getByTestId('school-text-next-stop')).toHaveTextContent('Next Stop: Main Street');
    });

    it('should render status badge with correct data-testid', () => {
      render(<BusTracking />);
      expect(screen.getByTestId('school-badge-bus-status')).toBeInTheDocument();
      expect(screen.getByTestId('school-icon-bus-status')).toBeInTheDocument();
    });
  });

  describe('Driver Information Card', () => {
    it('should display driver name and license', () => {
      render(<BusTracking />);
      expect(screen.getByTestId('school-text-driver-name')).toHaveTextContent('John Doe');
      expect(screen.getByTestId('school-text-driver-license')).toHaveTextContent('License: DL12345');
    });

    it('should display driver experience', () => {
      render(<BusTracking />);
      expect(screen.getByTestId('school-text-driver-experience')).toHaveTextContent('10 years experience');
    });

    it('should show verified badge when driver is verified', () => {
      render(<BusTracking />);
      expect(screen.getByTestId('school-badge-driver-verified')).toHaveTextContent('Verified Driver');
    });

    // it('should call handleCallDriver when call button is clicked', () => {
    //   render(<BusTracking />);
    //   const callButton = screen.getByTestId('school-button-call-driver');
    //   fireEvent.click(callButton);
    //   expect(mockHandlers.handleCallDriver).toHaveBeenCalledTimes(1);
    // });
  });

  describe('Support Staff Card', () => {
    it('should render all support staff members', () => {
      render(<BusTracking />);
      expect(screen.getByTestId('school-item-support-0')).toBeInTheDocument();
      expect(screen.getByTestId('school-text-staff-name-0')).toHaveTextContent('Jane Smith');
      expect(screen.getByTestId('school-text-staff-role-0')).toHaveTextContent('Attendant');
    });

    it('should display certification badge', () => {
      render(<BusTracking />);
      expect(screen.getByTestId('school-badge-staff-cert-0')).toHaveTextContent('First Aid');
    });
  });

  describe('Live Location & Timing Card', () => {
    it('should render pickup and drop time cards', () => {
      render(<BusTracking />);
      expect(screen.getByTestId('school-card-pickup-time')).toBeInTheDocument();
      expect(screen.getByTestId('school-card-drop-time')).toBeInTheDocument();
    });

    it('should display correct timing values', () => {
      render(<BusTracking />);
      expect(screen.getByTestId('school-text-pickup-time')).toHaveTextContent('08:15');
      expect(screen.getByTestId('school-text-drop-time')).toHaveTextContent('08:45');
    });

    it('should render map container', () => {
      render(<BusTracking />);
      expect(screen.getByTestId('school-container-map')).toBeInTheDocument();
      expect(screen.getByTestId('school-map-view')).toBeInTheDocument();
    });

    it('should pass buses to MapView component', () => {
      render(<BusTracking />);
      expect(screen.getByTestId('mock-bus-BUS001')).toBeInTheDocument();
      expect(screen.getByTestId('mock-bus-BUS002')).toBeInTheDocument();
    });
  });

  describe('Route Schedule Card', () => {
    it('should render route stops', () => {
      render(<BusTracking />);
      expect(screen.getByTestId('school-item-route-stop-0')).toBeInTheDocument();
      expect(screen.getByTestId('school-item-route-stop-1')).toBeInTheDocument();
      expect(screen.getByTestId('school-item-route-stop-2')).toBeInTheDocument();
    });

    it('should display stop names and times', () => {
      render(<BusTracking />);
      expect(screen.getByTestId('school-text-stop-name-0')).toHaveTextContent('Start Point');
      expect(screen.getByTestId('school-text-stop-time-0')).toHaveTextContent('08:00');
    });

    it('should render correct icons based on stop status', () => {
      render(<BusTracking />);
      expect(screen.getByTestId('school-icon-stop-0')).toBeInTheDocument();
      expect(screen.getByTestId('school-icon-stop-1')).toBeInTheDocument();
      expect(screen.getByTestId('school-icon-stop-2')).toBeInTheDocument();
    });
  });

  describe('Daily Performance Card', () => {
    it('should render performance metrics', () => {
      render(<BusTracking />);
      expect(screen.getByTestId('school-card-metric-0')).toBeInTheDocument();
      expect(screen.getByTestId('school-text-metric-value-0')).toHaveTextContent('98%');
      expect(screen.getByTestId('school-text-metric-label-0')).toHaveTextContent('On Time');
    });

    it('should display status message', () => {
      render(<BusTracking />);
      expect(screen.getByTestId('school-badge-performance-status')).toHaveTextContent('Excellent Performance');
    });
  });

  describe('Safety & Alerts Card', () => {
    it('should render safety alerts', () => {
      render(<BusTracking />);
      expect(screen.getByTestId('school-item-alert-0')).toBeInTheDocument();
      expect(screen.getByTestId('school-text-alert-title-0')).toHaveTextContent('All Clear');
      expect(screen.getByTestId('school-text-alert-message-0')).toHaveTextContent('No safety issues');
    });

    it('should render emergency SOS button', () => {
      render(<BusTracking />);
      const sosButton = screen.getByTestId('school-button-emergency-sos');
      expect(sosButton).toBeInTheDocument();
      expect(sosButton).toHaveTextContent('Emergency SOS');
    });

    // it('should call handleEmergencySOS when button is clicked', () => {
    //   render(<BusTracking />);
    //   const sosButton = screen.getByTestId('school-button-emergency-sos');
    //   fireEvent.click(sosButton);
    //   expect(mockHandlers.handleEmergencySOS).toHaveBeenCalledTimes(1);
    // });
  });

  describe('Weekly Analytics Card', () => {
    it('should render analytics stats', () => {
      render(<BusTracking />);
      expect(screen.getByTestId('school-item-stat-0')).toBeInTheDocument();
      expect(screen.getByTestId('school-text-stat-label-0')).toHaveTextContent('Avg Speed');
      expect(screen.getByTestId('school-text-stat-value-0')).toHaveTextContent('35 km/h');
    });

    // it('should render view report button', () => {
    //   render(<BusTracking />);
    //   const reportButton = screen.getByTestId('school-button-view-report');
    //   expect(reportButton).toBeInTheDocument();
    //   expect(reportButton).toHaveTextContent('View Full Report');
    // });

    // it('should call handleViewReport when button is clicked', () => {
    //   render(<BusTracking />);
    //   const reportButton = screen.getByTestId('school-button-view-report');
    //   fireEvent.click(reportButton);
    //   expect(mockHandlers.handleViewReport).toHaveBeenCalledTimes(1);
    // });
  });

  describe('Accessibility', () => {
    it('should have aria-label on call driver button', () => {
      render(<BusTracking />);
      const callButton = screen.getByTestId('school-button-call-driver');
      expect(callButton).toHaveAttribute('aria-label', 'Call Driver');
    });

    it('should have aria-label on emergency button', () => {
      render(<BusTracking />);
      const sosButton = screen.getByTestId('school-button-emergency-sos');
      expect(sosButton).toHaveAttribute('aria-label', 'Emergency SOS');
    });

    // it('should have aria-label on view report button', () => {
    //   render(<BusTracking />);
    //   const reportButton = screen.getByTestId('school-button-view-report');
    //   expect(reportButton).toHaveAttribute('aria-label', 'View Full Report');
    // });
  });

  describe('Data Test IDs', () => {
    it('should have data-testid attributes on all interactive elements', () => {
      render(<BusTracking />);
      
      // Buttons
      expect(screen.getByTestId('school-button-call-driver')).toBeInTheDocument();
      expect(screen.getByTestId('school-button-emergency-sos')).toBeInTheDocument();
      // expect(screen.getByTestId('school-button-view-report')).toBeInTheDocument();
      
      // Cards
      expect(screen.getByTestId('school-card-current-status')).toBeInTheDocument();
      expect(screen.getByTestId('school-card-driver-info')).toBeInTheDocument();
      expect(screen.getByTestId('school-card-support-staff')).toBeInTheDocument();
      
      // Text elements
      expect(screen.getByTestId('school-text-page-title')).toBeInTheDocument();
      expect(screen.getByTestId('school-text-bus-number')).toBeInTheDocument();
      expect(screen.getByTestId('school-text-driver-name')).toBeInTheDocument();
    });
  });
});
