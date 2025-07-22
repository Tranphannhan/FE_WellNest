'use client';

import { useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Input, Select, Radio, Upload } from 'antd';
import Tabbar from '@/app/components/shared/Tabbar/Tabbar';
import './upDateDoctor.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const { Option } = Select;

interface KhoaInfo {
    _id: string;
    TenKhoa: string;
}

export default function UpDateDoctor() {
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [cccd, setCccd] = useState('');
    const [hocVi, setHocVi] = useState('');
    const [vaiTro, setVaiTro] = useState('');
    const [namSinh, setNamSinh] = useState('1990');
    const [gender, setGender] = useState('Nam');
    const [khoa, setKhoa] = useState<KhoaInfo | null>(null);
    const [imageUrl, setImageUrl] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        const data = localStorage.getItem('doctorData');
        if (data) {
            const parsed = JSON.parse(data);

            setId(parsed._id || '');
            setName(parsed._TenBacSi || '');
            setPhone(parsed._SoDienThoai || '');
            setCccd(parsed._CCCD || '');
            setHocVi(parsed._HocVi || '');
            setVaiTro(parsed._VaiTro || '');
            setNamSinh(parsed._NamSinh?.toString() || '1990');
            setGender(parsed._GioiTinh || 'Nam');
            setImageUrl(parsed._Image ? parsed._Image : '/default-avatar.png');

            if (parsed._ID_Khoa && typeof parsed._ID_Khoa === 'object') {
                setKhoa(parsed._ID_Khoa);
            } else if (typeof parsed._ID_Khoa === 'string') {
                setKhoa({ _id: parsed._ID_Khoa, TenKhoa: parsed._ID_Khoa });
            }
        }
    }, []);

    const handleSave = async () => {
        if (password && password.length < 6) {
            alert('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        if (password && password !== confirmPassword) {
            alert('Mật khẩu và xác nhận không khớp');
            return;
        }

        const formData = new FormData();
        formData.append('TenBacSi', name.trim());

        if (selectedFile) {
            formData.append('Image', selectedFile);
        }

        if (password.trim() !== '') {
            formData.append('Matkhau', password.trim());

        }

        try {
            const res = await fetch(`${API_BASE_URL}/Bacsi/Edit/${id}`, {
                method: 'PUT',
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Cập nhật thất bại');

            alert('Cập nhật thành công!');
            localStorage.removeItem('doctorData');

            if (data?.data?.Image) {
                setImageUrl(data.data.Image);
            }
        } catch (err) {
            console.error('Lỗi cập nhật:', err);
            alert('Có lỗi xảy ra khi cập nhật!');
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
            <div className="doctor-info-container">
                <h3 className="title">Thông tin bác sĩ</h3>
                <div className="doctor-info-content">
                    <div className="doctor-info-left">
                        <img
                            src={
                                imageUrl.startsWith('blob:')
                                    ? imageUrl
                                    : imageUrl
                                    ? `${API_BASE_URL}/image/${imageUrl}`
                                    : '/default-avatar.png'
                            }
                            alt="avatar"
                            className="info-avatar"
                        />
                        <Upload
                            showUploadList={false}
                            beforeUpload={(file) => {
                                setSelectedFile(file);
                                setImageUrl(URL.createObjectURL(file));
                                return false;
                            }}
                        >
                            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                        </Upload>
                    </div>

                    <div className="doctor-info-center">
                        <div className="form-row">
                            <label>Họ Và Tên:</label>
                            <Input value={name} onChange={e => setName(e.target.value)} className="short-input" />
                        </div>
                        <div className="form-row">
                            <label>Số Điện Thoại:</label>
                            <Input value={phone} disabled className="short-input" />
                        </div>
                        <div className="form-row">
                            <label>Mật Khẩu:</label>
                            <Input.Password value={password} onChange={e => setPassword(e.target.value)} className="short-input" />
                        </div>
                        <div className="form-row">
                            <label>Xác Nhận Mật Khẩu:</label>
                            <Input.Password value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="short-input" />
                        </div>
                        <div className="form-row">
                            <label>Số CCCD:</label>
                            <Input value={cccd} disabled className="short-input" />
                        </div>
                        <div className="form-row">
                            <label>Chuyên khoa:</label>
                            <Input value={khoa?.TenKhoa || ''} disabled className="short-input" />
                        </div>
                    </div>

                    <div className="doctor-info-right">
                        <div className="form-row">
                            <label>Học vị:</label>
                            <Input value={hocVi} disabled />
                        </div>
                        <div className="form-row">
                            <label>Vai trò:</label>
                            <Input value={vaiTro} disabled />
                        </div>
                        <div className="form-row vertical">
                            <label>Năm sinh:</label>
                            <Select value={namSinh} disabled style={{ width: '55%' }}>
                                {Array.from({ length: 50 }, (_, i) => {
                                    const year = 1990 + i;
                                    return (
                                        <Option key={year} value={year.toString()}>
                                            {year}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </div>
                        <div className="form-row vertical">
                            <label>Giới tính:</label>
                            <Radio.Group value={gender} disabled>
                                <Radio value="Nam">Nam</Radio>
                                <Radio value="Nữ">Nữ</Radio>
                            </Radio.Group>
                        </div>
                    </div>
                </div>

                <hr className="divider" />

                <div className="doctor-info-actions">
                    <Button onClick={() => history.back()}>Quay lại</Button>
                    <Button type="primary" onClick={handleSave}>
                        Lưu
                    </Button>
                </div>
            </div>
        </>
    );
}
