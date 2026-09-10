/* eslint-disable no-console */
// Silence act() warnings from Headless UI transitions
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('not wrapped in act')
    ) {
      return;
    }
    originalError(...args);
  };
});
afterAll(() => {
  console.error = originalError;
});
// Mock ResizeObserver for jsdom
beforeAll(() => {
  global.ResizeObserver =
    global.ResizeObserver ||
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
});
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../src/Modal';

describe('Modal', () => {
  it('renders when open and displays title and children', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.getByTestId('common-modal')).toBeInTheDocument();
    expect(screen.getByTestId('common-modal-title')).toHaveTextContent('Test Modal');
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Close Test" showCloseButton={true}>
        <div>Content</div>
      </Modal>
    );
    fireEvent.click(screen.getByTestId('common-button-close-modal'));
    expect(handleClose).toHaveBeenCalled();
  });

  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="Hidden Modal">
        <div>Should not show</div>
      </Modal>
    );
    expect(screen.queryByTestId('common-modal')).not.toBeInTheDocument();
  });
});