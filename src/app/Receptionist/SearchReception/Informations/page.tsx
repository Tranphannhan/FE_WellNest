'use client';

import React, { useState } from 'react';
import { Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { UploadChangeParam } from 'antd/es/upload/interface';
import { useRouter } from 'next/navigation';
import Tabbar from '@/app/components/shared/Tabbar/Tabbar';
import './Informations.css';

const Informations = () => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const router = useRouter();

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
    router.push('/Receptionist/SearchReception/UpDateInfor');
  };

  const handleBackClick = () => {
    router.back();
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
              src={imageUrl || '/default-avatar.png'}
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
              <p>Võ Văn Quí</p>
            </div>

            <div className="info-row">
              <label>Số Điện Thoại:</label>
              <p>+123-456-789</p>
            </div>

            <div className="info-row">
              <label>Số CCCD:</label>
              <p>01234567890</p>
            </div>

            <div className="info-row">
              <label>Vai trò:</label>
              <p>Tiếp nhận</p>
            </div>

            <div className="info-row">
              <label>Năm sinh:</label>
              <p>2005</p>
            </div>

            <div className="info-row">
              <label>Giới tính:</label>
              <p>Nam</p>
            </div>

            <div className="info-footer">
              <Button onClick={handleBackClick} disabled>Quay lại</Button>
              <Button type="primary" onClick={handleUpdateClick}>Cập nhật</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Informations;
