'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import './MedicineFees.css';
import { prescriptionType } from '@/app/types/patientTypes/patient';
import { formatCurrencyVND, formatTime } from '@/app/lib/Format';
import { PrescriptionDetail } from '@/app/Doctor/Patient/ToExamine/[id]/CreateResults/CreateResultsComponent/Prescription';

interface MedicineFeesProps {
  isOpen: boolean;
  onClose: () => void;
  data?: prescriptionType;
  detailedPrescription?: PrescriptionDetail[];
}

export default function MedicineFees({ isOpen, onClose, data, detailedPrescription }: MedicineFeesProps) {
  const medicineFeesRef = useRef<HTMLDivElement>(null);
  const [pdfPreviewImg, setPdfPreviewImg] = useState('');
  const [isDataReady, setIsDataReady] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(true);


  // Dynamic data from props with fallbacks
  const patientName = data?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.HoVaTen || 'Không có dữ liệu';
  const phoneNumber = data?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.SoDienThoai || 'Không có dữ liệu';
  const patientAddress = data?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.DiaChi || 'Không có dữ liệu';
  const diagnosis = data?.Id_PhieuKhamBenh?.LyDoDenKham || 'Không có dữ liệu';
  const doctorName = data?.Id_PhieuKhamBenh?.Id_Bacsi?.TenBacSi || 'Không có dữ liệu';

  // Map detailedPrescription to table structure
  const medicines = detailedPrescription?.map((item, index) => ({
    stt: index + 1,
    name: item.Id_Thuoc?.TenThuoc || 'Không xác định',
    dvt: item.Id_Thuoc?.DonVi || 'N/A',
    sl: item.SoLuong || 0,
    unitPrice: item.Id_Thuoc?.Gia || 0,
    total: (item.SoLuong || 0) * (item.Id_Thuoc?.Gia || 0),
  })) || [];

  // Calculate total medicine price
  const calculatedTotalMedicinePrice = medicines.reduce((sum, item) => sum + item.total, 0);

  // Current date and time
  const currentDate = new Date();
  const formattedTime = currentDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

  // Generate barcode bars
  const barcodeBars = Array.from({ length: 60 }).map((_, index) => {
    const fixedHeight = 50;
    const randomWidth = 1 + Math.floor(Math.random() * 4);
    const isSpace = Math.random() < 0.3;
    return isSpace ? (
      <div key={index} className="barcode-space" style={{ width: `${randomWidth * 2}px`, height: `${fixedHeight}px` }}></div>
    ) : (
      <div key={index} className="barcode-bar" style={{ height: `${fixedHeight}px`, width: `${randomWidth}px` }}></div>
    );
  });

  // Capture DOM for PDF preview
  const captureAndShowPreview = useCallback(() => {
  const input = medicineFeesRef.current;
  if (!input) return;

  setLoadingPreview(true); // 🟡 Bắt đầu loading

  window.html2canvas(input, { scale: 2, logging: true, useCORS: true })
    .then((canvas: HTMLCanvasElement) => {
      setPdfPreviewImg(canvas.toDataURL('image/png'));
      setLoadingPreview(false); // ✅ Tắt loading sau khi xong
    })
    .catch((err: string) => {
      console.error('Lỗi khi chụp ảnh:', err);
      setLoadingPreview(false);
    });
}, []);

  // Export PDF
  const handleExportPdf = useCallback(() => {
    if (!pdfPreviewImg) {
      console.error('Chưa có ảnh để xuất PDF.');
      return;
    }

    if (typeof window.jspdf === 'undefined') {
      console.warn('jspdf chưa sẵn sàng.');
      return;
    }

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
        const sanitizedPatientName = patientName.replace(/[^a-zA-Z0-9]/g, '_');
        pdf.save(`phieu_thu_tien_thuoc_${sanitizedPatientName}.pdf`);
        onClose();
      };
      tempImg.onerror = (err) => console.error('Không thể tải ảnh để tạo PDF:', err);
    }, 50);
  }, [pdfPreviewImg, onClose, patientName]);

  useEffect(() => {
    console.log(isDataReady,loadingPreview,patientAddress,diagnosis)
  if (isOpen && data && detailedPrescription) {
    setIsDataReady(true);
    setPdfPreviewImg('');
    setLoadingPreview(true);

    const loadScript = (src: string, globalName: string, callback?: () => void) => {
      if (typeof window[globalName as keyof Window] === 'undefined') {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => callback?.();
        script.onerror = (e) => console.error(`Lỗi tải ${globalName}:`, e);
        document.head.appendChild(script);
      } else {
        callback?.();
      }
    };

    // Delay để chắc chắn DOM đã render xong
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', 'html2canvas', () => {
      setTimeout(() => {
        captureAndShowPreview();
      }, 300); // ⏱️ Delay để đảm bảo DOM có sẵn
    });

    loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', 'jspdf');
  }
}, [isOpen, data, detailedPrescription, captureAndShowPreview]);


  if (!isOpen) return null;

  return (
    <div className="pdf-preview-modal">
      <div className="pdf-preview-content">
        <h3>Xem trước Phiếu Thu Tiền Thuốc</h3>
        {pdfPreviewImg ? (
          <img src={pdfPreviewImg} alt="PDF Preview" />
        ) : (
          <p>Đang tạo xem trước...</p>
        )}
        <div className="pdf-preview-actions">
          <button className="close-btn-modal" onClick={onClose}>Đóng</button>
          <button className="export-btn-modal" onClick={handleExportPdf}>Xuất Phiếu Thu Tiền Thuốc PDF</button>
        </div>
      </div>

      <div ref={medicineFeesRef} className="a4-container" style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div className="prescription-header">
          <div>
            <p><strong>PHIẾU THU TIỀN THUỐC</strong></p>
            <h1>BỆNH VIỆN ĐA KHOA WellNest</h1>
            <p>171/3 đường Trường Chinh, phường Tân Thới Nhất, Quận Số phiếu: 100925</p>
            <p>Điện thoại: +84 28 6260 1100 | DĐ: 0974.508.479</p>
          </div>
          <div className="barcode">
            {barcodeBars}
          </div>
        </div>

        <h2 className="prescription-title">PHIẾU THU TIỀN THUỐC</h2>

        <div className="patient-info-grid">
  <p><strong>Họ tên:</strong> {patientName}</p>
    <p style={{ gridColumn: 'span 1' }}><strong>Tên đơn thuốc:</strong> {data?.TenDonThuoc || 'Không có'}</p>
  <p><strong>Số điện thoại:</strong> {phoneNumber}</p>
  <p style={{ gridColumn: 'span 1' }}><strong>Ngày:</strong> {data?.Id_PhieuKhamBenh?.Ngay || 'Không có'}</p>
  <p style={{ gridColumn: 'span 1' }}>
  <strong>Thời gian:</strong> {formatTime(data?.Gio || '')
}
</p>

  <p style={{ gridColumn: 'span 3' }}><strong>Bác sĩ kê đơn:</strong> {doctorName}</p>
</div>

        <h3 className="fee-heading">Chi tiết Thuốc</h3>
        <div className="medicine-table-container">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên thuốc</th>
                <th>ĐVT</th>
                <th>SL</th>
                <th>Đơn giá</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {medicines.length > 0 ? (
                medicines.map((item) => (
                  <tr key={item.stt}>
                    <td>{item.stt}</td>
                    <td>{item.name}</td>
                    <td>{item.dvt}</td>
                    <td>{item.sl}</td>
                    <td>{formatCurrencyVND(item.unitPrice)}</td>
                    <td>{formatCurrencyVND(item.total)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>Không có dữ liệu thuốc</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="total-price-section">
          <p><strong>Tổng chi phí:</strong> <span>{formatCurrencyVND(calculatedTotalMedicinePrice)}</span></p>
        </div>
        <div className="total-price-section discount-line-underline">
          <p><strong>Giảm:</strong> <span>0</span></p>
        </div>
        <div className="total-price-section">
          <p><strong>Tổng thu:</strong> <span>{formatCurrencyVND(calculatedTotalMedicinePrice)}</span></p>
        </div>

        <div className="receipt-signatures">
          <div className="signature-block signature-payer">
            <p className="signature-label">Người nộp tiền</p>
            <p>(Ký, ghi rõ họ tên)</p>
          </div>
          <div className="collector-info-block">
            <div className="signature-date">
              <p>{formattedTime}, Ngày {currentDate.getDate()} tháng {currentDate.getMonth() + 1} năm {currentDate.getFullYear()}</p>
            </div>
            <div className="signature-block signature-collector">
              <p className="signature-label">Người thu tiền</p>
              <p className="signature-name">TRẦN THỊ BÍCH THỦY</p>
              <p>(Ký, ghi rõ họ tên)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}