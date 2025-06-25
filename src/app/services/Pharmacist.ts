import { showToast, ToastType } from "../lib/Toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Thông tin đơn thuóc
export async function getPrescriptionList() {
  try {
    const response = await fetch(`${API_BASE_URL}/Donthuoc/DanhSachPhatThuoc/Pagination?page=1&limit=7`);
    if (!response.ok) return null;
    const data =await response.json();
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
export async function ConfirmationOfDispensing (idDonthuoc: string, idNguoiPhatThuoc: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/Donthuoc/XacNhanTrangThai/${idDonthuoc}?Id_NguoiPhatThuoc=${idNguoiPhatThuoc}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) return showToast('Xác nhận phát thuốc thất bại', ToastType.error);
    return showToast('Xác nhận phát thuốc thành công', ToastType.success);
  }

  catch (error) {
    console.error("Fetch lỗi:", error);
    return null;
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
