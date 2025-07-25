'use client';
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Modal,
  Typography,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
} from '@mui/material';
import { medicalExaminationBook } from '@/app/types/patientTypes/patient';
import { SelectChangeEvent } from '@mui/material/Select';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface PatientInformationComponentProps {
  callBack: () => void;
}

const style = {
  position: 'fixed' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 900,
  bgcolor: 'background.paper',
  borderRadius: '12px',
  p: 6,
  maxHeight: '90vh',
};

export default function PatientInformationUpdateComponent({
  callBack,
}: PatientInformationComponentProps) {
  const [formData, setFormData] = useState<medicalExaminationBook | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof medicalExaminationBook, string>>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedData = sessionStorage.getItem('soKhamBenh');
    if (storedData) {
      try {
        setFormData(JSON.parse(storedData));
      } catch (err) {
        console.error('Error parsing data:', err);
        alert('Không thể tải thông tin bệnh nhân!');
      }
    }
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof medicalExaminationBook, string>> = {};

    if (!formData?.HoVaTen) newErrors.HoVaTen = 'Họ và tên là bắt buộc';
    if (!formData?.GioiTinh) newErrors.GioiTinh = 'Vui lòng chọn giới tính';
    if (!formData?.SoDienThoai) {
      newErrors.SoDienThoai = 'Số điện thoại là bắt buộc';
    } else if (!/^\d{10}$/.test(formData.SoDienThoai)) {
      newErrors.SoDienThoai = 'Số điện thoại phải có 10 số';
    }
    if (!formData?.SoCCCD) {
      newErrors.SoCCCD = 'Số CCCD là bắt buộc';
    } else if (!/^\d{12}$/.test(formData.SoCCCD)) {
      newErrors.SoCCCD = 'Số CCCD phải có 12 số';
    }
    if (!formData?.NgaySinh) newErrors.NgaySinh = 'Ngày sinh là bắt buộc';
    if (!formData?.DiaChi) newErrors.DiaChi = 'Địa chỉ là bắt buộc';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async () => {
    if (!formData) return;
    if (!validateForm()) {
      alert('Vui lòng điền đầy đủ và đúng thông tin!');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/The_Kham_Benh/Edit/${formData._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Lỗi cập nhật thông tin');

      sessionStorage.setItem('soKhamBenh', JSON.stringify(formData));
      callBack();
    } finally {
      setIsLoading(false);
    }
  };

  if (!formData) return (
    <Box className="flex justify-center items-center h-screen">
      <Typography variant="h6" className="text-gray-600">
        Đang tải thông tin bệnh nhân...
      </Typography>
    </Box>
  );

  return (
    <Modal open onClose={callBack}>
      <Box sx={style} className="bg-white">
        <Typography className="text-gray-800 font-semibold" style={{marginBottom:"16px"}} >
          Cập nhật thông tin bệnh nhân
        </Typography>

        <Box className="flex flex-col gap-6">
          <Box className="flex flex-col md:flex-row gap-4">
            <Box className="flex-1">
              <TextField
                fullWidth
                label="Họ và tên"
                name="HoVaTen"
                value={formData.HoVaTen || ''}
                onChange={handleInputChange}
                error={!!errors.HoVaTen}
                helperText={errors.HoVaTen}
                variant="outlined"
                className="rounded-lg"
                InputProps={{
                  className: 'text-gray-700',
                }}
              />
            </Box>
            <Box className="flex-1">
              <FormControl fullWidth error={!!errors.GioiTinh} className="rounded-lg">
                <InputLabel className="text-gray-600">Giới tính</InputLabel>
                <Select
                  name="GioiTinh"
                  value={formData.GioiTinh || ''}
                  onChange={handleSelectChange}
                  label="Giới tính"
                  className="text-gray-700"
                >
                  <MenuItem value="">Chọn giới tính</MenuItem>
                  <MenuItem value="Nam">Nam</MenuItem>
                  <MenuItem value="Nữ">Nữ</MenuItem>
                </Select>
                {errors.GioiTinh && (
                  <Typography variant="caption" color="error" className="mt-1">
                    {errors.GioiTinh}
                  </Typography>
                )}
              </FormControl>
            </Box>
          </Box>

          <Box className="flex flex-col md:flex-row gap-4">
            <Box className="flex-1">
              <TextField
                fullWidth
                label="Số BHYT"
                name="SoBaoHiemYTe"
                value={formData.SoBaoHiemYTe || ''}
                onChange={handleInputChange}
                variant="outlined"
                className="rounded-lg"
                InputProps={{
                  className: 'text-gray-700',
                }}
              />
            </Box>
            <Box className="flex-1">
              <TextField
                fullWidth
                label="Số điện thoại"
                name="SoDienThoai"
                value={formData.SoDienThoai || ''}
                onChange={handleInputChange}
                error={!!errors.SoDienThoai}
                helperText={errors.SoDienThoai}
                variant="outlined"
                className="rounded-lg"
                InputProps={{
                  className: 'text-gray-700',
                }}
              />
            </Box>
          </Box>

          <Box className="flex flex-col md:flex-row gap-4">
            <Box className="flex-1">
              <TextField
                fullWidth
                label="Số CCCD"
                name="SoCCCD"
                value={formData.SoCCCD || ''}
                onChange={handleInputChange}
                error={!!errors.SoCCCD}
                helperText={errors.SoCCCD}
                variant="outlined"
                className="rounded-lg"
                InputProps={{
                  className: 'text-gray-700',
                  readOnly: true,
                }}
                sx={{
      '& .MuiInputBase-input.Mui-disabled': {
        WebkitTextFillColor: '#000000',
      },
      '& .MuiInputBase-root': {
        backgroundColor: '#f0f0f0', // 👈 màu nền khi readonly
      },
    }}
              />
            </Box>
            <Box className="flex-1">
              <TextField
                fullWidth
                label="Ngày sinh"
                name="NgaySinh"
                type="date"
                value={formData.NgaySinh || ''}
                onChange={handleInputChange}
                error={!!errors.NgaySinh}
                helperText={errors.NgaySinh}
                variant="outlined"
                className="rounded-lg"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  className: 'text-gray-700',
                }}
              />
            </Box>
          </Box>

          <Box className="flex flex-col md:flex-row gap-4">
            <Box className="flex-1">
              <TextField
                fullWidth
                label="SĐT người thân"
                name="SDT_NguoiThan"
                value={formData.SDT_NguoiThan || ''}
                onChange={handleInputChange}
                variant="outlined"
                className="rounded-lg"
                InputProps={{
                  className: 'text-gray-700',
                }}
              />
            </Box>
            <Box className="flex-1">
              <TextField
                fullWidth
                label="Địa chỉ"
                name="DiaChi"
                value={formData.DiaChi || ''}
                onChange={handleInputChange}
                error={!!errors.DiaChi}
                helperText={errors.DiaChi}
                variant="outlined"
                className="rounded-lg"
                InputProps={{
                  className: 'text-gray-700',
                }}
              />
            </Box>
          </Box>

          <Box>
            <TextField
              fullWidth
              multiline
              minRows={4}
              label="Lịch sử bệnh"
              name="LichSuBenh"
              value={formData.LichSuBenh || ''}
              onChange={handleInputChange}
              variant="outlined"
              className="rounded-lg"
              InputProps={{
                className: 'text-gray-700',
              }}
            />
          </Box>

          <Box className="flex justify-end gap-4 ">
            <Button
              onClick={callBack}
              variant="outlined"
              className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg px-6 py-2"
            >
              Đóng
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              variant="contained"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2"
            >
              {isLoading ? <CircularProgress size={24} className="text-white" /> : 'Lưu'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}