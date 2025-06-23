export interface medicineGroupType {
  _id?: string;
  TenNhomThuoc?: string;
}

export interface medicineType {
  _id?: string;
  Id_NhomThuoc?: medicineGroupType;
  TenThuoc?: string;
  Gia?: number;
  __v?: number;
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

//Type Don thuoc thong ke
export interface PrescriptionStatsType {
  _id?: string;
  Id_PhieuKhamBenh?: string;
  Ngay?: string;
  TenDonThuoc?: string;
  TrangThaiThanhToan?: boolean;
  Gio?: string;
  TrangThai?: string;
  createdAt?: string;
  updatedAt?: string;
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
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

//Phản hồi yêu cầu phân trang
export interface TestRequestPaginationResponse {
  data: TestRequestType[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
}