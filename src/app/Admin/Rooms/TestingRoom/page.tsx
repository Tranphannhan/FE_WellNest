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
import CustomTableRooms, {
  Column,
  rowRenderType,
} from "../../component/Table/CustomTableRoom";

const columns: Column[] = [
  {
    id: "TenPhongThietBi",
    label: "Phòng xét nghiệm",
    sortable: true,
    Outstanding: true,
  },
  {
    id: "TenXetNghiem",
    label: "Loại xét nghiệm",
    sortable: true,
    Outstanding: false,
  },
  {
    id: "Image",
    label: "Hình ảnh",
    sortable: false,
    Outstanding: false,
  },
  {
    id: "TrangThaiHoatDong",
    label: "Trạng thái",
    sortable: true,
    Outstanding: false,
  },
];

export default function Page() {
  const [searchText, setSearchText] = useState("");
  const [selectedLoai, setSelectedLoai] = useState("");
  const [rows, setRows] = useState<rowRenderType[]>([]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const getAPI = async () => {
    // ✅ Dữ liệu giả lập phòng xét nghiệm
    const fakeLabs = [
      {
        _id: "lab001",
        TenPhongThietBi: "Phòng sinh hóa",
        TenXetNghiem: "Xét nghiệm máu",
        Image: "lab1.jpg",
        TrangThaiHoatDong: true,
      },
      {
        _id: "lab002",
        TenPhongThietBi: "Phòng miễn dịch",
        TenXetNghiem: "Xét nghiệm kháng thể",
        Image: "lab2.jpg",
        TrangThaiHoatDong: false,
      },
      {
        _id: "lab003",
        TenPhongThietBi: "Phòng vi sinh",
        TenXetNghiem: "Xét nghiệm PCR",
        Image: "lab3.jpg",
        TrangThaiHoatDong: true,
      },
    ];

    const mappedData = fakeLabs.map((item) => ({
      _id: item._id,
      TenPhongThietBi: item.TenPhongThietBi,
      TenXetNghiem: item.TenXetNghiem,
      Image: item.Image?.startsWith("http")
        ? item.Image
        : `${API_BASE_URL}/image/${item.Image || "default.png"}`,
      TrangThaiHoatDong: item.TrangThaiHoatDong,
    }));

    setRows(mappedData);
  };

  useEffect(() => {
    getAPI();
  }, []);

  const loaiXetNghiemOptions = useMemo(() => {
    const loaiSet = new Set<string>();
    rows.forEach((r) => loaiSet.add(r.TenXetNghiem || ''));
    return Array.from(loaiSet);
  }, [rows]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchSearch = row?.TenPhongThietBi?.toLowerCase().includes(
        searchText.toLowerCase()
      );
      const matchLoai = selectedLoai ? row.TenXetNghiem === selectedLoai : true;
      return matchSearch && matchLoai;
    });
  }, [searchText, selectedLoai, rows]);

  return (
    <div className="AdminContent-Container">
      <BreadcrumbComponent
        items={[
          { title: "Trang chủ", href: "/Admin" },
          { title: "Phòng", href: "/Admin/Rooms/Lab" },
          { title: "Phòng xét nghiệm" },
        ]}
      />

      {/* TÌM KIẾM & LỌC */}
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
          sx={{ width: 250 }}
          size="small"
          placeholder="Tìm theo tên phòng..."
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
          <InputLabel sx={{ fontSize: 14, top: 2 }}>Loại xét nghiệm</InputLabel>
          <Select
            label="Loại xét nghiệm"
            value={selectedLoai}
            onChange={(e) => setSelectedLoai(e.target.value)}
            sx={{
              fontSize: 14,
              height: 40,
              pl: 1,
              "& .MuiSelect-icon": { right: 8 },
            }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {loaiXetNghiemOptions.map((loai, i) => (
              <MenuItem key={i} value={loai}>
                {loai}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* BẢNG HIỂN THỊ */}
      <CustomTableRooms
        columns={columns}
        rows={filteredRows}
        onEdit={() => {}}
        onDelete={() => {}}
        onDisable={() => {}}
        showEdit={true}
        showDelete={false}
        showDisable={true}
        page={1}
        totalItems={filteredRows.length}
        onPageChange={() => {}}
      />
    </div>
  );
}
