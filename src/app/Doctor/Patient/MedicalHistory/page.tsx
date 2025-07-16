"use client";
import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import "../Patient.css";
import { useEffect, useState } from "react";
import { searchPatientsByDoctor } from "@/app/services/DoctorSevices";
import { useRouter } from "next/navigation";
import moment from "moment";
import { MedicalExaminationCard } from "@/app/types/patientTypes/patient";
import { FaEye } from "react-icons/fa";
import NoData from "@/app/components/ui/Nodata/Nodata";
import Pagination from "@/app/components/ui/Pagination/Pagination";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";


export default function Patient() {
  const [dataRender, setDataRender] = useState<MedicalExaminationCard[]>([]);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  function handleExamination(id: string) {
    router.push(`/Doctor/Patient/ToExamine/${id}`);
  }

const loadPatients = async () => {
  const token = Cookies.get("token");
  if (!token) return;
  const decoded = jwtDecode<{ _id: string }>(token);
  const idBacSi = decoded?._id;

  const res = await searchPatientsByDoctor({
    idBacSi,
    trangThai: true,
    trangThaiThanhToan: true,
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
    setCurrentPage(1); // reset về trang đầu tiên khi tìm
    loadPatients();
  };

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
                {dataRender.map((record) => (
                  <tr key={record._id}>
                    <td>{moment(record.Gio, "HH:mm:ss").format("hh:mm:ss A")}</td>
                    <td>
                      {moment(record.GioKetThucKham, "HH:mm:ss").format(
                        "hh:mm:ss A"
                      )}
                    </td>
                    <td>{record.Id_TheKhamBenh?.HoVaTen}</td>
                    <td>{record.Id_TheKhamBenh?.SoDienThoai}</td>
                    <td>{record.Id_TheKhamBenh?.SDT_NguoiThan}</td>
                    <td>{record.Id_TheKhamBenh?.SoCCCD}</td>
                    <td>
                      <button
                        className="button--viewDetail"
                        style={{ color: "#3497F9" }}
                        onClick={() => handleExamination(record._id)}
                      >
                        <FaEye /> Xem Chi Tiết
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
