
"use client"
import React, { useState , useEffect }  from "react";
import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import './ChooseRoom.css'
import Link from "next/link";
import Example from './notificationChooseRoom';
import { getAllChooseRooms } from "@/app/services/ReceptionServices";
import { showToast, ToastType } from '@/app/lib/Toast';
import { receptionTemporaryDoctorTypes } from "@/app/types/receptionTypes/receptionTemporaryTypes";
 

 
export default function ChooseRoom() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [valueChooseRom , setValueChooseRom] = useState ({
        name : '',
        roomNumber : 0,
    })
    
    const handleSetValue = (name : string , roomNumber : number) => {
        setValueChooseRom ({
            name : name,
            roomNumber : roomNumber
        })
        setShow(true)
    }

    // --  
    
    // Interface 
    

    
    const [dataChooseRoom , setDataChooseRoom] = useState <receptionTemporaryDoctorTypes []> ([]);
    useEffect (() => {
        const HandleLoaddata = async () => {
            const Data = await getAllChooseRooms ('683560a435719061a17e90ae');
            if (Data){
                setDataChooseRoom (Data.data)
            }
        }

        HandleLoaddata ()
    }, []);



    console.log(dataChooseRoom);
    


    // interface typeDoctor {
    //     SoLuongBenhNhan : number,
    //     TenBacSi : string,
    // }


    return (
        <>
            <Example 
                Data_information={
                    {
                        name: valueChooseRom.name,
                        roomNumber: valueChooseRom.roomNumber,
                        handleClose,
                        handleShow,
                        show
                    }
                }
            />


            <Tabbar
                tabbarItems={
                    {
                        tabbarItems: [
                            { text: 'Chọn phòng', link: '/Receptionist/Reception/ChooseRoom' },

                        ]
                    }

                }
            ></Tabbar>

            <div className="chooseRoom-container">
                <h1 className="chooseRoom-container__title">
                    Danh sách phòng khoa:
                    <span className="chooseRoom-container__title2"> Chấn thương chỉnh hình</span>
                    <Link href="#">
                        <button className="chooseRoom-container__button">Quay lại</button>
                    </Link>
                </h1>

                <table className="chooseRoom-container__table">
                    <thead>
                        <tr>
                            <th>Tên bác sĩ</th>
                            <th>Số phòng</th>
                            <th>Số lượng bệnh nhân</th>
                            <th>Thời gian dự tính</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        

                        {
                            dataChooseRoom?.map((doctor : receptionTemporaryDoctorTypes, index : number) => {
                                 const totalMinutes = doctor.SoNguoiDangKham * 15;

                                const formatTime = (minutes: number) => {
                                    if (minutes < 60) return `${minutes} phút`;
                                    const hours = Math.floor(minutes / 60);
                                    const mins = minutes % 60;
                                    return mins === 0 ? `${hours} tiếng` : `${hours} tiếng ${mins} phút`;
                                };
 
                                return (
                                    <tr key={index}>
                                        <td>{doctor.TenBacSi}</td>
                                        <td>{doctor.Id_PhongKham.SoPhongKham}</td>
                                        <td style={{
                                            color:
                                                doctor.SoNguoiDangKham < 4 ? "green" :
                                                    doctor.SoNguoiDangKham < 8 ? "orange" :
                                                    "red"
                                        }}>
                                            {doctor.SoNguoiDangKham + "/10"} bệnh nhân
                                        </td>
                                        <td>{formatTime(totalMinutes)}</td>
                                        <td>
                                            <button 
                                                className="chooseRoom-container__btn-choose" 
                                                onClick={() => 
                                                    doctor.SoNguoiDangKham === 10 ? showToast('Phòng đã đầy',ToastType.error)
                                                    : handleSetValue (doctor.TenBacSi , index) 
                                                }

                                                style={{
                                                    background: doctor.SoNguoiDangKham === 10 ? '#313131' : '',
                                                    // pointerEvents: doctor.SoLuongBenhNhan === 10 ? 'none' : 'all',
                                                    cursor: doctor.SoNguoiDangKham === 10 ? 'not-allowed' : 'pointer',
                                                }}
                                            >
                                                Chọn phòng
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        }




                    </tbody>
                </table>

                {/* Pagination */}
                <div className="chooseRoom-container__pagination">
                    <button className="chooseRoom-container__pagination-prev" disabled>{`Previous`}</button>
                    <span className="chooseRoom-container__pagination-page">1</span>
                    <button className="chooseRoom-container__pagination-next" disabled>{`Next`}</button>
                </div>
            </div>
        </>
    );
}