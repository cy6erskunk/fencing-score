import React, { useState, useEffect } from 'react';
import { X, UserCircle } from 'lucide-react';

interface DeviceRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (name: string) => void;
  isRegistering?: boolean;
  error?: string;
}

const DeviceRegistrationModal: React.FC<DeviceRegistrationModalProps> = ({
  isOpen,
  onClose,
  onRegister,
  isRegistering = false,
  error
}) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setName('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onRegister(name.trim());
    }
  };

  const handleClose = () => {
    if (!isRegistering) {
      setName('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-md w-full p-6 relative border border-cyan-500/30">
        {!isRegistering && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        )}

        <div className="flex items-center gap-3 mb-6">
          <UserCircle size={32} className="text-cyan-500" />
          <h2 className="text-2xl font-bold text-white">Device Registration</h2>
        </div>

        <p className="text-gray-300 mb-6">
          This tournament requires device registration. Please enter your name to continue.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isRegistering}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter your name"
              required
              autoFocus
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isRegistering}
              className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isRegistering || !name.trim()}
              className="flex-1 px-4 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRegistering ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeviceRegistrationModal;
