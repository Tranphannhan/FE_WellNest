"use client";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import { Box, MenuItem, FormControl, Select, InputLabel } from "@mui/material";
import { useState, useEffect } from "react";

import "./Doctor.css";
import BreadcrumbComponent from "../../component/Breadcrumb";
import { DoctorType } from "@/app/types/doctorTypes/doctorTypes";
import CustomTableHumanResources, {
  Column,
} from "../../component/Table/CustomTableHumanResources";
import {
  getDoctorAdmin,
  getkhoaOptions,
  FindDoctor,
} from "../../services/DoctorSevices";
import { useRouter } from "next/navigation";
import ButtonAdd from "../../component/Button/ButtonAdd";

export interface rowRenderType {
  _id: string;
  TenBacSi: string;
  GioiTinh: string;
  HocVi: string;
  SoDienThoai: string;
  Khoa: string;
  Phong: string;
  TrangThaiHoatDong: boolean;
  Image: string;
}

const columns: Column[] = [
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

export default function Page() {
  const [searchText, setSearchText] = useState("");
  const [selectedKhoa, setSelectedKhoa] = useState("");
  const [rows, setRows] = useState<rowRenderType[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const router = useRouter();

  const mapData = (data: DoctorType[]) => {
    return data.map((item) => ({
      _id: item._id || "unknown", // đảm bảo string
      TenBacSi: item.TenBacSi || "Không rõ",
      GioiTinh: item.GioiTinh || "Không rõ",
      HocVi: item.HocVi || "Không rõ",
      SoDienThoai: item.SoDienThoai || "",
      Khoa: item?.ID_Khoa?.TenKhoa || item?.ChuyenKhoa || "Không rõ",
      Phong: item?.Id_PhongKham?.SoPhongKham || "N/A",
      TrangThaiHoatDong:
        typeof item.TrangThaiHoatDong === "boolean"
          ? item.TrangThaiHoatDong
          : true,
      Image: item?.Image?.startsWith("http")
        ? item.Image
        : `${API_BASE_URL}/image/${item?.Image || "default.png"}`,
    }));
  };

  // Gọi API mặc định (phân trang)
  const getAPI = async () => {
    const data = await getDoctorAdmin(currentPage + 1);
    if (!data?.data) {
      setRows([]);
      return;
    }
    setTotalItems(data.totalItems);
    const mapped = mapData(data.data);
    setRows(
      selectedKhoa
        ? mapped.filter((r) => r.Khoa === selectedKhoa)
        : mapped
    );
  };

  useEffect(() => {
    if (searchText.trim() === "") {
      getAPI();
    }
  }, [currentPage]);

  // Gọi API tìm kiếm
  useEffect(() => {
    const fetchSearch = async () => {
      if (searchText.trim() === "") {
        getAPI();
        return;
      }

      const data = await FindDoctor(searchText);
      if (!data?.data) {
        setRows([]);
        return;
      }

      const mapped = mapData(data.data);
      setRows(
        selectedKhoa
          ? mapped.filter((r) => r.Khoa === selectedKhoa)
          : mapped
      );
    };

    fetchSearch();
  }, [searchText, selectedKhoa]);

  // --- Lấy danh sách chuyên khoa ---
  interface khoaOptionsType {
    _id: string;
    TenKhoa: string;
    TrangThaiHoatDong: boolean;
  }

  const [khoaOptions, setKhoaOptions] = useState<khoaOptionsType[]>([]);
  const loaddingAPISelect = async () => {
    const data = await getkhoaOptions(currentPage);
    if (data.data.length === 0 ? [] : data.data) setKhoaOptions(data.data);
  };

  useEffect(() => {
    loaddingAPISelect();
  }, []);

  return (
    <div className="AdminContent-Container">
      <BreadcrumbComponent
        items={[
          { title: "Trang chủ", href: "/Admin" },
          { title: "Nhân sự", href: "/Admin/HumanResources/Doctor" },
          { title: "Bác sĩ" },
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
    justifyContent: "space-between", // Pushes inputs to left and button to right
    width: "100%",
  }}
>
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

        <FormControl sx={{ minWidth: 250 }} size="small">
          <InputLabel sx={{ fontSize: 14, top: 2 }}>Chuyên khoa</InputLabel>
          <Select
            label="Chuyên khoa"
            value={selectedKhoa}
            onChange={(e) => setSelectedKhoa(e.target.value)}
            sx={{
              fontSize: 14,
              height: 40,
              pl: 1,
              "& .MuiSelect-icon": { right: 8 },
            }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {khoaOptions.map((khoa) => (
              <MenuItem key={khoa._id} value={khoa.TenKhoa}>
                {khoa.TenKhoa}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <div>
      <ButtonAdd 
        name="Thêm mới"
        link="/Admin/HumanResources/Doctor/Edit"
      />
    </div>
</Box>

      {/* BẢNG DỮ LIỆU */}
      <CustomTableHumanResources
        columns={columns}
        rows={rows}
        onEdit={(id) => {
          router.push(`/Admin/HumanResources/Doctor/Edit/${id}`);
        }}
        onDelete={() => {}}
        onDisable={(id) => {
          console.log(id);
        }}
        showEdit={true}
        showDelete={false}
        showDisable={true}
        page={currentPage}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
