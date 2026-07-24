import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SubmitConfirmationModal from '../components/SubmitConfirmationModal';

describe('SubmitConfirmationModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    leftFencerName: 'Alice',
    rightFencerName: 'Bob',
    leftScore: 5,
    rightScore: 3,
    suggestedWinner: 'Alice',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function getWinnerDisplay() {
    const winnerLabel = screen.getByText('Winner');
    return within(winnerLabel.closest('div')!.parentElement!);
  }

  it('should display the suggested winner', () => {
    render(<SubmitConfirmationModal {...defaultProps} />);
    expect(getWinnerDisplay().getByText('Alice')).toBeInTheDocument();
  });

  it('should allow switching the winner without being overwritten on re-render', () => {
    const { rerender } = render(<SubmitConfirmationModal {...defaultProps} />);

    fireEvent.click(screen.getByText('Switch'));
    expect(getWinnerDisplay().getByText('Bob')).toBeInTheDocument();

    rerender(<SubmitConfirmationModal {...defaultProps} suggestedWinner="Alice" />);
    expect(getWinnerDisplay().getByText('Bob')).toBeInTheDocument();
  });

  it('should reset selectedWinner when suggestedWinner prop changes', () => {
    const { rerender } = render(<SubmitConfirmationModal {...defaultProps} />);

    fireEvent.click(screen.getByText('Switch'));
    expect(getWinnerDisplay().getByText('Bob')).toBeInTheDocument();

    rerender(<SubmitConfirmationModal {...defaultProps} suggestedWinner="Bob" />);
    expect(getWinnerDisplay().getByText('Bob')).toBeInTheDocument();

    rerender(<SubmitConfirmationModal {...defaultProps} suggestedWinner="Alice" />);
    expect(getWinnerDisplay().getByText('Alice')).toBeInTheDocument();
  });

  it('should not render when isOpen is false', () => {
    render(<SubmitConfirmationModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Confirm Match Result')).not.toBeInTheDocument();
  });

  it('should call onConfirm with the selected winner', () => {
    render(<SubmitConfirmationModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Confirm & Submit'));
    expect(defaultProps.onConfirm).toHaveBeenCalledWith('Alice');
  });

  it('should call onConfirm with switched winner after switching', () => {
    render(<SubmitConfirmationModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Switch'));
    fireEvent.click(screen.getByText('Confirm & Submit'));
    expect(defaultProps.onConfirm).toHaveBeenCalledWith('Bob');
  });
});
