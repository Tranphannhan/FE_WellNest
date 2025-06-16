

// Phòng khám
export interface ClinicType {
  _id?: string;
  Id_Khoa?: string;
  SoPhongKham?: string;
}

// Bác sĩ
export interface DoctorType {
  _id?: string;
  TenBacSi?: string;
  GioiTinh?: string;
  SoDienThoai?: string;
  ChuyenKhoa?: string;
  HocVi?: string;
  __v?: number;
  ID_Khoa?: string;
  Image?: string;
  Matkhau?: string;
  TrangThaiHoatDong?: boolean;
  VaiTro?: string;
  NamSinh?: number;
  Id_PhongKham?: ClinicType;
}


