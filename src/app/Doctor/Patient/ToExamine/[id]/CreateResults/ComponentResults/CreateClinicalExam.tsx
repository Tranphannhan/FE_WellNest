import { useState, useEffect } from 'react';
import { Modal, Button, Spin } from 'antd'; // Import Spin for loading indicator
import './CreateClinicalExam.css'; // Import file CSS riêng biệt
import { getAllPagination, getIdByTest } from '@/app/services/DoctorSevices';
import { clinicalType, laboratoryType } from '@/app/types/patientTypes/patient';



// Định nghĩa props cho component ClinicalExamPage
interface ClinicalExamPageProps {
    open: boolean; // Trạng thái mở/đóng popup, được điều khiển từ component cha
    onClose: () => void; // Hàm gọi để đóng popup, được truyền từ component cha
}

const API_IMAGE_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // Assuming your image base URL

const ClinicalExamPage = ({ open, onClose }: ClinicalExamPageProps) => {
    const [step, setStep] = useState(1);
    const [rooms, setRooms] = useState<laboratoryType[]>([]); // Use paginationType interface
    const [examinationTypes, setExaminationTypes] = useState<clinicalType[]>([]); // Use testType interface
    const [selectedRoom, setSelectedRoom] = useState<laboratoryType | null>(null); // Store the selected room object
    const [loading, setLoading] = useState(false); // Loading state

    // Reset step and selected room when popup opens
    useEffect(() => {
        if (open) {
            setStep(1); // Reset step to 1 whenever the modal is opened
            setSelectedRoom(null); // Clear selected room when modal opens
            setExaminationTypes([]); // Clear previous examination types
            fetchRooms(); // Fetch rooms when modal opens
        }
    }, [open]);

    // Function to fetch rooms
    const fetchRooms = async () => {
        setLoading(true);
        const result = await getAllPagination();
        if (typeof result === 'string') {
            console.error('Error fetching rooms:', result);
            setRooms([]); // Set to empty array on error
        } else {
            setRooms(result);
        }
        setLoading(false);
    };

    // Function to fetch examination types for a selected room
    const fetchExaminationTypes = async (roomId: string) => {
        setLoading(true);
        const result = await getIdByTest(roomId);
        if (typeof result === 'string') {
            console.error('Error fetching examination types:', result);
            setExaminationTypes([]); // Set to empty array on error
        } else {
            setExaminationTypes(result);
        }
        setLoading(false);
    };

    const handleSelectRoom = (room: laboratoryType) => {
        setSelectedRoom(room);
        setStep(2);
        fetchExaminationTypes(room._id);
    };

    const handleGoBack = () => {
        setStep(1);
        setSelectedRoom(null);
        setExaminationTypes([]);
    };

    return (
        <Modal
            open={open} // Nhận trạng thái mở từ props
            footer={null}
            onCancel={onClose} // Sử dụng hàm onClose từ props để đóng popup
            width={1000}
            className="clinical-modal"
        >
            <div className="steps-container">
                <div className="step-wrapper">
                    <div
                        className={`step-item ${step === 1 ? 'step-item--active' : ''}`}
                    >
                        <div className="step-title">Bước 1</div>
                        <div className="step-subtitle">Chọn phòng xét nghiệm</div>
                    </div>
                </div>

                <div className={`step-connector ${step === 2 ? 'step-connector--active' : ''}`}></div>

                <div className="step-wrapper">
                    <div
                        className={`step-item ${step === 2 ? 'step-item--active' : ''}`}
                    >
                        <div className="step-title">Bước 2</div>
                        <div className="step-subtitle">Chọn loại xét nghiệm</div>
                    </div>
                </div>
            </div>

            {loading && (
                <div className="loading-overlay">
                    <Spin size="large" />
                    <p>Đang tải dữ liệu...</p>
                </div>
            )}

            {!loading && step === 1 && (
                <div className="modal-content-section">
                    <div className="search-bar-container">
                        <input
                            type="text"
                            placeholder="Tìm kiếm phòng xét nghiệm"
                            className="search-input"
                        />
                        <svg
                            className="search-icon"
                            width="20"
                            height="20"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                    </div>

                    {rooms.length > 0 ? (
                        <div className="table-container">
                            <table className="data-table">
                                <thead className="table-header">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="table-header-cell"
                                        >
                                            Tên phòng thiết bị
                                        </th>
                                        <th
                                            scope="col"
                                            className="table-header-cell"
                                        >
                                            Hình ảnh
                                        </th>
                                        <th
                                            scope="col"
                                            className="table-header-cell"
                                        >
                                            Hành động
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rooms.map((room) => (
                                        <tr key={room._id} className="table-row-hover">
                                            <td className="table-data-cell table-data-cell--medium-font">
                                                {room.TenPhongThietBi}
                                            </td>
                                            <td className="table-data-cell">
                                                <img src={`${API_IMAGE_BASE_URL}/image/${room.Image}`} alt={room.TenPhongThietBi} className="table-image" />
                                            </td>
                                            <td className="table-data-cell table-data-cell--action">
                                                <Button
                                                    type="primary"
                                                    onClick={() => handleSelectRoom(room)}
                                                    className="action-button"
                                                >
                                                    Chọn phòng
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center no-data-message">
                            <p>Không có dữ liệu phòng thiết bị.</p>
                        </div>
                    )}
                </div>
            )}

            {!loading && step === 2 && (
                <div className="p-4">
                    <h3 className="section-title">Tên phòng: {selectedRoom?.TenPhongThietBi}</h3>
                    {examinationTypes.length > 0 ? ( // <--- Check if examinationTypes exist here
                        <div className="table-container table-container--no-horizontal-scroll">
                            <table className="data-table">
                                <thead className="table-header">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="table-header-cell"
                                        >
                                            Tên xét nghiệm
                                        </th>
                                        <th
                                            scope="col"
                                            className="table-header-cell"
                                        >
                                            Hình ảnh
                                        </th>
                                        <th
                                            scope="col"
                                            className="table-header-cell table-header-cell--wide"
                                        >
                                            Mô tả xét nghiệm
                                        </th>
                                        <th
                                            scope="col"
                                            className="table-header-cell"
                                        >
                                            Giá
                                        </th>
                                        <th
                                            scope="col"
                                            className="table-header-cell"
                                        >
                                            Hành động
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {examinationTypes.map((test) => (
                                        <tr key={test._id} className="table-row-hover">
                                            <td className="table-data-cell table-data-cell--medium-font">
                                                {test.TenXetNghiem}
                                            </td>
                                            <td className="table-data-cell">
                                                <img src={`${API_IMAGE_BASE_URL}/image/${test.Image}`} alt={test.TenXetNghiem} className="table-image" />
                                            </td>
                                            <td className="table-data-cell table-data-cell--wrap-text">
                                                {test.MoTaXetNghiem}
                                            </td>
                                            <td className="table-data-cell_red">
                                                {test.Id_GiaDichVu?.Giadichvu?.toLocaleString('vi-VN') || 0} VND
                                            </td>
                                            <td className="table-data-cell table-data-cell--action">
                                                <Button
                                                    type="primary"
                                                    className="action-button"
                                                >
                                                    Chọn loại
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center no-data-message"> {/* <--- Display message if no examination types */}
                            <p>Không có dữ liệu loại xét nghiệm cho phòng này.</p>
                        </div>
                    )}
                    <div className="modal-footer-actions">
                        <Button
                            type="default"
                            onClick={handleGoBack}
                            className="back-button"
                        >
                            Quay lại
                        </Button>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default ClinicalExamPage;