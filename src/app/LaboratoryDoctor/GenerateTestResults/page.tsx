"use client";
import { useEffect, useRef, useState } from "react";
import "./GenerateTestResults.css";
import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import { showToast, ToastType } from "@/app/lib/Toast";
import ModalComponent from "@/app/components/shared/Modal/Modal";
import {
  generateTestResults,
  handleCompleteTheTests,
} from "@/app/services/LaboratoryDoctor";
import { useRouter } from "next/navigation";
import ViewParaclinicalResults, {
  NormalTestResult,
} from "@/app/Doctor/Patient/ToExamine/[id]/CreateResults/CreateResultsComponent/ViewParaclinicalResults";
import { getResultsByRequestTesting } from "@/app/services/DoctorSevices";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Badge,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { FaTrash } from "react-icons/fa6";

export interface valueForm {
  Id_YeuCauXetNghiem?: string;
  Id_PhieuKhamBenh?: string;
  Id_NguoiXetNghiem?: string;
  MaXetNghiem?: string;
  TenXetNghiem?: string;
  LoaiKetQua?: "DinhTinh" | "DinhLuong" | "HinhAnh" | "MoTa";
  KetQua?: string;
  DonViTinh?: string;
  ChiSoBinhThuong?: string;
  GhiChu?: string;
  NgayXetNghiem?: string;
  Gio?: string;
  Image?: File;
  LoaiChup?: string;
  VungChup?: string;
  NguonThamChieu?: string;
  GioiHanCanhBao?: string;
}

