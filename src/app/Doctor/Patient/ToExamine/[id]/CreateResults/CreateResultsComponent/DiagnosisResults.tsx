import './DiagnosisResults.css';
import './Diagnosis.css';
import { FaSave } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { generateTestResultsType } from '@/app/types/patientTypes/patient';
import { createExaminationResults, getExaminationResults } from '@/app/services/DoctorSevices';
import PreviewExaminationResult from '../ComponentResults/ComponentPrintTicket/PreviewExaminationResult';

// Types for Examination Result
interface DiagnosisTreatmentPair {
  diagnosis: string;
  treatmentPlan: string;
  itemNotes?: string;
}

interface ExaminationResultData {
  fullName: string;
  weight: number;
  gender: string;
  dob: string;
  address: string;
  clinic: string;
  diagnosisTreatmentList: DiagnosisTreatmentPair[];
  notes?: string;
}

interface PreviewExaminationResultProps {
  isOpen: boolean;
  onClose: () => void;
  patientData?: ExaminationResultData;
  doctorName?: string;
}

export default function DiagnosisResultsComponent() {
  const { id } = useParams();
  const [statusSave, setStatusSave] = useState<boolean>(false);
  const [isExaminationResultModalOpen, setIsExaminationResultModalOpen] = useState(false);
  const [patientData, setPatientData] = useState<ExaminationResultData | null>(null);
  const [doctorName, setDoctorName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [dataGenerateTestResults, setDataGenerateTestResults] = useState<generateTestResultsType>({
    Id_PhieuKhamBenh: String(id),
    GhiChu: '',
    HuongSuLy: '',
    KetQua: '',
  });

  // Load session and database data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      // 1. Fetch session data
      const sessionData = sessionStorage.getItem('ThongTinBenhNhanDangKham');
      if (!sessionData) {
        setError('Không tìm thấy thông tin bệnh nhân trong session.');
        setLoading(false);
        return;
      }

      try {
        const parsedData = JSON.parse(sessionData);

        // 2. Map session data to ExaminationResultData
        const patientInfo: ExaminationResultData = {
          fullName: parsedData.Id_TheKhamBenh.HoVaTen || 'Không xác định',
          weight: parsedData.Id_TheKhamBenh.CanNang || 0, // Adjust if weight is available
          gender: parsedData.Id_TheKhamBenh.GioiTinh || 'Không xác định',
          dob: parsedData.Id_TheKhamBenh.NgaySinh || 'Không xác định',
          address: parsedData.Id_TheKhamBenh.DiaChi || 'Không xác định',
          clinic: parsedData.Id_Bacsi.Id_PhongKham?.SoPhongKham || 'Không xác định',
          diagnosisTreatmentList: [], // Will be populated from database
          notes: parsedData.LyDoDenKham || '', // Use LyDoDenKham as fallback notes
        };

        // 3. Set doctor name
        const doctor = parsedData.Id_Bacsi?.TenBacSi || 'Không xác định';

        // 4. Fetch examination results from database
        try {
          const examinationData = await getExaminationResults(String(id));
          if (examinationData) {
            setDataGenerateTestResults(examinationData);
            // Map examination data to diagnosisTreatmentList
            patientInfo.diagnosisTreatmentList = [
              {
                diagnosis: examinationData.KetQua || 'Không có chẩn đoán',
                treatmentPlan: examinationData.HuongSuLy || 'Không có hướng xử lý',
                itemNotes: examinationData.GhiChu || '',
              },
            ];
            patientInfo.notes = examinationData.GhiChu || patientInfo.notes;
          }
        } catch (err) {
          console.error('Error fetching examination results:', err);
          setError('Không thể tải kết quả khám từ cơ sở dữ liệu.');
        }

        // 5. Update state
        setPatientData(patientInfo);
        setDoctorName(doctor);
      } catch (err) {
        console.error('Error parsing session data:', err);
        setError('Dữ liệu session không hợp lệ.');
      }

      setLoading(false);
    };

    loadData();
  }, [id]);

  // Check input for save button
  useEffect(() => {
    if (
      dataGenerateTestResults.GhiChu?.trim() !== '' &&
      dataGenerateTestResults.HuongSuLy?.trim() !== '' &&
      dataGenerateTestResults.KetQua?.trim() !== ''
    ) {
      setStatusSave(true);
    } else {
      setStatusSave(false);
    }
  }, [dataGenerateTestResults]);

  const handleSave = async () => {
    try {
      const result = await createExaminationResults(dataGenerateTestResults);
      console.log('Save successful:', result);
      // Optionally reload data to reflect changes
      const examinationData = await getExaminationResults(String(id));
      if (examinationData && patientData) {
        setDataGenerateTestResults(examinationData);
        setPatientData({
          ...patientData,
          diagnosisTreatmentList: [
            {
              diagnosis: examinationData.KetQua || 'Không có chẩn đoán',
              treatmentPlan: examinationData.HuongSuLy || 'Không có hướng xử lý',
              itemNotes: examinationData.GhiChu || '',
            },
          ],
          notes: examinationData.GhiChu || patientData.notes,
        });
      }
    } catch (err) {
      console.error('Error saving examination results:', err);
      setError('Không thể lưu kết quả khám.');
    }
  };

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  return (
    <div className="DiagnosisResults-Body">
      <button
        onClick={() => setIsExaminationResultModalOpen(true)}
        className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-200"
      >
        Xem trước Phiếu Kết Quả Khám
      </button>
      <div className="DiagnosisResults-Container">
        <span className="DiagnosisResults-Body__Title">Tạo kết quả khám</span>

        {/* Ô Kết quả */}
        <div className="DiagnosisResults-createResultsRow">
          <div className="DiagnosisResults-createResultsRow__create__Column">
            <div style={{ font: '24px', color: '#696969', marginLeft: '10px', fontWeight: '600' }}>Kết quả</div>
            <div className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__inputArea">
              <textarea
                className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__textInput"
                rows={3}
                placeholder="Nhập kết quả ..."
                onChange={(e) =>
                  setDataGenerateTestResults((prev) => ({
                    ...prev,
                    KetQua: e.target.value,
                  }))
                }
                value={dataGenerateTestResults.KetQua}
              />
              <div className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>

          {/* Ô Ghi chú */}
          <div className="DiagnosisResults-createResultsRow__create__Column">
            <div style={{ font: '24px', color: '#696969', marginLeft: '10px', fontWeight: '600' }}>Ghi chú</div>
            <div className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__inputArea">
              <textarea
                className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__textInput"
                rows={3}
                placeholder="Nhập ghi chú..."
                onChange={(e) =>
                  setDataGenerateTestResults((prev) => ({
                    ...prev,
                    GhiChu: e.target.value,
                  }))
                }
                value={dataGenerateTestResults.GhiChu}
              />
              <div className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__dots">
                <span></span>
                <span></span>
                <span></span>
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
              onChange={(e) =>
                setDataGenerateTestResults((prev) => ({
                  ...prev,
                  HuongSuLy: e.target.value,
                }))
              }
              value={dataGenerateTestResults.HuongSuLy}
            />
            <div className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__FormSection__dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Nút Lưu */}
      <div className="DiagnosisResults-Body__Button">
        <button
          style={{
            background: statusSave ? '#28a745' : 'rgb(207, 207, 207)',
            pointerEvents: statusSave ? 'auto' : 'none',
            cursor: statusSave ? 'pointer' : 'not-allowed',
          }}
          onClick={handleSave}
          className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__saveButtonContainer__saveButton"
        >
          Lưu
          <FaSave className="CreateResults-bodyFrame__formVitalSigns__DiagnosisContainer__saveButtonContainer__saveButton__saveIcon" />
        </button>
      </div>

      {isExaminationResultModalOpen && patientData && (
        <PreviewExaminationResult
          isOpen={isExaminationResultModalOpen}
          onClose={() => setIsExaminationResultModalOpen(false)}
          patientData={patientData}
          doctorName={doctorName}
        />
      )}
    </div>
  );
}