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
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import './FormClinic.css'

function ClinicFormLayout() {
  const [loaiXetNghiem, setLoaiXetNghiem] = useState<string>('');

  const handleLoaiXetNghiemChange = (e: SelectChangeEvent<string>) => {
    setLoaiXetNghiem(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Loại xét nghiệm:", loaiXetNghiem);
    alert("Form layout được submit (xem console)!");
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
            Thông tin Phòng Khám
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 10, mb: 4 }}>
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <TextField
                    sx={{ width: { sm: '70%' } }}
                    label="Tên Phòng"
                    name="tenClinic"
                    variant="outlined"
                    required
                  />
                  <FormControl sx={{ width: { sm: '30%' } }}>
                    <InputLabel id="khoa-label">Khoa*</InputLabel>
                    <Select
                      labelId="khoa-label"
                      id="khoa"
                      value={loaiXetNghiem}
                      label="Khoa*"
                      onChange={handleLoaiXetNghiemChange}
                      required
                    >
                      <MenuItem value="">Chọn Khoa</MenuItem>
                      <MenuItem value="Xuong">Khoa Xương</MenuItem>
                      <MenuItem value="DaLieu">Khoa Da Liễu</MenuItem>
                      <MenuItem value="Mat">Khoa Mắt</MenuItem>
                      <MenuItem value="Tay">Khoa Tay</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Trạng thái</FormLabel>
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
                  setLoaiXetNghiem('');
                  console.log("Hủy form");
                }}
              >
                Hủy
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Thêm Phòng Clinic
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </div>
  );
}

export default ClinicFormLayout;