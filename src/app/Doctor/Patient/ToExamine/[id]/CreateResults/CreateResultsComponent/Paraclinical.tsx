"use client";
import { useCallback, useEffect, useState } from "react";
import "./Paraclinical.css";
import { DoctorTemporaryTypes } from "@/app/types/doctorTypes/doctorTestTypes";
import {
  deleteDoctorTemporaryTypes,
  getDoctorTemporaryTypes,
  getExaminationResults,
  latestDiagnosis,
  testConfirmation,
  waitingForTesting,
} from "@/app/services/DoctorSevices";
import { formatCurrencyVND } from "@/app/lib/Format";
import { useParams, useRouter } from "next/navigation";
import NoData from "@/app/components/ui/Nodata/Nodata";
import PrintAppointmentForm from "../ComponentResults/ComponentPrintTicket/PrintAppointmentForm";
import { BsFillPrinterFill } from "react-icons/bs";
import { FaDotCircle, FaEye } from "react-icons/fa";
import { AiFillExclamationCircle } from "react-icons/ai";
import DoNotContinue from "@/app/components/ui/DoNotContinue/DoNotContinue";
import ModalComponent from "@/app/components/shared/Modal/Modal";

export interface ServiceItem {
  stt: number;
  name: string;
  quantity: number;
  unitPrice: number;
  performer: string;
  room: string;
}

export interface ExaminationFormForPrint {
  fullName: string;
  gender: string;
  dob: string;
  address: string;
  department: string;
  clinic: string;
  diagnosis: string;
  serviceList: ServiceItem[];
}

export interface PrintAppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  patientData: ExaminationFormForPrint;
  diagnosticianName: string;
  departmentName: string;
}

