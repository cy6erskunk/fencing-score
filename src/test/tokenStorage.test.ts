import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { saveToken, getToken, removeToken } from '../utils/tokenStorage';

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
    it('should save device token to localStorage', () => {
      saveToken('test-device-token-123');
      expect(localStorage.getItem('device_token')).toBe('test-device-token-123');
    });

    it('should overwrite existing token', () => {
      saveToken('old-token');
      saveToken('new-token');
      expect(localStorage.getItem('device_token')).toBe('new-token');
    });
  });

  describe('getToken', () => {
    it('should retrieve saved token', () => {
      localStorage.setItem('device_token', 'test-device-token');
      expect(getToken()).toBe('test-device-token');
    });

    it('should return null for non-existent token', () => {
      expect(getToken()).toBe(null);
    });
  });

  describe('removeToken', () => {
    it('should remove device token from localStorage', () => {
      localStorage.setItem('device_token', 'test-token');
      removeToken();
      expect(localStorage.getItem('device_token')).toBe(null);
    });

    it('should not affect other items in localStorage', () => {
      localStorage.setItem('device_token', 'test-token');
      localStorage.setItem('other_setting', 'value');
      removeToken();
      expect(localStorage.getItem('device_token')).toBe(null);
      expect(localStorage.getItem('other_setting')).toBe('value');
    });

    it('should handle removing non-existent token', () => {
      expect(() => removeToken()).not.toThrow();
    });
  });
});
