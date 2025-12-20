import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { saveToken, getToken, getDeviceName, removeToken } from '../utils/tokenStorage';

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

    it('should save device token and name to localStorage', () => {
      saveToken('test-device-token-123', 'John Doe');
      expect(localStorage.getItem('device_token')).toBe('test-device-token-123');
      expect(localStorage.getItem('device_name')).toBe('John Doe');
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

  describe('getDeviceName', () => {
    it('should retrieve saved device name', () => {
      localStorage.setItem('device_name', 'John Doe');
      expect(getDeviceName()).toBe('John Doe');
    });

    it('should return null for non-existent device name', () => {
      expect(getDeviceName()).toBe(null);
    });
  });

  describe('removeToken', () => {
    it('should remove device token from localStorage', () => {
      localStorage.setItem('device_token', 'test-token');
      removeToken();
      expect(localStorage.getItem('device_token')).toBe(null);
    });

    it('should remove both device token and name from localStorage', () => {
      localStorage.setItem('device_token', 'test-token');
      localStorage.setItem('device_name', 'John Doe');
      removeToken();
      expect(localStorage.getItem('device_token')).toBe(null);
      expect(localStorage.getItem('device_name')).toBe(null);
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
