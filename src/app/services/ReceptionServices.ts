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
        const response = await fetch(`http://localhost:5000/Phieu_Kham_Benh/Xacnhanthanhtoan/${id}`,
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
        const response = await fetch(`http://localhost:5000/Phieu_Kham_Benh/Detail/${id}`
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