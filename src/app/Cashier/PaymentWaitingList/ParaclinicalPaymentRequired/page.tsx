
'use client'
import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import '../Prescription.css';
import ConfirmationNotice from '../../ComponentCashier/ConfirmationNotice';
import React, { useState } from 'react';
import { formatCurrencyVND, formatTime } from "@/app/lib/Format";
import { FaMoneyCheckDollar } from "react-icons/fa6";
   
 
export default function Prescription (){
    const mockData = [
        {
            _id: '1',
            Id_TheKhamBenh: {
                HoVaTen: 'Nguyễn Văn A',
                SoDienThoai :  '0909876543',
                DichVu : 'Xét nghiệm máu',
                TenBacSi: 'Dr Ngô Hoàng Anh',
                TongTien : 1282,
            },
            Ngay: '2024/06/17',
            Gio : '15:30:45'
        },

        {
            _id: '2',
            Id_TheKhamBenh: {
                HoVaTen: 'Nguyễn Văn Hùng',
                SoDienThoai :  '0909876512',
                DichVu : 'Xét nghiệm châm',
                TenBacSi: 'Dr GT Giao Long',
                TongTien : 1982,
            },
            Ngay: '2024/06/27',
            Gio : '15:30:45'
        },
    ];

  

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
                        { text: 'Cận lâm sàng chờ thanh toán', link: '/Cashier/PaymentWaitingList/ParaclinicalPaymentRequired'}
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
                            <th>Số Điện Thoại</th>
                            <th>Dịch vụ</th>
                            <th>Tên bác sĩ</th>
                            <th>Thời gian</th>
                            <th>Tổng Tiền</th>
                            <th>Hành động </th>
                        </tr>
                    </thead>


                    <tbody>  
                        {mockData.map((record , index) => (
                            <tr key={record._id}>
                                <td>{1 + index}</td>
                                <td>{record.Id_TheKhamBenh.HoVaTen}</td>
                                <td>{record.Id_TheKhamBenh.SoDienThoai}</td>
                                <td>{record.Id_TheKhamBenh.DichVu}</td>
                                <td>{record.Id_TheKhamBenh.TenBacSi}</td>
                                <td >{formatTime (record.Gio)}</td>


                                <td style={{color : 'red' , fontWeight : 'bold'}}>
                                    {formatCurrencyVND (record.Id_TheKhamBenh.TongTien)}
                                </td>


                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <button className="button--green"
                                            style={{
                                                marginRight : '10px'
                                            }}>

                                            <i className="bi bi-eye-fill"></i>
                                            Xem chi tiết
                                        </button>


                                        <button className="button--red"
                                             onClick={() => handlePaymenConfirmation(
                                                record.Id_TheKhamBenh.HoVaTen,
                                                record.Id_TheKhamBenh.TongTien
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