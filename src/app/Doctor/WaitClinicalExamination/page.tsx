'use client';
import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import "../Patient/Patient.css";
import { useEffect, useState } from "react";
import { searchPatientsByDoctor } from "@/app/services/DoctorSevices";
import { useRouter } from "next/navigation";
import { MedicalExaminationCard } from "@/app/types/patientTypes/patient";
import moment from "moment";
import { FaNotesMedical } from "react-icons/fa";
import NoData from "@/app/components/ui/Nodata/Nodata";
import Pagination from "@/app/components/ui/Pagination/Pagination";

export default function WaitClinicalExamination() {
  const [dataRender, setDataRender] = useState<MedicalExaminationCard[]>([]);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  const handleExamination = (id: string) => {
    router.push(`/Doctor/Patient/ToExamine/${id}?WaitClinicalExamination=true`);
  };

  const loadPatients = async () => {
    const res = await searchPatientsByDoctor({
      idBacSi: "6807397b4a1e320062ce2b20",
      trangThai: false,
      trangThaiHoatDong: "XetNghiem",
      soDienThoai: phone,
      hoVaTen: name,
      page: currentPage,
      limit: 7,
    });
    setDataRender(res?.data || []);
    setTotalPages(res?.totalPages || 1);
  };

  useEffect(() => {
    loadPatients();
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    loadPatients();
  };

  return (
    <>
      <Tabbar
        tabbarItems={{
          tabbarItems: [
            { text: "Danh sách chờ xét nghiệm", link: "/Doctor/WaitClinicalExamination" }
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
                onChange={(e) => setPhone(e.target.value)}
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
                onChange={(e) => setName(e.target.value)}
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
                {dataRender.map((record) => (
                  <tr key={record._id}>
                    <td>{record.Id_TheKhamBenh?.HoVaTen || ""}</td>
                    <td>{record.Id_TheKhamBenh?.SoDienThoai || ""}</td>
                    <td>{record.Id_TheKhamBenh?.SDT_NguoiThan || ""}</td>
                    <td>{record.Id_TheKhamBenh?.SoCCCD || ""}</td>
                    <td>
                      {moment(record.Gio, "HH:mm:ss").format("hh:mm:ss A")}
                    </td>
                    <td>
                      <div className="tatusTable blue">Chờ xét nghiệm</div>
                    </td>
                    <td>
                      <button
                        className="button--blue"
                        onClick={() => handleExamination(record._id)}
                      >
                        <FaNotesMedical /> Tiếp tục khám
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
          <NoData />
        )}
      </div>
    </>
  );
}
