// FileTam.ts (hoặc file services của bạn)

import { MedicalRecordPaginationResponse, MedicinePaginationResponse, PrescriptionStatsPaginationResponse, TestRequestPaginationResponse } from "@/app/types/hospitalTypes/hospitalType";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Hàm này đã chấp nhận limit và page
export default async function fetchMedicines(limit: number, page: number, groupId: string = 'all'): Promise<MedicinePaginationResponse | null> {
    try {
        // Tham số limit và page sẽ được truyền trực tiếp vào URL
        const groupParam = groupId !== 'all' ? `&Id_NhomThuoc=${encodeURIComponent(groupId)}` : '';
        const response = await fetch(`${API_BASE_URL}/Thuoc/Pagination?limit=${limit}&page=${page}${groupParam}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Lỗi HTTP: ${response.status} - ${errorData.message || response.statusText}`);
        }

        const data: MedicinePaginationResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Lỗi khi fetch danh sách thuốc:', error);
        return null;
    }
}

// Hàm này đã chấp nhận limit và page
export async function fetchMedicineGroupsPaginated(limit: number, page: number): Promise<MedicinePaginationResponse | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/Nhomthuoc/pagination?limit=${limit}&page=${page}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Lỗi HTTP: ${response.status} - ${errorData.message || response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Lỗi khi fetch danh mục nhóm thuốc:', error);
        return null;
    }
}

// Hàm này đã chấp nhận limit và page
export async function fetchMedicinesByGroupId(groupId: string, limit: number, page: number): Promise<MedicinePaginationResponse | null> {
    try {
        if (!groupId) {
            throw new Error('Group ID is required to fetch medicines by group.');
        }

        const response = await fetch(`${API_BASE_URL}/Thuoc/LayTheoNhom/Pagination/${encodeURIComponent(groupId)}?limit=${limit}&page=${page}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Lỗi HTTP: ${response.status} - ${errorData.message || response.statusText}`);
        }

        const data: MedicinePaginationResponse = await response.json();
        return data;
    } catch (error) {
        console.error(`Lỗi khi fetch danh sách thuốc theo nhóm ${groupId}:`, error);
        return null;
    }
}

// Hàm này đã chấp nhận limit và page, và đã được sửa param Nhomthuoc
export async function searchMedicinesByName(searchTerm: string, limit: number, page: number, groupId: string = 'all'): Promise<MedicinePaginationResponse | null> {
    try {
        let url = `${API_BASE_URL}/Thuoc/TimKiemTenThuoc?limit=${limit}&page=${page}`;

        if (searchTerm) {
            url += `&search=${encodeURIComponent(searchTerm)}`;
        }

        if (groupId !== 'all') {
            url += `&NhomThuoc=${encodeURIComponent(groupId)}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Lỗi HTTP: ${response.status} - ${errorData.message || response.statusText}`);
        }

        const data: MedicinePaginationResponse = await response.json();
        return data;
    } catch (error) {
        console.error(`Lỗi khi tìm kiếm thuốc theo tên "${searchTerm}" trong nhóm "${groupId}":`, error);
        return null;
    }
}

//Dashboard thu ngân lọc theo ngày và năm

export async function fetchPrescriptionsByDateRange(fromDate?: string, toDate?: string, year?: number): Promise<PrescriptionStatsPaginationResponse> {
  try {
    let url = `${API_BASE_URL}/Donthuoc/filter-by-date`;
    const params = new URLSearchParams();
    
    if (fromDate && toDate) {
      params.append('fromDate', fromDate);
      params.append('toDate', toDate);
    }
    if (year) {
      params.append('year', year.toString());
    }
    
    const response = await fetch(`${url}?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: PrescriptionStatsPaginationResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    throw error;
  }
}

export async function fetchTestRequestsByDateRange(fromDate?: string, toDate?: string, year?: number): Promise<TestRequestPaginationResponse> {
  try {
    let url = `${API_BASE_URL}/Yeu_Cau_Xet_Nghiem/filter-by-date`;
    const params = new URLSearchParams();
    
    if (fromDate && toDate) {
      params.append('fromDate', fromDate);
      params.append('toDate', toDate);
    }
    if (year) {
      params.append('year', year.toString());
    }
    
    const response = await fetch(`${url}?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: TestRequestPaginationResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching test requests:', error);
    throw error;
  }
}

export async function fetchMedicalRecordsByDateRange(
  fromDate?: string,
  toDate?: string,
  year?: number
): Promise<MedicalRecordPaginationResponse> {
  try {
    let url = `${API_BASE_URL}/Phieu_Kham_Benh/filter-phieu-kham-benh`;
    const params = new URLSearchParams();

    if (fromDate && toDate) {
      params.append('fromDate', fromDate);
      params.append('toDate', toDate);
    }
    if (year) {
      params.append('year', year.toString());
    }

    const response = await fetch(`${url}?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: MedicalRecordPaginationResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching medical records:', error);
    throw error;
  }
}