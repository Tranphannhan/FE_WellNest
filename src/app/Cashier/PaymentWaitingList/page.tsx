
'use client'
import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import './Prescription.css';
import { useRouter } from 'next/navigation';
import ConfirmationNotice from "../ComponentCashier/ConfirmationNotice";
import React, {  useEffect, useState } from 'react';
import { formatCurrencyVND, formatTime } from "@/app/lib/Format";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { prescriptionType } from "@/app/types/patientTypes/patient";
import { getPrescriptionPendingPayment } from "@/app/services/Cashier";



export default function Prescription (){
    const router = useRouter();
    const [dataPrescription , setDataPrescription] = useState <prescriptionType []> ([]);
    const loadApi = async () => {
        const getData : prescriptionType | [] | null = await getPrescriptionPendingPayment();
        if (!getData) return;
        if (Array.isArray(getData)) {
            setDataPrescription(getData);
        } else {
            setDataPrescription([getData]);
        }
    }

    useEffect (() => {
        loadApi ();
    },[]);
    
    
    // 
    const [showModal, setShowModal] = useState(false);
    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    interface paymenConfirmationType {
        HoVaTen ? : string,
        TongTien ? : number
    }

    const [dataPendingPayment , setDataPendingPayment] = useState <paymenConfirmationType> ({})
    const handlePaymenConfirmation = (HoVaTen : string , TongTien : number) => {
        setDataPendingPayment ({HoVaTen : HoVaTen , TongTien : TongTien})
        setShowModal(true);
    }

    const paymentConfirmation = () => {
        setShowModal(false);
        console.log('xác nhận thanh toán thành công');
    }
    
    
    return (
        <>
            <Tabbar
                tabbarItems={{
                        tabbarItems: [
                        { text: 'Đơn thuốc chờ thanh toán', link: '/Cashier/PaymentWaitingList' },
                        { text: 'Cận lâm sàng chờ thanh toán', link: '/Cashier/PaymentWaitingList/ParaclinicalPaymentRequired' }
                    ],
                    
                }}
            />



            <ConfirmationNotice 
                Data_information={{
                    name: dataPendingPayment.HoVaTen || '', 
                    totalPrice: dataPendingPayment.TongTien !== undefined ? `${dataPendingPayment.TongTien}` : '', // Chuyển number sang string
                    paymentMethod: 'Chuyển khoản',
                    handleClose: handleClose,
                    handleShow: handleShow,
                    show: showModal,
                    callBack: handlePaymenConfirmation,
                    paymentConfirmation: paymentConfirmation
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
                            <th>Họ và tên</th>
                            <th>Số điện thoại</th>
                            <th>Tên Đơn Thuốc</th>
                            <th>Tên bác sĩ</th>
                            <th>Thời gian</th>
                            <th>Tổng tiền</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>

   
                    <tbody>
                        {dataPrescription.map((record , index) => (
                            <tr key={record._id}>
                                <td>{1 + index}</td>
                                <td>{record.Id_PhieuKhamBenh.Id_TheKhamBenh.HoVaTen}</td>
                                <td>{record.Id_PhieuKhamBenh.Id_TheKhamBenh.SoDienThoai}</td>
                                <td>{record.TenDonThuoc}</td>
                                <td>{record.Id_PhieuKhamBenh.Id_Bacsi.TenBacSi}</td>
                                <td>{record.Id_PhieuKhamBenh.Ngay}</td>
                                <td >{formatTime (record.Gio)}</td>
                                
                                <td style={{color : 'red' , fontWeight : 'bold'}}>
                                    {formatCurrencyVND (9999)}
                                </td>

                                 <td>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <button className="button--green"
                                            style={{
                                                marginRight : '10px'
                                            }}
                                            onClick={() => router.push('/Cashier/PaymentWaitingList/ParaclinicalDetails')}
                                            
                                            >
                                            <i className="bi bi-eye-fill"></i>
                                            Xem chi tiết
                                        </button>


                                        <button className="button--red"
                                               onClick={() => handlePaymenConfirmation(
                                                record.Id_PhieuKhamBenh.Id_TheKhamBenh.HoVaTen as string,
                                                9999
                                            )}
                                        >
                                            <FaMoneyCheckDollar/>
                                            Thu tiền
                                        </button>
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