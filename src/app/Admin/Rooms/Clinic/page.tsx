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
import { getRommm, SearchRoom } from "../../services/Room";
import { getkhoaOptions } from "../../services/DoctorSevices";
import { useRouter } from "next/navigation";
import ButtonAdd from "../../component/Button/ButtonAdd";

// Cấu hình cột của bảng
const columns: Column[] = [
  { id: "SoPhongKham", label: "Số phòng", sortable: true, Outstanding: true },
  { id: "Khoa", label: "Khoa", sortable: true, Outstanding: false },
  {
    id: "TrangThaiHoatDong",
    label: "Trạng thái",
    sortable: true,
    Outstanding: false,
  },
];

// Interface chuyên khoa
interface Khoa {
  _id: string;
  TenKhoa: string;
  TrangThaiHoatDong: boolean;
}

// Interface phòng
interface PhongKham {
  _id: string;
  Id_Khoa: Khoa;
  SoPhongKham: string;
  TrangThaiHoatDong: boolean;
}

// Select chuyên khoa
interface khoaOptionsType {
  _id: string;
  TenKhoa: string;
  TrangThaiHoatDong: boolean;
}

export default function Page() {
  const [searchText, setSearchText] = useState("");
  const [selectedKhoa, setSelectedKhoa] = useState("");
  const [rows, setRows] = useState<rowRenderType[]>([]);
  const [khoaOptions, setKhoaOptions] = useState<khoaOptionsType[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const router = useRouter();

  // Lấy chuyên khoa
  const loaddingAPISelect = async () => {
    try {
      const data = await getkhoaOptions(currentPage + 1);
      if (data?.data?.length > 0) {
        const activeKhoa = data.data.filter(
          (item: khoaOptionsType) => item.TrangThaiHoatDong
        );
        setKhoaOptions(activeKhoa);
        setTotalItems(data.totalItems);
      } else {
        setKhoaOptions([]);
      }
    } catch (error) {
      console.error("Lỗi khi load khoa options:", error);
    }
  };

  // Lấy danh sách phòng có phân trang
  const loaddingAPI = async () => {
    try {
      const data = await getRommm(currentPage + 1);
      if (!data?.data || data.data.length === 0) {
        setRows([]);
        setTotalItems(0);
        return;
      }

      const mappedRows: rowRenderType[] = data.data.map((item: PhongKham) => ({
        _id: item._id,
        SoPhongKham: item.SoPhongKham,
        Khoa: item.Id_Khoa?.TenKhoa || "Không rõ",
        TrangThaiHoatDong: item.TrangThaiHoatDong ?? true,
      }));

      setRows(mappedRows);
      setTotalItems(data.totalItems || 0);
    } catch (error) {
      console.error("Lỗi khi load danh sách phòng:", error);
    }
  };

  // Gọi khi người dùng tìm số phòng
  const handleSearchTextChange = async (key: string) => {
    setSearchText(key);
    setCurrentPage(0);

    if (key.trim() === "") {
      loaddingAPI();
      return;
    }

    try {
      const data = await SearchRoom(key);
      if (!data || data.length === 0) {
        setRows([]);
        setTotalItems(0);
        return;
      }

      const mappedRows: rowRenderType[] = data.map((item: PhongKham) => ({
        _id: item._id,
        SoPhongKham: item.SoPhongKham,
        Khoa: item.Id_Khoa?.TenKhoa || "Không rõ",
        TrangThaiHoatDong: item.Id_Khoa?.TrangThaiHoatDong ?? true,
      }));

      setRows(mappedRows);
      setTotalItems(mappedRows.length);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm phòng:", error);
      setRows([]);
      setTotalItems(0);
    }
  };

  // Khi đổi trang → load lại danh sách
  useEffect(() => {
    loaddingAPI();
  }, [currentPage]);

  // Tải chuyên khoa 1 lần duy nhất
  useEffect(() => {
    loaddingAPISelect();
  }, []);

  // Lọc dữ liệu theo tìm kiếm + chuyên khoa
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

      {/* Tìm kiếm & lọc */}
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
          sx={{
            width: 250,
            "& .MuiInputBase-root": {
              paddingRight: "8px",
              "& .MuiInputAdornment-root": {
                color: "#9e9e9e",
              },
            },
          }}
          size="small"
          placeholder="Tìm theo số phòng..."
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
          <InputLabel sx={{ fontSize: 14, top: 2 }}>Chuyên khoa</InputLabel>
          <Select
            label="Chuyên khoa"
            value={selectedKhoa}
            onChange={(e) => {
              setSelectedKhoa(e.target.value);
              setCurrentPage(0); // reset về trang đầu
            }}
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
                link="/Admin/Rooms/Clinic/Form"
              />
            </div>
            </Box>

      {/* Bảng hiển thị */}
      <CustomTableRooms
        columns={columns}
        rows={filteredRows}
        onEdit={(id) => {router.push(`/Admin/Rooms/Clinic/Form/${id}`)}}
        onDelete={(row) => console.log("Delete", row)}
        onDisable={(row) => console.log("Disable", row)}
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