"use client";
import React, { useEffect, useState } from "react";
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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import { useRouter, useParams } from "next/navigation";
import { formatTime } from "@/app/lib/Format";
import { PrescriptionDetail } from "@/app/Doctor/Patient/ToExamine/[id]/CreateResults/CreateResultsComponent/Prescription";
import {
  ConfirmationOfDispensing,
  getPrescriptionListDetail,
} from "@/app/services/Pharmacist";
import { getDetailPatientInformation } from "@/app/services/Cashier";
import { prescriptionType } from "@/app/types/patientTypes/patient";
import ModalComponent from "@/app/components/shared/Modal/Modal";
import "./ListofDrugsDetail.css";
import StatusBadge from "@/app/components/ui/StatusBadge/StatusBadge";

export default function PrescriptionDetails() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [dataDrugInformation, setDataDrugInformation] =
    useState<prescriptionType>();
  const [detailedPrescription, setDetailedPrescription] = useState<
    PrescriptionDetail[]
  >([]);
  const [showModal, setShowModal] = useState(false);

  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<"SoLuong" | "">("");

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const loadAPI = async () => {
    const datadetailedPrescription = await getPrescriptionListDetail(
      String(id)
    );
    if (datadetailedPrescription)
      setDetailedPrescription(datadetailedPrescription);

    const DataDrugInformation = await getDetailPatientInformation(String(id));
    if (DataDrugInformation) setDataDrugInformation(DataDrugInformation);
  };

  useEffect(() => {
    loadAPI();
  }, [id]);

  const handleConfirmationDispensing = async (idDonthuoc: string) => {
    try {
      const result = await ConfirmationOfDispensing(
        idDonthuoc,
        "68272d28b4cfad70da810025"
      );
      if (result) {
        await loadAPI();
        setShowModal(false);
      }
    } catch (error) {
      console.error("Lỗi khi xác nhận phát thuốc:", error);
    }
  };

  const handleSort = (property: "SoLuong") => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedPrescription = React.useMemo(() => {
    if (!orderBy) return detailedPrescription;
    return [...detailedPrescription].sort((a, b) => {
      const aValue = a.SoLuong;
      const bValue = b.SoLuong;
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
              link: `/Pharmacist/ListofDrugs/${id}`,
            },
          ],
        }}
      />

      <ModalComponent
        Data_information={{
          content: "Bạn có chắc chắn muốn xác nhận phát thuốc?",
          handleClose: handleCloseModal,
          handleShow: handleShowModal,
          show: showModal,
          callBack: () =>
            handleConfirmationDispensing(dataDrugInformation?._id as string),
        }}
      />

      <div className="PrescriptionDetails-container" style={{ fontSize: 18 }}>
        <div
          style={{
            display: "flex",
            gap: "20px",
            width: "100%",
            alignItems: "flex-start",
          }}
        >
          {/* Box 1 - Thông tin bệnh nhân */}
          <div
            className="PrescriptionDetails-container__Box1"
            style={{
              flex: 1,
              borderRadius: 8,
              padding: 16,
              backgroundColor: "#fff",
            }}
          >
            <h3 style={{ marginBottom: 16 }}>Thông tin bệnh nhân</h3>
            <Box
              sx={{
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
                <strong>Tên đơn thuốc: </strong>
                <span style={{ color: "#555" }}>
                  {dataDrugInformation?.TenDonThuoc || "Không có dữ liệu"}
                </span>
              </Typography>
              <Typography variant="body2" sx={{ fontSize: 16 }}>
                <strong>Bệnh nhân: </strong>
                <span style={{ color: "#555" }}>
                  {
                    dataDrugInformation?.Id_PhieuKhamBenh?.Id_TheKhamBenh
                      ?.HoVaTen
                  }
                </span>
              </Typography>
              <Typography variant="body2" sx={{ fontSize: 16 }}>
                <strong>Số điện thoại: </strong>
                <span style={{ color: "#555" }}>
                  {
                    dataDrugInformation?.Id_PhieuKhamBenh?.Id_TheKhamBenh
                      ?.SoDienThoai
                  }
                </span>
              </Typography>
              <Typography variant="body2" sx={{ fontSize: 16 }}>
                <strong>Bác sĩ: </strong>
                <span style={{ color: "#555" }}>
                  {dataDrugInformation?.Id_PhieuKhamBenh?.Id_Bacsi?.TenBacSi}
                </span>
              </Typography>
              <Typography variant="body2" sx={{ fontSize: 16 }}>
                <strong>Thời gian: </strong>
                <span style={{ color: "#555" }}>
                  {formatTime(dataDrugInformation?.Gio as string)}
                </span>
              </Typography>
              <Typography variant="body2" sx={{ fontSize: 16 }}>
                <strong>Ngày: </strong>
                <span style={{ color: "#555" }}>
                  {dataDrugInformation?.Id_PhieuKhamBenh?.Ngay}
                </span>
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: 16,
                  gap: "10px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <strong>Trạng thái: </strong>
                <StatusBadge
                  label={
                    dataDrugInformation?.TrangThai === "DaPhatThuoc"
                      ? "Đã phát thuốc"
                      : "Chưa phát thuốc"
                  }
                  color={
                    dataDrugInformation?.TrangThai === "DaPhatThuoc"
                      ? "#4caf50"
                      : "#f44336"
                  }
                  backgroundColor={
                    dataDrugInformation?.TrangThai !== "DaPhatThuoc"
                      ? "rgb(255 212 209)"
                      : "rgb(209 255 210)"
                  }
                />
              </Typography>
            </Box>

            <Divider sx={{ marginTop: 2, backgroundColor: "gray" }} />

            <Box mt={2} display="flex" gap={2}>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<ArrowBackIcon />}
                onClick={() => router.push("/Pharmacist/ListofDrugs")}
              >
                Quay lại
              </Button>

              {dataDrugInformation?.TrangThai === "DaPhatThuoc" ? (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircleIcon />}
                  disabled
                >
                  Đã phát thuốc
                </Button>
              ) : (
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#08b700" }}
                  startIcon={<CheckCircleIcon />}
                  onClick={handleShowModal}
                >
                  Xác nhận phát thuốc
                </Button>
              )}
            </Box>
          </div>

          {/* Box 2 - Chi tiết đơn thuốc */}
          <div
            className="PrescriptionDetails-container__Box2"
            style={{
              flex: 1,
              borderRadius: 8,
              padding: 16,
              backgroundColor: "#fff",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, fontSize: 20, marginBottom: 2 }}
            >
              Đơn thuốc chi tiết
            </Typography>
            <Table sx={{ mt: 2 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ paddingBottom: "4px", paddingTop: "4px" }}>
                    Tên thuốc
                  </TableCell>
                  <TableCell sx={{ paddingBottom: "4px", paddingTop: "4px" }}>
                    Đơn vị
                  </TableCell>
                  <TableCell sx={{ paddingBottom: "4px", paddingTop: "4px" }}>
                    <TableSortLabel
                      active={orderBy === "SoLuong"}
                      direction={orderBy === "SoLuong" ? order : "asc"}
                      onClick={() => handleSort("SoLuong")}
                      hideSortIcon
                      sx={{ "& .MuiTableSortLabel-icon": { display: "none" } }}
                    >
                      <span style={{ display: "flex", alignItems: "center" }}>
                        <strong>Số lượng</strong>
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
                  <TableCell sx={{ paddingBottom: "4px", paddingTop: "4px" }}>
                    Ghi chú
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedPrescription.map((item, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{item.Id_Thuoc.TenThuoc}</TableCell>
                    <TableCell>{item.Id_Thuoc.DonVi}</TableCell>
                    <TableCell>{item.SoLuong}</TableCell>
                    <TableCell>{item.NhacNho}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
