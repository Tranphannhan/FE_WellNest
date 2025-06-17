// File: PreviewExaminationResult.tsx
'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import './PreviewExaminationResult.css'; // Import the CSS file

// Types for Examination Result
interface DiagnosisTreatmentPair {
  diagnosis: string;
  treatmentPlan: string;
  itemNotes?: string; // Ghi chú cho từng mục chẩn đoán/xử lý (optional)
}

interface ExaminationResultData {
  fullName: string;
  weight: number;
  gender: string;
  dob: string;
  address: string;
  clinic: string; // THÊM MỚI: Trường phòng khám
  diagnosisTreatmentList: DiagnosisTreatmentPair[];
  notes?: string; // Ghi chú chung của phiếu (vẫn giữ lại)
}

interface PreviewExaminationResultProps {
  isOpen: boolean;
  onClose: () => void;
  patientData?: ExaminationResultData; // Optional patient data
  doctorName?: string; // Optional doctor name
}

export default function PreviewExaminationResult({
  isOpen,
  onClose,
  patientData,
  doctorName,
}: PreviewExaminationResultProps) {
  const [pdfPreviewImg, setPdfPreviewImg] = useState('');
  const examinationResultRef = useRef(null);

  // Default data to use when patientData is not provided (for independent testing)
  const defaultPatientData: ExaminationResultData = {
    fullName: "Bệnh Nhân Thử Nghiệm",
    weight: 70,
    gender: "Nam",
    dob: "1995/05/15",
    address: "456 Đường Mẫu, Phường XYZ, Hà Nội",
    clinic: "Phòng Khám Tổng Quát 1", // THÊM DỮ LIỆU MẶC ĐỊNH CHO PHÒNG KHÁM
    diagnosisTreatmentList: [
      {
        diagnosis: "Viêm họng cấp tính do virus, không biến chứng.",
        treatmentPlan: "Nghỉ ngơi, uống đủ nước, sử dụng thuốc giảm đau/hạ sốt (Paracetamol) khi cần, súc miệng nước muối sinh lý.",
        itemNotes: "Tránh đồ uống lạnh.",
      },
      {
        diagnosis: "Sốt siêu vi.",
        treatmentPlan: "Theo dõi nhiệt độ, bù nước điện giải, hạ sốt bằng Paracetamol. Tránh dùng kháng sinh nếu không có bội nhiễm.",
        itemNotes: "Theo dõi sát nhiệt độ và tình trạng phát ban.",
      },
    ],
    notes: "Bệnh nhân có tiền sử dị ứng với Penicillin. Cần tránh các thuốc kháng sinh nhóm Beta-lactam.",
  };
  const defaultDoctorName = "Bác Sĩ Lê Văn A";

  // Use currentPatientData and currentDoctorName everywhere in JSX and dependencies
  const currentPatientData = patientData || defaultPatientData;
  const currentDoctorName = doctorName || defaultDoctorName;

  const captureAndShowPreview = useCallback(() => {
    const input = examinationResultRef.current;
    if (!input) return console.error("Không tìm thấy nội dung để chụp!");
    if (typeof window.html2canvas === 'undefined') return console.warn("html2canvas chưa sẵn sàng.");

    setTimeout(() => {
      window.html2canvas(input, { scale: 2, logging: true, useCORS: true })
        .then((canvas: HTMLCanvasElement) => setPdfPreviewImg(canvas.toDataURL('image/png')))
        .catch((err: string) => console.error("Lỗi khi chụp ảnh:", err));
    }, 100);
  }, []);

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
        pdf.save(`phieu_ket_qua_kham_${currentPatientData.fullName.replace(/\s/g, '_')}.pdf`);
        onClose();
      };
      tempImg.onerror = (err) => console.error("Không thể tải ảnh để tạo PDF:", err);
    }, 50);
  }, [pdfPreviewImg, onClose, currentPatientData.fullName]);

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
  const displayDate = `${formattedTime} Ngày ${currentDate.getDate()}, Tháng ${currentDate.getMonth() + 1}, Năm ${currentDate.getFullYear()}`;

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
          <h3>Xem trước Phiếu Kết Quả Khám</h3>
          {pdfPreviewImg ? (
            <img src={pdfPreviewImg} alt="PDF Preview" />
          ) : (
            <p>Đang tạo xem trước...</p>
          )}
          <div className="pdf-preview-actions">
            <button className="close-btn-modal" onClick={onClose}>Đóng</button>
            <button className="export-btn-modal" onClick={handleExportPdf}>Xuất Phiếu Kết Quả PDF</button>
          </div>
        </div>

        {/* Hidden examination result for PDF export */}
        <div ref={examinationResultRef} className="a4-container" style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <div className="examination-result-header">
            <div>
              <p><strong>Mã phiếu khám</strong></p>
              <h1>Bệnh viện đa khoa WellNest</h1>
              <p>171 Đường Trường Chinh Tân Thới Nhất Quận 12 HCM</p>
              <p>Điện thoại : +84 123456789</p>
            </div>
            <div className="barcode">
              {barcodeBars}
            </div>
          </div>

          <h2 className="examination-result-title">Phiếu Kết Quả Khám</h2>

          <div className="patient-info-grid">
            <p><strong>Họ tên:</strong> {currentPatientData.fullName}</p>
            <p><strong>Cân nặng:</strong> {currentPatientData.weight}kg</p>
            <p><strong>Giới tính:</strong> {currentPatientData.gender}</p>
            <p><strong>Ngày Sinh:</strong> {currentPatientData.dob}</p>
            <p style={{ gridColumn: 'span 3' }}><strong>Địa chỉ liên hệ:</strong> {currentPatientData.address}</p>
            <p style={{ gridColumn: 'span 3' }}><strong>Phòng khám:</strong> {currentPatientData.clinic}</p> {/* THÊM PHÒNG KHÁM */}
          </div>

          

          {/* Table for Diagnosis and Treatment Plan with Item Notes */}
          <div className="examination-section">
            <h3 className="section-heading">Chẩn Đoán & Hướng Xử Lý</h3>
            <div className="diagnosis-treatment-table-container">
              <table className="diagnosis-treatment-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Kết quả</th>
                    <th>Hướng Xử Lý</th>
                    <th>Ghi Chú</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPatientData.diagnosisTreatmentList.length > 0 ? (
                    currentPatientData.diagnosisTreatmentList.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.diagnosis}</td>
                        <td>{item.treatmentPlan}</td>
                        <td>{item.itemNotes || ''}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', fontStyle: 'italic', color: '#888' }}>
                        Không có chẩn đoán và hướng xử lý cụ thể.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <p className="note">
            <strong>Lưu ý:</strong> Vui lòng tuân thủ hướng dẫn điều trị của bác sĩ và tái khám đúng hẹn.
          </p>

          <div className="receipt-signatures">
            <div className="signature-block signature-patient">
              <p className="signature-label">Người bệnh</p>
              <div className="signature-placeholder"></div> {/* Placeholder for actual signature */}
            </div>

            <div className="doctor-info-block">
              <div className="signature-date">
                <p>{displayDate}</p>
              </div>
              <div className="signature-block signature-doctor">
                <p className="signature-label">Bác sĩ khám</p>
                <p className="signature-name">{currentDoctorName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}