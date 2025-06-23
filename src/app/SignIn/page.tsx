// App.jsx
import React from 'react';
import './SignIn.css'; // Import tệp CSS riêng biệt
import { FaLock, FaPhoneAlt } from 'react-icons/fa';

const App = () => {
  return (
    // Container chính của toàn bộ trang đăng nhập
    <div className="main-app-container">
      {/* Phần Background chính với hiệu ứng cắt góc */}
      <div
        className="main-angled-bg"
        // Sử dụng ảnh nền placeholder trực tiếp trong CSS để dễ quản lý hơn
        // style={{ backgroundImage: `url('https://img.lovepik.com/photo/50075/1891.jpg_wh860.jpg')` }}
      >
        {/* Lớp phủ màu đen để làm tối ảnh nền, tạo độ sâu */}

      </div>

      {/* Container của Form Đăng nhập - Đặt ở giữa và có bóng đổ */}
      <div className="login-card">
        {/* Phần bên trái: Ảnh minh họa bên trong thẻ đăng nhập (chỉ hiển thị trên màn hình lớn hơn md) */}
        <div className="inner-image-section">
          {/* [Image of a stylized graphic for login illustration] */}
          <img
            src="https://saobacdautelecom.vn/wp-content/uploads/2021/08/Be%CC%A3%CC%82nh-vie%CC%A3%CC%82n-Pho%CC%80ng-kha%CC%81m_1920x772-e1633608427676.png"
            alt="Creative illustration for login"
            className="internal-image"
          />
        </div>

        {/* Phần bên phải: Form Đăng nhập */}
        <div className="login-form-section">
            <div className="system-title">
    <h1 className="system-title-main">HỆ THỐNG WELL NEST</h1>
    <p className="system-title-sub">Hãy vui lòng đăng nhập để vào hệ thống</p>
  </div>
  <div className="form-content-wrapper">
    <div className='form-content-wrapper-title'>
        <h2 className="form-title">ĐĂNG NHẬP</h2>
    <div className="separator-line"></div>
    </div>
    

    {/* Dropdown chọn quyền */}
    <div className="input-group">
      <label htmlFor="role" className="input-label">Chọn quyền:</label>
      <select id="role" className="select-field">
        <option value="">-- Chọn quyền --</option>
        <option value="admin">Quản trị viên</option>
        <option value="doctor">Bác sĩ</option>
        <option value="reception">Lễ tân</option>
      </select>
    </div>

    {/* Số điện thoại */}
<div className="input-group input-with-icon">
  <label htmlFor="phone" className="input-label">Số điện thoại:</label>
  <div className="input-icon-wrapper">
    <FaPhoneAlt className="input-icon" />
    <input
      type="text"
      id="phone"
      className="input-field with-icon"
      placeholder="Nhập số điện thoại"
    />
  </div>
</div>

{/* Mật khẩu */}
<div className="input-group input-with-icon">
  <label htmlFor="password" className="input-label">Mật khẩu:</label>
  <div className="input-icon-wrapper">
    <FaLock className="input-icon" />
    <input
      type="password"
      id="password"
      className="input-field with-icon"
      placeholder="Nhập mật khẩu"
    />
  </div>
</div>

<p className="helper-text">
      <a href="#">Quên mật khẩu</a>
    </p>
    {/* Nút đăng nhập */}
    <button className="login-button">Đăng nhập</button>

    {/* Gợi ý khi quên thông tin */}
    
  </div>
        </div>

      </div>
    </div>
  );
};

export default App;
