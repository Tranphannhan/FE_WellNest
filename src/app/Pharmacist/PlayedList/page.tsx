"use client";
import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import "../ListofDrugs/ListofDrugs.css";
import React, { useEffect, useState } from "react";
import { prescriptionType } from "@/app/types/patientTypes/patient";
import Link from "next/link";
import NoData from "@/app/components/ui/Nodata/Nodata";
import Pagination from "@/app/components/ui/Pagination/Pagination";
import { SearchPrescriptionByDoctor } from "@/app/services/Cashier";

export default function Prescription() {
  const [dataPrescription, setDataPrescription] = useState<prescriptionType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const loadApi = async (page = 1) => {
    const res = await SearchPrescriptionByDoctor('DaPhatThuoc', false, page, fullName, phoneNumber); // ✅ TrangThai: false, ThanhToan: true
    if (!res) return;
    setDataPrescription(res.data);
    setCurrentPage(res.currentPage);
    setTotalPages(res.totalPages);
  };

  useEffect(() => {
    loadApi();
  }, []);

  const handleSearch = () => {
    loadApi(1); // reset về trang đầu khi tìm kiếm
  };

  return (
    <>
      <Tabbar
        tabbarItems={{
          tabbarItems: [
            { text: "Đơn thuốc chờ phát", link: "/Pharmacist/ListofDrugs" },
            { text: "Đơn thuốc đã phát", link: "/Pharmacist/PlayedList" },
          ],
        }}
      />

      <div className="Prescription-container">
        <div className="Prescription-searchReceptionContainer">
          <div className="Prescription_searchBoxWrapper">
            <div className="Prescription_searchBox">
              <input
                type="text"
                placeholder="Hãy nhập số điện thoại"
                className="search-input"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <button className="search-btn" onClick={handleSearch}>
                <i className="bi bi-search"></i>
              </button>
            </div>

            <div className="Prescription_searchBox">
              <input
                type="text"
                placeholder="Hãy nhập tên"
                className="search-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <button className="search-btn" onClick={handleSearch}>
                <i className="bi bi-search"></i>
              </button>
            </div>
          </div>
        </div>

        {dataPrescription.length > 0 ? (
          <>
            <table className="Prescription-container_table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên đơn thuốc</th>
                  <th>Ngày</th>
                  <th>Bệnh nhân</th>
                  <th>Số Điện Thoại</th>
                  <th>Bác sĩ</th>
                  <th>Hành động </th>
                </tr>
              </thead>

              <tbody>
                {dataPrescription.map((record, index) => (
                  <tr key={record._id}>
                    <td>{(currentPage - 1) * 5 + index + 1}</td>
                    <td>{record?.TenDonThuoc}</td>
                    <td>{record?.Id_PhieuKhamBenh?.Ngay || ""}</td>
                    <td>{record?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.HoVaTen}</td>
                    <td>
                      {record?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.SoDienThoai}
                    </td>
                    <td>{record?.Id_PhieuKhamBenh?.Id_Bacsi?.TenBacSi}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Link href={`/Pharmacist/ListofDrugs/${record._id}`}>
                          <button className="button--green" style={{ marginRight: "10px" }}>
                            <i className="bi bi-eye-fill"></i>
                            Xem chi tiết
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={(page) => loadApi(page)}
            />
          </>
        ) : (
          <NoData />
        )}
      </div>
    </>
  );
}
