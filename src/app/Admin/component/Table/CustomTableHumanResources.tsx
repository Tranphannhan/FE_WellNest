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
  Box,
  Chip,
} from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { MoreOutlined } from "@ant-design/icons";
import { FaEdit, FaRegCheckCircle } from "react-icons/fa";
import { ImBlocked } from "react-icons/im";
import { FaRegTrashCan } from "react-icons/fa6";

type Order = "asc" | "desc";

export interface rowRenderType {
  _id: string;
  TenBacSi?: string; // Optional for doctor-specific data
  TenTaiKhoan?: string; // Optional for account-specific data
  GioiTinh: string;
  HocVi?: string; // Optional for doctor-specific data
  SoDienThoai: string;
  Khoa?: string; // Optional for doctor-specific data
  Phong?: string; // Optional for doctor-specific data
  TrangThaiHoatDong: boolean;
  Image: string;
  TenLoai?: string; // Optional for account-specific data
}

export interface Column {
  id: keyof rowRenderType;
  label: string;
  sortable?: boolean;
  Outstanding?: boolean;
}

interface CustomTableProps {
  columns: Column[];
  rows: rowRenderType[];
  onEdit?: (id: string) => void; // Updated to include row parameter
  onDelete?: () => void; // Updated to include row parameter
  onDisable?: (id:string , TrangThaiHoatDong : boolean) => void; // Updated to include row parameter
  showEdit?: boolean;
  showDelete?: boolean;
  showDisable?: boolean;
  page?: number;
  totalItems?: number;
  onPageChange?: (newPage: number) => void;
}

export default function CustomTableHumanResources({
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
  const [selectedRow, setSelectedRow] = React.useState<rowRenderType | null>(
    null
  );
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<string>("");

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLElement>,
    row: rowRenderType
  ) => {
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
    <TableContainer
      component={Paper}
      sx={{
        boxShadow: "none",
      }}
    >
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
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        fontWeight: 600,
                      }}
                    >
                      {col.label}
                      <span
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          marginLeft: 4,
                        }}
                      >
                        <ArrowDropUpIcon
                          fontSize="small"
                          style={{
                            color:
                              orderBy === col.id && order === "asc"
                                ? "#1976d2"
                                : "#ccc",
                            marginBottom: -6,
                          }}
                        />
                        <ArrowDropDownIcon
                          fontSize="small"
                          style={{
                            color:
                              orderBy === col.id && order === "desc"
                                ? "#1976d2"
                                : "#ccc",
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
              sx={{
                transition: "background-color 0.3s",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              {columns.map((col) => (
                <TableCell key={col.id}>
                  {col.id === "Image" ? (
                    <Box
                      component="img"
                      src={row[col.id]}
                      alt="avatar"
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        transition: "transform 0.3s",
                        "&:hover": {
                          transform: "scale(1.2)",
                        },
                      }}
                    />
                  ) : col.id === "TrangThaiHoatDong" ? (
                    <span
                      style={{
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
                      }}
                    >
                      <span
                        style={{
                          position: "relative",
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: row[col.id] ? "#388e3c" : "#d84315",
                        }}
                      >
                        <span
                          style={{
                            content: '""',
                            position: "absolute",
                            inset: 0,
                            borderRadius: "50%",
                            backgroundColor: row[col.id]
                              ? "#388e3c"
                              : "#d84315",
                            animation:
                              "pulseRing 1.8s cubic-bezier(0.215,0.61,0.355,1) infinite",
                            opacity: 0.6,
                          }}
                        />
                      </span>
                      {row[col.id] ? "Đang hoạt động" : "Ngừng hoạt động"}
                    </span>
                  ) : (
                    <span
                      style={{
                        color: col.Outstanding ? "#3497F9" : undefined,
                      }}
                    >
                      {col.id === "Khoa" || col.id === "TenLoai" ? (
                        <Chip
                          label={row.Khoa || row.TenLoai}
                          color="primary"
                          size="small"
                          variant="filled"
                          sx={{
                            fontWeight: 500,
                            backgroundColor: "#e3f2fd",
                            color: "#1976d2",
                            border: "none",
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            color: col.Outstanding ? "#3497F9" : undefined,
                          }}
                        >
                          {row[col.id] ?? "-"}
                        </span>
                      )}
                    </span>
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

      {typeof page === "number" &&
        typeof totalItems === "number" &&
        onPageChange && (
          <TablePagination
            component="div"
            count={totalItems}
            page={page}
            onPageChange={(event, newPage) => onPageChange(newPage)}
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
          sx: {
            minWidth: 160,
            borderRadius: 2,
            mt: 1,
            boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
            p: 0.5,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {onEdit && showEdit && (
          <MenuItem
            onClick={() => {
              if (selectedRow && onEdit) {
                onEdit(selectedRow._id);
                handleCloseMenu();
              }
            }}
            sx={{
              color: "#1976d2",
              fontSize: 15,
              fontWeight: 500,
              px: 2,
              py: 1,
              borderRadius: 1,
              "&:hover": {
                backgroundColor: "#e3f2fd",
              },
            }}
          >
            <FaEdit style={{ marginRight: 8 }} />
            Sửa
          </MenuItem>
        )}

        {onDelete && showDelete && (
          <MenuItem
            onClick={() => {
              if (selectedRow && onDelete) {
                onDelete();
                handleCloseMenu();
              }
            }}
            sx={{
              color: "#d32f2f",
              fontSize: 15,
              fontWeight: 500,
              px: 2,
              py: 1,
              borderRadius: 1,
              "&:hover": {
                backgroundColor: "#ffebee",
              },
            }}
          >
            <FaRegTrashCan style={{ marginRight: 8 }} />
            Xóa
          </MenuItem>
        )}

        {onDisable && selectedRow?.TrangThaiHoatDong && selectedRow?.TenLoai !== "Người quản trị" &&(
          <MenuItem
            onClick={() => {
              if (selectedRow && onDisable) {
                onDisable(selectedRow._id , selectedRow.TrangThaiHoatDong);
                handleCloseMenu();
              }
            }}
            sx={{
              color: "#d32f2f",
              fontSize: 15,
              fontWeight: 500,
              px: 2,
              py: 1,
              borderRadius: 1,
              "&:hover": {
                backgroundColor: "#ffebee",
              },
            }}
          >
            <ImBlocked style={{ marginRight: 8 }} />
            Vô hiệu
          </MenuItem>
        )}

        {showDisable && selectedRow?.TrangThaiHoatDong === false && (
          <MenuItem
            onClick={() => {
              if (selectedRow && onDisable) {
                onDisable(selectedRow._id , selectedRow.TrangThaiHoatDong);
                handleCloseMenu();
              }
            }}
            sx={{
              color: "#388e3c",
              fontSize: 15,
              fontWeight: 500,
              px: 2,
              py: 1,
              borderRadius: 1,
              "&:hover": {
                backgroundColor: "#e8f5e9",
              },
            }}
          >
            <FaRegCheckCircle style={{ marginRight: 8 }} />
            Kích hoạt 
          </MenuItem>
        )}
      </Menu>
    </TableContainer>
  );
}
