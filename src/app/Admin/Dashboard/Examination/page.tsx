"use client";

import React, { useEffect, useState, useCallback } from "react";
import { MedicalRecordType } from "@/app/types/hospitalTypes/hospitalType";
import { fetchMedicalRecordsByDateRange } from "@/app/services/FileTam";
import {
    Paper,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
} from "@mui/material";
import Pagination from "@/app/components/ui/Pagination/Pagination";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ScriptableContext,
    ChartOptions,
} from "chart.js";
import "./Examination.css";
import { FaFilterCircleDollar } from "react-icons/fa6";
import PaymentPieChart from "../../component/PaymentPieChart/PaymentPieChart";
import TransactionTable from "../../component/List/List";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface Transaction {
    date: string;
    time: string;
    type: "Khám";
    description: string;
    amount: number;
}

const transactionsPerPage = 7;

const headCells = [
  { id: "date", label: "Ngày" },
  { id: "time", label: "Thời gian" },
  { id: "type", label: "Loại giao dịch" },
  { id: "description", label: "Mô tả" },
  { id: "amount", label: "Số tiền" },
];

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
};

export default function MedicalRecordTransactions() {
    const [medicalRecordTransactions, setMedicalRecordTransactions] = useState<Transaction[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterStartDate, setFilterStartDate] = useState("");
    const [filterEndDate, setFilterEndDate] = useState("");
    const [filterMonth, setFilterMonth] = useState("");
    const [filterQuarter, setFilterQuarter] = useState("");
    const [filterYear, setFilterYear] = useState("2025");
    const [orderBy, setOrderBy] = useState<keyof Transaction>("date");
    const [order, setOrder] = useState<"asc" | "desc">("desc");
    const [searchTerm, setSearchTerm] = useState("");
    const [paidCount, setPaidCount] = useState(0);
    const [unpaidCount, setUnpaidCount] = useState(0);

    const populateYears = useCallback(() => {
        return [2025, 2024, 2023];
    }, []);

    const fetchMedicalRecordTransactions = useCallback(async () => {
        try {
            let medicalRecords: MedicalRecordType[] = [];

            let fromDate: string | undefined = undefined;
            let toDate: string | undefined = undefined;
            let year: number | undefined = undefined;

            if (filterStartDate && filterEndDate) {
                fromDate = filterStartDate;
                toDate = filterEndDate;
            } else if (filterMonth) {
                const [yearStr, month] = filterMonth.split("-").map(Number);
                fromDate = `${yearStr}-${month.toString().padStart(2, "0")}-01`;
                toDate = new Date(yearStr, month, 0).toISOString().split("T")[0];
            } else if (filterQuarter && filterYear) {
                const quarterStartMonth = (Number(filterQuarter) - 1) * 3 + 1;
                fromDate = `${filterYear}-${quarterStartMonth.toString().padStart(2, "0")}-01`;
                toDate = `${filterYear}-${(quarterStartMonth + 2).toString().padStart(2, "0")}-${new Date(
                    Number(filterYear),
                    quarterStartMonth + 2,
                    0
                ).getDate()}`;
            } else if (filterYear) {
                year = Number(filterYear);
            } else {
                year = 2025;
            }

            const medicalRecordResponse = await fetchMedicalRecordsByDateRange(fromDate, toDate, year).catch(() => ({
                data: [],
            }));
            medicalRecords = medicalRecordResponse.data || [];

            const transactions: Transaction[] = medicalRecords
                .filter((m) => m.TrangThaiThanhToan && m.Id_GiaDichVu?.Giadichvu)
                .map((m) => ({
                    date: m.Ngay || new Date(m.createdAt || Date.now()).toISOString().split("T")[0],
                    time: m.Gio || new Date(m.createdAt || Date.now()).toLocaleTimeString("vi-VN", { hour12: false }),
                    type: "Khám" as const,
                    description: m.Id_GiaDichVu?.Tendichvu || "Phiếu khám không tên",
                    amount: m.Id_GiaDichVu?.Giadichvu || 0,
                }))
                .sort((a, b) => {
                    const dateA = new Date(`${a.date} ${a.time}`);
                    const dateB = new Date(`${b.date} ${b.time}`);
                    return dateB.getTime() - dateA.getTime();
                });

            setMedicalRecordTransactions(transactions);
            setCurrentPage(1);
        } catch (error) {
            console.error("Error fetching medical record transactions:", error);
            setMedicalRecordTransactions([]);
        }
    }, [filterStartDate, filterEndDate, filterMonth, filterQuarter, filterYear]);

    const fetchAllMedicalRecords = useCallback(async () => {
        try {
            let medicalRecords: MedicalRecordType[] = [];
            let fromDate: string | undefined;
            let toDate: string | undefined;
            let year: number | undefined;

            if (filterStartDate && filterEndDate) {
                fromDate = filterStartDate;
                toDate = filterEndDate;
            } else if (filterMonth) {
                const [yearStr, month] = filterMonth.split("-").map(Number);
                fromDate = `${yearStr}-${month.toString().padStart(2, "0")}-01`;
                toDate = new Date(yearStr, month, 0).toISOString().split("T")[0];
            } else if (filterQuarter && filterYear) {
                const quarterStartMonth = (Number(filterQuarter) - 1) * 3 + 1;
                fromDate = `${filterYear}-${quarterStartMonth.toString().padStart(2, "0")}-01`;
                toDate = `${filterYear}-${(quarterStartMonth + 2).toString().padStart(2, "0")}-${new Date(
                    Number(filterYear),
                    quarterStartMonth + 2,
                    0
                ).getDate()}`;
            } else if (filterYear) {
                year = Number(filterYear);
            } else {
                year = 2025;
            }

            const response = await fetchMedicalRecordsByDateRange(fromDate, toDate, year, true).catch(() => ({
                data: [],
            }));
            medicalRecords = response.data || [];

            const paid = medicalRecords.filter((m) => m.TrangThaiThanhToan === true).length;
            const unpaid = medicalRecords.filter((m) => m.TrangThaiThanhToan === false).length;

            setPaidCount(paid);
            setUnpaidCount(unpaid);
        } catch (error) {
            console.error("Error fetching all medical records for pie chart:", error);
            setPaidCount(0);
            setUnpaidCount(0);
        }
    }, [filterStartDate, filterEndDate, filterMonth, filterQuarter, filterYear]);

    useEffect(() => {
        fetchMedicalRecordTransactions();
        fetchAllMedicalRecords();
    }, []);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        switch (name) {
            case "filterStartDate":
                setFilterStartDate(value);
                setFilterMonth("");
                setFilterQuarter("");
                setFilterYear("");
                break;
            case "filterEndDate":
                setFilterEndDate(value);
                setFilterMonth("");
                setFilterQuarter("");
                setFilterYear("");
                break;
            case "filterMonth":
                setFilterMonth(value);
                setFilterStartDate("");
                setFilterEndDate("");
                setFilterQuarter("");
                setFilterYear("");
                break;
            case "searchTerm":
                setSearchTerm(value);
                setCurrentPage(1);
                break;
        }
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        if (name === "filterQuarter") {
            setFilterQuarter(value);
            setFilterStartDate("");
            setFilterEndDate("");
            setFilterMonth("");
            setFilterYear(value ? filterYear || "2025" : "");
        } else if (name === "filterYear") {
            setFilterYear(value);
            setFilterStartDate("");
            setFilterEndDate("");
            setFilterMonth("");
            setFilterQuarter("");
        }
    };

    const handleRequestSort = (property: keyof Transaction) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const sortedAndFilteredTransactions = medicalRecordTransactions
        .filter((transaction) =>
            transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            const valueA = a[orderBy];
            const valueB = b[orderBy];
            if (orderBy === "date") {
                const dateA = new Date(`${a.date} ${a.time}`);
                const dateB = new Date(`${b.date} ${b.time}`);
                return order === "asc"
                    ? dateA.getTime() - dateB.getTime()
                    : dateB.getTime() - dateA.getTime();
            }
            if (typeof valueA === "number" && typeof valueB === "number") {
                return order === "asc" ? valueA - valueB : valueB - valueA;
            }
            return order === "asc"
                ? String(valueA).localeCompare(String(valueB))
                : String(valueB).localeCompare(String(valueA));
        });

    const totalPages = Math.ceil(sortedAndFilteredTransactions.length / transactionsPerPage);
    const startIndex = (currentPage - 1) * transactionsPerPage;
    const endIndex = Math.min(startIndex + transactionsPerPage, sortedAndFilteredTransactions.length);
    const transactionsToShow = sortedAndFilteredTransactions.slice(startIndex, endIndex);

    const totalMedicalRecordRevenue = sortedAndFilteredTransactions.reduce((sum, t) => sum + t.amount, 0);

  const calculateTotalByDateRange = () => {
  if (filterStartDate && filterEndDate) {
    return sortedAndFilteredTransactions
      .filter((t) => {
        const transactionDate = new Date(t.date);
        const start = new Date(filterStartDate);
        const end = new Date(filterEndDate);
        return transactionDate >= start && transactionDate <= end;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  } else {
    // Nếu không filter, lấy theo ngày hôm nay
    const today = new Date().toISOString().split("T")[0];
    return sortedAndFilteredTransactions
      .filter((t) => t.date === today)
      .reduce((sum, t) => sum + t.amount, 0);
  }
};


  const calculateTotalByMonth = () => {
  if (filterMonth) {
    const [year, month] = filterMonth.split("-").map(Number);
    return sortedAndFilteredTransactions
      .filter((t) => {
        const transactionDate = new Date(t.date);
        return transactionDate.getFullYear() === year && (transactionDate.getMonth() + 1) === month;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  } else {
    // Nếu không filter, lấy theo tháng hiện tại
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    return sortedAndFilteredTransactions
      .filter((t) => {
        const transactionDate = new Date(t.date);
        return transactionDate.getFullYear() === currentYear && (transactionDate.getMonth() + 1) === currentMonth;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  }
};

    const calculateTotalByYear = () => {
        if (filterYear) {
            const year = Number(filterYear);
            return sortedAndFilteredTransactions
                .filter((t) => new Date(t.date).getFullYear() === year)
                .reduce((sum, t) => sum + t.amount, 0);
        }
        return totalMedicalRecordRevenue;
    };

    const generateChartData = () => {
        const dateMap = new Map<string, number>();
        sortedAndFilteredTransactions.forEach((t) => {
            const date = t.date;
            const currentTotal = dateMap.get(date) || 0;
            dateMap.set(date, currentTotal + t.amount);
        });

        const labels = Array.from(dateMap.keys()).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
        const data = labels.map((date) => dateMap.get(date) || 0);

        return {
            labels,
            datasets: [
                {
                    label: "Doanh thu (VND)",
                    data,
                    fill: true,
                    backgroundColor: (context: ScriptableContext<"line">) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(0, 0, 0, 900);
                        gradient.addColorStop(0, "rgba(147, 51, 234, 0.4)");
                        gradient.addColorStop(1, "rgba(147, 51, 234, 0.1)");
                        return gradient;
                    },
                    borderColor: "rgba(147, 51, 234, 1)",
                    borderWidth: 2,
                    tension: 0.4,
                },
            ],
        };
    };

    const chartOptions: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Ngày",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Doanh thu (VND)",
                },
                beginAtZero: true,
            },
        },
        plugins: {
            legend: {
                position: "top" as const,
            },
            tooltip: {
                mode: "index",
                intersect: false,
            },
        },
    };

    const pieChartData = [
        {
            id: "Đã thanh toán",
            label: "Đã thanh toán",
            value: paidCount,
            color: "#4caf50",
        },
        {
            id: "Chưa thanh toán",
            label: "Chưa thanh toán",
            value: unpaidCount,
            color: "#f44336",
        },
    ];

    return (
        <div className="AdminContent-Container">
            <Typography variant="h5" align="center" sx={{ fontWeight: "bold", color: "#1F2937", mb: 5 }}>
                Danh Sách Hóa Đơn Khám
            </Typography>

            <div className="card_Container mb-5">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-end">
                    <TextField
                        name="filterStartDate"
                        label="Ngày bắt đầu"
                        type="date"
                        value={filterStartDate}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        size="small"
                    />
                    <TextField
                        name="filterEndDate"
                        label="Ngày kết thúc"
                        type="date"
                        value={filterEndDate}
                        onChange={handleInputChange}
                        disabled={!filterStartDate}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        size="small"
                    />
                    <TextField
                        name="filterMonth"
                        label="Theo tháng"
                        type="month"
                        value={filterMonth}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        size="small"
                    />
                    <FormControl fullWidth size="small">
                        <InputLabel id="filterQuarter-label">Theo quý</InputLabel>
                        <Select
                            labelId="filterQuarter-label"
                            name="filterQuarter"
                            value={filterQuarter}
                            label="Theo quý"
                            onChange={handleSelectChange}
                        >
                            <MenuItem value="">Tất cả quý</MenuItem>
                            <MenuItem value="1">Quý 1</MenuItem>
                            <MenuItem value="2">Quý 2</MenuItem>
                            <MenuItem value="3">Quý 3</MenuItem>
                            <MenuItem value="4">Quý 4</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth size="small">
                        <InputLabel id="filterYear-label">Theo năm</InputLabel>
                        <Select
                            labelId="filterYear-label"
                            name="filterYear"
                            value={filterYear}
                            label="Theo năm"
                            onChange={handleSelectChange}
                        >
                            <MenuItem value="">Tất cả năm</MenuItem>
                            {populateYears().map((year) => (
                                <MenuItem key={year} value={year.toString()}>
                                    {year}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <button
                        id="applyFilterBtn"
                        className="bigButton--blue flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        onClick={() => {
                            fetchMedicalRecordTransactions();
                            fetchAllMedicalRecords();
                        }}
                    >
                        <FaFilterCircleDollar />
                        Áp dụng lọc
                    </button>
                </div>
            </div>

            <div className="summary-cards mb-4">
                {[
                    { title: "Tổng Tiền", amount: calculateTotalByYear() || totalMedicalRecordRevenue },
                    { title: "Theo Ngày", amount: calculateTotalByDateRange() },
                    { title: "Theo Tháng", amount: calculateTotalByMonth() },
                ].map((card, i) => (
                    <div className="summary-card" key={i}>
                        <Paper
                            sx={{
                                p: 3,
                                textAlign: "left",
                                color: "#fff",
                                background: [
                                    "linear-gradient(-90deg, #a18cd1, #fbc2eb)",
                                    "linear-gradient(-90deg, #56ab2f, #a8e063)",
                                    "linear-gradient(-90deg, rgb(255, 42, 191), rgb(255, 183, 223))"
                                ][i],
                                borderRadius: 3,
                            }}
                        >
                            <Typography sx={{ fontSize: "18px" }}>{card.title}</Typography>
                            <Typography sx={{ fontSize: "24px" }} fontWeight="bold" mt={1}>
                                {formatCurrency(card.amount)}
                            </Typography>
                        </Paper>
                    </div>
                ))}
            </div>


            <Typography variant="h6" align="center" sx={{ fontWeight: "bold", color: "#1F2937", mb: 2 }}>
                Doanh Thu Khám Theo Ngày
            </Typography>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <div style={{ width: "60%", height: "320px" }}>
                    <Line data={generateChartData()} options={chartOptions} />
                </div>
                <PaymentPieChart
                    title="Tỷ lệ Phiếu Khám Đã / Chưa Thanh Toán"
                    data={pieChartData}
                    total={paidCount + unpaidCount}
                />
            </div>

            <TransactionTable
      title="Danh sách hóa đơn khám"
      headCells={headCells}
      transactionsToShow={transactionsToShow}
      totalAmount={totalMedicalRecordRevenue}
      searchTerm={searchTerm}
      orderBy={orderBy}
      order={order}
      handleInputChange={handleInputChange}
      handleRequestSort={handleRequestSort}
      emptyText="Không có hóa đơn khám để hiển thị."
    />

            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
        </div>
    );
};