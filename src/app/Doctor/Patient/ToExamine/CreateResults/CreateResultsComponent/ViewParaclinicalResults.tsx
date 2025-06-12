import React, { useState } from 'react';
import './ViewParaclinicalResults.css';
import ViewPhotoDetails from './ViewPhotoDetails';

interface TestResult {
  id: string;
  imageSrc: string; 
  testName: string; 
  testCode: string;
  testDate: string;
  normalRange: string;
  notes: string;
  unit: string;
  resultValue: string;
}

interface ViewParaclinicalResultsProps {
  onClose: () => void;
}

const mockTestResults: TestResult[] = [
  {
    id: 'test-001',
    imageSrc: "https://vinmecdr.com/storage/2022/06/Huong-dan-chup-X-quang-xuong-dui.jpg",
    testName: 'Xét nghiệm máu',
    testCode: 'XN001',
    testDate: '2025-05-21',
    normalRange: '4.0 - 5.5',
    notes: 'Bệnh nhân cần theo dõi thêm',
    unit: 'g/dL',
    resultValue: '4.5',
  },
  {
    id: 'test-002',
    imageSrc: "https://ttol.vietnamnetjsc.vn/images/2018/11/30/14/44/42982652101578227704694181824830354511364096n-1543315199-579-width600height589.jpg", // Ảnh X-quang mẫu
    testName: 'Chụp X-quang phổi',
    testCode: 'XQ001',
    testDate: '2025-05-21',
    normalRange: 'Bình thường',
    notes: 'Không phát hiện bất thường',
    unit: 'g/dL',
    resultValue: 'Đã hoàn thành', 
  },
];

export default function ViewParaclinicalResults({ onClose }: ViewParaclinicalResultsProps){
    const [showPhotoPopup, setShowPhotoPopup] = useState(false);
     const [currentPhotoSrc, setCurrentPhotoSrc] = useState('');

     // 3. Hàm xử lý khi click vào ảnh
  const handleImageClick = (imageSrc: string) => {
    setCurrentPhotoSrc(imageSrc);
    setShowPhotoPopup(true);
  };

  // 4. Hàm đóng popup ảnh
  const handleClosePhotoPopup = () => {
    setShowPhotoPopup(false);
    setCurrentPhotoSrc(''); // Reset đường dẫn ảnh
  };
  return (
    <div className="ViewParaclinicalResults-container">
      <div className="ViewParaclinicalResults-container_outer_wrapper">
        <span className="ViewParaclinicalResults-container_breadcrumb_outside">Bệnh nhân &gt; <span style={{color:"#3497F9"}}>Kết quả xét nghiệm</span></span>

        <div className="ViewParaclinicalResults-container_popup" onClick={(e) => e.stopPropagation()}>
          <h4 className="ViewParaclinicalResults-container_popup_main_title">Kết quả xét nghiệm</h4>

          <div className="ViewParaclinicalResults-container_products_frame">
            {/* 4. Map qua dữ liệu mẫu để render các thẻ kết quả */}
            {mockTestResults.map((result, index) => (
              <React.Fragment key={result.id}> {/* Sử dụng React.Fragment để bọc và key */}
                <div className="ViewParaclinicalResults-container_test_result_card">
                  <div className="card-image-wrapper" onClick={() => handleImageClick(result.imageSrc)}>
                    <img src={result.imageSrc} alt={result.testName} className="card-image" />
                  </div>
                  <div className="ViewParaclinicalResults-container_card_details_group">
                    <div className="ViewParaclinicalResults-container_card_detail_item">
                      <span className="detail-label">Tên xét nghiệm:</span>
                      <span className="detail-value">{result.testName}</span>
                    </div>
                    <div className="ViewParaclinicalResults-container_card_detail_item">
                      <span className="detail-label">Mã xét nghiệm:</span>
                      <span className="detail-value">{result.testCode}</span>
                    </div>
                    <div className="ViewParaclinicalResults-container_card_detail_item">
                      <span className="detail-label">Ngày xét nghiệm:</span>
                      <span className="detail-value">{result.testDate}</span>
                    </div>
                    <div className="ViewParaclinicalResults-container_card_detail_item">
                      <span className="detail-label">Chỉ số bình thường:</span>
                      <span className="detail-value normal-range">{result.normalRange}</span>
                    </div>
                    <div className="ViewParaclinicalResults-container_card_detail_item">
                      <span className="detail-label note-label">Ghi chú:</span>
                      <span className="detail-value note-value">{result.notes}</span>
                    </div>
                  </div>
                  <div className="ViewParaclinicalResults-container_card_metrics_group">
                    <div className="metric-item">
                      <span className="metric-label">Đơn vị tính:</span>
                      <span className="metric-value">{result.unit}</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Kết quả:</span>
                      <span className="metric-value result-value">{result.resultValue}</span>
                    </div>
                  </div>
                </div>
                {index < mockTestResults.length - 1 && (
                  <div className="ViewParaclinicalResults-container_product_divider"></div>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="popup-footer">
            <button className="button secondary-button" onClick={onClose}>Quay lại</button>
            <button className="button primary-button">
              <span className="plus-icon">+</span> Tạo yêu cầu xét nghiệm
            </button>
          </div>
        </div> {/* Kết thúc popup-container */}
      </div> {/* Kết thúc outer-wrapper */}
      {/* 6. Conditional rendering của ViewPhotoDetails */}
      {showPhotoPopup && (
        <ViewPhotoDetails
          imageSrc={currentPhotoSrc}
          onClose={handleClosePhotoPopup}
        />
      )}
    </div>
  );
};