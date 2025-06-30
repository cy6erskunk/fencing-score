import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { submitMatchResult } from '../utils/api';
import type { QRMatchResult } from '../types';

describe('API Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock console.error to suppress expected error logs in tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('submitMatchResult', () => {
    it('should successfully submit match result', async () => {
      const mockResult: QRMatchResult = {
        matchId: 'match-123',
        player1_hits: 5,
        player2_hits: 3,
        winner: 'player1'
      };

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true })
      };

      globalThis.fetch = vi.fn().mockResolvedValue(mockResponse);

      await submitMatchResult('https://api.tournament.com/submit', mockResult);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.tournament.com/submit',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mockResult),
        }
      );
    });

    it('should throw error for failed HTTP response', async () => {
      const mockResult: QRMatchResult = {
        matchId: 'match-123',
        player1_hits: 5,
        player2_hits: 3,
        winner: 'player1'
      };

      const mockResponse = {
        ok: false,
        status: 500
      };

      globalThis.fetch = vi.fn().mockResolvedValue(mockResponse);

      await expect(
        submitMatchResult('https://api.tournament.com/submit', mockResult)
      ).rejects.toThrow('HTTP error! status: 500');
    });

    it('should throw error for network failure', async () => {
      const mockResult: QRMatchResult = {
        matchId: 'match-123',
        player1_hits: 5,
        player2_hits: 3,
        winner: 'player1'
      };

      globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      await expect(
        submitMatchResult('https://api.tournament.com/submit', mockResult)
      ).rejects.toThrow('Network error');
    });

    it('should handle scenario with equal scores', async () => {
      const mockResult: QRMatchResult = {
        matchId: 'match-123',
        player1_hits: 4,
        player2_hits: 4,
        winner: 'player1'
      };

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true })
      };

      globalThis.fetch = vi.fn().mockResolvedValue(mockResponse);

      await submitMatchResult('https://api.tournament.com/submit', mockResult);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.tournament.com/submit',
        expect.objectContaining({
          body: JSON.stringify(mockResult)
        })
      );
    });
  });
});