'use client';
import React, { useEffect, useState } from 'react';
import '../PrescriptionDetails.css';
import Tabbar from '@/app/components/shared/Tabbar/Tabbar';
import { useRouter, useParams } from 'next/navigation';
import { prescriptionType } from '@/app/types/patientTypes/patient';
import { getDetailPatientInformation, getDetailPrescription, confirmPrescriptionPayment } from '@/app/services/Cashier';
import { formatCurrencyVND, formatTime } from '@/app/lib/Format';
import { showToast, ToastType } from '@/app/lib/Toast';
import { PrescriptionDetail } from '@/app/Doctor/Patient/ToExamine/[id]/CreateResults/CreateResultsComponent/Prescription';
import ConfirmationNotice from '../../ComponentCashier/ConfirmationNotice';
import MedicineFees from '../../ComponentCashier/MedicineFees';

export default function PrescriptionDetails() {
    const params = useParams();
    const { id } = params;
    const router = useRouter();

    const [data, setData] = useState<prescriptionType>();
    const [detailedPrescription, setDetailedPrescription] = useState<PrescriptionDetail[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [dataPendingPayment, setDataPendingPayment] = useState<{ HoVaTen?: string, TongTien?: number }>({});
    const [isMedicineFeesOpen, setIsMedicineFeesOpen] = useState(false);

    const loadAPI = async () => {
        try {
            const [patientData, prescriptionData] = await Promise.all([
                getDetailPatientInformation(String(id)),
                getDetailPrescription(String(id))
            ]);
            
            if (prescriptionData) {
                setDetailedPrescription(prescriptionData);
                console.log(prescriptionData);
            }
            
            if (patientData) {
                setData(patientData);
            }
        } catch (error) {
            console.error('Error loading API data:', error);
            showToast('Không thể tải dữ liệu', ToastType.error);
        }
    };

    useEffect(() => {
        console.log('id:', id);
        loadAPI();
    }, []);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const handlePaymenConfirmation = (HoVaTen: string, TongTien: number) => {
        setDataPendingPayment({ HoVaTen, TongTien });
        setShowModal(true);
    };

    const paymentConfirmation = async () => {
        try {
            const result = await confirmPrescriptionPayment(String(id));
            if (result) {
                showToast('Xác nhận thanh toán thành công', ToastType.success);
                setShowModal(false);
                await loadAPI();
            } else {
                showToast('Xác nhận thanh toán thất bại', ToastType.error);
            }
        } catch (error) {
            showToast('Đã có lỗi xảy ra khi xác nhận thanh toán', ToastType.error);
        }
    };

    const handlePrint = () => {
        setIsMedicineFeesOpen(true);
    };

    return (
        <>
            <Tabbar
                tabbarItems={{
                    tabbarItems: [
                        { text: 'Chi tiết đơn thuốc', link: `/Cashier/PaymentWaitingList/${id}` },
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

            <MedicineFees
                isOpen={isMedicineFeesOpen}
                onClose={() => setIsMedicineFeesOpen(false)}
            />

            <div className="print-container">
                <div className="PrescriptionDetails-container">
                    {/* Thông tin bệnh nhân */}
                    <div className="PrescriptionDetails-container__Box1" style={{ height: '450px' }}>
                        <h3>Thông tin bệnh nhân</h3>
                        <div className="patient-info" style={{ color: 'black' }}>
                            <p><strong>Tên đơn thuốc: </strong>{data?.TenDonThuoc}</p>
                            <p><strong>Bệnh nhân:</strong> {data?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.HoVaTen}</p>
                            <p><strong>Số điện thoại:</strong> {data?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.SoDienThoai}</p>
                            <p><strong>Bác sĩ:</strong> {data?.Id_PhieuKhamBenh?.Id_Bacsi?.TenBacSi}</p>
                            <p><strong>Thời gian:</strong> {formatTime(data?.Gio as string)}</p>
                            <p><strong>Ngày:</strong> {data?.Id_PhieuKhamBenh?.Ngay}</p>
                            <p><strong style={{ fontSize: '18px' }}>Tổng tiền :</strong> 
                                <span style={{ color: 'red', fontSize: '16px', fontWeight: 600 }}>
                                    {formatCurrencyVND(data?.TongTien || 0)}
                                </span>
                            </p>
                        </div>

                        <div className="PrescriptionDetails-container__Box1__boxPage">
                            {data?.TrangThaiThanhToan === true ? (
                                <>
                                    <button
                                        className="bigButton--gray PrescriptionDetails-container__Box1__boxPage__back"
                                        onClick={() => router.push('/Cashier/PaymentWaitingList')}
                                    >
                                        <i className="bi bi-arrow-left-circle-fill"></i>
                                        Quay lại
                                    </button>
                                    <button
                                        className="bigButton--blue PrescriptionDetails-container__Box1__boxPage__print"
                                        onClick={handlePrint}
                                    >
                                        <i className="bi bi-printer-fill"></i>
                                        In đơn thuốc
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        className="confirm-button PrescriptionDetails-container__Box1__boxPage__cancer"
                                        onClick={() => router.push('/Cashier/PaymentWaitingList')}
                                    >
                                        <i className="bi bi-x-circle-fill"></i>
                                        Hủy
                                    </button>
                                    <button
                                        className="confirm-button PrescriptionDetails-container__Box1__boxPage__check"
                                        onClick={() => handlePaymenConfirmation(
                                            data?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.HoVaTen as string,
                                            data?.TongTien || 0
                                        )}
                                    >
                                        <i className="bi bi-check-circle-fill"></i>
                                        Xác nhận thanh toán
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Bảng chi tiết đơn thuốc */}
                    <div className="PrescriptionDetails-container__Box2">
                        <div className='PrescriptionDetails-container__Box2__title'>Đơn thuốc chi tiết</div>

                        <table className="Prescription-container_table">
                            <thead style={{ backgroundColor: '#f7fafc', fontWeight: 600 }}>
                                <tr>
                                    <th>Tên thuốc</th>
                                    <th>Đơn vị</th>
                                    <th>Số lượng</th>
                                    <th>Giá mỗi đơn vị</th>
                                </tr>
                            </thead>

                            <tbody>
                                {detailedPrescription.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.Id_Thuoc.TenThuoc}</td>
                                        <td>{item.Id_Thuoc.DonVi}</td>
                                        <td>{item.SoLuong}</td>
                                        <td style={{ color: 'red' }}>{formatCurrencyVND(item.Id_Thuoc.Gia || 0)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}