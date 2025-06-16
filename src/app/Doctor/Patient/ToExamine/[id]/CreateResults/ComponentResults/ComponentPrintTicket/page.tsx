// File: Home.tsx
'use client'; // Đánh dấu đây là Client Component trong Next.js

import React, { useState } from 'react';
import './PrescriptionForm'
import './PreviewExaminationResult.css'
// Import các component popup đã được tách biệt
import PreviewExaminationForm from './PrescriptionForm'; // Component cho "Đơn Thuốc" (Đã chỉnh lại tên import nếu file là PreviewExaminationForm.tsx)
import PrintAppointmentForm from './PrintAppointmentForm';  // Component cho "Phiếu Chỉ Định Xét Nghiệm"
import PreviewExaminationResult from './PreviewExaminationResult'; // Import the new component for "Phiếu Kết Quả Khám"

// --- Mock Types for Data ---
// Các interface này nên được định nghĩa trong một file chung
// (ví dụ: app/types/receptionTypes/receptionTypes.ts)
// Nếu bạn đã import từ file chung, hãy xóa các định nghĩa này tại đây.

// Type cho dữ liệu của Đơn Thuốc (PreviewExaminationForm)
interface ExaminationFormDonThuoc {
    fullName: string;
    weight: number;
    gender: string;
    dob: string;
    address: string;
    department: string; // Khoa khám
    price: number; // Giá khám (có thể không hiển thị trên đơn thuốc)
    clinic: string; // Phòng khám
    QueueNumber: string; // Số thứ tự khám (có thể không hiển thị trên đơn thuốc)
}

// Type cho các mục dịch vụ trong Phiếu Chỉ Định Xét Nghiệm
interface ServiceItemPhieuChiDinh {
    stt: number; // Số thứ tự
    name: string; // Yêu cầu
    quantity: number; // SL (Số lượng)
    unitPrice: number; // Đơn giá
    performer: string; // Nơi thực hiện
    room: string; // Phòng
}

// Type cho dữ liệu của Phiếu Chỉ Định Xét Nghiệm (PrintAppointmentForm)
interface ExaminationFormPhieuChiDinh {
    fullName: string;
    weight: number;
    gender: string;
    dob: string;
    address: string;
    department: string; // Đã thêm vào để khớp với PrintAppointmentFormProps
    clinic: string; // Phòng khám
    diagnosis: string; // Chuẩn đoán
    serviceList: ServiceItemPhieuChiDinh[]; // Danh sách các dịch vụ xét nghiệm
}

// Type cho dữ liệu của Phiếu Kết Quả Khám (PreviewExaminationResult)
// NÊN trùng với interface ExaminationResultData đã định nghĩa trong PreviewExaminationResult.tsx

interface DiagnosisTreatmentPair {
    diagnosis: string;
    treatmentPlan: string;
    itemNotes?: string; // THÊM MỚI: Ghi chú cho từng mục (đã thêm)
}

interface ExaminationResultData {
    fullName: string;
    weight: number;
    gender: string;
    dob: string;
    address: string;
    clinic:string;
    notes?: string; // THÊM MỚI: Ghi chú chung của phiếu (đã thêm)
    diagnosisTreatmentList: DiagnosisTreatmentPair[];
}


