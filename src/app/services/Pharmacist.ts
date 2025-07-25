import { showToast, ToastType } from "../lib/Toast";

import API_BASE_URL from "@/app/config";

// Thông tin đơn thuóc
export async function getPrescriptionList(pagination:boolean = false, page:number = 1) {
  try {
    const response = await fetch(`${API_BASE_URL}/Donthuoc/DanhSachPhatThuoc/Pagination?page=${page}`);
    if (!response.ok) return null;
    const data =await response.json();
    if(pagination){
      return data
    }
    return data.data;
  } catch (error) {
    console.error("Fetch lỗi:", error);
    return null;
  }
}

// Đơn thuốc đã phát
export async function getThePrescriptionDispensed(pagination:boolean = false, page:number = 1) {
  try {
    const response = await fetch(`${API_BASE_URL}/Donthuoc/LichSuPhatThuoc/Pagination?page=${page}`);
    if (!response.ok) return null;
    const data =await response.json();
    if(pagination){
      return data
    }
    return data.data;
  } catch (error) {
    console.error("Fetch lỗi:", error);
    return null;
  }
}

// Đơn thuốc chi tiết
export async function getPrescriptionListDetail (id : string) {
  try {
    const response = await fetch(`${API_BASE_URL}/Donthuoc_Chitiet/LayTheoDonThuoc/${id}`);
    if (!response.ok) return null;
    const data =await response.json();
    return data;
  } catch (error) {
    console.error("Fetch lỗi:", error);
    return null;
  }
}


// Xác nhận phát thuốc
export async function ConfirmationOfDispensing(idDonthuoc: string, idNguoiPhatThuoc: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/Donthuoc/XacNhanTrangThai/${idDonthuoc}?Id_NguoiPhatThuoc=${idNguoiPhatThuoc}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      showToast('Xác nhận phát thuốc thất bại', ToastType.error);
      return false;
    }

    showToast('Xác nhận phát thuốc thành công', ToastType.success);
    return true; // ✅ Trả về true để sử dụng ở component
  } catch (error) {
    console.error("Fetch lỗi:", error);
    showToast('Lỗi kết nối tới máy chủ', ToastType.error);
    return false;
  }
}


// Cập nhật ghi chú của đơn thuốc chi tiết
// services/Pharmacist.ts
export const updatePrescriptionNote = async (prescriptionDetailId: string, data: { SoLuong: number; NhacNho: string }) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Donthuoc_Chitiet/${prescriptionDetailId}`, {
            method: 'PATCH', // Use PATCH or PUT depending on your API
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                SoLuong: data.SoLuong,
                NhacNho: data.NhacNho,
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to update prescription details: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating prescription details:', error);
        throw error;
    }
};
