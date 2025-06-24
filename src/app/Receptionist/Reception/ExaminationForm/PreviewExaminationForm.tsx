'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react';
import './ExaminationForm.css';
import { ExaminationForm, ServiceItem } from '@/app/types/receptionTypes/receptionTypes';



interface PreviewExaminationFormProps {
  isOpen: boolean;
  onClose: () => void;
  patientData: ExaminationForm;
  collectorName: string;
}

export default function PreviewExaminationForm({
  isOpen,
  onClose,
  patientData,
  collectorName,
}: PreviewExaminationFormProps) {
  const [pdfPreviewImg, setPdfPreviewImg] = useState('');
  const prescriptionRef = useRef(null);

  const fixedServiceList = [
    {
      name: `Khám bệnh ở khoa ${patientData.department}`,
      quantity: 1,
      unitPrice: patientData.price,
      total: patientData.price,
    },
  ];

  const [serviceList, setServiceList] = useState<ServiceItem[]>([]);

  const totalCost = serviceList.reduce((sum, item) => sum + item.total, 0);
  const discount = 0;
  const grandTotal = totalCost - discount;

  const captureAndShowPreview = useCallback(() => {
    const input = prescriptionRef.current;
    if (!input) return console.error("Không tìm thấy nội dung để chụp!");
    if (!window.html2canvas) return console.warn("html2canvas chưa sẵn sàng.");

    setTimeout(() => {
      window.html2canvas(input, { scale: 2, logging: true, useCORS: true })
        .then((canvas: HTMLCanvasElement) => {
          setPdfPreviewImg(canvas.toDataURL('image/png'));
        })
        .catch((err:string) => {
          console.error("Lỗi khi chụp ảnh:", err);
        });
    }, 100);
  }, []);

  const handleExportPdf = useCallback(() => {
    if (!pdfPreviewImg) return console.error("Chưa có ảnh để xuất PDF.");
    if (!window.jspdf) return console.warn("jspdf chưa sẵn sàng.");

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

        pdf.save(`phieu_thu_vien_phi_${patientData.fullName.replace(/\s/g, '_')}.pdf`);
        onClose();
      };
      tempImg.onerror = (err) => {
        console.error("Không thể tải ảnh để tạo PDF:", err);
      };
    }, 50);
  }, [pdfPreviewImg, onClose, patientData.fullName]);

  useEffect(() => {
    if (isOpen) {
      setPdfPreviewImg('');
      setServiceList(fixedServiceList);

      const loadScript = (src: string, globalName: string, callback?: () => void) => {
        if (!window[globalName as keyof Window]) {
          const script = document.createElement('script');
          script.src = src;
          script.onload = () => {
            console.log(`${globalName} loaded`);
            callback?.();
          };
          script.onerror = (e) => console.error(`Lỗi tải ${globalName}:`, e);
          document.head.appendChild(script);
        } else {
          console.log(`${globalName} đã được tải.`);
          callback?.();
        }
      };

      loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', 'html2canvas', () => {
        captureAndShowPreview();
      });

      loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', 'jspdf');
    }
  }, [isOpen, captureAndShowPreview]);

  if (!isOpen) return null;

  const currentDate = new Date();
  const formattedTime = currentDate.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });

  return (
      <div className="pdf-preview-modal">
        <div className="pdf-preview-content">
          <h3>Xem trước Phiếu Khám</h3>
          {pdfPreviewImg ? (
            <img src={pdfPreviewImg} alt="PDF Preview" />
          ) : (
            <p>Đang tạo xem trước...</p>
          )}
          <div className="pdf-preview-actions">
            <button className="close-btn-modal" onClick={onClose}>Đóng</button>
            <button className="export-btn-modal" onClick={handleExportPdf}>Xuất Phiếu Khám PDF</button>
          </div>
        </div>

        {/* Phiếu thu ẩn dùng để export PDF */}
        <div ref={prescriptionRef} className="a4-container" style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <div className="prescription-header">
            <div>
              <p><strong>Phiếu thu viện phí</strong></p>
              <h1>Bệnh viện đa khoa WellNest</h1>
              <p>171 Đường Trường Chinh Tân Thới Nhất Quận 12 HCM</p>
              <p>Điện thoại : +84 123456789</p>
            </div>
            <div className="barcode">
              {Array.from({ length: 60 }).map((_, index) => {
                const fixedHeight = 60;
                const randomWidth = 1 + Math.floor(Math.random() * 4);
                const isSpace = Math.random() < 0.3;

                return isSpace ? (
                  <div key={index} className="barcode-space" style={{ width: `${randomWidth * 2}px`, height: `${fixedHeight}px` }}></div>
                ) : (
                  <div key={index} className="barcode-bar" style={{ height: `${fixedHeight}px`, width: `${randomWidth}px` }}></div>
                );
              })}
            </div>
          </div>

          <h2 className="prescription-title">Phiếu Thu Tiền Khám Bệnh</h2>

          <div className="patient-info-grid">
            <p><strong>Họ tên:</strong> {patientData.fullName}</p>
            <p><strong>Cân nặng:</strong> {patientData.weight === 'undefined'?'':patientData.weight + 'kg'}</p>
            <p><strong>Giới tính:</strong> {patientData.gender}</p>
            <p><strong>Ngày Sinh:</strong> {patientData.dob}</p>
            <p style={{ gridColumn: 'span 3' }}><strong>Địa chỉ liên hệ:</strong> {patientData.address}</p>
            <p style={{ gridColumn: 'span 1' }}><strong>Phòng khám:</strong> {patientData.clinic}</p>
            <p style={{ gridColumn: 'span 1' }}><strong>Số thứ tự khám:</strong> {patientData.QueueNumber}</p>
          </div>

          <h3 className="fee-heading">Chi Tiết Viện Phí</h3>
          <table className="fee-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên dịch vụ</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {serviceList.map((item, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.unitPrice.toLocaleString('vi-VN')}</td>
                  <td>{item.quantity}</td>
                  <td>{item.total.toLocaleString('vi-VN')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="receipt-summary">
            <div className="summary-row">
              <p>Tổng chi phí:</p>
              <p className="summary-value">{totalCost.toLocaleString('vi-VN')}</p>
            </div>
            <div className="summary-row">
              <p>Giảm:</p>
              <p className="summary-value">{discount.toLocaleString('vi-VN')}</p>
            </div>
            <div className="summary-row total-row">
              <p>Tổng thu:</p>
              <p className="summary-value">{grandTotal.toLocaleString('vi-VN')}</p>
            </div>
          </div>

          <div className="receipt-signatures">
            <div className="signature-block signature-payer">
              <p className="signature-label">Người nộp tiền</p>
              <div className="signature-placeholder"></div>
            </div>

            <div className="collector-info-block">
              <div className="signature-date">
                <p>{formattedTime} Ngày {currentDate.getDate()}, Tháng {currentDate.getMonth() + 1}, Năm {currentDate.getFullYear()}</p>
              </div>
              <div className="signature-block signature-collector">
                <p className="signature-label">Người thu</p>
                <p className="signature-name">{collectorName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

}