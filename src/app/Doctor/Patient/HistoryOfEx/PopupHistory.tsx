'use client';
import { useState } from 'react';
import { Modal, Table, Button } from 'antd';

const PopupHistory = () => {
  const [open, setOpen] = useState(false);

  const data = [
    {
      key: '1',
      date: '01/06/2025',
      doctor: 'Dr. Nguyen Thanh Nam',
      room: '1',
      symptom: 'Nhức đầu, buồn nôn, tiêu chảy, khó thở, sốt 37 độ, suy thận',
      result: 'Tình trạng nghiêm trọng, nghi ngờ suy đa tạng/nhiễm trùng nặng. Cần nhập viện cấp cứu để đánh giá và điều trị khẩn cấp.',
    },
    {
      key: '2',
      date: '01/04/2024',
      doctor: 'Dr. Nguyen Thanh Nam',
      room: '1',
      symptom: 'Tê bì tay chân, co giật, đau bụng dữ dội, phù chân, mệt mỏi cực độ.',
      result: 'Tình trạng cấp cứu, nghi ngờ rối loạn thần kinh, chuyển hóa hoặc nhiễm độc nặng.',
    },
    {
      key: '3',
      date: '01/01/2024',
      doctor: 'Dr. Nguyen Thanh Nam',
      room: '1',
      symptom: 'Đau ngực, khó thở, co giật, vàng da',
      result: 'Tình trạng cấp tính, nguy hiểm. Nghi ngờ vấn đề tim mạch/hô hấp, thần kinh hoặc gan nghiêm trọng.',
    }
  ];

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
      title: 'Triệu chứng',
      dataIndex: 'symptom',
      key: 'symptom',
    },
    {
      title: 'Kết quả',
      dataIndex: 'result',
      key: 'result',
    },
  ];

  return (
    <>
      <a onClick={() => setOpen(true)} style={{ color: "#1890ff", cursor: 'pointer' }}>
        Xem chi tiết
      </a>

      <Modal
        open={open}
        title="Những kết quả khám tại đây"
        onCancel={() => setOpen(false)}
        footer={[
          <Button key="back" onClick={() => setOpen(false)}>
            Quay lại
          </Button>
        ]}
        width={1000}
      >
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 2 }}
          bordered
        />
      </Modal>
    </>
  );
};

export default PopupHistory;
