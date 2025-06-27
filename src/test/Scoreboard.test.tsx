import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Scoreboard from '../components/Scoreboard';

// Mock the useWakeLock hook
vi.mock('../hooks/useWakeLock', () => ({
  useWakeLock: vi.fn(),
}));

describe('Scoreboard - Basic Functionality', () => {
  describe('Initial State', () => {
    it('should initialize with correct default values', () => {
      render(<Scoreboard />);
      
      // Should show initial timer (3 minutes = 03:00)
      expect(screen.getByText('03:00')).toBeInTheDocument();
      
      // Should show Pool match type
      expect(screen.getByText('POOL BOUT')).toBeInTheDocument();
      
      // Should show zero scores
      const scoreDisplays = screen.getAllByText('0');
      expect(scoreDisplays).toHaveLength(2);
      
      // Should show start button
      expect(screen.getByLabelText('start')).toBeInTheDocument();
    });
  });

  describe('Score Management', () => {
    it('should increment left fencer score', () => {
      render(<Scoreboard />);
      
      const leftIncrementButton = screen.getAllByLabelText('Increment score')[0];
      fireEvent.click(leftIncrementButton);
      
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getAllByText('1')).toHaveLength(1); // Only left fencer should have score 1
    });

    it('should increment right fencer score', () => {
      render(<Scoreboard />);
      
      const rightIncrementButton = screen.getAllByLabelText('Increment score')[1];
      fireEvent.click(rightIncrementButton);

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getAllByText('1')).toHaveLength(1); // Only right fencer should have score 1
    });

    it ('should increment both scores independently', () => {
      render(<Scoreboard />); 
      const leftIncrementButton = screen.getAllByLabelText('Increment score')[0];
      const rightIncrementButton = screen.getAllByLabelText('Increment score')[1];

      fireEvent.click(leftIncrementButton);
      fireEvent.click(rightIncrementButton);

      expect(screen.getAllByText('1')).toHaveLength(2); // Both fencers should have score 1
      screen.getAllByText('1').forEach(element => {
        expect(element).toBeInTheDocument();
      });
    });

    it('should decrement score', () => {
      render(<Scoreboard />);
      
      // First increment to 2
      const leftIncrementButton = screen.getAllByLabelText('Increment score')[0];
      fireEvent.click(leftIncrementButton);
      fireEvent.click(leftIncrementButton);
      
      expect(screen.getByText('2')).toBeInTheDocument();
      
      // Then decrement
      const leftDecrementButton = screen.getAllByLabelText('Decrement score')[0];
      fireEvent.click(leftDecrementButton);
      
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should not allow negative scores', () => {
      render(<Scoreboard />);
      
      const leftDecrementButton = screen.getAllByLabelText('Decrement score')[0];
      fireEvent.click(leftDecrementButton);
      
      // Both scores should remain at 0
      const scoreDisplays = screen.getAllByText('0');
      expect(scoreDisplays).toHaveLength(2);
    });

    it('should respect maximum score for pool matches', () => {
      render(<Scoreboard />);
      
      const leftIncrementButton = screen.getAllByLabelText('Increment score')[0];
      
      // Click 6 times (should max out at 5 for pool)
      for (let i = 0; i < 6; i++) {
        fireEvent.click(leftIncrementButton);
      }
      
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.queryByText('6')).not.toBeInTheDocument();
    });
  });

  describe('Settings and Match Types', () => {
    it('should have a settings button', () => {
      render(<Scoreboard />);
      
      const settingsButton = screen.getByLabelText('Settings');
      expect(settingsButton).toBeInTheDocument();
    });
  });

  describe('Timer Controls', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it('should display timer correctly', () => {
      render(<Scoreboard />);
      
      expect(screen.getByText('03:00')).toBeInTheDocument();
    });

    it('should have start and reset buttons', () => {
      render(<Scoreboard />);
      
      expect(screen.getByLabelText('start')).toBeInTheDocument();
      expect(screen.getByLabelText('reset')).toBeInTheDocument();
    });
  });
});