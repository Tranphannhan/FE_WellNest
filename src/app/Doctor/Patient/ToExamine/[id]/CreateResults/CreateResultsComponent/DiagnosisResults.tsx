import './DiagnosisResults.css';
// --

import './Diagnosis.css';   


export default function DiagnosisResultsComponent() {
    return (
        <div className="DiagnosisResults-Body">
            <div className="DiagnosisResults-Container">
                <span className='DiagnosisResults-Body__Title'>Tạo tạo kết quả khám</span>

                <div className="DiagnosisResults-createResultsRow">
                    <div className="DiagnosisResults-createResultsRow__create__Column">
                      <div className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__inputArea">
                        <textarea  className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__textInput" rows={3} placeholder="Nhập triệu chứng..."></textarea>
                          <div className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__dots">
                              <span></span>
                              <span></span>
                              <span></span>
                          </div>
                      </div>  
                    </div>


                    <div className="DiagnosisResults-createResultsRow__create__Column">
                       <div className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__inputArea">
                        <textarea  className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__textInput" rows={3} placeholder="Nhập triệu chứng..."></textarea>
                          <div className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__dots">
                              <span></span>
                              <span></span>
                              <span></span>
                          </div>
                      </div>  
                    </div>

                    
                </div>

                <div className="DiagnosisResults-Body__create__footer">
                    <div className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__inputArea">
                        <textarea  className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__textInput" rows={3} placeholder="Nhập triệu chứng..."></textarea>
                          <div className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__dots">
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
