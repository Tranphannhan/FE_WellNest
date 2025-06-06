'use client';

import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';


export default function ScanQRCode() {
  const [result, setResult] = useState('');

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      experimentalFeatures: { useBarCodeDetectorIfSupported: true } ,
      fps: 60,
    }, false);

    scanner.render(success, error);

    function success(result: string) {
      scanner.clear();
      setResult(result);
    }

    function error(err: string) {
      console.error(err);
    }

    return () => {
      scanner.clear();
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-Black-600">Quét mã QR</h1>
        <p className="mt-2 text-gray-300">
          Đặt mã QR vào khung hình camera để quét
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div id="reader" className="w-full bg-white rounded-lg overflow-hidden border border-gray-800"></div>
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
                onClick={() => setResult('')}
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
  );
} 