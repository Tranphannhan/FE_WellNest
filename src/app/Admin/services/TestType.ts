const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface TestType {
  _id: string;
  TenLoaiXetNghiem: string;
  TrangThaiHoatDong: boolean;
}

interface ChangeStatusResponse {
  message: string;
  Data: TestType;
}

//Loại Khoa
export async function changeTestTypeStatus(id: string, status: boolean): Promise<ChangeStatusResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/Loaixetnghiem/ThayDoiTrangThaiHoatDong/${id}?TrangThaiHoatDong=${status}`, {
      method: 'PATCH',
    });

    const data: ChangeStatusResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Có lỗi xảy ra');
    }

    console.log('Cập nhật trạng thái thành công:', data);
    return data;
  } catch (error) {
    // dùng unknown hoặc Error thay vì any
    if (error instanceof Error) {
      console.error('Lỗi khi cập nhật trạng thái:', error.message);
      throw error;
    }
    throw new Error('Đã xảy ra lỗi không xác định');
  }
}

//Loại Xét Nghiệm
export default async function changeDepartmentStatus(id: string, status: boolean): Promise<void> {
  try {
    const url = `${API_BASE_URL}/Khoa/TrangThaiHoatDong/${id}?TrangThaiHoatDong=${status}`;
    
    const response = await fetch(url, {
      method: 'PATCH',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Lỗi khi cập nhật trạng thái khoa");
    }

    // Optional: Nếu muốn lấy message từ server:
    // const data = await response.json();
    // console.log(data.message);
    
  } catch (error) {
    console.error("❌ changeDepartmentStatus error:", error);
    throw error;
  }
}