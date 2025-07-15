'use client';
import React, { useState, useEffect } from 'react';
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
  CircularProgress,
} from '@mui/material';
import { useRouter, useParams } from 'next/navigation';
import './TestPriceForm.css';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa6';
import { FaSave } from 'react-icons/fa';

interface ApiError {
  message?: string;
}

export default function TestPriceFormLayout() {
  const [price, setPrice] = useState<string>('');
  const [priceType, setPriceType] = useState<string>('GiaXetNghiem');
  const [status, setStatus] = useState<string>('An');
  const [serviceName, setServiceName] = useState<string>('');
  const [errors, setErrors] = useState<{ serviceName?: string; price?: string }>({});
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  const router = useRouter();
  const { id } = useParams();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

  // Fetch dữ liệu chi tiết giá dịch vụ khi component mount
  useEffect(() => {
    const fetchServicePrice = async () => {
      try {
        setFetchLoading(true);
        const response = await fetch(`${API_BASE_URL}/Giadichvu/Detail/${id}`);
        if (!response.ok) {
          throw new Error('Không tìm thấy giá dịch vụ');
        }
        const data = await response.json();
        setServiceName(data.Tendichvu || '');
        setPrice(data.Giadichvu?.toString() || '');
        setPriceType(data.Loaigia || 'GiaXetNghiem');
        setStatus(data.TrangThaiHoatDong ? 'Hien' : 'An');
      } catch (err: unknown) {
        const error = err as ApiError | Error;
        console.error('Lỗi khi lấy chi tiết giá dịch vụ:', error);
        setMessage(error.message || 'Không thể tải dữ liệu giá dịch vụ');
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchServicePrice();
    }
  }, [id, API_BASE_URL]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numeric input
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

    // Dữ liệu cho endpoint Edit
    const editData = {
      Tendichvu: serviceName.trim(),
      Giadichvu: parseInt(price) || 0,
      Loaigia: priceType,
    };

    try {
      const editResponse = await fetch(`${API_BASE_URL}/Giadichvu/Edit/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      if (!editResponse.ok) {
        const errorData = await editResponse.json();
        throw new Error(errorData.message || 'Cập nhật giá dịch vụ thất bại');
      }

      // Cập nhật trạng thái hoạt động
      const statusResponse = await fetch(
        `${API_BASE_URL}/Giadichvu/SuaTrangThai/${id}?TrangThaiHoatDong=${status === 'Hien'}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!statusResponse.ok) {
        const errorData = await statusResponse.json();
        throw new Error(errorData.message || 'Cập nhật trạng thái thất bại');
      }

      setMessage('Cập nhật giá xét nghiệm thành công!');
    } catch (err: unknown) {
      const error = err as ApiError | Error;
      console.error('Lỗi khi cập nhật:', error);
      setMessage(error.message || 'Cập nhật giá xét nghiệm thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/Admin/price/ExaminationPrice');
  };

  if (fetchLoading) {
    return (
      <div className="AdminContent-Container">
        <div className="loading">
          <CircularProgress size={20} className="spinner" />
          Đang tải dữ liệu...
        </div>
      </div>
    );
  }

  return (
    <div className="AdminContent-Container">
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
            Chỉnh sửa Giá Xét Nghiệm
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
                    Đang cập nhật...
                  </>
                ) : (
                  <>
                    <FaSave style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                    Cập nhật Giá Xét Nghiệm
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