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
export async function confirmTestRequestPayment(id: string){
  try {
    const response = await fetch(`${API_BASE_URL}/Yeu_Cau_Xet_Nghiem/Xacnhanthanhtoan?Id_PhieuKhamBenh=${id}`, {
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