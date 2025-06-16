// File: PreviewExaminationForm.tsx
'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import './PrescriptionForm.css'; // Import the CSS file (for prescription)

// Mock types cho Đơn Thuốc
// Bạn có thể di chuyển các interface này vào một file types chung nếu muốn
interface ExaminationFormDonThuoc {
  fullName: string;
  weight: number;
  gender: string;
  dob: string;
  address: string;
  department: string; // Khoa khám
  price: number; // Giá khám
  clinic: string; // Phòng khám
  QueueNumber: string; // Số thứ tự
}

interface MedicineItem {
  id: number;
  name: string;
  dosage: string;
  instructions: string;
  pills: number;
}


interface PreviewExaminationFormProps {
  isOpen: boolean;
  onClose: () => void;
  patientData?: ExaminationFormDonThuoc; // <-- Đánh dấu là OPTIONAL (tùy chọn)
  collectorName?: string; // <-- Đánh dấu là OPTIONAL (tùy chọn)
}

const dummyMedicineList: MedicineItem[] = [
  { id: 1, name: 'Febuxostat (FORGOUT 40mg)', dosage: '40mg', instructions: 'sáng 1 viên, chiều 1 viên.', pills: 14 },
  { id: 2, name: 'Paracetamol', dosage: '500mg', instructions: '1 viên khi sốt, không quá 4 viên/ngày.', pills: 10 },
  { id: 3, name: 'Amoxicillin', dosage: '250mg', instructions: '1 viên mỗi 8 giờ.', pills: 21 },
  { id: 4, name: 'Amoxicillin', dosage: '250mg', instructions: '1 viên mỗi 8 giờ.', pills: 21 }
];

