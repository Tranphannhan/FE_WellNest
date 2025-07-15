const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface LoginResponse {
  Data_Token_: string;
  message: string;
}

export class CustomError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "CustomError";
    this.status = status;
  }
}

export async function signInUnified(
  soDienThoai: string,
  matKhau: string,
  idLoaiTaiKhoan: string,
  role: string
): Promise<LoginResponse> {
  const url =
    role === "doctor"
      ? `${API_BASE_URL}/Bacsi/Login`
      : `${API_BASE_URL}/Tai_Khoan/Login/${idLoaiTaiKhoan}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      SoDienThoai: soDienThoai,
      MatKhau: matKhau,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data?.Data_Token_) {
    throw new CustomError(data?.message || "Đăng nhập thất bại", response.status);
  }

  // ✅ Lưu token vào cookie thay vì sessionStorage
  if (typeof window !== "undefined") {
    document.cookie = `token=${data.Data_Token_}; path=/; max-age=86400`; // 1 ngày
  }

  return data;
}
