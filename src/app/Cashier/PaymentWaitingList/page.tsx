
'use client'
import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import './Prescription.css';
import ConfirmationNotice from "../ComponentCashier/ConfirmationNotice";
import { useState } from "react";


export default function Prescription (){
    const mockData = [
        {
            _id: '1',
            STTKham: '1',
            Id_TheKhamBenh: {
                HoVaTen: 'Nguyễn Văn A',
                SoDienThoai: '0901234567',
                TenDonThuoc: 'Tên đơn thuốc 1',
                TenBacSi: '012345678901',
            },
            Ngay: '2024-06-17'
        },

        {
            _id: '2',
            STTKham: '2',
            Id_TheKhamBenh: {
                HoVaTen: 'Trần Thị B',
                SoDienThoai: '0909876543',
                TenDonThuoc: 'Tên đơn thuốc 2',
                TenBacSi: '098765432109',
            },
            Ngay: '2024-06-17'
        }
    ];


    //  ------------

    
    const [showModal, setShowModal] = useState(false);
    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
 

    const handleConfirm = () => {
        console.log('Đã xác nhận thanh toán!');
        setShowModal(false);
    };

    
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
                    name: 'Nguyễn Văn Hoàng Kim Cốt',
                    totalPrice: '300.000',
                    paymentMethod: 'Chuyển khoản',
                    handleClose: handleClose,
                    handleShow: handleShow,
                    show: showModal,
                    callBack: handleConfirm
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
                            <th>Họ và tên</th>
                            <th>SĐT</th>
                            <th>Tên Đơn Thuốc</th>
                            <th>Tên bác sĩ</th>
                            <th>Ngày</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {mockData.map((record) => (
                            <tr key={record._id}>
                                <td>{record.Id_TheKhamBenh.HoVaTen}</td>
                                <td>{record.Id_TheKhamBenh.SoDienThoai}</td>
                                <td>{record.Id_TheKhamBenh.TenDonThuoc}</td>
                                <td>{record.Id_TheKhamBenh.TenBacSi}</td>
                                <td>{record.Ngay}</td>
                                <td>
                                    <button className="Prescription-container_table__btn-primary">Xem Chi Tiết</button>
                                    <button className="btn-danger">Thu tiền</button>    
                                </td>
                            </tr>
                        ))}
                    </tbody>


                </table>


            </div>


        </>
    )

}