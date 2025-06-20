

import {  clinicalType, diagnosisType, generateTestResultsType, laboratoryType, MedicalExaminationCard, survivalIndexType } from "../types/patientTypes/patient";
import { showToast, ToastType } from "../lib/Toast";
import { DoctorTemporaryTypes } from "../types/doctorTypes/doctorTestTypes";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getAllPatient (Id_Bacsi : string , TrangThai : boolean , TrangThaiHoatDong : string) {
        try {
          if (TrangThaiHoatDong == '' || TrangThaiHoatDong === null){
            const result = await fetch(`${API_BASE_URL}/Phieu_Kham_Benh/GetById_CaKham_Date/Pagination?Id_Bacsi=${Id_Bacsi}&TrangThai=${TrangThai}`);
              if (result.ok){
                  const Data = await result.json ();
                  return Data.data;
              } else {
                  return ('Lỗi Khi Lấy Bác Sĩ')
              }

          } else {
              const result = await fetch(`${API_BASE_URL}/Phieu_Kham_Benh/GetById_CaKham_Date/Pagination?Id_Bacsi=${Id_Bacsi}&TrangThai=${TrangThai}&TrangThaiHoatDong=${TrangThaiHoatDong}`);
              if (result.ok){
                  const Data = await result.json ();
                  return Data.data;
              } else {
                  return ('Lỗi Khi Lấy Bác Sĩ')
              }
          }


    } catch (error) {
        console.error("Lỗi Khi Lấy Bác Sĩ:", error);
        throw error; 
    }
}  
 

export async function getDetailMedicalExaminationCard(id: string): Promise<MedicalExaminationCard | null> {
  try {
    const response = await fetch(`http://localhost:5000/Phieu_Kham_Benh/Detail/${id}`);
    if (!response.ok) return null;
    const data =await response.json();
    return data[0]
  } catch (error) {
    console.error("Fetch lỗi:", error);
    return null;
  }
}

// Lấy chỉ số sinh tồn theo Id_PhieuKhamBenh 
export async function getVitalSignsByExaminationId(id: string): Promise<survivalIndexType | null> {
  try {
    const response = await fetch(`http://localhost:5000/Chi_So_Sinh_Ton/LayTheoPhieuKhamBenh?Id_PhieuKhamBenh=${id}`);
    if (!response.ok) return null;
    const data =await response.json();
    return data[0]
  } catch (error) {
    console.error("Fetch lỗi:", error);
    return null;
  }
}



// Cập nhât chỉ số sinh tồn
export async function updateSurvivalIndex (id : string , data : survivalIndexType) {
  try {
    const response = await fetch(`http://localhost:5000/Chi_So_Sinh_Ton/Update/${id}`,{
      method : 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify (data)
    });

    if (!response.ok) return  showToast('Lưu chỉ số sinh tồn thất bại' , ToastType.error);
    return response.json();

  } catch (error) {
    console.error("Fetch lỗi:", error);
    return null;
  }

}

export async function addDiagnosis (idMedicalExaminationCard : string , dataAdd : diagnosisType) {
  try {
    const response = await fetch(`http://localhost:5000/Kham_Lam_Sang/Add`,{
      method : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify ({Id_PhieuKhamBenh:idMedicalExaminationCard})
    });

    if (!response.ok) return  showToast('Tạo kết quả khám lâm sàng thất bại' , ToastType.error);
    const data = await response.json()
    const id = data.data._id;

     const response2 = await fetch(`http://localhost:5000/Chi_Tiet_Kham_Lam_Sang/Add`,{
      method : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify ({...dataAdd,Id_KhamLamSang:id})
    });
     if (!response2.ok) return  showToast('Tạo kết quả chuẩn đoán thất bại' , ToastType.error);
     const data2 = await response2.json()
     return data2
  } catch (error) {
    console.error("Fetch lỗi:", error);
    return null;
  }

}

export async function getAllPagination(): Promise<laboratoryType[] | string> {
    try {
        const result = await fetch(`${API_BASE_URL}/Phong_Thiet_Bi/Pagination`);
        if (result.ok) {
            const Data = await result.json();
            return Data.data;
        } else {
            const errorText = await result.text();
            console.error(`Error fetching equipment rooms: ${result.status} - ${errorText}`);
            return 'Lỗi Khi Lấy Phòng Thiết Bị';
        }
    } catch (error) {
        console.error("Lỗi Khi Lấy Phòng Thiết Bị:", error);
        throw error;
    }
}

