

export interface receptionTemporaryDoctorTypes  {
    _id : string,
    Id_PhongKham: {
        _id: string,
        SoPhongKham : string
    },
    TenBacSi: string,
    SoNguoiDangKham : number
}


export interface TemporaryExaminationFormResponse  {
  _id: string;
  Id_TheKhamBenh: {
    _id: string;
    HoVaTen: string;
    GioiTinh: string;
    NgaySinh: string;
    SoDienThoai: string;
    SoBaoHiemYTe: string;
    DiaChi: string;
    SoCCCD: string;
    SDT_NguoiThan: string;
    LichSuBenh: string;
    __v: number;
  };
  Id_Bacsi: {
    _id: string;
    ID_Khoa: string;
    TenBacSi: string;
    GioiTinh: string;
    SoDienThoai: string;
    HocVi: string;
    NamSinh: number;
    Matkhau: string;
    Image: string;
    VaiTro: string;
    TrangThaiHoatDong: boolean;
    __v: number;
    Id_PhongKham: {
      _id: string;
      Id_Khoa: string;
      SoPhongKham: string;
    };
  };
  Id_NguoiTiepNhan: string;
  Id_GiaDichVu: string;
  LyDoDenKham: string;
  Ngay: string;
  Gio: string;
  TrangThaiThanhToan: boolean;
  STTKham: string;
  TrangThai: boolean;
  TrangThaiHoatDong: string;
  __v: number;
}
