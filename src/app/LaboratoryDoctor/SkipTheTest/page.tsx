'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import { formatTime } from "@/app/lib/Format";
import './SkipTheTest.css';

export default function Prescription() {
    const router = useRouter();

    // ✅ Dữ liệu giả lập
    const [dataPrescription, setDataPrescription] = useState([
        {
            _id: '1',
            HoVaTen: 'Nguyễn Văn A',
            SoDienThoai: '0901234567',
            LoaiXetNghiem: 'Xét nghiệm máu',
            PhongKham: 'Phòng 101',
            TenBacSi: 'Bác sĩ B',
            Ngay: new Date().toISOString()
        },
        {
            _id: '2',
            HoVaTen: 'Trần Thị B',
            SoDienThoai: '0912345678',
            LoaiXetNghiem: 'Xét nghiệm nước tiểu',
            PhongKham: 'Phòng 102',
            TenBacSi: 'Bác sĩ C',
            Ngay: new Date().toISOString()
        },
        {
            _id: '3',
            HoVaTen: 'Lê Văn C',
            SoDienThoai: '0923456789',
            LoaiXetNghiem: 'Chụp X-quang',
            PhongKham: 'Phòng 103',
            TenBacSi: 'Bác sĩ D',
            Ngay: new Date().toISOString()
        },
        {
            _id: '4',
            HoVaTen: 'Phạm Thị D',
            SoDienThoai: '0934567890',
            LoaiXetNghiem: 'Xét nghiệm đường huyết',
            PhongKham: 'Phòng 104',
            TenBacSi: 'Bác sĩ E',
            Ngay: new Date().toISOString()
        },
        {
            _id: '5',
            HoVaTen: 'Đỗ Văn E',
            SoDienThoai: '0945678901',
            LoaiXetNghiem: 'Siêu âm tim',
            PhongKham: 'Phòng 105',
            TenBacSi: 'Bác sĩ F',
            Ngay: new Date().toISOString()
        }
    ]);

    return (
        <>
            <Tabbar
                tabbarItems={{
                    tabbarItems: [
                        { text: 'Chờ xét nghiệm', link: '/LaboratoryDoctor/TestWaitingList' },
                        { text: 'Bỏ qua xét nghiệm', link: '/LaboratoryDoctor/SkipTheTest' },
                        { text: 'Đã xét nghiệm', link: '/Cashier/PaymentWaitingList/ParaclinicalPaymentRequired' }
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
                            <th>Họ và tên</th>
                            <th>Số điện thoại</th>
                            <th>Loại xét nghiệm</th>
                            <th>Phòng khám</th>
                            <th>Tên bác sĩ</th>
                            <th>Ngày</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>


                    <tbody>
                        {dataPrescription.map((record, index) => (
                            <tr key={record._id}>
                                <td>{index + 1}</td>
                                <td style={{ whiteSpace: 'nowrap' }}>{record.HoVaTen}</td>
                                <td>{record.SoDienThoai}</td>
                                <td>{record.LoaiXetNghiem}</td>
                                <td>{record.PhongKham}</td>
                                <td style={{ whiteSpace: 'nowrap' }}>{record.TenBacSi}</td>
                                <td style={{ whiteSpace: 'nowrap' }}>{formatTime(record.Ngay)}</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <button
                                            className="button--green"
                                            style={{ marginRight: '10px' }}
                                            onClick={() => router.push(`/LaboratoryDoctor/SkipTheTest/12`)}
                                        >
                                            Thực hiện
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
