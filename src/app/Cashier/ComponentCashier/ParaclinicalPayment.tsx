'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import './ParaclinicalPayment.css';
import { paraclinicalType } from '@/app/types/patientTypes/patient';

interface ParaclinicalPaymentProps {
    isOpen: boolean;
    onClose: () => void;
    dataDetail?: paraclinicalType[];
}

const ParaclinicalPayment: React.FC<ParaclinicalPaymentProps> = ({ isOpen, onClose, dataDetail = [] }) => {
    const paraclinicalPaymentRef = useRef<HTMLDivElement>(null);
    const [pdfPreviewImg, setPdfPreviewImg] = useState('');

    // Dynamic data from props with fallbacks
    const patientName = dataDetail[0]?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.HoVaTen || 'Không có dữ liệu';
    const gender = dataDetail[0]?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.GioiTinh || 'Không có dữ liệu';
    const dateOfBirth = dataDetail[0]?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.NgaySinh || 'Không có dữ liệu';
    const patientAddress = dataDetail[0]?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.DiaChi || 'Không có dữ liệu';
    const doctorName = dataDetail[0]?.Id_PhieuKhamBenh?.Id_Bacsi?.TenBacSi || 'Không có dữ liệu';
    const testDate = dataDetail[0]?.Ngay || 'Không có dữ liệu';
    const testTime = dataDetail[0]?.Gio || 'Không có dữ liệu';

    const services = dataDetail.map((item, index) => ({
        id: index + 1,
        name: item.Id_LoaiXetNghiem?.TenXetNghiem || 'Không xác định',
        unitPrice: item.Id_LoaiXetNghiem?.Id_GiaDichVu?.Giadichvu || 0,
        room: item.Id_LoaiXetNghiem?.Id_PhongThietBi?.TenPhongThietBi || 'Không xác định',
        selfQueueNo: item.STT ?? 'N/A',
        waitingCount: 0,
    }));

    const calculatedTotalServicePrice = services.reduce((sum, item) => sum + item.unitPrice, 0);

    const currentDate = new Date();
    const formattedTime = currentDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

    // Barcode generation
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

    const captureAndShowPreview = useCallback(() => {
        const input = paraclinicalPaymentRef.current;
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
                pdf.save(`giay_xac_nhan_xet_nghiem_${patientName.replace(/\s/g, '_')}.pdf`);
                onClose();
            };
            tempImg.onerror = (err) => console.error("Không thể tải ảnh để tạo PDF:", err);
        }, 50);
    }, [pdfPreviewImg, onClose, patientName]);

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

            <div ref={paraclinicalPaymentRef} className="a4-container" style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                <div className="examination-result-header">
                    <div>
                        <p><strong>Mã phiếu thu</strong></p>
                        <h1>Bệnh viện đa khoa WellNest</h1>
                        <p>171 Đường Trường Chinh Tân Thới Nhất Quận 12 HCM</p>
                        <p>Điện thoại: +84 123456789</p>
                    </div>
                    <div className="barcode">
                        {barcodeBars}
                    </div>
                </div>

                <h2 className="examination-result-title">Phiếu Thu Tiền Dịch Vụ Cận Lâm Sàng</h2>

                <div className="patient-info-grid">
                    <p><strong>Họ tên:</strong> {patientName}</p>
                    <p><strong>Giới tính:</strong> {gender}</p>
                    <p><strong>Ngày sinh:</strong> {dateOfBirth}</p>
                    <p style={{ gridColumn: 'span 3' }}><strong>Địa chỉ:</strong> {patientAddress}</p>
                    <p><strong>Bác sĩ chỉ định:</strong> {doctorName}</p>
                    <p><strong>Ngày xét nghiệm:</strong> {testDate}</p>
                    <p><strong>Giờ xét nghiệm:</strong> {testTime}</p>
                </div>

                <h3 className="section-heading">Chi tiết Dịch vụ Cận lâm sàng</h3>
                <div className="diagnosis-treatment-table-container">
                    <table className="diagnosis-treatment-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên dịch vụ</th>
                                <th>Giá</th>
                                <th>Phòng thực hiện</th>
                                <th>Số thứ tự</th>
                                <th>Số người chờ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.unitPrice.toLocaleString('vi-VN')} ₫</td>
                                    <td>{item.room}</td>
                                    <td>{item.selfQueueNo}</td>
                                    <td>{item.waitingCount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="total-price-section">
                    <p><strong>Tổng tiền:</strong> <span style={{ color: 'red', fontWeight: '600' }}>{calculatedTotalServicePrice.toLocaleString('vi-VN')} ₫</span></p>
                </div>

                <div className="receipt-signatures">
                    <div className="signature-block signature-patient">
                        <p className="signature-label">Người thanh toán</p>
                        <div className="signature-placeholder"></div>
                    </div>

                    <div className="doctor-info-block">
                        <div className="signature-date">
                            <p>{formattedTime} Ngày {currentDate.getDate()}, Tháng {currentDate.getMonth() + 1}, Năm {currentDate.getFullYear()}</p>
                        </div>
                        <div className="signature-block signature-collector">
                            <p className="signature-label">Người thu tiền</p>
                            <p className="signature-name">Trần Thị Bích Thủy</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParaclinicalPayment;