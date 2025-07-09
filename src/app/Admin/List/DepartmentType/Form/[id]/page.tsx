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
  CircularProgress,
  Alert,
} from '@mui/material';
import { useRouter, useParams } from 'next/navigation';
import './DepartmentType.css';
import BreadcrumbComponent from '@/app/Admin/component/Breadcrumb';

interface DepartmentType {
  _id: string;
  TenKhoa: string;
  TrangThaiHoatDong: boolean;
}

function DepartmentTypeEdit() {
  const [formData, setFormData] = useState<DepartmentType>({
    _id: '',
    TenKhoa: '',
    TrangThaiHoatDong: false,
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null); // Thay error bằng message
  const [errors, setErrors] = useState<{ TenKhoa?: string }>({}); // Thêm state cho lỗi validate
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

  // Fetch department type details
  useEffect(() => {
    const fetchDepartmentType = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/Khoa/Detail/${id}`);
        if (!response.ok) {
          throw new Error('Không thể lấy thông tin loại khoa');
        }
        const { data } = await response.json();
        setFormData({
          _id: data._id,
          TenKhoa: data.TenKhoa || '',
          TrangThaiHoatDong: data.TrangThaiHoatDong || false,
        });
        setLoading(false);
      } catch (err: any) {
        setMessage(err.message);
        setLoading(false);
      }
    };

    if (id) {
      fetchDepartmentType();
    }
  }, [id, API_BASE_URL]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined })); // Xóa lỗi khi người dùng nhập
  };

  // Handle status change
  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      TrangThaiHoatDong: e.target.value === 'Hien',
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors: { TenKhoa?: string } = {};
    if (!formData.TenKhoa.trim()) {
      newErrors.TenKhoa = 'Vui lòng nhập tên khoa';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setErrors({});

    if (!validateForm()) {
      setMessage('Vui lòng kiểm tra các trường thông tin.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/Khoa/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          TenKhoa: formData.TenKhoa,
          TrangThaiHoatDong: formData.TrangThaiHoatDong,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể cập nhật loại khoa');
      }

      setMessage('Cập nhật loại khoa thành công!');
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData({ _id: '', TenKhoa: '', TrangThaiHoatDong: false });
    setMessage('Đã hủy bỏ chỉnh sửa.');
    setTimeout(() => {
      setMessage(null);
      router.push('/Admin/List/DepartmentType');
    }, 3000); // Chuyển hướng sau khi thông báo biến mất
  };

  if (loading) {
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
      <BreadcrumbComponent
        items={[
          { title: 'Trang chủ', href: '/Admin' },
          { title: 'Nhân sự', href: '/Admin/HumanResources/RoleType' },
          { title: 'Loại tài khoản', href: '/Admin/List/DepartmentType' },
          { title: 'Chỉnh sửa Loại khoa' },
        ]}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ width: '100%' }}>
          <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
            Chỉnh sửa Loại Khoa
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 10, mb: 4 }}>
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Tên Khoa"
                  name="TenKhoa"
                  variant="outlined"
                  value={formData.TenKhoa}
                  onChange={handleChange}
                  required
                  error={!!errors.TenKhoa}
                  helperText={errors.TenKhoa}
                />
                <FormControl component="fieldset">
                  <FormLabel component="legend">Trạng Thái Hoạt Động</FormLabel>
                  <RadioGroup
                    row
                    name="trangThai"
                    value={formData.TrangThaiHoatDong ? 'Hien' : 'An'}
                    onChange={handleStatusChange}
                  >
                    <FormControlLabel value="An" control={<Radio />} label="Ẩn" />
                    <FormControlLabel value="Hien" control={<Radio />} label="Hiện" />
                  </RadioGroup>
                </FormControl>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCancel}
                className="cancel-button"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="submit-button"
              >
                Cập nhật Loại Khoa
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </div>
  );
}

export default DepartmentTypeEdit;