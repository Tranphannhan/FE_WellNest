'use client'

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import './ToExamine.css';
import { MedicalExaminationCard } from "@/app/types/patientTypes/patient";
import { fetchMedicalExaminationCardDetail, getDetailMedicalExaminationCard } from "@/app/services/DoctorSevices";
import PopupHistory from "../../HistoryOfEx/PopupHistory";

export default function Patient() {
    const { id } = useParams(); // lấy id từ URL
    const searchParams = useSearchParams();
    const WaitClinicalExamination = searchParams.get('WaitClinicalExamination') === 'true';
    const [data, setData] = useState<MedicalExaminationCard | null>(null);

    const handleRander = async ()=>{
                const res: MedicalExaminationCard | null = await fetchMedicalExaminationCardDetail(id as string);
                if (res) {
                    console.log(res);
                    sessionStorage.setItem("ThongTinBenhNhanDangKham", JSON.stringify(res));
                } else {
                    console.warn("Không lấy được dữ liệu chi tiết phiếu khám bệnh.");
                }
    }

    useEffect(() => {
        if (!id) return;
        handleRander()

        const fetchData = async () => {
            const res = await getDetailMedicalExaminationCard(id as string);
            setData(res);
        };

        fetchData();
    }, [id]);

    return (
        <>  
            {data?.TrangThai?
                <Tabbar
                    tabbarItems={{
                        tabbarItems: [
                            { text: 'Thông tin bệnh nhân', link: `/Doctor/Patient/ToExamine/${id}` } 
                        ],
                    }}
                />:            
                <Tabbar
                    tabbarItems={{
                        tabbarItems: [
                            { text: 'Thông tin bệnh nhân', link: `/Doctor/Patient/ToExamine/${id}` },
                            { text: 'Tạo kết quả', link: `/Doctor/Patient/ToExamine/${id}/CreateResults${WaitClinicalExamination?'?WaitClinicalExamination=true':''}` },
                        ],
                    }}
                />
            }

            <div className="ToExamine-container">
                <h1 className="ToExamine-container__title">Thông tin bệnh nhân</h1>

                {!data ? (
                    <p>Đang tải dữ liệu...</p>
                ) : (
                    <table className="ToExamine-container__table">
                        <tbody>
                            <tr><td>Họ và tên</td><td className={!data.Id_TheKhamBenh?.HoVaTen ? "nodata" : ""}>{data.Id_TheKhamBenh?.HoVaTen || "Không có"}</td></tr>
                            <tr><td>Giới tính</td><td className={!data.Id_TheKhamBenh?.GioiTinh ? "nodata" : ""}>{data.Id_TheKhamBenh?.GioiTinh || "Không có"}</td></tr>
                            <tr><td>Ngày sinh</td><td className={!data.Id_TheKhamBenh?.NgaySinh ? "nodata" : ""}>{data.Id_TheKhamBenh?.NgaySinh || "Không có"}</td></tr>
                            <tr><td>Số điện thoại</td><td className={!data.Id_TheKhamBenh?.SoDienThoai ? "nodata" : ""}>{data.Id_TheKhamBenh?.SoDienThoai || "Không có"}</td></tr>
                            <tr><td>Số CCCD</td><td className={!data.Id_TheKhamBenh?.SoCCCD ? "nodata" : ""}>{data.Id_TheKhamBenh?.SoCCCD || "Không có"}</td></tr>
                            <tr><td>SĐT người thân</td><td className={!data.Id_TheKhamBenh?.SDT_NguoiThan ? "nodata" : ""}>{data.Id_TheKhamBenh?.SDT_NguoiThan || "Không có"}</td></tr>
                            <tr><td>Số BHYT</td><td className={!data.Id_TheKhamBenh?.SoBaoHiemYTe ? "nodata" : ""}>{data.Id_TheKhamBenh?.SoBaoHiemYTe || "Không có"}</td></tr>
                            <tr><td>Địa chỉ</td><td className={!data.Id_TheKhamBenh?.DiaChi ? "nodata" : ""}>{data.Id_TheKhamBenh?.DiaChi || "Không có"}</td></tr>
                            <tr><td>Lý do đến khám</td><td className={!data.LyDoDenKham ? "nodata" : ""}>{data.LyDoDenKham || "Không có"}</td></tr>
                            <tr><td>Lịch sử bệnh</td><td className={!data.Id_TheKhamBenh?.LichSuBenh ? "nodata" : ""}>{data.Id_TheKhamBenh?.LichSuBenh || "Không có"}</td></tr>
                            <tr>
                                <td>Lịch sử khám tại đây</td>
                                <td><PopupHistory /></td>
                            </tr>
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}
