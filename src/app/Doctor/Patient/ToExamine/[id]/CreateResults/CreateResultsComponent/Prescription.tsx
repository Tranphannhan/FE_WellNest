// File: SelectedMedicineComponent.tsx
'use client';
import { useEffect, useState, useRef } from 'react';
import './Prescription.css';
import NoData from '@/app/components/ui/Nodata/Nodata';

import { deleteMedicine } from '@/app/services/DoctorSevices';

import { CheckPrescription } from '@/app/services/DoctorSevices';
import { useParams } from 'next/navigation';
import { showToast, ToastType } from '@/app/lib/Toast';
import PreviewExaminationForm from '../ComponentResults/ComponentPrintTicket/PrescriptionForm';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface PrescriptionDetail {
    _id: string;
    Id_DonThuoc: string;
    Id_Thuoc: {
        _id: string;
        Id_NhomThuoc: string;
        TenThuoc: string;
        DonVi: string;
        Gia: number;
        __v: number;
    };
    SoLuong: number;
    NhacNho: string; // This can be used for "Lưu ý" or "Cách sử dụng"
    DonVi: string;
    __v: number;
}

// Interface for the detailed patient data
export interface PatientExaminationData {
    _id: string;
    Id_TheKhamBenh: {
        _id: string;
        HoVaTen: string;
        GioiTinh: string;
        NgaySinh: string;
        SoDienThoai: string;
        SoBaoHiemYTe: string;
        DiaChi: string;
        SoCCCD: string;
        SDT_NguoiThan: string;
        LichSuBenh: string;
        __v: number;
    };
    Id_Bacsi: {
        _id: string;
        ID_Khoa: string;
        TenBacSi: string;
        GioiTinh: string;
        SoDienThoai: string;
        HocVi: string;
        NamSinh: number;
        Matkhau: string;
        Image: string;
        VaiTro: string;
        TrangThaiHoatDong: boolean;
        __v: number;
        Id_PhongKham: {
            _id: string;
            Id_Khoa: string;
            SoPhongKham: string;
        };
    };
    Id_NguoiTiepNhan: string;
    Id_GiaDichVu: string;
    LyDoDenKham: string;
    Ngay: string;
    Gio: string;
    TrangThaiThanhToan: boolean;
    STTKham: string;
    TrangThai: boolean;
    TrangThaiHoatDong: string;
    __v: number;
}

// Type cho dữ liệu của Đơn Thuốc (PreviewExaminationForm) - Updated to be more flexible
export interface ExaminationFormDonThuoc {
    fullName: string;
    weight: number; // Assuming weight would come from elsewhere or be added later
    gender: string;
    dob: string;
    address: string;
    department: string; // Khoa khám
    price: number; // Giá khám (có thể không hiển thị trên đơn thuốc)
    clinic: string; // Phòng khám
    QueueNumber: string; // Số thứ tự khám (có thể không hiển thị trên đơn thuốc)
}

