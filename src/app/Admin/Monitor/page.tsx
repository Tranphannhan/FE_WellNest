"use client";

import { useEffect, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import {
  MdLocalHospital,
  MdPendingActions,
  MdOutlineMonitorHeart,
  MdOutlineReceiptLong,
  MdOutlinePayments,
  MdOutlineMedication,
  MdOutlineVaccines,
  MdOutlineAssignment
} from "react-icons/md";
import { FaHouseMedical } from "react-icons/fa6";
import BreadcrumbComponent from "../component/Breadcrumb";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const initialMonitorData = [
  {
    label: "Khoa hoạt động",
    icon: <MdLocalHospital size={28} color="#e91e63" />,
    value: 0,
    api: `${API_BASE_URL}/Khoa/Pagination?TrangThaiHoatDong=true`,
    field: "TenKhoa",
  },
  {
    label: "Phòng khám hoạt động",
    icon: <FaHouseMedical size={28} color="#4caf50" />,
    value: 0,
    api: `${API_BASE_URL}/Phong_Kham/Pagination?TrangThaiHoatDong=true`,
    field: "SoPhongKham",
  },
  {
    label: "Phòng thiết bị hoạt động",
    icon: <MdOutlineVaccines size={28} color="#388e3c" />,
    value: 0,
    api: `${API_BASE_URL}/Phong_Thiet_Bi/Pagination?TrangThaiHoatDong=true`,
    field: "TenPhongThietBi",
  },
  {
    label: "Đang khám",
    icon: <MdOutlineMonitorHeart size={28} color="#1976d2" />,
    value: 0,
    api: `${API_BASE_URL}/Phieu_Kham_Benh?TrangThaiHoatDong=Kham&TrangThai=false&NgayHienTai=true`,
    field: "SoNguoiDangKham",
  },
  {
    label: "Vắng mặt",
    icon: <MdPendingActions size={28} color="#ffa000" />,
    value: 0,
    api: `${API_BASE_URL}/Phieu_Kham_Benh?TrangThaiHoatDong=BoQua&TrangThai=false&NgayHienTai=true`,
    field: "SoNguoiVangMat",
  },
  {
    label: "Xét nghiệm chờ thanh toán",
    icon: <MdOutlinePayments size={28} color="#f57c00" />,
    value: 0,
    api: `${API_BASE_URL}/Yeu_Cau_Xet_Nghiem/TimKiemTheoSDTHoacIdPhieuKhamBenh/Pagination&TrangThaiThanhToan=true`,
    field: "SoNguoiChoThanhToan",
  },
  {
    label: "Chờ xét nghiệm",
    icon: <MdOutlineAssignment size={28} color="#0097a7" />,
    value: 0,
    api: `${API_BASE_URL}/Yeu_Cau_Xet_Nghiem?TrangThaiThanhToan=true&TrangThai=false&TrangThaiHoatDong=true&NgayHienTai=true`,
    field: "SoNguoiVangMat",
  },
  {
    label: "Đơn thuốc chờ thanh toán",
    icon: <MdOutlineReceiptLong size={28} color="#7b1fa2" />,
    value: 0,
    api: `${API_BASE_URL}/Donthuoc/TimKiemTheoSDTHoacIdPhieuKhamBenh/Pagination?TrangThaiThanhToan=false`,
    field: "DonThuocChoThanhToan",
  },
  {
    label: "Đơn thuốc chờ phát thuốc",
    icon: <MdOutlineMedication size={28} color="#c2185b" />,
    value: 0,
    api: `${API_BASE_URL}/Donthuoc/DanhSachPhatThuoc/Pagination`,
    field: "DonThuocChoThanhToan",
  },
];

export default function MonitorPage() {
  const [monitorData, setMonitorData] = useState(initialMonitorData);

useEffect(() => {
  const fetchData = async () => {
    const newData = await Promise.all(
      initialMonitorData.map(async (item) => {
        if (!item.api) return item;

        try {
          const res = await fetch(item.api);
          const json = await res.json();

          if (json.totalItems !== undefined) {
            return { ...item, value: json.totalItems };
          }

          if (json.total !== undefined) {
            return { ...item, value: json.total };
          }

          if (Array.isArray(json)) {
            return { ...item, value: json.length };
          }

          if (Array.isArray(json.data)) {
            return { ...item, value: json.data.length };
          }

          if (
            typeof json.data === "object" &&
            json.data !== null
          ) {
            if (json.data.totalItems !== undefined) {
              return { ...item, value: json.data.totalItems };
            }
            if (json.data.total !== undefined) {
              return { ...item, value: json.data.total };
            }
            if (Array.isArray(json.data.data)) {
              return { ...item, value: json.data.data.length };
            }
          }

          console.warn(`Không tìm thấy tổng phù hợp cho API: ${item.api}`, json);
          return item;
        } catch (err) {
          console.error("Error fetching:", item.label, err);
          return item;
        }
      })
    );

    setMonitorData(newData);
  };

  fetchData();
}, []);


  const getUnit = (label: string): string => {
    if (label.includes("Khoa")) return "khoa";
    if (label.includes("Phòng thiết bị")) return "phòng";
    if (label.includes("Phòng")) return "phòng";
    if (label.includes("xét nghiệm")) return "yêu cầu";
    if (label.includes("Đơn thuốc")) return "đơn";
    if (label.includes("Yêu cầu")) return "yêu cầu";
    if (label.includes("Xét nghiệm chờ thanh toán")) return "yêu cầu";
    if (label.includes("khám")) return "người";
    if (label.includes("Vắng mặt")) return "người";
    return "";
  };

  return (
    <div className="AdminContent-Container">
      <BreadcrumbComponent
        items={[
          { title: "Trang chủ", href: "/Admin" },
          { title: "Theo dõi hệ thống" },
        ]}
      />
      <Box sx={{ background: "none" }}>
        <Typography
          variant="h5"
          fontWeight={600}
          mb={3}
          sx={{
            textAlign: { xs: "center", sm: "left" },
            fontSize: "25px",
          }}
        >
          Theo dõi hệ thống
        </Typography>

        <Box
          sx={{
            padding: "0 20px 20px 20px",
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 3,
            rowGap: 4,
          }}
        >
          {monitorData.map((item, index) => (
            <Paper
              key={index}
              elevation={4}
              sx={{
                p: 3,
                display: "flex",
                boxShadow:
                  " rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;",
                alignItems: "center",
                gap: 2,
                bgcolor: "#f3fcff",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                },
              }}
            >
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: "8px",
                  bgcolor: `${item.icon.props.color}15`,
                }}
              >
                {item.icon}
              </Box>
              <Box sx={{ backgroundColor: "#f3fcff" }}>
                <Typography
                  variant="body2"
                  color="#646464"
                  sx={{
                    fontSize: "16px",
                    fontWeight: 500,
                    mb: 0.5,
                  }}
                >
                  {item.label}
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  sx={{
                    color: item.icon.props.color,
                    fontSize: { xs: "1.5rem", sm: "1.75rem" },
                    display: "flex",
                    alignItems: "baseline",
                    gap: 1,
                  }}
                >
                  {item.value}
                  <Typography
                    component="span"
                    sx={{
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      color: "#888",
                    }}
                  >
                    {getUnit(item.label)}
                  </Typography>
                </Typography>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>
    </div>
  );
}
