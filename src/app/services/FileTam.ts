const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Define interfaces for better type safety and autocompletion
interface paginationType {
    _id: string;
    TenPhongThietBi: string;
    TenXetNghiem: string;
    Image: string;
    __v: number;
}

interface testType {
    _id: string;
    Id_PhongThietBi: string | null;
    Id_GiaDichVu: {
        _id: string;
        Giadichvu: number;
    };
    TenXetNghiem: string;
    MoTaXetNghiem: string;
    Image: string;
    TrangThaiHoatDong: boolean;
    __v: number;
}

export async function getAllPagination(): Promise<paginationType[] | string> {
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

export async function getIdByTest(Id_PhongThietBi: string): Promise<testType[] | string> {
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