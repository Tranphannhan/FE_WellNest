"use client";
import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import "./Patient.css";
import { useEffect, useState } from "react";
import { getAllPatient, handlingAbsences } from "@/app/services/DoctorSevices";
import { useRouter } from "next/navigation";
import { MedicalExaminationCard } from "@/app/types/patientTypes/patient";
import moment from "moment";
import { FaNotesMedical, FaUserSlash } from "react-icons/fa";
import NoData from "@/app/components/ui/Nodata/Nodata";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

export default function Patient() {
  const [dataRender, setDataRender] = useState<MedicalExaminationCard[]>([]);
  const router = useRouter();
  function handleExamination(id: string) {
    router.push(`/Doctor/Patient/ToExamine/${id}`);
  }

  async function Absences(id: string) {
    const res = await handlingAbsences(id);
    if (res) {
      LoaddingPatient();
    }
  }

  const LoaddingPatient = async () => {
    const token = Cookies.get("token");
    if (!token) return;
    const decoded = jwtDecode<{ _id: string }>(token);
    const idBacSi = decoded?._id;
    const Data = await getAllPatient(
      idBacSi,
      false,
      "Kham",
      1
    );
    console.log(Data);
    setDataRender(Data.data);
  };

  useEffect(() => {
    LoaddingPatient();
  }, []);

  return (
    <>
      <Tabbar
        tabbarItems={{
          tabbarItems: [
            { text: "Danh sách bệnh nhân", link: "/Doctor/Patient" },
            {
              text: "Danh sách bệnh nhân bỏ qua",
              link: "/Doctor/Patient/ListPatientsMissed",
            },
            {
              text: "Lịch sử khám hôm nay",
              link: "/Doctor/Patient/MedicalHistory",
            },
          ],
        }}
      />

      <div className="Patient-container">
        {dataRender.length > 0 ? (
          <table className="Patient-container_table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Họ và tên</th>
                <th>Số điện thoại</th>
                <th>Người thân</th>
                <th>Số Căn Cước</th>
                <th>Thời gian</th>
                <th>Đã vắng</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {dataRender.map((record: MedicalExaminationCard) => (
                <tr key={record._id}>
                  <td>{record.STTKham}</td>
                  <td>{record.Id_TheKhamBenh?.HoVaTen}</td>
                  <td>{record.Id_TheKhamBenh?.SoDienThoai}</td>
                  <td>{record.Id_TheKhamBenh?.SDT_NguoiThan}</td>
                  <td>{record.Id_TheKhamBenh?.SoCCCD}</td>
                  <td>{moment(record.Gio, "HH:mm:ss").format("hh:mm:ss A")}</td>
                  <td>
                    {
                      <div
                        className={
                          record.SoLanKhongCoMat === 0
                            ? "tatusTable green"
                            : record.SoLanKhongCoMat === 1
                              ? "tatusTable yellow"
                              : "tatusTable red"
                        }
                      >
                        {record.SoLanKhongCoMat} đợt
                      </div>
                    }
                  </td>
                  <td style={{ display: "flex", gap: "10px" }}>
                    <button
                      className="button--blue"
                      onClick={() => {
                        handleExamination(record._id || "");
                      }}
                    >
                      <FaNotesMedical />
                      Khám
                    </button>
                    <button
                      className="button--red"
                      onClick={() => {
                        Absences(record._id || "");
                      }}
                    >
                      <FaUserSlash />
                      Không có mặt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <NoData></NoData>
        )}
      </div>
    </>
  );
}