export default function ParaclinicalComponent() {
  const [data, setData] = useState<DoctorTemporaryTypes[]>([]);
  const { id } = useParams();
  const [isPhieuChiDinhModalOpen, setIsPhieuChiDinhModalOpen] = useState(false);
  const [patientData, setPatientData] =
    useState<ExaminationFormForPrint | null>(null);
  const [diagnosticianName, setDiagnosticianName] = useState<string>("");
  const [departmentName, setDepartmentName] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const router = useRouter();

  const allConfirmed =
    data.length > 0
      ? data.every((item) => item.TrangThaiHoatDong === true)
      : false;

  const [continueRender, setContinueRender] = useState<boolean>(false);
  const checkRender = async () => {
    const data = await latestDiagnosis(id as string);
    console.log(data);
    if (data.continueRender) {
      setContinueRender(true);
    }
  };

  // Effect để tải dữ liệu bệnh nhân từ sessionStorage chỉ một lần khi component mount
  useEffect(() => {
    checkRender();
    const sessionData = sessionStorage.getItem("ThongTinBenhNhanDangKham");
    if (sessionData) {
      const parsedData = JSON.parse(sessionData);
      setPatientData({
        fullName: parsedData.Id_TheKhamBenh.HoVaTen,
        gender: parsedData.Id_TheKhamBenh.GioiTinh,
        dob: parsedData.Id_TheKhamBenh.NgaySinh,
        address: parsedData.Id_TheKhamBenh.DiaChi,
        department: parsedData.Id_Bacsi.ChuyenKhoa,
        clinic: parsedData.Id_Bacsi.Id_PhongKham.SoPhongKham,
        diagnosis: "",
        serviceList: [],
      });
      setDiagnosticianName(parsedData.Id_Bacsi.TenBacSi);
      setDepartmentName(parsedData.Id_Bacsi.ChuyenKhoa);
    }
  }, []); // <-- Chỉ chạy một lần khi component mount

  // Load examination results (for diagnosis)
  // Sử dụng useCallback để memoize hàm và tránh re-render không cần thiết
  const loadDiagnosis = useCallback(async () => {
    try {
      const result = await getExaminationResults(String(id));
      if (result) {
        setPatientData((prev) =>
          prev ? { ...prev, diagnosis: result.KetQua || "" } : prev
        );
      }
    } catch (err) {
      console.error("Lỗi khi load kết quả khám:", err);
    }
  }, [id]); // Phụ thuộc vào `id`

  // Load paraclinical data
  // Sử dụng useCallback để memoize hàm và tránh re-render không cần thiết
  const loadData = useCallback(async () => {
    try {
      const result = await getDoctorTemporaryTypes(id as string);
      if (!result || !Array.isArray(result)) {
        console.error("Không tìm thấy dữ liệu cận lâm sàng");
        return;
      }

      console.log('dữ liệu xét nghiệm', result)
      setData(result);
      // Cập nhật serviceList trong patientData.
      // Cần đảm bảo patientData đã có giá trị trước khi cập nhật serviceList.
      setPatientData((prev) => {
        if (!prev) return prev; // Nếu prev là null, không làm gì cả
        const serviceList: ServiceItem[] = result
          .filter((item) => item.TrangThaiHoatDong === true)
          .map((item, index) => ({
            stt: index + 1,
            name: item.Id_LoaiXetNghiem.TenXetNghiem,
            quantity: item.SoLuong || 1,
            unitPrice: item.Id_LoaiXetNghiem.Id_GiaDichVu.Giadichvu,
            performer: item.Id_LoaiXetNghiem.Id_PhongThietBi.TenPhongThietBi,
            room: item.Id_LoaiXetNghiem.Id_PhongThietBi.SoPhong || "",
          }));
        return { ...prev, serviceList };
      });
    } catch (err) {
      console.error("Lỗi khi load cận lâm sàng:", err);
    }
  }, [id]); // Phụ thuộc vào `id`

  const handleComfirm = async (id: string) => {
    const data = await testConfirmation(id);
    if (data) {
      setData((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, TrangThaiHoatDong: true } : item
        )
      );
      await loadData();
    }
  };

  const completeDesignation = async () => {
    const res = await waitingForTesting(id as string);
    if (res) {
      router.push("http://localhost:3000/Doctor/WaitClinicalExamination");
    }
  };

  useEffect(() => {
    if (id) {
      loadDiagnosis();
      loadData();
    }
  }, [id, loadDiagnosis, loadData]); // <-- Phụ thuộc vào `id` và các hàm được memoize

  const deleteParaclinical = useCallback(
    async (itemId: string) => {
      await deleteDoctorTemporaryTypes(itemId);
      await loadData(); // <-- Gọi lại API đồng bộ hơn, tránh rối
    },
    [loadData]
  );

  return (
    <div className="Paraclinical-Body">
      {" "}
      <button
        onClick={() => setIsPhieuChiDinhModalOpen(true)}
        disabled={!allConfirmed}
        style={
          !allConfirmed
            ? {
                color: "gray",
                border: "1px solid gray",
                cursor: "not-allowed",
              }
            : {}
        }
        className="Paraclinical-printBtn"
      >
        <BsFillPrinterFill /> Chỉ định xét nghiệm
      </button>
      <div className="Paraclinical-medicine__container">
        {continueRender ? (
          data.length > 0 ? (
            <>
              <table className="Paraclinical-medicine__container__medicineTable min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100 text-gray-700 text-sm font-semibold text-left">
                  <tr>
                    <th>Tên phòng thiết bị</th>
                    <th>Tên xét nghiệm</th>
                    <th>Hình ảnh xét nghiệm</th>
                    <th>Giá</th>
                    <th>Trạng thái</th>
                    <th>Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => {
                    const isConfirmed = item.TrangThaiHoatDong === true;
                    const isPaid = item.TrangThaiThanhToan === true;
                    const isDone = item.TrangThai === true;

                    let trangThaiText = "";
                    let trangThaiClass = "";
                    let actionButtons: React.ReactNode = null;

                    if (!isConfirmed) {
                      // Trạng thái 1: Chưa xác nhận
                      trangThaiText = "Chưa xác nhận";
                      trangThaiClass = "Notconfirm";
                      actionButtons = (
                        <>
                          <button
                            onClick={() => handleComfirm(item._id)}
                            className="cursor-pointer"
                            style={{
                              backgroundColor: "#3497f9",
                              color: "white",
                              padding: "4px 13px",
                              borderRadius: "8px",
                              display: "flex",
                              gap: 8,
                              alignItems: "center",
                            }}
                          >
                            <AiFillExclamationCircle /> Xác nhận
                          </button>
                          <button
                            onClick={() => deleteParaclinical(item._id)}
                            className="cursor-pointer"
                            style={{
                              backgroundColor: "red",
                              color: "white",
                              padding: "4px 13px",
                              borderRadius: "8px",
                              display: "flex",
                              gap: 8,
                              alignItems: "center",
                            }}
                          >
                            <i
                              className="bi bi-trash3-fill text-lg"
                              style={{ fontSize: 14 }}
                            ></i>
                          </button>
                        </>
                      );
                    } else if (isConfirmed && !isPaid) {
                      // Trạng thái 2: Chờ thanh toán
                      trangThaiText = "Chờ thanh toán";
                      trangThaiClass = "WaitingPayment";
                      actionButtons = null;
                    } else if (isConfirmed && isPaid && !isDone) {
                      // Trạng thái 3: Đợi xét nghiệm
                      trangThaiText = "Đợi xét nghiệm";
                      trangThaiClass = "WaitingTest";
                      actionButtons = null;
                    } else if (isConfirmed && isPaid && isDone) {
                      // Trạng thái 4: Đã xét nghiệm
                      trangThaiText = "Đã xét nghiệm";
                      trangThaiClass = "DoneTest";
                      actionButtons = (
                        <button
                          onClick={() => alert("Đã có kết quả")}
                          className="button--green"
                        >
                          <FaEye /> Xem kết quả
                        </button>
                      );
                    }

                    return (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td>
                          {
                            item.Id_LoaiXetNghiem.Id_PhongThietBi
                              .TenPhongThietBi
                          }
                        </td>
                        <td>{item.Id_LoaiXetNghiem.TenXetNghiem}</td>
                        <td>
                          <img
                            style={{ width: "67px", height: "40px" }}
                            src={`http://localhost:5000/image/${item.Id_LoaiXetNghiem.Image}`}
                            alt="Hình ảnh xét nghiệm"
                          />
                        </td>
                        <td className="font-semibold" style={{color:'red'}}>
                          {formatCurrencyVND(
                            item.Id_LoaiXetNghiem.Id_GiaDichVu.Giadichvu
                          )}
                        </td>
                        <td>
                          <div
                            className={`Paraclinical-tatus ${trangThaiClass}`}
                          >
                            <FaDotCircle className="dot" />
                            {trangThaiText}
                          </div>
                        </td>
                        <td style={{ display: "flex", gap: 10 }}>
                          {actionButtons}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="Paraclinical-medicine__container__MedicineActions">
                <button
                  className={`bigButton--blue ${allConfirmed || "disabled"}`}
                  disabled={!allConfirmed}
                  onClick={() => {
                    setShowModal(true);
                  }}
                >
                  Hoàn thành
                </button>
              </div>
            </>
          ) : (
            <NoData
              message="Không có chỉ định cận lâm sàng"
              remind="Nếu cần kết quả để chẩn đoán vui lòng chỉ định"
            />
          )
        ) : (
          <DoNotContinue
            message="Chưa có chẩn đoán lâm sàng"
            remind="Vui lòng chẩn đoán để tiếp tục yêu cầu xét nghiệm"
          />
        )}
      </div>
      {isPhieuChiDinhModalOpen && patientData && (
        <PrintAppointmentForm
          isOpen={isPhieuChiDinhModalOpen}
          onClose={() => setIsPhieuChiDinhModalOpen(false)}
          patientData={patientData}
          diagnosticianName={diagnosticianName}
          departmentName={departmentName}
        />
      )}
      <ModalComponent
        Data_information={{
          callBack: completeDesignation,
          content: "Hoàn thành chỉ đinh xét nghiệm",
          remid: "Xác nhận sẽ đưa bệnh nhân qua danh sách chờ",
          show: showModal,
          handleClose: () => {
            setShowModal(false);
          },
          handleShow: () => {
            setShowModal(true);
          },
        }}
      ></ModalComponent>
    </div>
  );
}
