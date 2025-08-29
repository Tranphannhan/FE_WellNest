

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


// lấy danh sách loại tài khoản
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


// tìm kiếm danh sách loại tài khoản
export async function SearchCategoryAdmin (key : string) {
  try {
    const result = await fetch(`${API_BASE_URL}/Loai_Tai_Khoan/Search?Key=${key}`); 
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


// tìm kiếm loại xét nghiệm
export async function Searchfortesttype (key : string) {
  try {
    const result = await fetch(`${API_BASE_URL}/Loaixetnghiem/Search?Key=${key}`); 
    if (result.ok) {
      const Data = await result.json();
      return Data;
    } else {
      const errorText = await result.text();
      console.error(`Lỗi fetch loại xét nghiệm : ${result.status} - ${errorText}`);
      return 'Lỗi khi lấy loại xét nghiệm';
    }
  } catch (error) {
    console.error("Exception khi lấy loại xét nghiệm", error);
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

// Chuyển đổi trạng thái nhóm thuốc
export async function DrugStatusChange   (id: string, currentStatus: boolean) {
  const res = await fetch(
    `${API_BASE_URL}/Nhomthuoc/StateChange/${id}?TrangThaiHoatDong=${currentStatus}`,
    {
      method: "PATCH",
    }
  );

  const data = await res.json();
  return data; 
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


// Chuyển đổi trạng thái thuốc
export async function TestConversiondrugStateChangeStatusEvaluation (id: string, currentStatus: boolean) {
  const res = await fetch(
    `${API_BASE_URL}/Thuoc/StateChange/${id}?TrangThaiHoatDong=${currentStatus}`,
    {
      method: "PATCH",
    }
  );

  const data = await res.json();
  return data; 
}



// tìm kiếm thuốc
export async function SearchForMedicine (key : string) {
  try {
    const result = await fetch(`${API_BASE_URL}/Thuoc/TimKiemTenThuoc?TenThuoc=${key}`); 
    if (result.ok) {
      const Data = await result.json();
      return Data;

    } else {
      const errorText = await result.text();
      console.error(`Lỗi fetch nhóm thuốc: ${result.status} - ${errorText}`);
      return 'Lỗi khi tìm kiếm thuốc';
    }
  } catch (error) {
    console.error("Exception khi lấy thuốc", error);
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


// tìm kiếm giá dịch vụ
export async function searchserviceprice (key : string , Loaigia : string) {
  try {
    const result = await fetch(`${API_BASE_URL}/Giadichvu/Search?Key=${key}&Loaigia=${Loaigia}`); 
    if (result.ok) {
      const Data = await result.json();
      return Data;

    } else {
      const errorText = await result.text();
      console.error(`Lỗi fetch giá dịch vụ: ${result.status} - ${errorText}`);
      return 'Lỗi khi lấy giá dịch vụ';
    }
  } catch (error) {
    console.error("Exception khi lấy giá dịch vụ", error);
    throw error;
  }
} 


//cập nhật trang thái giá dịch vụ
export async function ServicePriceStatusUpdate (id: string, currentStatus: boolean) {
  const res = await fetch(
    `${API_BASE_URL}/Giadichvu/SuaTrangThai/${id}?TrangThaiHoatDong=${currentStatus}`,
    {
      method: "PATCH",
    }
  );

  const data = await res.json();
  return data; 
}
 




// lấy danh sách hóa đơn 
export async function getBill(page: number , category  : string) {
  try {
    const result = await fetch(
      `${API_BASE_URL}/Hoadon/LayTheoLoai?LoaiHoaDon=${category}&page=${page}`
    );

    if (result.ok) {
      const data = await result.json();
      console.log('data');
      console.log(data);
      
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


// tìm kiếm hóa đơn 
export async function SearchBill (Type: string , key  : string) {
  try {
    const result = await fetch(
      `${API_BASE_URL}/Hoadon/SearchByType?LoaiHoaDon=${Type}&HoVaTen=${key}`
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

export async function activateExaminationPrice(id: string) {
  try {
    const result = await fetch(`${API_BASE_URL}/Giadichvu/ActivateGiaKham/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (result.ok) {
      const data = await result.json();
      return data;
    } else {
      const errorText = await result.text();
      console.error(`Lỗi kích hoạt giá GiaKham: ${result.status} - ${errorText}`);
      return 'Lỗi khi kích hoạt giá GiaKham';
    }
  } catch (error) {
    console.error("Exception khi kích hoạt giá GiaKham", error);
    throw error;
  }
}