export async function getIdByTest(Id_PhongThietBi: string): Promise<clinicalType[] | string> {
    try {
        const result = await fetch(`${API_BASE_URL}/Loaixetnghiem/LayTheoIdPhongThietBi/${Id_PhongThietBi}`);

        if (result.ok) {
            const Data = await result.json();
            return Data.data || Data;
        } else {
            const errorText = await result.text();
            console.error(`Error fetching LoaiXetNghiem by Id_PhongThietBi: ${result.status} - ${errorText}`);
            return 'Lỗi Khi Lấy Loại Xét Nghiệm Theo ID Phòng Thiết Bị';
        }
    } catch (error) {
        console.error("Lỗi Khi Lấy Loại Xét Nghiệm Theo ID Phòng Thiết Bị:", error);
        throw error;
    }
}



export async function getDoctorTemporaryTypes (id: string): Promise<DoctorTemporaryTypes | null> {
  try {
    const response = await fetch(`http://localhost:5000/Yeu_Cau_Xet_Nghiem/LayTheoPhieuKhamBenh/${id}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data

  } catch (error) {
    console.error("Fetch lỗi:", error);
    return null;
  }
}



export async function deleteDoctorTemporaryTypes (id: string){
  try {
    const response = await fetch(`http://localhost:5000/Yeu_Cau_Xet_Nghiem/Delete/${id}`,{
      method : 'DELETE',
    });

    if (!response.ok) return  showToast('Xóa chỉ định cận lâm sàng thất bại' , ToastType.error);
    return showToast('Xóa chỉ định cận lâm sàng thành công' , ToastType.success);
  }
  
  catch (error) {
    console.error("Fetch lỗi:", error);
    return null;
  }
}




export async function createTestRequest (Id_PhieuKhamBenh : string , Id_LoaiXetNghiem : string){
  try {
    const response = await fetch(`http://localhost:5000/Yeu_Cau_Xet_Nghiem/Add`,{
      method : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify ({
        Id_PhieuKhamBenh : Id_PhieuKhamBenh,
        Id_LoaiXetNghiem : Id_LoaiXetNghiem
      })
    });

    if (!response.ok) return  showToast('Tạo yêu cầu xét nghiệm thất bại' , ToastType.error);
    return  showToast('Tạo chỉ định xét nghiệm thành công' , ToastType.success);  

  } catch (error) {
    console.error("Fetch lỗi:", error);
    return null;
  }

}

export async function deleteMedicine (id: string){
  try {
    const response = await fetch(`http://localhost:5000/Donthuoc_Chitiet/Delete/${id}`,{
      method : 'DELETE',
    });
    
    if (!response.ok) return  showToast('Xóa đơn thuốc thất bại' , ToastType.error);
    return showToast('Xóa đơn thuốc thành công' , ToastType.success);
  }
  
  catch (error) {
    console.error("Fetch lỗi:", error);
    return null;
  }
}

// tạo đơn thuốc
export async function createPrescription(
  Id_PhieuKhamBenh: string,
  TenDonThuoc: string
) {
  try {
    const response = await fetch("http://localhost:5000/Donthuoc/Add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Id_PhieuKhamBenh,
        TenDonThuoc,
      }),
    });

    console.log(response)
    
    const data = await response.json();

    if (!response.ok) {
      showToast(data.message || "Tạo đơn thuốc thất bại", ToastType.error);
      return null;
    }

    showToast(data.message || "Tạo đơn thuốc thành công", ToastType.success);
    return data; // thường sẽ trả về `{ message, data: result }`
  } catch (error) {
    console.error("Lỗi khi tạo đơn thuốc:", error);
    showToast("Lỗi kết nối đến máy chủ", ToastType.error);
    return null;
  }
}

