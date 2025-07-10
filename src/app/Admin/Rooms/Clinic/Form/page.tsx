'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
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
import './FormClinic.css';
import { getkhoaOptions } from '@/app/Admin/services/DoctorSevices';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa6';
import { FaSave } from 'react-icons/fa';

// Interface chuyên khoa
interface Khoa {
  _id: string;
  TenKhoa: string;
  TrangThaiHoatDong: boolean;
}

// Interface phòng
interface PhongKham {
  _id: string;
  Id_Khoa: Khoa;
  SoPhongKham: string;
  TrangThaiHoatDong?: boolean;
}

// Select chuyên khoa
interface khoaOptionsType {
  _id: string;
  TenKhoa: string;
  TrangThaiHoatDong: boolean;
}

// API fetch functions
const fetchKhoaOptions = async (callback: (data: khoaOptionsType[]) => void) => {
  try {
    const response = await getkhoaOptions(1);
    if (response?.data?.length > 0) {
      const activeKhoa = response.data.filter((item: khoaOptionsType) => item.TrangThaiHoatDong);
      callback(activeKhoa);
    } else {
      callback([]);
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách khoa:', error);
    callback([]);
  }
};

const checkRoomNumber = async (soPhongKham: string): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:5000/Phong_Kham/CheckRoomNumber', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ SoPhongKham: soPhongKham }),
    });
    if (!response.ok) {
      console.error(`Check room number API error: Status ${response.status}, ${response.statusText}`);
      return false;
    }
    const data = await response.json();
    console.log('Check room number API response:', data);
    return data.exists || false;
  } catch (error) {
    console.error('Check room number error:', error);
    return false;
  }
};

const addPhongKham = async (
  data: { SoPhongKham: string; Id_Khoa: string; TrangThaiHoatDong: boolean },
  callback: (success: boolean, message: string) => void
) => {
  try {
    const response = await fetch('http://localhost:5000/Phong_Kham/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (response.ok) {
      callback(true, result.message || 'Thêm phòng khám thành công!');
    } else {
      callback(false, result.message || 'Có lỗi xảy ra khi thêm phòng khám.');
    }
  } catch (error) {
    console.error('Lỗi khi thêm phòng khám:', error);
    callback(false, 'Có lỗi hệ thống khi thêm phòng khám.');
  }
};

export default function AddClinicForm() {
  const router = useRouter();
  const [soPhongKham, setSoPhongKham] = useState<string>('');
  const [idKhoa, setIdKhoa] = useState<string>('');
  const [trangThaiHoatDong, setTrangThaiHoatDong] = useState<string>('Hien');
  const [khoaOptions, setKhoaOptions] = useState<khoaOptionsType[]>([]);
  const [errors, setErrors] = useState<{ soPhongKham?: string; idKhoa?: string }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  // Load danh sách khoa
  useEffect(() => {
    fetchKhoaOptions((data) => {
      setKhoaOptions(data);
      setLoading(false);
    });
  }, []);

  // Tự động xóa thông báo sau 3 giây
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Kiểm tra form
  const validateForm = async () => {
    const newErrors: { soPhongKham?: string; idKhoa?: string } = {};
    if (!soPhongKham.trim()) {
      newErrors.soPhongKham = 'Vui lòng nhập số phòng';
    } else {
      const roomExists = await checkRoomNumber(soPhongKham.trim());
      if (roomExists) {
        newErrors.soPhongKham = 'Số phòng này đã được đăng ký rồi.';
      }
    }
    if (!idKhoa) {
      newErrors.idKhoa = 'Vui lòng chọn khoa';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setErrors({});

    if (!(await validateForm())) {
      setMessage('Vui lòng kiểm tra các trường thông tin.');
      return;
    }

    const data = {
      SoPhongKham: soPhongKham.trim(),
      Id_Khoa: idKhoa,
      TrangThaiHoatDong: true, // Hardcoded as per backend
    };

    setLoading(true);
    addPhongKham(data, (success, message) => {
      setLoading(false);
      setMessage(message);
      if (success) {
        setSoPhongKham('');
        setIdKhoa('');
        setTrangThaiHoatDong('Hien');
      }
    });
  };

  // Xử lý hủy form
  const handleCancel = () => {
    router.push('/Admin/Rooms/Clinic');
  };

  return (
    <div className="AdminContent-Container">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ width: '100%' }}>
          <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
            Thêm Phòng Khám
          </Typography>
          {message && (
            <Box sx={{ mb: 2 }}>
              <Alert severity={message.includes('thành công') ? 'success' : 'error'}>
                {message}
              </Alert>
            </Box>
          )}
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 10, mb: 4 }}>
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <TextField
                    sx={{ width: { sm: '70%' } }}
                    label="Số Phòng"
                    value={soPhongKham}
                    onChange={(e) => setSoPhongKham(e.target.value)}
                    variant="outlined"
                    required
                    error={!!errors.soPhongKham}
                    helperText={errors.soPhongKham}
                  />
                  <FormControl sx={{ width: { sm: '30%' } }} error={!!errors.idKhoa}>
                    <InputLabel id="khoa-label">Khoa*</InputLabel>
                    <Select
                      labelId="khoa-label"
                      id="khoa"
                      value={idKhoa}
                      label="Khoa*"
                      onChange={(e: SelectChangeEvent<string>) => setIdKhoa(e.target.value)}
                      required
                    >
                      <MenuItem value="">Chọn Khoa</MenuItem>
                      {khoaOptions.map((khoa) => (
                        <MenuItem key={khoa._id} value={khoa._id}>
                          {khoa.TenKhoa}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.idKhoa && (
                      <Typography color="error" variant="caption">
                        {errors.idKhoa}
                      </Typography>
                    )}
                  </FormControl>
                </Box>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Trạng thái</FormLabel>
                  <RadioGroup
                    row
                    name="trangThai"
                    value={trangThaiHoatDong}
                    onChange={(e) => setTrangThaiHoatDong(e.target.value)}
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
                    Thêm Phòng Khám
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