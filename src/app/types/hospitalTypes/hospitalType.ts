import { paraclinicalType } from "../patientTypes/patient";

export interface medicineGroupType {
  _id?: string;
  TenNhomThuoc?: string;
}


// Thuốc
export interface medicineType {
  _id?: string;
  Id_NhomThuoc?: medicineGroupType;
  TenThuoc?: string;
  Gia?: number;
  __v?: number;
  DonVi ? : string
}

export interface MedicinePaginationResponse {
    data: medicineType[];
    totalItems: number; // Đã đổi từ 'total' sang 'totalItems'
    currentPage: number;
    totalPages: number;
}

export interface prescriptionType{
    Id_PhieuKhamBenh?:string;
    TenDonThuoc?:string;
    TrangThaiThanhToan?: boolean;
    TrangThai?:boolean;
    _id?:string;
    
} 

// Phòng thiết bị
interface EquipmentType {
    _id: string;
    TenPhongThietBi: string;
    TenXetNghiem : string;
    Image : string
}




// Loại xét nghiệm
export interface Testtype {
    _id: string;
    Id_PhongThietBi: EquipmentType;
    TenXetNghiem: string;
    Id_GiaDichVu : ServicePriceType
} 

export interface PrescriptionStatsType {
  _id?: string;
  Id_PhieuKhamBenh?: string;
  Ngay?: string;
  TenDonThuoc?: string;
  TrangThaiThanhToan?: boolean;
  Gio?: string;
  TrangThai?: string;
  createdAt?: string; // Đã có
  updatedAt?: string; // Đã có
  __v?: number;
  TongTien?: number;
}

//Phản hồi yêu cầu phân trang thuốc
export interface PrescriptionStatsPaginationResponse {
  data: PrescriptionStatsType[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
}

//Type Giá dịc vụ
export interface ServicePriceType {
  _id?: string;
  Tendichvu?: string;
  Giadichvu?: number;
  Loaigia?: string;
  TrangThaiHoatDong?: boolean;
  __v?: number;
}

//Loại cận lâm sàng
export interface ParaclinicalType {
  _id?: string;
  Id_PhongThietBi?: string;
  Id_GiaDichVu?: ServicePriceType;
  TenXetNghiem?: string;
  MoTaXetNghiem?: string;
  Image?: string;
  TrangThaiHoatDong?: boolean;
  __v?: number;
}

//Loại yêu cầu cận lâm sàng
export interface TestRequestType {
  _id?: string;
  Id_PhieuKhamBenh?: string;
  Id_LoaiXetNghiem?: ParaclinicalType;
  Gio?: string;
  TrangThaiThanhToan?: boolean;
  Ngay?: string;
  STT?: string;
  TrangThai?: boolean;
  TrangThaiHoatDong?: boolean;
  createdAt?: string; // Đã có
  updatedAt?: string; // Đã có
  __v?: number;
}

//Phản hồi yêu cầu phân trang
export interface TestRequestPaginationResponse {
  data: TestRequestType[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
}

export interface MedicalRecordType {
  _id?: string;
  Id_TheKhamBenh?: string;
  Id_Bacsi?: string;
  Id_NguoiTiepNhan?: string;
  Id_GiaDichVu?: ServicePriceType;
  LyDoDenKham?: string;
  Ngay?: string;
  Gio?: string;
  TrangThaiThanhToan?: boolean;
  STTKham?: number;
  TrangThai?: boolean;
  TrangThaiHoatDong?: string;
  GioKetThucKham?: string;
  SoLanKhongCoMat?: number;
  createdAt?: string; // <-- THÊM VÀO ĐÂY
  updatedAt?: string; // <-- THÊM VÀO ĐÂY
  __v?: number;
}

// Interface cho response từ API phiếu khám bệnh
export interface MedicalRecordPaginationResponse {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  data: MedicalRecordType[];
}


// Dũ liệu phân trang
export type ParaclinicalResponse = {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    TongTien: number;
    data: paraclinicalType[];
};



// đơn thuốc chi tiết
// export interface detailedPrescriptionType {
//   _id : string;
//   Id_DonThuoc : string;
//   Id_Thuoc : medicineType;
//   SoLuong : number;
//   NhacNho : string;
// }



// Tài khoản
export interface Accounttype {
  _id: string;
  TenLoaiTaiKhoan: string;
  VaiTro: string;
  __v: number;
}


export interface Staff {
  _id: string;
  Id_LoaiTaiKhoan: Accounttype;
  TenTaiKhoan: string;
  MatKhau: string;
  SoDienThoai: string;
  SoCCCD: string;
  Image: string;
  __v: number;
  TrangThaiHoatDong: boolean;
  GioiTinh : string
}