// tạo đơn thuốc chi tiết
export async function createPrescriptionDetail(
  Id_DonThuoc: string,
  Id_Thuoc: string,
  SoLuong: number,
  NhacNho: string
) {
  try {
    const response = await fetch('http://localhost:5000/Donthuoc_Chitiet/Add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Id_DonThuoc:Id_DonThuoc,
        Id_Thuoc:Id_Thuoc,
        SoLuong: SoLuong,
        NhacNho: NhacNho,
      }),
    });
    console.log(response)
    const data = await response.json();

    if (!response.ok) {
      showToast(data.message || 'Thêm chi tiết đơn thuốc thất bại', ToastType.error);
      return null;
    }

    showToast(data.message || 'Thêm chi tiết đơn thuốc thành công', ToastType.success);
    return data;
  } catch (error) {
    console.error('Lỗi khi tạo chi tiết đơn thuốc:', error);
    showToast('Lỗi kết nối đến máy chủ', ToastType.error);
    return null;
  }
}

export async function fetchMedicalExaminationCardDetail(id: string){
  try {
    const response = await fetch(`http://localhost:5000/Phieu_Kham_Benh/Detail/${id}`);

    if (!response.ok) {
      console.error("Không lấy được chi tiết phiếu khám bệnh");
      return null;
    }

    const data = await response.json();
    return data[0] || data; 
  } catch (error) {
    console.error("Lỗi khi fetch chi tiết phiếu khám bệnh:", error);
    return null;
  }
}

export async function CheckPrescription(Id_PhieuKhamBenh: string) {
  try {
    const response = await fetch(`http://localhost:5000/Donthuoc/KiemTraDonThuocDangTao?Id_PhieuKhamBenh=${Id_PhieuKhamBenh}`);

    if (!response.ok) {
      console.error("Lỗi khi kiểm tra đơn thuốc");
      return { status: false, data: null };
    }

    const data = await response.json();
    const result = data[0] || data;

    if (result?.waitForConfirmation === true) {
      return { status: false, data: result.data[0] };
    } else {
      return { status: true, data: result };
    }

  } catch (error) {
    console.error("Lỗi khi kiểm tra đơn thuốc:", error);
    throw Error('Lỗi khi kiểm tra đơn thuốc')
  }
}




export async function createExaminationResults(dataAdd: generateTestResultsType) {
  try {
    const response = await fetch('http://localhost:5000/Kham_Lam_Sang/Add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Id_PhieuKhamBenh: dataAdd.Id_PhieuKhamBenh,
        GhiChu: dataAdd.GhiChu,
        HuongSuLy: dataAdd.HuongSuLy, 
        KetQua: dataAdd.KetQua,
      }),
    });

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      showToast(data.message || 'Tạo kết quả khám thất bại', ToastType.error);
      return null;
    }

    // Update 2

    if (data.Created) {
      const updateResponse = await fetch(`http://localhost:5000/Kham_Lam_Sang/Edit/${data.data._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Id_PhieuKhamBenh: dataAdd.Id_PhieuKhamBenh,
          GhiChu: dataAdd.GhiChu,
          HuongSuLy: dataAdd.HuongSuLy,
          KetQua: dataAdd.KetQua,
        }),
      });

      const updateData = await updateResponse.json();
      console.log(updateData);

      if (!updateResponse.ok) {
        showToast('Cập nhật kết quả khám thất bại', ToastType.error);
        return null;
      } else {
        showToast('Cập nhật kết quả khám thành công', ToastType.success);
        return updateData;
      }
    } else {
      // Nếu tạo mới thành công
      showToast(data.message || 'Thêm kết quả khám thành công', ToastType.success);
      return data;
    }
  } 
  
  catch (error) {
    console.error('Lỗi khi tạo kết quả khám:', error);
    showToast('Lỗi kết nối đến máy chủ', ToastType.error);
    return null;
  }
}




export async function getExaminationResults (id: string): Promise<generateTestResultsType | null> {
  try {
    const response = await fetch(`http://localhost:5000/Kham_Lam_Sang/LayTheoPhieuKhamBenh/${id}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data[0]

  } catch (error) {
    console.error("Fetch lỗi:", error);
    return null;
  }
}


