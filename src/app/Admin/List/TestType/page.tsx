"use client";
import { useState, useEffect, useMemo } from "react";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import BreadcrumbComponent from "../../component/Breadcrumb";
import CustomTableCatalog, {
  ColumnCategory,
  rowRenderType,
} from "../../component/Table/CustomTableCatalog";
import { getTypeOfTest } from "../../services/Category";
import { ParaclinicalType } from "@/app/types/hospitalTypes/hospitalType";

// 👉 Thêm hàm tìm kiếm từ API
export async function Searchfortesttype(key: string) {
  try {
    const result = await fetch(`http://localhost:5000/Loaixetnghiem/Search?Key=${key}`);
    if (result.ok) {
      const Data = await result.json();
      return Data;
    } else {
      const errorText = await result.text();
      console.error(`Lỗi fetch loại xét nghiệm : ${result.status} - ${errorText}`);
      return 'Lỗi khi lấy loại xét nghiệm';
    }
  } catch (error) {
    console.error("Exception khi lấy loại xét nghiệm", error);
    throw error;
  }
}

const columns: ColumnCategory[] = [
  { id: "TenXetNghiem", label: "Tên xét nghiệm", sortable: true, Outstanding: true },
  { id: "MoTaXetNghiem", label: "Mô tả", sortable: false },
  { id: "Image", label: "Ảnh", sortable: false },
  { id: "Giadichvu", label: "Giá dịch vụ", sortable: true },
  { id: "TenPhongThietBi", label: "Phòng thiết bị", sortable: false },
  { id: "TrangThaiHoatDong", label: "Trạng thái", sortable: true },
];

export default function Page() {
  const [searchText, setSearchText] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [rows, setRows] = useState<rowRenderType[]>([]);
  const [page, setPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchData = async (currentPage = 1) => {
    try {
      const data = await getTypeOfTest(currentPage);
      if (data?.data) {
        const mapped = data.data.map((item: ParaclinicalType) => ({
          _id: item._id,
          TenXetNghiem: item.TenXetNghiem,
          MoTaXetNghiem: item.MoTaXetNghiem,
          Image: item.Image?.startsWith("http")
            ? item.Image
            : `${API_BASE_URL}/image/${item.Image || "default.png"}`,
          TrangThaiHoatDong: item.TrangThaiHoatDong,
          Giadichvu: item.Id_GiaDichVu?.Giadichvu ?? 0,
          TenPhongThietBi: item.Id_PhongThietBi?.TenPhongThietBi ?? "Không rõ",
        }));
        setRows(mapped);
        setTotalItems(data.totalItems);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách loại xét nghiệm:", error);
    }
  };

  // Fetch data khi đổi trang
  useEffect(() => {
    if (!searchText.trim()) {
      fetchData(page + 1);
    }
  }, [page]);

  // Tìm kiếm loại xét nghiệm theo từ khóa
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchText.trim() !== "") {
        try {
          const result = await Searchfortesttype(searchText);
          if (result?.data) {
            const mapped = result.data.map((item: ParaclinicalType) => ({
              _id: item._id,
              TenXetNghiem: item.TenXetNghiem,
              MoTaXetNghiem: item.MoTaXetNghiem,
              Image: item.Image?.startsWith("http")
                ? item.Image
                : `${API_BASE_URL}/image/${item.Image || "default.png"}`,
              TrangThaiHoatDong: item.TrangThaiHoatDong,
              Giadichvu: item.Id_GiaDichVu?.Giadichvu ?? 0,
              TenPhongThietBi: item.Id_PhongThietBi?.TenPhongThietBi ?? "Không rõ",
            }));
            setRows(mapped);
            setTotalItems(result.totalItems || mapped.length);
          }
        } catch (error) {
          console.error("Lỗi khi tìm kiếm loại xét nghiệm:", error);
        }
      } else {
        fetchData(page + 1); // Reset lại dữ liệu nếu input rỗng
      }
    }, 400); // debounce 400ms

    return () => clearTimeout(delayDebounce);
  }, [searchText]);

  const uniqueRooms = useMemo(() => {
    const roomSet = new Set(rows.map((row) => row.TenPhongThietBi));
    return Array.from(roomSet);
  }, [rows]);

  const filteredRows = useMemo(() => {
    return selectedRoom
      ? rows.filter((row) => row.TenPhongThietBi === selectedRoom)
      : rows;
  }, [selectedRoom, rows]);

  return (
    <div className="AdminContent-Container">
      <BreadcrumbComponent
        items={[
          { title: "Trang chủ", href: "/Admin" },
          { title: "Danh mục", href: "/Admin/Category/TestType" },
          { title: "Loại xét nghiệm" },
        ]}
      />

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2, alignItems: "center" }}>
        <TextField
          sx={{ width: 300 }}
          size="small"
          placeholder="Tìm theo tên xét nghiệm..."
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
          <InputLabel sx={{ fontSize: 14, top: 2 }}>Phòng thiết bị</InputLabel>
          <Select
            label="Phòng thiết bị"
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            sx={{ fontSize: 14, height: 40, pl: 1, '& .MuiSelect-icon': { right: 8 } }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {uniqueRooms.map((room) => (
              <MenuItem key={room} value={room}>{room}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <CustomTableCatalog
        columns={columns}
        rows={filteredRows}
        onEdit={(row) => console.log("Edit", row)}
        onDelete={(row) => console.log("Delete", row)}
        onDisable={(row) => console.log("Toggle status", row)}
        showEdit={true}
        showDelete={true}
        showDisable={true}
        page={page}
        totalItems={totalItems}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}
