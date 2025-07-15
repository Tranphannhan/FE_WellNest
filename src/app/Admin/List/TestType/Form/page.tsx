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
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/system';
import { useRouter } from 'next/navigation';
import './EditTestForm.css';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa6';
import { FaSave } from 'react-icons/fa';
import BreadcrumbComponent from '@/app/Admin/component/Breadcrumb';

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
  border: `2px dashed ${hasError ? theme.palette.error.main : hasImage ? theme.palette.primary.main : theme.palette.grey[400]}`,
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

interface PriceOption {
  _id: string;
  Giadichvu: number;
  Tendichvu: string;
}

interface RoomOption {
  _id: string;
  TenPhongThietBi: string;
}

function AddTestForm() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [testName, setTestName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [testCategory, setTestCategory] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [status, setStatus] = useState<string>('Hien');
  const [errors, setErrors] = useState<{ imageFile?: string; testName?: string; price?: string }>({});
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [priceOptions, setPriceOptions] = useState<PriceOption[]>([]);
  const [roomOptions, setRoomOptions] = useState<RoomOption[]>([]);
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fetch price and room options
  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      try {
        const [priceResponse, roomResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/Giadichvu/ServiceGroup/Pagination`),
          fetch(`${API_BASE_URL}/Phong_Thiet_Bi/Pagination`),
        ]);
        if (!priceResponse.ok || !roomResponse.ok) {
          throw new Error('Không thể tải danh sách giá hoặc phòng.');
        }
        const priceData = await priceResponse.json();
        const roomData = await roomResponse.json();
        setPriceOptions(priceData.data || []);
        setRoomOptions(roomData.data || []);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách giá và phòng:', error);
        setMessage('Đã có lỗi xảy ra khi tải danh sách giá và phòng.');
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [API_BASE_URL]);

  // Tự động xóa thông báo sau 3 giây
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const checkTestName = async (tenXetNghiem: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/Loaixetnghiem/CheckTestName`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ TenXetNghiem: tenXetNghiem.trim() }),
      });
      if (!response.ok) {
        console.error(`Check test name API error: Status ${response.status}, ${response.statusText}`);
        return false;
      }
      const data = await response.json();
      return data.exists || false;
    } catch (error) {
      console.error('Check test name error:', error);
      return false;
    }
  };

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
    setErrors((prevErrors) => ({ ...prevErrors, price: undefined }));
  };

  const validateForm = async () => {
    const newErrors: { imageFile?: string; testName?: string; price?: string } = {};
    if (!testName.trim()) {
      newErrors.testName = 'Vui lòng nhập tên xét nghiệm.';
    } else {
      const testExists = await checkTestName(testName);
      if (testExists) {
        newErrors.testName = 'Tên xét nghiệm đã tồn tại.';
      }
    }
    if (!price) newErrors.price = 'Vui lòng chọn giá dịch vụ.';
    if (!imageFile) newErrors.imageFile = 'Vui lòng chọn ảnh xét nghiệm.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setErrors({});

    if (!(await validateForm())) {
      setMessage('Vui lòng kiểm tra các trường thông tin.');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('TenXetNghiem', testName.trim());
      formData.append('MoTaXetNghiem', description.trim());
      if (imageFile) {
        formData.append('Image', imageFile);
      }
      formData.append('Id_PhongThietBi', testCategory || '');
      formData.append('Id_GiaDichVu', price);
      formData.append('TrangThaiHoatDong', 'true'); // Hardcoded as per backend

      const response = await fetch(`${API_BASE_URL}/Loaixetnghiem/Add`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setMessage('Thêm loại xét nghiệm thành công!');
        setTestName('');
        setDescription('');
        setTestCategory('');
        setPrice('');
        setStatus('Hien');
        setImageFile(null);
        setImagePreview(null);
      } else {
        const errorData = await response.json();
        setMessage(`Thêm thất bại: ${errorData.message || 'Lỗi không xác định'}`);
      }
    } catch (error) {
      console.error('Lỗi khi thêm xét nghiệm:', error);
      setMessage('Đã có lỗi xảy ra khi thêm loại xét nghiệm.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/Admin/List/TestType');
  };

  return (
    <div className="AdminContent-Container">
      <BreadcrumbComponent
              items={[
                { title: "Trang chủ", href: "/Admin" },
                { title: "Danh mục", href: "/Admin/List/TestType" },
                { title: "Loại xét nghiệm", href: "/Admin/List/TestType" },
                { title: "Thêm loại xét nghiệm", href: "/Admin/List/TestType/Form" },
              ]}
            />
      {loading && (
        <div className="message-loading">
          <Alert severity="info">Đang tải dữ liệu...</Alert>
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
            Thêm Loại Xét Nghiệm
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 10, mb: 4 }}>
              <Box sx={{ width: { xs: '100%', sm: '48%', md: '250px' }, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 1 }}>
                  Ảnh <span style={{ color: 'red' }}>*</span>
                </Typography>
                {!imagePreview ? (
                  <label htmlFor="image-upload-input" style={{ width: '100%' }}>
                    <ImageUploadBox as="div" hasError={!!errors.imageFile} hasImage={!!imagePreview}>
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
                      },
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
                        },
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
                    value={testName}
                    onChange={(e) => {
                      setTestName(e.target.value);
                      setErrors((prevErrors) => ({ ...prevErrors, testName: undefined }));
                    }}
                    required
                    error={!!errors.testName}
                    helperText={errors.testName}
                  />
                  <FormControl sx={{ width: { sm: '40%' } }} error={!!errors.price}>
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
                      {priceOptions.map((option) => (
                        <MenuItem key={option._id} value={option._id}>
                          {option.Giadichvu.toLocaleString()} VND - {option.Tendichvu}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.price && (
                      <FormHelperText error>{errors.price}</FormHelperText>
                    )}
                  </FormControl>
                </Box>
                <FormControl>
                  <InputLabel id="phong-label">Phòng Thiết Bị</InputLabel>
                  <Select
                    labelId="phong-label"
                    id="phong"
                    value={testCategory}
                    label="Phòng Thiết Bị"
                    onChange={handleTestCategoryChange}
                  >
                    <MenuItem value="">Không chọn</MenuItem>
                    {roomOptions.map((room) => (
                      <MenuItem key={room._id} value={room._id}>
                        {room.TenPhongThietBi}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Mô Tả"
                  name="moTa"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <FormControl component="fieldset">
                  <FormLabel component="legend">Trạng Thái</FormLabel>
                  <RadioGroup
                    row
                    name="trangThai"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
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
                    Thêm Loại Xét Nghiệm
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

export default AddTestForm;