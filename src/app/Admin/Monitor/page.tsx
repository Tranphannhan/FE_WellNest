"use client";

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
import BreadcrumbComponent from "../component/Breadcrumb";
import { FaHouseMedical } from "react-icons/fa6";

const monitorData = [
  {
    label: "Khoa hoạt động",
    icon: <MdLocalHospital size={28} color="#e91e63" />,
    value: 7,
  },
  {
    label: "Phòng khám hoạt động",
    icon: <FaHouseMedical  size={28} color="#4caf50" />,
    value: 5,
  },
  {
    label: "Phòng thiết bị hoạt động",
    icon: <MdOutlineVaccines size={28} color="#388e3c" />,
    value: 4,
  },
  {
    label: "Đang khám",
    icon: <MdOutlineMonitorHeart size={28} color="#1976d2" />,
    value: 12,
  },
  {
    label: "Chờ khám",
    icon: <MdPendingActions size={28} color="#ffa000" />,
    value: 20,
  },

  {
    label: "Yêu cầu chờ thanh toán",
    icon: <MdOutlinePayments size={28} color="#f57c00" />,
    value: 6,
  },
  {
    label: "Yêu cầu chờ xét nghiệm",
    icon: <MdOutlineAssignment size={28} color="#0097a7" />,
    value: 4,
  },
  {
    label: "Đơn thuốc chờ thanh toán",
    icon: <MdOutlineReceiptLong size={28} color="#7b1fa2" />,
    value: 3,
  },
  {
    label: "Đơn thuốc chờ phát thuốc",
    icon: <MdOutlineMedication size={28} color="#c2185b" />,
    value: 2,
  },
];

export default function MonitorPage() {
  const getUnit = (label: string): string => {
    if (label.includes("Khoa")) return "khoa";
    if (label.includes("Phòng thiết bị")) return "phòng";
    if (label.includes("Phòng")) return "phòng";
    if (label.includes("xét nghiệm")) return "yêu cầu";
    if (label.includes("Đơn thuốc")) return "đơn";
    if (label.includes("Yêu cầu")) return "yêu cầu";
    if (label.includes("khám")) return "người";
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
                    fontSize: '16px',
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
