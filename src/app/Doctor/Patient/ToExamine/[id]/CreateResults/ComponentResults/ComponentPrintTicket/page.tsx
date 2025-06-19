'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Chart from 'chart.js/auto';
import './RevenueDashboard.css';
import Tabbar from '@/app/components/shared/Tabbar/Tabbar';
import Pagination from '@/app/components/ui/Pagination/Pagination';

interface Transaction {
    date: string;
    time: string;
    type: 'Đơn thuốc' | 'Cận lâm sàng';
    description: string;
    amount: number;
}

const allTransactions: Transaction[] = [
    // Data for 2024
    { date: '2024-01-10', time: '08:30', type: 'Đơn thuốc', description: 'Đơn thuốc khám tổng quát', amount: 1500000 },
    { date: '2024-01-10', time: '09:15', type: 'Cận lâm sàng', description: 'Xét nghiệm máu', amount: 800000 },
    { date: '2024-01-12', time: '10:00', type: 'Đơn thuốc', description: 'Đơn thuốc tái khám', amount: 750000 },
    { date: '2024-01-15', time: '11:30', type: 'Cận lâm sàng', description: 'Siêu âm bụng', amount: 1200000 },
    { date: '2024-02-05', time: '10:00', type: 'Đơn thuốc', description: 'Đơn thuốc tái khám', amount: 750000 },
    { date: '2024-03-20', time: '11:30', type: 'Cận lâm sàng', description: 'Siêu âm bụng', amount: 1200000 },
    { date: '2024-04-12', time: '14:00', type: 'Đơn thuốc', description: 'Đơn thuốc cảm cúm', amount: 400000 },
    { date: '2024-05-18', time: '15:45', type: 'Cận lâm sàng', description: 'Chụp X-quang', amount: 950000 },
    { date: '2024-06-25', time: '16:20', type: 'Đơn thuốc', description: 'Đơn thuốc dạ dày', amount: 600000 },
    { date: '2024-07-01', time: '09:00', type: 'Đơn thuốc', description: 'Đơn thuốc viêm họng', amount: 300000 },
    { date: '2024-08-15', time: '13:00', type: 'Cận lâm sàng', description: 'Điện tâm đồ', amount: 700000 },
    { date: '2024-09-03', time: '11:00', type: 'Đơn thuốc', description: 'Đơn thuốc sốt xuất huyết', amount: 1800000 },
    { date: '2024-10-22', time: '10:30', type: 'Cận lâm sàng', description: 'Nội soi dạ dày', amount: 2500000 },
    { date: '2024-11-01', time: '08:00', type: 'Đơn thuốc', description: 'Đơn thuốc tiểu đường', amount: 900000 },
    { date: '2024-12-10', time: '14:30', type: 'Cận lâm sàng', description: 'Kiểm tra chức năng gan', amount: 1100000 },
    { date: '2024-01-15', time: '10:30', type: 'Đơn thuốc', description: 'Khám tổng quát định kỳ', amount: 1200000 },
    { date: '2024-02-20', time: '14:00', type: 'Cận lâm sàng', description: 'Xét nghiệm nước tiểu', amount: 350000 },
    { date: '2024-03-01', time: '09:00', type: 'Đơn thuốc', description: 'Đơn thuốc viêm phế quản', amount: 500000 },
    { date: '2024-04-05', time: '16:00', type: 'Cận lâm sàng', description: 'Đo điện não đồ', amount: 1800000 },
    { date: '2024-05-10', time: '11:00', type: 'Đơn thuốc', description: 'Đơn thuốc điều trị mụn', amount: 250000 },
    { date: '2024-06-15', time: '13:30', type: 'Cận lâm sàng', description: 'Siêu âm tim', amount: 1500000 },
    { date: '2024-07-20', time: '08:45', type: 'Đơn thuốc', description: 'Đơn thuốc giảm đau', amount: 180000 },
    { date: '2024-08-25', time: '10:15', type: 'Cận lâm sàng', description: 'Chụp CT ngực', amount: 3000000 },
    { date: '2024-09-30', time: '12:00', type: 'Đơn thuốc', description: 'Đơn thuốc bổ sung vitamin', amount: 300000 },
    { date: '2024-10-01', time: '15:00', type: 'Cận lâm sàng', description: 'Xét nghiệm chức năng thận', amount: 600000 },
    { date: '2024-11-10', time: '09:30', type: 'Đơn thuốc', description: 'Đơn thuốc kháng sinh', amount: 700000 },
    { date: '2024-12-05', time: '11:45', type: 'Cận lâm sàng', description: 'MRI cột sống', amount: 4000000 },
    // Data for 2023
    { date: '2023-01-01', time: '10:00', type: 'Đơn thuốc', description: 'Đơn thuốc cũ 2023', amount: 1000000 },
    { date: '2023-04-15', time: '11:00', type: 'Cận lâm sàng', description: 'Xét nghiệm 2023', amount: 500000 },
    { date: '2023-07-20', time: '15:00', type: 'Đơn thuốc', description: 'Đơn thuốc khác 2023', amount: 800000 },
    { date: '2023-10-05', time: '09:00', type: 'Cận lâm sàng', description: 'Siêu âm 2023', amount: 1000000 },
    { date: '2023-02-14', time: '14:00', type: 'Đơn thuốc', description: 'Đơn thuốc ho 2023', amount: 300000 },
    { date: '2023-05-22', time: '16:00', type: 'Cận lâm sàng', description: 'CT Scan 2023', amount: 2000000 },
    { date: '2023-08-01', time: '10:00', type: 'Đơn thuốc', description: 'Đơn thuốc dị ứng 2023', amount: 450000 },
    { date: '2023-11-11', time: '12:00', type: 'Cận lâm sàng', description: 'MRI não 2023', amount: 3500000 },
    // Data for June 19, 2025 (current date for testing)
    { date: '2025-06-16', time: '09:00', type: 'Đơn thuốc', description: 'Đơn thuốc đầu tuần này', amount: 2000000 },
    { date: '2025-06-17', time: '09:30', type: 'Cận lâm sàng', description: 'Xét nghiệm hôm qua', amount: 1000000 },
    { date: '2025-06-18', time: '10:00', type: 'Đơn thuốc', description: 'Đơn thuốc hôm qua 2', amount: 1200000 },
    { date: '2025-06-19', time: '10:30', type: 'Cận lâm sàng', description: 'Siêu âm hôm nay 1', amount: 800000 },
    { date: '2025-06-19', time: '11:00', type: 'Đơn thuốc', description: 'Đơn thuốc hôm nay 3', amount: 900000 },
    { date: '2025-06-19', time: '11:30', type: 'Cận lâm sàng', description: 'Điện tim hôm nay 1', amount: 400000 },
    { date: '2025-06-19', time: '12:00', type: 'Đơn thuốc', description: 'Đơn thuốc hôm nay 4', amount: 600000 },
    { date: '2025-06-19', time: '13:00', type: 'Cận lâm sàng', description: 'Chụp X-quang hôm nay 1', amount: 700000 },
    { date: '2025-06-19', time: '13:30', type: 'Đơn thuốc', description: 'Đơn thuốc hôm nay 5', amount: 500000 },
    { date: '2025-06-19', time: '14:00', type: 'Cận lâm sàng', description: 'Xét nghiệm hôm nay 2', amount: 1500000 },
    { date: '2025-06-19', time: '14:30', type: 'Đơn thuốc', description: 'Đơn thuốc hôm nay 6', amount: 1100000 },
    { date: '2025-06-19', time: '15:00', type: 'Cận lâm sàng', description: 'Siêu âm hôm nay 2', amount: 900000 },
    { date: '2025-06-19', time: '15:30', type: 'Đơn thuốc', description: 'Đơn thuốc hôm nay 7', amount: 300000 },
    { date: '2025-06-19', time: '16:00', type: 'Cận lâm sàng', description: 'Điện tim hôm nay 2', amount: 600000 },
    { date: '2025-06-19', time: '16:30', type: 'Đơn thuốc', description: 'Đơn thuốc hôm nay 8', amount: 750000 },
    { date: '2025-06-19', time: '17:00', type: 'Cận lâm sàng', description: 'Chụp X-quang hôm nay 2', amount: 1100000 },
];

