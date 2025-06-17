// File: SelectedMedicineComponent.tsx
'use client';
import { useEffect, useState } from 'react';
import './Prescription.css';
import NoData from '@/app/components/ui/Nodata/Nodata';

import { confirmPrescriptionCompletion, deleteMedicine } from '@/app/services/DoctorSevices';

import { CheckPrescription } from '@/app/services/DoctorSevices';
import { useParams } from 'next/navigation';
import PreviewExaminationForm from '../ComponentResults/ComponentPrintTicket/PrescriptionForm';
import { formatCurrencyVND } from '@/app/lib/Format';
import { MedicalExaminationCard } from '@/app/types/patientTypes/patient';
import { BsFillPrinterFill } from 'react-icons/bs';
import ModalComponent from '@/app/components/shared/Modal/Modal';
import { FaCheck } from 'react-icons/fa';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface PrescriptionDetail {
    _id: string;
    Id_DonThuoc: string;
    Id_Thuoc: {
        _id: string;
        Id_NhomThuoc: string;
        TenThuoc: string;
        DonVi: string;
        Gia: number;
        __v: number;
    };
    SoLuong: number;
    NhacNho: string;
    DonVi: string;
    __v: number;
}

// Interface for the detailed patient data
export interface PatientExaminationData {
    _id: string;
    Id_TheKhamBenh: {
        _id: string;
        HoVaTen: string;
        GioiTinh: string;
        NgaySinh: string;
        SoDienThoai: string;
        SoBaoHiemYTe: string;
        DiaChi: string;
        SoCCCD: string;
        SDT_NguoiThan: string;
        LichSuBenh: string;
        __v: number;
    };
    Id_Bacsi: {
        _id: string;
        ID_Khoa: string;
        TenBacSi: string;
        GioiTinh: string;
        SoDienThoai: string;
        HocVi: string;
        NamSinh: number;
        Matkhau: string;
        Image: string;
        VaiTro: string;
        TrangThaiHoatDong: boolean;
        __v: number;
        Id_PhongKham: {
            _id: string;
            Id_Khoa: string;
            SoPhongKham: string;
        };
    };
    Id_NguoiTiepNhan: string;
    Id_GiaDichVu: string;
    LyDoDenKham: string;
    Ngay: string;
    Gio: string;
    TrangThaiThanhToan: boolean;
    STTKham: string;
    TrangThai: boolean;
    TrangThaiHoatDong: string;
    __v: number;
}


