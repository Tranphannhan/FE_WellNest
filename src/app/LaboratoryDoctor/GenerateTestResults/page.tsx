
'use client';
import './GenerateTestResults.css';
import Tabbar from '@/app/components/shared/Tabbar/Tabbar';



export default function GenerateTestResults() {
    return (
        <>
            <Tabbar
                tabbarItems={{
                    tabbarItems: [
                        { text: 'Tạo kết quả xét nghiệm', link: '/LaboratoryDoctor/GenerateTestResults' },
                    ],
                }}
            />

            <div className="generate-test-results-container">
                <h3 className="title">Tạo kết quả xét nghiệm</h3>
                <div className="form-container">
                    <div className="upload-section">
                        <div className="upload-box">
                            <i className="bi bi-cloud-upload"></i>
                            <p>Chọn ảnh</p>
                        </div>
                        <p className="upload-warning">Vui lòng chọn ảnh</p>
                    </div>

                    <div className="input-section">
                        <div className="input-group">
                            <div className="input-box">
                                <label>Tên xét nghiệm</label>
                                <input type="text" />
                            </div>
                            <div className="input-box">
                                <label>Mã xét nghiệm</label>
                                <input type="text" />
                            </div>
                        </div>



                        <div className="input-group">
                            <div className="input-box">
                                <label>Chỉ số bình thường</label>
                                <input type="text" />
                            </div>
                            <div className="input-box">
                                <label>Đơn vị tính</label>
                                <input type="text" />
                            </div>
                        </div>

                        <div className="input-box full-width">
                            <label>Kết quả</label>
                            <textarea rows={3}></textarea>
                        </div>

                        <div className="input-box full-width">
                            <label>Ghi chú</label>
                            <textarea rows={3}></textarea>
                        </div>

                        <div className="button-group">
                            <button className="cancel-button">Quay lại</button>
                            <button className="confirm-button">Tạo kết quả xét nghiệm</button>
                        </div>
                    </div>



                </div>
            </div>
        </>
    );
}


