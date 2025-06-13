import { FaSave } from 'react-icons/fa'; 
import './Diagnosis.css';   

export default function DiagnosisComponent (){
    return (
       <>
          <div className="CreateResults-bodyFrame__vitalSigns">
              <div className="vital-signs-container">
                <h2>Chỉ số sinh tồn</h2>
  
                <div className="CreateResults-bodyFrame__vitalSigns__formRow">
                  <div className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup">
                    <label htmlFor="temperature">Nhiệt độ</label>
                    <div className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup__inputWith">
                      <input type="text" id="temperature" />
                      <span className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup__inputWith_unit">°C</span>
                    </div>
                  </div>  

                  <div className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup">
                    <label htmlFor="temperature">Nhịp thở</label>
                    <div className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup__inputWith">
                      <input type="text" id="temperature" />
                      <span className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup__inputWith_unit">L/P</span>
                    </div>
                  </div>

                  <div className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup">
                    <label htmlFor="temperature">Huyết áp</label>
                    <div className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup__inputWith">
                      <input type="text" id="temperature" />
                      <span className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup__inputWith_unit">mmHg</span>
                    </div>
                  </div>


                  <div className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup">
                    <label htmlFor="temperature">Mạch</label>
                    <div className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup__inputWith">
                      <input type="text" id="temperature" />
                      <span className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup__inputWith_unit">L/P</span>
                    </div>
                  </div>

                </div>


                <div className="CreateResults-bodyFrame__vitalSigns__formRow">
                  <div className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup">
                    <label htmlFor="temperature">Chiều cao</label>
                    <div className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup__inputWith">
                      <input type="text" id="temperature" />
                      <span className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup__inputWith_unit">°C</span>
                    </div>
                  </div>

                  <div className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup">
                    <label htmlFor="temperature">Cân nặng</label>
                    <div className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup__inputWith">
                      <input type="text" id="temperature" />
                      <span className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup__inputWith_unit">Kg</span>
                    </div>
                  </div>

                  <div className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup">
                    <label htmlFor="temperature">BMI</label>
                    <div className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup__inputWith">
                      <input type="text" id="temperature" />
                      <span className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup__inputWith_unit">Kg/m2</span>
                    </div>
                  </div>


                  <div className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup">
                    <label htmlFor="temperature">SP02</label>
                    <div className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup__inputWith">
                      <input type="text" id="temperature" />
                      <span className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup__inputWith_unit">%</span>
                    </div>
                  </div>
                </div>


              </div>
            </div>

            <div className='CreateResults-bodyFrame__title2'>Chuẩn đoán sơ bộ</div>
            
            <div className="CreateResults-bodyFrame__formVitalSigns">
               <div className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer">
                  <div className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection">
                      <div>Triệu chứng</div>
                      <div className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__inputArea">
                        <textarea className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__textInput" rows={3} placeholder="Nhập triệu chứng..."></textarea>
                          <div className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__dots">
                              <span></span>
                              <span></span>
                              <span></span>
                          </div>
                      </div>  
                  </div>

  
                  <div className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection">
                      <div>Chuẩn đoán sơ bộ</div>
                      <div className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__inputArea">
                        <textarea className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__textInput" rows={3} placeholder="Nhập chuẩn đoán..."></textarea>
                          <div className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__dots">
                              <span></span>
                              <span></span>
                              <span></span>
                          </div>
                      </div>  

                  </div>


                  <div className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__saveButtonContainer">
                    <button className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__saveButtonContainer__saveButton">
                      <FaSave className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__saveButtonContainer__saveButton__saveIcon" /> {/* Icon lưu */}
                      Lưu
                    </button>
                  </div>


                </div>
            </div>
       </>
    )
}