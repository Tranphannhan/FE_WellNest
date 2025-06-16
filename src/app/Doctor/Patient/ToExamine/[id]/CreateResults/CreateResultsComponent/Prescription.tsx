'use client';
import { useEffect, useState } from 'react';
import './Prescription.css';
import NoData from '@/app/components/ui/Nodata/Nodata';

import { deleteMedicine } from '@/app/services/DoctorSevices';

import { CheckPrescription } from '@/app/services/DoctorSevices';
import { useParams } from 'next/navigation';
import { formatCurrencyVND } from '@/app/lib/Format';


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
    NhacNho: string;
    DonVi: string;
    __v: number;
}

// Added onAddMedicineClick prop
export default function SelectedMedicineComponent({ onAddMedicineClick }: { onAddMedicineClick: () => void }) {
    const [prescriptionDetails, setPrescriptionDetails] = useState<PrescriptionDetail[]>([]);
    const { id } = useParams();

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
            fetchPrescriptionDetails(resCheckPrescription.data._id);
        }
    };

    useEffect(() => {
        CheckRender();
    }, []);


    const handleDeleteMedicine = (id : string) => {
        deleteMedicine (id as string);
        // After deletion, you should re-fetch the details to update the UI
        // Or, more efficiently, filter the state directly if the deletion was successful
        setPrescriptionDetails(prescriptionDetails.filter(detail => detail._id !== id));
    }


    return (
        <div className="p-[20px]">
            <div className="rounded-lg bg-white">
                {prescriptionDetails.length > 0 ? (

                    <>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100 text-gray-700 font-semibold text-left">
                                <tr>
                                    <th className="px-4 py-2">Tên thuốc</th>
                                    <th className="px-4 py-2">Đơn vị</th>
                                    <th className="px-4 py-2">Số lượng</th>
                                    <th className="px-4 py-2">Lưu ý</th>
                                    <th className="px-4 py-2">Cách sử dụng</th>
                                    <th className="px-4 py-2">Giá mỗi đơn vị</th>
                                    <th className="px-4 py-2">Giá tổng</th>
                                    <th className="px-4 py-2">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-600 divide-y divide-gray-200">
                                {prescriptionDetails.map((item) => (
                                    <tr key={item._id} className="hover:bg-gray-50"> {/* Use item._id for key */}

                                        <td className="px-4 py-2 font-medium text-gray-800">{item.Id_Thuoc?.TenThuoc}</td>
                                        <td className="px-4 py-2">{item.DonVi || item.Id_Thuoc?.DonVi}</td>
                                        <td className="px-4 py-2">{item.SoLuong}</td>
                                        <td className="px-4 py-2">{item.NhacNho}</td>
                                        <td className="px-4 py-2">Sử dụng theo hướng dẫn</td>
                                        <td className="px-4 py-2 font-semibold">
                                            {formatCurrencyVND(item.Id_Thuoc?.Gia)}
                                        </td>
                                        <td className="px-4 py-2 font-semibold">
                                            {formatCurrencyVND(item.Id_Thuoc?.Gia * item.SoLuong)}
                                        </td>
                                        <td className="px-4 py-2 text-red-500 hover:text-red-700">
                                            
                                            <button
                                              onClick={() => handleDeleteMedicine (item._id)}
                                              className='cursor-pointer'
                                              style={{
                                                backgroundColor:'red',
                                                color:'white',
                                                padding:'4px 13px',
                                                borderRadius:'5px',
                                                display:'flex',
                                                gap:8,
                                                alignItems:'center'
                                              }}
                                            ><i className="bi bi-trash3-fill text-lg"
                                              style={{
                                                fontSize:14
                                              }}
                                            ></i> Xóa</button>
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
        </div>
    );
}
