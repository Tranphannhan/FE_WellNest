
import './DiagnosisResults.css';

export default function DiagnosisResultsComponent() {
    return (
        <div className="DiagnosisResults-Body">
            <div style={{width : '96%' , marginLeft : '2%'}}>
                <span className='DiagnosisResults-Body__Title'>Tạo tạo kết quả khám</span>

                <div className="diagnosisResults-createResultsRow">
                    <div className="diagnosisResults-createResultsRow__create__Column">
                        <span>Kết quả:</span>
                        <div className="input-area">
                            <textarea class="text-input" rows="3" placeholder="Nhập triệu chứng..."></textarea>
                            <div className="dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                    

                    <div className="diagnosisResults-createResultsRow__create__Column">
                        <span>Ghi chú:</span>
                        <div className="input-area">
                            <textarea class="text-input" rows="3" placeholder="Nhập triệu chứng..."></textarea>
                            <div className="dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="DiagnosisResults-Body__create__footer">
                    <span>Hướng xử lý:</span>
                      <div className="input-area">
                            <textarea class="text-input" rows="2" placeholder="Nhập triệu chứng..."></textarea>
                            <div className="dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
