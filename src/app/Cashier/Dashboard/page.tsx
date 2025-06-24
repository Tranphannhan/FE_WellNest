'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Chart from 'chart.js/auto';
import './RevenueDashboard.css';
import Tabbar from '@/app/components/shared/Tabbar/Tabbar';
import Pagination from '@/app/components/ui/Pagination/Pagination';
import { PrescriptionStatsType, TestRequestType, MedicalRecordType } from '@/app/types/hospitalTypes/hospitalType';
import { fetchPrescriptionsByDateRange, fetchTestRequestsByDateRange, fetchMedicalRecordsByDateRange } from '@/app/services/FileTam';
import { FaFilterCircleDollar } from 'react-icons/fa6';

interface Transaction {
    date: string;
    time: string;
    type: 'Đơn thuốc' | 'Cận lâm sàng' | 'Khám';
    description: string;
    amount: number;
}

const transactionsPerPage = 7; // Giới hạn 7 bản ghi mỗi trang

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const RevenueDashboard: React.FC = () => {
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [displayPrescriptionRevenue, setDisplayPrescriptionRevenue] = useState(0);
    const [displayClinicalRevenue, setDisplayClinicalRevenue] = useState(0);
    const [displayExaminationRevenue, setDisplayExaminationRevenue] = useState(0);
    const [chartPrescriptionRevenue, setChartPrescriptionRevenue] = useState(0);
    const [chartClinicalRevenue, setChartClinicalRevenue] = useState(0);
    const [chartExaminationRevenue, setChartExaminationRevenue] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');
    const [filterMonth, setFilterMonth] = useState('');
    const [filterQuarter, setFilterQuarter] = useState('');
    const [filterYear, setFilterYear] = useState('2025');

    const barChartRef = useRef<HTMLCanvasElement>(null);
    const pieChartRef = useRef<HTMLCanvasElement>(null);
    const myBarChart = useRef<Chart | null>(null);
    const myPieChart = useRef<Chart | null>(null);

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
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            const current = Math.floor(start + (end - start) * easedProgress);
            setDisplayValue(current);
            if (progress === 1) {
                setChartValue(end);
            }
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    };

    const populateYears = useCallback(() => {
        return [2025, 2024, 2023];
    }, []);

