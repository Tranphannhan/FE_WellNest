import { medicalCardData } from '@/app/types/patientTypes/patient';

export async function createMedicalExaminationCard(data:medicalCardData) {
    try {
        const kq = await fetch('http://localhost:5000/The_Kham_Benh/Add', {
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
        return kq;
    } catch (error) {
        console.error("Lỗi khi tạo thẻ khám bệnh:", error);
        throw error; 
    }
}