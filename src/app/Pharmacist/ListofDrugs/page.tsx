

'use client'
import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import './ListofDrugs.css';
import React, { useEffect, useState } from 'react';
import {prescriptionType } from "@/app/types/patientTypes/patient";
import Link from 'next/link';
import { getPrescriptionList } from "@/app/services/Pharmacist";
   

 
// 
export default function Prescription (){
    const [dataPrescription , setDataPrescription] = useState <prescriptionType []> ([]);
    const loadApi = async () => {
        const getData = await getPrescriptionList();
        if (!getData) return;
        console.log(getData);

        if (Array.isArray(getData)) {
            setDataPrescription(getData);
        }
    }

    useEffect (() => {
        loadApi ();
    },[]);

 
    return (
        <>
            <Tabbar
                tabbarItems={{
                        tabbarItems: [
                        { text: 'Đơn thuốc chờ phát', link: '/Pharmacist/ListofDrugs' },
                        { text: 'Đơn thuốc đã phát', link: '/Cashier/PaymentWaitingList/ParaclinicalPaymentRequired'}
                    ],
                    
                }}
            />


            <div className="Prescription-container">
                <div className="Prescription-searchReceptionContainer">
                    <div className="Prescription_searchBoxWrapper">
                        <div className="Prescription_searchBox">
                            <input
                                type="text"
                                placeholder="Hãy nhập số điện thoại"
                                className="search-input"
                            />
                            <button className="search-btn">
                            <i className="bi bi-search"></i>
                            </button>
                        </div>

                        <div className="Prescription_searchBox">
                            <input
                                type="text"
                                placeholder="Hãy nhập tên"
                                className="search-input"
                            />
                            <button className="search-btn">
                            <i className="bi bi-search"></i>
                            </button>
                        </div>
                    </div>
                </div>

 

                <table className="Prescription-container_table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên đơn thuốc</th>
                            <th>Ngày</th>
                            <th>Bệnh nhân</th>
                            <th>Số Điện Thoại</th>
                            <th>Bác sĩ</th>
                            <th>Hành động </th>
                        </tr>
                    </thead>



                    <tbody>  
                        {dataPrescription.map((record , index) => (
                            <tr key={record._id}>
                                <td>{1 + index}</td>
                                <td>{record?.TenDonThuoc}</td>
                                <td>{record?.Id_PhieuKhamBenh?.Ngay || ''}</td>
                                <td>{record?.Id_PhieuKhamBenh?.Id_TheKhamBenh.HoVaTen}</td>
                                <td>{record?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.SoDienThoai}</td>
                                <td>{record?.Id_PhieuKhamBenh?.Id_Bacsi?.TenBacSi}</td>


                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                       <Link href={`/Pharmacist/ListofDrugs/${record._id}`}>
                                         <button className="button--green"
                                                style={{
                                                    marginRight : '10px'
                                                }}>

                                                <i className="bi bi-eye-fill"></i>
                                                Xem chi tiết
                                            </button>
                                       </Link>
                                    </div>
                                </td>




                            </tr>   
                        ))}
                    </tbody>


                    


                </table>

                  

            </div>
        </>
    )

}