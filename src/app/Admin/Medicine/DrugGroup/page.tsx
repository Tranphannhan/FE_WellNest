"use client";
import { useState, useEffect, useMemo } from "react";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import BreadcrumbComponent from "../../component/Breadcrumb";
import CustomTableMedicine, {
  ColumnMedicine,
  rowRenderType,
} from "../../component/Table/CustomTableMedicine";
import { getDrugGroup } from "../../services/Category";
import { medicineGroupType } from "@/app/types/hospitalTypes/hospitalType";
import { useRouter } from "next/navigation";

// Cấu hình cột hiển thị
const columns: ColumnMedicine[] = [
  { id: "TenNhomThuoc", label: "Tên nhóm thuốc", sortable: true, Outstanding: true },
  { id: "TrangThaiHoatDong", label: "Trạng thái" },
];

export default function Page() {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [rows, setRows] = useState<rowRenderType[]>([]);
  const [page, setPage] = useState(0); // page client (bắt đầu từ 0)
  const [totalItems, setTotalItems] = useState(0);
  const router = useRouter();

  const fetchData = async (currentPage: number) => {
    try {
      const data = await getDrugGroup (currentPage);
      if (data?.data) {
        const mappedRows = data.data.map((item: medicineGroupType) => ({
          _id: item._id,
          TenNhomThuoc: item.TenNhomThuoc,
          TrangThaiHoatDong: item.TrangThaiHoatDong,
        }));
        setRows(mappedRows);
        setTotalItems(data.totalItems || mappedRows.length);
      }
    } catch (error) {
      console.error("Lỗi khi lấy nhóm thuốc:", error);
    }
  };

  useEffect(() => {
    fetchData(page + 1); // API bắt đầu từ 1
  }, [page]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchText = row.TenNhomThuoc?.toLowerCase().includes(searchText.toLowerCase());
      const matchStatus =
        statusFilter === "Tất cả" ||
        (statusFilter === "Đang hoạt động" && row.TrangThaiHoatDong === true) ||
        (statusFilter === "Ngừng hoạt động" && row.TrangThaiHoatDong === false);

      return matchText && matchStatus;
    });
  }, [searchText, statusFilter, rows]);

  const handleStatusChange = (e: SelectChangeEvent) => {
    setStatusFilter(e.target.value);
  };

  return (
    <div className="AdminContent-Container">
      <BreadcrumbComponent
        items={[
          { title: "Trang chủ", href: "/Admin" },
          { title: "Kho thuốc", href: "/Admin/MedicineGroup" },
          { title: "Danh sách nhóm thuốc" },
        ]}
      />

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2, alignItems: "center" }}>
        <TextField
          sx={{ width: 250 }}
          size="small"
          placeholder="Tìm nhóm thuốc..."
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

        <FormControl size="small" sx={{ width: 200 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select value={statusFilter} label="Trạng thái" onChange={handleStatusChange}>
            <MenuItem value="Tất cả">Tất cả</MenuItem>
            <MenuItem value="Đang hoạt động">Đang hoạt động</MenuItem>
            <MenuItem value="Ngừng hoạt động">Ngừng hoạt động</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <CustomTableMedicine
        columns={columns}
        rows={filteredRows}
        onEdit={(id) => {router.push(`/Admin/Medicine/DrugGroup/Form/${id}`)}}
        onDelete={(row) => console.log("Xoá nhóm thuốc:", row)}
        onDisable={(row) => console.log("Chuyển trạng thái nhóm thuốc:", row)}
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
