'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import './PrintAppointmentForm.css'; // Import the CSS file

interface ServiceItem {
    stt: number; // Số thứ tự
    name: string; // Yêu cầu
    quantity: number; // SL (Số lượng)
    unitPrice: number; // Đơn giá
    performer: string; // Nơi thực hiện
    room: string; // Phòng
}

interface ExaminationFormForPrint {
    fullName: string;

    gender: string;
    dob: string;
    address: string;
    department: string; // Đảm bảo thuộc tính này có mặt
    clinic: string; // This will now represent 'Phòng khám'
    diagnosis: string; // New field for diagnosis
    serviceList: ServiceItem[]; // List of services
}

interface PrintAppointmentFormProps {
    isOpen: boolean;
    onClose: () => void;
    patientData: ExaminationFormForPrint;
    diagnosticianName: string; // Bác sĩ điều trị
    departmentName: string; // Khoa xét nghiệm
}

export default function PrintAppointmentForm({
    isOpen,
    onClose,
    patientData,
    diagnosticianName,
    departmentName,
}: PrintAppointmentFormProps) {
    const [pdfPreviewImg, setPdfPreviewImg] = useState('');
    const prescriptionRef = useRef(null);

    const captureAndShowPreview = useCallback(() => {
        const input = prescriptionRef.current;
        if (!input) {
            console.error("Không tìm thấy nội dung để chụp!");
            return;
        }
        if (typeof window.html2canvas === 'undefined') {
            console.warn("html2canvas chưa sẵn sàng.");
            return;
        }

        setTimeout(() => {
            window.html2canvas(input, { scale: 2, logging: true, useCORS: true })
                .then((canvas: HTMLCanvasElement) => {
                    setPdfPreviewImg(canvas.toDataURL('image/png'));
                })
                .catch((err: string) => {
                    console.error("Lỗi khi chụp ảnh:", err);
                });
        }, 100);
    }, []);

    const handleExportPdf = useCallback(() => {
        if (!pdfPreviewImg) {
            console.error("Chưa có ảnh để xuất PDF.");
            return;
        }
        if (typeof window.jspdf === 'undefined') {
            console.warn("jspdf chưa sẵn sàng.");
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

                pdf.save(`phieu_chi_dinh_${patientData.fullName.replace(/\s/g, '_')}.pdf`);
                onClose();
            };
            tempImg.onerror = (err) => {
                console.error("Không thể tải ảnh để tạo PDF:", err);
            };
        }, 50);
    }, [pdfPreviewImg, onClose, patientData.fullName]);

    useEffect(() => {
        if (isOpen) {
            setPdfPreviewImg(''); // Clear previous preview
            const loadScript = (src: string, globalName: string, callback?: () => void) => {
                if (typeof window[globalName as keyof Window] === 'undefined') {
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
                    <h3>Xem trước Phiếu Chỉ Định</h3>
                    {pdfPreviewImg ? (
                        <img src={pdfPreviewImg} alt="PDF Preview" />
                    ) : (
                        <p>Đang tạo xem trước...</p>
                    )}
                    <div className="pdf-preview-actions">
                        <button className="close-btn-modal" onClick={onClose}>Đóng</button>
                        <button className="export-btn-modal" onClick={handleExportPdf}>Xuất Phiếu PDF</button>
                    </div>
                </div>

                <div ref={prescriptionRef} className="a4-container" style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                    <div className="prescription-header">
                        <div>
                            <p><strong>Phiếu chỉ định</strong></p>
                            <h1>Bệnh viện đa khoa WellNest</h1>
                            <p>171 Đường Trường Chinh Tân Thới Nhất Quận 12 HCM</p>
                            <p>Điện thoại : +84 123456789</p>
                        </div>
                        <div className="barcode">
                            {barcodeBars}
                        </div>
                    </div>

                    <h2 className="prescription-title">Phiếu chỉ định</h2>

                    <div className="patient-info-grid">
                        <p><strong>Họ tên:</strong> {patientData.fullName}</p>
                        <p><strong>Cân nặng:</strong> 0kg</p>
                        <p><strong>Giới tính:</strong> {patientData.gender}</p>
                        <p><strong>Ngày Sinh:</strong> {patientData.dob}</p>
                        <p style={{ gridColumn: 'span 3' }}><strong>Địa chỉ liên hệ:</strong> {patientData.address}</p>
                        <p><strong>Phòng khám:</strong> {patientData.clinic}</p>
                        <p style={{ gridColumn: 'span 2' }}><strong>Chẩn đoán:</strong> {patientData.diagnosis}</p>
                    </div>

                    <div className="service-list">
                        <table className="service-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Yêu cầu</th>
                                    <th>SL</th>
                                    <th>Đơn giá</th>
                                    <th>Nơi thực hiện</th>
                                    <th>Phòng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Thêm hàng nhóm XN nếu cần, hoặc bỏ qua nếu dữ liệu API không phân nhóm */}
                                <tr>
                                    <td colSpan={6} style={{ fontWeight: 'bold', backgroundColor: '#f2f2f2' }}>NHÓM XN CẬN LÂM SÀNG</td>
                                </tr>
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'right', fontStyle: 'italic' }}>Số phiếu: {Math.floor(Math.random() * 1000000)}</td>
                                </tr>
                                {patientData.serviceList.map((item) => (
                                    <tr key={item.stt}>
                                        <td>{item.stt}</td>
                                        <td>{item.name}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.unitPrice.toLocaleString('vi-VN')}</td>
                                        <td>{item.performer}</td>
                                        <td>{item.room}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="receipt-signatures">
                        <div className="signature-block signature-payer">
                            <p className="signature-label">Khoa Xét Nghiệm</p>
                        </div>

                        <div className="collector-info-block">
                            <div className="signature-date">
                                <p>{displayDate}</p>
                            </div>
                            <div className="signature-block signature-collector">
                                <p className="signature-label">Bác sĩ chỉ định</p>
                                <p className="signature-name">{diagnosticianName}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}