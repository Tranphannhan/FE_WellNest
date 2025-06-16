import './DiagnosisResults.css';
// --

import './Diagnosis.css';   
import { FaSave } from 'react-icons/fa';


export default function DiagnosisResultsComponent() {
    return (
        <div className="DiagnosisResults-Body">
          


              
            <div className="DiagnosisResults-Container">
                <span className='DiagnosisResults-Body__Title'>Tạo tạo kết quả khám</span>
                <div className="DiagnosisResults-createResultsRow">
                    <div className="DiagnosisResults-createResultsRow__create__Column">
                        <div style={{font : '24px' , color : '#696969' , marginLeft : '10px' , fontWeight:  '600' }}>Kết quả</div>
                        <div className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__inputArea">
                            <textarea  className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__textInput" rows={3} placeholder="Nhập kết quả ..."></textarea>
                            <div className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>    
                    </div> 


                    <div className="DiagnosisResults-createResultsRow__create__Column">
                        <div style={{font : '24px' , color : '#696969' , marginLeft : '10px' , fontWeight:  '600' }}>Ghi chú </div>
                       <div className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__inputArea">
                        <textarea  className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__textInput" rows={3} placeholder="Nhập ghi chú..."></textarea>
                          <div className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__dots">
                              <span></span>
                              <span></span>
                              <span></span>
                          </div>
                      </div>  
                    </div>

                    
                </div>

                <div className="DiagnosisResults-Body__create__footer">
                    <div style={{font : '24px' , color : '#696969' , marginLeft : '10px' , fontWeight:  '600' }}>Hướng xử lý</div>
                    <div className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__inputArea">
                        <textarea  className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__textInput" rows={3} placeholder="Nhập hướng xử lý..."></textarea>
                          <div className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__dots">
                              <span></span>
                              <span></span>
                              <span></span>
                          </div>
                    </div>
                </div>
            </div>
            


            <div className='DiagnosisResults-Body__Button'>
                <button className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__saveButtonContainer__saveButton">
                    Lưu
                    <FaSave className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__saveButtonContainer__saveButton__saveIcon" /> {/* Icon lưu */}
                </button>
            </div>


        </div>
    )
}