// --- Component chính của trang (được đặt tên là Home cho page.tsx) ---
export default function Home() {
    // State để điều khiển việc mở/đóng popup Đơn Thuốc
    const [isDonThuocModalOpen, setIsDonThuocModalOpen] = useState(false);
    // State để điều khiển việc mở/đóng popup Phiếu Chỉ Định Xét Nghiệm
    const [isPhieuChiDinhModalOpen, setIsPhieuChiDinhModalOpen] = useState(false);
    // State để điều khiển việc mở/đóng popup Phiếu Kết Quả Khám
    const [isExaminationResultModalOpen, setIsExaminationResultModalOpen] = useState(false); // New state

    // --- Dữ liệu giả lập (Mock Data) cho Đơn Thuốc ---
    const mockPatientDataDonThuoc: ExaminationFormDonThuoc = {
        fullName: "Nguyễn Văn Hưng",
        weight: 75,
        gender: "Nam",
        dob: "1990/05/15", //YYYY/MM/DD
        address: "171 Đường Trường Chinh Tân Thới Nhất Quận 12 HCM",
        department: "Nội",
        price: 350000, // Ví dụ: giá khám
        clinic: "Phòng 201",
        QueueNumber: "A007",
    };
    const mockCollectorNameDonThuoc = "Dr. Nguyễn Thị Thoa"; // Bác sĩ kê đơn

    // --- Dữ liệu giả lập (Mock Data) cho Phiếu Chỉ Định Xét Nghiệm ---
    const mockPatientDataPhieuChiDinh: ExaminationFormPhieuChiDinh = {
        fullName: "Trần Thị Lan",
        weight: 55,
        gender: "Nữ",
        dob: "1995/10/20", //YYYY/MM/DD
        address: "456 Đường Nguyễn Huệ Quận 1 HCM",
        department: "PK Da liễu", // Đã thêm vào để khớp với PrintAppointmentFormProps
        clinic: "PK Da liễu",
        diagnosis: "Viêm da cơ địa; Nấm ngoài da",
        serviceList: [
            {
                stt: 1,
                name: "Tổng phân tích tế bào máu",
                quantity: 1,
                unitPrice: 85000,
                performer: "Khoa Huyết học",
                room: "",
            },
            {
                stt: 2,
                name: "Định lượng Glucose (Máu)",
                quantity: 1,
                unitPrice: 40000,
                performer: "Khoa Sinh hóa",
                room: "",
            },
            {
                stt: 3,
                name: "X-quang ngực thẳng",
                quantity: 1,
                unitPrice: 150000,
                performer: "Khoa Chẩn đoán hình ảnh",
                room: "Phòng XQ1",
            },
        ],
    };
    const mockDiagnosticianNamePhieuChiDinh = "BS. CKH Nguyễn Văn B";
    const mockDepartmentNamePhieuChiDinh = "KHOA XÉT NGHIỆM"; // Hoặc "KHOA CHẨN ĐOÁN HÌNH ẢNH" tùy mục đích

    // --- Dữ liệu giả lập (Mock Data) cho Phiếu Kết Quả Khám (ĐÃ CẬP NHẬT HOÀN CHỈNH) ---
    const mockPatientDataExaminationResult: ExaminationResultData = { // New mock data
        fullName: "Lê Thị Hoa",
        weight: 60,
        gender: "Nữ",
        dob: "1988/11/03",
        address: "789 Đường Hàm Nghi, Quận 1, TP.HCM",
        clinic:"Phòng 101",
        notes: "Bệnh nhân cần ăn kiêng tinh bột và đường do tiền sử gia đình có người bị tiểu đường. Theo dõi chặt chẽ cân nặng và chỉ số đường huyết sau 3 tháng. Hạn chế stress. Tái khám đúng hẹn.", // Ghi chú chung của phiếu
        diagnosisTreatmentList: [ // Cấu trúc mới
            {
                diagnosis: "Viêm dạ dày cấp tính.",
                treatmentPlan: "Kê đơn thuốc giảm tiết acid (Omeprazole), thuốc bảo vệ niêm mạc dạ dày (Sucralfate).",
                itemNotes: "Uống thuốc sau bữa ăn, tránh nằm ngay sau khi ăn.", // Ghi chú thêm cho mục này
            },
            {
                diagnosis: "Hội chứng trào ngược dạ dày thực quản.",
                treatmentPlan: "Tư vấn chế độ ăn uống khoa học, tránh đồ ăn cay nóng, chua, nhiều dầu mỡ. Nâng cao đầu giường khi ngủ.",
                itemNotes: "Tránh các thức ăn gây kích thích như cà phê, sô cô la.", // Ghi chú thêm cho mục này
            },
            {
                diagnosis: "Thiếu máu nhẹ do thiếu sắt.",
                treatmentPlan: "Bổ sung sắt qua đường uống, theo dõi công thức máu định kỳ. Tư vấn thực phẩm giàu sắt.",
                itemNotes: "Uống sắt cùng vitamin C để tăng hấp thu (ví dụ: nước cam).", // Ghi chú thêm cho mục này
            },
            {
                diagnosis: "Tăng huyết áp vô căn (mới phát hiện).",
                treatmentPlan: "Khởi trị thuốc hạ áp (vd: Losartan). Tư vấn thay đổi lối sống: giảm muối, tăng cường vận động, giảm căng thẳng.",
                itemNotes: "Đo huyết áp tại nhà hàng ngày vào cùng một thời điểm.", // Ghi chú thêm cho mục này
            },
            {
                diagnosis: "Đau đầu căng thẳng mãn tính.",
                treatmentPlan: "Kết hợp thuốc giảm đau không kê đơn, liệu pháp thư giãn, vật lý trị liệu. Hạn chế các yếu tố kích hoạt.",
                itemNotes: "Cân nhắc liệu pháp tâm lý nếu stress kéo dài.", // Ghi chú thêm cho mục này
            },
        ],
    };
    const mockDoctorNameExaminationResult = "BS. CKII Phạm Thu Lan"; // Bác sĩ khám

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="flex gap-4 mb-8"> {/* Container for buttons */}
                <button
                    onClick={() => setIsDonThuocModalOpen(true)}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
                >
                    Xem trước Đơn Thuốc
                </button>

                <button
                    onClick={() => setIsPhieuChiDinhModalOpen(true)}
                    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200"
                >
                    Xem trước Phiếu Chỉ Định Xét Nghiệm
                </button>

                <button // New button for Examination Result
                    onClick={() => setIsExaminationResultModalOpen(true)}
                    className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-200"
                >
                    Xem trước Phiếu Kết Quả Khám
                </button>
            </div>

            {/* Modal for Đơn Thuốc */}
            {isDonThuocModalOpen && (
                <PreviewExaminationForm
                    isOpen={isDonThuocModalOpen}
                    onClose={() => setIsDonThuocModalOpen(false)}
                    patientData={mockPatientDataDonThuoc}
                    collectorName={mockCollectorNameDonThuoc}
                />
            )}

            {/* Modal for Phiếu Chỉ Định Xét Nghiệm */}
            {isPhieuChiDinhModalOpen && (
                <PrintAppointmentForm
                    isOpen={isPhieuChiDinhModalOpen}
                    onClose={() => setIsPhieuChiDinhModalOpen(false)}
                    patientData={mockPatientDataPhieuChiDinh}
                    diagnosticianName={mockDiagnosticianNamePhieuChiDinh}
                    departmentName={mockDepartmentNamePhieuChiDinh}
                />
            )}

            {/* Modal for Phiếu Kết Quả Khám */}
            {isExaminationResultModalOpen && (
                <PreviewExaminationResult // Render the new component
                    isOpen={isExaminationResultModalOpen}
                    onClose={() => setIsExaminationResultModalOpen(false)}
                    patientData={mockPatientDataExaminationResult}
                    doctorName={mockDoctorNameExaminationResult}
                />
            )}
        </div>
    );
}