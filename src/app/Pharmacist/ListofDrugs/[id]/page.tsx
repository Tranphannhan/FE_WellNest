
'use client';
import React, { useEffect, useState } from 'react';
import './ListofDrugsDetail.css';
import Tabbar from '@/app/components/shared/Tabbar/Tabbar';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { formatTime } from '@/app/lib/Format';
import { PrescriptionDetail } from '@/app/Doctor/Patient/ToExamine/[id]/CreateResults/CreateResultsComponent/Prescription';
import { ConfirmationOfDispensing, getPrescriptionListDetail } from '@/app/services/Pharmacist';
import { getDetailPatientInformation } from '@/app/services/Cashier';
import { prescriptionType } from '@/app/types/patientTypes/patient';




export default function PrescriptionDetails() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;
    const [dataDrugInformation , setDataDrugInformation] = useState <prescriptionType > ()
    const [detailedPrescription , setDetailedPrescription] = useState  <PrescriptionDetail []> ([]);


    const loadAPI = async () => {
        const datadetailedPrescription  = await  getPrescriptionListDetail (String (id));
        if (!datadetailedPrescription) return;
        setDetailedPrescription (datadetailedPrescription);
        const DataDrugInformation = await getDetailPatientInformation (String (id));
        console.log(DataDrugInformation);
        if (!DataDrugInformation) return;
        setDataDrugInformation (DataDrugInformation)
    }
    
    useEffect (() => {
        loadAPI ();
    }, []);


    // xác nhận thanh toán
    const handleConfirmationDispensing = (idDonthuoc : string) => {
        console.log(idDonthuoc);
        ConfirmationOfDispensing (idDonthuoc , '68272d28b4cfad70da810025');
    }

    return (
        <>
            <Tabbar
                tabbarItems={{
                    tabbarItems: [
                        { text: 'Chi tiết đơn thuốc', link: `/Pharmacist/ListofDrugs/${id}` },
                    ],
                }}
            />


            <div className="PrescriptionDetails-container">
                {/* Thông tin bệnh nhân */}
                <div className="PrescriptionDetails-container__Box1" style={{height : 'auto'}}>
                    <h3>Thông tin thuốc</h3>
                    <div className="patient-info" style={{color:'black'}}>
                        <p style={{margin : '8px 0px'}}><strong>Tên đơn thuốc: </strong>{dataDrugInformation?.TenDonThuoc}</p>
                        <p style={{margin : '8px 0px'}}><strong>Bệnh nhân:</strong> {dataDrugInformation?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.HoVaTen}</p>
                        <p style={{margin : '8px 0px'}}><strong>Số điện thoại:</strong> {dataDrugInformation?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.SoDienThoai}</p>
                        <p style={{margin : '8px 0px'}}><strong>Bác sĩ:</strong>  {dataDrugInformation?.Id_PhieuKhamBenh?.Id_Bacsi?.TenBacSi}</p>
                        <p style={{margin : '8px 0px'}}><strong>Thời gian:</strong> {formatTime (dataDrugInformation?.Gio as string)}</p>
                        <p style={{margin : '8px 0px'}}><strong>Ngày:</strong> {dataDrugInformation?.Id_PhieuKhamBenh?.Ngay}</p>
                    </div>


                    <div className="PrescriptionDetails-container__Box1__boxPage">
                        <button className="confirm-button PrescriptionDetails-container__Box1__boxPage__cancer"
                            onClick={() => router.push('/Pharmacist/ListofDrugs')}
                        >   
                            <i className ="bi bi-x-circle-fill"></i>
                            Hủy
                        </button>

                        <button className="confirm-button PrescriptionDetails-container__Box1__boxPage__check" 
                            onClick={() => handleConfirmationDispensing (dataDrugInformation?._id as string)}
                        >
                            <i className="bi bi-check-circle-fill"></i>
                            Xác nhận phát thuốc
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
                                <th>Ghi chú</th>
                            </tr>
                        </thead>
   
                        <tbody>
                            {detailedPrescription.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.Id_Thuoc.TenThuoc}</td>
                                    <td>{item.Id_Thuoc.DonVi}</td>
                                    <td>{item.SoLuong}</td>
                                    <td>{item.NhacNho}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>


                    
                </div>
            </div>
        </>
    );
}
