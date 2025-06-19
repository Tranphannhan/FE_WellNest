'use client'
import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import '../Patient.css'
import { useEffect, useState } from "react";
import { getAllPatient } from "@/app/services/DoctorSevices";
import { useRouter } from "next/navigation";
import moment from "moment";
import { MedicalExaminationCard } from "@/app/types/patientTypes/patient";


export default function Patient(){
    const [dataRender , setDataRender] = useState <MedicalExaminationCard []> ([]);
    const router = useRouter()
    function handleExamination(id:string){
        router.push(`/Doctor/Patient/ToExamine/${id}`)

    }

    const LoaddingPatient = async () => {
        const Data = await getAllPatient ('6807397b4a1e320062ce2b20' , true , '');
        console.log(Data);
        setDataRender (Data.data);
    }

    useEffect (() => {
        LoaddingPatient ();
    }, []);




    return(
        <>
            <Tabbar
            tabbarItems={{
                tabbarItems: [
                { text: 'Thông tin bệnh nhân', link: '/Doctor/Patient' },
                { text: 'Danh sách bệnh nhân bỏ qua', link: '/Doctor/Patient/ListPatientsMissed' },
                { text: 'Lịch sử khám hôm nay', link: '/Doctor/Patient/MedicalHistory' },
                ],
            }}
            />

                <div className="Patient-container">
                    <div className="search-reception-container">
                        <div className="search-box-wrapper">
                            <div className="search-box">
                                <input
                                type="text"
                                placeholder="Hãy nhập số điện thoại"
                                className="search-input"
                                />
                                <button className="search-btn">
                                <i className="bi bi-search"></i>
                                </button>
                            </div>
                            <div className="search-box">
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

                <table className="Patient-container_table">
                    <thead>
                        <tr>
                            <th>Thời gian tiếp nhận</th>
                            <th>Thời gian kết thúc khám</th>
                            <th>Họ và tên</th>
                            <th>Số điện thoại</th>
                            <th>SĐT người thân</th>
                            <th>Số Căn Cước</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>


                    <tbody>
                        {dataRender.map((record: MedicalExaminationCard) => (
                            <tr key={record._id}>
                                        <td>{moment(record.Gio, "HH:mm:ss").format("hh:mm:ss A")}</td>
                                        <td>{moment(record.GioKetThucKham, "HH:mm:ss").format("hh:mm:ss A")}</td>
                                        <td>{record.Id_TheKhamBenh.HoVaTen}</td>
                                        <td>{record.Id_TheKhamBenh.SoDienThoai}</td>
                                        <td>{record.Id_TheKhamBenh.SDT_NguoiThan}</td>
                                        <td>{record.Id_TheKhamBenh.SoCCCD}</td>
                                        <td>
                                            <button
                                                className="patient-viewDetail"
                                                style={{ color: '#3497F9' }}
                                                onClick={() => handleExamination(record._id)}
                                            >
                                                Xem Chi Tiết
                                            </button>
                                            {/* <button className="btn-danger">Không có mặt</button> */}
                                        </td>

                            </tr>
                        ))}
                    </tbody>
                    
    </table>
</div>
</>
    )}
