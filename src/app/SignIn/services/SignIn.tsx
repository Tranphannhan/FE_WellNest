const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function signInUnified(
  soDienThoai: string,
  matKhau: string,
  idLoaiTaiKhoan: string,
  role: string
) {
  const url = role === 'doctor'
    ? `${API_BASE_URL}/Bacsi/Login`
    : `${API_BASE_URL}/Tai_Khoan/Login/${idLoaiTaiKhoan}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      SoDienThoai: soDienThoai,
      MatKhau: matKhau,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.Data_Token_) {
    throw new Error(data.message || 'Đăng nhập thất bại');
  }

  sessionStorage.setItem('token', data.Data_Token_);

  return data;
}
