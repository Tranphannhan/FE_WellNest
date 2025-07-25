import { medicalCardData } from '@/app/types/patientTypes/patient';
import API_BASE_URL from "@/app/config";
export async function createMedicalExaminationCard(data:medicalCardData) {
    try {
        const result = await fetch(`${API_BASE_URL}/The_Kham_Benh/Add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                HoVaTen: data.name,
                GioiTinh: data.sex,
                NgaySinh: data.dateOfBirth,
                SoDienThoai: data.phone,
                DiaChi: data.address,
                SoCCCD: data.CCCDNumber,
                SoBaoHiemYTe: data.BHYT || '', 
                SDT_NguoiThan: data.relativePhone || '',
                LichSuBenh: data.medicalHistory || '',
            }),
        });
        return result;
    } catch (error) {
        console.error("Lỗi khi tạo thẻ khám bệnh:", error);
        throw error; 
    }
}


export async function getAllDepartments() {
        try {
        const result = await fetch(`${API_BASE_URL}/Khoa/Pagination?TrangThaiHoatDong=true`);
        return result;
    } catch (error) {
        console.error("Lỗi Khi Lấy Khoa:", error);
        throw error; 
    }
}


export async function getAllChooseRooms (_id : string,currentPage:number) {
    try {
        const result = await fetch(`${API_BASE_URL}/Bacsi/LayTheoKhoa/Pagination/${_id}?page=${currentPage}`);
        if (result){
            return result.json ();
        }
    } catch (error) {
        console.error("Lỗi Khi Lấy Khoa:", error);
        throw error; 
    }
}

export async function handlePay(id:string){

    try {
        const response = await fetch(`${API_BASE_URL}/Phieu_Kham_Benh/Xacnhanthanhtoan/${id}`,
            {method:'PATCH'}
        )
        if(response.ok){
            const data =await response.json();
            if(data.TrangThaiDaThanhToan){
                return ({
                    message:data.message,
                    status:false,
                })
            }else{
                return ({
                    message:data.message,
                    status:true,
                    QueueNumber: data.data.STTKham
                })
            }
        }
    } catch{
        return ({
                message:'Lỗi server khi thanh toán',
                status:false
        })
    }
     
  }


  export async function checkPay(id:string){

    try {
        const response = await fetch(`${API_BASE_URL}/Phieu_Kham_Benh/Detail/${id}`
        )
        if(response.ok){
            const data =await response.json();
            if(data[0].TrangThaiThanhToan){
                return ({
                    status:true
                })
            }else{
                return ({
                    status:false
                })
            }
        }
    } catch{
        return ({
                status:false
        })
    }
     
  }

  export async function searchMedicalExaminationBook(phone:string,name:string,page:number = 1) {
        try{
            const respone = await fetch(`${API_BASE_URL}/The_Kham_Benh/TimKiemSoKhamBenh/Pagination?sdt=${phone}&ten=${name}&page=${page}`);
            if(respone.ok){
            return (await respone.json())
            }else{
            console.error("Lỗi Khi Lấy thẻ khám bệnh:");
        }
        }catch(error){
                console.error("Lỗi Khi Lấy thẻ khám bệnh:", error);
                throw error; 
        }
  }

  

export async function GetPriceDiscovery(){
  try {
    const response = await fetch(`${API_BASE_URL}/Giadichvu/ActiveGiaKham`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Lỗi khi gọi API: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy giá khám:", error);
    return null;
  }
}

// services/suggestKhoa.ts

// services/suggestKhoa.ts

export async function fetchSuggestedKhoa(symptoms: string[]) {
  try {
    const response = await fetch(`${API_BASE_URL}/Khoa/Suggest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ symptoms }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Lỗi không xác định");
    }

    return data.data; // { symptoms, khoaUuTien, khoaLienQuan }
  } catch (error) {
    console.error("Lỗi khi gợi ý khoa:", error);
    return null;
  }
}


export const getSystemFunctions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/Chuc_Nang_He_Thong`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Lỗi HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error("Lỗi khi lấy chức năng hệ thống:", error);
    throw error;
  }
};

export const getSTTKham = async (id: string)=> {
  try {
    const response = await fetch(`${API_BASE_URL}/Phieu_Kham_Benh/Detail/${id}`);
    if (!response.ok) throw new Error("Lỗi khi gọi API");

    const data = await response.json();

    if (data) {
      return data[0].STTKham;
    }

    console.warn("Không tìm thấy trường STTKham trong kết quả");
    return null;
  } catch (error) {
    console.error("Lỗi khi lấy STTKham:", error);
    return null;
  }
};
