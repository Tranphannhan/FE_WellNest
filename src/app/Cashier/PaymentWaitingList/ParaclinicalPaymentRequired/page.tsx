'use client';
import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import '../Prescription.css';
import { useParams, useRouter } from 'next/navigation';
import ConfirmationNotice from '../../ComponentCashier/ConfirmationNotice';
import React, { useEffect, useState } from 'react';
import { formatCurrencyVND } from "@/app/lib/Format";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { paraclinicalType } from "@/app/types/patientTypes/patient";
import { getParaclinicalAwaitingPayment, confirmTestRequestPayment } from "@/app/services/Cashier";
import { showToast, ToastType } from '@/app/lib/Toast';
import payment from "@/app/services/Pay";

export default function ParaclinicalPaymentRequired() {
    const router = useRouter();
    const [dataPrescription, setDataPrescription] = useState<paraclinicalType[]>([]);
    const [idPhieuKhamBenh, setIdPhieuKhamBenh] = useState<string>('');
    const { id } = useParams(); // lấy id từ URL
    const [showModal, setShowModal] = useState(false);
    const [dataPendingPayment, setDataPendingPayment] = useState<{ HoVaTen?: string, TongTien?: number }>({});

    const loadApi = async () => {
        const getData: paraclinicalType | [] | null = await getParaclinicalAwaitingPayment();
        if (!getData) return;
        if (Array.isArray(getData)) {
            setDataPrescription(getData);
        } else {
            setDataPrescription([getData]);
        }
    };

    const PayMoMo = async () => {
        await payment(100000,'Đơn thuốc','http://localhost:3000/Cashier/PaymentWaitingList/685e2266f80a121de596ce55',id as string)
    };

    useEffect(() => {
        loadApi();
    }, []);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const handlePaymenConfirmation = (HoVaTen: string, TongTien: number, idPhieuKhamBenh: string) => {
        setDataPendingPayment({ HoVaTen, TongTien });
        setIdPhieuKhamBenh(idPhieuKhamBenh);
        setShowModal(true);
    };

    const paymentConfirmation = async () => {
        try {
            const result = await confirmTestRequestPayment(idPhieuKhamBenh);
            if (result) {
                showToast('Xác nhận thanh toán thành công', ToastType.success);
                setShowModal(false);
                await loadApi(); // Refresh the paraclinical list
            } else {
                showToast('Xác nhận thanh toán thất bại', ToastType.error);
            }
        } catch {
            showToast('Đã có lỗi xảy ra khi xác nhận thanh toán', ToastType.error);
        }
    };

    return (
        <>
            <Tabbar
                tabbarItems={{
                    tabbarItems: [
                        { text: 'Đơn thuốc chờ thanh toán', link: '/Cashier/PaymentWaitingList' },
                        { text: 'Cận lâm sàng chờ thanh toán', link: '/Cashier/PaymentWaitingList/ParaclinicalPaymentRequired' }
                    ],
                }}
            />

            <ConfirmationNotice 
                Data_information={{
                    name: dataPendingPayment.HoVaTen || '', 
                    totalPrice: dataPendingPayment.TongTien !== undefined ? `${dataPendingPayment.TongTien}` : '',
                    paymentMethod: '',
                    handleClose: handleClose,
                    handleShow: handleShow,
                    show: showModal,
                    callBack: paymentConfirmation,
                    paymentConfirmation: PayMoMo
                }}
            />

            <div className="Prescription-container">
                <div className="Prescription-searchReceptionContainer">
                    <div className="Prescription_searchBoxWrapper">
                        <div className="Prescription_searchBox">
                            <input
                                type="text"
                                placeholder="Hãy nhập số điện thoại"
                                className="search-input"
                            />
                            <button className="search-btn">
                                <i className="bi bi-search"></i>
                            </button>
                        </div>
                        
                        <div className="Prescription_searchBox">
                            <input
                                type="text"
                                placeholder="Hãy nhập tên"
                                className="search-input"
                            />
                            <button className="search-btn">
                                <i className="bi bi-search"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <table className="Prescription-container_table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Họ và tên</th>
                            <th>Giới tính</th>
                            <th>Ngày sinh</th>
                            <th>Số điện thoại</th>
                            <th>Ngày</th>
                            <th>Tổng tiền</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {dataPrescription.map((record, index) => (
                            <tr key={record._id}>
                                <td>{1 + index}</td>
                                <td style={{ whiteSpace: 'nowrap' }}>{record?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.HoVaTen || ''}</td>
                                <td>{record?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.GioiTinh || ''}</td>
                                <td>{record?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.NgaySinh}</td>
                                <td>{record?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.SoDienThoai}</td>
                                <td style={{ whiteSpace: 'nowrap' }}>{record?.Id_PhieuKhamBenh?.Ngay}</td>
                                <td style={{ color: 'red', fontWeight: '600', whiteSpace: 'nowrap' }}>
                                    {formatCurrencyVND(record?.TongTien || 0)}
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <button
                                            className="button--green"
                                            style={{ marginRight: '10px' }}
                                            onClick={() => router.push(`/Cashier/PaymentWaitingList/ParaclinicalPaymentRequired/${record.Id_PhieuKhamBenh?._id}`)}
                                        >
                                            <i className="bi bi-eye-fill"></i>
                                            Xem chi tiết
                                        </button>
                                        <button
                                            className="button--red"
                                            onClick={() => handlePaymenConfirmation(
                                                record.Id_PhieuKhamBenh?.Id_TheKhamBenh?.HoVaTen as string,
                                                record.TongTien || 0,
                                                record.Id_PhieuKhamBenh?._id as string
                                            )}
                                        >
                                            <FaMoneyCheckDollar />
                                            Thu tiền
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}