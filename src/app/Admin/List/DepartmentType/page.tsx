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
import CustomTableCatalog, {
  ColumnCategory,
  rowRenderType,
} from "../../component/Table/CustomTableCatalog";
import { getCategoryDepartments } from "../../services/Category";
import { Searchfordepartmenttype } from "../../services/DoctorSevices";
import { useRouter } from "next/navigation";
import ButtonAdd from "../../component/Button/ButtonAdd";
import changeDepartmentStatus from "../../services/TestType";

const columns: ColumnCategory[] = [
  { id: "TenKhoa", label: "Tên khoa", sortable: true, Outstanding: true },
  { id: "TrangThaiHoatDong", label: "Trạng thái hoạt động", sortable: true },
];

export default function Page() {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [rows, setRows] = useState<rowRenderType[]>([]);
  const [page, setPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const router = useRouter();

  // Fetch phân trang mặc định
  const fetchData = async (currentPage = 1) => {
    try {
      const data = await getCategoryDepartments(currentPage);
      if (data?.data) {
        const mapped = data.data.map((item: rowRenderType) => ({
          _id: item._id,
          TenKhoa: item.TenKhoa,
          TrangThaiHoatDong: item.TrangThaiHoatDong,
          TenXetNghiem: "",
        }));
        setRows(mapped);
        setTotalItems(data.totalItems);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khoa:", error);
    }
  };

  // Gọi danh sách bình thường khi không search
  useEffect(() => {
    if (searchText.trim() === "") {
      fetchData(page + 1);
    }
  }, [page, searchText]);

  // Gọi API tìm kiếm khi searchText có nội dung
  useEffect(() => {
    const timeout = setTimeout(() => {
      const handleSearch = async () => {
        try {
          if (searchText.trim() !== "") {
            const result = await Searchfordepartmenttype (searchText);
            if (Array.isArray(result)) {
              const mapped = result.map((item: rowRenderType) => ({
                _id: item._id,
                TenKhoa: item.TenKhoa,
                TrangThaiHoatDong: item.TrangThaiHoatDong,
                TenXetNghiem: "",
              }));
              setRows(mapped);
              setTotalItems(result.length);
              setPage(0); // reset về page đầu
            }
          }
        } catch (err) {
          console.error("Lỗi khi tìm kiếm loại khoa:", err);
        }
      };
      handleSearch();
    }, 300); // debounce 300ms

    return () => clearTimeout(timeout);
  }, [searchText]);

  // Lọc trạng thái tại client
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchStatus =
        statusFilter === "Tất cả" ||
        (statusFilter === "Đang hoạt động" && row.TrangThaiHoatDong === true) ||
        (statusFilter === "Ngừng hoạt động" && row.TrangThaiHoatDong === false);
      return matchStatus;
    });
  }, [rows, statusFilter]);

  const handleStatusChange = (e: SelectChangeEvent) => {
    setStatusFilter(e.target.value);
  };

  return (
    <div className="AdminContent-Container">
      <BreadcrumbComponent
        items={[
          { title: "Trang chủ", href: "/Admin" },
          { title: "Nhân sự", href: "/Admin/HumanResources/RoleType" },
          { title: "Loại tài khoản" },
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
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2, alignItems: "center" }}>
        <TextField
          sx={{ width: 250 }}
          size="small"
          placeholder="Tìm tên khoa..."
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
        <div>
        <ButtonAdd 
          name="Thêm mới"
          link="/Admin/List/DepartmentType/Form"
        />
      </div>
      </Box>

      <CustomTableCatalog
        columns={columns}
        rows={filteredRows}
        onEdit={(id) => {router.push(`/Admin/List/DepartmentType/Form/${id}`)}}
        onDelete={(row) => console.log("Delete", row)}
        onDisable={(id, status) => {
        changeDepartmentStatus(id, status)
        .then(() => {
        alert("Cập nhật thành công");
        fetchData(page + 1); // render lại
      })
      .catch(() => alert("Cập nhật thất bại"));
      }}
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
