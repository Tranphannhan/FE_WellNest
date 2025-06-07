"use client"

import React, { useState }  from "react";
import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import './ChooseRoom.css'
import Link from "next/link";
import Example from './notificationChooseRoom';



export default function ChooseRoom() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [valueChooseRom , setValueChooseRom] = useState ({
        name : 'Huân',
        roomNumber : 3,
    })

    const handleSetValue = (name : string , roomNumber : number) => {
        setValueChooseRom ({
            name : name,
            roomNumber : roomNumber
        })
            setShow(true)
    }



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
                        {[
                            { name: "Dr. Ngô Dũng", room: 1, patients: 1 },
                            { name: "Dr. Hà Nhân", room: 2, patients: 2 },
                            { name: "Dr. Lương Y", room: 3, patients: 4 },
                            { name: "Dr. Nguyễn Thị Mộng Thi", room: 4, patients: 5 },
                            { name: "Dr. Lương Tăng", room: 5, patients: 6 },
                            { name: "Dr. Bảo Trân", room: 6, patients: 8 },
                            { name: "Dr. Bệnh Nhân", room: 7, patients: 9 },
                        ].map((doctor, index) => {
                            const totalMinutes = doctor.patients * 15;
                            const formatTime = (minutes: number) => {
                                if (minutes < 60) return `${minutes} phút`;
                                const hours = Math.floor(minutes / 60);
                                const mins = minutes % 60;
                                return mins === 0 ? `${hours} tiếng` : `${hours} tiếng ${mins} phút`;
                            };
                            return (
                                <tr key={index}>
                                    <td>{doctor.name}</td>
                                    <td>{doctor.room}</td>
                                    <td style={{
                                        color:
                                            doctor.patients < 4 ? "green" :
                                                doctor.patients < 8 ? "orange" :
                                                    "red"
                                    }}>
                                        {doctor.patients + "/10"} bệnh nhân
                                    </td>
                                    <td>{formatTime(totalMinutes)}</td>
                                    <td>
                                        <button className="chooseRoom-container__btn-choose" onClick={() => handleSetValue (doctor.name , doctor.room) }>Chọn phòng</button>
                                    </td>
                                </tr>
                            )
                        })}
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