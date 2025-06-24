'use client';

import React, { useEffect, useState } from "react";
import { Modal, Table } from "antd";
import { EditOutlined, DeleteOutlined, CheckOutlined } from "@ant-design/icons";
import { diagnosisType } from "@/app/types/patientTypes/patient";

interface DataType {
  key: string;
  symptom: string;
  diagnosis: string;
}

export default function DiagnosisPopup({
  id = '684926749c351fd5325793a4',
  open,
  onClose,
}: {
  id: string;
  open: boolean;
  onClose: () => void;
}) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<DataType[]>([]);

  // Fetch data when modal opens
  useEffect(() => {
    if (!open) return;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/Chi_Tiet_Kham_Lam_Sang/LayTheoPhieuKhamBenh?Id_PhieuKhamBenh=${id}`
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();

        const formatted = data.map((item: diagnosisType) => ({
          key: item._id,
          symptom: item.TrieuChung,
          diagnosis: item.ChuanDoanSoBo,
        }));

        setDataSource(formatted);
      } catch (err) {
        console.error("Lỗi khi fetch dữ liệu:", err);
      }
    };

    fetchData();
  }, [id, open]);

  // Start editing a row
  const handleEdit = (key: string) => {
    setEditingKey(key);
  };

  // Save changes to a row
  const handleSave = async (key: string) => {
    const editedItem = dataSource.find((item) => item.key === key);
    if (!editedItem) return;

    try {
      const response = await fetch(
        `http://localhost:5000/Chi_Tiet_Kham_Lam_Sang/Update/${key}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            TrieuChung: editedItem.symptom,
            ChuanDoanSoBo: editedItem.diagnosis,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setEditingKey(null); // Exit editing mode
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
    }
  };

  // Delete a row
  const handleDelete = async (key: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/Chi_Tiet_Kham_Lam_Sang/Delete/${key}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newData = dataSource.filter((item) => item.key !== key);
      setDataSource(newData);
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
    }
  };

  const handleInputChange = (
    key: string,
    field: keyof DataType,
    value: string
  ) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => item.key === key);
    if (index !== -1) {
      newData[index][field] = value;
      setDataSource(newData);
    }
  };

  const renderCell = (
    text: string,
    record: DataType,
    field: keyof DataType
  ) => {
    const isEditing = editingKey === record.key;
    return (
      <div style={{ textAlign: "center", minHeight: 40 }}>
        {isEditing ? (
          <input
            value={text}
            onChange={(e) =>
              handleInputChange(record.key, field, e.target.value)
            }
            style={{
              width: "100%",
              height: "36px",
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              textAlign: "center",
              fontSize: "14px",
              padding: 0,
              margin: 0,
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          />
        ) : (
          <span
            style={{
              lineHeight: "36px",
              display: "inline-block",
              width: "100%",
              fontSize: "14px",
            }}
          >
            {text}
          </span>
        )}
      </div>
    );
  };

  const columns = [
    {
      title: <div style={{ textAlign: "center" }}>Triệu chứng</div>,
      dataIndex: "symptom",
      key: "symptom",
      render: (text: string, record: DataType) =>
        renderCell(text, record, "symptom"),
    },
    {
      title: <div style={{ textAlign: "center" }}>Chuẩn đoán sơ bộ</div>,
      dataIndex: "diagnosis",
      key: "diagnosis",
      render: (text: string, record: DataType) =>
        renderCell(text, record, "diagnosis"),
    },
    {
      title: <div style={{ textAlign: "center" }}>Hành động</div>,
      key: "action",
      render: (_: string, record: DataType) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <span
            style={{
              width: 28,
              height: 28,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {editingKey === record.key ? (
              <CheckOutlined
                style={{
                  fontSize: 20,
                  color: "#1890ff",
                  cursor: "pointer",
                }}
                onClick={() => handleSave(record.key)}
              />
            ) : (
              <EditOutlined
                style={{
                  fontSize: 20,
                  color: "#1890ff",
                  cursor: "pointer",
                }}
                onClick={() => handleEdit(record.key)}
              />
            )}
          </span>

          <span
            style={{
              width: 28,
              height: 28,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <DeleteOutlined
              style={{ fontSize: 20, color: "red", cursor: "pointer" }}
              onClick={() => handleDelete(record.key)}
            />
          </span>
        </div>
      ),
    },
  ];

  return (
    <Modal open={open} onCancel={onClose} footer={null} width={800}>
      <div style={{ textAlign: "left", fontSize: 16, marginBottom: 10 }}>
        Danh sách triệu chứng & chuẩn đoán sơ bộ
      </div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        bordered
      />
    </Modal>
  );
}