// Xác nhận đã hoàn thành đơn thuốc
export async function confirmPrescriptionCompletion (id: string){
  try {
    const response = await fetch(`http://localhost:5000/Donthuoc/ThayDoiTrangThai/${id}?TrangThai=DaXacNhan`,{
      method:'PATCH',
    });
    if (!response.ok){
      showToast('Hoàn thành đơn thuốc thất bại', ToastType.error);
       return null
    };
    showToast('Hoàn thành đơn thuốc thành công', ToastType.success);
    const data = await response.json();
    return data.updatedDonthuoc

  } catch (error) {
    console.error("Fetch lỗi:", error);
    return null;
  }
}


//Lấy lịch sử khám bệnh 
export async function medicalExamiNationHistory(id: string){
    try {
        const result = await fetch(`http://localhost:5000/Kham_Lam_Sang/LayTheoTheKhamBenh/Pagination/${id}`);
        if (result.ok) {
            const Data = await result.json();
            return Data.data;
        } else {
            const errorText = await result.text();
            console.error(`Error fetching equipment rooms: ${result.status} - ${errorText}`);
            showToast('Lỗi khi lấy lịch sử khám bệnh', ToastType.error)
        }
    } catch (error) {
        console.error("Lỗi Khi Lấy lịch sử:", error);
        throw error;
    }
}

// xác nhận yêu cầu xét nghiệm
// Xác nhận đã hoàn thành đơn thuốc
export async function testConfirmation (id: string){
  try {
    const response = await fetch(`http://localhost:5000/Yeu_Cau_Xet_Nghiem/ThayDoiTrangThaiHoatDong/${id}`,{
      method:'PATCH',
    });
    if (!response.ok){
      showToast('Xác nhận thất bại', ToastType.error);
       return false
    };
    showToast('Xác nhận thành công', ToastType.success);
    return true

  } catch (error) {
    console.error("Fetch lỗi:", error);
    return false;
  }
}

// Sử lí khi bệnh nhân vắng mặt
export async function handlingAbsences (id: string){
  try {
    const response = await fetch(`http://localhost:5000/Phieu_Kham_Benh/KhongCoMat/${id}`,{
      method:'PATCH',
    });
    if (!response.ok){
      showToast('Xác nhận vắng mặt thất bại', ToastType.error);
       return false
    };
    showToast('Xác nhận vắng mặt thành công', ToastType.success);
    return true

  } catch (error) {
    console.error("Fetch lỗi:", error);
    return false;
  }
}

// Lấy chuẩn đoán mới nhất
//Lấy lịch sử khám bệnh 
export async function latestDiagnosis(id: string){
    try {
        const result = await fetch(`http://localhost:5000/Chi_Tiet_Kham_Lam_Sang/KiemTraCoChiTietKhamLamSang?Id_PhieuKhamBenh=${id}`);
        if (result.ok) {
            const Data = await result.json();
            return {continueRender:true,data:Data[0]};
        } else {
            return {continueRender:false, data:null};
        }
    } catch (error) {
        console.error("Lỗi Khi Lấy lịch sử:", error);
        throw error;
    }
}

//Xác nhận hoàn thành khám
export async function confirmCompletion (id: string){
  try {
    const response = await fetch(`http://localhost:5000/Phieu_Kham_Benh/XacNhanTrangThai/${id}`,{
      method:'PATCH',
    });
    if (!response.ok){
      showToast('Xác nhận hoàn thành khám thất bại', ToastType.error);
       return false
    };
    showToast('Xác nhận hoàn thành khám thành công', ToastType.success);
    return true

  } catch (error) {
    console.error("Fetch lỗi:", error);
    return false;
  }
}

// Chuyển phiếu khám bệnh sang trạng thái chớ xét nghiệm
export async function waitingForTesting (id: string){
  try {
    const response = await fetch(`http://localhost:5000/Phieu_Kham_Benh/ThayDoiTrangThaiHoatDong/${id}?TrangThaiHoatDong=XetNghiem`,{
      method:'PATCH',
    });
    if (!response.ok){
      showToast('Xác nhận chỉ định xét nghiệm thất bại', ToastType.error);
       return false
    };
    showToast('Thành công đã chuyển bệnh nhân qua danh sách chờ', ToastType.success);
    return true

  } catch (error) {
    console.error("Fetch lỗi:", error);
    return false;
  }
}