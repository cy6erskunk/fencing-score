import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock QrScanner for QR code tests
vi.mock('qr-scanner', () => {
  interface MockQrScannerConstructor {
    new (...args: unknown[]): {
      start: () => Promise<void>;
      stop: () => void;
      destroy: () => void;
    };
    hasCamera: () => Promise<boolean>;
  }

  const mockQrScanner = vi.fn().mockImplementation(() => ({
    start: vi.fn().mockResolvedValue(undefined),
    stop: vi.fn(),
    destroy: vi.fn(),
  })) as unknown as MockQrScannerConstructor;
  
  // Add hasCamera as a static method
  mockQrScanner.hasCamera = vi.fn().mockResolvedValue(true);
  
  return {
    default: mockQrScanner,
  };
});

// Mock HTMLVideoElement for QR scanner tests
Object.defineProperty(window.HTMLVideoElement.prototype, 'play', {
  writable: true,
  value: vi.fn().mockResolvedValue(undefined),
});

Object.defineProperty(window.HTMLVideoElement.prototype, 'pause', {
  writable: true,
  value: vi.fn(),
});

// Mock getUserMedia for camera access
Object.defineProperty(navigator, 'mediaDevices', {
  writable: true,
  value: {
    getUserMedia: vi.fn().mockResolvedValue({
      getTracks: () => [{ stop: vi.fn() }]
    }),
  },
});

// Mock fetch for API calls
globalThis.fetch = vi.fn();

// Mock console.error globally to suppress expected error messages in tests
const originalConsoleError = console.error;
console.error = (...args) => {
  // Suppress specific QR scanner errors
  if (args[0]?.toString().includes('Scanner initialization error')) {
    return;
  }
  originalConsoleError(...args);
};