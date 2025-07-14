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
  Alert,
  CircularProgress,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import './DepartmentType.css';
import BreadcrumbComponent from '@/app/Admin/component/Breadcrumb';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa6';
import { FaSave } from 'react-icons/fa';

interface DepartmentType {
  TenKhoa: string;
  TrangThaiHoatDong: boolean;
}

interface ApiError {
  message?: string;
}

// Define errors for form validation
interface FormErrors {
  TenKhoa?: string;
}

function AddDepartmentTypeForm() {
  const [formData, setFormData] = useState<DepartmentType>({
    TenKhoa: '',
    TrangThaiHoatDong: true,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

  // Tự động xóa thông báo sau 3 giây
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // Handle status change
  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      TrangThaiHoatDong: e.target.value === 'Hien',
    }));
  };

  // Check for duplicate department name
  const checkDepartmentName = async (tenKhoa: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/Khoa/CheckDepartmentName`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ TenKhoa: tenKhoa.trim() }),
      });
      if (!response.ok) {
        console.error(`Check department name API error: Status ${response.status}, ${response.statusText}`);
        return false;
      }
      const data = await response.json();
      return data.exists || false;
    } catch (error) {
      console.error('Check department name error:', error);
      return false;
    }
  };

  // Validate form
  const validateForm = async () => {
    const newErrors: FormErrors = {};
    if (!formData.TenKhoa.trim()) {
      newErrors.TenKhoa = 'Vui lòng nhập tên khoa';
    } else {
      const departmentExists = await checkDepartmentName(formData.TenKhoa);
      if (departmentExists) {
        newErrors.TenKhoa = 'Tên khoa đã tồn tại';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setErrors({});

    if (!(await validateForm())) {
      setMessage('Vui lòng kiểm tra các trường thông tin.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/Khoa/Add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          TenKhoa: formData.TenKhoa.trim(),
          TrangThaiHoatDong: true, // Hardcoded as per backend
        }),
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || 'Không thể thêm khoa');
      }

      setMessage('Thêm khoa thành công!');
      setFormData({ TenKhoa: '', TrangThaiHoatDong: true });
    } catch (err: unknown) {
      const error = err as ApiError | Error;
      setMessage(error.message || 'Đã có lỗi xảy ra khi thêm khoa.');
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    router.push('/Admin/List/DepartmentType');
  };

  return (
    <div className="AdminContent-Container">
      {loading && (
        <div className="loading">
          <Alert severity="info">
            <CircularProgress size={20} className="spinner" /> Đang tải...
          </Alert>
        </div>
      )}
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
          { title: 'Thêm Loại Khoa' },
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
            Thêm Loại Khoa
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
                    Thêm Loại Khoa
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

export default AddDepartmentTypeForm;