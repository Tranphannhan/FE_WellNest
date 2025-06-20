
'use client';
import React from 'react';
import './PrescriptionDetails.css';
import Tabbar from '@/app/components/shared/Tabbar/Tabbar';
import { useRouter } from 'next/navigation';


export default function PrescriptionDetails() {
    const router = useRouter();
    const mockData = [
        { name: 'Paracetamol 500mg', unit: 'Vỉ', quantity: 1, price: 150000, total: 150000 },
        { name: 'Onepiece 500mg', unit: 'Viên', quantity: 20, price: 15000, total: 300000 },
        { name: 'Naruto 500mg', unit: 'Gói', quantity: 3, price: 450000, total: 1350000 },
        { name: 'Sasuke 500mg', unit: 'Vỉ', quantity: 1, price: 250000, total: 250000 },
        { name: 'Sasuke 500mg', unit: 'Vỉ', quantity: 1, price: 250000, total: 250000 },
        { name: 'Sasuke 500mg', unit: 'Vỉ', quantity: 1, price: 250000, total: 250000 },
        { name: 'Sasuke 500mg', unit: 'Vỉ', quantity: 1, price: 250000, total: 250000 },
    ];



    return (
        <>
            <Tabbar
                tabbarItems={{
                    tabbarItems: [
                        { text: 'Chi tiết đơn thuốc', link: '/Cashier/PaymentWaitingList/PrescriptionDetails' },
                    ],
                }}
            />


            <div className="PrescriptionDetails-container">
                {/* Thông tin bệnh nhân */}
                <div className="PrescriptionDetails-container__Box1">
                    <h3>Thông tin bệnh nhân</h3>
                    <div className="patient-info">
                        <p><strong>Tên đơn thuốc:</strong> Đơn số 1</p>
                        <p><strong>Bệnh nhân:</strong> Elizabeth Polson</p>
                        <p><strong>Ngày:</strong> 05/12/2022</p>
                        <p><strong>Bác sĩ:</strong> Dr. John</p>
                        <p><strong>Số điện thoại:</strong> 0908109200</p>
                        <p><strong style={{fontSize : '16px'}}>Tổng tiền :</strong> <span style={{color : 'red' , fontSize : '16px'}}>2.050.000 đ</span></p>
                    </div>


                    <div className="PrescriptionDetails-container__Box1__boxPage">
                        <button className="confirm-button PrescriptionDetails-container__Box1__boxPage__cancer"
                             onClick={() => router.push('/Cashier/PaymentWaitingList/ParaclinicalPaymentRequired')}
                        >
                            <i className ="bi bi-x-circle-fill"></i>
                            Hủy
                        </button>

                        <button className="confirm-button PrescriptionDetails-container__Box1__boxPage__check">
                            <i className="bi bi-check-circle-fill"></i>
                            Xác nhận thanh toán
                        </button>
                    </div>
                </div>



                {/* Bảng chi tiết đơn thuốc */}
                <div className="PrescriptionDetails-container__Box2">
                    <div className='PrescriptionDetails-container__Box2__title'>Đơn thuốc chi tiết</div>

                    <table className="Prescription-container_table">
                        <thead>
                            <tr>
                                <th>Tên thuốc</th>
                                <th>Đơn vị</th>
                                <th>Số lượng</th>
                                <th>Giá mỗi đơn vị</th>
                                <th>Giá tổng</th>
                            </tr>
                        </thead>

                        <tbody>
                            {mockData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.unit}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.price.toLocaleString()} đ</td>
                                    <td style={{ color: 'red', fontWeight: 'bold' }}>{item.total.toLocaleString()} đ</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>


                    
                </div>
            </div>
        </>
    );
}
