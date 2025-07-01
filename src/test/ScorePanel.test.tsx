import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ScorePanel from '../components/ScorePanel';

describe('ScorePanel', () => {
  const defaultProps = {
    side: 'left' as const,
    score: 0,
    maxScore: 5,
    cards: [],
    passivityCards: [],
    onScoreChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render score display and buttons', () => {
    render(<ScorePanel {...defaultProps} />);
    
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByLabelText('Increment score')).toBeInTheDocument();
    expect(screen.getByLabelText('Decrement score')).toBeInTheDocument();
  });

  it('should call onScoreChange when increment button is clicked', () => {
    render(<ScorePanel {...defaultProps} score={2} />);
    
    const incrementButton = screen.getByLabelText('Increment score');
    fireEvent.click(incrementButton);
    
    expect(defaultProps.onScoreChange).toHaveBeenCalledWith(3);
  });

  it('should call onScoreChange when decrement button is clicked', () => {
    render(<ScorePanel {...defaultProps} score={2} />);
    
    const decrementButton = screen.getByLabelText('Decrement score');
    fireEvent.click(decrementButton);
    
    expect(defaultProps.onScoreChange).toHaveBeenCalledWith(1);
  });

  it('should display fencer name when provided', () => {
    render(
      <ScorePanel 
        {...defaultProps} 
        fencerName="John Doe" 
      />
    );
    
    expect(screen.getByLabelText('Fencer name: John Doe')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should not display fencer name section when not provided', () => {
    render(<ScorePanel {...defaultProps} />);
    
    expect(screen.queryByLabelText(/Fencer name:/)).not.toBeInTheDocument();
  });

  it('should truncate long fencer names', () => {
    const longName = "A Very Long Fencer Name That Should Be Truncated";
    
    render(
      <ScorePanel 
        {...defaultProps} 
        fencerName={longName} 
      />
    );
    
    const nameElement = screen.getByLabelText(`Fencer name: ${longName}`);
    expect(nameElement).toHaveClass('truncate', 'max-w-24');
    expect(nameElement).toHaveAttribute('title', longName);
  });

  it('should display yellow cards', () => {
    render(
      <ScorePanel 
        {...defaultProps} 
        cards={['yellow', 'yellow']} 
      />
    );
    
    const yellowCards = screen.getAllByRole('generic').filter(
      el => el.classList.contains('bg-yellow-500')
    );
    expect(yellowCards).toHaveLength(2);
  });

  it('should display red cards', () => {
    render(
      <ScorePanel 
        {...defaultProps} 
        cards={['red']} 
      />
    );
    
    const redCards = screen.getAllByRole('generic').filter(
      el => el.classList.contains('bg-red-500')
    );
    expect(redCards).toHaveLength(1);
  });

  it('should display mixed card types', () => {
    render(
      <ScorePanel 
        {...defaultProps} 
        cards={['yellow', 'red', 'yellow']} 
      />
    );
    
    const yellowCards = screen.getAllByRole('generic').filter(
      el => el.classList.contains('bg-yellow-500')
    );
    const redCards = screen.getAllByRole('generic').filter(
      el => el.classList.contains('bg-red-500')
    );
    
    expect(yellowCards).toHaveLength(2);
    expect(redCards).toHaveLength(1);
  });

});