"use client";

import {
  Box,
  FormControl,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  TextField,
  Stack,
  Divider,
} from "@mui/material";
import BreadcrumbComponent from "../component/Breadcrumb";
import { SettingsIcon } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { BackendChonPhong, fetchKhoaList, fetchSettings, FrontendChonPhong, KhoaData, updateKhoaCanLamSang, updateSettings } from "../services/Setting";

// Hook lấy chế độ dark/light từ data-toolpad-color-scheme
function useToolpadColorScheme() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const updateScheme = () => {
      const scheme = document.documentElement.getAttribute(
        "data-toolpad-color-scheme"
      );
      setIsDarkMode(scheme === "dark");
    };

    updateScheme();

    const observer = new MutationObserver(updateScheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-toolpad-color-scheme"],
    });

    return () => observer.disconnect();
  }, []);

  return isDarkMode;
}

// Wrapper cho từng phần
const SectionWrapper = ({
  title,
  children,
  isDarkMode,
}: {
  title: string;
  children: React.ReactNode;
  isDarkMode: boolean;
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        boxShadow: "none",
        px: 1,
        background: "none",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          py: 1,
          width: "fit-content",
          borderRadius: 1,
          mb: 2,
        }}
      >
        <SettingsIcon size={16} />
        <Typography
          fontWeight={600}
          fontSize={16}
          color={isDarkMode ? "#fff" : "#111"}
        >
          {title}
        </Typography>
      </Box>

      <Box sx={{ pl: 3 }}>{children}</Box>
    </Paper>
  );
};

