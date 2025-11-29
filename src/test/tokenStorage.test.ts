import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { saveToken, getToken, removeToken, clearAllTokens } from '../utils/tokenStorage';

describe('Token Storage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('saveToken', () => {
    it('should save token to localStorage', () => {
      saveToken(123, 'test-token-123');
      expect(localStorage.getItem('tournament_token_123')).toBe('test-token-123');
    });

    it('should overwrite existing token', () => {
      saveToken(123, 'old-token');
      saveToken(123, 'new-token');
      expect(localStorage.getItem('tournament_token_123')).toBe('new-token');
    });

    it('should save multiple tokens for different tournaments', () => {
      saveToken(123, 'token-123');
      saveToken(456, 'token-456');
      expect(localStorage.getItem('tournament_token_123')).toBe('token-123');
      expect(localStorage.getItem('tournament_token_456')).toBe('token-456');
    });
  });

  describe('getToken', () => {
    it('should retrieve saved token', () => {
      localStorage.setItem('tournament_token_123', 'test-token');
      expect(getToken(123)).toBe('test-token');
    });

    it('should return null for non-existent token', () => {
      expect(getToken(999)).toBe(null);
    });

    it('should retrieve correct token when multiple exist', () => {
      localStorage.setItem('tournament_token_123', 'token-123');
      localStorage.setItem('tournament_token_456', 'token-456');
      expect(getToken(123)).toBe('token-123');
      expect(getToken(456)).toBe('token-456');
    });
  });

  describe('removeToken', () => {
    it('should remove token from localStorage', () => {
      localStorage.setItem('tournament_token_123', 'test-token');
      removeToken(123);
      expect(localStorage.getItem('tournament_token_123')).toBe(null);
    });

    it('should not affect other tokens', () => {
      localStorage.setItem('tournament_token_123', 'token-123');
      localStorage.setItem('tournament_token_456', 'token-456');
      removeToken(123);
      expect(localStorage.getItem('tournament_token_123')).toBe(null);
      expect(localStorage.getItem('tournament_token_456')).toBe('token-456');
    });

    it('should handle removing non-existent token', () => {
      expect(() => removeToken(999)).not.toThrow();
    });
  });

  describe('clearAllTokens', () => {
    it('should clear all tournament tokens', () => {
      localStorage.setItem('tournament_token_123', 'token-123');
      localStorage.setItem('tournament_token_456', 'token-456');
      localStorage.setItem('tournament_token_789', 'token-789');
      clearAllTokens();
      expect(localStorage.getItem('tournament_token_123')).toBe(null);
      expect(localStorage.getItem('tournament_token_456')).toBe(null);
      expect(localStorage.getItem('tournament_token_789')).toBe(null);
    });

    it('should not clear non-token items', () => {
      localStorage.setItem('tournament_token_123', 'token-123');
      localStorage.setItem('other_setting', 'value');
      clearAllTokens();
      expect(localStorage.getItem('tournament_token_123')).toBe(null);
      expect(localStorage.getItem('other_setting')).toBe('value');
    });

    it('should handle empty localStorage', () => {
      expect(() => clearAllTokens()).not.toThrow();
    });
  });
});
