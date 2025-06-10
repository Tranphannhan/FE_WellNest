export interface doctorTemporaryTypes {
    _id: string;
    Id_TheKhamBenh: {
        _id: string;
        HoVaTen: string;
        GioiTinh: string;
        NgaySinh: string; // Vẫn để là string để khớp chính xác dữ liệu bạn cung cấp
        SoDienThoai: string;
        SoBaoHiemYTe: string;
        DiaChi: string;
        SoCCCD: string;
        SDT_NguoiThan: string;
        LichSuBenh: string;
        __v: number;
    };
    Id_NguoiTiepNhan: string;
    Ngay: string; // Vẫn để là string
    TrangThaiThanhToan: boolean;
    STTKham: string; // Vẫn là string như dữ liệu bạn cung cấp
    TrangThai: boolean;
    TrangThaiHoatDong: string;
    __v: number;
    Id_GiaDichVu: string;
    Id_Bacsi: string;
}