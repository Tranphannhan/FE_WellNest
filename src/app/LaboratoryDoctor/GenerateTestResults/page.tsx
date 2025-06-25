
'use client';
import { useState } from 'react';
import './GenerateTestResults.css';
import Tabbar from '@/app/components/shared/Tabbar/Tabbar';
import { showToast, ToastType } from '@/app/lib/Toast';
import ModalComponent from '@/app/components/shared/Modal/Modal';
import { generateTestResults } from '@/app/services/LaboratoryDoctor';


interface valueForm {
    Id_YeuCauXetNghiem ? : string,
    Id_PhieuKhamBenh ? : string,
    Id_NguoiXetNghiem ? : string,
    MaXetNghiem ? : string,
    TenXetNghiem ? : string,
    KetQua ? : string,
    ChiSoBinhThuong ? : string,
    DonViTinh ? : string,
    GhiChu ? : string,
    Image ? : File,
}


export default function GenerateTestResults() {
    const [dataForm , setdataForm] = useState <valueForm> ();
    const [showModal , setShowModal] = useState <boolean> (false);

    const HandleResultTest = async () => {
        const {
            TenXetNghiem,
            MaXetNghiem,
            ChiSoBinhThuong,
            DonViTinh,
            KetQua,
            GhiChu
        } = dataForm || {}; 

        if (
            !TenXetNghiem?.trim() &&
            !MaXetNghiem?.trim() &&
            !ChiSoBinhThuong?.trim() &&
            !DonViTinh?.trim() &&
            !KetQua?.trim() &&
            !GhiChu?.trim()
        )
            return showToast('Thiếu dữ liệu Form', ToastType.error);

        const getLocostorage = localStorage.getItem('idGenerateTestResult');
        if (!getLocostorage) return showToast('Thiếu dữ liệu id Form', ToastType.error);
        const handleJSON = JSON.parse(getLocostorage);

        
        const fullForm: valueForm = {
            ...dataForm,
            Id_YeuCauXetNghiem: handleJSON.Id_YeuCauXetNghiem,
            Id_PhieuKhamBenh: handleJSON.Id_PhieuKhamBenh,
            Id_NguoiXetNghiem: handleJSON.Id_NguoiXetNghiem,
        };

        
        generateTestResults (fullForm)
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


            <ModalComponent
                Data_information={
                    {
                        content : 'Kết thúc quá trình tạo kết quả',
                        remid : 'Vui lòng tạo đầy đủ trước khi xác nhận',
                        handleClose : () => {setShowModal (false)},
                        show : showModal  ,
                        handleShow : () => {},
                        callBack : HandleResultTest 
                    }
                }
            />


            <div className="generate-test-results-container">
                <h3 className="title">Tạo kết quả xét nghiệm</h3>


                <div className="form-container">
                    <div className="upload-section">
                        <div className="upload-box">
                            <i className="bi bi-cloud-upload"></i>
                            <p>Chọn ảnh</p>
                        </div>
                        <p className="upload-warning">Vui lòng chọn ảnh</p>


                        <input
                            type="file"
                            onChange={(e) =>
                                setdataForm((prev) => ({
                                    ...prev,
                                    Image: e.target.files?.[0] || undefined,
                                }))
                            }
                        />

                    </div>


                    <div className="input-section">
                        <div className="input-group">
                            <div className="input-box">
                                <label>Tên xét nghiệm</label>
                                <input
                                    type="text"
                                    onChange={(e) =>
                                        setdataForm((prev) => ({
                                        ...prev,
                                        ['TenXetNghiem']: e.target.value,
                                        }))
                                    }
                                />

                            </div>

                            <div className="input-box">
                                <label>Mã xét nghiệm</label>
                                <input
                                    type="text"
                                    onChange={(e) =>
                                        setdataForm((prev) => ({
                                        ...prev,
                                        ['MaXetNghiem']: e.target.value,
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
                                        setdataForm((prev) => ({
                                        ...prev,
                                        ['ChiSoBinhThuong']: e.target.value,
                                        }))
                                    }
                                />
                            </div>



                            <div className="input-box">
                                <label>Đơn vị tính</label>
                                <input
                                    type="text"
                                    onChange={(e) =>
                                        setdataForm((prev) => ({
                                        ...prev,
                                        ['DonViTinh']: e.target.value,
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
                                    setdataForm((prev) => ({
                                    ...prev,
                                    ['KetQua']: e.target.value,
                                    }))
                                }
                                
                                >
                            </textarea>
                        </div>

                        <div className="input-box full-width">
                            <label>Ghi chú</label>
                            <textarea rows={3}
                                onChange={(e) =>
                                    setdataForm((prev) => ({
                                    ...prev,
                                    ['GhiChu']: e.target.value,
                                    }))
                                }
                                >
                            </textarea>
                        </div>

                        <div className="button-group">
                            <button className="cancel-button">Quay lại</button>
                            <button className="confirm-button" 
                                onClick={() => {setShowModal (true)} }
                                >Tạo kết quả xét nghiệm
                            </button>
                        </div>
                    </div>



                </div>
            </div>
        </>
    );
}


