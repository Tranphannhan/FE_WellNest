"use client";

import { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/material";
import BreadcrumbComponent from "../../component/Breadcrumb";
import CustomTableCatalog, {
  ColumnCategory,
  rowRenderType,
} from "../../component/Table/CustomTableCatalog";

import {
  getCategoryAdmin,
  SearchCategoryAdmin,
} from "../../services/Category";

const columns: ColumnCategory[] = [
  {
    id: "TenLoaiTaiKhoan",
    label: "Tên loại tài khoản",
    sortable: true,
    Outstanding: true,
  },
  {
    id: "VaiTro",
    label: "Vai trò",
    sortable: true,
    Outstanding: false,
  },
];

export default function Page() {
  const [searchText, setSearchText] = useState("");
  const [rows, setRows] = useState<rowRenderType[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);

  // Load toàn bộ danh sách loại tài khoản
  const loaddingAPI = async () => {
    const data = await getCategoryAdmin();
    if (!data) return;
    setRows(data);
    setTotalItems(data.length);
  };

  useEffect(() => {
    if (!searchText.trim()) {
      loaddingAPI();
    }
  }, [searchText]);

  // Gọi tìm kiếm khi có từ khóa
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (!searchText.trim()) return;

      const result = await SearchCategoryAdmin(searchText.trim());
      if (Array.isArray(result)) {
        setRows(result);
        setTotalItems(result.length);
      } else {
        setRows([]);
        setTotalItems(0);
      }
    }, 400); // debounce 400ms

    return () => clearTimeout(delayDebounceFn);
  }, [searchText]);

  return (
    <div className="AdminContent-Container">
      <BreadcrumbComponent
        items={[
          { title: "Trang chủ", href: "/Admin" },
          { title: "Nhân sự", href: "/Admin/HumanResources/RoleType" },
          { title: "Loại tài khoản" },
        ]}
      />

      {/* Ô tìm kiếm */}
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
          placeholder="Tìm loại tài khoản..."
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
      </Box>

      {/* Bảng dữ liệu */}
      <CustomTableCatalog
        columns={columns}
        rows={rows}
        onEdit={(row) => console.log("Edit", row)}
        onDelete={(row) => console.log("Delete", row)}
        onDisable={(row) => console.log("Toggle status", row)}
        showEdit={true}
        showDelete={true}
        showDisable={true}
        page={1}
        totalItems={totalItems}
        onPageChange={() => {}}
      />
    </div>
  );
}
