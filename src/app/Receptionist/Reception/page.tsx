'use client';

import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import Tabbar from '@/app/components/shared/Tabbar/Tabbar';

export default function ScanQRCode() {
  const [result, setResult] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (!isScanning) {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }
      return;
    }
    
    const scanner = new Html5QrcodeScanner(
      'reader',
      {
        qrbox: { width: 250, height: 250 },
        experimentalFeatures: { useBarCodeDetectorIfSupported: true },
        fps: 60,
      },
      false
    );

    scannerRef.current = scanner;

    scanner.render(
      (decodedText) => {
        scanner.clear();
        setResult(decodedText);
        setIsScanning(false); // dừng quét sau khi có kết quả
      },
      (error) => {
        // Bạn có thể xử lý lỗi quét tại đây
        console.error(error);
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [isScanning]);

  return (
    <>
      <Tabbar
        tabbarItems={{
          tabbarItems: [
            { text: 'Quét mã QR', link: '/Receptionist/Reception' },
            { text: 'Nhập thủ công', link: '/Receptionist/Reception/InputForm' },
          ],
        }}
      />

      <div className="space-y-8 pt-[50px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div
              id="reader"
              className="w-full bg-white rounded-lg overflow-hidden border-[black]"
            ></div>

            {!isScanning && (
              <button
                onClick={() => {
                  setResult('');
                  setIsScanning(true);
                }}
               style={{
                  color: "gray",
                  background: "white",
                  width: "100%",
                  height: "169px",
                  transform: "translateY(-14px)",
                  borderRadius: "8px",
                  border: "1px solid #e4e4e4",
                  cursor:'pointer'
                }}

              >
                Bắt đầu quét mã QR CCCD
              </button>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-medium text-white mb-4">Kết quả quét</h2>

            {result ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-800 rounded-md border border-gray-700">
                  <p className="text-sm text-gray-300">Nội dung:</p>
                  <p className="mt-1 font-mono text-sm text-white break-all">{result}</p>
                </div>

                <button
                  onClick={() => {
                    setResult('');
                    setIsScanning(false);
                  }}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-200 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Xóa kết quả
                </button>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <p>Chưa có kết quả quét</p>
                <p className="text-sm mt-1">Đưa mã QR vào khung hình để quét</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
