
'use client';
import '../SkipTheTestDetail.css';
import Tabbar from '@/app/components/shared/Tabbar/Tabbar';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { formatCurrencyVND } from '@/app/lib/Format';
import { FaPlus } from 'react-icons/fa6';
import { Link } from 'lucide-react';


export default function PrescriptionDetails() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;


      // ✅ Dữ liệu giả lập ở đây
    const detailedPrescription = [
        {
            Id_Thuoc: {
                TenThuoc: 'Paracetamol 500mg',
                DonVi: 'Viên',
                Gia: 5000
            },
            SoLuong: 10
        },
        {
            Id_Thuoc: {
                TenThuoc: 'Vitamin C 500mg',
                DonVi: 'Viên',
                Gia: 3000
            },
            SoLuong: 20
        },
        {
            Id_Thuoc: {
                TenThuoc: 'Amoxicillin 500mg',
                DonVi: 'Viên',
                Gia: 7000
            },
            SoLuong: 15
        }
    ];

    return (
        <>
            <Tabbar
                tabbarItems={{
                    tabbarItems: [
                        { text: 'Chi tiết đơn thuốc', link: `/Cashier/PaymentWaitingList/${id}` },
                    ],
                }}
            />


            <div className="PrescriptionDetails-container">
                {/* Thông tin bệnh nhân */}
                <div className="PrescriptionDetails-container__Box1" style={{height : 'auto' , flex : '1'}}>
                    <h3>Thông tin bệnh nhân</h3>
                    <div className="patient-info" style={{color:'black'}}>
                        <p style={{margin : '8px 0px'}}><strong>Bệnh nhân: </strong>Hồ Đăng Khoa</p>
                        <p style={{margin : '8px 0px'}}><strong>Ngày sinh: </strong>12/12/2022</p>
                        <p style={{margin : '8px 0px'}}><strong>Giới tính: </strong>Nam</p>
                        <p style={{margin : '8px 0px'}}><strong>Ngày: </strong>12/12/2023</p>
                        <p style={{margin : '8px 0px'}}><strong>Số điện thoại: </strong>123456789</p>
                        <p style={{margin : '8px 0px'}}><strong>Tiền sử bệnh: </strong>Chua có </p>
                        <p style={{margin : '8px 0px'}}><strong>Lịch sử khám bệnh: </strong></p>
                    </div>
                </div>


                {/* Bảng chi tiết đơn thuốc */}
                <div className="PrescriptionDetails-container__Box2">
                    <div className='PrescriptionDetails-container__Box2__title'>Đơn thuốc chi tiết</div>

                    <table className="Prescription-container_table">
                        <thead>
                            <tr>
                                <th>Tên xét nghiệm</th>
                                <th>Thời gian</th>
                                <th>Bác sĩ </th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>


                        <tbody>
                            {detailedPrescription.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.Id_Thuoc.TenThuoc}</td>
                                    <td>{item.Id_Thuoc.DonVi}</td>
                                    <td>{item.SoLuong}</td>

                                
                                    {/* <td style={{ color: 'red', fontWeight: 'bold' }}>12</td> */}
                                    <td style={{color:'red'}}>{formatCurrencyVND (item.Id_Thuoc.Gia || 0)}</td>
                                    <td>
                                        <button className='button--blue'><FaPlus  />Tạo kết quả</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>


                    
                </div>
            </div>
        </>
    );
}
