"use client";

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
} from "@mui/material";
import { useState, useMemo, useEffect } from "react";

import BreadcrumbComponent from "../../component/Breadcrumb";
import "./Staff.css";
import { Staff } from "@/app/types/hospitalTypes/hospitalType";
import CustomTableHumanResources, { Column } from "../../component/Table/CustomTableHumanResources";
import { getOptionstaffAdmin, getstaffAdmin } from "../../services/staffSevices";
import { useRouter } from "next/navigation";

export interface rowRenderType {
  _id: string;
  TenTaiKhoan: string;
  GioiTinh: string;
  SoDienThoai: string;
  TrangThaiHoatDong: boolean;
  Image: string;
  TenLoai: string;
}

const columns:Column[]  = [
  { id: "Image", label: "Ảnh", sortable: false, Outstanding: false },
  { id: "TenTaiKhoan", label: "Họ tên", sortable: true, Outstanding: true },
  { id: "GioiTinh", label: "Giới tính", sortable: true, Outstanding: false },
  { id: "SoDienThoai", label: "SĐT", sortable: false, Outstanding: false },
  {
    id: "TenLoai",
    label: "Loại tài khoản",
    sortable: false,
    Outstanding: true,
  },
  {
    id: "TrangThaiHoatDong",
    label: "Trạng thái",
    sortable: true,
    Outstanding: false,
  },
] as const;

export default function Page() {
  const [searchText, setSearchText] = useState("");
  const [selectedLoai, setSelectedLoai] = useState("");
  const [rows, setRows] = useState<rowRenderType[]>([]);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [currentPage, setCurrentPage] = useState <number> (0);
  const [totalItems , setTotalItems] = useState <number> (0)
  const router = useRouter();

  const loaddingAPI = async () => {
    const data = await getstaffAdmin(currentPage + 1);
    if (!data?.data || data.data.length === 0) {
      setRows([]);
      return;
    }

    setTotalItems (data.totalItems)

    const mappedRows: rowRenderType[] = data.data.map((item: Staff) => ({
      _id: item._id,
      TenTaiKhoan: item.TenTaiKhoan || "Không rõ",
      GioiTinh: item.GioiTinh || "Không rõ",
      SoDienThoai: item.SoDienThoai || "",
      TrangThaiHoatDong:
        typeof item.TrangThaiHoatDong === "boolean"
          ? item.TrangThaiHoatDong
          : true,
      Image: `${API_BASE_URL}/image/${item?.Image || "default.png"}`,
      TenLoai: item?.Id_LoaiTaiKhoan?.TenLoaiTaiKhoan || "Không rõ",
    }));

    setRows(mappedRows);
  };

  useEffect(() => {
    loaddingAPI();
  }, [currentPage]);



  // --- 
  interface TenLoaiOPType {
    _id: string,
    TenLoaiTaiKhoan: string,
    VaiTro : string
  }

  const [TenLoaiOP , setTenLoaiOP] = useState <TenLoaiOPType []> ([]);
    const loaddingAPISelect  = async () => {
      const data = await getOptionstaffAdmin ();
      if (!data) return;
      setTenLoaiOP (data)
    }
  

  useEffect (() => {
    loaddingAPISelect ();
  }, []);



  // ----

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
      

      <div className="AdminContent-Container">
        <BreadcrumbComponent
        items={[
          { title: "Trang chủ", href: "/Admin" },
          { title: "Nhân sự", href: "/Admin/HumanResources/Staff" },
          { title: "Nhân viên" },
        ]}
      />
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

          <FormControl sx={{ minWidth: 250 }} size="small">
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
                <MenuItem key={TenLoai._id} value={TenLoai._id}>
                  {TenLoai.TenLoaiTaiKhoan}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>


        {/* BẢNG DỮ LIỆU */}
        <CustomTableHumanResources
          columns={columns}
          rows={filteredRows}
          onEdit={(id) => {router.push(`/Admin/HumanResources/Staff/Form/${id}`)}}
          onDelete={() => {}}
          onDisable={(id) => {console.log(id)}}
          showEdit={true}
          showDelete={false}
          showDisable={true}
            page={currentPage} // ✅ Dùng biến state
          totalItems={totalItems}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
}
