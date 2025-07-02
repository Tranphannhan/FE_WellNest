"use client";
import CustomTable from "../../component/CustomTable";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Chip,
} from "@mui/material";
import { useState, useMemo } from "react";

import "./Staff.css";
import BreadcrumbComponent from "../../component/Breadcrumb";

const columns = [
  { id: "Image", label: "Ảnh", sortable: false, Outstanding: false },
  { id: "TenTaiKhoan", label: "Họ tên", sortable: true, Outstanding: true },
  { id: "GioiTinh", label: "Giới tính", sortable: true, Outstanding: false },
  { id: "SoDienThoai", label: "SĐT", sortable: false, Outstanding: false },
  {
    id: "TenLoai",
    label: "Loại tài khoản",
    sortable: true,
    Outstanding: true,
  },
  {
    id: "TrangThaiHoatDong",
    label: "Trạng thái",
    sortable: true,
    Outstanding: false,
  },
];

const rows = [
  {
    _id: "1",
    TenTaiKhoan: "Nguyễn Văn A",
    GioiTinh: "Nam",
    SoDienThoai: "0912345678",
    TrangThaiHoatDong: true,
    Image: "https://i.pravatar.cc/100?img=1",
    TenLoai: "Thu ngân",
  },
  {
    _id: "2",
    TenTaiKhoan: "Trần Thị B",
    GioiTinh: "Nữ",
    SoDienThoai: "0987654321",
    TrangThaiHoatDong: false,
    Image: "https://i.pravatar.cc/100?img=2",
    TenLoai: "Xét nghiệm",
  },
  {
    _id: "3",
    TenTaiKhoan: "Lê Văn C",
    GioiTinh: "Nam",
    SoDienThoai: "0900000000",
    TrangThaiHoatDong: true,
    Image: "https://i.pravatar.cc/100?img=3",
    TenLoai: "Dược sĩ",
  },
];

const TenLoaiOP = Array.from(new Set(rows.map((row) => row.TenLoai)));

export default function Page() {
  const [searchText, setSearchText] = useState("");
  const [selectedLoai, setSelectedLoai] = useState("");

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchSearch = row.TenTaiKhoan.toLowerCase().includes(
        searchText.toLowerCase()
      );
      const matchLoai = selectedLoai ? row.TenLoai === selectedLoai : true;
      return matchSearch && matchLoai;
    });
  }, [searchText, selectedLoai]);

  return (
    <>
      <BreadcrumbComponent
        items={[
          { title: "Trang chủ", href: "/Admin" },
          { title: "Nhân sự", href: "/Admin/HumanResources/Staff" },
          { title: "Nhân viên" },
        ]}
      />
      <div className="AdminContent-Container">
        {/* FORM TÌM KIẾM & FILTER */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            mb: 2,
            alignItems: "center",
          }}
        >
          <TextField
            sx={{
              width: 250, // Cố định chiều rộng
              "& .MuiInputBase-root": {
                paddingRight: "8px", // Đảm bảo có khoảng trống cho nút xóa
                "& .MuiInputAdornment-root": {
                  color: "#9e9e9e",
                  transition: "color 0.3s",
                },
              },
              "&:hover .MuiInputAdornment-root": {
                color: "#424242",
              },
              "& .Mui-focused .MuiInputAdornment-root": {
                color: "#1976d2",
              },
            }}
            size="small"
            placeholder="Tìm theo tên bác sĩ..."
            variant="outlined"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: "20px", cursor: "pointer" }} />
                </InputAdornment>
              ),
              endAdornment: searchText && (
                <InputAdornment position="end">
                  <CloseIcon
                    sx={{ fontSize: "20px", cursor: "pointer" }}
                    onClick={() => setSearchText("")}
                  />
                </InputAdornment>
              ),
            }}
          />

          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel
              sx={{
                fontSize: 14,
                top: 2,
              }}
            >
              Loại tài khoản
            </InputLabel>
            <Select
              label="Loại tài khoản"
              value={selectedLoai}
              onChange={(e) => setSelectedLoai(e.target.value)}
              sx={{
                fontSize: 14,
                height: 40,
                pl: 1,
                "& .MuiSelect-icon": {
                  right: 8,
                },
              }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {TenLoaiOP.map((TenLoai) => (
                <MenuItem key={TenLoai} value={TenLoai}>
                  {TenLoai}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* BẢNG DỮ LIỆU */}
        <CustomTable
          columns={columns}
          rows={filteredRows.map((row) => ({
            ...row,
            TenLoai: (
              <Chip
                variant="filled" // ✅ filled để có nền màu
                label={row.TenLoai}
                color="primary"
                size="small"
                sx={{
                  fontWeight: 500,
                  backgroundColor: "#e3f2fd", // ✅ xanh nhạt (MUI light blue)
                  color: "#1976d2", // ✅ xanh đậm cho chữ
                  border: "none", // ✅ không viền
                }}
              />
            ),
          }))}
          onEdit={(row) => console.log("Sửa:", row)}
          onDelete={(row) => console.log("Xóa:", row)}
          onDisable={(row) => console.log("Vô hiệu:", row)}
          showEdit={true}
          showDelete={false}
          showDisable={true}
          page={1}
          totalItems={filteredRows.length}
          onPageChange={() => {}}
        />
      </div>
    </>
  );
}
