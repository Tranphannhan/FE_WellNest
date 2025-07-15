import { DoctorType, Khoa, ClinicType } from "@/app/types/doctorTypes/doctorTypes";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface DoctorUpdatePayload {
  TenBacSi?: string;
  SoDienThoai?: string;
  SoCCCD?: string;
  NamSinh?: string;
  GioiTinh?: string;
  HocVi?: string;
  ID_Khoa?: string;
  Id_PhongKham?: string;
  TrangThaiHoatDong?: boolean;
  Image?: string;
  Matkhau?: string;
}

export async function getDoctorAdmin(page : number) {
  try {
    const result = await fetch(`${API_BASE_URL}/Bacsi/Pagination?page=${page}`);
    if (result.ok) {
      const Data = await result.json();
      return Data;
    } else {
      const errorText = await result.text();
      console.error(`Lỗi fetch Bacsi/Pagination: ${result.status} - ${errorText}`);
      return 'Lỗi khi lấy bác sĩ';
    }
  } catch (error) {
    console.error("Exception khi lấy bác sĩ", error);
    throw error;
  }
} 


export async function getkhoaOptions (page : number){
   try {
    const result = await fetch(`${API_BASE_URL}/Khoa/Pagination?page=${page}`);
    if (result.ok) {
      const Data = await result.json();
      return Data;
    } else {
      const errorText = await result.text();
      console.error(`Lỗi fetch Select Bác sĩ/Pagination: ${result.status} - ${errorText}`);
      return 'Lỗi khi lấy bác sĩ';
    }
  } catch (error) {
    console.error("Exception khi lấy danh mục bác sĩ", error);
    throw error;
  }
}

<<<<<<< HEAD

// Tìm kiếm loại khoa
export async function Searchfordepartmenttype (key : string){
   try {
    const result = await fetch(`http://localhost:5000/Khoa/Search?Key=${key}`);
    if (result.ok) {
      const Data = await result.json();
      return Data;
    } else {
      const errorText = await result.text();
      console.error(`Lỗi fetch Loại Khoa /Pagination: ${result.status} - ${errorText}`);
      return 'Lỗi khi lấy loại khoa';
    }
  } catch (error) {
    console.error("Exception khi lấy loại khoa", error);
    throw error;
=======
// Fetch doctor details
export async function getDoctorDetails(id: string): Promise<DoctorType | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/Bacsi/detail/${id}`);
    if (!response.ok) {
      console.error(
        `API error: Status ${response.status}, ${response.statusText}`
      );
      return null;
    }
    const data = await response.json();
    console.log("Doctor API response:", data);
    return Array.isArray(data) && data.length > 0 ? data[0] : data.data || data;
  } catch (error) {
    console.error("Fetch doctor details error:", error);
    return null;
  }
}

// Fetch specialties
export async function getSpecialties(): Promise<Khoa[] | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/Khoa/Pagination?TrangThaiHoatDong=true`);
    if (!response.ok) {
      console.error(
        `API error: Status ${response.status}, ${response.statusText}`
      );
      return null;
    }
    const data = await response.json();
    console.log("Specialties API response:", data);
    return data.data || data;
  } catch (error) {
    console.error("Fetch specialties error:", error);
    return null;
  }
}

// Fetch empty clinics by specialty
export async function getClinicsBySpecialty(
  specialtyId: string
): Promise<ClinicType[] | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/Phong_Kham/LayPhongTrongTheoKhoa/${specialtyId}`
    );
    if (!response.ok) {
      if (response.status === 404) {
        console.warn("No empty clinics found for specialty:", specialtyId);
        return [];
      }
      console.error(
        `API error: Status ${response.status}, ${response.statusText}`
      );
      return null;
    }
    const data = await response.json();
    console.log("Clinics API response:", data);
    return data.data || data;
  } catch (error) {
    console.error("Fetch clinics error:", error);
    return null;
  }
}

// Fetch single clinic details by ID
export async function getClinicDetails(
  clinicId: string
): Promise<ClinicType | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/Phong_Kham/detail/${clinicId}`);
    if (!response.ok) {
      console.error(
        `API error: Status ${response.status}, ${response.statusText}`
      );
      return null;
    }
    const data = await response.json();
    console.log("Clinic details API response:", data);
    return data.data || data;
  } catch (error) {
    console.error("Fetch clinic details error:", error);
    return null;
  }
}

// Update doctor
export async function updateDoctor(
  id: string,
  doctorData: DoctorUpdatePayload
): Promise<boolean> {
  try {
    const payload: DoctorUpdatePayload = { ...doctorData };
    if (typeof payload.TrangThaiHoatDong === "string") {
      payload.TrangThaiHoatDong = payload.TrangThaiHoatDong === "true";
    }
    if (!payload.Matkhau) {
      delete payload.Matkhau;
    }
    console.log("Sending payload:", payload);

    const response = await fetch(`${API_BASE_URL}/Bacsi/Edit/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Update API error: Status ${response.status}, ${response.statusText}, Body:`,
        errorText
      );
      return false;
    }
    return true;
  } catch (error) {
    console.error("Update doctor error:", error);
    return false;
  }
}

//Edit doctor add

export async function addDoctor(doctorData: FormData): Promise<{ success: boolean, message?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/BacSi/Add`, {
      method: "POST",
      body: doctorData,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`Add API error:`, data.message);
      return { success: false, message: data.message || "Lỗi không xác định" };
    }

    return { success: data.success, message: data.message };
  } catch (error) {
    console.error("Add doctor error:", error);
    return { success: false, message: "Lỗi kết nối server" };
>>>>>>> 719c97165109777f9f4fd2e8da97d6aec25cc566
  }
}


<<<<<<< HEAD



// tìm kiếm bác sĩ
export async function FindDoctor (key : string) {
  try {
    const result = await fetch(`http://localhost:5000/Bacsi/Search?Key=${key}`);
    if (result.ok){
      const Data = await result.json();
      return Data;
    } else {
      const errorText = await result.text();
      console.error(`Lỗi fetch Bacsi/Pagination: ${result.status} - ${errorText}`);
      return 'Lỗi khi tìm kiếm bác sĩ';
    }
  } catch (error) {
    console.error("Lỗi khi tìm kiếm bác sĩ", error);
    throw error;
  }   
}
=======
>>>>>>> 719c97165109777f9f4fd2e8da97d6aec25cc566
