
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// lấy danh sách tài khoản
export async function getstaffAdmin(page : number) {
  try {
    const result = await fetch(`${API_BASE_URL}/Tai_Khoan/Pagination?page=${page}`);
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


// Tìm kiếm tài khoản - 
export async function  searchAccount(key : string) {
  try {
    const result = await fetch(`http://localhost:5000/Tai_Khoan/Search?Key=${key}`);
    if (result.ok) {
      const Data = await result.json();
      return Data;
    } else {
      const errorText = await result.text();
      console.error(`Lỗi fetch tài khoản  : ${result.status} - ${errorText}`);
      return 'Lỗi khi lấy tài khoản';
    }
  } catch (error) {
    console.error("Exception khi lấy tài khỏa", error);
    throw error;
  }
}



// Tìm kiếm tài khoản
export async function searchstaffAdmin(page : number) {
  try {
    const result = await fetch(`${API_BASE_URL}/Tai_Khoan/Pagination?page=${page}`);
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



// lấy danh sách loại tài khoản
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
