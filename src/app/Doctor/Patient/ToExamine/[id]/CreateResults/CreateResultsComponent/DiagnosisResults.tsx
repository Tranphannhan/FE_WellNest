import './DiagnosisResults.css';
import './Diagnosis.css';
import { FaSave } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { generateTestResultsType } from '@/app/types/patientTypes/patient';
import { createExaminationResults, getDoctorTemporaryTypes, getExaminationResults } from '@/app/services/DoctorSevices';
import PreviewExaminationResult from '../ComponentResults/ComponentPrintTicket/PreviewExaminationResult';
import { BsFillPrinterFill } from 'react-icons/bs';
import DoNotContinue from '@/app/components/ui/DoNotContinue/DoNotContinue';
import { Box, TextField, Button } from '@mui/material';


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


export default function DiagnosisResultsComponent({reLoad, allowsGeneratingResults}:{reLoad:()=>void, allowsGeneratingResults:boolean}) {
  const { id } = useParams();
  const [statusSave, setStatusSave] = useState<boolean>(false);
  const [isExaminationResultModalOpen, setIsExaminationResultModalOpen] = useState(false);
  const [patientData, setPatientData] = useState<ExaminationResultData | null>(null);
  const [doctorName, setDoctorName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [printingIsAllowed, setPrintingIsAllowed] = useState<boolean>(false);

  const [dataGenerateTestResults, setDataGenerateTestResults] = useState<generateTestResultsType>({
    Id_PhieuKhamBenh: String(id),
    GhiChu: '',
    HuongSuLy: '',
    KetQua: '',
  });

    const [continueRender, setContinueRender] = useState <boolean>(false)
    const checkRender = async() =>{
        // const data  = await latestDiagnosis(id as string)
        // console.log(data)
        // if(data.continueRender){
        //   setContinueRender(true)
        // }

              const result = await getDoctorTemporaryTypes(id as string);
              if (!result || !Array.isArray(result)) {
                console.error("Không tìm thấy dữ liệu cận lâm sàng");
                return;
              }
              const isTrue = result.length > 0 && result.every(item => item.TrangThai === true);

              console.log('dữ liệu xét nghiệm', isTrue)
              if(isTrue){
                  setContinueRender(true)
              }
        
    }

  useEffect(() => {
    checkRender()
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
            if(examinationData.KetQua !== '' && examinationData.HuongSuLy !=='' && examinationData.GhiChu !=='' && examinationData.TrangThaiHoanThanh){
              setPrintingIsAllowed(true)
            }
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
      // Optionally reload data to reflect 
      reLoad()
      const examinationData = await getExaminationResults(String(id));
      if (examinationData && patientData) {
        setPrintingIsAllowed(true)
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
        disabled={!printingIsAllowed}
        style={printingIsAllowed?{

        }:{
          color:'gray',
          border:'1px solid gray'
          ,
          cursor:'not-allowed'
        }}
        className="DiagnosisResults-printBtn"
      >
        <BsFillPrinterFill /> Kết quả
      </button>
        {continueRender || allowsGeneratingResults ?  <>
    {/* Vùng nhập dữ liệu kết quả khám */}
    <Box p={2} display="flex" flexDirection="column" gap={3}>
      {/* Kết quả & Ghi chú */}
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
        <TextField
          label="Kết quả"
          multiline
          rows={3}
          fullWidth
          value={dataGenerateTestResults.KetQua}
          onChange={(e) =>
            setDataGenerateTestResults((prev) => ({
              ...prev,
              KetQua: e.target.value,
            }))
          }
        />

        <TextField
          label="Ghi chú"
          multiline
          rows={3}
          fullWidth
          value={dataGenerateTestResults.GhiChu}
          onChange={(e) =>
            setDataGenerateTestResults((prev) => ({
              ...prev,
              GhiChu: e.target.value,
            }))
          }
        />
      </Box>

      {/* Hướng xử lý */}
      <TextField
        label="Hướng xử lý"
        multiline
        rows={3}
        fullWidth
        value={dataGenerateTestResults.HuongSuLy}
        onChange={(e) =>
          setDataGenerateTestResults((prev) => ({
            ...prev,
            HuongSuLy: e.target.value,
          }))
        }
      />

      {/* Nút lưu */}
      <Box textAlign="right">
        <Button
          variant="contained"
             sx={{backgroundColor:'#00d335'}}
          color="success"
          startIcon={<FaSave />}
          onClick={handleSave}
          disabled={!statusSave}
        >
          Lưu
        </Button>
      </Box>
    </Box>
  </>:<DoNotContinue
              message="Không thể tạo kết quả"
            remind="Vui lòng chỉ định lâm sàng hoặc bỏ qua để tiếp tục"
        ></DoNotContinue>}

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