const transactionsPerPage = 10;

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
};

const getEndOfWeek = (date: Date) => {
    const d = new Date(getStartOfWeek(date));
    d.setDate(d.getDate() + 6);
    d.setHours(23, 59, 59, 999);
    return d;
};

const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const RevenueDashboard: React.FC = () => {
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [displayPrescriptionRevenue, setDisplayPrescriptionRevenue] = useState(0);
    const [displayClinicalRevenue, setDisplayClinicalRevenue] = useState(0);
    const [chartPrescriptionRevenue, setChartPrescriptionRevenue] = useState(0);
    const [chartClinicalRevenue, setChartClinicalRevenue] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');
    const [filterMonth, setFilterMonth] = useState('');
    const [filterQuarter, setFilterQuarter] = useState('');
    // Khởi tạo mặc định là 2025
    const [filterYear, setFilterYear] = useState('2025');

    const barChartRef = useRef<HTMLCanvasElement>(null);
    const pieChartRef = useRef<HTMLCanvasElement>(null);
    const myBarChart = useRef<Chart | null>(null);
    const myPieChart = useRef<Chart | null>(null);

    // Hàm để chạy số từ từ
    const animateCounter = (
        start: number,
        end: number,
        duration: number,
        setDisplayValue: React.Dispatch<React.SetStateAction<number>>,
        setChartValue: React.Dispatch<React.SetStateAction<number>>
    ) => {
        let startTimestamp: number | null = null;
        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easedProgress = progress < 0.5
                ? 2 * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 2) / 2; // Ease in-out
            const current = Math.floor(start + (end - start) * easedProgress);
            setDisplayValue(current);
            if (progress === 1) {
                setChartValue(end); // Chỉ cập nhật giá trị biểu đồ khi animation hoàn tất
            }
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    };

    const populateYears = useCallback(() => {
        const years = Array.from(new Set(allTransactions.map(t => new Date(t.date).getFullYear())));
        return years.sort((a, b) => b - a);
    }, []);

    const applyFilters = useCallback(() => {
        if (filterStartDate && filterEndDate && new Date(filterEndDate) < new Date(filterStartDate)) {
            alert('Ngày kết thúc không thể trước ngày bắt đầu!');
            return;
        }

        let currentFiltered = allTransactions.filter(transaction => {
            const transactionDateObj = new Date(transaction.date);
            const transactionYear = transactionDateObj.getFullYear();
            const transactionMonth = transactionDateObj.getMonth() + 1;

            if (filterStartDate && filterEndDate) {
                const startDateObj = new Date(filterStartDate);
                const endDateObj = new Date(filterEndDate);
                endDateObj.setHours(23, 59, 59, 999);
                return transactionDateObj >= startDateObj && transactionDateObj <= endDateObj;
            }

            if (filterMonth) {
                const [filterYearNum, filterMonthNum] = filterMonth.split('-').map(Number);
                return transactionYear === filterYearNum && transactionMonth === filterMonthNum;
            }

            if (filterQuarter && filterYear) {
                const quarter = Math.ceil(transactionMonth / 3);
                return transactionYear === parseInt(filterYear) && quarter.toString() === filterQuarter;
            }

            if (filterQuarter && !filterYear) {
                const quarter = Math.ceil(transactionMonth / 3);
                return quarter.toString() === filterQuarter;
            }

            if (filterYear) {
                return transactionYear === parseInt(filterYear);
            }

            // If no specific filters are active, show all transactions (this means filterYear is empty string)
            return true;
        });

        // Sắp xếp từ ngày gần nhất đến xa nhất
        currentFiltered.sort((a, b) => {
            const dateA = new Date(a.date + ' ' + a.time);
            const dateB = new Date(b.date + ' ' + b.time);
            return dateB.getTime() - dateA.getTime();
        });

        setFilteredTransactions(currentFiltered);
        setCurrentPage(1);
    }, [filterStartDate, filterEndDate, filterMonth, filterQuarter, filterYear]);

    // Sử dụng useEffect để áp dụng bộ lọc lần đầu khi component mount
    // Điều này sẽ đảm bảo dữ liệu hiển thị theo filterYear mặc định '2025'
    useEffect(() => {
        applyFilters();
    }, []); // Dependency array rỗng, chỉ chạy một lần khi mount

    useEffect(() => {
        let prescriptionRev = 0;
        let clinicalRev = 0;
        filteredTransactions.forEach(transaction => {
            if (transaction.type === 'Đơn thuốc') {
                prescriptionRev += transaction.amount;
            } else if (transaction.type === 'Cận lâm sàng') {
                clinicalRev += transaction.amount;
            }
        });

        // Animate counters and update chart values after animation
        animateCounter(
            displayPrescriptionRevenue,
            prescriptionRev,
            300,
            setDisplayPrescriptionRevenue,
            setChartPrescriptionRevenue
        );
        animateCounter(
            displayClinicalRevenue,
            clinicalRev,
            300,
            setDisplayClinicalRevenue,
            setChartClinicalRevenue
        );
    }, [filteredTransactions]);

    useEffect(() => {
        if (myBarChart.current) {
            myBarChart.current.destroy();
        }
        if (myPieChart.current) {
            myPieChart.current.destroy();
        }

        const chartLabels = ['Đơn Thuốc', 'Cận Lâm Sàng'];
        const chartData = [chartPrescriptionRevenue, chartClinicalRevenue];

        if (barChartRef.current && (chartPrescriptionRevenue > 0 || chartClinicalRevenue > 0)) {
            const barCtx = barChartRef.current.getContext('2d');
            if (barCtx) {
                myBarChart.current = new Chart(barCtx, {
                    type: 'bar',
                    data: {
                        labels: chartLabels,
                        datasets: [{
                            label: 'Doanh thu (VND)',
                            data: chartData,
                            backgroundColor: ['rgba(59, 130, 246, 0.7)', 'rgba(22, 163, 74, 0.7)'],
                            borderColor: ['rgba(59, 130, 246, 1)', 'rgba(22, 163, 74, 1)'],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            title: { display: true, text: 'So sánh Doanh thu', font: { size: 18, weight: 'bold' } },
                            legend: { display: false }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: { display: true, text: 'Số tiền (VND)' },
                                ticks: { callback: (value: string | number) => formatCurrency(Number(value)) }
                            }
                        }
                    }
                });
            }
        }

        if (pieChartRef.current && (chartPrescriptionRevenue > 0 || chartClinicalRevenue > 0)) {
            const pieCtx = pieChartRef.current.getContext('2d');
            if (pieCtx) {
                myPieChart.current = new Chart(pieCtx, {
                    type: 'pie',
                    data: {
                        labels: chartLabels,
                        datasets: [{
                            label: 'Tỷ lệ Doanh thu',
                            data: chartData,
                            backgroundColor: ['rgba(59, 130, 246, 0.7)', 'rgba(22, 163, 74, 0.7)'],
                            borderColor: ['rgba(59, 130, 246, 1)', 'rgba(22, 163, 74, 1)'],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            title: { display: true, text: 'Tỷ lệ phân bổ Doanh thu', font: { size: 18, weight: 'bold' } },
                            tooltip: {
                                callbacks: {
                                    label: (context) => {
                                        const label = context.label || '';
                                        const value = context.parsed || 0;
                                        const total = context.dataset.data.reduce((sum, current) => Number(sum) + Number(current), 0);
                                        const percentage = total > 0 ? ((value / total) * 100).toFixed(2) + '%' : '0%';
                                        return `${label}: ${formatCurrency(Number(value))} (${percentage})`;
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }

        return () => {
            if (myBarChart.current) {
                myBarChart.current.destroy();
                myBarChart.current = null;
            }
            if (myPieChart.current) {
                myPieChart.current.destroy();
                myPieChart.current = null;
            }
        };
    }, [chartPrescriptionRevenue, chartClinicalRevenue]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
    const startIndex = (currentPage - 1) * transactionsPerPage;
    const endIndex = Math.min(startIndex + transactionsPerPage, filteredTransactions.length);
    const transactionsToShow = filteredTransactions.slice(startIndex, endIndex);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        switch (id) {
            case 'filterStartDate':
                setFilterStartDate(value);
                setFilterEndDate('');
                setFilterMonth('');
                setFilterQuarter('');
                setFilterYear('');
                break;
            case 'filterEndDate':
                setFilterEndDate(value);
                setFilterMonth('');
                setFilterQuarter('');
                setFilterYear('');
                break;
            case 'filterMonth':
                setFilterMonth(value);
                setFilterStartDate('');
                setFilterEndDate('');
                setFilterQuarter('');
                setFilterYear('');
                break;
            case 'filterQuarter':
                setFilterQuarter(value);
                setFilterStartDate('');
                setFilterEndDate('');
                setFilterMonth('');
                // Không xóa filterYear ở đây vì filter quý thường đi kèm với năm
                break;
            case 'filterYear':
                setFilterYear(value);
                setFilterStartDate('');
                setFilterEndDate('');
                setFilterMonth('');
                // Không xóa filterQuarter ở đây vì filter năm có thể kết hợp với quý
                break;
            default:
                break;
        }
        // applyFilters(); // Loại bỏ dòng này để không tự động lọc
    };

    const grandTotal = displayPrescriptionRevenue + displayClinicalRevenue;

    return (
        <>
            <Tabbar
                tabbarItems={{
                    tabbarItems: [
                        { text: 'Thống kê doanh thu', link: `/Doctor/Patient/ToExamine/684926749c351fd5325793a4/CreateResults/ComponentResults/ComponentPrintTicket` },
                    ],
                }}
            />

            <div className="revenue-dashboard-container">
                <div className="card mb-5">
                    <h4 className="text-2xl font-bold text-gray-700 mb-5 text-center">Thống Kê Doanh Thu</h4>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-end">
                        <div>
                            <label htmlFor="filterStartDate" className="block text-gray-600 text-sm font-medium mb-2">Ngày bắt đầu:</label>
                            <input
                                type="date"
                                id="filterStartDate"
                                className="input-select"
                                value={filterStartDate}
                                onChange={handleFilterChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="filterEndDate" className="block text-gray-600 text-sm font-medium mb-2">Ngày kết thúc:</label>
                            <input
                                type="date"
                                id="filterEndDate"
                                className="input-select"
                                value={filterEndDate}
                                onChange={handleFilterChange}
                                disabled={!filterStartDate}
                            />
                        </div>
                        <div>
                            <label htmlFor="filterMonth" className="block text-gray-600 text-sm font-medium mb-2">Theo tháng:</label>
                            <input
                                type="month"
                                id="filterMonth"
                                className="input-select"
                                value={filterMonth}
                                onChange={handleFilterChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="filterQuarter" className="block text-gray-600 text-sm font-medium mb-2">Theo quý:</label>
                            <select
                                id="filterQuarter"
                                className="input-select"
                                value={filterQuarter}
                                onChange={handleFilterChange}
                            >
                                <option value="">Tất cả quý</option>
                                <option value="1">Quý 1</option>
                                <option value="2">Quý 2</option>
                                <option value="3">Quý 3</option>
                                <option value="4">Quý 4</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="filterYear" className="block text-gray-600 text-sm font-medium mb-2">Theo năm:</label>
                            <select
                                id="filterYear"
                                className="input-select"
                                value={filterYear}
                                onChange={handleFilterChange}
                            >
                                <option value="">Tất cả năm</option>
                                {populateYears().map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-center">
                            {/* Gọi applyFilters khi nút được nhấn */}
                            <button id="applyFilterBtn" className="btn-filter w-1/2 md:w-auto" onClick={applyFilters}>
                                Áp dụng bộ lọc
                            </button>
                        </div>
                    </div>
                </div>

                <div className="w-full flex justify-between">
                    <div className="flex flex-col md:flex-row justify-between gap-6 mb-5 flex-1">
                        <div className="card text-center flex-1">
                            <h2 className="text-2xl font-bold text-gray-700 mb-5">Tổng Doanh Thu</h2>
                            <p id="totalRevenueDisplay" className="text-2xl font-extrabold text-red-500">{formatCurrency(grandTotal)}</p>
                        </div>
                        <div className="card text-center flex-1">
                            <h2 className="text-2xl font-bold text-gray-700 mb-5">Doanh Thu Đơn Thuốc</h2>
                            <p id="prescriptionRevenueDisplay" className="text-2xl font-extrabold text-blue-500">{formatCurrency(displayPrescriptionRevenue)}</p>
                        </div>
                        <div className="card text-center flex-1">
                            <h2 className="text-2xl font-bold text-gray-700 mb-5">Doanh Thu Cận Lâm Sàng</h2>
                            <p id="clinicalRevenueDisplay" className="text-2xl font-extrabold text-green-500">{formatCurrency(displayClinicalRevenue)}</p>
                        </div>
                    </div>
                </div>

                <div className="charts-section">
                    <div className="card chart-card">
                        <h3 className="chart-title">So Sánh Doanh Thu Theo Loại</h3>
                        <div className="chart-container">
                            <canvas ref={barChartRef}></canvas>
                        </div>
                    </div>
                    <div className="card chart-card">
                        <h3 className="chart-title">Tỷ Lệ Phân Bổ Doanh Thu</h3>
                        <div className="chart-container">
                            <canvas ref={pieChartRef}></canvas>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h2 className="text-2xl font-bold text-gray-700 mb-5 text-center">Bảng Thống Kê Chi Tiết Giao Dịch</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg overflow-hidden border border-gray-200">
                            <thead>
                                <tr className="bg-blue-100 text-gray-700 uppercase text-sm leading-normal">
                                    <th className="py-3 px-6 text-left">Ngày</th>
                                    <th className="py-3 px-6 text-left">Thời gian</th>
                                    <th className="py-3 px-6 text-left">Loại giao dịch</th>
                                    <th className="py-3 px-6 text-left">Mô tả</th>
                                    <th className="py-3 px-6 text-right">Số tiền</th>
                                </tr>
                            </thead>
                            <tbody id="transactionsTableBody" className="text-gray-600 text-sm font-light">
                                {transactionsToShow.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-4 px-6 text-center text-gray-500">Không có dữ liệu để hiển thị.</td>
                                    </tr>
                                ) : (
                                    transactionsToShow.map((transaction, index) => (
                                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                                            <td className="py-3 px-6 text-left whitespace-nowrap">{new Date(transaction.date).toLocaleDateString('vi-VN')}</td>
                                            <td className="py-3 px-6 text-left whitespace-nowrap">{transaction.time}</td>
                                            <td className="py-3 px-6 text-left">{transaction.type}</td>
                                            <td className="py-3 px-6 text-left">{transaction.description}</td>
                                            <td className="py-3 px-6 text-right">{formatCurrency(transaction.amount)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                            <tfoot>
                                <tr className="bg-gray-50 border-t border-gray-200 font-semibold">
                                    <td colSpan={4} className="py-3 px-6 text-right text-base text-gray-800">Tổng cộng:</td>
                                    <td id="tableGrandTotal" className="py-3 px-6 text-right text-lg text-red-600">{formatCurrency(grandTotal)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </>
    );
};

export default RevenueDashboard;