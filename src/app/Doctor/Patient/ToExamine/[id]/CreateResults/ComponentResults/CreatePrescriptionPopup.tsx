'use client';
import { useState, useEffect, useCallback } from 'react';
import { Modal, Button, Input, Select, Pagination, Spin, Alert } from 'antd';
import './CreatePrescriptionPopup.css';
import fetchMedicines, { fetchMedicineGroupsPaginated, fetchMedicinesByGroupId, searchMedicinesByName } from '@/app/services/FileTam';
import { medicineType, medicineGroupType, prescriptionType } from '@/app/types/hospitalTypes/hospitalType';
import { createPrescription, createPrescriptionDetail } from '@/app/services/DoctorSevices';
import { calculateAge } from '@/app/lib/Format';
import { MedicalExaminationCard } from '@/app/types/patientTypes/patient';

interface inputPrescriptionDetail{
    Quantity?: number;
    Remind?: string;
    Id_Thuoc?: string;
    Id_DonThuoc?:string;
}


const { Option } = Select;

const PrescriptionPopup = ({ PrescriptionInfo,showPrescriptionPopup, handleClosePrescriptionPopup }: { PrescriptionInfo:{ Id_PhieuKhamBenh?:string;} ,showPrescriptionPopup: boolean, handleClosePrescriptionPopup: () => void }) => {
    const [step, setStep] = useState(1);
    const [isSelectingMedicine, setIsSelectingMedicine] = useState(false);
    const [selectedMedicine, setSelectedMedicine] = useState<medicineType | null>(null);
    const [medicalCardInfo, setMedicalCardInfo] = useState <MedicalExaminationCard | null>(null);
    const [prescription, setPrescription] = useState < prescriptionType|null>(null);
    const [inputPrescriptionDetail, setInputPrescriptionDetail] = useState <inputPrescriptionDetail | null>(null)

    const [selectedGroup, setSelectedGroup] = useState('all');
    const [confirmedSearchTerm, setConfirmedSearchTerm] = useState('');
    const [currentSearchInput, setCurrentSearchInput] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 3;

    const [allFilteredMedicines, setAllFilteredMedicines] = useState<medicineType[]>([]);
    const [medicines, setMedicines] = useState<medicineType[]>([]);
    const [totalMedicines, setTotalMedicines] = useState(0);

    const [loadingMedicines, setLoadingMedicines] = useState(false);
    const [errorMedicines, setErrorMedicines] = useState<string | null>(null);

    const [medicineGroups, setMedicineGroups] = useState<medicineGroupType[]>([]);
    const [loadingGroups, setLoadingGroups] = useState(false);
    const [errorGroups, setErrorGroups] = useState<string | null>(null);

    // --- Hàm để fetch TẤT CẢ thuốc phù hợp với filter/search hiện tại từ backend ---
    // (Sau đó sẽ được phân trang ở frontend)
    const fetchAllMatchingMedicines = useCallback(async () => {
        if (!isSelectingMedicine) return;

        setLoadingMedicines(true);
        setErrorMedicines(null);

        try {
            let dataResponse;
            const backendFetchLimit = 100000;
            const backendFetchPage = 1;

            if (confirmedSearchTerm) {
                // Nếu có từ khóa tìm kiếm, DÙ BẠN ĐANG CHỌN NHÓM NÀO,
                // chúng ta sẽ tìm kiếm tên thuốc TRONG NHÓM ĐÓ (hoặc tất cả nếu selectedGroup là 'all').
                dataResponse = await searchMedicinesByName(confirmedSearchTerm, backendFetchLimit, backendFetchPage, selectedGroup);
            } else if (selectedGroup !== 'all') {
                // Nếu KHÔNG có từ khóa tìm kiếm, và một nhóm cụ thể được chọn,
                // thì load TẤT CẢ thuốc thuộc nhóm đó.
                dataResponse = await fetchMedicinesByGroupId(selectedGroup, backendFetchLimit, backendFetchPage);
            } else {
                // Nếu KHÔNG có từ khóa tìm kiếm và nhóm là 'all',
                // load TẤT CẢ thuốc từ tất cả các nhóm.
                dataResponse = await fetchMedicines(backendFetchLimit, backendFetchPage, 'all');
            }

            if (dataResponse && dataResponse.data) {
                setAllFilteredMedicines(dataResponse.data);
            } else {
                setAllFilteredMedicines([]);
            }
        } catch (error) {
            console.error('Lỗi khi fetch danh sách thuốc:', error);
            setErrorMedicines(`Đã xảy ra lỗi khi tải dữ liệu thuốc`);
            setAllFilteredMedicines([]);
        } finally {
            setLoadingMedicines(false);
        }
    }, [isSelectingMedicine, selectedGroup, confirmedSearchTerm]); // Dependencies

    // Effect để kích hoạt việc fetch tất cả thuốc khớp với điều kiện hiện tại
    useEffect(() => {
        if (showPrescriptionPopup && isSelectingMedicine) {
            fetchAllMatchingMedicines();
        }
    }, [fetchAllMatchingMedicines, showPrescriptionPopup, isSelectingMedicine]);

    useEffect(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        setMedicines(allFilteredMedicines.slice(startIndex, endIndex));
        setTotalMedicines(allFilteredMedicines.length);
    }, [currentPage, pageSize, allFilteredMedicines]);

    useEffect (()=>{
    const medicalCardInfoStr = sessionStorage.getItem("ThongTinBenhNhanDangKham");

    if (medicalCardInfoStr) {
    const medicalCardInfo: MedicalExaminationCard = JSON.parse(medicalCardInfoStr);
        setMedicalCardInfo(medicalCardInfo)
    }

    },[])

    useEffect(() => {
        const getMedicineGroups = async () => {
            setLoadingGroups(true);
            setErrorGroups(null);
            try {
                const data = await fetchMedicineGroupsPaginated(100, 1)

                if (data && data.data) {
                    setMedicineGroups(data.data as medicineGroupType[]);
                } else {
                    setMedicineGroups([]);
                    setErrorGroups('Không thể tải danh mục nhóm thuốc. Dữ liệu rỗng hoặc không hợp lệ.');
                }
            } catch (error) {
                console.error('Lỗi khi fetch danh mục nhóm thuốc:', error);
                setErrorGroups(`Đã xảy ra lỗi khi tải danh mục nhóm thuốc`);
                setMedicineGroups([]);
            } finally {
                setLoadingGroups(false);
            }
        };

        if (showPrescriptionPopup && medicineGroups.length === 0 && !loadingGroups && !errorGroups) {
            getMedicineGroups();
        }
    }, [showPrescriptionPopup, medicineGroups.length, loadingGroups, errorGroups]);

    // --- Các hàm xử lý sự kiện ---

    const handleNextStep = async () => {
    const responseCreatePrescription = await createPrescription(
        PrescriptionInfo.Id_PhieuKhamBenh as string,
        `Đơn thuốc của ${medicalCardInfo?.Id_TheKhamBenh.HoVaTen} - ${medicalCardInfo?.Ngay}`
    );

    if (responseCreatePrescription?.data) {
        console.log("Đơn thuốc đã tạo:", responseCreatePrescription.data);

        // ✅ Lưu vào sessionStorage
        sessionStorage.setItem("DonThuocDaTao", JSON.stringify(responseCreatePrescription.data));
        setPrescription(responseCreatePrescription?.data)
    }

    if (step < 3) setStep(step + 1);
    };


    const handleOpenMedicineSelectionView = () => {
        setIsSelectingMedicine(true);
        setCurrentPage(1); // Đặt lại trang về 1 khi mở view chọn thuốc
        setSelectedGroup('all'); // Đặt lại nhóm về 'all'
        setConfirmedSearchTerm(''); // Xóa từ khóa tìm kiếm đã xác nhận
        setCurrentSearchInput(''); // Xóa nội dung trong ô input tìm kiếm
        setAllFilteredMedicines([]); // Xóa dữ liệu cũ
        setMedicines([]); // Xóa dữ liệu hiển thị cũ
        setTotalMedicines(0); // Đặt lại tổng số thuốc
    };

    const handleBackToStep3Form = () => {
        setIsSelectingMedicine(false);
        // Đặt lại tất cả các state liên quan đến chọn thuốc khi quay lại form
        setCurrentPage(1);
        setSelectedGroup('all');
        setConfirmedSearchTerm('');
        setCurrentSearchInput('');
        setAllFilteredMedicines([]);
        setMedicines([]);
        setTotalMedicines(0);
    };

    const handleSelectMedicine = (medicine: medicineType) => {
        setSelectedMedicine(medicine);
        setIsSelectingMedicine(false);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSearchConfirm = (value: string) => {
        const trimmedValue = value.trim();
        setConfirmedSearchTerm(trimmedValue);
        setCurrentPage(1);
    };

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCurrentSearchInput(value);
        if (value === '' && confirmedSearchTerm !== '') {
            setConfirmedSearchTerm('');
            setCurrentPage(1);
        }
    };

    const handleGroupChange = (value: string) => {
        setSelectedGroup(value);
        setCurrentPage(1); // Đặt lại trang về 1 khi thay đổi nhóm
        // **Quan trọng:** Luôn xóa từ khóa tìm kiếm và input khi thay đổi nhóm
        // để đảm bảo rằng khi chọn nhóm mới, ta bắt đầu với danh sách thuốc của nhóm đó,
        // không bị ảnh hưởng bởi tìm kiếm cũ.
        setConfirmedSearchTerm('');
        setCurrentSearchInput('');
    };

    const handleCreatePrescription = async ()=>{
        console.log(inputPrescriptionDetail)
        console.log(prescription)
        console.log(selectedMedicine)
        const res = await createPrescriptionDetail(prescription?._id as string, selectedMedicine?._id as string, Number(inputPrescriptionDetail?.Quantity), inputPrescriptionDetail?.Remind as string)
        console.log(res)
    }

    return (
        <>
            <Modal
                open={showPrescriptionPopup}
                footer={null}
                onCancel={handleClosePrescriptionPopup}
                width={800}
                className="prescription-popup"
                style={{ top: 50 }}
            >
                <div className="prescription-popup__steps">
                    {[1, 2, 3].map((s, i, arr) => (
                        <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
                            <div
                                className={`prescription-popup__step ${step === s ? 'prescription-popup__step--active' : ''}`}
                            >
                                <div className="prescription-popup__step-title">Bước {s}</div>
                                <div className="prescription-popup__step-subtitle">
                                    {s === 1 ? 'Tạo đơn thuốc' : s === 2 ? 'Tạo đơn thuốc chi tiết' : 'Chọn thuốc'}
                                </div>
                            </div>
                            {i < arr.length - 1 && <div className="prescription-popup__connector" />}
                        </div>
                    ))}
                </div>

                <div className="prescription-popup__body">
                    {step !== 3 && (
                        <>
                            <div className="presscription-popup__title">Thông tin đơn thuốc<caption></caption></div>
                            <div className="prescription-popup__content">
                                <div className="prescription-popup__column">
                                    <p>
                                        <strong>Họ tên:</strong> {medicalCardInfo?.Id_TheKhamBenh.HoVaTen || 'Chưa có'}
                                    </p>
                                    <p>
                                        <strong>Tuổi: </strong> 
                                        {medicalCardInfo?.Id_TheKhamBenh.NgaySinh ? calculateAge(medicalCardInfo?.Id_TheKhamBenh.NgaySinh) : 'Chưa có'}
                                    </p>
                                    <p>
                                        <strong>Tên đơn thuốc:</strong> {`Đơn thuốc của ${medicalCardInfo?.Id_TheKhamBenh.HoVaTen} - ${medicalCardInfo?.Ngay}` || 'Đơn thuốc'}
                                    </p>

                                    {step === 2 && (
                                        <Button
                                            type="default"
                                            className="prescription-popup__detail-button"
                                            onClick={() => setStep(3)}
                                        >
                                            Tạo đơn thuốc chi tiết
                                        </Button>
                                    )}
                                </div>
                                <div className="prescription-popup__column">
                                    <p>
                                        <strong>Bác sĩ:</strong> {medicalCardInfo?.Id_Bacsi.TenBacSi ||'Chưa có'}
                                    </p>
                                    <p>
                                        <strong>Ngày:</strong> {medicalCardInfo?.Ngay || 'Chưa có'}
                                    </p>
                                    <p>
                                        <strong>Số phòng:</strong> {medicalCardInfo?.Id_Bacsi?.Id_PhongKham?.SoPhongKham ||'Chưa có'}
                                    </p>
                                </div>
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            {!isSelectingMedicine ? (
                                <div className="prescription-popup__step3">
                                    <div className="form-row">
                                        <div className="form-group qty">
                                            <label>Số Lượng</label>
                                            <Input type="number" placeholder="Nhập số lượng" className="form-control" 
                                                onChange={(e)=>{setInputPrescriptionDetail((prev)=>(
                                                    {...prev, Quantity:Number(e.target?.value)}
                                                ))}}
                                            />
                                        </div>

                                        <div className="form-group medicine">
                                            <label>
                                                Thuốc đã chọn:{' '}
                                                <span style={{ fontWeight: 400 }}>
                                                    {selectedMedicine ? selectedMedicine.TenThuoc : 'chưa chọn'}
                                                </span>
                                            </label>
                                            <Input
                                                type="text"
                                                readOnly
                                                placeholder="+ Chọn thuốc"
                                                className="form-control clickable"
                                                onClick={handleOpenMedicineSelectionView}
                                                value={selectedMedicine ? selectedMedicine.TenThuoc : ''}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Nhắc nhở</label>
                                        <Input.TextArea placeholder="Nhập nhắc nhở" className="form-control" rows={4} 
                                                    onChange={(e)=>{setInputPrescriptionDetail((prev)=>(
                                                    {...prev, Remind:e.target.value}
                                                ))}}
                                        />
                                    </div>

                                    <div style={{ textAlign: 'right', marginTop: '20px' }}>
                                        <Button type="primary" onClick={handleCreatePrescription}>Tạo</Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="medicine-selection-layout">
                                    <h3 className="text-xl font-semibold mb-4">Chọn thuốc</h3>
                                    <div className="flex items-center gap-4 mb-4">
                                        <Input.Search
                                            placeholder="Tìm kiếm thuốc..."
                                            onSearch={handleSearchConfirm}
                                            onChange={handleSearchInputChange}
                                            value={currentSearchInput}
                                            style={{ width: '100%' }}
                                            allowClear
                                        />

                                        {loadingGroups ? (
                                            <Spin size="small" />
                                        ) : errorGroups ? (
                                            <Alert message="Lỗi" description={errorGroups} type="error" showIcon style={{ width: 200 }} />
                                        ) : (
                                            <Select
                                                style={{ width: 200 }}
                                                onChange={handleGroupChange}
                                                value={selectedGroup}
                                            >
                                                <Option value="all">Tất cả nhóm thuốc</Option>
                                                {medicineGroups.map(group => (
                                                    <Option key={group?._id} value={group._id}>
                                                        {group?.TenNhomThuoc}
                                                    </Option>
                                                ))}
                                            </Select>
                                        )}
                                    </div>
                                    {loadingMedicines && (
                                        <div style={{ textAlign: 'center', padding: '20px' }}>
                                            <Spin size="large" />
                                            <p>Đang tải dữ liệu thuốc...</p>
                                        </div>
                                    )}
                                    {errorMedicines && (
                                        <Alert message="Lỗi" description={errorMedicines} type="error" showIcon />
                                    )}
                                    {!loadingMedicines && !errorMedicines && (
                                        <>
                                            {medicines.length > 0 ? (
                                                <div className="medicine-table-container">
                                                    <table className="medicine-table">
                                                        <thead>
                                                            <tr>
                                                                <th className="align-left fixed-column-left">Tên thuốc</th>
                                                                <th className="align-center">Giá thuốc</th>
                                                                <th className="align-right fixed-column-right">Hành động</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {medicines.map((record: medicineType) => (
                                                                <tr key={record._id as string}>
                                                                    <td className="align-left fixed-column-left">{record.TenThuoc}</td>
                                                                    <td className="align-center">{record.Gia?.toLocaleString('vi-VN')} VNĐ</td>
                                                                    <td className="align-right fixed-column-right">
                                                                        <Button type="primary" onClick={() => handleSelectMedicine(record)}>
                                                                            Chọn
                                                                        </Button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                <div style={{ textAlign: 'center', padding: '20px' }}>
                                                    <Alert
                                                        message="Thông báo"
                                                        description="Không có thuốc nào được tìm thấy cho điều kiện tìm kiếm này."
                                                        type="info"
                                                        showIcon
                                                    />
                                                </div>
                                            )}
                                        </>
                                    )}

                                    <div className="flex justify-between items-center px-2 py-1 mt-4">
                                        <Button onClick={handleBackToStep3Form}>Quay lại</Button>
                                        {totalMedicines > 0 && (
                                            <Pagination
                                                current={currentPage}
                                                pageSize={pageSize}
                                                total={totalMedicines}
                                                onChange={handlePageChange}
                                                showSizeChanger={false}
                                                showLessItems
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="prescription-popup__footer">
                    {step === 1 && (
                        <Button type="primary" onClick={handleNextStep}>
                            Tạo đơn
                        </Button>
                    )}
                </div>
            </Modal>
        </>
    );
};

export default PrescriptionPopup;