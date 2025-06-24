'use client';
import '../../PrescriptionDetails.css';
import Tabbar from '@/app/components/shared/Tabbar/Tabbar';
import { formatCurrencyVND, formatTime } from '@/app/lib/Format';
import { getDetailParaclinicalAwaitingPayment, confirmTestRequestPayment } from '@/app/services/Cashier';
import { paraclinicalType } from '@/app/types/patientTypes/patient';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { showToast, ToastType } from '@/app/lib/Toast';
import ConfirmationNotice from '@/app/Cashier/ComponentCashier/ConfirmationNotice';

export default function ParaclinicalDetails() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    const [dataDetail, setDataDetail] = useState<paraclinicalType[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [showModal, setShowModal] = useState(false);
    const [dataPendingPayment, setDataPendingPayment] = useState<{ HoVaTen?: string, TongTien?: number }>({});
    const [idPhieuKhamBenh, setIdPhieuKhamBenh] = useState<string>('');
    const [isPaid, setIsPaid] = useState<boolean>(false); // Track payment status

    const loaddingApi = async () => {
        const response: { totalItems: number, currentPage: number, totalPages: number, TongTien: number, data: paraclinicalType[] } | null = await getDetailParaclinicalAwaitingPayment(String(id));

        if (!response) return;
        setTotalPrice(response.TongTien);

        if (!Array.isArray(response.data)) return;
        setDataDetail(response.data as paraclinicalType[]);

        // Check TrangThaiThanhToan and TrangThai
        const isPaymentCompleted = response.data.some(item => item.TrangThaiThanhToan === true && item.TrangThai === false);
        setIsPaid(isPaymentCompleted);
    };

    useEffect(() => {
        console.log('id : ' + id);
        loaddingApi();
    }, [id]);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const handlePaymenConfirmation = (HoVaTen: string, TongTien: number, idPhieuKhamBenh: string) => {
        setDataPendingPayment({ HoVaTen, TongTien });
        setIdPhieuKhamBenh(idPhieuKhamBenh);
        handleShow();
    };

    const paymentConfirmation = async () => {
        try {
            const result = await confirmTestRequestPayment(idPhieuKhamBenh);
            const message = result?.message || "Xác nhận không rõ";

            if (message.includes("đã được thanh toán trước đó")) {
                showToast(message, ToastType.info);
                handleClose();
                setIsPaid(true); // Update payment status
                return;
            }

            if (message.includes("thành công")) {
                showToast(message, ToastType.success);
                handleClose();
                setIsPaid(true); // Update payment status
                return;
            }

            showToast("Không rõ trạng thái thanh toán", ToastType.error);
            handleClose();
        } catch (error) {
            showToast("Đã có lỗi xảy ra khi xác nhận thanh toán", ToastType.error);
            handleClose();
        }
    };

    const handlePrintInvoice = () => {
        // Implement print invoice logic here
        window.print(); // Basic print functionality; replace with actual invoice printing logic if needed
    };

    return (
        <>
            <Tabbar
                tabbarItems={{
                    tabbarItems: [
                        { text: 'Chi tiết cận lâm sàng', link: `/Cashier/PaymentWaitingList/ParaclinicalPaymentRequired/${id}` },
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
                    paymentConfirmation: paymentConfirmation
                }}
            />

            <div className="PrescriptionDetails-container">
                {/* Thông tin bệnh nhân */}
                <div className="PrescriptionDetails-container__Box1">
                    <h3>Thông tin bệnh nhân</h3>
                    <div className="PrescriptionDetails-container__Box1__patient-info" style={{ color: 'black' }}>
                        <p><strong>Bệnh nhân: </strong>{dataDetail[0]?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.HoVaTen}</p>
                        <p><strong>Ngày sinh: </strong>{dataDetail[0]?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.NgaySinh}</p>
                        <p><strong>Giới tính: </strong>{dataDetail[0]?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.GioiTinh}</p>
                        <p><strong>Ngày: </strong>{dataDetail[0]?.Id_PhieuKhamBenh?.Ngay}</p>
                        <p><strong>Số điện thoại: </strong>{dataDetail[0]?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.SoDienThoai}</p>
                        <p><strong style={{ fontSize: '18px' }}>Tổng tiền : </strong>
                            <span style={{ color: 'red', fontSize: '16px', fontWeight: 600 }}>
                                {formatCurrencyVND(totalPrice)}
                            </span>
                        </p>
                    </div>

                    <div className="PrescriptionDetails-container__Box1__boxPage">
                        {isPaid ? (
                            <>
                                
                                <button 
                                    className="bigButton--gray PrescriptionDetails-container__Box1__boxPage__back"
                                    onClick={() => router.push('/Cashier/PaymentWaitingList/ParaclinicalPaymentRequired')}
                                >
                                    <i className="bi bi-arrow-left-circle-fill"></i>
                                    Quay lại
                                </button>
                                <button 
                                    className="bigButton--blue PrescriptionDetails-container__Box1__boxPage__print"
                                    onClick={handlePrintInvoice}
                                >
                                    <i className="bi bi-printer-fill"></i>
                                    In Hóa Đơn
                                </button>
                            </>
                        ) : (
                            <>
                                <button 
                                    className="confirm-button PrescriptionDetails-container__Box1__boxPage__cancer"
                                    onClick={() => router.push('/Cashier/PaymentWaitingList/ParaclinicalPaymentRequired')}
                                >
                                    <i className="bi bi-x-circle-fill"></i>
                                    Hủy
                                </button>
                                <button 
                                    className="confirm-button PrescriptionDetails-container__Box1__boxPage__check"
                                    onClick={() => handlePaymenConfirmation(
                                        dataDetail[0]?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.HoVaTen as string,
                                        totalPrice,
                                        String(id)
                                    )}
                                >
                                    <i className="bi bi-check-circle-fill"></i>
                                    Xác nhận thanh toán
                                </button>
                            </>
                        )}
                    </div>
                </div>  

                <div className="PrescriptionDetails-container__Box2">
                    <div className='PrescriptionDetails-container__Box2__title'>Chi tiết cận lâm sàng</div>

                    <table className="Prescription-container_table">
                        <thead style={{ backgroundColor: '#f7fafc', fontWeight: 600 }}>
                            <tr>
                                <th>Tên phòng thiết bị</th>
                                <th>Tên xét nghiệm</th>
                                <th>Thời gian</th>
                                <th>Bác sĩ</th>
                                <th>Giá</th>
                            </tr>
                        </thead>

                        <tbody>
                            {dataDetail.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.Id_LoaiXetNghiem.Id_PhongThietBi.TenPhongThietBi}</td>
                                    <td>{item?.Id_LoaiXetNghiem.TenXetNghiem}</td>
                                    <td>{formatTime(item.Gio)}</td>
                                    <td>{item.Id_PhieuKhamBenh.Id_Bacsi?.TenBacSi}</td>
                                    <td style={{ color: 'red' }}>
                                        {formatCurrencyVND(item?.Id_LoaiXetNghiem?.Id_GiaDichVu?.Giadichvu || 0)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}