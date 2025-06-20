'use client'
import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import '../Patient/Patient.css'
import { useEffect, useState } from "react";
import { getAllPatient } from "@/app/services/DoctorSevices";
import { useRouter } from "next/navigation";
import { MedicalExaminationCard } from "@/app/types/patientTypes/patient";
import moment from "moment";
import { FaNotesMedical } from "react-icons/fa";


export default function Patient(){
    const [dataRender , setDataRender] = useState <MedicalExaminationCard []> ([]);
    const router = useRouter()
    function handleExamination(id:string){
        router.push(`/Doctor/Patient/ToExamine/${id}?WaitClinicalExamination=true`)

    }

    const LoaddingPatient = async () => {
        const Data = await getAllPatient ('6807397b4a1e320062ce2b20' , false , 'XetNghiem');
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
                { text: 'Chờ xét nghiệm', link: '/Doctor/WaitClinicalExamination' },
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
                            <th>Họ và tên</th>
                            <th>Số điện thoại</th>
                            <th>Người thân</th>
                            <th>Số Căn Cước</th>
                            <th>Thời gian</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>


                    <tbody>
                        {dataRender.map((record: MedicalExaminationCard) => (
                            <tr key={record._id}>
                                <td>{record.Id_TheKhamBenh.HoVaTen}</td>
                                <td>{record.Id_TheKhamBenh.SoDienThoai}</td>
                                <td>{record.Id_TheKhamBenh.SDT_NguoiThan}</td>
                                <td>{record.Id_TheKhamBenh.SoCCCD}</td>
                                <td>{moment(record.Gio, "HH:mm:ss").format("hh:mm:ss A")}</td>
                                <td>{<div className={record.TrangThaiHoatDong === 'XetNghiem' ? 'tatusTable blue':'tatusTable red'}>Chờ xét nghiệm</div>}</td>
                                <td>
                                    <button className="button--blue"
                                        onClick={
                                           ()=>{
                                             handleExamination(record._id)
                                           }
                                        }
                                    ><FaNotesMedical />Tiếp tục khám</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
    </table>
</div>
</>
    )}
