'use client'; 
import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import './CreateResults.css';
import Diagnosiscomponent from "./Diagnosis.component";
import DiagnosisComponent from "./CreateResultsComponent/Diagnosis";
import ParaclinicalComponent from "./CreateResultsComponent/Paraclinical";
import DiagnosisResultsComponent from "./CreateResultsComponent/DiagnosisResults";
import PrescriptionComponent from "./CreateResultsComponent/Prescription";
import { useEffect, useState } from 'react';
import ViewParaclinicalResults from "./CreateResultsComponent/ViewParaclinicalResults";
import PrescriptionPopup from "./ComponentResults/CreatePrescriptionPopup";
import { useParams, useSearchParams } from 'next/navigation';
import ClinicalExamPage from "./ComponentResults/CreateClinicalExam";
import { CheckPrescription, fetchMedicalExaminationCardDetail } from "@/app/services/DoctorSevices";
import { MedicalExaminationCard } from "@/app/types/patientTypes/patient";



export default function Patient(){
    const [page , setPage] = useState <string> ('Chuẩn đoán sơ bộ');
    const [showPrescriptionPopup,setShowPrescriptionPopup] = useState<boolean>(false)
    const [prescriptionStep, setPrescriptionStep] = useState(1); // New state to control PrescriptionPopup step
    const [paraclinicalKey, setParaclinicalKey] = useState(0);
    const [isPrescriptionCreating, setIsPrescriptionCreating] = useState(false);
    const [prescriptionComponentKey,setprescriptionComponentKey] = useState(0)
    
    // Function to close the prescription popup and reset its step
    const handleClosePrescriptionPopup = () => {
        setShowPrescriptionPopup(false);
        setPrescriptionStep(1); // Reset step to 1 when closing the popup
    };

    const { id } = useParams(); // Get ID from URL

    // ---
    const searchParams = useSearchParams();
    const WaitClinicalExamination = searchParams.get('WaitClinicalExamination') === 'true';

    // State and handlers for viewing paraclinical results popup
    const [showResultsPopup, setShowResultsPopup] = useState(false);
    const handleOpenResultsPopup = () => {
        setShowResultsPopup(true);
    };
    const handleCloseResultsPopup = () => {
        setShowResultsPopup(false);
    };

    // Function to check prescription status and update state
    async function checkPrescriptionStatus() {
        const resCheck = await CheckPrescription(id as string);
        if (resCheck && !resCheck.status) {
            // If a prescription is being created, disable the button
            setIsPrescriptionCreating(true);
            if (resCheck.data?._id) {
                sessionStorage.setItem("DonThuocDaTao", JSON.stringify(resCheck.data));
            }
        } else {
            setIsPrescriptionCreating(false);
            sessionStorage.removeItem("DonThuocDaTao");
        }
    }

    // State and handlers for examination request popup
    const [showExaminationRequestPopup, setShowExaminationRequestPopup] = useState(false);
    const handleOpenExaminationRequestPopup = () => {
        setShowExaminationRequestPopup(true);
    };
    const handleCloseExaminationRequestPopup = () => {
        setShowExaminationRequestPopup(false);
    };

    // Function to fetch medical examination card details
    async function getValueRender() {
        const res: MedicalExaminationCard | null = await fetchMedicalExaminationCardDetail(id as string);
        if (res) {
            console.log(res);
            sessionStorage.setItem("ThongTinBenhNhanDangKham", JSON.stringify(res));
        } else {
            console.warn("Không lấy được dữ liệu chi tiết phiếu khám bệnh.");
        }
    }

    // Handler for the "+ Thêm thuốc" button in SelectedMedicineComponent
    const handleAddMedicineFromTable = () => {
        setShowPrescriptionPopup(true); // Open the prescription popup
        setPrescriptionStep(3); // Set step directly to 3 (Chọn thuốc)
    };

    // Effects to run on component mount
    useEffect(()=>{
        getValueRender();
        checkPrescriptionStatus();
    },[prescriptionComponentKey]);

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

            {/* Prescription Popup, now controlled by prescriptionStep */}
            <PrescriptionPopup 
                PrescriptionInfo={
                  { Id_PhieuKhamBenh:id as string ,
                   
                  }
              } 
                showPrescriptionPopup={showPrescriptionPopup} 
                handleClosePrescriptionPopup={handleClosePrescriptionPopup} 
                step={prescriptionStep} // Pass the step state
                setStep={setPrescriptionStep} // Pass the setStep function
                reload ={()=>setprescriptionComponentKey(prev => prev + 1)}

            />

            <div className="CreateResults-redirectFrame">
                <div className="CreateResults-redirectFrame__actionButtonsContainer">
                    <div className="CreateResults-redirectFrame__actionButtonsContainer__leftButtons">
                        <button
                            className="CreateResults-redirectFrame__actionButtonsContainer__buttonOutline"
                            onClick={() => setShowPrescriptionPopup(true)} // This button opens popup at step 1
                            disabled={isPrescriptionCreating}
                            style={{
                                opacity: isPrescriptionCreating ? 0.5 : 1,
                                cursor: isPrescriptionCreating ? 'not-allowed' : 'pointer',
                                color: isPrescriptionCreating ? 'gray' : undefined,
                                border: isPrescriptionCreating ? '1px solid gray' : undefined,
                                backgroundColor: isPrescriptionCreating ? '#f5f5f5' : undefined,
                                pointerEvents: isPrescriptionCreating ? 'none' : 'auto', 
                            }}
                        >
                            + Tạo đơn thuốc
                        </button>

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
                    <Diagnosiscomponent handlePage={setPage} page={page} />
                </div>

                <div>
                    {page === 'Chuẩn đoán sơ bộ' && <DiagnosisComponent />}
                </div>

                <div>
                    {page === 'Cận lâm sàng' && <ParaclinicalComponent key={paraclinicalKey}/>}
                </div>

                <div>
                    {page === 'Chuẩn đoán kết quả' && <DiagnosisResultsComponent />}
                </div>

                <div>
                    {/* Pass the new handler to PrescriptionComponent */}
                    {page === 'Đơn thuốc' && 
                    <PrescriptionComponent 
                        onAddMedicineClick={handleAddMedicineFromTable} 
                        key={prescriptionComponentKey} 
                        reload={()=>{setprescriptionComponentKey(prev => prev+1)}}/> }
                </div>
            </div>

            {showResultsPopup && <ViewParaclinicalResults onClose={handleCloseResultsPopup} />}
            <ClinicalExamPage 
                open={showExaminationRequestPopup} 
                onClose={handleCloseExaminationRequestPopup} 
                reload={() => setParaclinicalKey(prev => prev + 1)} 
                callback={() => setPage('Cận lâm sàng')} 
            />
        </>
    )
}
