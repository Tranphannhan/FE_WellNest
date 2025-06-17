

'use client';
import React from 'react';
import '../PrescriptionDetails/PrescriptionDetails.css';
import Tabbar from '@/app/components/shared/Tabbar/Tabbar';

export default function PrescriptionDetails() {
    const mockData = [
        { TenPhongThietBi: 'Phòng xét nghiệm 101', TenXetNghiem: 'Xét nghiệm máu', GiaMoiDonVi: 1, GiaTong: 150000 },
        { TenPhongThietBi: 'Phòng xét nghiệm 102', TenXetNghiem: 'Xét nghiệm nước tiểu', GiaMoiDonVi: 1, GiaTong: 200000 },
        { TenPhongThietBi: 'Phòng siêu âm 201', TenXetNghiem: 'Siêu âm bụng tổng quát', GiaMoiDonVi: 1, GiaTong: 500000 },
        { TenPhongThietBi: 'Phòng X-Quang 301', TenXetNghiem: 'Chụp X-Quang ngực', GiaMoiDonVi: 1, GiaTong: 350000 },
        { TenPhongThietBi: 'Phòng nội soi 401', TenXetNghiem: 'Nội soi dạ dày', GiaMoiDonVi: 1, GiaTong: 800000 },
        { TenPhongThietBi: 'Phòng xét nghiệm 103', TenXetNghiem: 'Xét nghiệm tiểu đường', GiaMoiDonVi: 1, GiaTong: 250000 },
        { TenPhongThietBi: 'Phòng X-Quang 302', TenXetNghiem: 'Chụp X-Quang cột sống', GiaMoiDonVi: 1, GiaTong: 400000 }
    ];


    return (
        <>
            <Tabbar
                tabbarItems={{
                    tabbarItems: [
                        { text: 'Chi tiết cận lâm sàng', link: '/Cashier/PaymentWaitingList/ParaclinicalDetails' },
                    ],
                }}
            />

            <div className="PrescriptionDetails-container">
                {/* Thông tin bệnh nhân */}
                <div className="PrescriptionDetails-container__Box1">
                    <h3>Thông tin bệnh nhân</h3>
                    <div className="patient-info">
                        <p><strong>Dịch vụ:</strong> Xét nghiệm máu</p>
                        <p><strong>Bệnh nhân:</strong> Loza Niiii</p>
                        <p><strong>Ngày:</strong> 05/12/2022</p>
                        <p><strong>Bác sĩ yêu cầu:</strong> Dr. John</p>
                        <p><strong>Số điện thoại:</strong> 0908109200</p>
                        <p><strong style={{fontSize : '16px'}}>Tổng tiền :</strong> <span style={{color : 'red' , fontSize : '16px'}}>2.050.000 đ</span></p>
                    </div>


                    <div className="PrescriptionDetails-container__Box1__boxPage">
                        <button className="confirm-button PrescriptionDetails-container__Box1__boxPage__cancer">
                            <i className ="bi bi-x-circle-fill"></i>
                            Hủy
                        </button>

                        <button className="confirm-button PrescriptionDetails-container__Box1__boxPage__check">
                            <i className="bi bi-check-circle-fill"></i>
                            Xác nhận thanh toán
                        </button>
                    </div>
                </div>



                
                <div className="PrescriptionDetails-container__Box2">
                    <div className='PrescriptionDetails-container__Box2__title'>Chi tiết cận lâm sàng</div>

                    <table className="Prescription-container_table">
                        <thead>
                            <tr>
                                <th>Tên phòng thiết bị</th>
                                <th>Tên xét nghiệm</th>
                                <th>Giá mỗi đơn vị</th>
                                <th>Giá tổng</th>
                            </tr>
                        </thead>

                        <tbody>
                            {mockData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.TenPhongThietBi}</td>
                                    <td>{item.TenXetNghiem}</td>
                                    <td>{item.GiaMoiDonVi}</td>
                                    <td style={{ color: 'red', fontWeight: 'bold' }}>{item.GiaTong.toLocaleString()} đ</td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
