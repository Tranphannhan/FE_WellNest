

// Phòng khám
export interface ClinicType {
  _id?: string;
  Id_Khoa?: string;
  SoPhongKham?: string;
}

export interface Khoa {
 _id: string,
  TenKhoa : string ,
  TrangThaiHoatDong : boolean
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
  ID_Khoa?: Khoa;
  Image?: string;
  Matkhau?: string;
  TrangThaiHoatDong?: boolean;
  VaiTro?: string;
  NamSinh?: string;
  Id_PhongKham?: ClinicType;
  SoCCCD:string;
}


