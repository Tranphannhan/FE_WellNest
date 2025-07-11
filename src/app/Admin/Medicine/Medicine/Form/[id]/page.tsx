'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  FormHelperText,
} from '@mui/material';
import './UpdateMedicineFormLayout.css';

interface GroupType {
  _id: string;
  TenNhomThuoc: string;
}

function UpdateMedicineFormLayout() {
  const { id } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    Id_NhomThuoc: '',
    DonVi: '',
    TenThuoc: '',
    Gia: '',
    TrangThaiHoatDong: 'true',
  });
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>(''); // Thay error bằng message
  const [errors, setErrors] = useState<{
    Id_NhomThuoc?: string;
    DonVi?: string;
    TenThuoc?: string;
    Gia?: string;
  }>({});
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

  // Lấy danh sách nhóm thuốc
  const fetchGroups = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Nhomthuoc/pagination`);
      const result = await response.json();
      if (response.ok && result.data && result.data.length > 0) {
        setGroups(result.data);
      } else {
        setMessage('Không tìm thấy nhóm thuốc');
      }
    } catch (err) {
      setMessage('Lỗi khi lấy danh sách nhóm thuốc');
      console.error(err);
    }
  };

  // Lấy thông tin thuốc theo ID
  const fetchMedicine = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Thuoc/Detail/${id}`);
      const result = await response.json();
      if (response.ok && Array.isArray(result) && result.length > 0) {
        const data = result[0];
        setFormData({
          Id_NhomThuoc: data.Id_NhomThuoc?._id || '',
          DonVi: data.DonVi || '',
          TenThuoc: data.TenThuoc || '',
          Gia: data.Gia?.toString() || '',
          TrangThaiHoatDong: data.TrangThaiHoatDong ? 'true' : 'false',
        });
      } else {
        setMessage('Không tìm thấy thông tin thuốc');
      }
    } catch (err) {
      setMessage('Lỗi khi lấy thông tin thuốc');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchMedicine();
  }, [id, API_BASE_URL]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateForm = () => {
    const newErrors: { Id_NhomThuoc?: string; DonVi?: string; TenThuoc?: string; Gia?: string } = {};
    if (!formData.TenThuoc.trim()) newErrors.TenThuoc = 'Vui lòng nhập tên thuốc';
    if (!formData.DonVi.trim()) newErrors.DonVi = 'Vui lòng nhập đơn vị';
    if (!formData.Gia || parseFloat(formData.Gia) <= 0) newErrors.Gia = 'Vui lòng nhập giá hợp lệ';
    if (!formData.Id_NhomThuoc) newErrors.Id_NhomThuoc = 'Vui lòng chọn nhóm thuốc';
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
      const response = await fetch(`${API_BASE_URL}/Thuoc/Edit/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Id_NhomThuoc: formData.Id_NhomThuoc,
          TenThuoc: formData.TenThuoc.trim(),
          DonVi: formData.DonVi.trim(),
          Gia: parseFloat(formData.Gia),
          TrangThaiHoatDong: formData.TrangThaiHoatDong === 'true',
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('Cập nhật thuốc thành công!');
      } else {
        setMessage(result.message || 'Lỗi khi cập nhật thuốc');
      }
    } catch (err) {
      setMessage('Lỗi khi gửi yêu cầu cập nhật');
      console.error(err);
    }
  };

  const handleCancel = () => {

      router.push('/Admin/Medicine/Medicine');
  };

  if (loading) {
    return (
      <div className="AdminContent-Container">
        <Typography>Đang tải...</Typography>
      </div>
    );
  }

  return (
    <div className="AdminContent-Container">
      
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ width: '100%'}}>
          <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
            Cập Nhật Thông Tin Thuốc
          </Typography>
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
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 10, mb: 4 }}>
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <TextField
                    sx={{ width: { sm: '60%' } }}
                    label="Tên Thuốc"
                    name="TenThuoc"
                    value={formData.TenThuoc}
                    onChange={handleInputChange}
                    variant="outlined"
                    required
                    error={!!errors.TenThuoc}
                    helperText={errors.TenThuoc}
                  />
                  <FormControl sx={{ width: { sm: '40%' } }} error={!!errors.Id_NhomThuoc}>
                    <InputLabel id="nhom-thuoc-label">Nhóm Thuốc *</InputLabel>
                    <Select
                      labelId="nhom-thuoc-label"
                      name="Id_NhomThuoc"
                      value={formData.Id_NhomThuoc}
                      label="Nhóm Thuốc *"
                      onChange={handleSelectChange}
                      required
                    >
                      <MenuItem value="">Chọn Nhóm Thuốc</MenuItem>
                      {groups.map((group) => (
                        <MenuItem key={group._id} value={group._id}>
                          {group.TenNhomThuoc}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.Id_NhomThuoc && (
                      <FormHelperText error>{errors.Id_NhomThuoc}</FormHelperText>
                    )}
                  </FormControl>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <TextField
                    sx={{ width: { sm: '50%' } }}
                    label="Đơn Vị"
                    name="DonVi"
                    value={formData.DonVi}
                    onChange={handleInputChange}
                    variant="outlined"
                    required
                    error={!!errors.DonVi}
                    helperText={errors.DonVi}
                  />
                  <TextField
                    sx={{ width: { sm: '50%' } }}
                    label="Giá"
                    name="Gia"
                    type="number"
                    value={formData.Gia}
                    onChange={handleInputChange}
                    variant="outlined"
                    required
                    error={!!errors.Gia}
                    helperText={errors.Gia}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
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
                Cập Nhật Thuốc
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </div>
  );
}

export default UpdateMedicineFormLayout;