const fetchTransactions = useCallback(async () => {
    try {
        let prescriptions: PrescriptionStatsType[] = [];
        let testRequests: TestRequestType[] = [];
        let medicalRecords: MedicalRecordType[] = [];

        // Xây dựng tham số lọc
        let fromDate: string | undefined = undefined;
        let toDate: string | undefined = undefined;
        let year: number | undefined = undefined;

        if (filterStartDate && filterEndDate) {
            // Lọc theo khoảng ngày
            fromDate = filterStartDate;
            toDate = filterEndDate;
        } else if (filterMonth) {
            // Lọc theo tháng
            const [yearStr, month] = filterMonth.split('-').map(Number);
            fromDate = `${yearStr}-${month.toString().padStart(2, '0')}-01`;
            toDate = new Date(yearStr, month, 0).toISOString().split('T')[0];
        } else if (filterQuarter && filterYear) {
            // Lọc theo quý
            const quarterStartMonth = (Number(filterQuarter) - 1) * 3 + 1;
            fromDate = `${filterYear}-${quarterStartMonth.toString().padStart(2, '0')}-01`;
            toDate = `${filterYear}-${(quarterStartMonth + 2).toString().padStart(2, '0')}-${new Date(
                Number(filterYear),
                quarterStartMonth + 2,
                0
            ).getDate()}`;
        } else if (filterYear) {
            // Lọc theo năm
            year = Number(filterYear);
        } else {
            // Mặc định lấy dữ liệu cho năm 2025
            year = 2025;
        }

        // Gọi các service với tham số phù hợp
        const [prescriptionResponse, testRequestResponse, medicalResponse] = await Promise.all([
            fetchPrescriptionsByDateRange(fromDate, toDate, year).catch(() => ({ data: [] })),
            fetchTestRequestsByDateRange(fromDate, toDate, year).catch(() => ({ data: [] })),
            fetchMedicalRecordsByDateRange(fromDate, toDate, year).catch(() => ({ data: [] })),
        ]);

        // Lấy dữ liệu từ response, đảm bảo mảng rỗng nếu không có dữ liệu
        prescriptions = prescriptionResponse.data || [];
        testRequests = testRequestResponse.data || [];
        medicalRecords = medicalResponse.data || [];

        console.log('Fetched prescriptions:', prescriptions);
        console.log('Fetched test requests:', testRequests);
        console.log('Fetched medical records:', medicalRecords);

        // Ánh xạ dữ liệu thành Transaction
        const prescriptionTransactions: Transaction[] = prescriptions
            .filter((p) => p.TrangThaiThanhToan)
            .map((p) => ({
                date: p.Ngay || new Date(p.createdAt || Date.now()).toISOString().split('T')[0],
                time: p.Gio || new Date(p.createdAt || Date.now()).toLocaleTimeString('vi-VN', { hour12: false }),
                type: 'Đơn thuốc' as const,
                description: p.TenDonThuoc || 'Đơn thuốc không tên',
                amount: p.TongTien || 0,
            }));

        const testRequestTransactions: Transaction[] = testRequests
            .filter((t) => t.TrangThaiThanhToan && t.Id_LoaiXetNghiem?.Id_GiaDichVu?.Giadichvu)
            .map((t) => ({
                date: t.Ngay || new Date(t.createdAt || Date.now()).toISOString().split('T')[0],
                time: t.Gio || new Date(t.createdAt || Date.now()).toLocaleTimeString('vi-VN', { hour12: false }),
                type: 'Cận lâm sàng' as const,
                description: t.Id_LoaiXetNghiem?.TenXetNghiem || 'Xét nghiệm không tên',
                amount: t.Id_LoaiXetNghiem?.Id_GiaDichVu?.Giadichvu || 0,
            }));

        const medicalTransactions: Transaction[] = medicalRecords
            .filter((m) => m.TrangThaiThanhToan && m.Id_GiaDichVu?.Giadichvu)
            .map((m) => ({
                date: m.Ngay || new Date(m.createdAt || Date.now()).toISOString().split('T')[0],
                time: m.Gio || new Date(m.createdAt || Date.now()).toLocaleTimeString('vi-VN', { hour12: false }),
                type: 'Khám' as const,
                description: m.Id_GiaDichVu?.Tendichvu || 'Phiếu khám không tên',
                amount: m.Id_GiaDichVu?.Giadichvu || 0,
            }));

        // Gộp và sắp xếp transactions
        const allTransactions = [...prescriptionTransactions, ...testRequestTransactions, ...medicalTransactions].sort(
            (a, b) => {
                const dateA = new Date(`${a.date} ${a.time}`);
                const dateB = new Date(`${b.date} ${b.time}`);
                return dateB.getTime() - dateA.getTime();
            }
        );

        console.log('All transactions:', allTransactions);
        setFilteredTransactions(allTransactions);
        setCurrentPage(1);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        setFilteredTransactions([]);
    }
}, [filterStartDate, filterEndDate, filterMonth, filterQuarter, filterYear]);

    useEffect(() => {
        fetchTransactions();
    }, []);

    useEffect(() => {
        let prescriptionRev = 0;
        let clinicalRev = 0;
        let examinationRev = 0;
        filteredTransactions.forEach(transaction => {
            if (transaction.type === 'Đơn thuốc') {
                prescriptionRev += transaction.amount;
            } else if (transaction.type === 'Cận lâm sàng') {
                clinicalRev += transaction.amount;
            } else if (transaction.type === 'Khám') {
                examinationRev += transaction.amount; // Sử dụng dữ liệu Khám cho tiền khám
            }
        });

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
        animateCounter(
            displayExaminationRevenue,
            examinationRev,
            300,
            setDisplayExaminationRevenue,
            setChartExaminationRevenue
        );
    }, [filteredTransactions]);

    useEffect(() => {
        if (myBarChart.current) {
            myBarChart.current.destroy();
        }
        if (myPieChart.current) {
            myPieChart.current.destroy();
        }

        const chartLabels = ['Đơn Thuốc', 'Cận Lâm Sàng', 'Tiền Khám'];
        const chartData = [chartPrescriptionRevenue, chartClinicalRevenue, chartExaminationRevenue];

        if (barChartRef.current && (chartPrescriptionRevenue > 0 || chartClinicalRevenue > 0 || chartExaminationRevenue > 0)) {
            const barCtx = barChartRef.current.getContext('2d');
            if (barCtx) {
                myBarChart.current = new Chart(barCtx, {
                    type: 'bar',
                    data: {
                        labels: chartLabels,
                        datasets: [{
                            label: 'Doanh thu (VND)',
                            data: chartData,
                            backgroundColor: [
                                'rgba(59, 130, 246, 0.7)', // Đơn thuốc: Xanh dương
                                'rgba(22, 163, 74, 0.7)', // Cận lâm sàng: Xanh lá
                                'rgba(147, 51, 234, 0.7)' // Tiền khám: Tím
                            ],
                            borderColor: [
                                'rgba(59, 130, 246, 1)',
                                'rgba(22, 163, 74, 1)',
                                'rgba(147, 51, 234, 1)'
                            ],
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

        if (pieChartRef.current && (chartPrescriptionRevenue > 0 || chartClinicalRevenue > 0 || chartExaminationRevenue > 0)) {
            const pieCtx = pieChartRef.current.getContext('2d');
            if (pieCtx) {
                myPieChart.current = new Chart(pieCtx, {
                    type: 'pie',
                    data: {
                        labels: chartLabels,
                        datasets: [{
                            label: 'Tỷ lệ Doanh thu',
                            data: chartData,
                            backgroundColor: [
                                'rgba(59, 130, 246, 0.7)', // Đơn thuốc: Xanh dương
                                'rgba(22, 163, 74, 0.7)', // Cận lâm sàng: Xanh lá
                                'rgba(147, 51, 234, 0.7)' // Tiền khám: Tím
                            ],
                            borderColor: [
                                'rgba(59, 130, 246, 1)',
                                'rgba(22, 163, 74, 1)',
                                'rgba(147, 51, 234, 1)'
                            ],
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
    }, [chartPrescriptionRevenue, chartClinicalRevenue, chartExaminationRevenue]);

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
            setFilterYear(value ? filterYear || '2025' : '');
            break;
        case 'filterYear':
            setFilterYear(value);
            setFilterStartDate('');
            setFilterEndDate('');
            setFilterMonth('');
            setFilterQuarter('');
            break;
        default:
            break;
    }
};

    const grandTotal = displayPrescriptionRevenue + displayClinicalRevenue + displayExaminationRevenue;

    return (
        <>
            <Tabbar
                tabbarItems={{
                    tabbarItems: [
                        { text: 'Thống kê doanh thu', link: `/Cashier/Dashboard` },
                    ],
                }}
            />

            <div className="revenue-dashboard-container">
                <div className="card_Container mb-5">
                    <h4 className="text-3xl font-bold text-gray-700 mb-5 text-center">Thống Kê Doanh Thu</h4>
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

                            <button id="applFyilterBtn" className='bigButton--blue' onClick={fetchTransactions}>
                                <FaFilterCircleDollar/>Áp dụng lọc
                            </button>

                    </div>
                </div>

                <div className="w-full flex justify-between">
                    <div className="flex flex-col md:flex-row justify-between gap-6 mb-5 flex-1">
                        <div className="card_Container text-center flex-1">
                            <h2 className="text-2xl font-bold text-gray-700 mb-5">Tổng Doanh Thu</h2>
                            <p id="totalRevenueDisplay" className="text-2xl font-extrabold text-red-500">{formatCurrency(grandTotal)}</p>
                        </div>
                        <div className="card_Container text-center flex-1">
                            <h2 className="text-2xl font-bold text-gray-700 mb-5">Doanh Thu Đơn Thuốc</h2>
                            <p id="prescriptionRevenueDisplay" className="text-2xl font-extrabold text-blue-500">{formatCurrency(displayPrescriptionRevenue)}</p>
                        </div>
                        <div className="card_Container text-center flex-1">
                            <h2 className="text-2xl font-bold text-gray-700 mb-5">Doanh Thu Cận Lâm Sàng</h2>
                            <p id="clinicalRevenueDisplay" className="text-2xl font-extrabold text-green-500">{formatCurrency(displayClinicalRevenue)}</p>
                        </div>
                        <div className="card_Container text-center flex-1">
                            <h2 className="text-2xl font-bold text-gray-700 mb-5">Doanh Thu Tiền Khám</h2>
                            <p id="examinationRevenueDisplay" className="text-2xl font-extrabold text-purple-500">{formatCurrency(displayExaminationRevenue)}</p>
                        </div>
                    </div>
                </div>

                <div className="charts-section">
                    <div className="card_Container chart-card_Container">
                        <h3 className="chart-title">So Sánh Doanh Thu Theo Loại</h3>
                        <div className="chart-container">
                            <canvas ref={barChartRef}></canvas>
                        </div>
                    </div>
                    <div className="card_Container chart-card_Container">
                        <h3 className="chart-title">Tỷ Lệ Phân Bổ Doanh Thu</h3>
                        <div className="chart-container">
                            <canvas ref={pieChartRef}></canvas>
                        </div>
                    </div>
                </div>

                <div className="card_Container">
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