export default function Page() {
  const isDarkMode = useToolpadColorScheme();
  const [khoaList, setKhoaList] = useState<KhoaData[]>([]);
  const [middayDuration, setMiddayDuration] = useState(15);
  const [applyToAllDoctors, setApplyToAllDoctors] = useState(false);
  const [globalLimit, setGlobalLimit] = useState(50);
  const [limitError, setLimitError] = useState("");
  const [chonPhong, setChonPhong] = useState<FrontendChonPhong>("thuCong");
  const [documentId, setDocumentId] = useState<string | null>(null);

  // Map frontend radio values to backend enum values
  const mapChonPhongToBackend = (value: FrontendChonPhong): BackendChonPhong => {
    const mapping: Record<FrontendChonPhong, BackendChonPhong> = {
      thuCong: "ThuCong",
      itNguoiNhat: "ItNguoi",
      phongGan: "PhongGan",
      ganDay: "GanDay",
      phongXa: "PhongXa",
    };
    return mapping[value];
  };

  // Map backend enum values to frontend radio values
  const mapChonPhongToFrontend = (value: BackendChonPhong): FrontendChonPhong => {
    const mapping: Record<BackendChonPhong, FrontendChonPhong> = {
      ThuCong: "thuCong",
      ItNguoi: "itNguoiNhat",
      PhongGan: "phongGan",
      GanDay: "ganDay",
      PhongXa: "phongXa",
    };
    return mapping[value] || "thuCong";
  };

  // Fetch settings and khoa list
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load settings
        const settingsData = await fetchSettings();
        if (settingsData) {
          setChonPhong(mapChonPhongToFrontend(settingsData.ChonPhong));
          setMiddayDuration(settingsData.ThoiGianKham);
          setApplyToAllDoctors(settingsData.ApDungThoiGianKham);
          setGlobalLimit(settingsData.GioiHanBenhNhan);
          setDocumentId(settingsData._id);
        }

        // Load khoa list
        const khoaData = await fetchKhoaList();
        setKhoaList(khoaData);
      } catch (err) {
        console.error(err instanceof Error ? err.message : "Lỗi khi tải dữ liệu");
      }
    };
    loadData();
  }, []);

  // Save settings changes with debouncing
  const saveChanges = useCallback(
    async () => {
      if (limitError || !documentId) {
        return;
      }

      const dataToUpdate = {
        ChonPhong: mapChonPhongToBackend(chonPhong),
        ThoiGianKham: middayDuration,
        ApDungThoiGianKham: applyToAllDoctors,
        GioiHanBenhNhan: globalLimit,
      };

      try {
        await updateSettings(documentId, dataToUpdate);
      } catch {
        console.error("Lỗi khi cập nhật dữ liệu");
      }
    },
    [chonPhong, middayDuration, applyToAllDoctors, globalLimit, limitError, documentId]
  );

  // Debounced save effect for settings
  useEffect(() => {
      saveChanges();
  }, [saveChanges]);

  // Handle CanLamSang toggle
  const handleToggle = useCallback(
    async (id: string, currentStatus: boolean) => {
      try {
        const newStatus = !currentStatus;
        const status = await updateKhoaCanLamSang(id, newStatus);
        if (status === "Cập nhật CanLamSang thành công") {
          setKhoaList((prev) =>
            prev.map((item) =>
              item._id === id ? { ...item, CanLamSang: newStatus } : item
            )
          );
        }
      } catch {
        console.error("Lỗi khi cập nhật CanLamSang");
      }
    },
    []
  );

  return (
    <div className="AdminContent-Container">
      <BreadcrumbComponent
        items={[
          { title: "Trang chủ", href: "/Admin" },
          { title: "Cài đặt hệ thống" },
        ]}
      />

      <Box sx={{ p: 3 }}>
        {/* CHỌN PHÒNG */}
        <SectionWrapper
          title="Tùy chọn chọn phòng khi tạo phiếu khám"
          isDarkMode={isDarkMode}
        >
          <Typography fontSize={13} color="text.secondary" mb={1}>
            Hệ thống sẽ dùng quy tắc dưới đây để gợi ý phòng khám khi tiếp nhận
            bệnh nhân.
          </Typography>
          <FormControl>
            <RadioGroup
              name="chonPhong"
              value={chonPhong}
              onChange={(e) => setChonPhong(e.target.value as FrontendChonPhong)}
            >
              {[
                ["thuCong", "Thủ công – người dùng chọn"],
                ["itNguoiNhat", "Tự động – ít người chờ nhất"],
                ["phongGan", "Tự động – ưu tiên phòng gần nhất"],
                ["phongXa", "Tự động – ưu tiên phòng xa nhất"],
                ["ganDay", "Tự động – ưu tiên phòng gần đầy"],
              ].map(([value, label]) => (
                <FormControlLabel
                  key={value}
                  value={value}
                  control={<Radio color="primary" />}
                  label={label}
                />
              ))}
              <FormControlLabel
                value="goiy"
                disabled
                control={<Radio />}
                label="(Gợi ý) – Sẽ phát triển sau"
              />
            </RadioGroup>
          </FormControl>
        </SectionWrapper>
        <Divider
          sx={{
            marginTop: "10px",
            marginBottom: "15px",
          }}
        />
        {/* THỜI GIAN KHÁM TRUNG BÌNH */}
        <SectionWrapper
          title={`Thời gian khám trung bình: [ ${middayDuration} phút ]`}
          isDarkMode={isDarkMode}
        >
          <Stack spacing={2}>
            <TextField
              type="number"
              value={middayDuration}
              onChange={(e) => setMiddayDuration(Number(e.target.value))}
              label="Thời gian (phút)"
              size="small"
              sx={{ width: 200 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={applyToAllDoctors}
                  onChange={(e) => setApplyToAllDoctors(e.target.checked)}
                  color="primary"
                />
              }
              label="Áp dụng cho tất cả bác sĩ tại phòng khám"
            />
            <Typography fontSize={13} color="text.secondary">
              Thời gian trung bình sẽ được dùng để phân bổ lịch hợp lý hơn.
            </Typography>
          </Stack>
        </SectionWrapper>
        <Divider
          sx={{
            marginTop: "10px",
            marginBottom: "15px",
          }}
        />
        {/* GIỚI HẠN TỐI ĐA */}
        <SectionWrapper
          title="Giới hạn số lượng tiếp nhận bệnh nhân"
          isDarkMode={isDarkMode}
        >
          <Stack spacing={2}>
            <TextField
              type="number"
              value={globalLimit}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value < 1 || value > 50) {
                  setLimitError("Giới hạn phải từ 1 đến 50 bệnh nhân.");
                } else {
                  setLimitError("");
                  setGlobalLimit(value);
                }
              }}
              label="Bệnh nhân/Phòng"
              size="small"
              sx={{ width: 250 }}
              error={!!limitError}
              helperText={limitError}
            />
            <Typography fontSize={13} color="text.secondary">
              Áp dụng cho tất cả phòng.
            </Typography>
          </Stack>
        </SectionWrapper>
        <Divider
          sx={{
            marginTop: "10px",
            marginBottom: "15px",
          }}
        />
        {/* BẬT TẮT YÊU CẦU CLS */}
        <SectionWrapper
          title="Khoa được phép yêu cầu cận lâm sàng (CLS)"
          isDarkMode={isDarkMode}
        >
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: isDarkMode ? "#2c2c2c" : "#f9f9f9" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Tên khoa</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {khoaList.map((row) => (
                  <TableRow
                    key={row._id}
                    hover
                    sx={{ transition: "background 0.2s ease" }}
                  >
                    <TableCell>{row.TenKhoa}</TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography
                          fontSize={13}
                          fontWeight={500}
                          color={
                            row.CanLamSang ? "success.main" : "text.secondary"
                          }
                        >
                          {row.CanLamSang ? "Bật" : "Tắt"}
                        </Typography>
                        <Switch
                          checked={row.CanLamSang}
                          onChange={() => handleToggle(row._id, row.CanLamSang)}
                          color="success"
                          size="small"
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography color="error" fontSize={13} mt={2}>
            * Lưu ý: Nếu tắt CLS, khoa sẽ không thể gửi yêu cầu xét nghiệm/chẩn
            đoán hình ảnh.
          </Typography>
        </SectionWrapper>
      </Box>
    </div>
  );
}