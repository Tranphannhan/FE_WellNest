'use client';
import { useEffect, useState, useRef } from 'react';
import './Prescription.css';
import NoData from '@/app/components/ui/Nodata/Nodata';

import { deleteMedicine } from '@/app/services/DoctorSevices';

import { CheckPrescription } from '@/app/services/DoctorSevices';
import { useParams } from 'next/navigation';
import { showToast, ToastType } from '@/app/lib/Toast';


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

export default function SelectedMedicineComponent() {
  const [prescriptionDetails, setPrescriptionDetails] = useState<PrescriptionDetail[]>([]);
  const { id } = useParams();
  const hasShownToast = useRef(false); // ✅ Đảm bảo chỉ toast 1 lần

  const fetchPrescriptionDetails = async (prescriptionId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Donthuoc_Chitiet/LayTheoDonThuoc/${prescriptionId}`);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        
        setPrescriptionDetails(data || []);
      } else {
        console.error('Không thể lấy chi tiết đơn thuốc');
      }
    } catch (error) {
      console.error('Lỗi khi fetch đơn thuốc:', error);
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

    console.log('Kết quả kiểm tra đơn thuốc:', resCheckPrescription);
  };

  useEffect(() => {
    CheckRender();
  }, []);


  const handleDeleteMedicine = (id : string) => {
    deleteMedicine (id as string);
    setPrescriptionDetails (prescriptionDetails);
  }


  return (
    <div className="p-4">
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
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-red-500 cursor-pointer hover:text-red-700" onClick={() => handleDeleteMedicine (item._id)}>
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
              <button className="Prescription-medicine__container__MedicineActions__addButton">+ Thêm thuốc</button>
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
