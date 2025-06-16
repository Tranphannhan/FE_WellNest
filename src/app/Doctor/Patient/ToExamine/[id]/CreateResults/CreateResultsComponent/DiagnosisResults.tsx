
import './DiagnosisResults.css';
import './Diagnosis.css';   
import { FaSave } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { generateTestResultsType } from '@/app/types/patientTypes/patient';
import { createExaminationResults, getExaminationResults } from '@/app/services/DoctorSevices';

export default function DiagnosisResultsComponent() {
    const { id } = useParams();
    const [statusSave, setStatusSave] = useState<boolean>(false); // Mặc định là không cho lưu
    const [dataGenerateTestResults, setDataGenerateTestResults] = useState<generateTestResultsType>({
        Id_PhieuKhamBenh: String(id),
        GhiChu: '',
        HuongSuLy: '',
        KetQua: ''
    });


    const loaddingApi = async () => {
        const data = await getExaminationResults (String (id));
        console.log(data);
        if (!data) return;
        setDataGenerateTestResults (data)
    }


    useEffect (() => {
        loaddingApi ();

    }, []);


    // Check input mỗi khi data thay đổi
    useEffect(() => {

        if (
            dataGenerateTestResults.GhiChu?.trim() !== '' &&
            dataGenerateTestResults.HuongSuLy?.trim() !== '' &&
            dataGenerateTestResults.KetQua?.trim() !== ''
        ) {
            setStatusSave(true); // Cho phép lưu khi đã nhập đủ
        } else {
            setStatusSave(false); // Không cho lưu khi thiếu
        }
    }, [dataGenerateTestResults]);



    const handleSave = async () => {
        const result = await createExaminationResults(dataGenerateTestResults);
        console.log(result);
    }

    return (
        <div className="DiagnosisResults-Body">
            <div className="DiagnosisResults-Container">
                <span className='DiagnosisResults-Body__Title'>Tạo kết quả khám</span>

                {/* Ô Kết quả */}
                <div className="DiagnosisResults-createResultsRow">
                    <div className="DiagnosisResults-createResultsRow__create__Column">
                        <div style={{ font: '24px', color: '#696969', marginLeft: '10px', fontWeight: '600' }}>Kết quả</div>
                        <div className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__inputArea">
                            <textarea
                                className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__textInput"
                                rows={3} placeholder="Nhập kết quả ..."
                                onChange={(e) => {
                                    setDataGenerateTestResults((prev) => ({
                                        ...prev, KetQua: e.target.value
                                    }))
                                }}

                                value={dataGenerateTestResults.KetQua}
                            />
                            <div className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__dots">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    </div>

                    {/* Ô Ghi chú */}
                    <div className="DiagnosisResults-createResultsRow__create__Column">
                        <div style={{ font: '24px', color: '#696969', marginLeft: '10px', fontWeight: '600' }}>Ghi chú </div>
                        <div className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__inputArea">
                            <textarea
                                className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__textInput"
                                rows={3} placeholder="Nhập ghi chú..."
                                onChange={(e) => {
                                    setDataGenerateTestResults((prev) => ({
                                        ...prev, GhiChu: e.target.value
                                    }))
                                }}

                                  value={dataGenerateTestResults.GhiChu}
                            />
                            <div className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__dots">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ô Hướng xử lý */}
                <div className="DiagnosisResults-Body__create__footer">
                    <div style={{ font: '24px', color: '#696969', marginLeft: '10px', fontWeight: '600' }}>Hướng xử lý</div>
                    <div className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__inputArea">
                        <textarea
                            className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__textInput"
                            rows={3}
                            placeholder="Nhập hướng xử lý..."
                            onChange={(e) => {
                                setDataGenerateTestResults((prev) => ({
                                    ...prev, HuongSuLy: e.target.value
                                }))
                            }}

                              value={dataGenerateTestResults.HuongSuLy}
                        />
                        <div className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__dots">
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Nút Lưu */}
            <div className='DiagnosisResults-Body__Button'>
                <button
                    style={{
                        background: statusSave ? '#28a745' : 'rgb(207, 207, 207)',
                        pointerEvents: statusSave ? 'auto' : 'none',
                        cursor: statusSave ? 'pointer' : 'not-allowed'
                    }}
                    onClick={handleSave}
                    className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__saveButtonContainer__saveButton"
                >
                    Lưu
                    <FaSave className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__saveButtonContainer__saveButton__saveIcon" />
                </button>
            </div>
        </div>
    )
}