export default function PreviewExaminationForm({
  isOpen,
  onClose,
  patientData,
  collectorName,
}: PreviewExaminationFormProps) {
  const [pdfPreviewImg, setPdfPreviewImg] = useState('');
  const prescriptionRef = useRef(null);

  // Dữ liệu cứng MẶC ĐỊNH SỬ DỤNG KHI patientData KHÔNG ĐƯỢC TRUYỀN VÀO (cho mục đích test độc lập)
  const defaultPatientData: ExaminationFormDonThuoc = {
    fullName: "Bệnh Nhân Demo", // Dữ liệu cứng mới cho Đơn Thuốc
    weight: 65,
    gender: "Nữ",
    dob: "2000/01/01",
    address: "123 Đường Test, Quận ABC, TP.HCM",
    department: "Khám Tổng Quát",
    price: 200000,
    clinic: "Phòng 101",
    QueueNumber: "D001",
  };
  const defaultCollectorName = "Bác Sĩ Test Kê Đơn"; // Dữ liệu cứng mới cho người kê đơn

  // SỬ DỤNG currentPatientData VÀ currentCollectorName MỌI NƠI TRONG JSX VÀ DEPENDENCIES
  const currentPatientData = patientData || defaultPatientData;
  const currentCollectorName = collectorName || defaultCollectorName;


  const captureAndShowPreview = useCallback(() => {
    const input = prescriptionRef.current;
    if (!input) return console.error("Không tìm thấy nội dung để chụp!");
    if (typeof window.html2canvas === 'undefined') return console.warn("html2canvas chưa sẵn sàng.");

    setTimeout(() => {
      window.html2canvas(input, { scale: 2, logging: true, useCORS: true })
        .then((canvas: HTMLCanvasElement) => setPdfPreviewImg(canvas.toDataURL('image/png')))
        .catch((err: string) => console.error("Lỗi khi chụp ảnh:", err));
    }, 100);
  }, []); // Dependencies: empty as it only depends on refs and global window objects

  const handleExportPdf = useCallback(() => {
    if (!pdfPreviewImg) return console.error("Chưa có ảnh để xuất PDF.");
    if (typeof window.jspdf === 'undefined') return console.warn("jspdf chưa sẵn sàng.");

    setTimeout(() => {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const tempImg = new Image();
      tempImg.src = pdfPreviewImg;

      tempImg.onload = () => {
        const imgHeight = (tempImg.height * imgWidth) / tempImg.width;
        let heightLeft = imgHeight;
        let position = 0;
        pdf.addImage(pdfPreviewImg, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(pdfPreviewImg, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        pdf.save(`don_thuoc_${currentPatientData.fullName.replace(/\s/g, '_')}.pdf`); // Sử dụng currentPatientData
        onClose();
      };
      tempImg.onerror = (err) => console.error("Không thể tải ảnh để tạo PDF:", err);
    }, 50);
  }, [pdfPreviewImg, onClose, currentPatientData.fullName]); // ĐÃ SỬA: currentPatientData.fullName thay vì patientData.fullName

  useEffect(() => {
    if (isOpen) {
      setPdfPreviewImg('');
      const loadScript = (src: string, globalName: string, callback?: () => void) => {
        if (typeof window[globalName as keyof Window] === 'undefined') {
          const script = document.createElement('script');
          script.src = src;
          script.onload = () => { console.log(`${globalName} loaded`); callback?.(); };
          script.onerror = (e) => console.error(`Lỗi tải ${globalName}:`, e);
          document.head.appendChild(script);
        } else {
          console.log(`${globalName} đã được tải.`);
          callback?.();
        }
      };
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', 'html2canvas', () => { captureAndShowPreview(); });
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', 'jspdf');
    }
  }, [isOpen, captureAndShowPreview]);

  if (!isOpen) return null;

  const currentDate = new Date();
  const formattedTime = currentDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

  const barcodeBars = Array.from({ length: 60 }).map((_, index) => {
    const fixedHeight = 60;
    const randomWidth = 1 + Math.floor(Math.random() * 4);
    const isSpace = Math.random() < 0.3;
    return isSpace ? (
      <div key={index} className="barcode-space" style={{ width: `${randomWidth * 2}px`, height: `${fixedHeight}px` }}></div>
    ) : (
      <div key={index} className="barcode-bar" style={{ height: `${fixedHeight}px`, width: `${randomWidth}px` }}></div>
    );
  });

  return (
    <>
      <div className="pdf-preview-modal">
        <div className="pdf-preview-content">
          <h3>Xem trước Đơn Thuốc</h3>
          {pdfPreviewImg ? (
            <img src={pdfPreviewImg} alt="PDF Preview" />
          ) : (
            <p>Đang tạo xem trước...</p>
          )}
          <div className="pdf-preview-actions">
            <button className="close-btn-modal" onClick={onClose}>Đóng</button>
            <button className="export-btn-modal" onClick={handleExportPdf}>Xuất Đơn Thuốc PDF</button>
          </div>
        </div>

        {/* Hidden prescription for PDF export */}
        <div ref={prescriptionRef} className="a4-container" style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <div className="prescription-header">
            <div>
              <p><strong>Mã đơn thuốc</strong></p>
              <h1>Bệnh viện đa khoa WellNest</h1>
              <p>171 Đường Trường Chinh Tân Thới Nhất Quận 12 HCM</p>
              <p>Điện thoại : +84 123456789</p>
            </div>
            <div className="barcode">
              {barcodeBars}
            </div>
          </div>

          <h2 className="prescription-title">Đơn Thuốc</h2>

          <div className="patient-info-grid">
            <p><strong>Họ tên:</strong> {currentPatientData.fullName}</p>
            <p><strong>Cân nặng:</strong> {currentPatientData.weight}kg</p>
            <p><strong>Giới tính:</strong> {currentPatientData.gender}</p>
            <p><strong>Ngày Sinh:</strong> {currentPatientData.dob}</p>
            <p><strong>Phòng Khám:</strong> {currentPatientData.clinic}</p>
            <p><strong>Khoa Khám:</strong> {currentPatientData.department}</p>
            <p style={{ gridColumn: 'span 3' }}><strong>Địa chỉ liên hệ:</strong> {currentPatientData.address}</p>
            <p style={{ gridColumn: 'span 3' }}><strong>Chuẩn đoán:</strong> Viêm khớp chấn thương chỉnh hình da suy tạng</p>
            
          </div>

          <h3 className="fee-heading">Toa Thuốc Dịch Vụ</h3>
          <div className="medicine-list">
            {dummyMedicineList.map((item, i) => (
              <div key={item.id} className="medicine-item">
                <div>
                  <p>{i + 1}. {item.name} {item.dosage}</p>
                  <p>Uống: {item.instructions}</p>
                </div>
                <div className="pill-count">
                  <span>Viên:</span>
                  <span>{item.pills}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="note">
            <strong>Lưu ý:</strong> hạn chế hải sản, rượu bia, lòng xào dưa, tái khám CXK <br />
            <em>Hẹn tái khám sau 14 ngày (20/04/2005)</em>
          </p>

          <div className="receipt-signatures">
            <div className="signature-block signature-payer">
              <p className="signature-label">Người bệnh</p>
              <div className="signature-placeholder"></div> {/* Placeholder for actual signature */}
            </div>

            <div className="collector-info-block">
              <div className="signature-date">
                <p>{formattedTime} Ngày {currentDate.getDate()}, Tháng {currentDate.getMonth() + 1}, Năm {currentDate.getFullYear()}</p>
              </div>
              <div className="signature-block signature-collector">
                <p className="signature-label">Bác sĩ kê đơn</p>
                <p className="signature-name">{currentCollectorName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}