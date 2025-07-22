"use client";
import "../../PrescriptionDetails.css";
import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import { formatCurrencyVND, formatTime } from "@/app/lib/Format";
import {
  getDetailParaclinicalAwaitingPayment,
  confirmTestRequestPayment,
} from "@/app/services/Cashier";
import { paraclinicalType } from "@/app/types/patientTypes/patient";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { showToast, ToastType } from "@/app/lib/Toast";
import ConfirmationNotice from "@/app/Cashier/ComponentCashier/ConfirmationNotice";
import ParaclinicalPayment from "@/app/Cashier/ComponentCashier/ParaclinicalPayment";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TableSortLabel,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import StatusBadge from "@/app/components/ui/StatusBadge/StatusBadge";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PrintIcon from "@mui/icons-material/Print";
import PaymentIcon from "@mui/icons-material/Payment";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import payment from "@/app/services/Pay";

export default function ParaclinicalDetails() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [dataDetail, setDataDetail] = useState<paraclinicalType[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const [dataPendingPayment, setDataPendingPayment] = useState<{
    HoVaTen?: string;
    TongTien?: number;
  }>({});
  const [idPhieuKhamBenh, setIdPhieuKhamBenh] = useState<string>("");
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [isParaclinicalPaymentOpen, setIsParaclinicalPaymentOpen] =
    useState(false);

  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<
    "Gio" | "TrangThaiThanhToan" | "Gia" | ""
  >("");

  const paymentConfirmation = async (id: string | null = null) => {
    try {
      const Id_ThuNgan = getThuNganIdFromToken();
      if (!Id_ThuNgan) {
        showToast("Không tìm thấy ID thu ngân", ToastType.error);
        return;
      }

      const finalId = id ?? (idPhieuKhamBenh || String(params.id)); // fallback 3 bước
      const result = await confirmTestRequestPayment(finalId, Id_ThuNgan);
      const message = result?.message || "Xác nhận không rõ";

      if (
        message.includes("đã được thanh toán trước đó") ||
        message.includes("thành công")
      ) {
        showToast(message, ToastType.success);
        handleClose();
        setIsPaid(true);
        await loaddingApi();
        return;
      }

      showToast("Không rõ trạng thái thanh toán", ToastType.error);
    } catch {
      showToast("Đã có lỗi xảy ra khi xác nhận thanh toán", ToastType.error);
    } finally {
      handleClose();
    }
  };

  const PayMoMo = async () => {
    await payment(
      totalPrice,
      "Xét nghiệm",
      `http://localhost:3000/Cashier/PaymentWaitingList/ParaclinicalPaymentRequired/${idPhieuKhamBenh}`,
      idPhieuKhamBenh,
      "XetNghiem"
    );
  };

  const loaddingApi = async () => {
    const response = await getDetailParaclinicalAwaitingPayment(String(id));
    if (!response) return;
    setTotalPrice(response.TongTien);
    if (!Array.isArray(response.data)) return;
    setDataDetail(response.data);
    const isPaymentCompleted = response.data.every(
      (item) => item.TrangThaiThanhToan === true
    );
    setIsPaid(isPaymentCompleted);
  };

  useEffect(() => {
    loaddingApi();
  }, [id]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const extraData = searchParams.get("extraData");
    const resultCode = searchParams.get("resultCode");

    if (extraData && resultCode === "0" && !isPaid) {
      try {
        const parsedExtraData = JSON.parse(decodeURIComponent(extraData));
        const idFromMoMo = parsedExtraData.Id;

        // fallback nếu idPhieuKhamBenh chưa có
        const compareId = idPhieuKhamBenh || String(id);

        if (idFromMoMo === compareId) {
          paymentConfirmation(idFromMoMo);
        }
      } catch (error) {
        console.error("Lỗi phân tích extraData:", error);
      }
    }
  }, []);

  const handleSort = (columnId: "Gio" | "TrangThaiThanhToan" | "Gia") => {
    const isAsc = orderBy === columnId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(columnId);
  };

  const sortedData = useMemo(() => {
    if (!orderBy) return dataDetail;

    return [...dataDetail].sort((a, b) => {
      let aVal, bVal;

      if (orderBy === "Gia") {
        aVal = a.Id_LoaiXetNghiem?.Id_GiaDichVu?.Giadichvu || 0;
        bVal = b.Id_LoaiXetNghiem?.Id_GiaDichVu?.Giadichvu || 0;
      } else {
        aVal = a[orderBy];
        bVal = b[orderBy];
      }

      if (aVal < bVal) return order === "asc" ? -1 : 1;
      if (aVal > bVal) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [dataDetail, order, orderBy]);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handlePaymenConfirmation = (
    HoVaTen: string,
    TongTien: number,
    idPhieuKhamBenh: string
  ) => {
    setDataPendingPayment({ HoVaTen, TongTien });
    setIdPhieuKhamBenh(idPhieuKhamBenh);
    handleShow();
  };

  const getThuNganIdFromToken = (): string | null => {
    const token = Cookies.get("token");
    if (!token) return null;

    try {
      const decoded = jwtDecode<{ _id: string }>(token);
      return decoded._id;
    } catch (error) {
      console.error("Lỗi giải mã token:", error);
      return null;
    }
  };

  return (
    <>
      <Tabbar
        tabbarItems={{
          tabbarItems: [
            {
              text: "Chi tiết cận lâm sàng",
              link: `/Cashier/PaymentWaitingList/ParaclinicalPaymentRequired/${id}`,
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

      <ParaclinicalPayment
        isOpen={isParaclinicalPaymentOpen}
        onClose={() => setIsParaclinicalPaymentOpen(false)}
        dataDetail={dataDetail}
      />

      <div className="PrescriptionDetails-container">
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
              <span style={{ fontWeight: 500, color: "#000" }}>Bệnh nhân:</span>{" "}
              <span style={{ color: "#555" }}>
                {dataDetail[0]?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.HoVaTen ||
                  "Không có dữ liệu"}
              </span>
            </Typography>

            <Typography variant="body2" sx={{ fontSize: 16 }}>
              <span style={{ fontWeight: 500, color: "#000" }}>Ngày sinh:</span>{" "}
              <span style={{ color: "#555" }}>
                {dataDetail[0]?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.NgaySinh ||
                  "Không có dữ liệu"}
              </span>
            </Typography>

            <Typography variant="body2" sx={{ fontSize: 16 }}>
              <span style={{ fontWeight: 500, color: "#000" }}>Giới tính:</span>{" "}
              <span style={{ color: "#555" }}>
                {dataDetail[0]?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.GioiTinh ||
                  "Không có dữ liệu"}
              </span>
            </Typography>

            <Typography variant="body2" sx={{ fontSize: 16 }}>
              <span style={{ fontWeight: 500, color: "#000" }}>Ngày khám:</span>{" "}
              <span style={{ color: "#555" }}>
                {dataDetail[0]?.Id_PhieuKhamBenh?.Ngay || "Không có dữ liệu"}
              </span>
            </Typography>

            <Typography variant="body2" sx={{ fontSize: 16 }}>
              <span style={{ fontWeight: 500, color: "#000" }}>
                Số điện thoại:
              </span>{" "}
              <span style={{ color: "#555" }}>
                {dataDetail[0]?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.SoDienThoai ||
                  "Không có dữ liệu"}
              </span>
            </Typography>

            <Typography variant="body2" sx={{ fontSize: 16 }}>
              <span style={{ fontWeight: 600, color: "#000" }}>Tổng tiền:</span>{" "}
              <span style={{ color: "red", fontWeight: 600 }}>
                {formatCurrencyVND(totalPrice)}
              </span>
            </Typography>
          </Box>
          <Divider sx={{ marginTop: 1, backgroundColor: "gray" }} />
          <Box mt={2} display="flex" gap={2}>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<ArrowBackIcon />}
              sx={{ whiteSpace: "nowrap" }}
              onClick={() =>
                router.push(
                  "/Cashier/PaymentWaitingList/ParaclinicalPaymentRequired"
                )
              }
            >
              Quay lại
            </Button>
            {isPaid ? (
              <Button
                variant="contained"
                color="primary"
                sx={{ whiteSpace: "nowrap" }}
                startIcon={<PrintIcon />}
                onClick={() => setIsParaclinicalPaymentOpen(true)}
              >
                In Hóa Đơn
              </Button>
            ) : (
              <Button
                variant="contained"
                sx={{ backgroundColor: "#08b700", whiteSpace: "nowrap" }}
                startIcon={<PaymentIcon />}
                onClick={() =>
                  handlePaymenConfirmation(
                    dataDetail[0]?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.HoVaTen ||
                      "",
                    totalPrice,
                    String(id)
                  )
                }
              >
                Thanh toán
              </Button>
            )}
          </Box>
        </div>

        <div className="PrescriptionDetails-container__Box2">
          <div className="PrescriptionDetails-container__Box2__title">
            Chi tiết cận lâm sàng
          </div>

          <Table sx={{ mt: 2 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f0f2f5" }}>
                <TableCell>Tên phòng thiết bị</TableCell>
                <TableCell>Tên xét nghiệm</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "Gio"}
                    direction={orderBy === "Gio" ? order : "asc"}
                    onClick={() => handleSort("Gio")}
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
                      Thời gian
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
                              orderBy === "Gio" && order === "asc"
                                ? "#1976d2"
                                : "#ccc",
                            marginBottom: -6,
                          }}
                        />
                        <ArrowDropDownIcon
                          fontSize="small"
                          style={{
                            color:
                              orderBy === "Gio" && order === "desc"
                                ? "#1976d2"
                                : "#ccc",
                            marginTop: -6,
                          }}
                        />
                      </span>
                    </span>
                  </TableSortLabel>
                </TableCell>

                <TableCell>Bác sĩ</TableCell>
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
                      Giá
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
              {sortedData.map((item, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    {item.Id_LoaiXetNghiem.Id_PhongThietBi.TenPhongThietBi ||
                      "Không xác định"}
                  </TableCell>
                  <TableCell>
                    {item.Id_LoaiXetNghiem.TenXetNghiem || "Không xác định"}
                  </TableCell>
                  <TableCell>
                    {formatTime(item.Gio) || "Không có dữ liệu"}
                  </TableCell>
                  <TableCell>
                    {item.Id_PhieuKhamBenh.Id_Bacsi?.TenBacSi ||
                      "Không có dữ liệu"}
                  </TableCell>
                  <TableCell sx={{ color: "red" }}>
                    {formatCurrencyVND(
                      item.Id_LoaiXetNghiem?.Id_GiaDichVu?.Giadichvu || 0
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      label={
                        item.TrangThaiThanhToan
                          ? "Đã thanh toán"
                          : "Chưa thanh toán"
                      }
                      color={item.TrangThaiThanhToan ? "green" : "red"}
                      backgroundColor={
                        item.TrangThaiThanhToan ? "#e6f4ea" : "#fdecea"
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
