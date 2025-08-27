'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Box,
    TextField,
    Typography,
    Paper,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Alert,
    CircularProgress,
} from '@mui/material';
import './MedicineTypeFormLayout.css';
import { FaArrowLeft } from 'react-icons/fa6';
import { FaSave } from 'react-icons/fa';
import BreadcrumbComponent from '@/app/Admin/component/Breadcrumb';

interface FormData {
    TenNhomThuoc: string;
    TrangThaiHoatDong: string;
}

interface Errors {
    TenNhomThuoc?: string;
}

function MedicineTypeFormLayout() {
    const router = useRouter();
    const params = useParams(); // Get dynamic route params
    const id = params?.id as string | undefined; // Access 'id' from dynamic route

    const [formData, setFormData] = useState<FormData>({
        TenNhomThuoc: '',
        TrangThaiHoatDong: 'true',
    });
    const [message, setMessage] = useState<string>('');
    const [errors, setErrors] = useState<Errors>({});
    const [loading, setLoading] = useState<boolean>(false);
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    // Fetch existing medicine type data on mount
    useEffect(() => {
        if (id) {
            const fetchMedicineType = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`${API_BASE_URL}/Nhomthuoc/Detail/${id}`);
                    if (!response.ok) {
                        throw new Error(`Không thể tải dữ liệu loại thuốc: ${response.statusText}`);
                    }
                    const data = await response.json();
                    if (!data || typeof data.TenNhomThuoc === 'undefined') {
                        throw new Error('Dữ liệu trả về không hợp lệ');
                    }
                    setFormData({
                        TenNhomThuoc: data.TenNhomThuoc || '',
                        TrangThaiHoatDong: data.TrangThaiHoatDong ? 'true' : 'false',
                    });
                } catch (err) {
                    setMessage(err instanceof Error ? err.message : 'Lỗi khi tải dữ liệu');
                } finally {
                    setLoading(false);
                }
            };
            fetchMedicineType();
        } else {
            setMessage('Không tìm thấy ID loại thuốc');
        }
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const newErrors: Errors = {};
        if (!formData.TenNhomThuoc.trim()) {
            newErrors.TenNhomThuoc = 'Vui lòng nhập tên loại thuốc';
        }
        if (formData.TenNhomThuoc.length > 100) {
            newErrors.TenNhomThuoc = 'Tên loại thuốc không được vượt quá 100 ký tự';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setErrors({});

        if (!id) {
            setMessage('Không tìm thấy ID loại thuốc');
            return;
        }

        if (!validateForm()) {
            setMessage('Vui lòng kiểm tra các trường thông tin.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/Nhomthuoc/Edit/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    TenNhomThuoc: formData.TenNhomThuoc.trim(),
                    TrangThaiHoatDong: formData.TrangThaiHoatDong === 'true',
                }),
            });

            const result = await response.json();
            if (response.ok) {
                setMessage('Cập nhật loại thuốc thành công!');
            } else {
                setMessage(result.message || `Lỗi khi cập nhật loại thuốc: ${response.statusText}`);
            }
        } catch (err) {
            setMessage(err instanceof Error ? err.message : 'Lỗi khi gửi yêu cầu cập nhật');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.push('/Admin/Medicine/DrugGroup');
    };

    return (
        <div className="AdminContent-Container">
            <BreadcrumbComponent
        items={[
          { title: "Trang chủ", href: "/Admin" },
          { title: "Kho thuốc", href: "/Admin/Medicine/DrugGroup" },
          { title: "Danh sách nhóm thuốc", href: "/Admin/Medicine/DrugGroup" },
          { title: "Sửa nhóm thuốc" },
        ]}
      />
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Paper elevation={3} sx={{ width: '100%' }}>
                    <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
                        Chỉnh Sửa Loại Thuốc
                    </Typography>
                    {message && (
                        <Box sx={{ mb: 2 }}>
                            <div
                                className={
                                    message.includes('thành công') ? 'message-success' : 'message-error'
                                }
                            >
                                <Alert severity={message.includes('thành công') ? 'success' : 'error'}>
                                    {message}
                                </Alert>
                            </div>
                        </Box>
                    )}
                    {loading && <CircularProgress sx={{ mb: 2 }} />}
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 2, width: '60%' }}>
                            <TextField
                                label="Tên Loại Thuốc"
                                name="TenNhomThuoc"
                                value={formData.TenNhomThuoc}
                                onChange={handleInputChange}
                                variant="outlined"
                                error={!!errors.TenNhomThuoc}
                                helperText={errors.TenNhomThuoc}
                                disabled={loading}
                            />
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Trạng Thái</FormLabel>
                                <RadioGroup
                                    row
                                    name="TrangThaiHoatDong"
                                    value={formData.TrangThaiHoatDong}
                                    onChange={handleSelectChange}
                                >
                                    <FormControlLabel value="true" control={<Radio disabled={loading} />} label="Hiện" />
                                    <FormControlLabel value="false" control={<Radio disabled={loading} />} label="Ẩn" />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                            <button
                                type="button"
                                className="bigButton--gray"
                                onClick={handleCancel}
                            >
                                <FaArrowLeft style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="bigButton--blue"
                            >
                                <FaSave style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                                Thêm Loại Thuốc
                            </button>
                        </Box>
                    </form>
                </Paper>
            </Box>
        </div>
    );
}

export default MedicineTypeFormLayout;