

import {  MedicalExaminationCard, survivalIndexType } from "../types/patientTypes/patient";
import { showToast, ToastType } from "../lib/Toast";

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
      method : 'Patch',
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