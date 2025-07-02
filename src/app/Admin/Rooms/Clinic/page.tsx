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
  { id: "_id", label: "ID Phòng", sortable: false, Outstanding: false },
  { id: "SoPhongKham", label: "Số phòng", sortable: true, Outstanding: true },
  { id: "Khoa", label: "Khoa", sortable: true, Outstanding: false },
  {
    id: "TrangThaiHoatDong",
    label: "Trạng thái",
    sortable: true,
    Outstanding: false,
  },
];

interface khoaOptionsType {
  _id: string;
  TenKhoa: string;
}

export default function Page() {
  const [searchText, setSearchText] = useState("");
  const [selectedKhoa, setSelectedKhoa] = useState("");
  const [rows, setRows] = useState<rowRenderType[]>([]);
  const [khoaOptions, setKhoaOptions] = useState<khoaOptionsType[]>([]);

  // ✅ Giả lập dữ liệu phòng khám
  const getAPI = async () => {
    const fakeClinicRooms = [
      {
        _id: "phong001",
        SoPhongKham: "102",
        ID_Khoa: {
          _id: "681637a4044132235e13b8ba",
          TenKhoa: "Nội tổng quát",
        },
        TrangThaiHoatDong: true,
      },
      {
        _id: "phong002",
        SoPhongKham: "103",
        ID_Khoa: {
          _id: "681637a4044132235e13b8bb",
          TenKhoa: "Ngoại thần kinh",
        },
        TrangThaiHoatDong: false,
      },
      {
        _id: "phong003",
        SoPhongKham: "104",
        ID_Khoa: {
          _id: "681637a4044132235e13b8bc",
          TenKhoa: "Tai - Mũi - Họng",
        },
        TrangThaiHoatDong: true,
      },
    ];

    const mappedData = fakeClinicRooms.map((item) => ({
      _id: item._id,
      SoPhongKham: item.SoPhongKham,
      Khoa: item.ID_Khoa?.TenKhoa || "Không rõ",
      TrangThaiHoatDong: item.TrangThaiHoatDong,
    }));

    setRows(mappedData);

    // Tự động tạo danh sách khoa từ dữ liệu giả
    const uniqueKhoa = Array.from(
      new Map(
        fakeClinicRooms.map((item) => [
          item.ID_Khoa._id,
          {
            _id: item.ID_Khoa._id,
            TenKhoa: item.ID_Khoa.TenKhoa,
          },
        ])
      ).values()
    );
    setKhoaOptions(uniqueKhoa);
  };

  useEffect(() => {
    getAPI();
  }, []);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchSearch = row?.SoPhongKham?.toLowerCase().includes(
        searchText.toLowerCase()
      );
      const matchKhoa = selectedKhoa ? row.Khoa === selectedKhoa : true;
      return matchSearch && matchKhoa;
    });
  }, [searchText, selectedKhoa, rows]);

  return (
    <div className="AdminContent-Container">
      <BreadcrumbComponent
        items={[
          { title: "Trang chủ", href: "/Admin" },
          { title: "Phòng", href: "/Admin/Rooms/Clinic" },
          { title: "Phòng khám" },
        ]}
      />

      {/* FORM TÌM KIẾM & LỌC */}
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
          placeholder="Tìm theo số phòng..."
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

      {/* BẢNG HIỂN THỊ PHÒNG */}
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
