'use client'
import Tabbar from '@/app/components/shared/Tabbar/Tabbar';
import './PatientInformation.css';
import Button from '@/app/components/ui/Button/Button';
import PatientInformation_component from './PatientInformationComponent';
import { useState, useEffect } from 'react';
import { medicalExaminationBook } from '@/app/types/patientTypes/patient';
import PatientInformationUpdateComponent from './PatientInformationUpdateComponent';



export default function PatientInformation() {
    const [display, setDisplay] = useState<boolean>(false);
    const [patientInfo, setPatientInfo] = useState<medicalExaminationBook | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const storedData = sessionStorage.getItem("soKhamBenh");
        if (storedData) {
            try {
                setPatientInfo(JSON.parse(storedData));
            } catch (err) {
                console.error("Lỗi khi parse dữ liệu:", err);
            }
        }
    }, []);

    return (
        <>
            <Tabbar
                tabbarItems={
                    {
                        tabbarItems: [
                            { text: "Thông tin bệnh nhân", link: "/Receptionist/Reception/PatientInformation" }
                        ]
                    }
                }
            />



            {display && <PatientInformation_component callBack={() => { setDisplay(false) }} />}

            <div className='PatientInformation-Box'>
                <div className='PatientInformation-Box__Box1'>
                    <div className='PatientInformation-Box__Box1__title'>
                        Thông tin bệnh nhân
                        <i
                            className="bi bi-pencil-square"
                            onClick={() => setIsEditing(true)}
                            style={{ cursor: 'pointer', marginLeft: '8px' }}
                        ></i>
                    </div>
                    {isEditing && (
                        <PatientInformationUpdateComponent
                            callBack={() => {
                                const updated = sessionStorage.getItem("soKhamBenh");
                                if (updated) {
                                    setPatientInfo(JSON.parse(updated));
                                }
                                setIsEditing(false);
                            }}
                        />
                    )}

                    <div className='PatientInformation-Box__Box1__content'>
                        <div className='PatientInformation-Box__Box1__content__Name'>
                            <span className='PatientInformation-Box__Box1__content__Bold'>Họ và tên: </span>
                            {patientInfo?.HoVaTen}
                        </div>
                    </div>

                    <div className='PatientInformation-Box__Box1__content'>
                        <div className='PatientInformation_Box1__content__Name'>
                            <span className='PatientInformation-Box__Box1__content__Bold'>Giới tính: </span>
                            {patientInfo?.GioiTinh || "Không có"}
                        </div>

                    </div>

                    <div className='PatientInformation-Box__Box1__content'>
                        <div className='PatientInformation_Box1__content__Name'
                            style={!patientInfo?.SoDienThoai ? { color: "red" } : {}}
                        >
                            <span className='PatientInformation-Box__Box1__content__Bold'>Số điện thoại: </span>
                            {patientInfo?.SoDienThoai || "Không có"}
                        </div>
                    </div>

                    <div className='PatientInformation-Box__Box1__content'>
                        <div className='PatientInformation_Box1__content__Name'
                            style={!patientInfo?.SoBaoHiemYTe ? { color: "red" } : {}}
                        >
                            <span className='PatientInformation-Box__Box1__content__Bold'>Số BHYT: </span>
                            {patientInfo?.SoBaoHiemYTe || "Không có"}
                        </div>
                    </div>

                    <div className='PatientInformation-Box__Box1__content'>
                        <div className='PatientInformation_Box1__content__Name'
                            style={!patientInfo?.DiaChi ? { color: "red" } : {}}
                        >
                            <span className='PatientInformation-Box__Box1__content__Bold'>Địa chỉ: </span><br />
                            {patientInfo?.DiaChi || "Không có"}
                        </div>
                    </div>

                    <div className='PatientInformation-Box__Box1__content'>
                        <div className='PatientInformation_Box1__content__Name'
                            style={!patientInfo?.LichSuBenh ? { color: "red" } : {}}
                        >
                            <span className='PatientInformation-Box__Box1__content__Bold'>Lịch sử bệnh: </span><br />
                            {patientInfo?.LichSuBenh || "Không có"}
                        </div>
                    </div>
                </div>

                <div className='PatientInformation-Box__Box2'>
                    <div className='PatientInformation-Box__Box2__content'>
                        <div className='PatientInformation-Box__Box2__content__Name'
                            style={!patientInfo?.SoCCCD ? { color: "red" } : {}}
                        >
                            <span className='PatientInformation-Box__Box2__content__Name--Bold'>Số CCCD: </span>
                            {patientInfo?.SoCCCD || "Không có"}
                        </div>
                    </div>

                    <div className='PatientInformation-Box__Box2__content'>
                        <div className='PatientInformation-Box__Box2__content__Name'
                            style={!patientInfo?.NgaySinh ? { color: "red" } : {}}
                        >
                            <span className='PatientInformation-Box__Box2__content__Name--Bold'>Ngày sinh: </span>
                            {patientInfo?.NgaySinh || "Không có"}
                        </div>
                    </div>

                    <div className='PatientInformation-Box__Box2__content'>
                        <div className='PatientInformation-Box__Box2__content__Name'
                            style={!patientInfo?.SDT_NguoiThan ? { color: "red" } : {}}
                        >
                            <span className='PatientInformation-Box__Box2__content__Name--Bold'>Số điện thoại người thân:  </span>
                            {patientInfo?.SDT_NguoiThan || "Không có"}
                        </div>
                    </div>
                </div>
            </div>



            {/*  */}
            <div className='PatientInformation-button'>
                <Button buttonContent={
                    {
                        text: "Quay lại",
                        backgroundColor: "#858585",
                        textColor: "#FFFFFF",
                        link: "/Receptionist/Reception"
                    }
                }
                >
                </Button>

                <button onClick={() => { setDisplay(true) }} className='PatientInformation-button__buttonItem'>Tiếp nhận</button>
            </div>




        </>
    )
}
