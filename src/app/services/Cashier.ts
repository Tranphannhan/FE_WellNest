import { prescriptionType } from "../types/patientTypes/patient";


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
