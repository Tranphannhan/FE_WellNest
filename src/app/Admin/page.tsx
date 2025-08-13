'use client';

import { Box, Typography, Paper } from '@mui/material';
import {
  FaClipboardList,
  FaUserMd,
  FaChartBar,
  FaCogs,
  FaTags,
  FaPills,
  FaHome,
  FaFileInvoice
} from 'react-icons/fa';

export default function PageAdmin() {
  return (
    <div className="AdminContent-Container">
      <Box width="100%" p={2}>
        <Typography variant="h4" fontWeight="bold" color="primary" mb={2}>
          Chào mừng đến trang Admin WellNest
        </Typography>

        <Typography variant="body1" mb={4}>
          Bạn đang truy cập vào <strong>Hệ thống quản lý quy trình khám bệnh WellNest</strong>.
        </Typography>

        <Box
          display="flex"
          flexDirection={{ xs: 'column', md: 'row' }}
          flexWrap="wrap"
          gap={3}
        >
          <FeatureCard
            icon={<FaChartBar size={24} color="#1976d2" />}
            title="Thống kê"
            description="Xem báo cáo tổng hợp về lượt khám, đơn thuốc và hoạt động khám chữa bệnh."
          />

          <FeatureCard
            icon={<FaUserMd size={24} color="#1976d2" />}
            title="Nhân sự"
            description="Quản lý thông tin bác sĩ, dược sĩ, nhân viên tiếp nhận và tài khoản truy cập."
          />

          <FeatureCard
            icon={<FaHome size={24} color="#1976d2" />}
            title="Phòng"
            description="Quản lý danh sách phòng khám, phòng xét nghiệm và phân công bác sĩ."
          />

          <FeatureCard
            icon={<FaClipboardList size={24} color="#1976d2" />}
            title="Danh mục"
            description="Tùy chỉnh các danh mục bệnh, loại hình khám và xét nghiệm."
          />

          <FeatureCard
            icon={<FaTags size={24} color="#1976d2" />}
            title="Giá dịch vụ"
            description="Quản lý bảng giá khám bệnh, xét nghiệm và thuốc."
          />

          <FeatureCard
            icon={<FaFileInvoice size={24} color="#1976d2" />}
            title="Hóa đơn"
            description="Xử lý thanh toán, tạo hóa đơn và tra cứu thông tin tài chính."
          />

          <FeatureCard
            icon={<FaPills size={24} color="#1976d2" />}
            title="Thuốc"
            description="Danh mục thuốc, quản lý tồn kho và phân phối đơn thuốc."
          />

          <FeatureCard
            icon={<FaClipboardList size={24} color="#1976d2" />}
            title="Theo dõi hệ thống"
            description="Giám sát luồng hoạt động của hệ thống và theo dõi nhật ký truy cập."
          />

          <FeatureCard
            icon={<FaCogs size={24} color="#1976d2" />}
            title="Cấu hình hệ thống"
            description="Tùy chỉnh phân quyền, giới hạn bệnh nhân, cấu hình phòng và thời gian khám."
          />
        </Box>

        <Typography mt={6} color="text.secondary" fontSize={14}>
          Hệ thống được xây dựng nhằm tối ưu hóa hoạt động quản lý và nâng cao hiệu quả khám chữa bệnh.
        </Typography>
      </Box>
    </div>
  );
}

// Component tái sử dụng cho mỗi ô chức năng
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        flex: '1 1 250px',
        bgcolor: '#e3f2fd',
        borderRadius: 2,
        minHeight: 70,
      }}
    >
      <Box display="flex" alignItems="center" mb={1}>
        <Box mr={1}>{icon}</Box>
        <Typography variant="subtitle1" fontWeight="bold" color="primary">
          {title}
        </Typography>
      </Box>
      <Typography fontSize={14} color="text.primary">
        {description}
      </Typography>
    </Paper>
  );
}
