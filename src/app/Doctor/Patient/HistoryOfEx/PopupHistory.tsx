'use client';
import { useEffect, useState } from 'react';
import { Modal, Table, Button, Spin } from 'antd';
import { showToast, ToastType } from '@/app/lib/Toast';
import { medicalExamiNationHistory } from '@/app/services/DoctorSevices';
import { MedicalExaminationCard } from '@/app/types/patientTypes/patient';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
interface ExaminationHistoryItem {
  key: string;
  date: string;
  doctor: string;
  room: string;
  result: string;
  symptom: string;
  phieuKhamBenhId: string;
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

interface Prescription {
  _id: string;
  Id_PhieuKhamBenh: {
    _id: string;
    Id_Bacsi: {
      TenBacSi: string;
    };
  };
  TenDonThuoc: string;
}

interface PrescriptionDetail {
  _id: string;
  Id_Thuoc: {
    TenThuoc: string;
    DonVi: string;
    Gia: number;
  };
  SoLuong: number;
  NhacNho: string;
}

const PopupHistory = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<ExaminationHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [prescriptionDetails, setPrescriptionDetails] = useState<PrescriptionDetail[]>([]);
  const [prescriptionLoading, setPrescriptionLoading] = useState(false);

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
      title: 'Chẩn đoán',
      dataIndex: 'result',
      key: 'result',
    },
    {
      title: 'Chỉ định điều trị',
      dataIndex: 'symptom',
      key: 'symptom',
    },
  ];

  const prescriptionDetailColumns = [
    {
      title: 'Tên thuốc',
      dataIndex: ['Id_Thuoc', 'TenThuoc'],
      key: 'tenThuoc',
    },
    {
      title: 'Đơn vị',
      dataIndex: ['Id_Thuoc', 'DonVi'],
      key: 'donVi',
    },
    {
      title: 'Số lượng',
      dataIndex: 'SoLuong',
      key: 'soLuong',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'NhacNho',
      key: 'nhacNho',
    },
    {
      title: 'Giá',
      dataIndex: ['Id_Thuoc', 'Gia'],
      key: 'gia',
      render: (gia: number) => `${gia} VND`,
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
      console.log(res);

      const converted = res.map((item: diseaseHistory, index: number) => ({
        key: item._id || index,
        date: item.Id_PhieuKhamBenh?.Ngay,
        doctor: item.Id_PhieuKhamBenh?.Id_Bacsi?.TenBacSi || 'Không rõ',
        room: item.Id_PhieuKhamBenh?.Id_Bacsi?.Id_PhongKham?.SoPhongKham || 'Không rõ',
        result: item.KetQua || 'Không ghi',
        symptom: item.HuongSuLy || 'Không ghi',
        phieuKhamBenhId: item.Id_PhieuKhamBenh?._id,
      }));

      setData(converted);
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử khám bệnh:", error);
      showToast('Lỗi lấy lịch sử khám bệnh', ToastType.error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrescriptions = async (phieuKhamBenhId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Donthuoc/LayTheoPhieuKhamBenh/${phieuKhamBenhId}`);
      const prescriptions: Prescription[] = await response.json();
      return prescriptions;
    } catch (error) {
      console.error("Lỗi khi lấy đơn thuốc:", error);
      showToast('Lỗi lấy đơn thuốc', ToastType.error);
      return [];
    }
  };

  const fetchPrescriptionDetails = async (donThuocId: string) => {
    setPrescriptionLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/Donthuoc_Chitiet/LayTheoDonThuoc/${donThuocId}`);
      const details: PrescriptionDetail[] = await response.json();
      setPrescriptionDetails(details);
      setPrescriptionModalOpen(true);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết đơn thuốc:", error);
      showToast('Lỗi lấy chi tiết đơn thuốc', ToastType.error);
    } finally {
      setPrescriptionLoading(false);
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
          </Button>,
        ]}
        width={1000}
      >
        {loading ? (
          <div className="flex justify-center p-4 "><Spin /></div>
        ) : (
          <Table
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 3 }}
            bordered
            expandable={{
              expandedRowRender: (record) => (
                <div className='bg-white border border-gray-200 shadow-sm p-4'>
                  <PrescriptionTable
                    phieuKhamBenhId={record.phieuKhamBenhId}
                    fetchPrescriptions={fetchPrescriptions}
                    onViewDetails={fetchPrescriptionDetails}
                  />
                </div>
              ),
              expandIcon: ({ expanded, onExpand, record }) => (
                <span
                  onClick={(e) => onExpand(record, e)}
                  style={{ cursor: 'pointer', color: 'blue' }}
                >
                  {expanded ? '▼' : '▶'}
                </span>
              ),
            }}
          />
        )}
      </Modal>
      <Modal
        open={prescriptionModalOpen}
        title="Chi tiết đơn thuốc"
        onCancel={() => setPrescriptionModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setPrescriptionModalOpen(false)}>
            Quay lại
          </Button>,
        ]}
        width={800}
      >
        {prescriptionLoading ? (
          <div className="flex justify-center p-4"><Spin /></div>
        ) : (
          <Table
            columns={prescriptionDetailColumns}
            dataSource={prescriptionDetails}
            pagination={false}
            bordered
          />
        )}
      </Modal>
    </>
  );
};

const PrescriptionTable = ({
  phieuKhamBenhId,
  fetchPrescriptions,
  onViewDetails,
}: {
  phieuKhamBenhId: string;
  fetchPrescriptions: (id: string) => Promise<Prescription[]>;
  onViewDetails: (donThuocId: string) => void;
}) => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPrescriptions = async () => {
      setLoading(true);
      const data = await fetchPrescriptions(phieuKhamBenhId);
      setPrescriptions(data);
      setLoading(false);
    };
    loadPrescriptions();
  }, [phieuKhamBenhId, fetchPrescriptions]);

  const columns = [
    {
      title: 'Bác sĩ kê đơn',
      dataIndex: ['Id_PhieuKhamBenh', 'Id_Bacsi', 'TenBacSi'],
      key: 'doctor',
    },
    {
      title: 'Tên đơn thuốc',
      dataIndex: 'TenDonThuoc',
      key: 'tenDonThuoc',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: ( record: Prescription) => (
        <Button
          type="primary"
          onClick={() => onViewDetails(record._id)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={prescriptions}
      pagination={false}
      bordered
      loading={loading}
    />
  );
};

export default PopupHistory;