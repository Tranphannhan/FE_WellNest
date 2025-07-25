
import { valueForm } from "../LaboratoryDoctor/GenerateTestResults/page";
import { showToast, ToastType } from "../lib/Toast";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


// lấy danh sách chờ xét nghiệm
// lấy danh sách chờ xét nghiệm
export async function getWaitingForTest(
  id: string,
  page: number,
  BoQua: boolean | null,
  all: boolean | null = false
) {
  try {
    const baseUrl = `${API_BASE_URL}/Yeu_Cau_Xet_Nghiem/GetById_PhongTB_date/Pagination/`;
    const params = new URLSearchParams();

    params.append("Id_PhongThietBi", id);

    // Nếu all === true, chỉ lấy TrangThai=true, không phân trang, không BoQua
    if (all) {
      params.append("TrangThai", "true");
    } else {
      params.append("TrangThai", "false");
      params.append("page", page.toString());
      if (BoQua !== null) {
        params.append("BoQua", BoQua.toString());
      }
    }

    const url = `${baseUrl}?${params.toString()}`;
    const response = await fetch(url);

    if (response.ok) {
      return await response.json();
    } else {
      console.error("Không tìm thấy danh sách chờ xét nghiệm");
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách chờ xét nghiệm", error);
    throw error;
  }
}

// lấy yêu cầu xét nghiệm theo bệnh nhân
export async function getWaitingForTestDetail(
  id: string,
  TrangThai: boolean | null,
  Id_PhongThietBi: string | null = null
) {
  try {
    // Tạo query base
    let query = `Id_PhieuKhamBenh=${id}`;

    if (TrangThai !== null && TrangThai !== undefined) {
      query += `&TrangThaiThanhToan=${TrangThai}`;
    }

    if (Id_PhongThietBi) {
      query += `&Id_PhongThietBi=${Id_PhongThietBi}`;
    }

    query += `&limit=1000`;

    const response = await fetch(
      `${API_BASE_URL}/Yeu_Cau_Xet_Nghiem/YeuCauXetNghiemThuNgan/Detail?${query}`
    );

    if (!response.ok) return null;

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết danh sách chờ xét nghiệm", error);
    return null;
  }
}


// Tạo kết quả xét nghiệm
export async function generateTestResults (fullForm:valueForm){
     try {
        const formData = new FormData();
        for (const key in fullForm) {
            const value = fullForm[key as keyof typeof fullForm];
            if (value) formData.append(key, value);
        }

        const response = await fetch(`${API_BASE_URL}/Ket_Qua_Xet_Nghiem/Add`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            console.log('lỗi');
            
        }

        const data = await response.json();
        showToast ('Tạo kết quả thành công', ToastType.success);
        console.log('Dữ liệu trả về từ hàm tạo kết quả: ',data)
        return true;
    } catch (error) {
        console.error("Fetch lỗi:", error);
        showToast ('Tạo kết quả thất bại', ToastType.error);
        return false;
    }
}


 
// xác nhận trạng thái xét nghiệm
export async function handleCompleteTheTests (id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/Yeu_Cau_Xet_Nghiem/XacNhanTrangThai/${id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) return null;
    const data = await response.json();
    showToast(data.data.message || data.message,ToastType.success)
    console.log(data);
    return true;

  } catch (error) {
    console.error("Fetch lỗi:", error);
    showToast('Xác nhận trạng thái thất bại',ToastType.error)
  }
}

export const changeBoQuaStatus = async (id: string, boQua: boolean) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/Yeu_Cau_Xet_Nghiem/ThayDoiBoQua?id=${id}&BoQua=${boQua}`,
      {
        method: 'PATCH'
      }
    );
    console.log(response)

    if (!response.ok) {
      console.error('Lỗi khi gọi API ThayDoiBoQua:', await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error('Lỗi kết nối tới API ThayDoiBoQua:', error);
    return false;
  }
};