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
import { useRouter, useParams } from 'next/navigation';
import './FormClinic.css';
import { getkhoaOptions } from '@/app/Admin/services/DoctorSevices';
import { getRommmDetail } from '@/app/Admin/services/Room';

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

const fetchPhongKhamDetail = async (id: string, callback: (data: PhongKham | null) => void) => {
  try {
    const response = await getRommmDetail(id);
    if (response?.data) {
      callback(response.data);
    } else {
      callback(null);
    }
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết phòng khám:', error);
    callback(null);
  }
};

const updatePhongKham = async (
  id: string,
  data: { SoPhongKham: string; Id_Khoa: string; TrangThaiHoatDong: boolean },
  callback: (success: boolean, message: string) => void
) => {
  try {
    const response = await fetch(`http://localhost:5000/Phong_Kham/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (response.ok) {
      callback(true, result.message || 'Cập nhật phòng khám thành công!');
    } else {
      callback(false, result.message || 'Có lỗi xảy ra khi cập nhật phòng khám.');
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật phòng khám:', error);
    callback(false, 'Có lỗi hệ thống khi cập nhật.');
  }
};

export default function ClinicEditForm() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [soPhongKham, setSoPhongKham] = useState<string>('');
  const [idKhoa, setIdKhoa] = useState<string>('');
  const [trangThaiHoatDong, setTrangThaiHoatDong] = useState<string>('Hien');
  const [khoaOptions, setKhoaOptions] = useState<khoaOptionsType[]>([]);
  const [errors, setErrors] = useState<{ soPhongKham?: string; idKhoa?: string }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');

  // Load dữ liệu phòng khám và danh sách khoa
  useEffect(() => {
    if (!id) return;

    // Load danh sách khoa
    fetchKhoaOptions((data) => {
      setKhoaOptions(data);
    });

    // Load chi tiết phòng khám
    fetchPhongKhamDetail(id, (data) => {
      if (data) {
        setSoPhongKham(data.SoPhongKham);
        setIdKhoa(data.Id_Khoa._id);
        setTrangThaiHoatDong(data.TrangThaiHoatDong ? 'Hien' : 'An');
      } else {
        setMessage('Không tìm thấy thông tin phòng khám.');
      }
      setLoading(false);
    });
  }, [id]);

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
  const validateForm = () => {
    const newErrors: { soPhongKham?: string; idKhoa?: string } = {};
    if (!soPhongKham.trim()) {
      newErrors.soPhongKham = 'Vui lòng nhập số phòng';
    }
    if (!idKhoa) {
      newErrors.idKhoa = 'Vui lòng chọn khoa';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setMessage('Vui lòng kiểm tra các trường thông tin.');
      return;
    }

    const data = {
      SoPhongKham: soPhongKham.trim(),
      Id_Khoa: idKhoa,
      TrangThaiHoatDong: trangThaiHoatDong === 'Hien',
    };

    setLoading(true);
    updatePhongKham(id, data, (success, message) => {
      setLoading(false);
      setMessage(message);
      if (success) {
        setTimeout(() => {
          router.push('/Admin/Rooms/Clinic');
        }, 2000); // Chuyển hướng sau 2 giây để người dùng thấy thông báo
      }
    });
  };

  // Xử lý hủy form
  const handleCancel = () => {
    setSoPhongKham('');
    setIdKhoa('');
    setTrangThaiHoatDong('Hien');
    setErrors({});
    setMessage('Đã hủy bỏ chỉnh sửa.');
    setTimeout(() => {
      router.push('/Admin/Rooms/Clinic');
    }, 2000); // Chuyển hướng sau 2 giây để người dùng thấy thông báo
  };

  if (loading) {
    return <Typography>Đang tải...</Typography>;
  }

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
            Chỉnh sửa Phòng Khám
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
              <Button variant="outlined" color="secondary" onClick={handleCancel}>
                Hủy
              </Button>
              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading ? 'Đang cập nhật...' : 'Cập nhật Phòng Khám'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </div>
  );
}