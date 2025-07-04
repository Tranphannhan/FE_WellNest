'use client'
import React, { useState } from 'react';
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
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/system';
import './EditTestForm.css'

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

function TestTypeFormLayout() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [testCategory, setTestCategory] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [errors, setErrors] = useState<{ imageFile?: string }>({});

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

  const handleTestCategoryChange = (e: SelectChangeEvent<string>) => {
    setTestCategory(e.target.value);
  };

  const handlePriceChange = (e: SelectChangeEvent<string>) => {
    setPrice(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      setErrors({ imageFile: 'Vui lòng chọn ảnh xét nghiệm.' });
    } else {
      console.log("Ảnh đã chọn:", imageFile.name);
      console.log("URL preview:", imagePreview);
      console.log("Phòng thiết bị:", testCategory);
      console.log("Giá:", price);
      alert("Form layout được submit (xem console)!");
    }
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
            Thông tin Loại Xét Nghiệm
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
                    label="Tên Xét Nghiệm"
                    name="tenXetNghiem"
                    variant="outlined"
                    required
                  />

                  <FormControl sx={{ width: { sm: '40%' } }}>
                  <InputLabel id="gia-label">Giá Dịch Vụ *</InputLabel>
                  <Select
                    labelId="gia-label"
                    id="gia"
                    value={price}
                    label="Giá Dịch Vụ *"
                    onChange={handlePriceChange}
                    required
                  >
                    <MenuItem value="">Chọn Giá</MenuItem>
                    <MenuItem value="100000">100,000 VND</MenuItem>
                    <MenuItem value="200000">200,000 VND</MenuItem>
                    <MenuItem value="300000">300,000 VND</MenuItem>
                    <MenuItem value="500000">500,000 VND</MenuItem>
                  </Select>
                </FormControl>
                </Box>

                <FormControl>
                    <InputLabel id="phong-label">Phòng Thiết Bị *</InputLabel>
                    <Select
                      labelId="phong-label"
                      id="phong"
                      value={testCategory}
                      label="Phòng Thiết Bị *"
                      onChange={handleTestCategoryChange}
                      required
                    >
                      <MenuItem value="">Chọn Phòng</MenuItem>
                      <MenuItem value="XQuang">Phòng X-Quang</MenuItem>
                      <MenuItem value="SieuAm">Phòng Siêu Âm</MenuItem>
                      <MenuItem value="XetNghiemMau">Phòng Xét Nghiệm Máu</MenuItem>
                      <MenuItem value="NoiSoi">Phòng Nội Soi</MenuItem>
                    </Select>
                  </FormControl>
                
                <TextField
                  label="Mô Tả"
                  name="moTa"
                  variant="outlined"
                  multiline
                  rows={4}
                />
                
                <FormControl component="fieldset">
                  <FormLabel component="legend">Trạng Thái</FormLabel>
                  <RadioGroup
                    row
                    name="trangThai"
                    defaultValue="An"
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
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(null);
                  setTestCategory('');
                  setPrice('');
                  setErrors({});
                  console.log("Hủy form");
                }}
              >
                Hủy
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Thêm Xét Nghiệm
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </div>
  );
}

export default TestTypeFormLayout;