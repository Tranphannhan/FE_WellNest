'use client';
import { useEffect, useState } from 'react';
import './GenerateTestResults.css';
import Tabbar from '@/app/components/shared/Tabbar/Tabbar';
import { showToast, ToastType } from '@/app/lib/Toast';
import ModalComponent from '@/app/components/shared/Modal/Modal';
import { generateTestResults, handleCompleteTheTests } from '@/app/services/LaboratoryDoctor';
import { useRouter } from 'next/navigation';
import ViewParaclinicalResults, { NormalTestResult } from '@/app/Doctor/Patient/ToExamine/[id]/CreateResults/CreateResultsComponent/ViewParaclinicalResults';
import { getResultsByRequestTesting } from '@/app/services/DoctorSevices';


export interface valueForm {
  Id_YeuCauXetNghiem?: string;
  Id_PhieuKhamBenh?: string;
  Id_NguoiXetNghiem?: string;
  MaXetNghiem?: string;
  TenXetNghiem?: string;
  KetQua?: string;
  ChiSoBinhThuong?: string;
  DonViTinh?: string;
  GhiChu?: string;
  Image?: File;
}

export default function GenerateTestResults() {
  const router = useRouter();
  const [dataForm, setDataForm] = useState<valueForm>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [showResultsPopup, setShowResultsPopup] = useState<boolean>(false);
  const [dataResule, setDataResule] = useState<NormalTestResult[]>([]);


    // Loadd tênn xét nghiệm
    const [tenXetNghiem , setTenXetNghiem] = useState<string>('');

    useEffect(() => {
    const loaddingtenXetNghiem = async () => {
        const localData = sessionStorage.getItem('idGenerateTestResult');
        if (!localData) return showToast('Thiếu dữ liệu id Form', ToastType.error);
        
        try {
            const parsed = JSON.parse(localData);
            setTenXetNghiem(parsed.TenXetNghiem || '');
        } 
        
        catch (error) {
            console.error('Lỗi parse JSON:', error);
            showToast('Lỗi dữ liệu trong sessionStorage', ToastType.error);
        }
    };

    loaddingtenXetNghiem();
    }, []);




  // Xử lý tạo kết quả xét nghiệm
  const handleResultTest = async () => {
    setShowModal(false);
    const {
      MaXetNghiem,
      ChiSoBinhThuong,
      DonViTinh,
      KetQua,
      GhiChu
    } = dataForm || {};

    if (
      !MaXetNghiem?.trim() ||
      !ChiSoBinhThuong?.trim() ||
      !DonViTinh?.trim() ||
      !KetQua?.trim() ||
      !GhiChu?.trim()
    ) {
      return showToast('Thiếu dữ liệu Form', ToastType.error);
    }



    const localData = sessionStorage.getItem('idGenerateTestResult');
    if (!localData) return showToast('Thiếu dữ liệu id Form', ToastType.error);
    const parsed = JSON.parse(localData);

    const fullForm: valueForm = {
      ...dataForm,
      Id_YeuCauXetNghiem: parsed.Id_YeuCauXetNghiem,
      Id_PhieuKhamBenh: parsed.Id_PhieuKhamBenh,
      Id_NguoiXetNghiem: parsed.Id_NguoiXetNghiem,
      TenXetNghiem: parsed.TenXetNghiem
    };

    await generateTestResults(fullForm);
    showToast('Tạo kết quả thành công', ToastType.success);
  };



  // Xử lý hoàn tất xét nghiệm
  const completeTheTest = async () => {
    const localData = sessionStorage.getItem('idGenerateTestResult');
    if (!localData) return showToast('Thiếu dữ liệu id Form', ToastType.error);
    const parsed = JSON.parse(localData);

    const result = await handleCompleteTheTests(parsed.Id_YeuCauXetNghiem);
    console.log('result',result)
    if (result) {
        router.push(`/LaboratoryDoctor/TestWaitingList/${parsed.Id_PhieuKhamBenh}`);
    }
  };




  // Xem kết quả xét nghiệm
  const handleView = async () => {
    const localData = sessionStorage.getItem('idGenerateTestResult');
    if (!localData) return showToast('Thiếu dữ liệu id Form', ToastType.error);
    const parsed = JSON.parse(localData);

    const data = await getResultsByRequestTesting(parsed.Id_YeuCauXetNghiem);
    if (!data || data.length === 0) return showToast('Không tìm thấy kết quả xét nghiệm', ToastType.warn);

    setDataResule(data);
    setShowResultsPopup(true);
  };




  return (
    <>
      <Tabbar
        tabbarItems={{
          tabbarItems: [
            { text: 'Tạo kết quả xét nghiệm', link: '/LaboratoryDoctor/GenerateTestResults' },
          ],
        }}
      />

      {/* Popup kết quả */}
      {showResultsPopup && (
        <ViewParaclinicalResults
          dataFromOutside={dataResule}
          onClose={() => setShowResultsPopup(false)}
        />
      )}

      {/* Modal tạo kết quả */}
      <ModalComponent
        Data_information={{
          content: 'Kết thúc quá trình tạo kết quả',
          remid: 'Vui lòng tạo đầy đủ trước khi xác nhận',
          handleClose: () => setShowModal(false),
          show: showModal,
          handleShow: () => {},
          callBack: handleResultTest
        }}
      />

      {/* Modal hoàn thành */}
      <ModalComponent
        Data_information={{
          content: 'Kết thúc quá trình xác nhận',
          remid: 'Vui lòng xác nhận lại',
          handleClose: () => setShowResult(false),
          show: showResult,
          handleShow: () => {},
          callBack: completeTheTest
        }}
      />

      {/* Form nhập liệu */}
      <div className="generate-test-results-container">
        <h3 className="generate-test-results-container-title">Tạo kết quả xét nghiệm</h3>

        <div className="generate-test-results-container__boxClick1">
          <button className="bigButton--blue" onClick={handleView}>Xem kết quả</button>
          <button className="bigButton--blue" onClick={() => setShowResult(true)}>Hoàn thành xét nghiệm</button>
        </div>

        <div className="form-container">
          <div className="form-container-uploadSection">
            <label className="upload-box">
              <i className="bi bi-cloud-upload"></i>
              <p>Chọn ảnh</p>
              <input
                type="file"
                onChange={(e) =>
                  setDataForm((prev) => ({
                    ...prev,
                    Image: e.target.files?.[0] || undefined,
                  }))
                }
              />
            </label>
            <p className="upload-warning" style={{ width: '210px' }}>
              {dataForm?.Image ? dataForm.Image.name : 'Vui lòng chọn ảnh'}
            </p>
          </div>

          <div className="input-section">
            <div className="input-group">
              <div className="input-box">
                <label>Tên xét nghiệm</label>
                <input
                  type="text"
                  value={tenXetNghiem}
                  readOnly 
                  
                  onChange={(e) =>
                    setDataForm((prev) => ({
                      ...prev,
                      TenXetNghiem: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="input-box">
                <label>Mã xét nghiệm</label>
                <input
                  type="text"
                  onChange={(e) =>
                    setDataForm((prev) => ({
                      ...prev,
                      MaXetNghiem: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="input-group">
              <div className="input-box">
                <label>Chỉ số bình thường</label>
                <input
                  type="text"
                  onChange={(e) =>
                    setDataForm((prev) => ({
                      ...prev,
                      ChiSoBinhThuong: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="input-box">
                <label>Đơn vị tính</label>
                <input
                  type="text"
                  onChange={(e) =>
                    setDataForm((prev) => ({
                      ...prev,
                      DonViTinh: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="input-box full-width">
              <label>Kết quả</label>
              <textarea
                rows={3}
                onChange={(e) =>
                  setDataForm((prev) => ({
                    ...prev,
                    KetQua: e.target.value,
                  }))
                }
              ></textarea>
            </div>

            <div className="input-box full-width">
              <label>Ghi chú</label>
              <textarea
                rows={3}
                onChange={(e) =>
                  setDataForm((prev) => ({
                    ...prev,
                    GhiChu: e.target.value,
                  }))
                }
              ></textarea>
            </div>

            <div className="button-group">
              <button className="cancel-button" onClick={() => router.back()}>Quay lại</button>
              <button className="confirm-button" onClick={() => setShowModal(true)}>Tạo kết quả xét nghiệm</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
