'use client';

import React, { useState } from 'react';
import { Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Tabbar from '@/app/components/shared/Tabbar/Tabbar';
import type { UploadChangeParam } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import './Informations.css';

const DoctorInfo = () => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const router = useRouter();

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
    router.push('/Receptionist/SearchReception/UpDateDoctor');
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
      <div className="doctor-wrapper">
        <div className="doctor-container">
          <h2 className="doctor-title">Thông tin bác sĩ</h2>

          <div className="doctor-left">
            <img
              src={imageUrl || '/default-avatar.png'}
              alt="avatar"
              className="doctor-avatar"
            />
            <Upload showUploadList={false} beforeUpload={() => false} onChange={handleImageChange}>
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </div>

          <div className="doctor-right">
            <div className="doctor-row">
              <label>Họ Và Tên:</label>
              <p>Võ Văn Quí</p>
            </div>

            <div className="doctor-row">
              <label>Chuyên khoa:</label>
              <p>Nội tổng hợp</p>
            </div>

            <div className="doctor-row">
              <label>Số Điện Thoại:</label>
              <p>+123-456-789</p>
            </div>

            <div className="doctor-row">
              <label>Số CCCD:</label>
              <p>01234567890</p>
            </div>

            <div className="doctor-row double">
              <div>
                <label>Học vị:</label>
                <p>Tiến sĩ</p>
              </div>
              <div>
                <label>Giới tính:</label>
                <p>Nam</p>
              </div>
            </div>

            <div className="doctor-row double">
              <div>
                <label>Vai trò:</label>
                <p>Tiếp nhận</p>
              </div>
              <div>
                <label>Năm sinh:</label>
                <p>2005</p>
              </div>
            </div>

            <div className="doctor-footer">
              <Button disabled>Quay lại</Button>
              <Button type="primary" onClick={handleUpdateClick}>Cập nhật</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorInfo;
