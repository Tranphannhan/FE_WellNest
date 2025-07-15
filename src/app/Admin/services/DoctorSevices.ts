
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


// Tìm kiếm loại khoa
export async function Searchfordepartmenttype (key : string){
   try {
    const result = await fetch(`http://localhost:5000/Khoa/Search?Key=${key}`);
    if (result.ok) {
      const Data = await result.json();
      return Data;
    } else {
      const errorText = await result.text();
      console.error(`Lỗi fetch Loại Khoa /Pagination: ${result.status} - ${errorText}`);
      return 'Lỗi khi lấy loại khoa';
    }
  } catch (error) {
    console.error("Exception khi lấy loại khoa", error);
    throw error;
  }
}





// tìm kiếm bác sĩ
export async function FindDoctor (key : string) {
  try {
    const result = await fetch(`http://localhost:5000/Bacsi/Search?Key=${key}`);
    if (result.ok){
      const Data = await result.json();
      return Data;
    } else {
      const errorText = await result.text();
      console.error(`Lỗi fetch Bacsi/Pagination: ${result.status} - ${errorText}`);
      return 'Lỗi khi tìm kiếm bác sĩ';
    }
  } catch (error) {
    console.error("Lỗi khi tìm kiếm bác sĩ", error);
    throw error;
  }   
}
