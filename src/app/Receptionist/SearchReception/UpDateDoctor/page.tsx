'use client';

import { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Input, Select, Radio, Upload } from 'antd';
import Tabbar from '@/app/components/shared/Tabbar/Tabbar';
import './upDateDoctor.css';

const { Option } = Select;

export default function DoctorInfo() {
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
            <div className="doctor-info-container">
                <h3 className="title">Thông tin bác sĩ</h3>
                <div className="doctor-info-content">
                    {/* Phần trái: ảnh */}
                    <div className="doctor-info-left">
                        <img
                            src="https://via.placeholder.com/120"
                            alt="avatar"
                            className="avatar"
                        />
                        <Upload>
                            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                        </Upload>
                    </div>

                    {/* Phần giữa: thông tin cơ bản */}
                    <div className="doctor-info-center">
                        <div className="form-row">
                            <label>Họ Và Tên:</label>
                            <Input defaultValue="Trần Văn B" className="short-input" />
                        </div>
                        <div className="form-row">
                            <label>Số Điện Thoại:</label>
                            <Input defaultValue="+123-456-789" className="short-input" />
                        </div>
                        <div className="form-row">
                            <label>Mật Khẩu:</label>
                            <Input.Password defaultValue="*************" className="short-input" />
                        </div>
                        <div className="form-row">
                            <label>Xác Nhận Mật Khẩu:</label>
                            <Input.Password defaultValue="*************" className="short-input" />
                        </div>
                        <div className="form-row">
                            <label>Số CCCD:</label>
                            <Input defaultValue="01234567890" className="short-input" />
                        </div>

                        <div className="form-row">
                            <label>Chuyên khoa:</label>
                            <Input defaultValue="Chấn thương chỉnh hình" className="short-input" />
                        </div>
                    </div>


                    {/* Phần phải: chuyên khoa, học vị, vai trò, năm sinh, giới tính */}
                    <div className="doctor-info-right">
                        <div className="form-row">
                            <label>Học vị:</label>
                            <Input defaultValue="Tiến sĩ" />
                        </div>

                        <div className="form-row">
                            <label>Vai trò:</label>
                            <Input defaultValue="Tiếp nhận"/>
                        </div>

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

                <div className="doctor-info-actions">
                    <Button disabled>Quay lại</Button>
                    <Button type="primary">Lưu</Button>
                </div>
            </div>
        </>
    );
}
