import API_BASE_URL from "@/app/config";

export type FrontendChonPhong = "thuCong" | "itNguoiNhat" | "phongGan" | "phongXa" | "ganDay";
export type BackendChonPhong = "ThuCong" | "ItNguoi" | "PhongGan" | "GanDay" | "PhongXa";

export interface SettingsData {
  _id: string;
  ChonPhong: BackendChonPhong;
  ThoiGianKham: number;
  ApDungThoiGianKham: boolean;
  GioiHanBenhNhan: number;
}

export interface KhoaData {
  _id: string;
  TenKhoa: string;
  TrangThaiHoatDong: boolean;
  CanLamSang: boolean;
}

export const fetchSettings = async (): Promise<SettingsData | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/Chuc_Nang_He_Thong`);
    const data = await res.json();
    if (data.length > 0) {
      return data[0];
    }
    return null;
  } catch (err) {
    console.error("Lỗi load settings:", err);
    throw new Error("Lỗi khi tải dữ liệu hệ thống");
  }
};

export const updateSettings = async (
  documentId: string,
  data: {
    ChonPhong: BackendChonPhong;
    ThoiGianKham: number;
    ApDungThoiGianKham: boolean;
    GioiHanBenhNhan: number;
  }
): Promise<string> => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/Chuc_Nang_He_Thong/Update/${documentId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (res.ok) {
      return "Cập nhật thành công";
    } else {
      const errorData = await res.json();
      return `Lỗi: ${errorData.message || "Cập nhật thất bại"}`;
    }
  } catch (err) {
    console.error("Lỗi cập nhật settings:", err);
    return "Lỗi khi cập nhật dữ liệu";
  }
};

export const fetchKhoaList = async (): Promise<KhoaData[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/Khoa/Pagination?limit=100`);
    const data = await res.json();
    console.log("Khoa API response:", data); // Log to debug response structure
    // Handle case where data might be wrapped in an object (e.g., { data: [...] })
    const khoaArray = Array.isArray(data) ? data : data.data || [];
    if (!Array.isArray(khoaArray)) {
      console.warn("Khoa API did not return an array:", khoaArray);
      return [];
    }
    return khoaArray;
  } catch (err) {
    console.error("Lỗi load khoa:", err);
    return []; // Return empty array on error to prevent map errors
  }
};

export const updateKhoaCanLamSang = async (
  id: string,
  canLamSang: boolean
): Promise<string> => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/Khoa/CanLamSang/${id}?CanLamSang=${canLamSang}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (res.ok) {
      return "Cập nhật CanLamSang thành công";
    } else {
      const errorData = await res.json();
      return `Lỗi: ${errorData.message || "Cập nhật CanLamSang thất bại"}`;
    }
  } catch (err) {
    console.error("Lỗi cập nhật CanLamSang:", err);
    return "Lỗi khi cập nhật CanLamSang";
  }
};