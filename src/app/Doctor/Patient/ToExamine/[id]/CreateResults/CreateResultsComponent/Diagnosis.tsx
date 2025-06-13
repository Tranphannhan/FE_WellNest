import { FaSave } from 'react-icons/fa'; 
import './Diagnosis.css';   
import { useEffect, useState } from 'react';
import { diagnosisType, survivalIndexType } from '@/app/types/patientTypes/patient';
import { addDiagnosis, getVitalSignsByExaminationId, updateSurvivalIndex } from '@/app/services/DoctorSevices';
import { useParams } from 'next/navigation';
import { showToast, ToastType } from '@/app/lib/Toast';


  

export default function DiagnosisComponent (){
  const {id} = useParams();

  const [datasurvivalIndexRender , setDatasurvivalIndexRender] = useState <survivalIndexType > ({})
  const [diagnosis , setDiagnosis] = useState  <diagnosisType> ({});

  const getData = async () => {
    const data = await getVitalSignsByExaminationId (id as string);
    if (!data) return showToast ('Không có chỉ số sinh tồn' , ToastType.error);
    setDatasurvivalIndexRender (data);
  }

  const handleSave =  async () => {
    const update = await updateSurvivalIndex (datasurvivalIndexRender._id as string , datasurvivalIndexRender );
    if(diagnosis.ChuanDoanSoBo && diagnosis.TrieuChung){
       const updateDiagnosis = await addDiagnosis(id as string,diagnosis)
         console.log(updateDiagnosis)

        if(updateDiagnosis.data && update.data){
          showToast("Tạo chuẩn đoán thành công",ToastType.success)
          setDiagnosis({ChuanDoanSoBo:'',TrieuChung:''})
        }else{
          if(!updateDiagnosis.data){
            showToast(updateDiagnosis.message,ToastType.error)
          }
          if(!update.data){
            showToast(update.message,ToastType.error)
          }
          
          
        }
    }else{
      if(update.data){
          showToast("Lưu chỉ số sinh tồn thành công",ToastType.success)
        }else{
            showToast(update.message,ToastType.error)      
        }
    }
    
  
  }

  
  useEffect (() => {
    getData ();
  }, []);



  

    return (
       <>
          <div className="CreateResults-bodyFrame__vitalSigns">
              <div className="vital-signs-container">
                <h2>Chỉ số sinh tồn</h2>
  
                <div className="CreateResults-bodyFrame__vitalSigns__formRow">
                  <div className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup">
                    <label htmlFor="temperature">Nhiệt độ</label>
                    <div className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup__inputWith">
                      <input value={datasurvivalIndexRender.NhietDo ? datasurvivalIndexRender.NhietDo : ''}
                        onChange={(e) => {
                          setDatasurvivalIndexRender ((prev)=>(
                            {...prev,NhietDo:e.target.value}
                          ))
                        }}
                      type="text" id="temperature" />
                      <span className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup__inputWith_unit">°C</span>
                    </div>
                  </div>  

                  <div className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup">
                    <label htmlFor="temperature">Nhịp thở</label>
                    <div className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup__inputWith">
                      <input type="text" id="temperature" 
                         value={datasurvivalIndexRender.NhipTho ? datasurvivalIndexRender.NhipTho : ''}
                          onChange={(e) => {
                          setDatasurvivalIndexRender ((prev)=>(
                            {...prev,NhipTho :e.target.value}
                          ))
                        }}
                      />
                      <span className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup__inputWith_unit">L/P</span>
                    </div>
                  </div>


                  <div className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup">
                    <label htmlFor="temperature">Huyết áp</label>
                    <div className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup__inputWith">
                      <input type="text" id="temperature" 
                         value={datasurvivalIndexRender.HuyetAp? datasurvivalIndexRender.HuyetAp : ''}
                          onChange={(e) => {
                          setDatasurvivalIndexRender ((prev)=>(
                            {...prev,HuyetAp :e.target.value}
                          ))
                        }}
                      />
                      <span className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup__inputWith_unit">mmHg</span>
                    </div>
                  </div>


                  <div className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup">
                    <label htmlFor="temperature">Mạch</label>
                    <div className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup__inputWith">
                      <input type="text" id="temperature" 
                         value={datasurvivalIndexRender.Mach? datasurvivalIndexRender.Mach : ''}
                          onChange={(e) => {
                          setDatasurvivalIndexRender ((prev)=>(
                            {...prev,Mach :e.target.value}
                          ))
                        }}
                      />
                      <span className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup__inputWith_unit">L/P</span>
                    </div>
                  </div>

                </div>


                <div className="CreateResults-bodyFrame__vitalSigns__formRow">
                  <div className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup">
                    <label htmlFor="temperature">Chiều cao</label>
                    <div className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup__inputWith">
                      <input type="text" id="temperature" 
                        value={datasurvivalIndexRender.ChieuCao? datasurvivalIndexRender.ChieuCao : ''}
                          onChange={(e) => {
                          setDatasurvivalIndexRender ((prev)=>(
                            {...prev,ChieuCao : e.target.value}
                          ))
                        }}
                      />
                      <span className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup__inputWith_unit">°C</span>
                    </div>
                  </div>

                  <div className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup">
                    <label htmlFor="temperature">Cân nặng</label>
                    <div className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup__inputWith">
                      <input type="text" id="temperature" 
                         value={datasurvivalIndexRender.CanNang? datasurvivalIndexRender.CanNang : ''}
                          onChange={(e) => {
                          setDatasurvivalIndexRender ((prev)=>(
                            {...prev,CanNang : e.target.value}
                          ))
                        }}
                      />
                      <span className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup__inputWith_unit">Kg</span>
                    </div>
                  </div>


                  <div className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup">
                    <label htmlFor="temperature">BMI</label>
                    <div className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup__inputWith">
                      <input type="text" id="temperature" 
                         value={datasurvivalIndexRender.BMI? datasurvivalIndexRender.BMI : ''}
                          onChange={(e) => {
                          setDatasurvivalIndexRender ((prev)=>(
                            {...prev,BMI : e.target.value}
                          ))
                        }}
                      />
                      <span className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup__inputWith_unit">Kg/m2</span>
                    </div>
                  </div>


                  <div className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup">
                    <label htmlFor="temperature">SP02</label>
                    <div className="CreateResults-bodyFrame__vitalSigns__formRow__formGroup__inputWith">
                      <input type="text" id="temperature" 
                          value={datasurvivalIndexRender.SP02? datasurvivalIndexRender.SP02 : ''}
                          onChange={(e) => {
                          setDatasurvivalIndexRender ((prev)=>(
                            {...prev,SP02 : e.target.value}
                          ))
                        }}
                      />
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
                        <textarea  
                          onChange={(e) => {
                            setDiagnosis ((prev) => (
                              {...prev , TrieuChung : e.target.value}
                            ))
                          }}
 
                          value={diagnosis.TrieuChung ? diagnosis.TrieuChung : ''}

                        className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__textInput" rows={3} placeholder="Nhập triệu chứng..."></textarea>
                          <div className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__dots">
                              <span></span>
                              <span></span>
                              <span></span>
                          </div>
                      </div>  
                  </div>

  
                  <div className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection">
                      <div>Chuẩn đoán</div>
                      <div className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__inputArea">
                        <textarea 
                          onChange={(e) => {
                            setDiagnosis ((prev) => (
                              {...prev , ChuanDoanSoBo : e.target.value}
                            ))
                          }}
 
                          value={diagnosis.ChuanDoanSoBo ? diagnosis.ChuanDoanSoBo : ''}
                          className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__textInput" rows={3} placeholder="Nhập chuẩn đoán...">
                        </textarea>
                          <div className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__dots">
                              <span></span>
                              <span></span>
                              <span></span>
                          </div>
                      </div>  

                  </div>


                  <div className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__saveButtonContainer">
                    <button className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__saveButtonContainer__saveButton"
                        onClick={handleSave}
                    >
                      <FaSave className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__saveButtonContainer__saveButton__saveIcon" /> {/* Icon lưu */}
                      Lưu
                    </button>
                  </div>


                </div>
            </div>
       </>
    )
}