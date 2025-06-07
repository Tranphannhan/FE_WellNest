// PreviewExaminationForm.tsx
'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react';
import './ExaminationForm.css';

// PreviewExaminationForm.tsx

interface PreviewExaminationFormProps {
    isOpen: boolean;
    onClose: () => void;
    patientData: {
        fullName: string;
        cccd: string;
        dob: string;
        phone: string;
        gender: string;
        height: string;
        weight: string;
        clinic: string;
        department: string;
        address: string;
        reason: string;
    };
    collectorName: string;
}

export default function PreviewExaminationForm({ isOpen, onClose, patientData,collectorName  }: PreviewExaminationFormProps) {
    const [pdfPreviewImg, setPdfPreviewImg] = useState('');
    const prescriptionRef = useRef(null);

    // --- FIXED: Define fixed services/fees data ---
    // Thay thế generateRandomServices bằng dữ liệu cố định
    const fixedServiceList = [
        {
            name: "Khám ngoại cơ xương khớp",
            quantity: 1,
            unitPrice: 85000,
            total: 85000,
        },
        // Bạn có thể thêm các mục cố định khác vào đây nếu muốn, ví dụ:
        {
            name: "Xét nghiệm máu",
            quantity: 1,
            unitPrice: 150000,
            total: 150000,
        },
        {
            name: "Thuốc A",
            quantity: 2,
            unitPrice: 25000,
            total: 50000,
        }
    ];

    const [serviceList, setServiceList] = useState<any[]>([]); // Sẽ được set bằng fixedServiceList

    // Tính toán tổng chi phí, giảm và tổng thu
    const totalCost = serviceList.reduce((sum, item) => sum + item.total, 0);
    const discount = 0; // Luôn là 0 như trong ảnh mẫu
    const grandTotal = totalCost - discount;

    const captureAndShowPreview = useCallback(() => {
        const input = prescriptionRef.current;
        if (!input) {
            console.error("PrescriptionDisplay element not found for capture!");
            return;
        }

        if (!(window as any).html2canvas) {
            console.warn("html2canvas not yet loaded. Cannot capture preview.");
            return;
        }

        setTimeout(() => {
            (window as any).html2canvas(input, { scale: 2, logging: true, useCORS: true }).then((canvas: HTMLCanvasElement) => {
                setPdfPreviewImg(canvas.toDataURL('image/png'));
            }).catch((err: any) => {
                console.error("Lỗi khi chụp ảnh phiếu khám:", err);
            });
        }, 100);
    }, []);

    const handleExportPdf = useCallback(() => {
        if (!pdfPreviewImg) {
            console.error("No image data for PDF export. Please capture preview first.");
            return;
        }

        if (!(window as any).jspdf) {
            console.warn("jspdf not yet loaded. Cannot export PDF.");
            return;
        }

        setTimeout(() => {
            const { jsPDF } = (window as any).jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');

            const imgWidth = 210;
            const pageHeight = 297;

            const tempImg = new Image();
            tempImg.src = pdfPreviewImg;
            tempImg.onload = () => {
                const imgHeight = (tempImg.height * imgWidth) / tempImg.width;
                let heightLeft = imgHeight;
                let position = 0;

                pdf.addImage(pdfPreviewImg, 'PNG', 0, position, imgWidth, imgHeight); // Sử dụng pdfPreviewImg
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(pdfPreviewImg, 'PNG', 0, position, imgWidth, imgHeight); // Sử dụng pdfPreviewImg
                    heightLeft -= pageHeight;
                }

                pdf.save(`phieu_thu_vien_phi_${patientData.fullName.replace(/\s/g, '_')}.pdf`);
                onClose();
            };
            tempImg.onerror = (err: any) => {
                console.error("Error loading image for PDF generation:", err);
            };
        }, 50);
    }, [pdfPreviewImg, onClose, patientData.fullName]);


    useEffect(() => {
        if (isOpen) {
            setPdfPreviewImg('');
            setServiceList(fixedServiceList); // *** Dùng dữ liệu cố định ở đây ***

            const loadScript = (src: string, globalName: string, callback?: () => void) => {
                if (!(window as any)[globalName]) {
                    const script = document.createElement('script');
                    script.src = src;
                    script.onload = () => {
                        console.log(`${globalName} loaded`);
                        if (callback) callback();
                    };
                    script.onerror = (e) => console.error(`Failed to load ${globalName} script:`, e);
                    document.head.appendChild(script);
                } else {
                    console.log(`${globalName} already loaded.`);
                    if (callback) callback();
                }
            };

            loadScript(
                'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
                'html2canvas',
                () => {
                    if (isOpen) {
                        captureAndShowPreview();
                    }
                }
            );

            loadScript(
                'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
                'jspdf'
            );
        }
    }, [isOpen, captureAndShowPreview]);


    if (!isOpen) return null;

    const currentDate = new Date();
    // Lấy giờ, phút hiện tại và format theo mẫu 7:24
    const formattedTime = currentDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).replace(':', ':');
    // Lấy Ngày, Tháng, Năm hiện tại và format theo mẫu Ngày 5, Tháng 6, Năm 2024
    const formattedDate = `Ngày ${currentDate.getDate()}, Tháng ${currentDate.getMonth() + 1}, Năm ${currentDate.getFullYear()}`;


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

            {/* The main content to be captured */}
            <div ref={prescriptionRef} className="a4-container" style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                <div className="prescription-header">
                    <div>
                        <p><strong>Phiếu thu viện phí</strong></p>
                        <h1>Bệnh viện đa khoa WellNest</h1>
                        <p>171 Đường Trường Chinh Tân Thới Nhất Quận 12 HCM</p>
                        <p>Điện thoại : +84 123456789</p>
                    </div>
                    {/* Barcode generation (fixed height, random width) */}
                    <div className="barcode">
                        {Array.from({ length: 60 }).map((_, index) => {
                            const fixedHeight = 60; // Fixed height for all bars
                            const randomWidth = 1 + Math.floor(Math.random() * 4); // Random width (1px to 4px)
                            const isSpace = Math.random() < 0.3; // 30% chance for a space

                            if (isSpace) {
                                return (
                                    <div
                                        key={index}
                                        className="barcode-space"
                                        style={{ width: `${randomWidth * 2}px`, height: `${fixedHeight}px` }}
                                    ></div>
                                );
                            } else {
                                return (
                                    <div
                                        key={index}
                                        className="barcode-bar"
                                        style={{ height: `${fixedHeight}px`, width: `${randomWidth}px` }}
                                    ></div>
                                );
                            }
                        })}
                    </div>
                </div>

                <h2 className="prescription-title">Phiếu Thu Tiền Khám Bệnh</h2>

                <div className="patient-info-grid">
                    <p><strong>Họ tên:</strong> {patientData.fullName}</p>
                    <p><strong>Cân nặng:</strong> {patientData.weight}kg</p>
                    <p><strong>Giới tính:</strong> {patientData.gender}</p>
                    <p><strong>Ngày Sinh:</strong> {patientData.dob}</p>
                    <p style={{ gridColumn: 'span 3' }}><strong>Địa chỉ liên hệ:</strong> {patientData.address}</p>
                    <p style={{ gridColumn: 'span 1' }}><strong>Phòng khám:</strong> {patientData.clinic}</p>
                </div>

                {/* --- Fee/Service List --- */}
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

                {/* --- End Fee/Service List --- */}

                {/* --- Summary Section (Tổng chi phí, Giảm, Tổng thu) --- */}
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