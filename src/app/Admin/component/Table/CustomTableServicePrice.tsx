"use client";
import * as React from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  TableSortLabel,
  TablePagination,
  
} from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { MoreOutlined } from "@ant-design/icons";
import { FaEdit, FaRegCheckCircle } from "react-icons/fa";
import { ImBlocked } from "react-icons/im";
import { FaRegTrashCan } from "react-icons/fa6";

// Kiểu dữ liệu hàng
export interface rowRenderType {
  _id: string;
  Tendichvu: string;
  Giadichvu: number;
  Loaigia: string;
  TrangThaiHoatDong: boolean;
}

export interface ColumnCategory {
  id: keyof rowRenderType;
  label: string;
  sortable?: boolean;
  Outstanding?: boolean;
}

interface CustomTableProps {
  columns: ColumnCategory[];
  rows: rowRenderType[];
  onEdit?: (row: rowRenderType) => void;
  onDelete?: (row: rowRenderType) => void;
  onDisable: (row: rowRenderType) => void;
  showEdit?: boolean;
  showDelete?: boolean;
  showDisable?: boolean;
  page?: number;
  totalItems?: number;
  onPageChange?: (newPage: number) => void;
}

export default function CustomTableServicePrice({
  columns,
  rows,
  onEdit,
  onDelete,
  onDisable,
  showEdit = true,
  showDelete = true,
  showDisable = true,
  page,
  totalItems,
  onPageChange,
}: CustomTableProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = React.useState<rowRenderType | null>(null);
  const [order, setOrder] = React.useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = React.useState<string>("");

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, row: rowRenderType) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleSort = (columnId: string) => {
    const isAsc = orderBy === columnId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(columnId);
  };

  const sortedRows = React.useMemo(() => {
    if (!orderBy) return rows;
    return [...rows].sort((a, b) => {
      const aVal = a[orderBy as keyof rowRenderType];
      const bVal = b[orderBy as keyof rowRenderType];
      if (aVal === undefined || bVal === undefined) return 0;
      if (aVal < bVal) return order === "asc" ? -1 : 1;
      if (aVal > bVal) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [rows, order, orderBy]);

  return (
    <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.id}>
                {col.sortable ? (
                  <TableSortLabel
                    active={orderBy === col.id}
                    direction={orderBy === col.id ? order : "asc"}
                    onClick={() => handleSort(col.id)}
                    hideSortIcon
                    sx={{ "& .MuiTableSortLabel-icon": { display: "none" } }}
                  >
                    <span style={{ display: "flex", alignItems: "center", fontWeight: 600 }}>
                      {col.label}
                      <span style={{ display: "flex", flexDirection: "column", marginLeft: 4 }}>
                        <ArrowDropUpIcon
                          fontSize="small"
                          style={{
                            color: orderBy === col.id && order === "asc" ? "#1976d2" : "#ccc",
                            marginBottom: -6,
                          }}
                        />
                        <ArrowDropDownIcon
                          fontSize="small"
                          style={{
                            color: orderBy === col.id && order === "desc" ? "#1976d2" : "#ccc",
                            marginTop: -6,
                          }}
                        />
                      </span>
                    </span>
                  </TableSortLabel>
                ) : (
                  col.label
                )}
              </TableCell>
            ))}
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {sortedRows.map((row, index) => (
            <TableRow
              key={index}
              hover
              sx={{ transition: "background-color 0.3s", "&:hover": { backgroundColor: "#f5f5f5" } }}
            >
              {columns.map((col) => (
                <TableCell key={col.id}>
                  {col.id === "TrangThaiHoatDong" ? (
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "4px 8px",
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 500,
                      backgroundColor: row[col.id] ? "#e8f5e9" : "#fbe9e7",
                      color: row[col.id] ? "#388e3c" : "#d84315",
                      minWidth: 130,
                      position: "relative",
                    }}>
                      <span style={{
                        position: "relative",
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: row[col.id] ? "#388e3c" : "#d84315"
                      }}>
                        <span style={{
                          content: '""',
                          position: "absolute",
                          inset: 0,
                          borderRadius: "50%",
                          backgroundColor: row[col.id] ? "#388e3c" : "#d84315",
                          animation: "pulseRing 1.8s cubic-bezier(0.215,0.61,0.355,1) infinite",
                          opacity: 0.6
                        }} />
                      </span>
                      {row[col.id] ? "Đang hoạt động" : "Ngừng hoạt động"}
                    </span>
                  ) : col.id === "Giadichvu" ? (
                    <span>{row.Giadichvu?.toLocaleString("vi-VN", { style: "currency", currency: "VND", minimumFractionDigits: 0 })}</span>
                  ) : (
                    <span>{row[col.id]}</span>
                  )}
                </TableCell>
              ))}

              <TableCell align="right">
                <IconButton onClick={(e) => handleOpenMenu(e, row)}>
                  <MoreOutlined />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {typeof page === "number" && typeof totalItems === "number" && onPageChange && (
        <TablePagination
          component="div"
          count={totalItems}
          page={page}
          onPageChange={(e, newPage) => onPageChange(newPage)}
          rowsPerPage={7}
          rowsPerPageOptions={[]}
        />
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          elevation: 3,
          sx: { minWidth: 160, borderRadius: 2, mt: 1, boxShadow: "0 2px 12px rgba(0,0,0,0.1)", p: 0.5 },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {onEdit && showEdit && selectedRow && (
          <MenuItem
            onClick={() => { onEdit(selectedRow); handleCloseMenu(); }}
            sx={{ color: "#1976d2", fontSize: 15, fontWeight: 500, px: 2, py: 1, borderRadius: 1, "&:hover": { backgroundColor: "#e3f2fd" } }}
          >
            <FaEdit style={{ marginRight: 8 }} /> Sửa
          </MenuItem>
        )}

        {onDelete && showDelete && selectedRow && (
          <MenuItem
            onClick={() => { onDelete(selectedRow); handleCloseMenu(); }}
            sx={{ color: "#d32f2f", fontSize: 15, fontWeight: 500, px: 2, py: 1, borderRadius: 1, "&:hover": { backgroundColor: "#ffebee" } }}
          >
            <FaRegTrashCan style={{ marginRight: 8 }} /> Xóa
          </MenuItem>
        )}

        {showDisable && selectedRow && selectedRow.TrangThaiHoatDong && (
          <MenuItem
            onClick={() => { onDisable(selectedRow); handleCloseMenu(); }}
            sx={{ color: "#d32f2f", fontSize: 15, fontWeight: 500, px: 2, py: 1, borderRadius: 1, "&:hover": { backgroundColor: "#ffebee" } }}
          >
            <ImBlocked style={{ marginRight: 8 }} /> Vô hiệu
          </MenuItem>
        )}

        {onDisable && selectedRow && !selectedRow.TrangThaiHoatDong && (
          <MenuItem
            onClick={() => { onDisable(selectedRow); handleCloseMenu(); }}
            sx={{ color: "#388e3c", fontSize: 15, fontWeight: 500, px: 2, py: 1, borderRadius: 1, "&:hover": { backgroundColor: "#e8f5e9" } }}
          >
            <FaRegCheckCircle style={{ marginRight: 8 }} /> Kích hoạt
          </MenuItem>
        )}
      </Menu>
    </TableContainer>
  );
}
