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