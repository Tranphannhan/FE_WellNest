'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import './MedicineFees.css'; // Import the CSS file for MedicineFees

interface MedicineFeesProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MedicineFees({ isOpen, onClose }: MedicineFeesProps) {
    const medicineFeesRef = useRef<HTMLDivElement>(null); // Specify type for useRef
    const [pdfPreviewImg, setPdfPreviewImg] = useState('');

    // Static Data based on the image (from previous context)
    const patientName = "H"; // Obscured in image
    const gender = ""; // Not explicitly visible for the patient in the image
    const dateOfBirth = ""; // Not explicitly visible for the patient in the image
    const patientAddress = "41M12A, Phường Trung"; // Obscured in image
    const diagnosis = "Viêm khớp không đặc hiệu";
    const doctorName = "Cao Khả Anh";
    const phoneNumber = "0901 234 567"; // Thêm số điện thoại

    const staticMedicines = [
        {
            stt: 1,
            name: "FORGOUT 40mg 40mg",
            dvt: "Viên",
            sl: 14,
            unitPrice: 13.482,
            total: 188.748,
            usage: "" // Not specified for usage in the image for this medicine
        },
        {
            stt: 2,
            name: "Panadol Extra",
            dvt: "Viên",
            sl: 10,
            unitPrice: 3.500,
            total: 35.000,
        },
        {
            stt: 3,
            name: "Amoxicillin 500mg",
            dvt: "Viên",
            sl: 7,
            unitPrice: 2.000,
            total: 14.000,
        },
    ];

    const calculatedTotalMedicinePrice = staticMedicines.reduce((sum, item) => sum + item.total, 0);

    // Thay đổi dòng này để sử dụng ngày giờ hiện tại
    const currentDate = new Date();
    // formattedTime đã được tạo từ trước, bạn chỉ cần sử dụng nó
    const formattedTime = currentDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

    const barcodeBars = Array.from({ length: 60 }).map((_, index) => {
        const fixedHeight = 50; // Match height from CSS
        const randomWidth = 1 + Math.floor(Math.random() * 4);
        const isSpace = Math.random() < 0.3;
        return isSpace ? (
            <div key={index} className="barcode-space" style={{ width: `${randomWidth * 2}px`, height: `${fixedHeight}px` }}></div>
        ) : (
            <div key={index} className="barcode-bar" style={{ height: `${fixedHeight}px`, width: `${randomWidth}px` }}></div>
        );
    });

    const captureAndShowPreview = useCallback(() => {
        const input = medicineFeesRef.current;
        if (!input) return console.error("Không tìm thấy nội dung để chụp!");

        if (typeof window.html2canvas === 'undefined') {
            console.warn("html2canvas chưa sẵn sàng.");
            return;
        }

        setTimeout(() => {
            window.html2canvas(input, { scale: 2, logging: true, useCORS: true })
                .then((canvas: HTMLCanvasElement) => setPdfPreviewImg(canvas.toDataURL('image/png')))
                .catch((err: string) => console.error("Lỗi khi chụp ảnh:", err));
        }, 100);
    }, []);

    const handleExportPdf = useCallback(() => {
        if (!pdfPreviewImg) return console.error("Chưa có ảnh để xuất PDF.");

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
                pdf.save(`phieu_thu_tien_thuoc_${patientName.replace(/\s/g, '_')}.pdf`);
                onClose();
            };
            tempImg.onerror = (err) => console.error("Không thể tải ảnh để tạo PDF:", err);
        }, 50);
    }, [pdfPreviewImg, onClose, patientName]);

    useEffect(() => {
        if (isOpen) {
            setPdfPreviewImg(''); // Clear previous preview when opening
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

            loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', 'html2canvas', () => {
                captureAndShowPreview();
            });
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', 'jspdf');
        }
    }, [isOpen, captureAndShowPreview]);

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
                        <p>Điện thoại : +84 28 6260 1100 | DĐ:0974.508.479</p>
                    </div>
                    <div className="barcode">
                        {barcodeBars}
                    </div>
                </div>

                <h2 className="prescription-title">PHIẾU THU TIỀN THUỐC</h2>

                <div className="patient-info-grid">
                    <p><strong>Họ tên:</strong> {patientName}</p>
                    <p><strong>Giới tính:</strong> {gender}</p>
                    <p><strong>Năm sinh:</strong> {dateOfBirth}</p>
                    {/* Sử dụng biến phoneNumber ở đây */}
                    <p><strong>Số điện thoại:</strong> {phoneNumber}</p>
                    <p style={{ gridColumn: 'span 2' }}><strong>Địa chỉ:</strong> {patientAddress}</p>
                    <p style={{ gridColumn: '1 / span 3' }}><strong>Chẩn đoán:</strong> {diagnosis}</p>
                    <p style={{ gridColumn: '1 / span 3' }}><strong>Bác sĩ kê đơn:</strong> {doctorName}</p>
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
                            {staticMedicines.map((item) => (
                                <tr key={item.stt}>
                                    <td>{item.stt}</td>
                                    <td>
                                        {item.name}
                                    </td>
                                    <td>{item.dvt}</td>
                                    <td>{item.sl}</td>
                                    <td>{item.unitPrice.toLocaleString('vi-VN')}</td>
                                    <td>{item.total.toLocaleString('vi-VN')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="total-price-section">
                    <p><strong>Tổng chi phí:</strong> <span>{calculatedTotalMedicinePrice.toLocaleString('vi-VN')}</span></p>
                </div>
                {/* Dòng "Giảm" với gạch chân toàn bộ */}
                <div className="total-price-section discount-line-underline">
                    <p><strong>Giảm:</strong> <span>0</span></p>
                </div>
                <div className="total-price-section">
                    <p><strong>Tổng thu:</strong> <span>{calculatedTotalMedicinePrice.toLocaleString('vi-VN')}</span></p>
                </div>

                <div className="receipt-signatures">
                    <div className="signature-block signature-payer">
                        <p className="signature-label">Người nộp tiền</p>
                        <p>(Ký, ghi rõ họ tên)</p>
                    </div>

                    <div className="collector-info-block">
                        <div className="signature-date">
                            {/* Thêm giờ hiện tại vào đây */}
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