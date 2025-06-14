"use client"; 
import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import './CreateResults.css';
import Diagnosiscomponent from "./Diagnosis.component";
import DiagnosisComponent from "./CreateResultsComponent/Diagnosis";
import ParaclinicalComponent from "./CreateResultsComponent/Paraclinical";
import DiagnosisResultsComponent from "./CreateResultsComponent/DiagnosisResults";
import PrescriptionComponent from "./CreateResultsComponent/Prescription";
import { useState } from 'react';
import ViewParaclinicalResults from "./CreateResultsComponent/ViewParaclinicalResults";
import PrescriptionPopup from "./ComponentResults/CreatePrescriptionPopup";
import { useParams, useSearchParams } from 'next/navigation';
import ClinicalExamPage from "./ComponentResults/CreateClinicalExam";



export default function Patient(){
    const [page , setPage] = useState <string> ('Chuẩn đoán sơ bộ');
    const [showPrescriptionPopup,setShowPrescriptionPopup] = useState<boolean>(false)
    const handleClose = ()=>{setShowPrescriptionPopup(false)}
    const { id } = useParams(); // lấy id từ URL


    // ---
    const searchParams = useSearchParams();
    const WaitClinicalExamination = searchParams.get('WaitClinicalExamination') === 'true';



    // Khai báo state trực tiếp trong component cha
    const [showResultsPopup, setShowResultsPopup] = useState(false); // Mặc định là false (ẩn)

    // Hàm để mở popup
    const handleOpenResultsPopup = () => {
        setShowResultsPopup(true);
    };

    // Hàm để đóng popup
    const handleCloseResultsPopup = () => {
        setShowResultsPopup(false);
    };

    const [showExaminationRequestPopup, setShowExaminationRequestPopup] = useState(false);
    const handleOpenExaminationRequestPopup = () => {
        setShowExaminationRequestPopup(true);
    };
    const handleCloseExaminationRequestPopup = () => {
        setShowExaminationRequestPopup(false);
    };

    return(
        <>  
          <Tabbar
            tabbarItems={{
              tabbarItems: [
                { text: 'Thông tin bệnh nhân', link: `/Doctor/Patient/ToExamine/${id}${WaitClinicalExamination?'?WaitClinicalExamination=true':''}` },
                { text: 'Tạo kết quả', link: `/Doctor/Patient/ToExamine/${id}/CreateResults` },
              ],
            }}
          />


          <PrescriptionPopup showPrescriptionPopup={showPrescriptionPopup} handleClosePrescriptionPopup ={handleClose} ></PrescriptionPopup>
          <div className="CreateResults-redirectFrame">
              <div className="CreateResults-redirectFrame__actionButtonsContainer">
                <div className="CreateResults-redirectFrame__actionButtonsContainer__leftButtons">
                    <button className="CreateResults-redirectFrame__actionButtonsContainer__buttonOutline"
                      onClick={()=>{setShowPrescriptionPopup(true)}}
                    >+ Tạo đơn thuốc</button>
                    <button className="CreateResults-redirectFrame__actionButtonsContainer__buttonOutline"
                    onClick={handleOpenExaminationRequestPopup}
                    >+ Tạo yêu cầu xét nghiệm</button>
                </div>

                
                <div className="CreateResults-redirectFrame__actionButtonsContainer__rightButtons">
                  {
                    WaitClinicalExamination && (
                      <button style={{display : 'block'}}
                            className="CreateResults-redirectFrame__actionButtonsContainer__buttonSolid"
                            onClick={handleOpenResultsPopup}
                      >
                      Xem kết quả xét nghiệm
                      </button>
                    )
                  }

                  <button className="CreateResults-redirectFrame__actionButtonsContainer__buttonSolid">Yêu cầu chuyển khoa</button>
                  <button className="CreateResults-redirectFrame__actionButtonsContainer__buttonSolid">Xác nhận khám</button>
                </div>
            </div>
          </div>

    
            <div className="CreateResults-bodyFrame">
              <div className="CreateResults-bodyFrame__navigationBar">
                <Diagnosiscomponent handlePage={setPage} />
              </div>

              <div>
                {page === 'Chuẩn đoán sơ bộ' && <DiagnosisComponent />}
              </div>

              <div>
                {page === 'Cận lâm sàng' && <ParaclinicalComponent />}
              </div>

              <div>
                {page === 'Chuẩn đoán kết quả' && <DiagnosisResultsComponent />}
              </div>

              <div>
                {page === 'Đơn thuốc' && <PrescriptionComponent />}
              </div>
            </div>


          {showResultsPopup && <ViewParaclinicalResults  onClose={handleCloseResultsPopup} />}
          <ClinicalExamPage open={showExaminationRequestPopup} onClose={handleCloseExaminationRequestPopup} />
        </>

        
    )
}