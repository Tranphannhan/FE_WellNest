// import { Testtype } from "../types/hospitalTypes/hospitalType";
import { ParaclinicalResponse } from "../types/hospitalTypes/hospitalType";
import { paraclinicalType, prescriptionType } from "../types/patientTypes/patient";



export async function getPrescriptionPendingPayment (): Promise<prescriptionType | null> {
  try {
    const response = await fetch(`http://localhost:5000/Donthuoc/DonThuocThuNgan/Pagination?TrangThaiThanhToan=false&gidzl=kEmFJg2atsUrzmz1hBhQQR3r2Ksoi8nfh_u96hkttZAagLeKkEEBPgEcMqwyxDjgzg0AIZCiVU4HfwNVRG`);
    if (!response.ok) return null;
    const data =await response.json();
    return data.data
  } catch (error) {
    console.error("Fetch lỗi:", error);
    return null;
  }
}


// yêu cầu xét nghiệm 
export async function getParaclinicalAwaitingPayment (): Promise<paraclinicalType | null> {
  try {
    const response = await fetch(`http://localhost:5000/Yeu_Cau_Xet_Nghiem/YeuCauXetNghiemThuNgan/Pagination?TrangThaiThanhToan=false&gidzl=ReQG2WGF9X5ZdP05214Z7s6PaGuH52yOVP3C0qOOSn8gbv89GKXs72gMm0yN6dDFBSJ3NJTUl8SZ0muc6m`);
    if (!response.ok) return null;
    const data =await response.json();
    return data.data
  } catch (error) {
    console.error("Fetch lỗi:", error);
    return null;
  }
}


// chi tiết xét nghiệm 
export async function getDetailParaclinicalAwaitingPayment (id : string): Promise<ParaclinicalResponse | null> {
  try {
    const response = await fetch(`http://localhost:5000/Yeu_Cau_Xet_Nghiem/YeuCauXetNghiemThuNgan/Detail?Id_PhieuKhamBenh=${id}`);
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
    const response = await fetch(`http://localhost:5000/Donthuoc/Detail/${id}`);
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
    const response = await fetch(`http://localhost:5000/Donthuoc_Chitiet/LayTheoDonThuoc/${id}`);
    if (!response.ok) return null;
    const data =await response.json();
    return data
  } catch (error) {
    console.error("Fetch lỗi:", error);
    return null;
  }
}