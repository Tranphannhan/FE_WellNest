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
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import ClinicalExamPage from "./ComponentResults/CreateClinicalExam";
import { CheckPrescription, confirmCompletion, fetchMedicalExaminationCardDetail, getExaminationResults, latestDiagnosis } from "@/app/services/DoctorSevices";
import { generateTestResultsType, MedicalExaminationCard } from "@/app/types/patientTypes/patient";
import ModalComponent from "@/app/components/shared/Modal/Modal";




export default function Patient(){
    const [page , setPage] = useState <string> ('Chuẩn đoán sơ bộ');
    const [showPrescriptionPopup,setShowPrescriptionPopup] = useState<boolean>(false)
    const [prescriptionStep, setPrescriptionStep] = useState(1); // New state to control PrescriptionPopup step
    const [paraclinicalKey, setParaclinicalKey] = useState(0);
    const [isPrescriptionCreating, setIsPrescriptionCreating] = useState(false);
    const [prescriptionComponentKey,setprescriptionComponentKey] = useState(0);
    const [beFinished, setBeFinished] = useState <boolean>(false);
    const [showModalCompletion, setShowModalCompletion] = useState <boolean>(false)
    const router = useRouter()
    
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

    const checkPrescription = async()=>{
         const resCheckPrescription = await CheckPrescription(id as string);
         console.log('đơn thuốc:',resCheckPrescription)
         if(resCheckPrescription && resCheckPrescription.data?.data?.TrangThai==='DaXacNhan'){
            setBeFinished(true)
         }
    }

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

    const [continueRender, setContinueRender] = useState <boolean>(false)
    const checkRender = async() =>{
            const data  = await latestDiagnosis(id as string)
            console.log(data)
            if(data.continueRender){
              setContinueRender(true)
            }
            
    }

          const [continueRenderExaminationResults, setContinueRenderExaminationResults] = useState <boolean>(false)
          const checkRenderContinueExaminationResults = async() =>{
              const data:generateTestResultsType |null = await getExaminationResults(id as string)
              if(data && data.TrangThaiHoanThanh){
                setContinueRenderExaminationResults(true)
              }
              
          }

    const HandleConfirmCompletion = async() =>{
        const res =await confirmCompletion(id as string)
        if(res){
            router.push('http://localhost:3000/Doctor/Patient')
        }
    }

    // Effects to run on component mount
    useEffect(()=>{
        getValueRender();
        checkRender();
        checkRenderContinueExaminationResults();
        checkPrescriptionStatus();
        checkPrescription();
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
                            onClick={() => setShowPrescriptionPopup(true)}
                            disabled={!continueRenderExaminationResults || isPrescriptionCreating}
                            style={{
                                borderRadius:'8px',
                                cursor: !continueRenderExaminationResults || isPrescriptionCreating ? 'not-allowed' : 'pointer',
                                color: !continueRenderExaminationResults || isPrescriptionCreating ? '#cacaca' : undefined,
                                border: '1px solid ' + (!continueRenderExaminationResults || isPrescriptionCreating ? '#cacaca' : ''), // hoặc undefined
                                backgroundColor: !continueRenderExaminationResults || isPrescriptionCreating ? '#f5faff' : undefined,
                            }}
                            >
                            + Tạo đơn thuốc
                        </button>

                        <button className="CreateResults-redirectFrame__actionButtonsContainer__buttonOutline"
                            disabled={!continueRender}
                            style={!continueRender ? {
                                borderRadius:'8px',
                                color:'#cacaca',
                                border:'#cacaca 1px solid',
                                cursor:'not-allowed',
                                backgroundColor:'#f5faff',
                            }:{
                                cursor: 'pointer',
                                borderRadius:'8px',
                            }}
                            onClick={handleOpenExaminationRequestPopup}
                        >+ Tạo yêu cầu xét nghiệm</button>
                    </div>

                    
                    <div className="CreateResults-redirectFrame__actionButtonsContainer__rightButtons">
                        {
                            WaitClinicalExamination && (
                                <button style={{display : 'block',
                                    borderRadius:'8px',
                                }}
                                    className="CreateResults-redirectFrame__actionButtonsContainer__buttonSolid"
                                    onClick={handleOpenResultsPopup}
                                >
                                    Xem kết quả xét nghiệm
                                </button>
                            )
                        }

                        <button className="CreateResults-redirectFrame__actionButtonsContainer__buttonSolid"
                            disabled={false}
                            style={{
                                backgroundColor:'gray',
                                cursor:'not-allowed',
                                borderRadius:'8px',
                            }}
                        >Yêu cầu chuyển khoa</button>
                        <button className="CreateResults-redirectFrame__actionButtonsContainer__buttonSolid"
                            disabled={!beFinished}
                            onClick={()=>setShowModalCompletion(true)}
                            style={!beFinished?{backgroundColor:'gray',cursor:'not-allowed',borderRadius:'8px'
                                
                                }:{
                                borderRadius:'8px'
                            }}
                        >Hoàn thành khám</button>
                    </div>
                </div>
            </div>

        
            <div className="CreateResults-bodyFrame">
                <div className="CreateResults-bodyFrame__navigationBar">
                    <Diagnosiscomponent handlePage={setPage} page={page} />
                </div>

                <div>
                    {page === 'Chuẩn đoán sơ bộ' && <DiagnosisComponent reLoad={()=>{
                        checkRender()
                    }} />}
                </div>

                <div>
                    {page === 'Cận lâm sàng' && <ParaclinicalComponent key={paraclinicalKey}/>}
                </div>

                <div>
                    {page === 'Chuẩn đoán kết quả' && <DiagnosisResultsComponent reLoad={checkRenderContinueExaminationResults}/>}
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
            <ModalComponent Data_information={{
                callBack:HandleConfirmCompletion,
                content:'Xác nhận kết thúc khám',
                remid:'Kết thúc khám sẽ trở về danh sách bệnh nhân',
                show:showModalCompletion,
                handleClose:()=>{setShowModalCompletion(false)},
                handleShow:()=>{setShowModalCompletion(true)}
            }}></ModalComponent>
        </>
    )
}
