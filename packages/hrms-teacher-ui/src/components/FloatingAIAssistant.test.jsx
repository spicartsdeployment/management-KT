import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FloatingAIAssistant from './FloatingAIAssistant';

describe('FloatingAIAssistant', () => {
  it('should render without crashing', () => {
    render(<FloatingAIAssistant />);
    // Component should render the AI assistant button
    const button = screen.getByTestId('common-button-ai-assistant');
    expect(button).toBeInTheDocument();
  });

  it('should render AI assistant button with aria label', () => {
    render(<FloatingAIAssistant />);
    const button = screen.getByLabelText('AI Assistant');
    expect(button).toBeInTheDocument();
  });

  it('should render SVG icon inside button', () => {
    const { container } = render(<FloatingAIAssistant />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
