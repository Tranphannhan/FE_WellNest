import { useState, useEffect } from 'react';
import { Modal, Button, Spin } from 'antd';
import './CreateClinicalExam.css'; // Import file CSS riêng biệt

interface Room {
  name: string;
  image: string;
}

interface ExaminationType {
  name: string;
  image: string;
  description: string;
  price: string;
}

// Định nghĩa props cho component ClinicalExamPage
interface ClinicalExamPageProps {
  open: boolean; // Trạng thái mở/đóng popup, được điều khiển từ component cha
  onClose: () => void; // Hàm gọi để đóng popup, được truyền từ component cha
}

const ClinicalExamPage = ({ open, onClose }: ClinicalExamPageProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [examinationTypes, setExaminationTypes] = useState<ExaminationType[]>([]);

  // Reset step to 1 when popup opens
  useEffect(() => {
    if (open) {
      setStep(1); // Reset step to 1 whenever the modal is opened
    }
  }, [open]);

  // Simulate API call to fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      if (step === 1) {
        setRooms([
          { name: 'Phòng XQuang', image: 'https://placehold.co/50x50/E0BBE4/FFFFFF?text=Img' },
          { name: 'Phòng xét nghiệm', image: 'https://placehold.co/50x50/957DAD/FFFFFF?text=Img' },
          { name: 'Phòng Nội soi', image: 'https://placehold.co/50x50/D291BC/FFFFFF?text=Img' },
          { name: 'Phòng siêu âm', image: 'https://placehold.co/50x50/FFC72C/FFFFFF?text=Img' },
          { name: 'Phòng đo chức năng hô hấp', image: 'https://placehold.co/50x50/33A8FF/FFFFFF?text=Img' },
          { name: 'Phòng tim mạch', image: 'https://placehold.co/50x50/E0BBE4/FFFFFF?text=Img' },
          { name: 'Phòng thần kinh', image: 'https://placehold.co/50x50/957DAD/FFFFFF?text=Img' },
          { name: 'Phòng răng hàm mặt', image: 'https://placehold.co/50x50/D291BC/FFFFFF?text=Img' },
          { name: 'Phòng mắt', image: 'https://placehold.co/50x50/FFC72C/FFFFFF?text=Img' },
          { name: 'Phòng tai mũi họng', image: 'https://placehold.co/50x50/33A8FF/FFFFFF?text=Img' },
          { name: 'Phòng da liễu', image: 'https://placehold.co/50x50/E0BBE4/FFFFFF?text=Img' },
          { name: 'Phòng nhi khoa', image: 'https://placehold.co/50x50/957DAD/FFFFFF?text=Img' },
          { name: 'Phòng xương khớp', image: 'https://placehold.co/50x50/D291BC/FFFFFF?text=Img' },
          { name: 'Phòng tiêu hóa', image: 'https://placehold.co/50x50/FFC72C/FFFFFF?text=Img' },
        ]);
      } else if (step === 2) {
        setExaminationTypes([
          { name: 'Xét nghiệm máu', image: 'https://placehold.co/50x50/E0BBE4/FFFFFF?text=Img', description: 'Xét nghiệm máu: công thức máu, nhóm máu, đông máu', price: '130.000 VND' },
          { name: 'Xét nghiệm nước tiểu', image: 'https://placehold.co/50x50/957DAD/FFFFFF?text=Img', description: 'Phân tích nước tiểu: vi khuẩn, đạm, đường', price: '150.000 VND' },
          { name: 'Xét nghiệm vi sinh', image: 'https://placehold.co/50x50/D291BC/FFFFFF?text=Img', description: 'Cấy vi khuẩn, tìm virus, nấm, kháng sinh đồ', price: '140.000 VND' },
          { name: 'Xét nghiệm di truyền', image: 'https://placehold.co/50x50/FFC72C/FFFFFF?text=Img', description: 'Xét nghiệm gen, ADN, bệnh di truyền', price: '190.000 VND' },
          { name: 'Xét nghiệm đông máu', image: 'https://placehold.co/50x50/33A8FF/FFFFFF?text=Img', description: 'Kiểm tra khả năng đông máu (INR, APTT)', price: '200.000 VND' },
          { name: 'Xét nghiệm gan', image: 'https://placehold.co/50x50/E0BBE4/FFFFFF?text=Img', description: 'Kiểm tra chức năng gan (ALT, AST)', price: '160.000 VND' },
          { name: 'Xét nghiệm thận', image: 'https://placehold.co/50x50/957DAD/FFFFFF?text=Img', description: 'Kiểm tra chức năng thận (Creatinine, Urea)', price: '170.000 VND' },
          { name: 'Xét nghiệm đường huyết', image: 'https://placehold.co/50x50/D291BC/FFFFFF?text=Img', description: 'Đo nồng độ đường trong máu (Glucose)', price: '100.000 VND' },
          { name: 'Xét nghiệm mỡ máu', image: 'https://placehold.co/50x50/FFC72C/FFFFFF?text=Img', description: 'Đo nồng độ cholesterol, triglyceride', price: '180.000 VND' },
          { name: 'Xét nghiệm hormon', image: 'https://placehold.co/50x50/33A8FF/FFFFFF?text=Img', description: 'Đo nồng độ các hormon tuyến giáp, sinh dục', price: '250.000 VND' },
        ]);
      }
      setLoading(false);
    };

    if (open) { // Fetch data only when modal is open
      fetchData();
    }
  }, [step, open]); // Re-run effect when step or open state changes

  const handleSelectRoom = () => {
    setStep(2);
  };

  const handleGoBack = () => {
    setStep(1);
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

      {loading ? (
        <div className="loading-spinner-container">
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      ) : (
        <>
          {step === 1 && (
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
                    {rooms.map((room, index) => (
                      <tr key={index} className="table-row-hover">
                        <td className="table-data-cell table-data-cell--nowrap table-data-cell--medium-font">
                          {room.name}
                        </td>
                        <td className="table-data-cell table-data-cell--nowrap">
                          <img src={room.image} alt="Room" className="table-image" />
                        </td>
                        <td className="table-data-cell table-data-cell--nowrap table-data-cell--action">
                          <Button
                            type="primary"
                            onClick={handleSelectRoom}
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
            </div>
          )}

          {step === 2 && (
            <div className="p-4">
              <h3 className="section-title">Tên phòng: Phòng xét nghiệm</h3>
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
                    {examinationTypes.map((test, index) => (
                      <tr key={index} className="table-row-hover">
                        <td className="table-data-cell table-data-cell--medium-font">
                          {test.name}
                        </td>
                        <td className="table-data-cell">
                          <img src={test.image} alt="Test" className="table-image" />
                        </td>
                        <td className="table-data-cell table-data-cell--wrap-text">
                          {test.description}
                        </td>
                        <td className="table-data-cell">
                          {test.price}
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
        </>
      )}
    </Modal>
  );
};

export default ClinicalExamPage;