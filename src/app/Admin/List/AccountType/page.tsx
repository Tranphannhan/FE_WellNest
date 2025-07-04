"use client";
import { useState, useEffect, useMemo } from "react";
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

import { getCategoryAdmin } from "../../services/Category";
const columns: ColumnCategory[] = [
  { id: "TenLoaiTaiKhoan", label: "Tên loại tài khoản", sortable: true, Outstanding: true },
  { id: "VaiTro", label: "Vai trò", sortable: true, Outstanding: false },
];


export default function Page() {
    const [searchText, setSearchText] = useState("");
    const [rows, setRows] = useState<rowRenderType[]>([]);

    const loaddingAPI = async () => {
        const data = await getCategoryAdmin ();
        console.log(data);
        
        if (!data) return;
        setRows (data);
    }

    useEffect (() => {
        loaddingAPI ();
    }, []);

  const filteredRows = useMemo(() => {
    return rows.filter((row) =>
      row.TenLoaiTaiKhoan?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, rows]);

  return (
    <div className="AdminContent-Container">
      <BreadcrumbComponent
        items={[
          { title: "Trang chủ", href: "/Admin" },
          { title: "Nhân sự", href: "/Admin/HumanResources/RoleType" },
          { title: "Loại tài khoản" },
        ]}
      />

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2, alignItems: "center" }}>
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

      <CustomTableCatalog
        columns={columns}
        rows={filteredRows}
        onEdit={(row) => console.log("Edit", row)}
        onDelete={(row) => console.log("Delete", row)}
        onDisable={(row) => console.log("Toggle status", row)}
        showEdit={true}
        showDelete={true}
        showDisable={true}
        page={1}
        totalItems={filteredRows.length}
        onPageChange={() => {}}
      />
    </div>
  );
}
