"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  TextField,
  InputAdornment,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { FaEye, FaSave } from "react-icons/fa";
import {
  diagnosisType,
  survivalIndexType,
} from "@/app/types/patientTypes/patient";
import {
  addDiagnosis,
  getVitalSignsByExaminationId,
  updateSurvivalIndex,
} from "@/app/services/DoctorSevices";
import { showToast, ToastType } from "@/app/lib/Toast";
import DiagnosisPopup from "@/app/components/diagnosis/DiagnosisPopup";

export default function DiagnosisComponent({ reLoad }: { reLoad: () => void }) {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [datasurvivalIndexRender, setDatasurvivalIndexRender] =
    useState<survivalIndexType>({});
  const [initialSurvivalIndex, setInitialSurvivalIndex] =
    useState<survivalIndexType>({});
  const [diagnosis, setDiagnosis] = useState<diagnosisType>({});

  const getData = async () => {
    const data = await getVitalSignsByExaminationId(id as string);
    if (!data) return showToast("Không có chỉ số sinh tồn", ToastType.error);
    setDatasurvivalIndexRender(data);
    setInitialSurvivalIndex(data);
  };

  const hasSurvivalIndexChanged = () => {
    const keys = Object.keys(
      initialSurvivalIndex || {}
    ) as (keyof survivalIndexType)[];
    for (const key of keys) {
      if (
        initialSurvivalIndex &&
        datasurvivalIndexRender[key] !== initialSurvivalIndex[key]
      ) {
        return true;
      }
    }
    return false;
  };

  const isDiagnosisFilled = Boolean(
    diagnosis.TrieuChung?.trim() || diagnosis.ChuanDoanSoBo?.trim()
  );
  const isSurvivalIndexChanged = hasSurvivalIndexChanged();
  const isSaveEnabled = isDiagnosisFilled || isSurvivalIndexChanged;
  const fields: {
    label: string;
    key: keyof survivalIndexType;
    unit: string;
  }[] = [
    { label: "Nhiệt độ", key: "NhietDo", unit: "°C" },
    { label: "Nhịp thở", key: "NhipTho", unit: "L/P" },
    { label: "Huyết áp", key: "HuyetAp", unit: "mmHg" },
    { label: "Mạch", key: "Mach", unit: "L/P" },
    { label: "Chiều cao", key: "ChieuCao", unit: "cm" },
    { label: "Cân nặng", key: "CanNang", unit: "Kg" },
    { label: "BMI", key: "BMI", unit: "Kg/m2" },
    { label: "SP02", key: "SP02", unit: "%" },
  ];

  const handleSave = async () => {
    const update = await updateSurvivalIndex(
      datasurvivalIndexRender._id as string,
      datasurvivalIndexRender
    );

    if (diagnosis.ChuanDoanSoBo && diagnosis.TrieuChung) {
      const updateDiagnosis = await addDiagnosis(id as string, diagnosis);
      if (updateDiagnosis.data && update.data) {
        showToast("Tạo chuẩn đoán thành công", ToastType.success);
        setDiagnosis({ ChuanDoanSoBo: "", TrieuChung: "" });
        setInitialSurvivalIndex(datasurvivalIndexRender);
        reLoad();
      } else {
        if (!updateDiagnosis.data)
          showToast(updateDiagnosis.message, ToastType.error);
        if (!update.data) showToast(update.message, ToastType.error);
      }
    } else {
      if (update.data) {
        showToast("Lưu chỉ số sinh tồn thành công", ToastType.success);
        setInitialSurvivalIndex(datasurvivalIndexRender);
      } else {
        showToast(update.message, ToastType.error);
      }
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        Chỉ số sinh tồn
      </Typography>

      <Box
        display="grid"
        gap={2}
        gridTemplateColumns={{ xs: "1fr", md: "repeat(4, 1fr)" }}
        mb={4}
      >
        {fields.map(({ label, key, unit }) => (
          <TextField
            key={key}
            label={label}
            value={datasurvivalIndexRender[key] || ""}
            onChange={(e) =>
              setDatasurvivalIndexRender((prev) => ({
                ...prev,
                [key]: e.target.value,
              }))
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">{unit}</InputAdornment>
              ),
            }}
            size="small"
            fullWidth
          />
        ))}
      </Box>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Chẩn đoán sơ bộ</Typography>
        <Button
          variant="outlined"
          startIcon={<FaEye />}
          sx={{ color: "#3497f9", border: "#3497f9 1px solid" }}
          onClick={() => setIsModalOpen(true)}
        >
          Xem chẩn đoán
        </Button>
      </Box>

      <DiagnosisPopup
        id={id as string}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Triệu chứng"
          multiline
          rows={3}
          fullWidth
          value={diagnosis.TrieuChung || ""}
          onChange={(e) =>
            setDiagnosis((prev) => ({ ...prev, TrieuChung: e.target.value }))
          }
        />

        <TextField
          label="Chẩn đoán sơ bộ"
          multiline
          rows={3}
          fullWidth
          value={diagnosis.ChuanDoanSoBo || ""}
          onChange={(e) =>
            setDiagnosis((prev) => ({ ...prev, ChuanDoanSoBo: e.target.value }))
          }
        />
      </Box>

      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          sx={{ backgroundColor: "#00d335" }}
          color="success"
          startIcon={<FaSave />}
          disabled={!isSaveEnabled}
          onClick={handleSave}
        >
          Lưu
        </Button>
      </Box>
    </Box>
  );
}
