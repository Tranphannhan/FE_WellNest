"use client";
import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import "../Patient.css";
import { useEffect, useState } from "react";
import {
  getAllPatient,
  searchPatientsByDoctor,
} from "@/app/services/DoctorSevices";
import { useRouter } from "next/navigation";
import { MedicalExaminationCard } from "@/app/types/patientTypes/patient";
import moment from "moment";
import { FaNotesMedical } from "react-icons/fa";
import NoData from "@/app/components/ui/Nodata/Nodata";
import Pagination from "@/app/components/ui/Pagination/Pagination";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

export default function ListPatientsMissed() {
  const [dataRender, setDataRender] = useState<MedicalExaminationCard[]>([]);
  const [phone, setPhone] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [currentPage, setCurrentPage]= useState <number>(1)
  const [totalPages, setTotalPages] = useState <number>(1)
  const router = useRouter();
  function handleExamination(id: string) {
    router.push(`/Doctor/Patient/ToExamine/${id}`);
  }

 async function handleSearch() {
  const token = Cookies.get("token");
  if (!token) return;
  const decoded = jwtDecode<{ _id: string }>(token);
  const idBacSi = decoded?._id;

  const data = await searchPatientsByDoctor({
    idBacSi,
    soDienThoai: phone,
    trangThaiHoatDong: "BoQua",
    hoVaTen: name,
    page: currentPage,
  });
  if (data) {
    setDataRender(data.data);
    setTotalPages(data.totalPages);
    setCurrentPage(data.currentPage);
  }
}

const LoaddingPatient = async () => {
  const token = Cookies.get("token");
  if (!token) return;
  const decoded = jwtDecode<{ _id: string }>(token);
  const idBacSi = decoded?._id;

  const Data = await getAllPatient(idBacSi, false, "BoQua", currentPage);
  console.log(Data);
  setDataRender(Data.data);
  setTotalPages(Data.totalPages);
  setCurrentPage(1);
};


    useEffect(() => {
    if (phone || name) {
        handleSearch();
    } else {
        LoaddingPatient();
    }
    }, [currentPage]);


  return (
    <>
      <Tabbar
        tabbarItems={{
          tabbarItems: [
            { text: "Thông tin bệnh nhân", link: "/Doctor/Patient" },
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
        <div className="search-reception-container">
          <div className="search-box-wrapper">
            <div className="search-box">
              <input
                type="text"
                placeholder="Hãy nhập số điện thoại"
                className="search-input"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
              />
              <button className="search-btn" onClick={handleSearch}>
                <i className="bi bi-search"></i>
              </button>
            </div>
            <div className="search-box">
              <input
                type="text"
                placeholder="Hãy nhập tên"
                className="search-input"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <button className="search-btn" onClick={handleSearch}>
                <i className="bi bi-search"></i>
              </button>
            </div>
          </div>
        </div>
        {dataRender.length > 0 ? (
            <>
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
                        Đã bỏ qua
                      </div>
                    }
                  </td>
                  <td>
                    <button
                      className="button--blue"
                      onClick={() => {
                        handleExamination(record._id);
                      }}
                    >
                      <FaNotesMedical />
                      Khám
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination 
          
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
        />
            </>
         
        ) : (
          <NoData></NoData>
        )}
      </div>
    </>
  );
}
