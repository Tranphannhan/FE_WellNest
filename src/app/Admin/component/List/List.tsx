"use client";

import React from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, TextField, InputAdornment, TableFooter, TableSortLabel, Box
} from "@mui/material";
import { FaSearch } from "react-icons/fa";

interface HeadCell {
  id: string;
  label: string;
}

interface Transaction {
  date: string;
  time: string;
  type: string;
  description: string;
  amount: number;
}

interface TransactionTableProps {
  transactionsToShow: Transaction[];
  totalAmount: number;
  searchTerm: string;
  orderBy: string;
  order: "asc" | "desc";
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRequestSort: (property: keyof Transaction) => void;
  headCells: HeadCell[];
  title?: string;
  emptyText?: string;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactionsToShow,
  totalAmount,
  searchTerm,
  orderBy,
  order,
  handleInputChange,
  handleRequestSort,
  headCells,
  title,
  emptyText = "Không có dữ liệu để hiển thị.",
}) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" sx={{ fontWeight: "medium" }}>{title}</Typography>
        <TextField
          name="searchTerm"
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={handleInputChange}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaSearch />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            {headCells.map((head) => (
              <TableCell
                key={head.id}
                align={head.id === "amount" ? "right" : "left"}
                sx={(theme) => ({
                  fontWeight: "bold",
                  color: theme.palette.mode === "dark" ? "#000" : undefined,
                  backgroundColor: theme.palette.mode === "dark" ? "#212121" : "#bbdefb",
                  p: 2,
                })}
              >
                <TableSortLabel
                  active={orderBy === head.id}
                  direction={orderBy === head.id ? order : "asc"}
                  onClick={() => handleRequestSort(head.id as keyof Transaction)}
                >
                  {head.label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {transactionsToShow.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 4, color: "#666" }}>
                {emptyText}
              </TableCell>
            </TableRow>
          ) : (
            transactionsToShow.map((transaction, index) => (
              <TableRow
                key={index}
                hover
                sx={{
                  "&:hover": { backgroundColor: "#f9f9f9" },
                  transition: "background-color 0.2s",
                }}
              >
                <TableCell>{new Date(transaction.date).toLocaleDateString("vi-VN")}</TableCell>
                <TableCell>{transaction.time}</TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 500, color: "#d32f2f" }}>
                  {transaction.amount.toLocaleString()} VND
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        <TableFooter>
          <TableRow sx={{ backgroundColor: "#fff3e0" }}>
            <TableCell colSpan={4} align="right" sx={{ fontWeight: "bold", color: "#333", py: 1.5 }}>
              Tổng cộng:
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold", color: "#d32f2f", fontSize: "1.1rem" }}>
              {totalAmount.toLocaleString()} VND
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default TransactionTable;