// Added onAddMedicineClick prop
export default function SelectedMedicineComponent({ onAddMedicineClick ,reload}: { onAddMedicineClick: () => void ,reload :()=>void}) {
    const [prescriptionDetails, setPrescriptionDetails] = useState<PrescriptionDetail[]>([]);
    const { id } = useParams();
    const [isDonThuocModalOpen, setIsDonThuocModalOpen] = useState(false);
    const [patientDataForForm, setPatientDataForForm] = useState< MedicalExaminationCard | null>(null);
    const [showModal, setShowModal] = useState <boolean>(false)
    const [showBtn, setShowBtn] = useState<boolean>(false)
    const [comPlete, setComplete] = useState <boolean>(false)
    const [idPrescription, setIdPrescription] = useState <string>('')

    useEffect(() => {
        const dataLocal = sessionStorage.getItem('ThongTinBenhNhanDangKham');
        if(dataLocal){
            const data = JSON.parse(dataLocal)
            setPatientDataForForm(data)
        }
    }, []);



    const fetchPrescriptionDetails = async (prescriptionId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/Donthuoc_Chitiet/LayTheoDonThuoc/${prescriptionId}`);
            if (response.ok) {
                const data = await response.json();
                console.log(data);

                setPrescriptionDetails(data || []);
            } else {
                console.error('Failed to retrieve prescription details');
            }
        } catch (error) {
            console.error('Error fetching prescription:', error);
        }
    };


    const CheckRender = async () => {
    console.log("CheckRender đang chạy");
    const resCheckPrescription = await CheckPrescription(id as string);
    console.log("Kết quả CheckPrescription:", resCheckPrescription);
    if (!resCheckPrescription.status) {
        console.log("Gọi fetchPrescriptionDetails với ID:", resCheckPrescription.data._id);
        setIdPrescription(resCheckPrescription.data._id || '')
        fetchPrescriptionDetails(resCheckPrescription.data._id);
        setShowBtn(true)
    }else{
        console.log(resCheckPrescription)
        if(resCheckPrescription.data !== null){
            fetchPrescriptionDetails(resCheckPrescription.data.data._id);
            setComplete(true)
        }   
            // Ẩn nút thêm thuốc
            setShowBtn(false)
        
        
    }
};


    useEffect(() => {
        CheckRender();
    }, []);


    const handleDeleteMedicine = (id: string) => {
        deleteMedicine(id as string);
        setPrescriptionDetails(prescriptionDetails.filter(detail => detail._id !== id));
    }

    const HandleSuccess = async() =>{
       const data = await confirmPrescriptionCompletion(
            idPrescription
        )
        console.log(data)
        setShowModal(false)
        setComplete(true)
        reload()
    }

    const showModalHandleSuccess = ()=>{
        setShowModal(true)
    }


    return (
        <div className="p-4 Prescription-container">
            <button
                style={!comPlete?{
                    userSelect:'none',
                    pointerEvents:'none',
                    color:'gray',
                    border:'1px solid gray'
                }:{}}
                onClick={() => setIsDonThuocModalOpen(true)}
                className="Prescription-printBtn"
            >
               <BsFillPrinterFill /> Đơn thuốc
            </button>
            <div className="overflow-x-auto rounded-lg bg-white">
                {prescriptionDetails.length > 0 ? (

                    <>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100 text-gray-700 font-semibold text-left">
                                <tr>
                                    <th className="px-4 py-2">Tên thuốc</th>
                                    <th className="px-4 py-2">Đơn vị</th>
                                    <th className="px-4 py-2">Số lượng</th>
                                    <th className="px-4 py-2">Lưu ý</th>
                                    <th className="px-4 py-2">Cách sử dụng</th>
                                    <th className="px-4 py-2">Giá mỗi đơn vị</th>
                                    <th className="px-4 py-2">Giá tổng</th>
                                    <th className="px-4 py-2">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-600 divide-y divide-gray-200">
                                {prescriptionDetails.map((item) => (
                                    <tr key={item._id} className="hover:bg-gray-50">

                                        <td className="px-4 py-2 font-medium text-gray-800">{item.Id_Thuoc?.TenThuoc}</td>
                                        <td className="px-4 py-2">{item.DonVi || item.Id_Thuoc?.DonVi}</td>
                                        <td className="px-4 py-2">{item.SoLuong}</td>
                                        <td className="px-4 py-2">{item.NhacNho}</td>
                                        <td className="px-4 py-2">Sử dụng theo hướng dẫn</td>
                                        <td className="px-4 py-2 font-semibold">
                                            {formatCurrencyVND(item.Id_Thuoc?.Gia)}
                                        </td>
                                        <td className="px-4 py-2 font-semibold">
                                            {formatCurrencyVND(item.Id_Thuoc?.Gia * item.SoLuong)}
                                        </td>
                                        <td className="px-4 py-2 text-red-500 hover:text-red-700">
                                            
                                            <button
                                              onClick={() => handleDeleteMedicine (item._id)}
                                              className='cursor-pointer'
                                              style={comPlete?{
                                                backgroundColor:'gray',
                                                color:'white',
                                                userSelect:'none',
                                                pointerEvents:'none',
                                                padding:'4px 13px',
                                                borderRadius:'8px',
                                                display:'flex',
                                                gap:8,
                                                alignItems:'center',
                                              }:{
                                                backgroundColor:'red',
                                                color:'white',
                                                padding:'4px 13px',
                                                borderRadius:'8px',
                                                display:'flex',
                                                gap:8,
                                                alignItems:'center',
                                              }
                                              
                                            }
                                            ><i className="bi bi-trash3-fill text-lg"
                                              style={{
                                                fontSize:14
                                              }}
                                            ></i> Xóa</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex justify-end gap-4 mt-4">
                            {comPlete ? <>
                                <button className="Prescription-medicine__container__MedicineActions__completeButton"
                                onClick={showModalHandleSuccess}
                                style={{
                                    backgroundColor:'#00d335',
                                    display:'flex',
                                    alignItems:'center',
                                    gap:10,
                                    pointerEvents:'none',
                                    userSelect:'none'
                                }}
                                ><FaCheck /> Đã hoàn thành</button>

                            </>:<>
                                <button className="Prescription-medicine__container__MedicineActions__addButton" onClick={onAddMedicineClick}>+ Thêm thuốc</button>
                                <button className="Prescription-medicine__container__MedicineActions__completeButton"
                                onClick={showModalHandleSuccess}
                                >Hoàn thành</button>
                            </>}
                            
                        </div>
                    </>
                ) : (
                    <>
                      <NoData
                        message="Chưa chọn thuốc!"
                        remind="Vui lòng chọn thuốc để hoàn thành đơn thuốc"
                    />
                        {showBtn ? 
                            <>  <div className="flex justify-end gap-4 mt-4">
                                <button className="Prescription-medicine__container__MedicineActions__addButton" onClick={onAddMedicineClick}>+ Thêm thuốc</button>
                                <button className="Prescription-medicine__container__MedicineActions__completeButton"
                                    style={
                                        {
                                            backgroundColor:'gray',
                                            pointerEvents:'none',
                                            userSelect:'none'
                                        }
                                    }     
                                >Hoàn thành</button>
                            </div>
                            </>
                        
                        :''}
                   
                    </>
                  
                )}
            </div>
            {isDonThuocModalOpen && patientDataForForm && (
                <PreviewExaminationForm
                    isOpen={isDonThuocModalOpen}
                    onClose={() => setIsDonThuocModalOpen(false)}
                    patientData={patientDataForForm}
                    prescriptionMedicines={prescriptionDetails}
                />
            )}

            <ModalComponent Data_information={{
                content:'Xác nhận hoàn thành đơn thuốc',
                callBack:HandleSuccess,
                handleClose:()=>{setShowModal(false)},
                handleShow:()=>{setShowModal(true)},
                show:showModal
            }}></ModalComponent>
        </div>
    );
}