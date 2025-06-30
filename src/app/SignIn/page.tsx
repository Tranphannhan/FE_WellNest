'use client';
import React, { useState } from 'react';
import './SignIn.css';
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  MenuItem,
  Select,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { FaLock, FaPhoneAlt, FaUserMd } from 'react-icons/fa';
import { FaCapsules, FaMoneyBillWave, FaUserCheck, FaUserShield, FaVials  } from 'react-icons/fa6';
import { showToast, ToastType } from '../lib/Toast';
import { ToastContainer } from 'react-toastify';
import { signInUnified } from './services/SignIn';

const App = () => {
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const roleMap: Record<string, string> = {
  admin: '68272c6238063782b57d3868',
  doctor: '',
  reception: '6623a1b10b29f66dfbeef003',
  testing: '6623a1b10b29f66dfbeef004',
  cashier: '6623a1b10b29f66dfbeef005',
  pharmacist: '6623a1b10b29f66dfbeef006',
};

const handleLogin = async () => {
  const idLoaiTaiKhoan = roleMap[role];

  if (!idLoaiTaiKhoan && role !== 'doctor') {
    showToast('Vui lòng chọn quyền đăng nhập', ToastType.warn);
    return;
  }

  try {
    const result = await signInUnified(phone, password, idLoaiTaiKhoan || '', role);
    showToast('Đăng nhập thành công!', ToastType.success);
    console.log('✅ Đăng nhập thành công:', result);

    // router.push('/dashboard'); // Hoặc chuyển hướng theo role
  } catch (err: any) {
    showToast(err.message || 'Đăng nhập thất bại', ToastType.error);
    console.error('❌ Đăng nhập thất bại:', err.message);
  }
};



  return (
    <div className="main-app-container">
      <div className="main-angled-bg" />

      <div className="login-card">
        <div className="inner-image-section">
          <img
            src="https://saobacdautelecom.vn/wp-content/uploads/2021/08/Be%CC%A3%CC%82nh-vie%CC%A3%CC%82n-Pho%CC%80ng-kha%CC%81m_1920x772-e1633608427676.png"
            alt="Creative illustration for login"
            className="internal-image"
          />
        </div>

        <div className="login-form-section">
          <div className="system-title">
            <h1 className="system-title-main">HỆ THỐNG WELL NEST</h1>
            <p className="system-title-sub">Hãy vui lòng đăng nhập để vào hệ thống</p>
          </div>

          <div className="form-content-wrapper">
            <div className="form-content-wrapper-title">
              <h2 className="form-title">ĐĂNG NHẬP</h2>
              <div className="separator-line"></div>
            </div>

            {/* Dropdown chọn quyền */}
            <FormControl fullWidth size="small" variant="outlined" sx={{ width: '50%', mb: 2 }}>
              <InputLabel id="role-label">Chọn quyền</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                value={role}
                label="Chọn quyền"
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem value="admin"> <div style={{display:'flex', alignItems:'center'}}><FaUserShield style={{ marginRight: 8 }}/>Quản trị viên</div></MenuItem>
                <MenuItem value="doctor"><div style={{display:'flex', alignItems:'center'}}><FaUserMd  style={{ marginRight: 8 }}/>Bác sĩ</div></MenuItem>
                <MenuItem value="reception"><div style={{display:'flex', alignItems:'center'}}><FaUserCheck style={{ marginRight: 8 }}/>Tiếp nhận</div></MenuItem>
                <MenuItem value="testing"> <div style={{display:'flex', alignItems:'center'}}><FaVials style={{ marginRight: 8 }}/>Xét nghiệm</div></MenuItem>
                <MenuItem value="cashier"><div style={{display:'flex', alignItems:'center'}}><FaMoneyBillWave style={{ marginRight: 8 }}/>Thu ngân</div></MenuItem>
                <MenuItem value="pharmacist"><div style={{display:'flex', alignItems:'center'}}><FaCapsules style={{ marginRight: 8 }}/>Dược sĩ</div></MenuItem>
              </Select>
            </FormControl>

            {/* Số điện thoại */}
            <label htmlFor="phone" className="input-label">Số điện thoại:</label>
            <FormControl fullWidth size="small" variant="outlined" sx={{ mb: 2 }}>
              <InputLabel sx={phone?{marginLeft:0}:{marginLeft:3}} htmlFor="phone" shrink={phone !== ''}>
                Số điện thoại
              </InputLabel>
              <OutlinedInput
                autoComplete="off" 
                id="phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                label={phone ? "Số điện thoại" :''}
                
                startAdornment={
                  <InputAdornment position="start">
                    <FaPhoneAlt />
                  </InputAdornment>
                }
              />
            </FormControl>

            {/* Mật khẩu */}
            <label htmlFor="password" className="input-label">Mật khẩu:</label>
            <FormControl fullWidth size="small" variant="outlined" sx={{ mb: 0 }}>
              <InputLabel sx={password?{marginLeft:0}:{marginLeft:3}} htmlFor="password" shrink={password !== ''}>
                Mật khẩu
              </InputLabel>
              <OutlinedInput
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="off"
                label={password ? "Mật khẩu" :''}
                startAdornment={
                  <InputAdornment position="start">
                    <FaLock />
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>

            <p className="helper-text">
              <a href="#">Quên mật khẩu</a>
            </p>
            <button className="login-button" onClick={handleLogin}>
  Đăng nhập
</button>

          </div>
        </div>
      </div>
       <ToastContainer />
    </div>
  );
};

export default App;
