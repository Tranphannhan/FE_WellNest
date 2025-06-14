
export interface DoctorTemporaryTypes {
    _id: string,
    Id_PhieuKhamBenh : string,
    Id_LoaiXetNghiem : {
        _id : string,
        Id_PhongThietBi: {
            _id: string,
            TenPhongThietBi : string
        },

        Id_GiaDichVu : {
            _id : string,
            Giadichvu : number
        },

        TenXetNghiem: string,
        Image : string
    },

    TrangThaiThanhToan : boolean,
    Ngay : string,
    STT : string,
    TrangThai : boolean,
    TrangThaiHoatDong : boolean,
    __v : number 
}