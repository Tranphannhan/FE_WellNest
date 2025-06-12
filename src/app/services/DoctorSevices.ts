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
 