// Added onAddMedicineClick prop
export default function SelectedMedicineComponent({ onAddMedicineClick }: { onAddMedicineClick: () => void }) {
    const [prescriptionDetails, setPrescriptionDetails] = useState<PrescriptionDetail[]>([]);
    const { id } = useParams();
    const hasShownToast = useRef(false); // ✅ Ensure toast is shown only once
    const [isDonThuocModalOpen, setIsDonThuocModalOpen] = useState(false);
    const [patientDataForForm, setPatientDataForForm] = useState<ExaminationFormDonThuoc | null>(null);

    // Parse the provided patient data
    const ThongTinBenhNhanDangKham: PatientExaminationData = JSON.parse(`{"_id":"684926749c351fd5325793a4","Id_TheKhamBenh":{"_id":"6846f6da8b70d4b33ddcf8e3","HoVaTen":"Trần Phan Nhân","GioiTinh":"Nam","NgaySinh":"2005-05-14","SoDienThoai":"ok","SoBaoHiemYTe":"ok","DiaChi":"Số Nhà 359, Ấp Rạch Cát, Long Hựu Đông, Cần Đước, Long An","SoCCCD":"080205004041","SDT_NguoiThan":"ok","LichSuBenh":"ok","__v":0},"Id_Bacsi":{"_id":"6828a6926e9bedbfcafaa848","ID_Khoa":"6803ba9870cd96d5cde6d7a9","TenBacSi":"Trần Bác Sĩ 3","GioiTinh":"Nam","SoDienThoai":"0908609101","HocVi":"Tiến sĩ","NamSinh":1990,"Matkhau":"$2b$10$fZnw4ChSia5L./VsyeqV7u8QU8hWi266l/bP.M.CLCT69pTSBR7tC","Image":"http://localhost:5000/image/1747494546761.jpg","VaiTro":"BacSi","TrangThaiHoatDong":true,"__v":0,"Id_PhongKham":{"_id":"6824bbb85f64eedbc8bfb690","Id_Khoa":"681637a4044132235e13b8ba","SoPhongKham":"102"}},"Id_NguoiTiepNhan":"68272e93b4cfad70da810029","Id_GiaDichVu":"683420eb8b7660453369dce1","LyDoDenKham":"Ok khoe nhu trau","Ngay":"2025-06-11","Gio":"13:47:16","TrangThaiThanhToan":false,"STTKham":"0","TrangThai":false,"TrangThaiHoatDong":"Kham","__v":0}`);

    const mockCollectorNameDonThuoc = ThongTinBenhNhanDangKham.Id_Bacsi.TenBacSi;

    useEffect(() => {
        if (ThongTinBenhNhanDangKham) {
            // Populate the ExaminationFormDonThuoc with actual patient data
            setPatientDataForForm({
                fullName: ThongTinBenhNhanDangKham.Id_TheKhamBenh.HoVaTen,
                weight: 0, // Placeholder, as weight is not in the provided data
                gender: ThongTinBenhNhanDangKham.Id_TheKhamBenh.GioiTinh,
                dob: ThongTinBenhNhanDangKham.Id_TheKhamBenh.NgaySinh,
                address: ThongTinBenhNhanDangKham.Id_TheKhamBenh.DiaChi,
                department: ThongTinBenhNhanDangKham.Id_Bacsi.ID_Khoa, // This seems to be an ID, might need a lookup
                price: 0, // Placeholder, price is not in this specific patient data
                clinic: ThongTinBenhNhanDangKham.Id_Bacsi.Id_PhongKham.SoPhongKham,
                QueueNumber: ThongTinBenhNhanDangKham.STTKham,
            });
        }
    }, [ThongTinBenhNhanDangKham]); // Depend on ThongTinBenhNhanDangKham


    const fetchPrescriptionDetails = async (prescriptionId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/Donthuoc_Chitiet/LayTheoDonThuoc/${prescriptionId}`);
            if (response.ok) {
                const data = await response.json();
                console.log(data);

                setPrescriptionDetails(data || []);
            } else {
                console.error('Failed to retrieve prescription details');
            }
        } catch (error) {
            console.error('Error fetching prescription:', error);
        }
    };


    const CheckRender = async () => {
        const resCheckPrescription = await CheckPrescription(id as string);

        if (!resCheckPrescription.status) {
            if (!hasShownToast.current) {
                showToast('Đang có đơn thuốc chờ xác nhận', ToastType.warn);
                hasShownToast.current = true;
            }
            fetchPrescriptionDetails(resCheckPrescription.data._id);
        }

        console.log('Prescription check result:', resCheckPrescription);
    };

    useEffect(() => {
        CheckRender();
    }, []);


    const handleDeleteMedicine = (id: string) => {
        deleteMedicine(id as string);
        // After deletion, you should re-fetch the details to update the UI
        // Or, more efficiently, filter the state directly if the deletion was successful
        setPrescriptionDetails(prescriptionDetails.filter(detail => detail._id !== id));
    }


    return (
        <div className="p-4">
            <button
                onClick={() => setIsDonThuocModalOpen(true)}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
            >
                Xem trước Đơn Thuốc
            </button>
            <div className="overflow-x-auto rounded-lg bg-white">
                {prescriptionDetails.length > 0 ? (

                    <>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100 text-gray-700 text-sm font-semibold text-left">
                                <tr>
                                    <th className="px-4 py-2">Xoá</th>
                                    <th className="px-4 py-2">Tên thuốc</th>
                                    <th className="px-4 py-2">Đơn vị</th>
                                    <th className="px-4 py-2">Số lượng</th>
                                    <th className="px-4 py-2">Lưu ý</th>
                                    <th className="px-4 py-2">Cách sử dụng</th>
                                    <th className="px-4 py-2">Giá mỗi đơn vị</th>
                                    <th className="px-4 py-2">Giá tổng</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-600 divide-y divide-gray-200">
                                {prescriptionDetails.map((item, index) => (
                                    <tr key={item._id} className="hover:bg-gray-50"> {/* Use item._id for key */}
                                        <td className="px-4 py-2 text-red-500 cursor-pointer hover:text-red-700" onClick={() => handleDeleteMedicine(item._id)}>
                                            <i className="bi bi-trash3-fill text-lg"></i>
                                        </td>
                                        <td className="px-4 py-2 font-medium text-gray-800">{item.Id_Thuoc?.TenThuoc}</td>
                                        <td className="px-4 py-2">{item.DonVi || item.Id_Thuoc?.DonVi}</td>
                                        <td className="px-4 py-2">{item.SoLuong}</td>
                                        <td className="px-4 py-2">{item.NhacNho}</td>
                                        <td className="px-4 py-2">Sử dụng theo hướng dẫn</td>
                                        <td className="px-4 py-2 text-green-600 font-semibold">
                                            {item.Id_Thuoc?.Gia?.toLocaleString() || 0} ₫
                                        </td>
                                        <td className="px-4 py-2 text-green-600 font-semibold">
                                            {(item.Id_Thuoc?.Gia * item.SoLuong)?.toLocaleString()} ₫
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex justify-end gap-4 mt-4">
                            {/* Attach the onAddMedicineClick handler here */}
                            <button className="Prescription-medicine__container__MedicineActions__addButton" onClick={onAddMedicineClick}>+ Thêm thuốc</button>
                            <button className="Prescription-medicine__container__MedicineActions__completeButton">Hoàn thành</button>
                        </div>
                    </>
                ) : (
                    <NoData
                        message="Chưa chọn thuốc!"
                        remind="Vui lòng chọn thuốc để hoàn thành đơn thuốc"
                    />
                )}
            </div>
            {isDonThuocModalOpen && patientDataForForm && (
                <PreviewExaminationForm
                    isOpen={isDonThuocModalOpen}
                    onClose={() => setIsDonThuocModalOpen(false)}
                    patientData={patientDataForForm}
                    collectorName={mockCollectorNameDonThuoc}
                    prescriptionMedicines={prescriptionDetails}
                />
            )}
        </div>
    );
}