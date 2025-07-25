

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

// lấy danh sách phòng xét nghiệm
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
 

// Chuyển đổi trạng thái phòng xét nghiệm
export async function TestConversionStatusEvaluation (id: string, currentStatus: boolean) {
  const res = await fetch(
    `${API_BASE_URL}/Phong_Thiet_Bi/StateChange/${id}?TrangThaiHoatDong=${currentStatus}`,
    {
      method: "PATCH",
    }
  );

  const data = await res.json();
  return data; 
}
 
  
 


// tìm kiếm phòng
export async function SearchRoom (key : string) {
  try {
    const result = await fetch(`${API_BASE_URL}/Phong_Kham/Search/${key}`);
    if (result.ok){
      const Data = await result.json();
      return Data;
    } else {
      const errorText = await result.text();
      console.error(`Lỗi fetch Bacsi/Pagination: ${result.status} - ${errorText}`);
      return 'Lỗi khi tìm phòng khám';
    }
  } catch (error) {
    console.error("Lỗi khi tìm kiếm phòng", error);
    throw error;
  }   
}


// Tìm kiếm phòng xét nghiệm
export async function SearchRoomName (key : string) {
  try {
    const result = await fetch(`${API_BASE_URL}/Phong_Thiet_Bi/Search/${key}`);
    if (result.ok){
      const Data = await result.json();
      return Data;
    } else {
      const errorText = await result.text();
      console.error(`Lỗi fetch Bacsi/Pagination: ${result.status} - ${errorText}`);
      return 'Lỗi khi tìm phòng khám';
    }
  } catch (error) {
    console.error("Lỗi khi tìm kiếm phòng", error);
    throw error;
  }   
}   

// services/Room.ts
export const getRommmDetail = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Phong_Kham/Detail/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết phòng khám:', error);
    throw error;
  }
};
