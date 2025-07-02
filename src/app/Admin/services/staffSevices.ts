
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getstaffAdmin() {
  try {
    const result = await fetch(`${API_BASE_URL}/Tai_Khoan/Pagination`);
    if (result.ok) {
      const Data = await result.json();
      return Data;
    } else {
      const errorText = await result.text();
      console.error(`Lỗi fetch nhân viên : ${result.status} - ${errorText}`);
      return 'Lỗi khi lấy nhân viên';
    }
  } catch (error) {
    console.error("Exception khi lấy nhân viên", error);
    throw error;
  }
}



export async function getOptionstaffAdmin() {
  try {
    const result = await fetch(`${API_BASE_URL}/Loai_Tai_Khoan`);
    if (result.ok) {
      const Data = await result.json();
      return Data;
    } else {
      const errorText = await result.text();
      console.error(`Lỗi fetch loại tài khoản nhân viên : ${result.status} - ${errorText}`);
      return 'Lỗi khi lấy loại tài khoản nhân viên';
    }
  } catch (error) {
    console.error("Exception khi lấy loại tài khoản nhân viên", error);
    throw error;
  }
}
