import { showToast, ToastType } from "../lib/Toast";


// Thông tin đơn thuóc
export async function getPrescriptionList() {
  try {
    const response = await fetch(`http://localhost:5000/Donthuoc/DanhSachPhatThuoc/Pagination?page=1&limit=7`);
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
    const response = await fetch(`http://localhost:5000/Donthuoc_Chitiet/LayTheoDonThuoc/${id}`);
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
    const response = await fetch(`http://localhost:5000/Donthuoc/XacNhanTrangThai/${idDonthuoc}?Id_NguoiPhatThuoc=${idNguoiPhatThuoc}`, {
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
