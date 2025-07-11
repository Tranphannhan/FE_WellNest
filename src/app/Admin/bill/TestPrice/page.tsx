
"use client";
import { useState, useEffect, useMemo } from "react";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/material";
import CustomTableBill, {
  ColumnCategory,
  rowRenderType,
} from "../../component/Table/CustomTableBill";
import BreadcrumbComponent from "../../component/Breadcrumb";
import { getBill } from "../../services/Category";

const columns: ColumnCategory[] = [
  { id: "HoVaTen", label: "Họ và tên", sortable: true, Outstanding: true },
  { id: "Ngay", label: "Ngày", sortable: true },
  { id: "Giadichvu", label: "Giá dịch vụ", sortable: true },
  { id: "LoaiHoaDon", label: "Loại hóa đơn", sortable: true },
  { id: "TenHoaDon", label: "Tên hóa đơn", sortable: true },
];

export default function Page() {
  const [searchText, setSearchText] = useState("");
  const [rows, setRows] = useState<rowRenderType[]>([]);
  const [page, setPage] = useState(0); // MUI dùng 0-based
  const [totalItems, setTotalItems] = useState(0);
  const rowsPerPage = 10;

  
  const fetchData = async (currentPage: number) => {
    try {
      const data = await getBill(currentPage , 'XetNghiem');
      console.log("✅ Dữ liệu từ API:", data);

      if (data?.data) {
        const mapped = data.data.map((item: any) => ({
          _id: item._id,
          HoVaTen: item?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.HoVaTen ?? "-",
          Ngay: item?.Id_PhieuKhamBenh?.Ngay ?? "-",
          Giadichvu: item?.Id_PhieuKhamBenh?.Id_GiaDichVu?.Giadichvu ?? 0,
          LoaiHoaDon: item?.LoaiHoaDon ?? "-",
          TenHoaDon: item?.TenHoaDon ?? "-",
        }));

        console.log("✅ Dữ liệu đã map:", mapped);
        setRows(mapped);
        setTotalItems(data.totalItems || mapped.length);
      }
    } catch (error) {
      console.error("Lỗi khi load hóa đơn:", error);
    }
  };

  useEffect(() => {
    fetchData(page + 1); // Server dùng 1-based
  }, [page]);

  // ✅ Lọc theo họ tên an toàn
  const filteredRows = useMemo(() => {
    const keyword = searchText.toLowerCase().trim();
    return rows.filter((row) =>
      (row?.HoVaTen ?? "").toLowerCase().includes(keyword)
    );
  }, [rows, searchText]);

  return (
    <div className="AdminContent-Container">
      <BreadcrumbComponent
        items={[
          { title: "Trang chủ", href: "/Admin" },
          { title: "Hóa đơn", href: "/Admin/Bill" },
          { title: "Hóa đơn xét nghiệm" },
        ]}
      />

      {/* 🔍 Tìm kiếm */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          sx={{ width: 300 }}
          size="small"
          placeholder="Tìm tên bệnh nhân..."
          variant="outlined"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: "20px" }} />
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
      </Box>

      {/* 📋 Bảng hóa đơn */}
      <CustomTableBill
        columns={columns}
        rows={filteredRows}
        page={page}
        totalItems={totalItems}
        rowsPerPage={rowsPerPage}
        onPageChange={(newPage) => setPage(newPage)}
        showEdit={false}
        showDelete={false}
        showDisable={false}
        onEdit={() => {}}
        onDelete={() => {}}
        onDisable={() => {}}
      />
    </div>
  );
}
