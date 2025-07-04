

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


export async function getRommm (page : number) {
  try {
    const result = await fetch(`${API_BASE_URL}/Phong_Kham/Pagination?page=${page}`);
    if (result.ok){
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

 
export async function getTestingRoom (page : number) {
  try {
    const result = await fetch(`${API_BASE_URL}/Phong_Thiet_Bi/Pagination?page=${page}`);
    if (result.ok) {
      const Data = await result.json();
      return Data;
    } else {
      const errorText = await result.text();
      console.error(`Lỗi fetch Phong_Thiet_Bi /Pagination: ${result.status} - ${errorText}`);
      return 'Lỗi khi lấy Phong_Thiet_Bi';
    }
  } catch (error) {
    console.error("Exception khi lấy Phong_Thiet_Bi", error);
    throw error;
  }   
} 
