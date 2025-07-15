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
<<<<<<< HEAD
import { getTestingRoom, SearchRoomName } from "../../services/Room";
=======
import { getTestingRoom } from "../../services/Room";
import { useRouter } from "next/navigation";
import ButtonAdd from "../../component/Button/ButtonAdd";
>>>>>>> 719c97165109777f9f4fd2e8da97d6aec25cc566

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
  const [selectedStatus, setSelectedStatus] = useState("");
  const [rows, setRows] = useState<rowRenderType[]>([]);
<<<<<<< HEAD
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
=======
    const [currentPage, setCurrentPage] = useState <number> (0);
  const [totalItems , setTotalItems] = useState <number> (0)
  const router = useRouter();
>>>>>>> 719c97165109777f9f4fd2e8da97d6aec25cc566

  // Gọi API load toàn bộ (phân trang)
  const LoaddingApi = async () => {
    try {
      const data = await getTestingRoom(currentPage + 1);
      if (!data?.data || data.data.length === 0) {
        setRows([]);
        setTotalItems(0);
        return;
      }

      setTotalItems(data.totalItems);

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

  // Gọi API tìm kiếm phòng theo tên
  const handleSearchTextChange = async (key: string) => {
    setSearchText(key);
    setCurrentPage(0);

    if (key.trim() === "") {
      LoaddingApi();
      return;
    }

    try {
      const data = await SearchRoomName(key);
      if (!data || data.length === 0) {
        setRows([]);
        setTotalItems(0);
        return;
      }

      const mappedData: rowRenderType[] = data.map((item: TestingRoom) => ({
        _id: item._id,
        TenPhongThietBi: item.TenPhongThietBi,
        TenXetNghiem: item.TenXetNghiem,
        Image: item.Image?.startsWith("http")
          ? item.Image
          : `${API_BASE_URL}/image/${item.Image || "default.png"}`,
        TrangThaiHoatDong: item.TrangThaiHoatDong ?? true,
      }));

      setRows(mappedData);
      setTotalItems(mappedData.length);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm phòng:", error);
      setRows([]);
      setTotalItems(0);
    }
  };

  // Load lại dữ liệu khi đổi trang (chỉ khi không có searchText)
  useEffect(() => {
    if (searchText.trim() === "") {
      LoaddingApi();
    }
  }, [currentPage]);

  // Lọc trạng thái sau khi đã có danh sách từ API hoặc tìm kiếm
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchStatus = selectedStatus
        ? String(row.TrangThaiHoatDong) === selectedStatus
        : true;
      return matchStatus;
    });
  }, [selectedStatus, rows]);

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
          justifyContent: "space-between", // Pushes content to left and right
          width: "100%", // Ensures the Box takes full width
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
          sx={{ width: 250 }}
          size="small"
          placeholder="Tìm theo tên phòng..."
          variant="outlined"
          value={searchText}
          onChange={(e) => handleSearchTextChange(e.target.value)}
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
                  onClick={() => handleSearchTextChange("")}
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
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="true">Đang hoạt động</MenuItem>
            <MenuItem value="false">Ngừng hoạt động</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <div>
                    <ButtonAdd 
                      name="Thêm mới"
                      link="/Admin/Rooms/TestingRoom/Form"
                    />
                  </div>
                  </Box>

      {/* BẢNG HIỂN THỊ */}
      <CustomTableRooms
        columns={columns}
        rows={filteredRows}
        onEdit={(id) => {router.push(`/Admin/Rooms/TestingRoom/Form/${id}`)}}
        onDelete={() => {}}
        onDisable={() => {}}
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
