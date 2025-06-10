"use client"; 
import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import './CreateResults.css';
import Diagnosiscomponent from "./Diagnosis.component";
import DiagnosisComponent from "./CreateResultsComponent/Diagnosis";
import ParaclinicalComponent from "./CreateResultsComponent/Paraclinical";
import DiagnosisResultsComponent from "./CreateResultsComponent/DiagnosisResults";
import PrescriptionComponent from "./CreateResultsComponent/Prescription";
import { useState } from 'react';


export default function Patient(){
    const [page , setPage] = useState <string> ('Chuẩn đoán sơ bộ');

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


          <div className="CreateResults-redirectFrame">
              <div className="CreateResults-redirectFrame__actionButtonsContainer">
                <div className="CreateResults-redirectFrame__actionButtonsContainer__leftButtons">
                    <button className="CreateResults-redirectFrame__actionButtonsContainer__buttonOutline">+ Tạo đơn thuốc</button>
                    <button className="CreateResults-redirectFrame__actionButtonsContainer__buttonOutline">+ Tạo yêu cầu xét nghiệm</button>
                </div>
                
                <div className="CreateResults-redirectFrame__actionButtonsContainer__rightButtons">
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
        </>

        
    )
}