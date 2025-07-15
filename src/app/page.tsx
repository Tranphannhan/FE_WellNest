"use client";
import React, { useState } from "react";
import "./SignIn/SignIn.css";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  MenuItem,
  Select,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FaLock, FaPhoneAlt, FaUserMd } from "react-icons/fa";
import {
  FaCapsules,
  FaMoneyBillWave,
  FaUserCheck,
  FaUserShield,
  FaVials,
} from "react-icons/fa6";

import { ToastContainer } from "react-toastify";

import { useRouter } from "next/navigation";
import { showToast, ToastType } from "./lib/Toast";
import { CustomError, signInUnified } from "./services/SignIn";

const App = () => {
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [roleError, setRoleError] = useState(false);
  const router = useRouter();

  const roleMap: Record<string, string> = {
    admin: "68272cc138063782b57d3872",
    doctor: "",
    reception: "68272ca038063782b57d386e",
    testing: "68272c6238063782b57d3868",
    cashier: "68272c8738063782b57d386c",
    pharmacist: "68272d28b4cfad70da810025",
  };

  const handleLogin = async () => {
    setPhoneError("");
    setPasswordError("");
    setRoleError(false);

    const idLoaiTaiKhoan = roleMap[role];

    let hasError = false;

    // Kiểm tra quyền
    if (!idLoaiTaiKhoan && role !== "doctor") {
      setRoleError(true);
      showToast("Vui lòng chọn quyền đăng nhập", ToastType.warn);
      hasError = true;
    }

    // Kiểm tra số điện thoại
    const phoneRegex = /^[0-9]{10}$/;
    if (!phone) {
      setPhoneError("Vui lòng nhập số điện thoại");
      hasError = true;
    } else if (!phoneRegex.test(phone)) {
      setPhoneError("Số điện thoại không hợp lệ (10 chữ số)");
      hasError = true;
    }

    // Kiểm tra mật khẩu
    if (!password) {
      setPasswordError("Vui lòng nhập mật khẩu");
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError("Mật khẩu phải có ít nhất 6 ký tự");
      hasError = true;
    }

    if (hasError) return;

    try {
      const result = await signInUnified(
        phone,
        password,
        idLoaiTaiKhoan || "",
        role
      );

      showToast("Đăng nhập thành công!", ToastType.success);
      console.log("✅ Đăng nhập thành công:", result);

      if (role === "reception") {
        router.push("/Receptionist/Reception");
      } else if (role === "doctor") {
        router.push("/Doctor/Patient");
      } else if (role === "cashier") {
        router.push("/Cashier/Dashboard");
      } else if (role === "testing") {
        router.push("/LaboratoryDoctor/TestWaitingLis");
      } else if (role === "pharmacist") {
        router.push("/Pharmacist/ListofDrugs");
      } else if (role === "admin") {
        router.push("/Admin/Monitor");
      }
    } catch (err) {
      if (err instanceof CustomError) {
        const status = err.status ?? 0;
        const message = err.message || "Đăng nhập thất bại";

        showToast(message, ToastType.error);

        if ([400, 403, 404].includes(status)) {
          setPhoneError(message);
        } else if (status === 401) {
          setPasswordError(message);
        }
      } else {
        showToast("Lỗi không xác định", ToastType.error);
      }
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
            <p className="system-title-sub">
              Hãy vui lòng đăng nhập để vào hệ thống
            </p>
          </div>

          <div className="form-content-wrapper">
            <div className="form-content-wrapper-title">
              <h2 className="form-title">ĐĂNG NHẬP</h2>
              <div className="separator-line"></div>
            </div>

            {/* Dropdown chọn quyền */}
            <FormControl
              fullWidth
              size="small"
              variant="outlined"
              sx={{ width: "50%", mb: 2 }}
              error={roleError}
            >
              <InputLabel id="role-label">Chọn quyền</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                value={role}
                label="Chọn quyền"
                onChange={(e) => {
                  setRole(e.target.value);
                  setRoleError(false);
                }}
              >
                <MenuItem value="admin">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FaUserShield style={{ marginRight: 8 }} />
                    Quản trị viên
                  </div>
                </MenuItem>
                <MenuItem value="doctor">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FaUserMd style={{ marginRight: 8 }} />
                    Bác sĩ
                  </div>
                </MenuItem>
                <MenuItem value="reception">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FaUserCheck style={{ marginRight: 8 }} />
                    Tiếp nhận
                  </div>
                </MenuItem>
                <MenuItem value="testing">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FaVials style={{ marginRight: 8 }} />
                    Xét nghiệm
                  </div>
                </MenuItem>
                <MenuItem value="cashier">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FaMoneyBillWave style={{ marginRight: 8 }} />
                    Thu ngân
                  </div>
                </MenuItem>
                <MenuItem value="pharmacist">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FaCapsules style={{ marginRight: 8 }} />
                    Dược sĩ
                  </div>
                </MenuItem>
              </Select>
            </FormControl>

            {/* Số điện thoại */}
            <label htmlFor="phone" className="input-label">
              Số điện thoại:
            </label>
            <FormControl
              fullWidth
              size="small"
              variant="outlined"
              sx={{ mb: 2 }}
              error={!!phoneError}
            >
              <InputLabel
                sx={phone ? { marginLeft: 0 } : { marginLeft: 3 }}
                htmlFor="phone"
                shrink={phone !== ""}
              >
                Số điện thoại
              </InputLabel>
              <OutlinedInput
                autoComplete="off"
                id="phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                label={phone ? "Số điện thoại" : ""}
                startAdornment={
                  <InputAdornment position="start">
                    <FaPhoneAlt />
                  </InputAdornment>
                }
              />
              {phoneError && (
                <p
                  style={{
                    position: "absolute",
                    color: "red",
                    fontSize: 13,
                    bottom: -20,
                    left: 0,
                  }}
                >
                  {phoneError}
                </p>
              )}
            </FormControl>

            {/* Mật khẩu */}
            <label htmlFor="password" className="input-label">
              Mật khẩu:
            </label>
            <FormControl
              fullWidth
              size="small"
              variant="outlined"
              sx={{ mb: 0 }}
              error={!!passwordError}
            >
              <InputLabel
                sx={password ? { marginLeft: 0 } : { marginLeft: 3 }}
                htmlFor="password"
                shrink={password !== ""}
              >
                Mật khẩu
              </InputLabel>
              <OutlinedInput
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="off"
                label={password ? "Mật khẩu" : ""}
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
              {passwordError && (
                <p
                  style={{
                    position: "absolute",
                    color: "red",
                    fontSize: 13,
                    bottom: -20,
                    left: 0,
                  }}
                >
                  {passwordError}
                </p>
              )}
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
