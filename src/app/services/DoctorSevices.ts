

import {  clinicalType, diagnosisType, laboratoryType, MedicalExaminationCard, survivalIndexType } from "../types/patientTypes/patient";
import { showToast, ToastType } from "../lib/Toast";
import { DoctorTemporaryTypes } from "../types/doctorTypes/doctorTestTypes";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getAllPatient (Id_Bacsi : string , TrangThai : boolean , TrangThaiHoatDong : string) {
        try {
        const result = await fetch(`${API_BASE_URL}/Phieu_Kham_Benh/GetById_CaKham_Date/Pagination?Id_Bacsi=${Id_Bacsi}&TrangThai=${TrangThai}&TrangThaiHoatDong=${TrangThaiHoatDong}`);
        if (result.ok){
            const Data = await result.json ();
            return Data.data;
        } else {
            return ('Lỗi Khi Lấy Bác Sĩ')
        }

    } catch (error) {
        console.error("Lỗi Khi Lấy Bác Sĩ:", error);
        throw error; 
    }
}  
 

export async function getDetailMedicalExaminationCard(id: string): Promise<MedicalExaminationCard | null> {
  try {
    const response = await fetch(`http://localhost:5000/Phieu_Kham_Benh/Detail/${id}`);
    if (!response.ok) return null;
    const data =await response.json();
    return data[0]
  } catch (error) {
    console.error("Fetch lỗi:", error);
    return null;
  }
}

// Lấy chỉ số sinh tồn theo Id_PhieuKhamBenh 
export async function getVitalSignsByExaminationId(id: string): Promise<survivalIndexType | null> {
  try {
    const response = await fetch(`http://localhost:5000/Chi_So_Sinh_Ton/LayTheoPhieuKhamBenh?Id_PhieuKhamBenh=${id}`);
    if (!response.ok) return null;
    const data =await response.json();
    return data[0]
  } catch (error) {
    console.error("Fetch lỗi:", error);
    return null;
  }
}



// Cập nhât chỉ số sinh tồn
export async function updateSurvivalIndex (id : string , data : survivalIndexType) {
  try {
    const response = await fetch(`http://localhost:5000/Chi_So_Sinh_Ton/Update/${id}`,{
      method : 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify (data)
    });

    if (!response.ok) return  showToast('Lưu chỉ số sinh tồn thất bại' , ToastType.error);
    return response.json();

  } catch (error) {
    console.error("Fetch lỗi:", error);
    return null;
  }

}

export async function addDiagnosis (idMedicalExaminationCard : string , dataAdd : diagnosisType) {
  try {
    const response = await fetch(`http://localhost:5000/Kham_Lam_Sang/Add`,{
      method : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify ({Id_PhieuKhamBenh:idMedicalExaminationCard})
    });

    if (!response.ok) return  showToast('Tạo kết quả khám lâm sàng thất bại' , ToastType.error);
    const data = await response.json()
    const id = data.data._id;

     const response2 = await fetch(`http://localhost:5000/Chi_Tiet_Kham_Lam_Sang/Add`,{
      method : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify ({...dataAdd,Id_KhamLamSang:id})
    });
     if (!response2.ok) return  showToast('Tạo kết quả chuẩn đoán thất bại' , ToastType.error);
     const data2 = await response2.json()
     return data2
  } catch (error) {
    console.error("Fetch lỗi:", error);
    return null;
  }

}

export async function getAllPagination(): Promise<laboratoryType[] | string> {
    try {
        const result = await fetch(`${API_BASE_URL}/Phong_Thiet_Bi/Pagination`);
        if (result.ok) {
            const Data = await result.json();
            return Data.data;
        } else {
            const errorText = await result.text();
            console.error(`Error fetching equipment rooms: ${result.status} - ${errorText}`);
            return 'Lỗi Khi Lấy Phòng Thiết Bị';
        }
    } catch (error) {
        console.error("Lỗi Khi Lấy Phòng Thiết Bị:", error);
        throw error;
    }
}

export async function getIdByTest(Id_PhongThietBi: string): Promise<clinicalType[] | string> {
    try {
        const result = await fetch(`${API_BASE_URL}/Loaixetnghiem/LayTheoIdPhongThietBi/${Id_PhongThietBi}`);

        if (result.ok) {
            const Data = await result.json();
            return Data.data || Data;
        } else {
            const errorText = await result.text();
            console.error(`Error fetching LoaiXetNghiem by Id_PhongThietBi: ${result.status} - ${errorText}`);
            return 'Lỗi Khi Lấy Loại Xét Nghiệm Theo ID Phòng Thiết Bị';
        }
    } catch (error) {
        console.error("Lỗi Khi Lấy Loại Xét Nghiệm Theo ID Phòng Thiết Bị:", error);
        throw error;
    }
}



export async function getDoctorTemporaryTypes (id: string): Promise<DoctorTemporaryTypes | null> {
  try {
    const response = await fetch(`http://localhost:5000/Yeu_Cau_Xet_Nghiem/LayTheoPhieuKhamBenh/${id}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data[0]

  } catch (error) {
    console.error("Fetch lỗi:", error);
    return null;
  }
}



export async function deleteDoctorTemporaryTypes (id: string){
  try {
    const response = await fetch(`http://localhost:5000/Yeu_Cau_Xet_Nghiem/Delete/${id}`,{
      method : 'DELETE',
    });

    if (!response.ok) return  showToast('Xóa xóa xét nghiệm cận lâm sàng thất bại' , ToastType.error);
    return showToast('Xóa xóa xét nghiệm cận lâm sàng thành công' , ToastType.success);
  }
  
  catch (error) {
    console.error("Fetch lỗi:", error);
    return null;
  }
}
