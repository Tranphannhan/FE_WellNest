'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import './ParaclinicalPayment.css'; // Import the CSS file for ParaclinicalPayment

interface ParaclinicalPaymentProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ParaclinicalPayment({ isOpen, onClose }: ParaclinicalPaymentProps) {
    const paraclinicalPaymentRef = useRef<HTMLDivElement>(null); // Specify type for useRef
    const [pdfPreviewImg, setPdfPreviewImg] = useState('');

    // Static Data for the Paraclinical Payment Confirmation
    const patientName = "NGUYỄN VĂN A"; // Example patient name
    const patientId = "BN0012345"; // Example patient ID
    const gender = "Nam";
    const dateOfBirth = "1990";
    const patientAddress = "123 Đường ABC, Quận XYZ, TP.HCM";
    const doctorName = "BS. Trần Thị Hạnh"; // Example referring doctor

    // Sample data for services
    const services = [
        {
            id: 1,
            name: "Xét nghiệm máu tổng quát",
            unitPrice: 250000,
            room: "Phòng Xét nghiệm Hóa sinh",
            selfQueueNo: 6, // Số thứ tự của bản thân (số nguyên)
            waitingCount: 5, // Số người đang chờ
        },
        {
            id: 2,
            name: "Xét nghiệm nước tiểu",
            unitPrice: 100000,
            room: "Phòng Xét nghiệm Nước tiểu",
            selfQueueNo: 3,
            waitingCount: 2,
        },
        {
            id: 3,
            name: "Siêu âm bụng tổng quát",
            unitPrice: 300000,
            room: "Phòng Siêu âm 1",
            selfQueueNo: 4,
            waitingCount: 3,
        },
        {
            id: 4,
            name: "Chụp X-quang ngực",
            unitPrice: 200000,
            room: "Phòng Chụp X-quang",
            selfQueueNo: 2,
            waitingCount: 1,
        }
    ];

    const calculatedTotalServicePrice = services.reduce((sum, item) => sum + item.unitPrice, 0);

    const currentDate = new Date();
    const formattedTime = currentDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

    // Barcode generation (similar to MedicineFees)
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

    const captureAndShowPreview = useCallback(() => {
        const input = paraclinicalPaymentRef.current;
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
                pdf.save(`giay_xac_nhan_xet_nghiem_${patientName.replace(/\s/g, '_')}.pdf`);
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

            // Load html2canvas and jspdf
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
                <h3>Xem trước Giấy Xác nhận Thanh toán Xét nghiệm</h3>
                {pdfPreviewImg ? (
                    <img src={pdfPreviewImg} alt="PDF Preview" />
                ) : (
                    <p>Đang tạo xem trước...</p>
                )}
                <div className="pdf-preview-actions">
                    <button className="close-btn-modal" onClick={onClose}>Đóng</button>
                    <button className="export-btn-modal" onClick={handleExportPdf}>Xuất Giấy Xác nhận PDF</button>
                </div>
            </div>

            {/* Đây là phần nội dung sẽ được chụp và xuất ra PDF */}
            <div ref={paraclinicalPaymentRef} className="a4-container" style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                <div className="paraclinical-header">
                    <div>
                        <p><strong >GIẤY XÁC NHẬN THANH TOÁN</strong></p>
                        <h1 style={{color:"blue"}}>BỆNH VIỆN ĐA KHOA WELLNEST</h1>
                        <p>171/3 đường Trường Chinh, phường Tân Thới Nhất, Quận Tân Bình, TP.HCM</p>
                        <p>Điện thoại : +84 28 6260 1100 | DĐ:0974.508.479</p>
                    </div>
                    <div className="barcode">
                        {barcodeBars}
                    </div>
                </div>

                <h2 className="paraclinical-title" style={{color:"blue"}}>PHIẾU THU TIỀN DỊCH VỤ CẬN LÂM SÀNG</h2>

                <div className="patient-info-grid">
                    <p><strong>Mã bệnh nhân:</strong> {patientId}</p>
                    <p><strong>Họ tên:</strong> {patientName}</p>
                    <p><strong>Giới tính:</strong> {gender}</p>
                    <p><strong>Năm sinh:</strong> {dateOfBirth}</p>
                    <p style={{ gridColumn: '1 / span 3' }}><strong>Địa chỉ:</strong> {patientAddress}</p>
                    <p style={{ gridColumn: '1 / span 3' }}><strong>Bác sĩ chỉ định:</strong> {doctorName}</p>
                </div>

                <h3 className="service-heading">Chi tiết Dịch vụ Cận lâm sàng</h3>
                <div className="service-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên dịch vụ</th>
                                <th>Giá</th>
                                <th>Phòng thực hiện</th>
                                <th>STT của bạn</th>
                                <th>Số người chờ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.unitPrice.toLocaleString('vi-VN')} VNĐ</td>
                                    <td>{item.room}</td>
                                    <td>{item.selfQueueNo}</td>
                                    <td>{item.waitingCount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="total-price-section discount-line-underline">
                    <p><strong>Tổng cộng:</strong> <span>{calculatedTotalServicePrice.toLocaleString('vi-VN')} VNĐ</span></p>
                </div>
                <div className="total-price-section ">
                    <p><strong>Đã thanh toán:</strong> <span>{calculatedTotalServicePrice.toLocaleString('vi-VN')} VNĐ</span></p>
                </div>

                <div className="receipt-signatures">
                    <div className="signature-block signature-payer">
                        <p className="signature-label">Người thanh toán</p>
                        <p>(Ký, ghi rõ họ tên)</p>
                    </div>

                    <div className="collector-info-block">
                        <div className="signature-date">
                            <p>Ngày {currentDate.getDate()} tháng {currentDate.getMonth() + 1} năm {currentDate.getFullYear()} lúc {formattedTime}</p>
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