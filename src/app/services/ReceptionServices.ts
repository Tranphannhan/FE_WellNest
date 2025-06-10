import { medicalCardData } from '@/app/types/patientTypes/patient';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
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


export async function getAllChooseRooms (_id : string) {
    try {
        const result = await fetch(`${API_BASE_URL}/Bacsi/LayTheoKhoa/Pagination/${_id}`);
        if (result){
            return result.json ();
        }
    } catch (error) {
        console.error("Lỗi Khi Lấy Khoa:", error);
        throw error; 
    }
}

