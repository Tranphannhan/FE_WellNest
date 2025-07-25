import { AccountType, LoaiTaiKhoan, TestingRoom } from "../HumanResources/Staff/Form/page";

import API_BASE_URL from "@/app/config";

// lấy danh sách tài khoản
export async function getstaffAdmin(page : number) {
  try {
    const result = await fetch(`${API_BASE_URL}/Tai_Khoan/Pagination?page=${page}`);
    if (result.ok) {
      const Data = await result.json();
      return Data;
    } else {
      const errorText = await result.text();
      console.error(`Lỗi fetch nhân viên : ${result.status} - ${errorText}`);
      return 'Lỗi khi lấy nhân viên';
    }
  } catch (error) {
    console.error("Exception khi lấy nhân viên", error);
    throw error;
  }
}


// Tìm kiếm tài khoản - 
export async function  searchAccount(key : string) {
  try {
    const result = await fetch(`${API_BASE_URL}/Tai_Khoan/Search?Key=${key}`);
    if (result.ok) {
      const Data = await result.json();
      return Data;
    } else {
      const errorText = await result.text();
      console.error(`Lỗi fetch tài khoản  : ${result.status} - ${errorText}`);
      return 'Lỗi khi lấy tài khoản';
    }
  } catch (error) {
    console.error("Exception khi lấy tài khỏa", error);
    throw error;
  }
}



// Tìm kiếm tài khoản
export async function searchstaffAdmin(page : number) {
  try {
    const result = await fetch(`${API_BASE_URL}/Tai_Khoan/Pagination?page=${page}`);
    if (result.ok) {
      const Data = await result.json();
      return Data;
    } else {
      const errorText = await result.text();
      console.error(`Lỗi fetch nhân viên : ${result.status} - ${errorText}`);
      return 'Lỗi khi lấy nhân viên';
    }
  } catch (error) {
    console.error("Exception khi lấy nhân viên", error);
    throw error;
  }
}



// lấy danh sách loại tài khoản
export async function getOptionstaffAdmin() {
  try {
    const result = await fetch(`${API_BASE_URL}/Loai_Tai_Khoan`);
    if (result.ok) {
      const Data = await result.json();
      return Data;
    } else {
      const errorText = await result.text();
      console.error(`Lỗi fetch loại tài khoản nhân viên : ${result.status} - ${errorText}`);
      return 'Lỗi khi lấy loại tài khoản nhân viên';
    }
  } catch (error) {
    console.error("Exception khi lấy loại tài khoản nhân viên", error);
    throw error;
  }
}

//Nhanvien
export async function getAccountTypes(): Promise<LoaiTaiKhoan[] | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/Loai_Tai_Khoan`);
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Lỗi fetch loại tài khoản nhân viên: ${response.status} - ${errorText}`);
            return null;
        }
        const data = await response.json();
        console.log("Account types API response:", data);
        return data.data || data;
    } catch (error) {
        console.error("Exception khi lấy loại tài khoản nhân viên", error);
        return null;
    }
}

export async function getTestingRoom(page: number): Promise<{ data: TestingRoom[] } | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/Phong_Thiet_Bi/Pagination?page=${page}`);
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API error: Status ${response.status}, ${errorText}`);
            return null;
        }
        const data = await response.json();
        console.log("Testing Room API response:", data);
        return data;
    } catch (error) {
        console.error("Fetch testing rooms error:", error);
        return null;
    }
}

export async function addAccount(formData: FormData): Promise<{ success: boolean; message?: string }> {
    try {
        const response = await fetch(`${API_BASE_URL}/Tai_Khoan/Add`, {
            method: "POST",
            body: formData,
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.error(`Add API error: Status ${response.status}, ${errorData.message}`);
            return { success: false, message: errorData.message || "Có lỗi xảy ra khi thêm tài khoản." };
        }
        return { success: true };
    } catch (error) {
        console.error("Add account error:", error);
        if (error instanceof TypeError && error.message === "Failed to fetch") {
            console.error("Possible causes: Network issue, CORS, or server not running at", API_BASE_URL);
        }
        return { success: false, message: "Có lỗi xảy ra khi thêm tài khoản. Vui lòng thử lại." };
    }
}

//update
export async function getAccountDetails(id: string): Promise<AccountType | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/Tai_Khoan/Detail/${id}`);
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API error: Status ${response.status}, ${errorText}`);
            return null;
        }
        const data = await response.json();
        console.log("Account API response:", data);
        const account = Array.isArray(data) && data.length > 0 ? data[0] : data.data || data;
        return {
            _id: account._id || "",
            TenTaiKhoan: account.TenTaiKhoan || "",
            SoDienThoai: account.SoDienThoai || "",
            SoCCCD: account.SoCCCD || "",
            GioiTinh: account.GioiTinh || "Nam",
            VaiTro: account.Id_LoaiTaiKhoan?.VaiTro || "",
            Id_LoaiTaiKhoan: account.Id_LoaiTaiKhoan || { _id: "", TenLoaiTaiKhoan: "", VaiTro: "" },
            TrangThaiHoatDong: account.TrangThaiHoatDong ?? false,
            Image: account.Image || "https://placehold.co/150x150/aabbcc/ffffff?text=Avatar",
            MatKhau: "",
            Id_PhongThietBi: account.Id_PhongThietBi || "",
        };
    } catch (error) {
        console.error("Fetch account details error:", error);
        return null;
    }
}

export async function updateAccount(id: string, formData: FormData): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/Tai_Khoan/Edit/${id}`, {
            method: "PUT",
            body: formData,
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Update API error: Status ${response.status}, ${errorText}`);
            return false;
        }
        return true;
    } catch (error) {
        console.error("Update account error:", error);
        if (error instanceof TypeError && error.message === "Failed to fetch") {
            console.error("Possible causes: Network issue, CORS, or server not running at", API_BASE_URL);
        }
        return false;
    }
}
