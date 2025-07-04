'use client'
import React, { useState } from 'react';
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
} from '@mui/material';
import './AccountType.css'

function AccountTypeFormLayout() {
  const [role, setRole] = useState<string>('');

  const handleRoleChange = (e: SelectChangeEvent<string>) => {
    setRole(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Vai trò:", role);
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
            Thông tin Loại Tài Khoản
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 10, mb: 4 }}>
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <TextField
                    sx={{ width: { sm: '60%' } }}
                    label="Tên Loại Tài Khoản"
                    name="tenLoaiTaiKhoan"
                    variant="outlined"
                    required
                  />
                  <FormControl sx={{ width: { sm: '40%' } }}>
                    <InputLabel id="vai-tro-label">Vai Trò *</InputLabel>
                    <Select
                      labelId="vai-tro-label"
                      id="vai-tro"
                      value={role}
                      label="Vai Trò *"
                      onChange={handleRoleChange}
                      required
                    >
                      <MenuItem value="">Chọn Vai Trò</MenuItem>
                      <MenuItem value="Admin">Quản Trị Viên</MenuItem>
                      <MenuItem value="Doctor">Bác Sĩ</MenuItem>
                      <MenuItem value="Nurse">Y Tá</MenuItem>
                      <MenuItem value="Patient">Bệnh Nhân</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setRole('');
                  console.log("Hủy form");
                }}
              >
                Hủy
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Thêm Loại Tài Khoản
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </div>
  );
}

export default AccountTypeFormLayout;