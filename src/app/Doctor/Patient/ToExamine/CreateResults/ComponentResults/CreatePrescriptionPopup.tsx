'use client';
import { useState } from 'react';
import { Modal, Button } from 'antd';
import './CreatePrescriptionPopup.css';

 const PrescriptionPopup = ({showPrescriptionPopup,handleClosePrescriptionPopup}:{showPrescriptionPopup:boolean,handleClosePrescriptionPopup:()=>void}) => {
  const [step, setStep] = useState(1);

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  return (
    <>

      <Modal
        open={showPrescriptionPopup}
        footer={null}
        onCancel={handleClosePrescriptionPopup}
        width={800}
        className="prescription-popup"
      >
        {/* Các bước */}
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

              {/* Chỉ thêm connector nếu không phải bước cuối */}
              {i < arr.length - 1 && <div className="prescription-popup__connector" />}
            </div>
          ))}
        </div>


        {step !== 3 && (
          <>
            <div className="presscription-popup__title">Thông tin bệnh nhân</div>
            <div className="prescription-popup__content">
              <div className="prescription-popup__column">
                <p><strong>Họ tên:</strong> Trần Bệnh Nhân</p>
                <p><strong>Tên đơn thuốc:</strong> Đơn thuốc</p>
                <p><strong>Ngày:</strong> 2025-05-20</p>

                {step === 2 && (
                  <Button
                    type="default"
                    className="prescription-popup__detail-button"
                    icon="+"
                    onClick={() => setStep(3)}
                  >
                    Tạo đơn thuốc chi tiết
                  </Button>
                )}
              </div>
              <div className="prescription-popup__column">
                <p><strong>Bác sĩ:</strong> Trần Bệnh Nhân</p>
                <p><strong>Ca:</strong> sáng</p>
                <p><strong>Số phòng:</strong> 1</p>
              </div>
            </div>
          </>
        )}


        {/* Giao diện riêng bước 3 */}
        {step === 3 && (
          <div className="prescription-popup__step3">
            <div className="form-row">
              <div className="form-group qty">
                <label>Số Lượng</label>
                <input type="number" placeholder="Nhập số lượng" className="form-control" />
              </div>

              <div className="form-group medicine">
                <label>Thuốc đã chọn: <span style={{ fontWeight: 400 }}>chưa chọn</span></label>
                <input type="text" disabled placeholder="+ Chọn thuốc" className="form-control clickable" />
              </div>
            </div>



            <div className="form-group">
              <label>Nhắc nhở</label>
              <textarea placeholder="Nhập nhắc nhở" className="form-control" rows={4}></textarea>
            </div>

            <div style={{ textAlign: 'right' }}>
              <Button type="primary">Tạo</Button>
            </div>
          </div>
        )}

        {/* Footer cho bước 1 */}
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
