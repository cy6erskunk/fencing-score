import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import QRScannerModal from '../components/QRScannerModal';

describe('QRScannerModal', () => {
  const mockOnClose = vi.fn();
  const mockOnScanSuccess = vi.fn();
  const mockOnScanError = vi.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onScanSuccess: mockOnScanSuccess,
    onScanError: mockOnScanError,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Suppress console.error for scanner initialization errors
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should not render when closed', () => {
    render(
      <QRScannerModal
        {...defaultProps}
        isOpen={false}
      />
    );

    expect(screen.queryByText('Scan QR Code')).not.toBeInTheDocument();
  });

  it('should render modal when open', () => {
    render(<QRScannerModal {...defaultProps} />);

    const modal = screen.getByRole('dialog', { name: 'Scan QR Code' });
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText('Position the QR code within the frame to scan')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    render(<QRScannerModal {...defaultProps} />);

    const closeButton = screen.getByLabelText('Close QR scanner');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should display video element for camera feed', () => {
    render(<QRScannerModal {...defaultProps} />);

    // Check for video element by tag name since it doesn't have a specific role
    const video = document.querySelector('video');
    expect(video).toBeInTheDocument();
  });

  it('should handle QR scanner initialization without errors', async () => {
    render(<QRScannerModal {...defaultProps} />);
    
    // Component should render successfully even with mocked QR scanner
    const modal = screen.getByRole('dialog', { name: 'Scan QR Code' });
    expect(modal).toBeInTheDocument();
  });
});