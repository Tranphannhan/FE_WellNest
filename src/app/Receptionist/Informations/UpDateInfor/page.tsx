'use client';

import { useState, useEffect } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Input, Radio, Upload, message } from 'antd';
import Tabbar from '@/app/components/shared/Tabbar/Tabbar';
import './UpDateInfor.css';

import API_BASE_URL from "@/app/config";

export default function UserInfo() {
    interface UserData {
        _id: string;
        _TenTaiKhoan?: string;
        _SoDienThoai?: string;
        _SoCCCD?: string;
        _NamSinh?: string;
        _Gioi_Tinh?: string;
        _Image?: string;
        _Id_LoaiTaiKhoan?: {
            VaiTro?: string;
        };
    }

    const [userData, setUserData] = useState<UserData | null>(null);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [image, setImage] = useState<File | null>(null);

    const [phone, setPhone] = useState('');
    const [cccd, setCccd] = useState('');
    const [gender, setGender] = useState('');

    useEffect(() => {
        const data = localStorage.getItem('userInfo');
        if (data) {
            const parsed = JSON.parse(data);
            setUserData(parsed);
            setName(parsed._TenTaiKhoan || '');
            setPhone(parsed._SoDienThoai || '');
            setCccd(parsed._SoCCCD || '');
            setGender(parsed._Gioi_Tinh === 'Nữ' ? 'female' : 'male');
        }
    }, []);

    const handleSave = async () => {
        if (!name.trim()) {
            message.warning('Tên không được để trống');
            return;
        }

        if (password !== confirmPassword) {
            message.error('Mật khẩu xác nhận không khớp');
            return;
        }

        if (!userData) {
            message.error('Không tìm thấy thông tin người dùng');
            return;
        }

        const formData = new FormData();
        formData.append('TenTaiKhoan', name);
        if (password.trim()) formData.append('MatKhau', password);
        if (image) {
            formData.append('Image', image);
            console.log("✅ Appended image:", image.name);
        } else {
            console.warn("⚠️ Không có ảnh mới được chọn");
        }

        try {
            const res = await fetch(`${API_BASE_URL}/Tai_Khoan/Edit/${userData._id}`, {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Cập nhật thất bại');
            message.success('Cập nhật thành công');
            localStorage.removeItem('userInfo');
            window.location.href = '/Receptionist/SearchReception/Informations';
        } catch (err) {
            console.error(err);
            message.error('Lỗi khi cập nhật');
        }
    };

    return (
        <>
            <Tabbar
                tabbarItems={{
                    tabbarItems: [
                        { text: 'Thay đổi thông tin', link: '/Receptionist/Informations' },
                    ],
                }}
            />

            <div className="user-info-container">
                <h3 className="title">Cập nhật thông tin</h3>
                <div className="user-info-content">
                    <div className="user-info-left">
                        <div className="avatar-wrapper">
                            <img
                                src={image ? URL.createObjectURL(image) : `${API_BASE_URL}/image/${userData?._Image || 'default-avatar.png'}`}
                                alt="avatar"
                                className="avatar"
                            />
                            <div className="upload-btn-wrapper">
                                <Upload
                                    showUploadList={false}
                                    accept="image/*"
                                    beforeUpload={(file) => {
                                        setImage(file);
                                        return false;
                                    }}
                                >
                                    <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                                </Upload>
                            </div>
                        </div>
                    </div>


                    <div className="user-info-center">
                        <div className="form-row">
                            <label>Họ và Tên:</label>
                            <Input className="short-input" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="form-row">
                            <label>Mật khẩu mới:</label>
                            <Input.Password className="short-input" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="form-row">
                            <label>Xác nhận mật khẩu:</label>
                            <Input.Password className="short-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                        <div className="form-row">
                            <label>Số Điện Thoại:</label>
                            <Input className="short-input" value={phone} disabled />
                        </div>
                        <div className="form-row">
                            <label>Số CCCD:</label>
                            <Input className="short-input" value={cccd} disabled />
                        </div>

                    </div>

                    <div className="user-info-right">
                        <div className="form-row">
                            <label>Vai trò:</label>
                            <Input value={userData?._Id_LoaiTaiKhoan?.VaiTro || ''} disabled />
                        </div>
                        <div className="form-row vertical">
                            <label>Giới tính:</label>
                            <Radio.Group value={gender} disabled>
                                <Radio value="male">Nam</Radio>
                                <Radio value="female">Nữ</Radio>
                            </Radio.Group>
                        </div>
                    </div>
                </div>

                <hr className="divider" />
                <div className="user-info-actions">
                    <Button onClick={() => history.back()}>Quay lại</Button>
                    <Button type="primary" onClick={handleSave}>Lưu</Button>
                </div>
            </div>
        </>
    );
}
