'use client'
import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import '../Patient.css'
import { doctorTemporaryTypes } from "@/app/types/doctorTypes/doctorTemporaryTypes";
import { useEffect, useState } from "react";
import { getAllPatient } from "@/app/services/DoctorSevices";
import { useRouter } from "next/navigation";


export default function ListPatientsMissed(){
    const [dataRender , setDataRender] = useState <doctorTemporaryTypes []> ([]);
    const router = useRouter()
    function handleExamination(id:string){
        router.push(`/Doctor/Patient/ToExamine/${id}`)
    }

    const LoaddingPatient = async () => {
        const Data = await getAllPatient ('6807397b4a1e320062ce2b20' , false , 'BoQua');
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
                            <th>STT</th>
                            <th>Họ và tên</th>
                            <th>SĐT</th>
                            <th>Số Bảo Hiểm Y Tế</th>
                            <th>Số Căn Cước</th>
                            <th>Ngày</th>
                            <th>SĐT người thân</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>


                    <tbody>
                        {dataRender.map((record: doctorTemporaryTypes) => (
                            <tr key={record._id}>
                                <td>{record.STTKham}</td>
                                <td>{record.Id_TheKhamBenh.HoVaTen}</td>
                                <td>{record.Id_TheKhamBenh.SoDienThoai}</td>
                                <td>{record.Id_TheKhamBenh.SoBaoHiemYTe}</td>
                                <td>{record.Id_TheKhamBenh.SoCCCD}</td>
                                <td>{record.Ngay}</td>
                                <td>{record.Id_TheKhamBenh.SDT_NguoiThan}</td>
                                <td>
                                    <button className="btn-primary"
                                        onClick={
                                           ()=>{
                                             handleExamination(record._id)
                                           }
                                        }
                                    >Khám</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
    </table>
</div>
</>
    )}
