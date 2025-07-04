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
} from '@mui/material';
import './DepartmentType.css'

function DepartmentTypeFormLayout() {
  const [status, setStatus] = useState<string>('An');

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Trạng thái hoạt động:", status);
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
            Thông tin Loại Khoa
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 10, mb: 4 }}>
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Tên Khoa"
                  name="tenKhoa"
                  variant="outlined"
                  required
                />
                <FormControl component="fieldset">
                  <FormLabel component="legend">Trạng Thái Hoạt Động</FormLabel>
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
                  setStatus('An');
                  console.log("Hủy form");
                }}
              >
                Hủy
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Thêm Loại Khoa
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </div>
  );
}

export default DepartmentTypeFormLayout;