'use client';
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent,
  Alert,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import './TestPriceForm.css';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa6';
import { FaSave } from 'react-icons/fa';
import BreadcrumbComponent from '@/app/Admin/component/Breadcrumb';
import API_BASE_URL from "@/app/config";

export interface ApiError {
  message?: string;
}

export default function AddTestPriceForm() {
  const [price, setPrice] = useState<string>('');
  const [priceType, setPriceType] = useState<string>('GiaXetNghiem');
  const [status, setStatus] = useState<string>('Hien');
  const [serviceName, setServiceName] = useState<string>('');
  const [errors, setErrors] = useState<{ serviceName?: string; price?: string }>({});
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setPrice(value);
      setErrors((prev) => ({ ...prev, price: undefined }));
    }
  };

  const handlePriceTypeChange = (e: SelectChangeEvent<string>) => {
    setPriceType(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(e.target.value);
  };

  const handleServiceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setServiceName(e.target.value);
    setErrors((prev) => ({ ...prev, serviceName: undefined }));
  };

  const validateForm = () => {
    const newErrors: { serviceName?: string; price?: string } = {};
    if (!serviceName.trim()) newErrors.serviceName = 'Vui lòng nhập tên dịch vụ';
    if (!price || parseInt(price) <= 0) newErrors.price = 'Vui lòng nhập giá hợp lệ';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setErrors({});
    setLoading(true);

    if (!validateForm()) {
      setMessage('Vui lòng kiểm tra các trường thông tin.');
      setLoading(false);
      return;
    }

    const addData = {
      Tendichvu: serviceName.trim(),
      Giadichvu: parseInt(price) || 0,
      Loaigia: priceType,
      TrangThaiHoatDong: status === 'Hien',
    };

    try {
      const response = await fetch(`${API_BASE_URL}/Giadichvu/Add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Thêm giá xét nghiệm thất bại');
      }

      setMessage('Thêm giá xét nghiệm thành công!');
      setServiceName('');
      setPrice('');
      setPriceType('GiaXetNghiem');
      setStatus('Hien');
    } catch (err: unknown) {
      const error = err as ApiError | Error;
      console.error('Lỗi khi thêm giá xét nghiệm:', error);
      setMessage(error.message || 'Thêm giá xét nghiệm thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/Admin/price/ExaminationPrice');
  };

  return (
    <div className="AdminContent-Container">
      <BreadcrumbComponent
              items={[
                { title: "Trang chủ", href: "/Admin" },
                { title: "Dịch vụ", href: "/Admin/price/AxaminationPrice" },
                { title: "Bảng giá dịch vụ", href: "/Admin/price/AxaminationPrice" },
                { title: "Thêm giá dịch vụ" },
              ]}
            />
      {message && (
        <div
          className={
            message.includes('thành công') ? 'message-success' : 'message-error'
          }
        >
          <Alert severity={message.includes('thành công') ? 'success' : 'error'}>
            {message}
          </Alert>
        </div>
      )}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ width: '100%' }}>
          <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
            Thêm Giá Xét Nghiệm
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 10, mb: 4 }}>
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <TextField
                    sx={{ width: { sm: '60%' } }}
                    label="Tên Dịch Vụ"
                    name="tenDichVu"
                    variant="outlined"
                    required
                    value={serviceName}
                    onChange={handleServiceNameChange}
                    error={!!errors.serviceName}
                    helperText={errors.serviceName}
                  />
                  <TextField
                    sx={{ width: { sm: '40%' } }}
                    label="Giá Dịch Vụ"
                    name="giaDichVu"
                    variant="outlined"
                    value={price}
                    onChange={handlePriceChange}
                    required
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    error={!!errors.price}
                    helperText={errors.price}
                  />
                </Box>
                <FormControl>
                  <InputLabel id="loai-gia-label">Loại Giá *</InputLabel>
                  <Select
                    labelId="loai-gia-label"
                    id="loai-gia"
                    value={priceType}
                    label="Loại Giá *"
                    onChange={handlePriceTypeChange}
                    required
                    disabled
                  >
                    <MenuItem value="GiaXetNghiem">Giá Xét Nghiệm</MenuItem>
                  </Select>
                </FormControl>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Trạng Thái</FormLabel>
                  <RadioGroup
                    row
                    name="trangThai"
                    value={status}
                    onChange={handleStatusChange}
                  >
                    <FormControlLabel value="An" control={<Radio />} label="Ẩn" />
                    <FormControlLabel value="Hien" control={<Radio />} label="Hiện" />
                  </RadioGroup>
                </FormControl>
              </Box>
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
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner style={{ marginRight: '6px', verticalAlign: 'middle' }} className="spin" />
                    Đang thêm...
                  </>
                ) : (
                  <>
                    <FaSave style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                    Thêm Giá Xét Nghiệm
                  </>
                )}
              </button>
            </Box>
          </form>
        </Paper>
      </Box>
    </div>
  );
}