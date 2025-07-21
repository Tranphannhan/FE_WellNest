// import { Testtype } from "../types/hospitalTypes/hospitalType";
import { ParaclinicalResponse } from "../types/hospitalTypes/hospitalType";
import { prescriptionType } from "../types/patientTypes/patient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getPrescriptionPendingPayment (Pagination:boolean = false , page:number = 1) {
  try {
    const response = await fetch(`${API_BASE_URL}/Donthuoc/DonThuocThuNgan/Pagination?TrangThaiThanhToan=false&page=${page}`);
    if (!response.ok) return null;
    const data =await response.json();
    if(Pagination){
      return data
    }else{
      return data.data
    }
    
  } catch (error) {
    console.error("Fetch lỗi:", error);
    return null;
  }
}


// yêu cầu xét nghiệm 
export async function getParaclinicalAwaitingPayment (Pagination: boolean = false, page:number = 1) {
  try {
    const response = await fetch(`${API_BASE_URL}/Yeu_Cau_Xet_Nghiem/YeuCauXetNghiemThuNgan/Pagination?TrangThaiThanhToan=false&page=${page}`);
    if (!response.ok) return null;
    const data =await response.json();
    if(Pagination){
      return data
    }else{
      return data.data
    }
  } catch (error) {
    console.error("Fetch lỗi:", error);
    return null;
  }
}


// chi tiết xét nghiệm chưa thanh toán
export async function getDetailParaclinicalAwaitingPayment (id : string): Promise<ParaclinicalResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/Yeu_Cau_Xet_Nghiem/YeuCauXetNghiemThuNgan/Detail?Id_PhieuKhamBenh=${id}&TrangThai=false&limit=1000`);
    if (!response.ok) return null;
    const data =await response.json();
    return data
  } catch (error) {
    console.error("Fetch lỗi:", error);
    return null;
  }  
}


// Thông tin bẹnh nhân
export async function getDetailPatientInformation (id : string): Promise<prescriptionType | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/Donthuoc/Detail/${id}`);
    if (!response.ok) return null;
    const data =await response.json();
    return data
  } catch (error) {
    console.error("Fetch lỗi:", error);
    return null;
  }
}


// Thông tin đơn thuóc
export async function getDetailPrescription(id : string) {
  try {
    const response = await fetch(`${API_BASE_URL}/Donthuoc_Chitiet/LayTheoDonThuoc/${id}`);
    if (!response.ok) return null;
    const data =await response.json();
    return data
  } catch (error) {
    console.error("Fetch lỗi:", error);
    return null;
  }
}

//Xác nhận thanh toán đơn thuốc
export async function confirmPrescriptionPayment(id: string): Promise<prescriptionType | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/Donthuoc/Xacnhanthanhtoan/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch lỗi:", error);
    return null;
  }
}

//Xác nhận thanh toán cận lâm sàng
export async function confirmTestRequestPayment(id: string, Id_ThuNgan: string) {
  console.log("Id_ThuNgan:", Id_ThuNgan); // 👈 kiểm tra giá trị truyền vào

  try {
    const response = await fetch(`${API_BASE_URL}/Yeu_Cau_Xet_Nghiem/Xacnhanthanhtoan?Id_PhieuKhamBenh=${id}&Id_ThuNgan=${Id_ThuNgan}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch lỗi:", error);
    return null;
  }
}



// tìm kiếm
export const SearchPrescriptionPendingPayment = async (
  isWaiting: boolean,
  page: number = 1,
  fullName?: string | null,
  phoneNumber?: string | null
) => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("TrangThaiThanhToan", isWaiting ? "false" : "true");
    queryParams.append("page", page.toString());
    if (fullName) queryParams.append("HoVaTen", fullName);
    if (phoneNumber) queryParams.append("SDT", phoneNumber);

    const res = await fetch(`${API_BASE_URL}/Donthuoc/TimKiemTheoSDTHoacIdPhieuKhamBenh/Pagination?${queryParams.toString()}`);
    if (!res.ok) return null;

    return await res.json();
  } catch (error) {
    console.error("Lỗi khi fetch đơn thuốc:", error);
    return null;
  }
};

//Tìm kiếm dược sĩ
export const SearchPrescriptionByDoctor = async (
  trangThai: string,
  isWaiting: boolean,
  page: number = 1,
  fullName?: string | null,
  phoneNumber?: string | null
) => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("TrangThai", trangThai.toString());
    queryParams.append("TrangThaiThanhToan", isWaiting ? "false" : "true");
    queryParams.append("page", page.toString());
    if (fullName) queryParams.append("HoVaTen", fullName);
    if (phoneNumber) queryParams.append("SDT", phoneNumber);

    const res = await fetch(
      `${API_BASE_URL}/Donthuoc/TimKiemTheoSDTHoacIdPhieuKhamBenh/Pagination?${queryParams.toString()}`
    );

    if (!res.ok) return null;

    return await res.json();
  } catch (error) {
    console.error("Lỗi khi fetch đơn thuốc bác sĩ:", error);
    return null;
  }
};


export const SearchParaclinicalAwaitingPayment = async (
  isActive: boolean,
  page: number = 1,
  HoVaTen?: string,
  SDT?: string
) => {
  try {
    // Tạo query string chỉ chứa các tham số có giá trị
    const params = new URLSearchParams({
      TrangThaiHoatDong: String(isActive),
      page: String(page),
      limit: "7",
    });

    if (HoVaTen && HoVaTen.trim() !== "") {
      params.append("HoVaTen", HoVaTen.trim());
    }

    if (SDT && SDT.trim() !== "") {
      params.append("SDT", SDT.trim());
    }

    const response = await fetch(
      `${API_BASE_URL}/Yeu_Cau_Xet_Nghiem/TimKiemTheoSDTHoacIdPhieuKhamBenh/Pagination?${params.toString()}&TrangThaiThanhToan=false`
    );

    if (!response.ok) {
      throw new Error("Lỗi khi gọi API");
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Lỗi khi fetch getParaclinicalAwaitingPayment:", error);
    return {
      data: [],
      totalPages: 1,
      currentPage: 1,
    };
  }
};


export const SearchParaclinicalWithStatus = async (
  isActive: boolean,
  page: number = 1,
  TrangThai: boolean,
  HoVaTen?: string,
  SDT?: string,
  TrangThaiThanhToan?: boolean,
  BoQua?: boolean,
  id_PhongThietBi?: string
) => {
  try {
    const params = new URLSearchParams({
      TrangThaiHoatDong: String(isActive),
      page: String(page),
      limit: "5",
      TrangThai: String(TrangThai),
    });

    if (HoVaTen?.trim()) {
      params.append("HoVaTen", HoVaTen.trim());
    }

    if (SDT?.trim()) {
      params.append("SDT", SDT.trim());
    }

    if (typeof TrangThaiThanhToan === "boolean") {
      params.append("TrangThaiThanhToan", String(TrangThaiThanhToan));
    }

    if (typeof BoQua === "boolean") {
      params.append("BoQua", String(BoQua));
    }

    if (id_PhongThietBi?.trim()) {
      params.append("id_PhongThietBi", id_PhongThietBi.trim());
    }

    const response = await fetch(
      `${API_BASE_URL}/Yeu_Cau_Xet_Nghiem/TimKiemTheoSDTHoacIdPhieuKhamBenh/Pagination?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error("Lỗi khi gọi API");
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Lỗi khi fetch SearchParaclinicalWithStatus:", error);
    return {
      data: [],
      totalPages: 1,
      currentPage: 1,
    };
  }
};

