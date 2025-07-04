
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getDoctorAdmin(page : number) {
  try {
    const result = await fetch(`${API_BASE_URL}/Bacsi/Pagination?page=${page}`);
    if (result.ok) {
      const Data = await result.json();
      return Data;
    } else {
      const errorText = await result.text();
      console.error(`Lỗi fetch Bacsi/Pagination: ${result.status} - ${errorText}`);
      return 'Lỗi khi lấy bác sĩ';
    }
  } catch (error) {
    console.error("Exception khi lấy bác sĩ", error);
    throw error;
  }
} 


export async function getkhoaOptions (page : number){
   try {
    const result = await fetch(`${API_BASE_URL}/Khoa/Pagination?page=${page}`);
    if (result.ok) {
      const Data = await result.json();
      return Data;
    } else {
      const errorText = await result.text();
      console.error(`Lỗi fetch Select Bác sĩ/Pagination: ${result.status} - ${errorText}`);
      return 'Lỗi khi lấy bác sĩ';
    }
  } catch (error) {
    console.error("Exception khi lấy danh mục bác sĩ", error);
    throw error;
  }
}