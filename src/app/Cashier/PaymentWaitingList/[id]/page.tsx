
'use client';
import React, { useEffect, useState } from 'react';
import '../PrescriptionDetails.css';
import Tabbar from '@/app/components/shared/Tabbar/Tabbar';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { prescriptionType } from '@/app/types/patientTypes/patient';
import { getDetailPatientInformation, getDetailPrescription } from '@/app/services/Cashier';
import { formatCurrencyVND, formatTime } from '@/app/lib/Format';
import { PrescriptionDetail } from '@/app/Doctor/Patient/ToExamine/[id]/CreateResults/CreateResultsComponent/Prescription';

export default function PrescriptionDetails() {
    const params = useParams();
    const { id } = params;

    const [data , setdata] = useState <prescriptionType > ()
    const [detailedPrescription , setDetailedPrescription] = useState  <PrescriptionDetail []> ([]);


    const loadAPI = async () => {
        const data = await getDetailPatientInformation (String (id));
        const datadetailedPrescription  = await  getDetailPrescription (String (id));
        if (!datadetailedPrescription) return;
        setDetailedPrescription (datadetailedPrescription);

        console.log(datadetailedPrescription);
        if (!data) return 
        setdata (data)
    }

    
    useEffect (() => {
        console.log('id : ' + id);
        loadAPI ();
    }, []);



    const router = useRouter();



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
                <div className="PrescriptionDetails-container__Box1" style={{height : '450px'}}>
                    <h3>Thông tin bệnh nhân</h3>
                    <div className="patient-info" style={{color:'black'}}>
                        <p><strong>Tên đơn thuốc: </strong>{data?.TenDonThuoc}</p>
                        <p><strong>Bệnh nhân:</strong> {data?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.HoVaTen}</p>
                        <p><strong>Số điện thoại:</strong> {data?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.SoDienThoai}</p>
                        <p><strong>Bác sĩ:</strong>  {data?.Id_PhieuKhamBenh?.Id_Bacsi?.TenBacSi}</p>
                        <p><strong>Thời gian:</strong> {formatTime (data?.Gio as string)}</p>
                        <p><strong>Ngày:</strong> {data?.Id_PhieuKhamBenh?.Ngay}</p>
                        <p><strong style={{fontSize : '18px'}}>Tổng tiền :</strong> <span style={{color : 'red' , fontSize : '16px', fontWeight:600}}>{formatCurrencyVND (data?.TongTien ||  0)}</span></p>
                    </div>


                    <div className="PrescriptionDetails-container__Box1__boxPage">
                        <button className="confirm-button PrescriptionDetails-container__Box1__boxPage__cancer"
                             onClick={() => router.push('/Cashier/PaymentWaitingList')}
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
