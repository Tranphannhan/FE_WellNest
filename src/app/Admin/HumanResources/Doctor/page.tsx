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

import "./Doctor.css";
import BreadcrumbComponent from "../../component/Breadcrumb";

const columns = [
  { id: "Image", label: "Ảnh", sortable: false, Outstanding: false },
  { id: "TenBacSi", label: "Họ tên", sortable: true, Outstanding: true },
  { id: "GioiTinh", label: "Giới tính", sortable: true, Outstanding: false },
  { id: "HocVi", label: "Học vị", sortable: true, Outstanding: false },
  { id: "SoDienThoai", label: "SĐT", sortable: false, Outstanding: false },
  { id: "Khoa", label: "Chuyên khoa", sortable: false, Outstanding: true },
  { id: "Phong", label: "Phòng", sortable: true, Outstanding: false },
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
    TenBacSi: "BS. Nguyễn Văn A",
    GioiTinh: "Nam",
    HocVi: "Thạc sĩ",
    SoDienThoai: "0912345678",
    Khoa: "Chấn thương chỉnh hình",
    Phong: "101",
    TrangThaiHoatDong: true,
    Image: "https://i.pravatar.cc/100?img=1",
  },
  {
    _id: "2",
    TenBacSi: "BS. Trần Thị B",
    GioiTinh: "Nữ",
    HocVi: "Tiến sĩ",
    SoDienThoai: "0987654321",
    Khoa: "Tai mũi họng",
    Phong: "102",
    TrangThaiHoatDong: false,
    Image: "https://i.pravatar.cc/100?img=2",
  },
  {
    _id: "3",
    TenBacSi: "BS. Lê Văn C",
    GioiTinh: "Nam",
    HocVi: "Bác sĩ nội trú",
    SoDienThoai: "0900000000",
    Khoa: "Tai mũi họng",
    Phong: "103",
    TrangThaiHoatDong: true,
    Image: "https://i.pravatar.cc/100?img=3",
  },
];

export default function Page() {
  const [searchText, setSearchText] = useState("");
  const [selectedKhoa, setSelectedKhoa] = useState("");

  // Danh sách chuyên khoa không trùng
  const khoaOptions = useMemo(
    () => Array.from(new Set(rows.map((row) => row.Khoa))),
    []
  );

  // Lọc dữ liệu theo từ khóa và chuyên khoa
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchSearch = row.TenBacSi.toLowerCase().includes(
        searchText.toLowerCase()
      );
      const matchKhoa = selectedKhoa ? row.Khoa === selectedKhoa : true;
      return matchSearch && matchKhoa;
    });
  }, [searchText, selectedKhoa]);

  return (
    <>
      <BreadcrumbComponent
        items={[
          { title: "Trang chủ", href: "/Admin" },
          { title: "Nhân sự", href: "/Admin/HumanResources/Doctor" },
          { title: "Bác sĩ" },
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
              Chuyên khoa
            </InputLabel>
            <Select
              label="Chuyên khoa"
              value={selectedKhoa}
              onChange={(e) => setSelectedKhoa(e.target.value)}
              sx={{
                fontSize: 14,
                height: 40,
                pl: 1, // padding-left
                "& .MuiSelect-icon": {
                  right: 8, // chỉnh khoảng cách icon
                },
              }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {khoaOptions.map((khoa) => (
                <MenuItem key={khoa} value={khoa}>
                  {khoa}
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
            Khoa: (
              <Chip
                label={row.Khoa}
                color="primary"
                size="small"
                variant="filled" // ✅ filled để có nền màu
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
