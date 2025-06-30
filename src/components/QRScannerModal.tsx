import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { X, Camera } from 'lucide-react';
import { QRMatchData } from '../types';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (data: QRMatchData) => void;
  onScanError: (error: string) => void;
}

const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
  onScanError
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const [hasCamera, setHasCamera] = useState<boolean>(true);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen || !videoRef.current) return;

    const initScanner = async () => {
      try {
        const hasCamera = await QrScanner.hasCamera();
        setHasCamera(hasCamera);
        
        if (!hasCamera) {
          onScanError('No camera found');
          return;
        }

        const scanner = new QrScanner(
          videoRef.current!,
          (result) => {
            try {
              const data = JSON.parse(result.data) as QRMatchData;
              
              // Validate the QR data structure
              if (data.matchId && data.player1 && data.player2 && 
                  data.tournamentId && data.round && data.submitUrl) {
                onScanSuccess(data);
                scanner.stop();
              } else {
                onScanError('Invalid QR code format');
              }
            } catch {
              onScanError('Invalid QR code data');
            }
          },
          {
            returnDetailedScanResult: true,
            highlightScanRegion: true,
            highlightCodeOutline: true,
          }
        );

        scannerRef.current = scanner;
        await scanner.start();
        setIsScanning(true);
      } catch (err) {
        console.error('Scanner initialization error:', err);
        onScanError('Failed to initialize camera');
      }
    };

    initScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current.destroy();
        scannerRef.current = null;
      }
      setIsScanning(false);
    };
  }, [isOpen, onScanSuccess, onScanError]);

  const handleClose = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-scanner-title"
    >
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 id="qr-scanner-title" className="text-xl font-bold text-cyan-400">Scan QR Code</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close QR scanner"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4">
          {!hasCamera ? (
            <div className="text-center py-8">
              <Camera size={48} className="mx-auto mb-4 text-gray-500" />
              <p className="text-gray-400">No camera available</p>
            </div>
          ) : (
            <div className="relative">
              <video 
                ref={videoRef}
                className="w-full h-64 bg-black rounded-lg object-cover"
                playsInline
                muted
              />
              {isScanning && (
                <div className="absolute inset-0 border-2 border-cyan-400 rounded-lg pointer-events-none">
                  <div className="absolute top-2 left-2 w-6 h-6 border-l-4 border-t-4 border-cyan-400"></div>
                  <div className="absolute top-2 right-2 w-6 h-6 border-r-4 border-t-4 border-cyan-400"></div>
                  <div className="absolute bottom-2 left-2 w-6 h-6 border-l-4 border-b-4 border-cyan-400"></div>
                  <div className="absolute bottom-2 right-2 w-6 h-6 border-r-4 border-b-4 border-cyan-400"></div>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm">
              Position the QR code within the frame to scan
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScannerModal;