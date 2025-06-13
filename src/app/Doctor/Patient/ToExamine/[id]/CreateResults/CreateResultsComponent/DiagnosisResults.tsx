import './DiagnosisResults.css';

export default function DiagnosisResultsComponent() {
    return (
        <div className="DiagnosisResults-Body">
            <div className="DiagnosisResults-Container">
                <span className='DiagnosisResults-Body__Title'>Tạo tạo kết quả khám</span>

                <div className="DiagnosisResults-createResultsRow">
                    <div className="DiagnosisResults-createResultsRow__create__Column">
                        <span>Kết quả:</span>
                        <div className="DiagnosisResults-createResultsRow__create__Column__inputArea">
                            <textarea className="DiagnosisResults-createResultsRow__create__Column__textInput" rows={5} placeholder="Nhập triệu chứng..."></textarea>
                            <div className="DiagnosisResults-createResultsRow__create__Column__dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>


                    <div className="DiagnosisResults-createResultsRow__create__Column">
                        <span>Ghi chú:</span>
                        <div className="DiagnosisResults-createResultsRow__create__Column__inputArea">
                            <textarea className="DiagnosisResults-createResultsRow__create__Column__textInput" rows={5} placeholder="Nhập triệu chứng..."></textarea>
                            <div className="DiagnosisResults-createResultsRow__create__Column__dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>

                    
                </div>

                <div className="DiagnosisResults-Body__create__footer">
                    <span>Hướng xử lý:</span>
                    <div className="DiagnosisResults-createResultsRow__create__Column__inputArea">
                        <textarea style={{lineHeight : '30px'}} className="DiagnosisResults-createResultsRow__create__Column__textInput" rows={5} placeholder="Nhập triệu chứng..."></textarea>
                        <div className="DiagnosisResults-createResultsRow__create__Column__dots">
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
