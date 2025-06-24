
'use client';
import '../SkipTheTestDetail.css';
import Tabbar from '@/app/components/shared/Tabbar/Tabbar';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { formatCurrencyVND } from '@/app/lib/Format';



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
                <div className="PrescriptionDetails-container__Box1" style={{height : 'auto'}}>
                    <h3>Thông tin bệnh nhân</h3>
                    <div className="patient-info" style={{color:'black'}}>
                        <p style={{margin : '8px 0px'}}><strong>Tên đơn thuốc: </strong>Đơn thuóc 1</p>
                        <p style={{margin : '8px 0px'}}><strong>Bệnh nhân:</strong>Ngô Hoàng Anh</p>
                        <p style={{margin : '8px 0px'}}><strong>Số điện thoại:</strong>218879912</p>
                        <p style={{margin : '8px 0px'}}><strong>Bác sĩ:</strong>Hùng Trần Nhân Gian</p>
                        <p style={{margin : '8px 0px'}}><strong>Thời gian:</strong> 12h72</p>
                        <p style={{margin : '8px 0px'}}><strong>Ngày:</strong>12/12/2023</p>
                        <p style={{margin : '8px 0px'}}><strong style={{fontSize : '18px'}}>Tổng tiền :</strong> <span style={{color : 'red' , fontSize : '16px', fontWeight:600}}>{formatCurrencyVND (978128)}</span></p>
                    </div>


                    <div className="PrescriptionDetails-container__Box1__boxPage">
                        <button className="confirm-button PrescriptionDetails-container__Box1__boxPage__cancer"
                                onClick={() => router.push('/LaboratoryDoctor/TestWaitingList')}
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
                                    
                                </tr>
                            ))}
                        </tbody>
                    </table>


                    
                </div>
            </div>
        </>
    );
}
