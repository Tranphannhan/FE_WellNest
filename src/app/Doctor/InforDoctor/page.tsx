'use client';

import React, { useEffect, useState } from 'react';
import { Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Tabbar from '@/app/components/shared/Tabbar/Tabbar';
import type { UploadChangeParam } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { jwtDecode } from 'jwt-decode';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import './Informations.css';

const DoctorInfo = () => {
  interface KhoaInfo {
    _id: string;
    TenKhoa: string;
    __v?: number;
    TrangThaiHoatDong?: boolean;
    CanLamSang?: boolean;
  }

  interface DoctorForm {
    _TenBacSi?: string;
    _ID_Khoa?: string | KhoaInfo;
    _SoDienThoai?: string;
    _SoCCCD?: string;
    _HocVi?: string;
    _GioiTinh?: string;
    _VaiTro?: string;
    _NamSinh?: number;
    _Image?: string;
  }

  const [form, setForm] = useState<DoctorForm>({});
  const [imageUrl, setImageUrl] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const getCookie = (name: string): string | null => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
      return null;
    };

    const token = getCookie('token');

    if (token) {
      try {
        const decoded = jwtDecode<DoctorForm>(token);
        setForm(decoded);
        if (decoded._Image) {
          setImageUrl(decoded._Image);
        } else {
          setImageUrl('/default-avatar.png');
        }
      } catch (err) {
        console.error('Lỗi khi decode token:', err);
      }
    } else {
      console.warn('Không tìm thấy token trong cookie');
    }
  }, []);

  const handleImageChange = (info: UploadChangeParam<UploadFile>) => {
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
    localStorage.setItem('doctorData', JSON.stringify(form));
    router.push('/Doctor/UpDateDoctor');
  };

  // Helper để lấy tên khoa
  const getKhoaDisplay = () => {
    if (!form._ID_Khoa) return '---';
    if (typeof form._ID_Khoa === 'object' && '_id' in form._ID_Khoa) {
      return form._ID_Khoa.TenKhoa || '---';
    }
    return form._ID_Khoa;
  };

  return (
    <>
      <Tabbar
        tabbarItems={{
          tabbarItems: [
            { text: 'Thông tin bác sĩ', link: '/Doctor/InforDoctor' },
          ],
        }}
      />
      <div className="doctor-wrapper">
        <div className="doctor-container">
          <h2 className="doctor-title">Thông tin bác sĩ</h2>

          <div className="doctor-left">
            <img src={API_BASE_URL+"/image/"+imageUrl || '/default-avatar.png'} alt="avatar" className="info-avatar" />
            <Upload showUploadList={false} beforeUpload={() => false} onChange={handleImageChange}>
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </div>

          <div className="doctor-right">
            <div className="doctor-row">
              <label>Họ Và Tên:</label>
              <p>{form._TenBacSi || '---'}</p>
            </div>

            <div className="doctor-row">
              <label>Chuyên khoa:</label>
              <p>{getKhoaDisplay()}</p>
            </div>

            <div className="doctor-row">
              <label>Số Điện Thoại:</label>
              <p>{form._SoDienThoai || '---'}</p>
            </div>

            <div className="doctor-row">
              <label>Số CCCD:</label>
              <p>{form._SoCCCD || '---'}</p>
            </div>

            <div className="doctor-row double">
              <div>
                <label>Học vị:</label>
                <p>{form._HocVi || '---'}</p>
              </div>
              <div>
                <label>Giới tính:</label>
                <p>{form._GioiTinh || '---'}</p>
              </div>
            </div>

            <div className="doctor-row double">
              <div>
                <label>Vai trò:</label>
                <p>{form._VaiTro || '---'}</p>
              </div>
              <div>
                <label>Năm sinh:</label>
                <p>{form._NamSinh || '---'}</p>
              </div>
            </div>

            <div className="doctor-footer">
              <Button disabled>Quay lại</Button>
              <Button type="primary" onClick={handleUpdateClick}>
                Cập nhật
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorInfo;
