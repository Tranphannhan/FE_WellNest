"use client";
import React, { useState, useEffect } from "react";
import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import "./ChooseRoom.css";
import Link from "next/link";
import Example from "./notificationChooseRoom";
import { getAllChooseRooms } from "@/app/services/ReceptionServices";
import { showToast, ToastType } from "@/app/lib/Toast";
import { receptionTemporaryDoctorTypes } from "@/app/types/receptionTypes/receptionTemporaryTypes";
import { useRouter } from "next/navigation";
import Pagination from "@/app/components/ui/Pagination/Pagination";
import NoData from "@/app/components/ui/Nodata/Nodata";
import { Badge } from "antd";
import { GiClick } from "react-icons/gi";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface createExaminationCardInformationType {
  Id_TheKhamBenh?: string;
  Id_Bacsi?: string;
  Id_NguoiTiepNhan?: string;
  Id_GiaDichVu?: string;
  LyDoDenKham?: string;
}

export default function ChooseRoom() {
  const [show, setShow] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPagas] = useState<number>(1);
  const [nameDepartment, setNameDepartment] = useState<string>("");
  const [vitalSigns, setVitalSigns] = useState<{
    height?: string;
    weight?: string;
  }>({});
  const [examinationCardInformation, setExaminationCardInformation] =
    useState<createExaminationCardInformationType>({});
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const [valueChooseRom, setValueChooseRom] = useState({
    name: "",
    roomNumber: 0,
  });

  async function HandleCreate() {
    try {
      console.log("Dữ liệu gửi đi:");
      console.log(examinationCardInformation);

      // Gửi yêu cầu tạo phiếu khám bệnh
      const response = await fetch(`${API_BASE_URL}/Phieu_Kham_Benh/Add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(examinationCardInformation),
      });

      if (!response.ok) {
        showToast("Tạo phiếu khám bệnh thất bại!", ToastType.error);
        return;
      }

      const resultResponseExaminationData = await response.json();
      const result = resultResponseExaminationData.data;
      console.log("Thông tin phiếu khám bệnh trả về", result);
      const idPhieuKhamBenh = result._id;

      if (!idPhieuKhamBenh) {
        showToast("Không nhận được ID phiếu khám bệnh!", ToastType.error);
        return;
      }

      const examinationData = {
        Id_PhieuKhamBenh: idPhieuKhamBenh,
        fullName: result.Id_TheKhamBenh?.HoVaTen || "Không có",
        cccd: result.Id_TheKhamBenh?.SoCCCD || "Không có",
        dob: result.Id_TheKhamBenh?.NgaySinh || "Không có",
        phone: result.Id_TheKhamBenh?.SoDienThoai || "Không có",
        gender: result.Id_TheKhamBenh?.GioiTinh || "Không có",
        height: vitalSigns.height || "Không có",
        weight: vitalSigns.weight || "Không có",
        clinic: result.Id_Bacsi?.Id_PhongKham?.SoPhongKham || "Không có",
        department: nameDepartment || "Không có",
        address: result.Id_TheKhamBenh?.DiaChi || "Không có",
        reason: result.LyDoDenKham || "Không có",
        price: result.Id_GiaDichVu.Giadichvu || 0,
        QueueNumber: 0,
      };

      // Chuẩn bị payload chỉ số sinh tồn
      const payload: Record<string, string> = {
        Id_PhieuKhamBenh: idPhieuKhamBenh,
      };

      if (typeof vitalSigns.weight === "string" && vitalSigns.weight.trim()) {
        payload.CanNang = vitalSigns.weight.trim();
      }

      if (typeof vitalSigns.height === "string" && vitalSigns.height.trim()) {
        payload.ChieuCao = vitalSigns.height.trim();
      }

      if (!payload.CanNang && !payload.ChieuCao) {
        showToast("Không có dữ liệu chỉ số sinh tồn để gửi!", ToastType.warn);
      }
        // Gửi chỉ số sinh tồn nếu có
        const responseVitalSigns = await fetch(
          `${API_BASE_URL}/Chi_So_Sinh_Ton/Add`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!responseVitalSigns.ok) {
          showToast("Thêm chỉ số sinh tồn thất bại!", ToastType.error);
          return;
        }

        const resultVitalSigns = await responseVitalSigns.json();
        console.log("Thêm chỉ số sinh tồn thành công:", resultVitalSigns);
    

      // Thành công toàn bộ
      showToast("Tạo phiếu khám bệnh thành công!", ToastType.success);
      setShow(false);
      sessionStorage.setItem(
        "ThongTinPhieuKham",
        JSON.stringify(examinationData)
      );
      router.push("/Receptionist/Reception/ExaminationForm");
    } catch (error) {
      console.error("Lỗi trong quá trình xử lý:", error);
      showToast(
        "Đã xảy ra lỗi trong quá trình tạo phiếu khám!",
        ToastType.error
      );
    }
  }

  const handleSetValue = (name: string, roomNumber: number) => {
    setValueChooseRom({
      name: name,
      roomNumber: roomNumber,
    });
    setShow(true);
  };

  const [dataChooseRoom, setDataChooseRoom] = useState<
    receptionTemporaryDoctorTypes[]
  >([]);
  useEffect(() => {
    const initData = async () => {
      try {
        // Lấy token từ cookie
        const token = Cookies.get("token");
        if (!token) {
          showToast("Không tìm thấy token", ToastType.error);
          return;
        }

        const decoded = jwtDecode<{ _id: string }>(token);
        const idNguoiTiepNhan = decoded._id;

        // Tiếp tục xử lý dữ liệu localStorage như cũ
        const thongTinTiepNhanRaw = sessionStorage.getItem("thongTinTiepNhan");
        const soKhamBenhRaw = sessionStorage.getItem("soKhamBenh");

        if (!thongTinTiepNhanRaw || !soKhamBenhRaw) {
          showToast("Thiếu dữ liệu tiếp nhận hoặc bệnh nhân", ToastType.error);
          return;
        }

        const thongTinTiepNhan = JSON.parse(thongTinTiepNhanRaw);
        const soKhamBenh = JSON.parse(soKhamBenhRaw);

        if (!soKhamBenh._id) {
          showToast("Chưa có mã sổ khám bệnh", ToastType.error);
          return;
        }

        setExaminationCardInformation((prev) => ({
          ...prev,
          Id_TheKhamBenh: soKhamBenh._id,
          Id_GiaDichVu: "683420eb8b7660453369dce1",
          Id_NguoiTiepNhan: idNguoiTiepNhan, // ✅ sử dụng từ token
          LyDoDenKham: thongTinTiepNhan.Reason,
        }));

        setVitalSigns({
          height: String(thongTinTiepNhan.height || ""),
          weight: String(thongTinTiepNhan.Weight || ""),
        });

        setNameDepartment(thongTinTiepNhan.Department.name);

        const response = await getAllChooseRooms(
          thongTinTiepNhan.Department._id,
          currentPage
        );
        if (response) {
          setDataChooseRoom(response.data);
          setTotalPagas(response.totalPages);
        }
      } catch (error) {
        showToast("Đã có lỗi xảy ra khi tải dữ liệu", ToastType.error);
        console.error(error);
      }
    };

    initData();
  }, [currentPage]);

  return (
    <>
      <Example
        Data_information={{
          name: valueChooseRom.name,
          roomNumber: valueChooseRom.roomNumber,
          handleClose,
          handleShow,
          show,
          callBack: HandleCreate,
        }}
      />

      <Tabbar
        tabbarItems={{
          tabbarItems: [
            { text: "Chọn phòng", link: "/Receptionist/Reception/ChooseRoom" },
          ],
        }}
      ></Tabbar>

      <div className="chooseRoom-container">
        <h1 className="chooseRoom-container__title">
          Danh sách phòng khoa:
          <span className="chooseRoom-container__title2">
            {" "}
            {nameDepartment}
          </span>
          <Link href="/Receptionist/Reception/PatientInformation">
            <button className="chooseRoom-container__button">Quay lại</button>
          </Link>
        </h1>

        {dataChooseRoom.length > 0 ? (
          <>
            <table className="chooseRoom-container__table  min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100 text-gray-700 text-sm font-semibold text-left">
                <tr>
                  <th>Tên bác sĩ</th>
                  <th>Số phòng</th>
                  <th>Số lượng bệnh nhân</th>
                  <th>Thời gian dự tính</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {dataChooseRoom.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{ textAlign: "center", padding: "16px" }}
                    >
                      Chưa có dữ liệu
                    </td>
                  </tr>
                ) : (
                  dataChooseRoom.map(
                    (doctor: receptionTemporaryDoctorTypes, index: number) => {
                      const totalMinutes = doctor.SoNguoiDangKham * 15;

                      const formatTime = (minutes: number) => {
                        if (minutes < 60) return `${minutes} phút`;
                        const hours = Math.floor(minutes / 60);
                        const mins = minutes % 60;
                        return mins === 0
                          ? `${hours} tiếng`
                          : `${hours} tiếng ${mins} phút`;
                      };
                      const isFull = doctor.SoNguoiDangKham === 10;

                      return (
                        <tr key={index}>
                          <td>{doctor.TenBacSi}</td>
                          <td>
                            {doctor.Id_PhongKham?.SoPhongKham || "Không rõ"}
                          </td>
                          <td
                            style={{
                              fontWeight: 600,
                              color:
                                doctor.SoNguoiDangKham < 4
                                  ? "#00ce0"
                                  : doctor.SoNguoiDangKham < 8
                                    ? "orange"
                                    : "red",
                            }}
                          >
                            {doctor.SoNguoiDangKham + "/10"} bệnh nhân
                          </td>
                          <td>{formatTime(totalMinutes)}</td>
                          <td>
                            <Badge
                              className="custom-badge"
                              style={
                                doctor.SoNguoiDangKham < 4
                                  ? { backgroundColor: "rgb(179 255 229)" }
                                  : doctor.SoNguoiDangKham < 8
                                    ? { backgroundColor: "rgb(255 239 163)" }
                                    : {
                                        backgroundColor: "rgb(255 136 128)",
                                      }
                              }
                              status={
                                doctor.SoNguoiDangKham < 4
                                  ? "success"
                                  : doctor.SoNguoiDangKham < 8
                                    ? "warning"
                                    : "error"
                              }
                              text={
                                doctor.SoNguoiDangKham < 4
                                  ? "Ít bệnh nhân"
                                  : doctor.SoNguoiDangKham < 8
                                    ? "Trung bình"
                                    : "Quá tải"
                              }
                            />
                          </td>

                          <td>
                            {
                              <button
                                disabled={isFull}
                                onClick={() => {
                                  if (isFull) {
                                    showToast("Phòng đã đầy", ToastType.error);
                                  } else {
                                    handleSetValue(
                                      doctor.TenBacSi,
                                      Number(doctor.Id_PhongKham?.SoPhongKham)
                                    );
                                    setExaminationCardInformation((prev) => ({
                                      ...prev,
                                      Id_Bacsi: doctor._id,
                                    }));
                                  }
                                }}
                                className="button--blue"
                                style={{
                                  background: isFull ? "#313131" : "",
                                  cursor: isFull ? "not-allowed" : "pointer",
                                }}
                              >
                                <GiClick />
                                {isFull ? "Đã đầy" : "Chọn phòng"}
                              </button>
                            }
                          </td>
                        </tr>
                      );
                    }
                  )
                )}
              </tbody>
            </table>

            <div className="SearchReception-pagination">
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        ) : (
          <>
            <NoData
              message="Không có dữ liệu bác sĩ"
              remind="Vui lòng liên hệ bệnh viện số: 0933750634"
            ></NoData>
          </>
        )}
      </div>
    </>
  );
}
