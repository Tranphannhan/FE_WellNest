'use client';
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Typography, message } from 'antd';
import { PrescriptionDetail } from '@/app/Doctor/Patient/ToExamine/[id]/CreateResults/CreateResultsComponent/Prescription';
import { updatePrescriptionNote } from '@/app/services/Pharmacist';

const { Title } = Typography;
const { TextArea } = Input;

interface ListofDrugsPopupProps {
    isOpen: boolean;
    onClose: () => void;
    medication: PrescriptionDetail | null;
}

const ListofDrugsPopup: React.FC<ListofDrugsPopupProps> = ({ isOpen, onClose, medication }) => {
    const [note, setNote] = useState(medication?.NhacNho || '');
    const [quantity, setQuantity] = useState(medication?.SoLuong || 0);
    const [form] = Form.useForm();

    useEffect(() => {
        console.log(note,quantity)
        setNote(medication?.NhacNho || '');
        setQuantity(medication?.SoLuong || 0);
        form.setFieldsValue({
            NhacNho: medication?.NhacNho || '',
            SoLuong: medication?.SoLuong || 0,
        });
    }, [medication, form]);

    const handleSave = async () => {
        if (!medication) {
            message.error('Không có thuốc được chọn');
            return;
        }

        try {
            await form.validateFields();
            const values = form.getFieldsValue(); // Lấy giá trị form
            await updatePrescriptionNote(medication._id, {
                SoLuong: values.SoLuong,
                NhacNho: values.NhacNho,
            });
            message.success('Cập nhật thành công');
            onClose(); // Trigger reload
        } catch (error) {
            console.error('Lỗi cập nhật:', error);
            message.error('Cập nhật thất bại, vui lòng thử lại');
        }
    };

    return (
        <Modal
            title={<Title level={4}>Chỉnh sửa ghi chú cho {medication?.Id_Thuoc.TenThuoc}</Title>}
            open={isOpen}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Hủy
                </Button>,
                <Button key="save" type="primary" onClick={handleSave}>
                    Lưu
                </Button>,
            ]}
            width={400}
        >
            <Form form={form} layout="vertical">
                <Form.Item label="Tên thuốc" style={{ fontWeight: 600 }}>
                            <Input
                                style={{ color: '#808080', fontWeight: 400 }}
                                value={medication?.Id_Thuoc.TenThuoc}
                                disabled
                            />
                        </Form.Item>
                <div style={{ display: 'flex', gap: '12px' }}>
                    
                    <Form.Item
                        style={{ flex: 1, fontWeight: 600 }}
                        label="Số lượng"
                        name="SoLuong"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số lượng' },
                            {
                                validator: (_, value) => {
                                    if (!value || isNaN(value)) return Promise.reject('Số lượng phải là số');
                                    if (Number(value) <= 0) return Promise.reject('Số lượng phải lớn hơn 0');
                                    return Promise.resolve();
                                }
                            },
                        ]}
                    >
                        <Input
                            type="number"
                            placeholder="Nhập số lượng"
                            onChange={(e) =>
                                form.setFieldsValue({ SoLuong: Number(e.target.value) })
                            }
                        />
                    </Form.Item>

                    <Form.Item
                        style={{ flex: 1, fontWeight: 600 }}
                        label="Đơn vị"
                    >
                        <Input
                            style={{ color: '#808080', fontWeight: 400 }}
                            value={medication?.Id_Thuoc.DonVi || medication?.DonVi}
                            disabled
                        />
                    </Form.Item>
                </div>

                <Form.Item
                    style={{ fontWeight: 600 }}
                    label="Ghi chú"
                    name="NhacNho"
                    rules={[{ max: 500, message: 'Ghi chú không được vượt quá 500 ký tự' }]}>
                    <TextArea placeholder="Nhập ghi chú" rows={3} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ListofDrugsPopup;