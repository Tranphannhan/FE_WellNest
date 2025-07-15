'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  TextField,
  Typography,
  Paper,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
} from '@mui/material';
import './MedicineTypeFormLayout.css';
import { FaArrowLeft } from 'react-icons/fa6';
import { FaSave } from 'react-icons/fa';
import BreadcrumbComponent from '@/app/Admin/component/Breadcrumb';

function MedicineTypeFormLayout() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    TenNhomThuoc: '',
    TrangThaiHoatDong: 'true',
  });
  const [message, setMessage] = useState<string>('');
  const [errors, setErrors] = useState<{
    TenNhomThuoc?: string;
  }>({});
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: { TenNhomThuoc?: string } = {};
    if (!formData.TenNhomThuoc.trim()) newErrors.TenNhomThuoc = 'Vui lòng nhập tên loại thuốc';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setErrors({});

    if (!validateForm()) {
      setMessage('Vui lòng kiểm tra các trường thông tin.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/Nhomthuoc/Add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          TenNhomThuoc: formData.TenNhomThuoc.trim(),
          TrangThaiHoatDong: formData.TrangThaiHoatDong === 'true',
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('Thêm mới loại thuốc thành công!');
      } else {
        setMessage(result.message || 'Lỗi khi thêm mới loại thuốc');
      }
    } catch (err) {
      setMessage('Lỗi khi gửi yêu cầu thêm mới');
      console.error(err);
    }
  };

  const handleCancel = () => {
    router.push('/Admin/MedicineType/DrugGroup');
  };

  return (
    <div className="AdminContent-Container">
      <BreadcrumbComponent
        items={[
          { title: "Trang chủ", href: "/Admin" },
          { title: "Kho thuốc", href: "/Admin/Medicine/DrugGroup" },
          { title: "Danh sách nhóm thuốc", href: "/Admin/Medicine/DrugGroup" },
          { title: "Thêm nhóm thuốc" },
        ]}
      />
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ width: '100%' }}>
          <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
            Thêm Mới Loại Thuốc
          </Typography>
          {message && (
            <Box sx={{ mb: 2 }}>
              <div
                className={
                  message.includes('thành công') ? 'message-success' : 'message-error'
                }
              >
                <Alert severity={message.includes('thành công') ? 'success' : 'error'}>
                  {message}
                </Alert>
              </div>
            </Box>
          )}
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 2, width: '60%' }}>
              <TextField
                label="Tên Loại Thuốc"
                name="TenNhomThuoc"
                value={formData.TenNhomThuoc}
                onChange={handleInputChange}
                variant="outlined"
                error={!!errors.TenNhomThuoc}
                helperText={errors.TenNhomThuoc}
              />
              <FormControl component="fieldset">
                <FormLabel component="legend">Trạng Thái</FormLabel>
                <RadioGroup
                  row
                  name="TrangThaiHoatDong"
                  value={formData.TrangThaiHoatDong}
                  onChange={handleSelectChange}
                >
                  <FormControlLabel value="true" control={<Radio />} label="Hiện" />
                  <FormControlLabel value="false" control={<Radio />} label="Ẩn" />
                </RadioGroup>
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
              <button
                type="button"
                className="bigButton--gray"
                onClick={handleCancel}
              >
                <FaArrowLeft style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                Hủy
              </button>
              <button
                type="submit"
                className="bigButton--blue"
              >
                <FaSave style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                Thêm Nhóm Thuốc
              </button>
            </Box>
          </form>
        </Paper>
      </Box>
    </div>
  );
}

export default MedicineTypeFormLayout;