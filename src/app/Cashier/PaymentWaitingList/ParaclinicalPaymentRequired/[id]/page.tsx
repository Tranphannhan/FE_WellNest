

'use client';
import '../../PrescriptionDetails.css';
import Tabbar from '@/app/components/shared/Tabbar/Tabbar';
import { formatCurrencyVND, formatTime } from '@/app/lib/Format';
import { getDetailParaclinicalAwaitingPayment } from '@/app/services/Cashier';
import { paraclinicalType } from '@/app/types/patientTypes/patient';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';



export default function PrescriptionDetails() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    const [dataDetail , setdataDetail ] = useState <paraclinicalType []> ([]);
    const [totalPrice , setTotalPrice] = useState <number> (0)

  const loaddingApi = async () => {
        const response : {totalItems : number , currentPage : number , totalPages : number , TongTien : number , data : paraclinicalType [] }| null  = await getDetailParaclinicalAwaitingPayment(String(id) );

        // Kiểm tra response tồn tại
        if (!response) return;
        setTotalPrice (response.TongTien)

        // Kiểm tra response.data có phải là mảng không
        if (!Array.isArray(response.data)) return;

        // Nếu hợp lệ, set state
        setdataDetail(response.data as paraclinicalType[]);
    }

 

    useEffect (() => {
        console.log('id : ' + id);
        loaddingApi ();

    }, []);
 

    return (
        <>
            <Tabbar
                tabbarItems={{
                    tabbarItems: [
                        { text: 'Chi tiết cận lâm sàng', link: `/Cashier/PaymentWaitingList/ParaclinicalPaymentRequired/${id}` },
                    ],
                }}
            />  


            <div className="PrescriptionDetails-container">
                {/* Thông tin bệnh nhân */}
                <div className="PrescriptionDetails-container__Box1">
                    <h3>Thông tin bệnh nhân</h3>
                    <div className="PrescriptionDetails-container__Box1__patient-info" style={{color:'black'}}>
                        <p><strong>Bệnh nhân: </strong>{dataDetail[0]?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.HoVaTen}</p>
                        <p><strong>Ngày sinh: </strong>{dataDetail[0]?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.NgaySinh}</p>
                        <p><strong>Giới tính: </strong>{dataDetail[0]?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.GioiTinh}</p>
                        <p><strong>Ngày: </strong>{dataDetail[0]?.Id_PhieuKhamBenh?.Ngay}</p>
                        <p><strong>Số điện thoại: </strong>{dataDetail[0]?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.SoDienThoai}</p>
                        <p><strong style={{fontSize : '18px'}}>Tổng tiền : </strong>
                            <span style={{color : 'red' , fontSize : '16px', fontWeight:600}}>
                                {formatCurrencyVND(totalPrice)}
                            </span>
                        </p>
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



                 
                <div className="PrescriptionDetails-container__Box2">
                    <div className='PrescriptionDetails-container__Box2__title'>Chi tiết cận lâm sàng</div>

                    <table className="Prescription-container_table">
                        <thead  style={{backgroundColor:'#f7fafc', fontWeight:600}}>
                            <tr>
                                <th>Tên phòng thiết bị</th>
                                <th>Tên xét nghiệm</th>
                                <th>Thời gian</th>
                                <th>Bác sĩ</th>
                                <th>Giá</th>
                            </tr>
                        </thead>


                        <tbody>
                            {dataDetail.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.Id_LoaiXetNghiem.Id_PhongThietBi.TenPhongThietBi}</td>
                                    <td>{item?.Id_LoaiXetNghiem.TenXetNghiem}</td>
                                    <td>{formatTime (item.Gio)}</td>
                                    <td>{item.Id_PhieuKhamBenh.Id_Bacsi?.TenBacSi}</td>
                                    <td style={{ color: 'red'}}>
                                        {formatCurrencyVND (item?.Id_LoaiXetNghiem?.Id_GiaDichVu?.Giadichvu || 0)}
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