export default function GenerateTestResults() {
  const router = useRouter();
  const [dataForm, setDataForm] = useState<valueForm>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [showResultsPopup, setShowResultsPopup] = useState<boolean>(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [dataResule, setDataResule] = useState<NormalTestResult[]>([]);
  const [hasResults, setHasResults] = useState<boolean>(false);
  const [resultCount, setResultCount] = useState<number>(0);
  const [tenXetNghiem, setTenXetNghiem] = useState<string>("");
  const [LoaiKetQua, setLoaiKetQua] = useState<string>("");
  const [maXetNghiem, setMaXetNghiem] = useState<string>("");

  const validateForm = () => {
    if (LoaiKetQua === "DinhLuong" || LoaiKetQua === "DinhTinh") {
      return (
        !dataForm?.ChiSoBinhThuong?.trim() ||
        !dataForm?.DonViTinh?.trim() ||
        !dataForm?.KetQua?.trim() ||
        !dataForm?.GhiChu?.trim()
      );
    } else if (LoaiKetQua === "HinhAnh") {
      return !dataForm?.KetQua?.trim() || !dataForm?.GhiChu?.trim();
    } else if (LoaiKetQua === "MoTa") {
      return !dataForm?.KetQua?.trim() || !dataForm?.GhiChu?.trim();
    }
    return false;
  };

  useEffect(() => {
    const loaddingtenXetNghiem = async () => {
      const localData = sessionStorage.getItem("idGenerateTestResult");
      if (!localData)
        return showToast("Thiếu dữ liệu id Form", ToastType.error);
      try {
        const parsed = JSON.parse(localData);
        setTenXetNghiem(parsed.TenXetNghiem || "");
        setLoaiKetQua(parsed.LoaiKetQua || "");
        setMaXetNghiem(parsed.MaXetNghiem || "");
        const data = await getResultsByRequestTesting(
          parsed.Id_YeuCauXetNghiem
        );
        setHasResults(data && data.length > 0);
        setResultCount(data.length);
      } catch (error) {
        console.error("Lỗi parse JSON:", error);
        showToast("Lỗi dữ liệu trong sessionStorage", ToastType.error);
      }
    };
    loaddingtenXetNghiem();
  }, []);

  const handleResultTest = async () => {
    setShowModal(false);
    if (validateForm()) return showToast("Thiếu dữ liệu Form", ToastType.error);

    const localData = sessionStorage.getItem("idGenerateTestResult");
    if (!localData) return showToast("Thiếu dữ liệu id Form", ToastType.error);
    const parsed = JSON.parse(localData);
    const fullForm: valueForm = {
      ...dataForm,
      Id_YeuCauXetNghiem: parsed.Id_YeuCauXetNghiem,
      Id_PhieuKhamBenh: parsed.Id_PhieuKhamBenh,
      Id_NguoiXetNghiem: parsed.Id_NguoiXetNghiem,
      TenXetNghiem: parsed.TenXetNghiem,
      MaXetNghiem: parsed.MaXetNghiem,
    };
    const data = await generateTestResults(fullForm);
    if (data) {
      setDataForm({});
      if (imageInputRef.current) imageInputRef.current.value = "";
      setHasResults(true);
      setResultCount((prev) => prev + 1);
    }
  };

  const completeTheTest = async () => {
    if (!hasResults) {
      showToast(
        "Không thể hoàn thành khi chưa có kết quả xét nghiệm",
        ToastType.error
      );
      return;
    }
    const localData = sessionStorage.getItem("idGenerateTestResult");
    if (!localData) return showToast("Thiếu dữ liệu id Form", ToastType.error);
    const parsed = JSON.parse(localData);
    const result = await handleCompleteTheTests(parsed.Id_YeuCauXetNghiem);
    if (result)
      router.push(
        `/LaboratoryDoctor/TestWaitingList/${parsed.Id_PhieuKhamBenh}`
      );
  };

  const handleView = async () => {
    const localData = sessionStorage.getItem("idGenerateTestResult");
    if (!localData) return showToast("Thiếu dữ liệu id Form", ToastType.error);
    const parsed = JSON.parse(localData);
    const data = await getResultsByRequestTesting(parsed.Id_YeuCauXetNghiem);
    if (!data || data.length === 0)
      return showToast("Không tìm thấy kết quả xét nghiệm", ToastType.warn);
    setDataResule(data);
    setShowResultsPopup(true);
    setHasResults(true);
    setResultCount(data.length);
  };

  return (
    <>
      <Tabbar
        tabbarItems={{
          tabbarItems: [
            {
              text: "Tạo kết quả xét nghiệm",
              link: "/LaboratoryDoctor/GenerateTestResults",
            },
          ],
        }}
      />
      {showResultsPopup && (
        <ViewParaclinicalResults
          dataFromOutside={dataResule}
          onClose={() => setShowResultsPopup(false)}
        />
      )}
      <ModalComponent
        Data_information={{
          content: "Kết thúc quá trình tạo kết quả",
          remid: "Vui lòng tạo đầy đủ trước khi xác nhận",
          handleClose: () => setShowModal(false),
          show: showModal,
          handleShow: () => {},
          callBack: handleResultTest,
        }}
      />
      <ModalComponent
        Data_information={{
          content: "Kết thúc quá trình xác nhận",
          remid: "Vui lòng xác nhận lại",
          handleClose: () => setShowResult(false),
          show: showResult,
          handleShow: () => {},
          callBack: completeTheTest,
        }}
      />

      <Box className="generate-test-results-container">
        <Typography variant="h5" sx={{ mb: 2 }}>
          Tạo kết quả xét nghiệm
        </Typography>

        <Box
          className="generate-test-results-container__boxClick1"
          sx={{ display: "flex", gap: 2 }}
        >
          <Badge
            badgeContent={resultCount}
            color="error"
            invisible={!hasResults || resultCount === 0}
            sx={{
              "& .MuiBadge-badge": {
                fontSize: "11px",
                minWidth: "18px",
                height: "18px",
              },
            }}
          >
            <Button
              variant="contained"
              color="primary"
              disabled={!hasResults}
              onClick={handleView}
              startIcon={<VisibilityIcon />}
              title={!hasResults ? "Chưa có kết quả để xem" : ""}
            >
              Xem kết quả
            </Button>
          </Badge>

          <Button
            variant="contained"
            color="secondary"
            disabled={!hasResults}
            onClick={() => setShowResult(true)}
            startIcon={<DoneAllIcon />}
            title={
              !hasResults
                ? "Cần có kết quả xét nghiệm trước khi hoàn thành"
                : ""
            }
          >
            Hoàn thành xét nghiệm
          </Button>
        </Box>

        <Paper
          sx={{
            p: 3,
            mt: 1,
            gap: "25px",
            display: "flex",
            boxShadow: "none",
          }}
        >
          <Box className="form-container-uploadSection">
            {dataForm?.Image ? (
              <Box
                sx={{
                  position: "relative",
                  width: 250,
                  height: 180,
                  borderRadius: 2,
                  overflow: "hidden",
                  marginRight: "22px",
                  border: "1px solid #ccc",
                  cursor: "pointer",
                  "&:hover .delete-icon": {
                    opacity: 1,
                  },
                }}
              >
                <img
                  src={URL.createObjectURL(dataForm.Image)}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <Box
                  className="delete-icon"
                  onClick={() => {
                    setDataForm((prev) => ({ ...prev, Image: undefined }));
                    if (imageInputRef.current) imageInputRef.current.value = "";
                  }}
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.24)",
                    color: "white",
                    width: "100%",
                    height: "100%",
                    fontSize: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    opacity: 0,
                    transition: "opacity 0.3s",
                  }}
                >
                  <FaTrash />
                </Box>
              </Box>
            ) : (
              <label className="upload-box">
                <CloudUploadIcon fontSize="large" />
                <p>Chọn ảnh</p>
                <input
                  type="file"
                  ref={imageInputRef}
                  accept="image/*"
                  onChange={(e) =>
                    setDataForm((prev) => ({
                      ...prev,
                      Image: e.target.files?.[0] || undefined,
                    }))
                  }
                />
              </label>
            )}

            <Typography
              variant="body2"
              className="upload-warning"
              sx={{ width: "210px", mt: 1 }}
            >
              {dataForm?.Image ? dataForm.Image.name : "Vui lòng chọn ảnh"}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gap: "15px",
              width: "100%",
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            <TextField
              fullWidth
              label="Tên xét nghiệm"
              value={tenXetNghiem}
              InputProps={{ readOnly: true }}
              sx={{ mb: 2, gridColumn: "span 1" }}
            />
            <TextField
              fullWidth
              label="Mã xét nghiệm"
              value={maXetNghiem}
              InputProps={{ readOnly: true }}
              sx={{ mb: 2 }}
            />

            {LoaiKetQua === "DinhLuong" || LoaiKetQua === "DinhTinh" ? (
              <>
                <TextField
                  fullWidth
                  label="Chỉ số bình thường"
                  value={dataForm?.ChiSoBinhThuong || ""}
                  onChange={(e) =>
                    setDataForm((prev) => ({
                      ...prev,
                      ChiSoBinhThuong: e.target.value,
                    }))
                  }
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Đơn vị tính"
                  value={dataForm?.DonViTinh || ""}
                  onChange={(e) =>
                    setDataForm((prev) => ({
                      ...prev,
                      DonViTinh: e.target.value,
                    }))
                  }
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Kết quả"
                  multiline
                  rows={3}
                  value={dataForm?.KetQua || ""}
                  onChange={(e) =>
                    setDataForm((prev) => ({ ...prev, KetQua: e.target.value }))
                  }
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Ghi chú"
                  multiline
                  rows={3}
                  value={dataForm?.GhiChu || ""}
                  onChange={(e) =>
                    setDataForm((prev) => ({ ...prev, GhiChu: e.target.value }))
                  }
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Giới hạn cảnh báo"
                  value={dataForm?.GioiHanCanhBao || ""}
                  onChange={(e) =>
                    setDataForm((prev) => ({
                      ...prev,
                      GioiHanCanhBao: e.target.value,
                    }))
                  }
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Nguồn tham chiếu"
                  value={dataForm?.NguonThamChieu || ""}
                  onChange={(e) =>
                    setDataForm((prev) => ({
                      ...prev,
                      NguonThamChieu: e.target.value,
                    }))
                  }
                  sx={{ mb: 2 }}
                />
              </>
            ) : LoaiKetQua === "HinhAnh" ? (
              <>
                <TextField
                  fullWidth
                  label="Mô tả"
                  multiline
                  rows={3}
                  value={dataForm?.KetQua || ""}
                  onChange={(e) =>
                    setDataForm((prev) => ({ ...prev, KetQua: e.target.value }))
                  }
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Kết luận"
                  multiline
                  rows={3}
                  value={dataForm?.GhiChu || ""}
                  onChange={(e) =>
                    setDataForm((prev) => ({ ...prev, GhiChu: e.target.value }))
                  }
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Loại chụp"
                  value={dataForm?.LoaiChup || ""}
                  onChange={(e) =>
                    setDataForm((prev) => ({
                      ...prev,
                      LoaiChup: e.target.value,
                    }))
                  }
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Vùng chụp"
                  value={dataForm?.VungChup || ""}
                  onChange={(e) =>
                    setDataForm((prev) => ({
                      ...prev,
                      VungChup: e.target.value,
                    }))
                  }
                  sx={{ mb: 2 }}
                />
              </>
            ) : LoaiKetQua === "MoTa" ? (
              <>
                <TextField
                  fullWidth
                  label="Mẫu bệnh phẩm"
                  value={dataForm?.MaXetNghiem || ""}
                  onChange={(e) =>
                    setDataForm((prev) => ({
                      ...prev,
                      MaXetNghiem: e.target.value,
                    }))
                  }
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Mô tả"
                  multiline
                  rows={3}
                  value={dataForm?.KetQua || ""}
                  onChange={(e) =>
                    setDataForm((prev) => ({ ...prev, KetQua: e.target.value }))
                  }
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Kết luận"
                  multiline
                  rows={3}
                  value={dataForm?.GhiChu || ""}
                  onChange={(e) =>
                    setDataForm((prev) => ({ ...prev, GhiChu: e.target.value }))
                  }
                  sx={{ mb: 2 }}
                />
              </>
            ) : null}

            <Box
              display="flex"
              gridColumn={"span 2"}
              width={"100%"}
              justifyContent="end"
              gap={2}
            >
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => router.back()}
                startIcon={<ArrowBackIcon />}
              >
                Quay lại
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => setShowModal(true)}
                startIcon={<AddCircleIcon />}
              >
                Tạo kết quả xét nghiệm
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
}
