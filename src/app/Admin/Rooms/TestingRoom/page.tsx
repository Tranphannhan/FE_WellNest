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
import { getTestingRoom } from "../../services/Room";

interface TestingRoom {
  _id: string;
  TenPhongThietBi: string;
  TenXetNghiem: string;
  MoTaXetNghiem?: string;
  Image?: string;
  TrangThaiHoatDong?: boolean;
}

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
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(""); // Trạng thái hoạt động
  const [rows, setRows] = useState<rowRenderType[]>([]);

  // ✅ Load API
  const LoaddingApi = async () => {
    try {
      const data = await getTestingRoom();
      if (!data?.data || data.data.length === 0) {
        setRows([]);
        return;
      }

      const mappedData: rowRenderType[] = data.data.map((item: TestingRoom) => ({
        _id: item._id,
        TenPhongThietBi: item.TenPhongThietBi,
        TenXetNghiem: item.TenXetNghiem,
        Image: item.Image?.startsWith("http")
          ? item.Image
          : `${API_BASE_URL}/image/${item.Image || "default.png"}`,
        TrangThaiHoatDong: item.TrangThaiHoatDong ?? true,
      }));

      setRows(mappedData);
    } catch (error) {
      console.error("Lỗi khi load phòng xét nghiệm:", error);
    }
  };

  useEffect(() => {
    LoaddingApi();
  }, []);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchSearch = row?.TenPhongThietBi?.toLowerCase().includes(
        searchText.toLowerCase()
      );

      const matchStatus = selectedStatus
        ? String(row.TrangThaiHoatDong) === selectedStatus
        : true;

      return matchSearch && matchStatus;
    });
  }, [searchText, selectedStatus, rows]);

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
          <InputLabel sx={{ fontSize: 14, top: 2 }}>Trạng thái</InputLabel>
          <Select
            label="Trạng thái"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            sx={{
              fontSize: 14,
              height: 40,
              pl: 1,
              "& .MuiSelect-icon": { right: 8 },
            }}
          >
            
            <MenuItem value="true">Đang hoạt động</MenuItem>
            <MenuItem value="false">Ngừng hoạt động</MenuItem>
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
