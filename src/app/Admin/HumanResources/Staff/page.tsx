
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
import { useState, useMemo, useEffect } from "react";
import BreadcrumbComponent from "../../component/Breadcrumb";
import getstaffAdmin from "../../services/staffSevices";
import "./Staff.css";
import { Staff } from "@/app/types/hospitalTypes/hospitalType";

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

interface rowRenderType {
  _id: string;
  TenTaiKhoan: string;
  GioiTinh: string;
  SoDienThoai: string;
  TrangThaiHoatDong: boolean;
  Image: string;
  TenLoai: string;
}

export default function Page() {
  const [searchText, setSearchText] = useState("");
  const [selectedLoai, setSelectedLoai] = useState("");
  const [rows, setRows] = useState<rowRenderType[]>([]);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;



  const loaddingAPI = async () => {
    const data = await getstaffAdmin();
    if (!data?.data || data.data.length === 0) {
      setRows([]);
      return;
    }

    const mappedRows: rowRenderType[] = data.data.map((item: Staff) => ({
      _id: item._id,
      TenTaiKhoan: item.TenTaiKhoan || "Không rõ",
      GioiTinh: item.GioiTinh || "Không rõ",
      SoDienThoai: item.SoDienThoai || "",
      TrangThaiHoatDong:
        typeof item.TrangThaiHoatDong === "boolean"
          ? item.TrangThaiHoatDong
          : true,

      Image: `${API_BASE_URL}/image/${item?.Image}`,
      TenLoai: item?.Id_LoaiTaiKhoan?.TenLoaiTaiKhoan || "Không rõ",
    }));

    console.log('dulieu', mappedRows);
    

    setRows(mappedRows);
  };

  useEffect(() => {
    loaddingAPI();
  }, []);

  const TenLoaiOP = useMemo(
    () => Array.from(new Set(rows.map((row) => row.TenLoai))),
    [rows]
  );

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchSearch = row.TenTaiKhoan.toLowerCase().includes(
        searchText.toLowerCase()
      );
      const matchLoai = selectedLoai ? row.TenLoai === selectedLoai : true;
      return matchSearch && matchLoai;
    });
  }, [searchText, selectedLoai, rows]);

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
              width: 250,
              "& .MuiInputBase-root": {
                paddingRight: "8px",
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
            placeholder="Tìm theo tên nhân viên..."
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
            <InputLabel sx={{ fontSize: 14, top: 2 }}>
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
            Image: row.Image,
            TenLoai: (
              <Chip
                variant="filled"
                label={row.TenLoai}
                color="primary"
                size="small"
                sx={{
                  fontWeight: 500,
                  backgroundColor: "#e3f2fd",
                  color: "#1976d2",
                  border: "none",
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
