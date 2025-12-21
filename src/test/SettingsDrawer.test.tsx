import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SettingsDrawer from '../components/SettingsDrawer';

describe('SettingsDrawer', () => {
    const defaultProps = {
        isOpen: true,
        onClose: vi.fn(),
        matchType: 'pool' as const,
        onMatchTypeChange: vi.fn(),
        onAddCard: vi.fn(),
        onAddPassivityCards: vi.fn(),
        hasYellowPassivityCard: false,
        hasRedPassivityCard: false,
        isEliminationMatch: false,
        isTeamMatch: false,
        timeRemaining: 180,
        onTimeChange: vi.fn(),
        deviceName: null,
        onClearIdentity: vi.fn(),
    };

    it('should call onClose when adding a card (Left Fencer)', () => {
        render(<SettingsDrawer {...defaultProps} />);

        const yellowCardBtn = screen.getAllByText('Yellow Card')[0];
        fireEvent.click(yellowCardBtn);

        expect(defaultProps.onAddCard).toHaveBeenCalledWith('left', 'yellow');
        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('should call onClose when adding a card (Right Fencer)', () => {
        render(<SettingsDrawer {...defaultProps} />);

        const yellowButtons = screen.getAllByText('Yellow Card');
        const rightYellowBtn = yellowButtons[1]; // 0 is Left, 1 is Right

        fireEvent.click(rightYellowBtn);

        expect(defaultProps.onAddCard).toHaveBeenCalledWith('right', 'yellow');
        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('should call onClose when adding a passivity card', () => {
        const props = {
            ...defaultProps,
            isEliminationMatch: true, // Needed to show passivity cards
        };
        render(<SettingsDrawer {...props} />);

        const pYellowBtn = screen.getByText('P-Yellow');
        fireEvent.click(pYellowBtn);

        expect(defaultProps.onAddPassivityCards).toHaveBeenCalledWith('pYellow');
        expect(defaultProps.onClose).toHaveBeenCalled();
    });
});
