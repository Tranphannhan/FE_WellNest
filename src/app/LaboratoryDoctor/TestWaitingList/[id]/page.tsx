"use client";
import "../TestWaitingListDetail.css";
import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { getWaitingForTestDetail } from "@/app/services/LaboratoryDoctor";
import { paraclinicalType } from "@/app/types/patientTypes/patient";
import { FaEye, FaPlus } from "react-icons/fa6";
import { showToast, ToastType } from "@/app/lib/Toast";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ViewParaclinicalResults, {
  NormalTestResult,
} from "@/app/Doctor/Patient/ToExamine/[id]/CreateResults/CreateResultsComponent/ViewParaclinicalResults";
import { getResultsByRequestTesting } from "@/app/services/DoctorSevices";

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
import StatusBadge from "@/app/components/ui/StatusBadge/StatusBadge";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DiagnosisPopup from "@/app/components/diagnosis/DiagnosisPopup";

type Order = "asc" | "desc";

export default function PrescriptionDetails() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [showResultsPopup, SetShowResultsPopup] = useState(false);
  const [dataResule, setDataResule] = useState<NormalTestResult[]>([]);
  const [value, setValue] = useState<paraclinicalType[]>([]);

  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<"Gio" | "TrangThai" | "">("");

  // State popup chẩn đoán
  const [openDiagnosis, setOpenDiagnosis] = useState(false);

  useEffect(() => {
    const loaddingAPI = async () => {
      const getData = await getWaitingForTestDetail(
        String(id),
        null,
        "6803bf3070cd96d5cde6d824"
      );
      if (!getData) return;
      setValue(getData.data);
    };
    loaddingAPI();
  }, [id]);

  const handleSort = (columnId: "Gio" | "TrangThai") => {
    const isAsc = orderBy === columnId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(columnId);
  };

  const sortedData = useMemo(() => {
    if (!orderBy) return value;
    return [...value].sort((a, b) => {
      const aVal = a[orderBy];
      const bVal = b[orderBy];
      if (aVal < bVal) return order === "asc" ? -1 : 1;
      if (aVal > bVal) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [value, order, orderBy]);

  const update = (
    Id_YeuCauXetNghiem: string,
    Id_PhieuKhamBenh: string,
    Id_NguoiXetNghiem: string,
    TenXetNghiem: string
  ) => {
    if (!Id_YeuCauXetNghiem || !Id_PhieuKhamBenh || !Id_NguoiXetNghiem) {
      return showToast("Thiếu id truyền vào", ToastType.warn);
    }

    const saveDataLocostorage = {
      TenXetNghiem,
      Id_YeuCauXetNghiem,
      Id_PhieuKhamBenh,
      Id_NguoiXetNghiem,
    };

    sessionStorage.setItem(
      "idGenerateTestResult",
      JSON.stringify(saveDataLocostorage)
    );
    router.push("/LaboratoryDoctor/GenerateTestResults");
  };

  const handleView = async (id: string) => {
    const getDataResult = await getResultsByRequestTesting(id);
    setDataResule(getDataResult);
    SetShowResultsPopup(true);
  };

  return (
    <>
      <Tabbar
        tabbarItems={{
          tabbarItems: [
            {
              text: "Thực hiện xét nghiệm",
              link: `/LaboratoryDoctor/TestWaitingList/${id}`,
            },
          ],
        }}
      />

      {showResultsPopup && (
        <ViewParaclinicalResults
          dataFromOutside={dataResule}
          onClose={() => SetShowResultsPopup(false)}
        />
      )}

      <div className="PrescriptionDetails-container">
        {/* Thông tin bệnh nhân */}
        <div className="PrescriptionDetails-container__Box1" style={{ flex: 1 }}>
          <h3 style={{ marginBottom: 16 }}>Thông tin bệnh nhân</h3>

          <Box
            className="patient-info"
            sx={{
              borderRadius: 2,
              paddingLeft: "10px",
              color: "text.primary",
              fontWeight: 400,
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <Typography variant="body2" sx={{ fontSize: 16 }}>
              <span style={{ fontWeight: 500, color: "#000" }}>Bệnh nhân:</span>{" "}
              <span style={{ color: "#555" }}>
                {value[0]?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.HoVaTen || "Chưa rõ"}
              </span>
            </Typography>

            <Typography variant="body2" sx={{ fontSize: 16 }}>
              <span style={{ fontWeight: 500, color: "#000" }}>Ngày sinh:</span>{" "}
              <span style={{ color: "#555" }}>
                {value[0]?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.NgaySinh || "Chưa rõ"}
              </span>
            </Typography>

            <Typography variant="body2" sx={{ fontSize: 16 }}>
              <span style={{ fontWeight: 500, color: "#000" }}>Giới tính:</span>{" "}
              <span style={{ color: "#555" }}>
                {value[0]?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.GioiTinh || "Chưa rõ"}
              </span>
            </Typography>

            <Typography variant="body2" sx={{ fontSize: 16 }}>
              <span style={{ fontWeight: 500, color: "#000" }}>Ngày khám:</span>{" "}
              <span style={{ color: "#555" }}>{value[0]?.Id_PhieuKhamBenh?.Ngay || "-"}</span>
            </Typography>

            <Typography variant="body2" sx={{ fontSize: 16 }}>
              <span style={{ fontWeight: 500, color: "#000" }}>Số điện thoại:</span>{" "}
              <span style={{ color: "#555" }}>
                {value[0]?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.SoDienThoai || "Chưa rõ"}
              </span>
            </Typography>

            <Typography
              variant="body2"
              sx={{ fontSize: 16, maxWidth: "100%", whiteSpace: "pre-wrap" }}
            >
              <span style={{ fontWeight: 500, color: "#000" }}>Lý do đến khám:</span>{" "}
              <span
                style={{
                  color: "#555",
                  maxWidth: "350px",
                  display: "inline-block",
                  wordWrap: "break-word",
                  whiteSpace: "normal",
                }}
              >
                {value[0]?.Id_PhieuKhamBenh?.LyDoDenKham || "Chưa rõ"}
              </span>
            </Typography>
          </Box>

          <Divider sx={{ marginTop: 2 }} />

          <Box mt={2} display={"flex"} gap={"10px"}>
            <Button
              variant="outlined"
              color="inherit"
              sx={{ whiteSpace: "nowrap" }}
              startIcon={<ArrowBackIcon />}
              onClick={() => {
                router.push("/LaboratoryDoctor/TestWaitingList/");
              }}
            >
              Quay lại
            </Button>

            <Button
              variant="outlined"
              sx={{ whiteSpace: "nowrap" }}
              startIcon={<VisibilityIcon />}
              onClick={() => {
                setOpenDiagnosis(true);
              }}
            >
              Xem chẩn đoán sơ bộ
            </Button>
          </Box>
        </div>

        {/* Bảng chi tiết đơn thuốc */}
        <div className="PrescriptionDetails-container__Box2">
          <div className="PrescriptionDetails-container__Box2__title">Yêu cầu xét nghiệm</div>

          <Table sx={{ mt: 2, borderRadius: 2, overflow: "hidden" }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f0f2f5" }}>
                <TableCell>
                  <span>Tên xét nghiệm</span>
                </TableCell>

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
                            color: orderBy === "Gio" && order === "asc" ? "#1976d2" : "#ccc",
                            marginBottom: -6,
                          }}
                        />
                        <ArrowDropDownIcon
                          fontSize="small"
                          style={{
                            color: orderBy === "Gio" && order === "desc" ? "#1976d2" : "#ccc",
                            marginTop: -6,
                          }}
                        />
                      </span>
                    </span>
                  </TableSortLabel>
                </TableCell>

                <TableCell>
                  <span>Bác sĩ</span>
                </TableCell>

                <TableCell>
                  <TableSortLabel
                    active={orderBy === "TrangThai"}
                    direction={orderBy === "TrangThai" ? order : "asc"}
                    onClick={() => handleSort("TrangThai")}
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
                      Trạng thái
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
                            color: orderBy === "TrangThai" && order === "asc" ? "#1976d2" : "#ccc",
                            marginBottom: -6,
                          }}
                        />
                        <ArrowDropDownIcon
                          fontSize="small"
                          style={{
                            color: orderBy === "TrangThai" && order === "desc" ? "#1976d2" : "#ccc",
                            marginTop: -6,
                          }}
                        />
                      </span>
                    </span>
                  </TableSortLabel>
                </TableCell>

                <TableCell align="right">
                  <strong></strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {sortedData.map((item, index) => (
                <TableRow
                  key={index}
                  hover
                  sx={{
                    transition: "background-color 0.3s",
                    "&:hover": { backgroundColor: "#f9f9f9" },
                  }}
                >
                  <TableCell>{item.Id_LoaiXetNghiem.TenXetNghiem}</TableCell>
                  <TableCell>{item.Gio}</TableCell>
                  <TableCell>{item.Id_PhieuKhamBenh.Id_Bacsi?.TenBacSi}</TableCell>
                  <TableCell>
                    <StatusBadge
                      color={item.TrangThai ? "#388e3c" : "#d84315"}
                      backgroundColor={item.TrangThai ? "#e8f5e9" : "#fbe9e7"}
                      label={item.TrangThai ? "Đã xét nghiệm" : "Chưa xét nghiệm"}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="contained"
                      sx={{
                        color: "white",
                        backgroundColor: item.TrangThai ? "#00d335" : "#3497f9",
                        "&:hover": {
                          backgroundColor: item.TrangThai ? "#00b42a" : "#1c78e2",
                        },
                      }}
                      startIcon={item.TrangThai ? <FaEye /> : <FaPlus />}
                      onClick={() =>
                        !item.TrangThai
                          ? update(
                              item._id,
                              item.Id_PhieuKhamBenh._id,
                              "68272ec1b4cfad70da81002f",
                              item.Id_LoaiXetNghiem.TenXetNghiem
                            )
                          : handleView(item._id)
                      }
                    >
                      {item.TrangThai ? "Xem kết quả" : "Tạo kết quả"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Popup chẩn đoán sơ bộ */}
      <DiagnosisPopup
        readOnly={true}
        id={id as string}
        open={openDiagnosis}
        onClose={() => setOpenDiagnosis(false)}
      />
    </>
  );
}
