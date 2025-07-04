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
import './TestPriceForm.css'

function TestPriceFormLayout() {
  const [price, setPrice] = useState<string>('');
  const [priceType, setPriceType] = useState<string>('GiaXetNghiem');
  const [status, setStatus] = useState<string>('An');

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numeric input
    if (/^\d*$/.test(value)) {
      setPrice(value);
    }
  };

  const handlePriceTypeChange = (e: SelectChangeEvent<string>) => {
    setPriceType(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Tên dịch vụ:", document.forms[0].tenDichVu.value);
    console.log("Giá dịch vụ:", price);
    console.log("Loại giá:", priceType);
    console.log("Trạng thái:", status);
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
            Thông tin Giá Xét Nghiệm
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 10, mb: 4 }}>
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <TextField
                    sx={{ width: { sm: '60%' } }}
                    label="Tên Dịch Vụ"
                    name="tenDichVu"
                    variant="outlined"
                    required
                  />
                  <TextField
                    sx={{ width: { sm: '40%' } }}
                    label="Giá Dịch Vụ"
                    name="giaDichVu"
                    variant="outlined"
                    value={price}
                    onChange={handlePriceChange}
                    required
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                  />
                </Box>
                <FormControl>
                  <InputLabel id="loai-gia-label">Loại Giá *</InputLabel>
                  <Select
                    labelId="loai-gia-label"
                    id="loai-gia"
                    value={priceType}
                    label="Loại Giá *"
                    onChange={handlePriceTypeChange}
                    required
                    disabled
                  >
                    <MenuItem value="GiaXetNghiem">Giá Xét Nghiệm</MenuItem>
                  </Select>
                </FormControl>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Trạng Thái</FormLabel>
                  <RadioGroup
                    row
                    name="trangThai"
                    value={status}
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
                onClick={() => {
                  setPrice('');
                  setPriceType('GiaXetNghiem');
                  setStatus('An');
                  console.log("Hủy form");
                }}
              >
                Hủy
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Thêm Giá Xét Nghiệm
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </div>
  );
}

export default TestPriceFormLayout;