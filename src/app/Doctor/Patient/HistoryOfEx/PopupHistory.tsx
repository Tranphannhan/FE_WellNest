'use client';
import { useEffect, useState } from 'react';
import { Modal, Table, Button, Spin } from 'antd';
import { showToast, ToastType } from '@/app/lib/Toast';
import { medicalExamiNationHistory } from '@/app/services/DoctorSevices';
import { MedicalExaminationCard } from '@/app/types/patientTypes/patient';

interface ExaminationHistoryItem {
  key: string;
  date: string;
  doctor: string;
  room: string;
  result: string;
  symptom: string;
}

export interface diseaseHistory {
  _id: string;
  Id_PhieuKhamBenh: MedicalExaminationCard;
  TrangThaiHoanThanh: boolean;
  GhiChu: string;
  HuongSuLy: string;
  KetQua: string;
  __v: number;
}

const PopupHistory = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<ExaminationHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Bác sĩ khám',
      dataIndex: 'doctor',
      key: 'doctor',
    },
    {
      title: 'Số phòng khám',
      dataIndex: 'room',
      key: 'room',
    },
    {
      title: 'Chuẩn đoán',
      dataIndex: 'result',
      key: 'result',
    },
    {
      title: 'Chỉ định điều trị',
      dataIndex: 'symptom',
      key: 'symptom',
    },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const local = sessionStorage.getItem('ThongTinBenhNhanDangKham');
      const datalocal = local ? JSON.parse(local) : null;
      const id = datalocal?.Id_TheKhamBenh?._id;

      if (!id) {
        showToast('Không tìm thấy thẻ khám bệnh', ToastType.error);
        return;
      }

      const res = await medicalExamiNationHistory(id);
      console.log(res)

      const converted = res.map((item: diseaseHistory, index: number) => ({
        key: item._id || index,
        date: item.Id_PhieuKhamBenh?.Ngay,
        doctor: item.Id_PhieuKhamBenh?.Id_Bacsi?.TenBacSi || 'Không rõ',
        room: item.Id_PhieuKhamBenh?.Id_Bacsi?.Id_PhongKham?.SoPhongKham || 'Không rõ',
        result: item.KetQua || 'Không ghi',
        symptom: item.HuongSuLy || 'Không ghi',
      }));

      setData(converted);
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử khám bệnh:", error);
      showToast('Lỗi lấy lịch sử khám bệnh', ToastType.error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  return (
    <>
      <a onClick={() => setOpen(true)} style={{ color: "#1890ff", cursor: 'pointer' }}>
        Xem chi tiết
      </a>

      <Modal
        open={open}
        title="Lịch sử khám"
        onCancel={() => setOpen(false)}
        footer={[
          <Button key="back" onClick={() => setOpen(false)}>
            Quay lại
          </Button>
        ]}
        width={1000}
      >
        {loading ? (
          <div className="flex justify-center p-4"><Spin /></div>
        ) : (
          <Table
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 3 }}
            bordered
          />
        )}
      </Modal>
    </>
  );
};

export default PopupHistory;
