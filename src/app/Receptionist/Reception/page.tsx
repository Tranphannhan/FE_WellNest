'use client';

import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import Tabbar from '@/app/components/shared/Tabbar/Tabbar';
import { convertDateFormat } from '@/app/lib/Format';
import { useRouter } from 'next/navigation';
import PatientInfoResult from './PatientInfoResult';
import { codeScanningInformationType } from '@/app/types/patientTypes/patient';
import ReceptionResultNotificationExample from './componentsReception/receptionResultNotification';


export default function ScanQRCode() {
  const [result, setResult] = useState ('');
  const [renderScan, setRenderScan] = useState <codeScanningInformationType>({})
  const [isScanning, setIsScanning] = useState(false);
  const router = useRouter();
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


  function Hadlecreate  () {
    router.push('/Receptionist/Reception/InputForm?isTheOfficialCard=true');
  }

  
async function HandleContinue() {
  try {
    if (!renderScan.CCCDNumber) {
      alert("Dữ liệu CCCD không hợp lệ.");
      return;
    }

    const response = await fetch(
      `${API_BASE_URL}/The_Kham_Benh/TimKiemSoKhamBenh/Pagination?soCCCD=${renderScan.CCCDNumber}`
    );

    if (!response.ok) {
      console.error("Lỗi khi gọi API:", response.status);
      alert("Không thể truy cập dữ liệu. Vui lòng thử lại.");
      return;
    }

    const examination = await response.json();

    // Kiểm tra dữ liệu có tồn tại và có phần tử
    if (examination?.data?.length > 0) {
      // Lưu kết quả vào sessionStorage
      sessionStorage.setItem('soKhamBenh', JSON.stringify(examination.data[0]));

      // Chuyển sang trang hiển thị thông tin
      router.push('/Receptionist/Reception/PatientInformation');
    } else {
      sessionStorage.setItem('thongTinCCCD', JSON.stringify(renderScan))

      // thiếu 1 bước để kiểm tra xem bệnh nhân có từng tạo thẻ tạm thời chưa

      setShow (true);
    }
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    alert("Lỗi kết nối đến máy chủ.");
  }
}


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
        const data = decodedText.split('|')
        const value: codeScanningInformationType = {
          CCCDNumber: data[0],
          name: data[2],
          dateOfBirth:convertDateFormat(data[3]),
          sex: data[4],
          address: data[5],
          creationDate:convertDateFormat(data[6]) 
        };
        setRenderScan(value)
        setResult('Đã có dữ liệu');
        setIsScanning(false);
      },
      (error) => {
        console.error(error);
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [isScanning]);




  //   --- 
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  

    
  return (
    <>
    {console.log(result)}


      <ReceptionResultNotificationExample
        Data_information={
          {
            callBack : Hadlecreate,
            handleClose,
            handleShow,
            show
          }
        }
      />

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
           

            {result ? (
              <>
                <h2 className="text-lg font-bold text-[#595959] mb-4">Thông tin căn cước công dân:</h2>
                <PatientInfoResult 
                  data={
                    renderScan
                  }
                  onNext={HandleContinue}
                ></PatientInfoResult>
              </>
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
