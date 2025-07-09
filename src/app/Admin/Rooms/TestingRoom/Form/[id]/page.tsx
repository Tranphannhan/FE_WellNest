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
  FormHelperText,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/system';
import { useRouter, useParams } from 'next/navigation';
import './FormTestingRoom.css';

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

interface TestingRoom {
  _id: string;
  TenPhongThietBi: string;
  TenXetNghiem: string;
  Image?: string;
  TrangThaiHoatDong?: boolean;
}

function TestingRoomFormLayout() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [oldImage, setOldImage] = useState<string | null>(null); // Lưu tên file ảnh cũ
  const [tenPhong, setTenPhong] = useState<string>('');
  const [loaiXetNghiem, setLoaiXetNghiem] = useState<string>('');
  const [trangThai, setTrangThai] = useState<string>('Hien');
  const [errors, setErrors] = useState<{ imageFile?: string; tenPhong?: string; loaiXetNghiem?: string }>({});
  const [message, setMessage] = useState<string>('');
  const router = useRouter();
  const { id } = useParams();

  // Fetch room details
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/Phong_Thiet_Bi/Detail/${id}`);
        const result = await response.json();
        if (result.message === "Lấy chi tiết phòng thiết bị thành công") {
          const room: TestingRoom = result.data;
          setTenPhong(room.TenPhongThietBi);
          setLoaiXetNghiem(room.TenXetNghiem);
          setTrangThai(room.TrangThaiHoatDong ? 'Hien' : 'An');
          if (room.Image) {
            setImagePreview(`${API_BASE_URL}/image/${room.Image}`);
            setOldImage(room.Image); // Lưu tên file ảnh cũ
          }
        } else {
          setMessage('Không tìm thấy thông tin phòng xét nghiệm.');
        }
      } catch (error) {
        console.error("Error fetching room details:", error);
        setMessage('Đã có lỗi xảy ra khi tải thông tin phòng xét nghiệm.');
      }
    };
    
    if (id) {
      fetchRoomDetails();
    }
  }, [id, API_BASE_URL]);

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
      setImagePreview(oldImage ? `${API_BASE_URL}/image/${oldImage}` : null);
    }
  };

  const validateForm = () => {
    const newErrors: { imageFile?: string; tenPhong?: string; loaiXetNghiem?: string } = {};
    if (!tenPhong) newErrors.tenPhong = 'Vui lòng nhập tên phòng';
    if (!loaiXetNghiem) newErrors.loaiXetNghiem = 'Vui lòng nhập loại xét nghiệm';
    if (!imageFile && !oldImage) newErrors.imageFile = 'Vui lòng chọn ảnh phòng xét nghiệm';
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
    formData.append('TenPhongThietBi', tenPhong);
    formData.append('TenXetNghiem', loaiXetNghiem);
    formData.append('TrangThaiHoatDong', trangThai === 'Hien' ? 'true' : 'false');
    if (imageFile) {
      formData.append('Image', imageFile);
    } else if (oldImage) {
      formData.append('Image', oldImage); // Gửi tên file ảnh cũ nếu không có ảnh mới
    }

    try {
      const response = await fetch(`${API_BASE_URL}/Phong_Thiet_Bi/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        setMessage('Cập nhật phòng xét nghiệm thành công!');
      } else {
        const errorData = await response.json();
        setMessage(`Cập nhật thất bại: ${errorData.message || 'Lỗi không xác định'}`);
      }
    } catch (error) {
      console.error('Error updating room:', error);
      setMessage('Đã có lỗi xảy ra khi cập nhật phòng xét nghiệm.');
    }
  };

  const handleCancel = () => {
    router.push('/Admin/Rooms/Lab');
    setMessage('Đã hủy bỏ chỉnh sửa.');
    setTimeout(() => setMessage(''), 3000);
  };

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
            Chỉnh sửa Phòng Xét Nghiệm
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
                        setOldImage(null); // Xóa ảnh cũ khi xóa ảnh
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
                    label="Loại Xét Nghiệm"
                    name="loaiXetNghiem"
                    variant="outlined"
                    required
                    value={loaiXetNghiem}
                    onChange={(e) => setLoaiXetNghiem(e.target.value)}
                    error={!!errors.loaiXetNghiem}
                    helperText={errors.loaiXetNghiem}
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
                Cập nhật Phòng Xét Nghiệm
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </div>
  );
}

export default TestingRoomFormLayout;