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
  FormHelperText,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/system';
import { useRouter } from 'next/navigation';
import './FormTestingRoom.css';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa6';
import { FaSave } from 'react-icons/fa';
import BreadcrumbComponent from '@/app/Admin/component/Breadcrumb';
import API_BASE_URL from "@/app/config";

// Custom styled component for the file input button
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

// Styled box for the image upload area
const ImageUploadBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'hasError' && prop !== 'hasImage',
})<{ hasError: boolean; hasImage: boolean }>(({ theme, hasError, hasImage }) => ({
  border: `2px dashed ${hasError ? theme.palette.error.main : (hasImage ? theme.palette.primary.main : theme.palette.grey[400])}`,
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',  
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 250,
  cursor: 'pointer',
  transition: 'border-color 0.3s ease-in-out',
  '&:hover': {
    borderColor: hasError ? theme.palette.error.dark : theme.palette.primary.dark,
  },
  position: 'relative',
  overflow: 'hidden',
}));


function AddTestingRoomForm() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tenPhong, setTenPhong] = useState<string>('');
  const [tenXetNghiem, setTenXetNghiem] = useState<string>('');
  const [trangThai, setTrangThai] = useState<string>('Hien');
  const [errors, setErrors] = useState<{ imageFile?: string; tenPhong?: string; tenXetNghiem?: string }>({});
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // Tự động xóa thông báo sau 3 giây
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setErrors((prevErrors) => ({ ...prevErrors, imageFile: undefined }));
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const validateForm = () => {
    const newErrors: { imageFile?: string; tenPhong?: string; tenXetNghiem?: string } = {};
    if (!tenPhong.trim()) newErrors.tenPhong = 'Vui lòng nhập tên phòng';
    if (!tenXetNghiem.trim()) newErrors.tenXetNghiem = 'Vui lòng nhập tên xét nghiệm';
    if (!imageFile) newErrors.imageFile = 'Vui lòng chọn ảnh phòng xét nghiệm';
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

    const formData = new FormData();
    formData.append('TenPhongThietBi', tenPhong.trim());
    formData.append('TenXetNghiem', tenXetNghiem.trim());
    formData.append('TrangThaiHoatDong', 'true'); // Hardcoded as per backend
    if (imageFile) {
      formData.append('Image', imageFile);
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/Phong_Thiet_Bi/add`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setMessage('Thêm phòng xét nghiệm thành công!');
        setTenPhong('');
        setTenXetNghiem('');
        setTrangThai('Hien');
        setImageFile(null);
        setImagePreview(null);
      } else {
        const errorData = await response.json();
        setMessage(`Thêm thất bại: ${errorData.message || 'Lỗi không xác định'}`);
      }
    } catch (error) {
      console.error('Error adding room:', error);
      setMessage('Đã có lỗi xảy ra khi thêm phòng xét nghiệm.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/Admin/Rooms/TestingRoom');
  };

  return (
    <div className="AdminContent-Container">
      <BreadcrumbComponent
        items={[
          { title: "Trang chủ", href: "/Admin" },
          { title: "Phòng", href: "/Admin/Rooms/TestingRoom" },
          { title: "Phòng xét nghiệm", href: "/Admin/Rooms/TestingRoom" },
          { title: "Thêm phòng xét nghiệm", href: "/Admin/Rooms/TestingRoom" },
        ]}
      />
      {loading && (
        <div className="message-loading">
          <Alert severity="info">Đang tải...</Alert>
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ width: '100%' }}>
          <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
            Thêm Phòng Xét Nghiệm
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 10, mb: 4 }}>
              <Box sx={{
                width: { xs: '100%', sm: '48%', md: '250px' },
                display: 'flex',
                flexDirection: 'column'
              }}>
                <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 1 }}>
                  Ảnh <span style={{ color: 'red' }}>*</span>
                </Typography>
                {!imagePreview ? (
                  <label htmlFor="image-upload-input" style={{ width: '100%' }}>
                    <ImageUploadBox
                      as="div"
                      hasError={!!errors.imageFile}
                      hasImage={!!imagePreview}
                    >
                      <Box sx={{ textAlign: 'center' }}>
                        <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                        <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 'medium' }}>
                          Chọn ảnh
                        </Typography>
                      </Box>
                    </ImageUploadBox>
                  </label>
                ) : (
                  <ImageUploadBox
                    as="div"
                    hasError={!!errors.imageFile}
                    hasImage={!!imagePreview}
                    sx={{
                      '&:hover .delete-button': {
                        opacity: 1,
                      }
                    }}
                  >
                    <img
                      src={imagePreview}
                      alt="Xem trước ảnh"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'fill',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                      }}
                    />
                    <Box
                      className="delete-button"
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'rgba(255,255,255,0.7)',
                        borderRadius: '50%',
                        p: 1,
                        cursor: 'pointer',
                        opacity: 0,
                        transition: 'opacity 0.3s',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.9)',
                        }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                    >
                      <DeleteIcon sx={{ color: 'gray', fontSize: 32 }} />
                    </Box>
                  </ImageUploadBox>
                )}
                <VisuallyHiddenInput
                  id="image-upload-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {errors.imageFile && (
                  <FormHelperText error sx={{ mt: 1 }}>
                    {errors.imageFile}
                  </FormHelperText>
                )}
              </Box>
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <TextField
                    sx={{ width: { sm: '60%' } }}
                    label="Tên Phòng Xét Nghiệm"
                    name="tenPhongThietBi"
                    variant="outlined"
                    required
                    value={tenPhong}
                    onChange={(e) => setTenPhong(e.target.value)}
                    error={!!errors.tenPhong}
                    helperText={errors.tenPhong}
                  />
                  <TextField
                    sx={{ width: { sm: '40%' } }}
                    label="Tên Xét Nghiệm"
                    name="tenXetNghiem"
                    variant="outlined"
                    required
                    value={tenXetNghiem}
                    onChange={(e) => setTenXetNghiem(e.target.value)}
                    error={!!errors.tenXetNghiem}
                    helperText={errors.tenXetNghiem}
                  />
                </Box>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Trạng thái</FormLabel>
                  <RadioGroup
                    row
                    name="trangThai"
                    value={trangThai}
                    onChange={(e) => setTrangThai(e.target.value)}
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
                    Thêm Phòng Xét Nghiệm
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

export default AddTestingRoomForm;