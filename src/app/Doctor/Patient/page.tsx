'use client'
import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import './Patient.css'
import { doctorTemporaryTypes } from "@/app/types/doctorTypes/doctorTemporaryTypes";
import { useEffect, useState } from "react";

export default function Patient(){
    const [patientRecords, setPatientRecords] = useState<doctorTemporaryTypes[]>([]);

    useEffect(() => {
   
    const fetchPatientData = async () => {
        try {
            const staticData: doctorTemporaryTypes[] = [
                {
                    "_id": "68381c373aae822ec88ac814",
                    "Id_TheKhamBenh": {
                        "_id": "6846f6da8b70d4b33ddcf8e3",
                        "HoVaTen": "Trần Phan Nhân",
                        "GioiTinh": "Nam",
                        "NgaySinh": "2005-05-14",
                        "SoDienThoai": "0912345678", // Using actual phone number for SĐT
                        "SoBaoHiemYTe": "BHYT000001", // Using actual BHYT for the column
                        "DiaChi": "Số Nhà 359, Ấp Rạch Cát, Long Hựu Đông, Cần Đước, Long An",
                        "SoCCCD": "080205004041",
                        "SDT_NguoiThan": "0987654321",
                        "LichSuBenh": "ok",
                        "__v": 0
                    },
                    "Id_NguoiTiepNhan": "6803b9e570cd96d5cde6d78e",
                    "Ngay": "2025-06-10", // Current date: June 10, 2025
                    "TrangThaiThanhToan": true,
                    "STTKham": "3",
                    "TrangThai": false,
                    "TrangThaiHoatDong": "Kham",
                    "__v": 0,
                    "Id_GiaDichVu": "683420eb8b7660453369dce1",
                    "Id_Bacsi": "68285855ca36eca7118a0859"
                },
                {
                    "_id": "68381c373aae822ec88ac815",
                    "Id_TheKhamBenh": {
                        "_id": "6846f6da8b70d4b33ddcf8e4",
                        "HoVaTen": "Lê Thị B",
                        "GioiTinh": "Nữ",
                        "NgaySinh": "1990-11-20",
                        "SoDienThoai": "0901234567",
                        "SoBaoHiemYTe": "BHYT000002",
                        "DiaChi": "123 Đường ABC, Quận XYZ, TP.HCM",
                        "SoCCCD": "012345678901",
                        "SDT_NguoiThan": "0909876543",
                        "LichSuBenh": "Tiểu đường",
                        "__v": 0
                    },
                    "Id_NguoiTiepNhan": "6803b9e570cd96d5cde6d78e",
                    "Ngay": "2025-06-10",
                    "TrangThaiThanhToan": false,
                    "STTKham": "4",
                    "TrangThai": true,
                    "TrangThaiHoatDong": "Cho Kham",
                    "__v": 0,
                    "Id_GiaDichVu": "683420eb8b7660453369dce2",
                    "Id_Bacsi": "68285855ca36eca7118a0859"
                },
                {
                    "_id": "68381c373aae822ec88ac816",
                    "Id_TheKhamBenh": {
                        "_id": "6846f6da8b70d4b33ddcf8e5",
                        "HoVaTen": "Phạm Văn C",
                        "GioiTinh": "Nam",
                        "NgaySinh": "1985-03-01",
                        "SoDienThoai": "0934567890",
                        "SoBaoHiemYTe": "BHYT000003",
                        "DiaChi": "456 Đường DEF, Quận UVW, Hà Nội",
                        "SoCCCD": "023456789012",
                        "SDT_NguoiThan": "0945678901",
                        "LichSuBenh": "Huyết áp cao",
                        "__v": 0
                    },
                    "Id_NguoiTiepNhan": "6803b9e570cd96d5cde6d78e",
                    "Ngay": "2025-06-10",
                    "TrangThaiThanhToan": true,
                    "STTKham": "5",
                    "TrangThai": false,
                    "TrangThaiHoatDong": "Hoan Tat",
                    "__v": 0,
                    "Id_GiaDichVu": "683420eb8b7660453369dce3",
                    "Id_Bacsi": "68285855ca36eca7118a0859"
                }
            ];
            setPatientRecords(staticData); // For this example, setting static data
        } catch (err) {
           console.error("Lỗi khi parse dữ liệu:", err);
        }
    };
    fetchPatientData();
}, []);

    return(
        <>
            <Tabbar
            tabbarItems={{
                tabbarItems: [
                { text: 'Thông tin bệnh nhân', link: '/Doctor/Patient' },
                { text: 'Danh sách bệnh nhân bỏ qua', link: '/Doctor/Patient/ListPatientsMissed' },
                { text: 'Lịch sử khám hôm nay', link: '/Doctor/Patient/MedicalHistory' },
                ],
            }}
            />

                <div className="Patient-container">
                    <div className="search-reception-container">
                        <div className="search-box-wrapper">
                            <div className="search-box">
                                <input
                                type="text"
                                placeholder="Hãy nhập số điện thoại"
                                className="search-input"
                                />
                                <button className="search-btn">
                                <i className="bi bi-search"></i>
                                </button>
                            </div>
                            <div className="search-box">
                                <input
                                type="text"
                                placeholder="Hãy nhập tên"
                                className="search-input"
                                />
                                <button className="search-btn">
                                <i className="bi bi-search"></i>
                                </button>
                            </div>
                        </div>
                </div>
    <table className="Patient-container_table">
        <thead>
            <tr>
                <th>STT</th>
                <th>Họ và tên</th>
                <th>SĐT</th>
                <th>Số Bảo Hiểm Y Tế</th>
                <th>Số Căn Cước</th>
                <th>Ngày</th>
                <th>SĐT người thân</th>
                <th>Hành động</th>
            </tr>
        </thead>
        <tbody>
                        {patientRecords.map((record: doctorTemporaryTypes, index: number) => (
                            <tr key={record._id}> {/* Use _id as a unique key */}
                                <td>{record.STTKham}</td> {/* STTKham is a string, so display directly */}
                                <td>{record.Id_TheKhamBenh.HoVaTen}</td>
                                <td>{record.Id_TheKhamBenh.SoDienThoai}</td>
                                <td>{record.Id_TheKhamBenh.SoBaoHiemYTe}</td>
                                <td>{record.Id_TheKhamBenh.SoCCCD}</td>
                                <td>{record.Ngay}</td>
                                <td>{record.Id_TheKhamBenh.SDT_NguoiThan}</td>
                                <td>
                                        <button className="btn-primary">Khám</button>
                                        <button className="btn-danger">Không có mặt</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
    </table>
</div>
        </>
    )
}