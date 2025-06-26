'use client';
import '../TestWaitingListDetail.css';
import Tabbar from '@/app/components/shared/Tabbar/Tabbar';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getWaitingForTestDetail } from '@/app/services/LaboratoryDoctor';
import { paraclinicalType } from '@/app/types/patientTypes/patient';
import { FaEye, FaPlus } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import { showToast, ToastType } from '@/app/lib/Toast';
import ViewParaclinicalResults, { NormalTestResult } from '@/app/Doctor/Patient/ToExamine/[id]/CreateResults/CreateResultsComponent/ViewParaclinicalResults';
import { getResultsByRequestTesting } from '@/app/services/DoctorSevices';


export default function PrescriptionDetails() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;
    const [showResultsPopup , SetShowResultsPopup] = useState <boolean> (false);
    const [dataResule , setDataResule] = useState <NormalTestResult []> ([]);
    

    const [value , setValue] = useState <paraclinicalType []> ([])
    const loaddingAPI = async () => {
        const getData = await getWaitingForTestDetail (String (id),null);
        console.log(getData);
        if (!getData) return;
        console.log(getData);
        setValue (getData.data);
    }

    useEffect (() => {
        loaddingAPI ();
    }, []);


    const update = (Id_YeuCauXetNghiem : string , Id_PhieuKhamBenh : string , Id_NguoiXetNghiem : string , TenXetNghiem : string) => {
        if (Id_YeuCauXetNghiem == '' && Id_PhieuKhamBenh === '' && Id_NguoiXetNghiem == '') return showToast('Thiếu id truyền vào', ToastType.warn);
       
        const saveDataLocostorage = {
            TenXetNghiem : TenXetNghiem,
            Id_YeuCauXetNghiem : Id_YeuCauXetNghiem,
            Id_PhieuKhamBenh : Id_PhieuKhamBenh,
            Id_NguoiXetNghiem : Id_NguoiXetNghiem
        }

        
        sessionStorage.setItem('idGenerateTestResult', JSON.stringify(saveDataLocostorage));
        router.push('/LaboratoryDoctor/GenerateTestResults');    
            return  
    }
    

    // View Result
    const handleView = async (id : string) => {
        const getDataResult = await getResultsByRequestTesting (id);
        setDataResule (getDataResult);
        SetShowResultsPopup (true);
    }




    return (
        <>
            <Tabbar
                tabbarItems={{
                    tabbarItems: [
                        { text: 'Chi tiết đơn thuốc', link: `/Cashier/PaymentWaitingList/${id}` },
                    ],
                }}
            />


            {showResultsPopup && <ViewParaclinicalResults dataFromOutside={dataResule} onClose={() => {SetShowResultsPopup (!showResultsPopup)}} />}
            

            <div className="PrescriptionDetails-container">
                {/* Thông tin bệnh nhân */}
                <div className="PrescriptionDetails-container__Box1" style={{height : 'auto' , flex : '1'}}>
                    <h3>Thông tin bệnh nhân</h3>
                    <div className="patient-info" style={{color:'black'}}>
                        <p style={{margin : '8px 0px'}}><strong>Bệnh nhân: </strong>{value[0]?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.HoVaTen || ''}</p>
                        <p style={{margin : '8px 0px'}}><strong>Ngày sinh: </strong>{value[0]?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.NgaySinh || ''}</p>
                        <p style={{margin : '8px 0px'}}><strong>Giới tính: </strong>{value[0]?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.GioiTinh || ''}</p>
                        <p style={{margin : '8px 0px'}}><strong>Ngày: </strong>{value[0]?.Id_PhieuKhamBenh?.Ngay || ''}</p>
                        <p style={{margin : '8px 0px'}}><strong>Số điện thoại: </strong>{value[0]?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.SoDienThoai || ''}</p>
                        <p style={{margin : '8px 0px'}}><strong>Tiền sử bệnh: </strong>{value[0]?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.LichSuBenh || ''}</p>
                        <p style={{margin : '8px 0px'}}>
                            <strong>Lịch sử khám bệnh: </strong>
                            <span style={{color : 'blue' }}> Xem chi tiết</span>
                        </p>
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
                            {value.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.Id_LoaiXetNghiem.TenXetNghiem}</td>
                                    <td>{item.Gio}</td>
                                    <td>{item.Id_PhieuKhamBenh.Id_Bacsi?.TenBacSi}</td>
                                    <td>{item.TrangThai ? 'Đã xét nghiệm' : 'Chưa xét nghiệm'}</td>
                                    <td>
                                        <button 
                                            style={{background: item.TrangThai ? '#00d335' : ''}}

                                            onClick= {() =>
                                                !item.TrangThai
                                                    ? update(item._id, item?.Id_PhieuKhamBenh._id, '68272ec1b4cfad70da81002f' , item.Id_LoaiXetNghiem.TenXetNghiem)
                                                    : handleView (item._id)
                                            }


                                            className='button--blue'
                                        >
                                            {item.TrangThai ? <FaEye /> : <FaPlus/>}
                                            {item.TrangThai ? 'Xem kết quả' : 'Tạo kết quả'}

                                        </button>
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
