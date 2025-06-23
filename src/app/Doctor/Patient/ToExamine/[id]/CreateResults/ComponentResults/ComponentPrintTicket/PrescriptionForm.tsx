// File: PreviewExaminationForm.tsx
'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import './PrescriptionForm.css'; // Import the CSS file (for prescription)
// Assuming PrescriptionDetail is correctly imported from its actual path.
// Adjust this import path if 'Prescription' is not the correct file for PrescriptionDetail.
import { PrescriptionDetail } from '../../CreateResultsComponent/Prescription';
import { MedicalExaminationCard } from '@/app/types/patientTypes/patient';


interface PreviewExaminationFormProps {
    isOpen: boolean;
    onClose: () => void;
    patientData?: MedicalExaminationCard;
    prescriptionMedicines?: PrescriptionDetail[]; // NEW PROP: Array of PrescriptionDetail
}

export default function PreviewExaminationForm({
    isOpen,
    onClose,
    patientData,
    prescriptionMedicines = [] // Default to an empty array if not provided
}: PreviewExaminationFormProps) {
    const [pdfPreviewImg, setPdfPreviewImg] = useState('');
    const [totalMedicinePrice, setTotalMedicinePrice] = useState(0); // NEW: State for total medicine price
    const prescriptionRef = useRef(null);

    // NEW: Function to calculate total medicine price
    const calculateTotalMedicinePrice = useCallback(() => {
        const total = prescriptionMedicines.reduce((sum, item) => {
            // Ensure Id_Thuoc and Gia exist before calculating
            const price = item.Id_Thuoc?.Gia || 0;
            const quantity = item.SoLuong || 0;
            return sum + (price * quantity);
        }, 0);
        setTotalMedicinePrice(total);
    }, [prescriptionMedicines]);


    const captureAndShowPreview = useCallback(() => {
        const input = prescriptionRef.current;
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
                pdf.save(`don_thuoc_${patientData?.Id_TheKhamBenh?.HoVaTen?.replace(/\s/g, '_') || 'unknown_patient'}.pdf`);
                onClose();
            };
            tempImg.onerror = (err) => console.error("Không thể tải ảnh để tạo PDF:", err);
        }, 50);
    }, [pdfPreviewImg, onClose, patientData?.Id_TheKhamBenh?.HoVaTen]);

    useEffect(() => {
        if (isOpen) {
            setPdfPreviewImg('');
            calculateTotalMedicinePrice(); // NEW: Calculate total price when the modal opens
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
    }, [isOpen, captureAndShowPreview, calculateTotalMedicinePrice]); // Add calculateTotalMedicinePrice to dependencies

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
                        <p><strong>Họ tên:</strong> {patientData?.Id_TheKhamBenh?.HoVaTen}</p>
                        <p><strong>Giới tính:</strong> {patientData?.Id_TheKhamBenh?.GioiTinh}</p>
                        <p><strong>Ngày Sinh:</strong> {patientData?.Id_TheKhamBenh?.NgaySinh}</p>
                        <p><strong>Phòng Khám:</strong> {patientData?.Id_Bacsi?.Id_PhongKham?.SoPhongKham}</p>
                        <p style={{ gridColumn: 'span 2' }}><strong>Địa chỉ liên hệ:</strong> {patientData?.Id_TheKhamBenh?.DiaChi}</p>
                        <p style={{ gridColumn: 'span 3' }}><strong>Chẩn đoán:</strong> {patientData?.results || 'Không có'}</p>

                    </div>

                    <h3 className="fee-heading">Toa Thuốc Dịch Vụ</h3>
                    <div className="medicine-list">
                        {prescriptionMedicines.length > 0 ? (
                            prescriptionMedicines.map((item, i) => (
                                <div key={item._id} className="medicine-item">
                                    <div>
                                        <p>{i + 1}. {item.Id_Thuoc?.TenThuoc} -{item.DonVi || item.Id_Thuoc?.DonVi}</p>
                                        <p>Uống: {item.NhacNho || "Sử dụng theo hướng dẫn"}</p>
                                    </div>
                                    <div className="pill-count">
                                        <div className='pill-count-text'>
                                            <span>Số lượng:</span>
                                            <span>{item.SoLuong}</span>
                                        </div>
                                        <div className='pill-count-text'>
                                            <span>Giá tổng:</span>
                                            <span>{(item.Id_Thuoc?.Gia * item.SoLuong)?.toLocaleString()} ₫</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Chưa có thuốc trong đơn.</p>
                        )}
                    </div>

                    {/* NEW: Display total medicine price here */}
                    <div className="total-price-section">
                        <p><strong>Tổng tiền thuốc:</strong> <span style={{color:'red', fontWeight:'600'}}>{totalMedicinePrice.toLocaleString()} ₫</span></p>
                    </div>

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
                                <p className="signature-name">{patientData?.Id_Bacsi?.TenBacSi}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}