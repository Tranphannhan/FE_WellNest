'use client';

import { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Input, Select, Radio, Upload } from 'antd';
import Tabbar from '@/app/components/shared/Tabbar/Tabbar';
import './UpDateInfor.css';

const { Option } = Select;

export default function UserInfo() {
    const [gender, setGender] = useState('male');

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
        <div className="user-info-container">
            <h3 className="title">Thông tin cơ bản</h3>
            <div className="user-info-content">
                {/* Ảnh đại diện */}
                <div className="user-info-left">
                    <img src="https://via.placeholder.com/120" alt="avatar" className="avatar" />
                    <Upload>
                        <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                    </Upload>
                </div>

                {/* Form chính giữa */}
                <div className="user-info-center">
                    <div className="form-row">
                        <label>Họ và Tên:</label>
                        <Input defaultValue="Trần Văn B" className="short-input" />
                    </div>
                    <div className="form-row">
                        <label>Số Điện Thoại:</label>
                        <Input defaultValue="+123-456-789" className="short-input" />
                    </div>
                    <div className="form-row">
                        <label>Mật Khẩu:</label>
                        <Input.Password defaultValue="12345678" className="short-input" />
                    </div>
                    <div className="form-row">
                        <label>Xác Nhận Mật Khẩu:</label>
                        <Input.Password defaultValue="12345678" className="short-input" />
                    </div>
                    <div className="form-row">
                        <label>Số CCCD:</label>
                        <Input defaultValue="01234567890" className="short-input" />
                    </div>
                </div>

                {/* Thông tin phụ */}
                <div className="user-info-right">
                    <div className="form-row">
                        <label>Vai trò:</label>
                        <Input defaultValue="Tiếp nhận" disabled />
                    </div>


                    {/* Năm sinh (thêm vertical) */}
                    <div className="form-row vertical">
                        <label>Năm sinh:</label>
                        <Select defaultValue="1990" style={{ width: '55%' }}>
                            {Array.from({ length: 50 }, (_, i) => (
                                <Option key={1990 + i} value={(1990 + i).toString()}>
                                    {1990 + i}
                                </Option>
                            ))}
                        </Select>
                    </div>

                    {/* Giới tính (thêm vertical) */}
                    <div className="form-row vertical">
                        <label>Giới tính:</label>
                        <Radio.Group onChange={e => setGender(e.target.value)} value={gender}>
                            <Radio value="male">Nam</Radio>
                            <Radio value="female">Nữ</Radio>
                        </Radio.Group>
                    </div>
                </div>
            </div>

            <hr className="divider" />

            <div className="user-info-actions">
                <Button>Quay lại</Button>
                <Button type="primary">Lưu</Button>
            </div>
        </div>
        </>
    );
}
