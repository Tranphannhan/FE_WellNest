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
import { useSearchParams } from 'next/navigation';



export default function Patient(){
    const [page , setPage] = useState <string> ('Chuẩn đoán sơ bộ');
    const [showPrescriptionPopup,setShowPrescriptionPopup] = useState<boolean>(false)
    const handleClose = ()=>{setShowPrescriptionPopup(false)}


    // ---
    const searchParams = useSearchParams();
    const WaitClinicalExamination = searchParams.get('WaitClinicalExamination') === 'true';
    console.log('trạng thái : ' + WaitClinicalExamination );

    

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

    return(
        <>  
          <Tabbar
            tabbarItems={{
              tabbarItems: [
                { text: 'Thông tin bệnh nhân', link: '/Doctor/Patient/ToExamine' },
                { text: 'Tạo kết quả', link: '/Doctor/Patient/ToExamine/CreateResults' },
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
                    <button className="CreateResults-redirectFrame__actionButtonsContainer__buttonOutline">+ Tạo yêu cầu xét nghiệm</button>
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
 

            <div style={{display : page == 'Chuẩn đoán sơ bộ' ? 'block' : 'none'}}>
              <DiagnosisComponent />
            </div>

            <div style={{display : page == 'Cận lâm sàng' ? 'block' : 'none'}}>
              <ParaclinicalComponent/>
            </div>

            <div style={{display : page == 'Chuẩn đoán kết quả' ? 'block' : 'none'}}>
              <DiagnosisResultsComponent/>
            </div>

            <div style={{display : page == 'Đơn thuốc' ? 'block' : 'none'}}>
              <PrescriptionComponent/>
            </div>
          </div> 

          {showResultsPopup && <ViewParaclinicalResults  onClose={handleCloseResultsPopup} />}
                
        </>

        
    )
}