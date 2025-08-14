"use client";
import { useState, useEffect, useMemo } from "react";
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
  SelectChangeEvent,
} from "@mui/material";
import BreadcrumbComponent from "../../component/Breadcrumb";
import CustomTableMedicine, {
  ColumnMedicine,
  rowRenderType,
} from "../../component/Table/CustomTableMedicine";
import { getListOfDrugs, SearchForMedicine, TestConversiondrugStateChangeStatusEvaluation } from "../../services/Category";
import { medicineType } from "@/app/types/hospitalTypes/hospitalType";
import { useRouter } from "next/navigation";
import ButtonAdd from "../../component/Button/ButtonAdd";
import { showToast, ToastType } from "@/app/lib/Toast";

const columns: ColumnMedicine[] = [
  { id: "TenThuoc", label: "Tên thuốc", sortable: true, Outstanding: true },
  { id: "DonVi", label: "Đơn vị" },
  { id: "Gia", label: "Giá", sortable: true },
  { id: "TenNhomThuoc", label: "Nhóm thuốc" },
  { id: "TrangThaiHoatDong", label: "Trạng thái" },
];

export default function Page() {
  const [searchText, setSearchText] = useState("");
  const [groupFilter, setGroupFilter] = useState("Tất cả");
  const [rows, setRows] = useState<rowRenderType[]>([]);
  const [page, setPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const router = useRouter();

  const fetchData = async (currentPage: number, search: string = "") => {
    try {
      let data;

      if (search.trim()) {
        data = await SearchForMedicine(search.trim());
      } else {
        data = await getListOfDrugs(currentPage);
      }

      if (data?.data) {
        const mapped = data.data.map((item: medicineType) => ({
          _id: item._id,
          TenThuoc: item.TenThuoc,
          DonVi: item.DonVi,
          Gia: item.Gia,
          TenNhomThuoc: item.Id_NhomThuoc?.TenNhomThuoc,
          TrangThaiHoatDong: item.TrangThaiHoatDong,
        }));
        setRows(mapped);
        setTotalItems(data.totalItems || mapped.length);
      } else {
        setRows([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách thuốc:", error);
    }
  };

  // 👇 Gọi fetch lại mỗi khi page hoặc searchText thay đổi
  useEffect(() => {
    if (searchText.trim()) {
      fetchData(1, searchText);
      setPage(0);
    } else {
      fetchData(page + 1);
    }
  }, [page, searchText]);


  // ✅ Lọc nhóm thuốc client-side
  const uniqueGroups = useMemo(() => {
    const groups = rows
      .map((r) => r.TenNhomThuoc)
      .filter((g, i, arr) => g && arr.indexOf(g) === i);
    return ["Tất cả", ...groups];
  }, [rows]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchGroup =
        groupFilter === "Tất cả" || row.TenNhomThuoc === groupFilter;
      return matchGroup;
    });
  }, [groupFilter, rows]);

  const handleGroupChange = (e: SelectChangeEvent) => {
    setGroupFilter(e.target.value);
  };


  // Chuyển đổi trạng thái
  const stateChange = async (id: string, TrangThaiHoatDong: boolean) => {
    try {
      const Result = await TestConversiondrugStateChangeStatusEvaluation (id, !TrangThaiHoatDong);
      console.log(Result);
      
      if (Result?.status){
        showToast ("Cập nhật trạng thái thành công", ToastType.success);
        await fetchData(page + 1);
      } else {
        showToast("Cập nhật thất bại", ToastType.error);
      }
    } catch (error) {
      showToast("Lỗi khi cập nhật trạng thái", ToastType.error);
      console.error(error);
    }
  };

  return (
    <div className="AdminContent-Container">
      <BreadcrumbComponent
        items={[
          { title: "Trang chủ", href: "/Admin" },
          { title: "Kho thuốc", href: "/Admin/Medicine" },
          { title: "Danh sách thuốc" },
        ]}
      />

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
          placeholder="Tìm tên thuốc..."
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
          <InputLabel>Nhóm thuốc</InputLabel>
          <Select value={groupFilter} label="Nhóm thuốc" onChange={handleGroupChange}>
            {uniqueGroups.map((group) => (
              <MenuItem key={group} value={group}>
                {group}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <div>
        <ButtonAdd 
          name="Thêm mới"
          link="/Admin/Medicine/Medicine/Form"
        />
      </div>
      </Box>

      <CustomTableMedicine
        columns={columns}
        rows={filteredRows}
        onEdit={(id) => {router.push(`/Admin/Medicine/Medicine/Form/${id}`)}}
        onDelete={(row) => console.log("Xoá thuốc:", row)}
        onDisable={stateChange}
        showEdit={true}
        showDelete={false}
        showDisable={true}
        page={page}
        totalItems={totalItems}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}
