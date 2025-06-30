export interface LoginResponse {
  message: string;
  Data_Token_?: string;
}

export interface LoginParams {
  soDienThoai: string;
  matKhau: string;
  idLoaiTaiKhoan: string;
}
