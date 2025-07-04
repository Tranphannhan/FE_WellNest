"use client";
import { useState, useEffect, useMemo } from "react";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import CustomTableServicePrice, {
  ColumnCategory,
  rowRenderType,
} from "../../component/Table/CustomTableServicePrice";
import BreadcrumbComponent from "../../component/Breadcrumb";
import { getTestGroup } from "../../services/Category";
import { ServicePriceType } from "@/app/types/hospitalTypes/hospitalType";

const columns: ColumnCategory[] = [
  { id: "Tendichvu", label: "Tên dịch vụ", sortable: true, Outstanding: true },
  { id: "Giadichvu", label: "Giá dịch vụ", sortable: true },
  { id: "Loaigia", label: "Loại giá", sortable: true },
  { id: "TrangThaiHoatDong", label: "Trạng thái", sortable: false },
];

export default function Page() {
  const [searchText, setSearchText] = useState("");
  const [rows, setRows] = useState<rowRenderType[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [page, setPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const fetchData = async (currentPage = 1) => {
    try {
      const data = await getTestGroup(currentPage);
      if (data?.data) {
        const mapped = data.data.map((item: ServicePriceType) => ({
          _id: item._id,
          Tendichvu: item.Tendichvu ?? "-",
          Giadichvu: item.Giadichvu ?? 0,
          Loaigia: item.Loaigia ?? "-",
          TrangThaiHoatDong: item.TrangThaiHoatDong ?? false,
        }));
        setRows(mapped);
        setTotalItems(data.totalItems || data.pagination?.total || mapped.length);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhóm dịch vụ:", error);
    }
  };

  useEffect(() => {
    fetchData(page + 1);
  }, [page]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchSearch = row.Tendichvu?.toLowerCase().includes(searchText.toLowerCase());
      const matchStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
          ? row.TrangThaiHoatDong === true
          : row.TrangThaiHoatDong === false;

      return matchSearch && matchStatus;
    });
  }, [searchText, rows, statusFilter]);

  return (
    <div className="AdminContent-Container">
      <BreadcrumbComponent
        items={[
          { title: "Trang chủ", href: "/Admin" },
          { title: "Dịch vụ", href: "/Admin/Service" },
          { title: "Bảng giá dịch vụ" },
        ]}
      />

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2, alignItems: "center" }}>
        <TextField
          sx={{ width: 300 }}
          size="small"
          placeholder="Tìm tên dịch vụ..."
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

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Trạng thái hoạt động</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
            label="Trạng thái hoạt động"
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="active">Đang hoạt động</MenuItem>
            <MenuItem value="inactive">Ngừng hoạt động</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <CustomTableServicePrice
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
