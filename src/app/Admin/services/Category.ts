

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getCategoryAdmin () {
  try {
    const result = await fetch(`${API_BASE_URL}/Loai_Tai_Khoan`); 
    if (result.ok) {
      const Data = await result.json();
      return Data;
    } else {
      const errorText = await result.text();
      console.error(`Lỗi fetch loại tài khoản: ${result.status} - ${errorText}`);
      return 'Lỗi khi lấy loại tài khoản';
    }
  } catch (error) {
    console.error("Exception khi lấy loại tài khoản", error);
    throw error;
  }
} 


export async function getCategoryDepartments (page :  number) {
  try {
    const result = await fetch(`${API_BASE_URL}/Khoa/Pagination?page=${page}`); 
    if (result.ok) {
      const Data = await result.json();
      return Data;
    } else {
      const errorText = await result.text();
      console.error(`Lỗi fetch loại tài khoản: ${result.status} - ${errorText}`);
      return 'Lỗi khi lấy loại tài khoản';
    }
  } catch (error) {
    console.error("Exception khi lấy loại tài khoản", error);
    throw error;
  }
} 



export async function getTypeOfTest (page :  number) {
  try {
    const result = await fetch(`${API_BASE_URL}/Loaixetnghiem?page=${page}`); 
    if (result.ok) {
      const Data = await result.json();
      return Data;
    } else {
      const errorText = await result.text();
      console.error(`Lỗi fetch loại tài khoản: ${result.status} - ${errorText}`);
      return 'Lỗi khi lấy loại tài khoản';
    }
  } catch (error) {
    console.error("Exception khi lấy loại tài khoản", error);
    throw error;
  }
} 


// lấy theo nhóm thuốc
export async function getDrugGroup (page : number) {
  try {
    const result = await fetch(`${API_BASE_URL}/Nhomthuoc/pagination?page=${page}`); 
    if (result.ok) {
      const Data = await result.json();
      return Data;

    } else {
      const errorText = await result.text();
      console.error(`Lỗi fetch nhóm thuốc: ${result.status} - ${errorText}`);
      return 'Lỗi khi lấy nhóm thuốc';
    }
  } catch (error) {
    console.error("Exception khi lấy nhóm thuốc", error);
    throw error;
  }
} 


// lấy danh sách thuốc
export async function getListOfDrugs (page : number) {
  try {
    const result = await fetch(`${API_BASE_URL}/Thuoc/Pagination?page=${page}`); 
    if (result.ok) {
      const Data = await result.json();
      return Data;

    } else {
      const errorText = await result.text();
      console.error(`Lỗi fetch nhóm thuốc: ${result.status} - ${errorText}`);
      return 'Lỗi khi lấy nhóm thuốc';
    }
  } catch (error) {
    console.error("Exception khi lấy nhóm thuốc", error);
    throw error;
  }
} 


  
// lấy danh sách dịch vụ xét nghiệm
export async function getTestGroup (page : number) {
  try {
    const result = await fetch(`${API_BASE_URL}/Giadichvu/ServiceGroup/Pagination?page=${page}`); 
    if (result.ok) {
      const Data = await result.json();
      return Data;

    } else {
      const errorText = await result.text();
      console.error(`Lỗi fetch nhóm dịch vụ xét nghiệm: ${result.status} - ${errorText}`);
      return 'Lỗi khi lấy nhóm dịch vụ xét nghiệm';
    }
  } catch (error) {
    console.error("Exception khi lấy nhóm dịch vụ xét nghiệm", error);
    throw error;
  }
} 


// lấy danh sách giá khá
export async function getExaminationPrice (page : number) {
  try {
    const result = await fetch(`${API_BASE_URL}/Giadichvu/ExaminationPriceGroup/Pagination?page=${page}`); 
    if (result.ok) {
      const Data = await result.json();
      return Data;

    } else {
      const errorText = await result.text();
      console.error(`Lỗi fetch nhóm dịch vụ xét nghiệm: ${result.status} - ${errorText}`);
      return 'Lỗi khi lấy nhóm dịch vụ xét nghiệm';
    }
  } catch (error) {
    console.error("Exception khi lấy nhóm dịch vụ xét nghiệm", error);
    throw error;
  }
} 



// lấy danh sách hóa đơn 
export async function getBill(page: number , category  : string) {
  try {
    const result = await fetch(
      `${API_BASE_URL}/Hoadon/LayTheoLoai?LoaiHoaDon=${category}&page=${page}`
    );

    if (result.ok) {
      const data = await result.json();
      return data;
    } else {
      const errorText = await result.text();
      console.error(`Lỗi fetch: ${result.status} - ${errorText}`);
      return { data: [], totalItems: 0 };
    }
  } catch (error) {
    console.error("Exception khi gọi API:", error);
    return { data: [], totalItems: 0 };
  }
}