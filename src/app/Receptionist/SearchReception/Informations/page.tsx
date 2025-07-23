'use client';

import React, { useState, useEffect } from 'react';
import { Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { UploadChangeParam } from 'antd/es/upload/interface';
import { useRouter } from 'next/navigation';
import Tabbar from '@/app/components/shared/Tabbar/Tabbar';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import './Informations.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface DecodedToken {
  _id: string;
  _TenTaiKhoan: string;
  _SoDienThoai: string;
  _SoCCCD: string;
  _Image: string;
  _NamSinh: string;
  _GioiTinh: string;
  _Id_LoaiTaiKhoan: {
    VaiTro: string;
  };
}

const Informations = () => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [userData, setUserData] = useState<DecodedToken | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUserData(decoded);
        if (decoded._Image) {
          setImageUrl(decoded._Image);
        }
      } catch (err) {
        console.error('Failed to decode token:', err);
      }
    }
  }, []);

  const handleImageChange = (info: UploadChangeParam) => {
    const file = info.file.originFileObj;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateClick = () => {
    if (userData) {
      localStorage.setItem('userInfo', JSON.stringify(userData));
      router.push('/Receptionist/SearchReception/UpDateInfor');
    }
  };

  return (
    <>
      <Tabbar
        tabbarItems={{
          tabbarItems: [
            { text: 'Thông tin bệnh nhân', link: '/Receptionist/SearchReception/Informations' },
            { text: 'Thông tin bác sĩ', link: '/Receptionist/SearchReception/InforDoctor' },
          ],
        }}
      />

      <div className="info-wrapper">
        <div className="info-container">
          <h2 className="info-title">Thông tin cơ bản</h2>

          <div className="info-left">
            <img
              src={imageUrl.startsWith('data:') ? imageUrl : `${API_BASE_URL}/image/${imageUrl || 'default-avatar.png'}`}
              alt="avatar"
              className="info-avatar"
            />
            <Upload showUploadList={false} beforeUpload={() => false} onChange={handleImageChange}>
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </div>

          <div className="info-right">
            <div className="info-row">
              <label>Họ và Tên:</label>
              <p>{userData?._TenTaiKhoan || 'Đang tải...'}</p>
            </div>
            <div className="info-row">
              <label>Số Điện Thoại:</label>
              <p>{userData?._SoDienThoai || 'Đang tải...'}</p>
            </div>
            <div className="info-row">
              <label>Số CCCD:</label>
              <p>{userData?._SoCCCD || 'Đang tải...'}</p>
            </div>
            <div className="info-row">
              <label>Vai trò:</label>
              <p>{userData?._Id_LoaiTaiKhoan?.VaiTro || 'Đang tải...'}</p>
            </div>
            <div className="info-row">
              <label>Năm sinh:</label>
              <p>{userData?._NamSinh || 'Đang tải...'}</p>
            </div>
            <div className="info-row">
              <label>Giới tính:</label>
              <p>{userData?._GioiTinh || 'Đang tải...'}</p>
            </div>

            <div className="info-footer">
              <Button disabled>Quay lại</Button>
              <Button type="primary" onClick={handleUpdateClick}>Cập nhật</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Informations;
