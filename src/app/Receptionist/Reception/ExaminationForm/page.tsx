// page.tsx
'use client' // Add this if you are using Next.js App Router and client-side features
import React, { useState } from 'react';
import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import './ExaminationForm.css'
import PreviewExaminationForm from './PreviewExaminationForm'; // Import the modal component

export default function ExaminationForm(){
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    // Sample patient data (replace with actual data from your form or state)
    // Dữ liệu này sẽ được đẩy vào các trường input và cũng được truyền vào PreviewExaminationForm
    const patientData = {
        fullName: "Lý Văn Điền",
        cccd: "080205013878",
        dob: "16/08/1998",
        phone: "0343527854",
        gender: "Nam",
        height: "191",
        weight: "90",
        clinic: "1",
        department: "Chấn thương chỉnh hình",
        address: "403, ấp Mỹ Điền, xã Long Hựu, huyện Cần Đước,tỉnh Long An",
        reason: "Nứt xương cánh tay"
    };

    const currentCollectorName = "Trần Bình FMVP";

    const handleOpenPreview = () => {
        setShowPreviewModal(true);
    };

    const handleClosePreview = () => {
        setShowPreviewModal(false);
    };

    return (
        <>
        <Tabbar
            tabbarItems={
                {
                    tabbarItems:[
                        {text: 'Phiếu Khám', link: '/Receptionist/Reception/ExaminationForm'},
                    ]
                }
            }
        >
        </Tabbar>
                <div className="ExaminationForm-Container">
                    <div className="ExaminationForm-Container__header">
                        <h2>Thông tin phiếu khám</h2>
                        <div className="ExaminationForm-Container__print">
                        <button
                            className="ExaminationForm-Container__print__btn"
                            onClick={handleOpenPreview} // Add onClick handler here
                        >
                            <span><i className="bi bi-printer-fill"></i></span> In phiếu khám
                        </button>
                        </div>
                    </div>

                    {/* Khung 1: Thông tin cơ bản (4 cột) */}
                    <div className="form-grid grid-4">
                        <div className="ExaminationForm-Container__form__group">
                            <label htmlFor="fullName">Họ và tên:</label>
                            <input type="text" id="fullName" defaultValue={patientData.fullName} readOnly/> {/* Đã đổi */}
                        </div>
                        <div className="ExaminationForm-Container__form__group">
                            <label htmlFor="cccd">Số CCCD:</label>
                            <input type="text" id="cccd" defaultValue={patientData.cccd} readOnly /> {/* Đã đổi */}
                        </div>
                        <div className="ExaminationForm-Container__form__group">
                            <label htmlFor="dob">Ngày sinh:</label>
                            <input type="text" id="dob" defaultValue={patientData.dob} readOnly /> {/* Đã đổi */}
                        </div>
                       <div className="ExaminationForm-Container__form__group">
                            <label htmlFor="phone">Số điện thoại:</label>
                            <input type="text" id="phone" defaultValue={patientData.phone} readOnly/> {/* Đã đổi */}
                        </div>
                    </div>

                    {/* Khung 2: Thông tin chi tiết (4 cột) */}
                    <div className="form-grid grid-3">
                           <div className="ExaminationForm-Container__form__group">
                                <label htmlFor="gender">Giới tính:</label>
                                <input type="text" id="gender" defaultValue={patientData.gender} readOnly className="gender-btn" /> {/* Đã đổi */}
                            </div>

                        {/* Chiều cao */}
                        <div className="ExaminationForm-Container__form__group">
                            <label htmlFor="height">Chiều cao:</label>
                            <div className="ExaminationForm-Container__input__unit">
                                <input type="text" id="height" defaultValue={patientData.height} readOnly/> {/* Đã đổi */}
                                <span>Cm</span>
                            </div>
                        </div>

                        {/* Cân nặng */}
                        <div className="ExaminationForm-Container__form__group">
                            <label htmlFor="weight">Cân nặng:</label>
                            <div className="ExaminationForm-Container__input__unit">
                                <input type="text" id="weight" defaultValue={patientData.weight} readOnly/> {/* Đã đổi */}
                                <span>Kg</span>
                            </div>
                        </div>

                        <div className="ExaminationForm-Container__form__group">
                            <label htmlFor="clinic">Phòng khám:</label>
                            <input type="text" id="clinic" defaultValue={patientData.clinic} readOnly/> {/* Đã đổi */}
                        </div>

                        <div className="ExaminationForm-Container__form__group">
                            <label htmlFor="department">Khoa:</label>
                            <input type="text" id="department" defaultValue={patientData.department} readOnly/> {/* Đã đổi */}
                        </div>
                    </div>

                    {/* Khung 3: Địa chỉ và Lý do đến khám (2 cột) */}
                    <div className="form-grid grid-2">
                        <div className="ExaminationForm-Container__form__group">
                            <label htmlFor="address">Địa chỉ:</label>
                            <textarea id="address" readOnly defaultValue={patientData.address} /> {/* Đã đổi */}
                        </div>
                        <div className="ExaminationForm-Container__form__group">
                            <label htmlFor="reason">Lí do đến khám:</label>
                            <textarea id="reason" readOnly defaultValue={patientData.reason} /> {/* Đã đổi */}
                        </div>
                    </div>

                    <div className="ExaminationForm-Container__accept">
                        <button className="ExaminationForm-Container__cancel__btn">Hủy phiếu khám</button>
                        <button className="ExaminationForm-Container__accept__btn">Xác nhận đã thanh toán</button>

                    </div>
                </div>

                {/* Render the PreviewExaminationForm as a modal */}
                <PreviewExaminationForm
                    isOpen={showPreviewModal}
                    onClose={handleClosePreview}
                    patientData={patientData} // patientData này chứa toàn bộ thông tin
                    collectorName={currentCollectorName}
                />
        </>

    )

}