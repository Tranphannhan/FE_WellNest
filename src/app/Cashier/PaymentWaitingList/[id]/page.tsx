"use client";
import React, { useEffect, useState } from "react";
import "../PrescriptionDetails.css";
import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { prescriptionType } from "@/app/types/patientTypes/patient";
import {
  getDetailPatientInformation,
  getDetailPrescription,
  confirmPrescriptionPayment,
} from "@/app/services/Cashier";
import { formatCurrencyVND, formatTime } from "@/app/lib/Format";
import { showToast, ToastType } from "@/app/lib/Toast";
import { PrescriptionDetail } from "@/app/Doctor/Patient/ToExamine/[id]/CreateResults/CreateResultsComponent/Prescription";
import ConfirmationNotice from "../../ComponentCashier/ConfirmationNotice";
import MedicineFees from "../../ComponentCashier/MedicineFees";
import payment from "@/app/services/Pay";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PrintIcon from "@mui/icons-material/Print";
import PaymentIcon from "@mui/icons-material/Payment";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  Box,
  Typography,
  Divider,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
} from "@mui/material";
import StatusBadge from "@/app/components/ui/StatusBadge/StatusBadge";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
type MyTokenType = {
  _id: string;
  // ... bạn thêm các field khác nếu cần
};

export default function PrescriptionDetails() {
  const params = useParams();
  const { id } = params;
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = useState<prescriptionType>();
  const [detailedPrescription, setDetailedPrescription] = useState<
    PrescriptionDetail[]
  >([]);
  const [showModal, setShowModal] = useState(false);
  const [dataPendingPayment, setDataPendingPayment] = useState<{
    HoVaTen?: string;
    TongTien?: number;
  }>({});
  const [isMedicineFeesOpen, setIsMedicineFeesOpen] = useState(false);
const [order, setOrder] = useState<"asc" | "desc">("asc");
const [orderBy, setOrderBy] = useState<"SoLuong" | "Gia" | "">( "");


  const loadAPI = async () => {
    try {
      const [patientData, prescriptionData] = await Promise.all([
        getDetailPatientInformation(String(id)),
        getDetailPrescription(String(id)),
      ]);
      if (prescriptionData) setDetailedPrescription(prescriptionData);
      if (patientData) setData(patientData);
    } catch (error) {
      showToast("Không thể tải dữ liệu", ToastType.error);
      console.log(error);
    }
  };

  const PayMoMo = async () => {
    await payment(
      Number(dataPendingPayment.TongTien),
      "Đơn thuốc",
      `http://localhost:3000/Cashier/PaymentWaitingList/${id}`,
      id as string
    );
  };

  useEffect(() => {
    const resultCode = searchParams.get("resultCode");
    if (resultCode === "0")
      showToast("Thanh toán thành công", ToastType.success);
    loadAPI();
  }, []);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handlePaymenConfirmation = (HoVaTen: string, TongTien: number) => {
    setDataPendingPayment({ HoVaTen, TongTien });
    setShowModal(true);
  };

  //lay token ThuNgan

  const getThuNganIdFromToken = (): string | null => {
  const token = Cookies.get("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<MyTokenType>(token);
    return decoded._id;
  } catch (error) {
    console.error("Lỗi giải mã token:", error);
    return null;
  }
};

const paymentConfirmation = async () => {
  try {
    const result = await confirmPrescriptionPayment(String(id));

    if (result) {
      //Sua o day
      const idThuNgan = getThuNganIdFromToken();

      if (!idThuNgan) {
        showToast("Không tìm thấy ID thu ngân", ToastType.error);
        return;
      }

      // Gửi request tạo hóa đơn
      await fetch(`${API_BASE_URL}/Hoadon/Add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Id_PhieuKhamBenh: data?.Id_PhieuKhamBenh?._id,
          Id_Dichvu: data?._id.toString(),
          Id_ThuNgan: idThuNgan,
          LoaiHoaDon: "Thuoc",
          TenHoaDon:`Hóa đơn: ${data?.TenDonThuoc}`,
          TongTien: dataPendingPayment.TongTien
        }),
      });

      showToast("Xác nhận thanh toán thành công", ToastType.success);
      setShowModal(false);
      await loadAPI();
    } else {
      showToast("Xác nhận thanh toán thất bại", ToastType.error);
    }
  } catch (error) {
    showToast("Đã có lỗi xảy ra khi xác nhận thanh toán", ToastType.error);
    console.error(error);
  }
};


  const handlePrint = () => {
    if (!data || detailedPrescription.length === 0) {
      showToast("Dữ liệu chưa sẵn sàng để in đơn thuốc", ToastType.warn);
      return;
    }
    setIsMedicineFeesOpen(true);
  };

const handleSort = (property: "SoLuong" | "Gia") => {
  const isAsc = orderBy === property && order === "asc";
  setOrder(isAsc ? "desc" : "asc");
  setOrderBy(property);
};


const sortedPrescription = React.useMemo(() => {
  if (!orderBy) return detailedPrescription;
  return [...detailedPrescription].sort((a, b) => {
    const aValue = orderBy === "SoLuong" ? a.SoLuong : a.Id_Thuoc.Gia || 0;
    const bValue = orderBy === "SoLuong" ? b.SoLuong : b.Id_Thuoc.Gia || 0;
    if (aValue < bValue) return order === "asc" ? -1 : 1;
    if (aValue > bValue) return order === "asc" ? 1 : -1;
    return 0;
  });
}, [detailedPrescription, order, orderBy]);


  return (
    <>
      <Tabbar
        tabbarItems={{
          tabbarItems: [
            {
              text: "Chi tiết đơn thuốc",
              link: `/Cashier/PaymentWaitingList/${id}`,
            },
          ],
        }}
      />

      <ConfirmationNotice
        Data_information={{
          name: dataPendingPayment.HoVaTen || "",
          totalPrice: `${dataPendingPayment.TongTien || 0}`,
          paymentMethod: "",
          handleClose,
          handleShow,
          show: showModal,
          callBack: paymentConfirmation,
          paymentConfirmation: PayMoMo,
        }}
      />

      <MedicineFees
        isOpen={isMedicineFeesOpen}
        onClose={() => setIsMedicineFeesOpen(false)}
        data={data}
        detailedPrescription={detailedPrescription}
      />

      <div className="PrescriptionDetails-container" style={{ fontSize: 18 }}>
        <div
          className="PrescriptionDetails-container__Box1"
          style={{ flex: 1 }}
        >
          <h3 style={{ marginBottom: 16 }}>Thông tin bệnh nhân</h3>
          <Box
            className="patient-info"
            sx={{
              borderRadius: 2,
              paddingLeft: "10px",
              color: "text.primary",
              fontSize: 20,
              fontWeight: 400,
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <Typography variant="body2" sx={{ fontSize: 16 }}>
              <span style={{ fontWeight: 500, color: "#000" }}>
                Tên đơn thuốc:
              </span>{" "}
              <span style={{ color: "#555" }}>
                {data?.TenDonThuoc || "Không có dữ liệu"}
              </span>
            </Typography>

            <Typography variant="body2" sx={{ fontSize: 16 }}>
              <span style={{ fontWeight: 500, color: "#000" }}>Bệnh nhân:</span>{" "}
              <span style={{ color: "#555" }}>
                {data?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.HoVaTen ||
                  "Không có dữ liệu"}
              </span>
            </Typography>

            <Typography variant="body2" sx={{ fontSize: 16 }}>
              <span style={{ fontWeight: 500, color: "#000" }}>
                Số điện thoại:
              </span>{" "}
              <span style={{ color: "#555" }}>
                {data?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.SoDienThoai ||
                  "Không có dữ liệu"}
              </span>
            </Typography>

            <Typography variant="body2" sx={{ fontSize: 16 }}>
              <span style={{ fontWeight: 500, color: "#000" }}>Bác sĩ:</span>{" "}
              <span style={{ color: "#555" }}>
                {data?.Id_PhieuKhamBenh?.Id_Bacsi?.TenBacSi ||
                  "Không có dữ liệu"}
              </span>
            </Typography>

            <Typography variant="body2" sx={{ fontSize: 16 }}>
              <span style={{ fontWeight: 500, color: "#000" }}>Thời gian:</span>{" "}
              <span style={{ color: "#555" }}>
                {formatTime(data?.Gio as string) || "Không có dữ liệu"}
              </span>
            </Typography>

            <Typography variant="body2" sx={{ fontSize: 16 }}>
              <span style={{ fontWeight: 500, color: "#000" }}>Ngày:</span>{" "}
              <span style={{ color: "#555" }}>
                {data?.Id_PhieuKhamBenh?.Ngay || "Không có dữ liệu"}
              </span>
            </Typography>

            <Typography variant="body2" sx={{ fontSize: 16 }}>
              <span style={{ fontWeight: 600, color: "#000" }}>Tổng tiền:</span>{" "}
              <span style={{ color: "red", fontWeight: 600 }}>
                {formatCurrencyVND(data?.TongTien || 0)}
              </span>
            </Typography>
          </Box>
          <Divider sx={{ marginTop: 1, backgroundColor: "gray" }} />
          <Box mt={2} display="flex" gap={2}>
            <Button
              variant="outlined"
              color="inherit"
              sx={{ whiteSpace: "nowrap" }}
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push("/Cashier/PaymentWaitingList")}
            >
              Quay lại
            </Button>

            {data?.TrangThaiThanhToan === true ? (
              <Button
                variant="contained"
                color="primary"
                sx={{whiteSpace:"nowrap"}}
                startIcon={<PrintIcon />}
                onClick={handlePrint}
              >
                In đơn thuốc
              </Button>
            ) : (
              <Button
                variant="contained"
                sx={{ backgroundColor: "#08b700", whiteSpace: "nowrap" }}
                startIcon={<PaymentIcon />}
                onClick={() =>
                  handlePaymenConfirmation(
                    data?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.HoVaTen || "",
                    data?.TongTien || 0
                  )
                }
              >
                Thanh toán
              </Button>
            )}
          </Box>
        </div>

        <div
          className="PrescriptionDetails-container__Box2"
          style={{ fontSize: 18 }}
        >
          <div className="PrescriptionDetails-container__Box2__title">
            Đơn thuốc chi tiết
          </div>
          <Table sx={{ mt: 2 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f0f2f5" }}>
                <TableCell>Tên thuốc</TableCell>
                <TableCell>Đơn vị</TableCell>

                <TableCell>
                  <TableSortLabel
                    active={orderBy === "SoLuong"}
                    direction={orderBy === "SoLuong" ? order : "asc"}
                    onClick={() => handleSort("SoLuong")}
                    hideSortIcon
                    sx={{ "& .MuiTableSortLabel-icon": { display: "none" } }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        fontWeight: 600,
                      }}
                    >
                      Số lượng
                      <span
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          marginLeft: 4,
                        }}
                      >
                        <ArrowDropUpIcon
                          fontSize="small"
                          style={{
                            color:
                              orderBy === "SoLuong" && order === "asc"
                                ? "#1976d2"
                                : "#ccc",
                            marginBottom: -6,
                          }}
                        />
                        <ArrowDropDownIcon
                          fontSize="small"
                          style={{
                            color:
                              orderBy === "SoLuong" && order === "desc"
                                ? "#1976d2"
                                : "#ccc",
                            marginTop: -6,
                          }}
                        />
                      </span>
                    </span>
                  </TableSortLabel>
                </TableCell>

                <TableCell>
                  <TableSortLabel
                    active={orderBy === "Gia"}
                    direction={orderBy === "Gia" ? order : "asc"}
                    onClick={() => handleSort("Gia")}
                    hideSortIcon
                    sx={{ "& .MuiTableSortLabel-icon": { display: "none" } }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        fontWeight: 600,
                      }}
                    >
                      Giá mỗi đơn vị
                      <span
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          marginLeft: 4,
                        }}
                      >
                        <ArrowDropUpIcon
                          fontSize="small"
                          style={{
                            color:
                              orderBy === "Gia" && order === "asc"
                                ? "#1976d2"
                                : "#ccc",
                            marginBottom: -6,
                          }}
                        />
                        <ArrowDropDownIcon
                          fontSize="small"
                          style={{
                            color:
                              orderBy === "Gia" && order === "desc"
                                ? "#1976d2"
                                : "#ccc",
                            marginTop: -6,
                          }}
                        />
                      </span>
                    </span>
                  </TableSortLabel>
                </TableCell>

                <TableCell>Trạng thái</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {sortedPrescription.map((item, index) => (
                <TableRow key={index} hover>
                  <TableCell>{item.Id_Thuoc.TenThuoc}</TableCell>
                  <TableCell>{item.Id_Thuoc.DonVi}</TableCell>
                  <TableCell>{item.SoLuong}</TableCell>
                  <TableCell sx={{ color: "red", whiteSpace: "nowrap" }}>
                    {formatCurrencyVND(item.Id_Thuoc.Gia || 0)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      label={
                        data?.TrangThaiThanhToan
                          ? "Đã thanh toán"
                          : "Chưa thanh toán"
                      }
                      color={data?.TrangThaiThanhToan ? "green" : "red"}
                      backgroundColor={
                        data?.TrangThaiThanhToan ? "#e6f4ea" : "#fdecea"
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
