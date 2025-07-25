"use client";

import React, { useEffect, useState } from "react";
import { Modal, Table, Input, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, CheckOutlined } from "@ant-design/icons";
import { diagnosisType } from "@/app/types/patientTypes/patient";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface DataType {
  key: string;
  symptom: string;
  diagnosis: string;
}

export default function DiagnosisPopup({
  id,
  open,
  onClose,
  readOnly = false, // Mặc định có thể edit
}: {
  id: string;
  open: boolean;
  onClose: () => void;
  readOnly?: boolean; // Tuỳ chọn
}) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<DataType[]>([]);

  useEffect(() => {
    if (!open) return;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/Chi_Tiet_Kham_Lam_Sang/LayTheoPhieuKhamBenh?Id_PhieuKhamBenh=${id}`
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

  const handleEdit = (key: string) => {
    if (readOnly) return; // Không cho edit khi readonly
    setEditingKey(key);
  };

  const handleSave = async (key: string) => {
    const editedItem = dataSource.find((item) => item.key === key);
    if (!editedItem) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/Chi_Tiet_Kham_Lam_Sang/Update/${key}`,
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

      setEditingKey(null);
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
    }
  };

  const handleDelete = async (key: string) => {
    if (readOnly) return; // Không cho xóa khi readonly

    try {
      const response = await fetch(
        `${API_BASE_URL}/Chi_Tiet_Kham_Lam_Sang/Delete/${key}`,
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
    if (readOnly) return; // Không cho chỉnh sửa khi readonly

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
        {isEditing && !readOnly ? (
          <Input
            value={text}
            onChange={(e) =>
              handleInputChange(record.key, field, e.target.value)
            }
            style={{
              width: "100%",
              height: 36,
              textAlign: "center",
              fontSize: 14,
              padding: "4px 8px",
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

  const iconStyle = {
    fontSize: 20,
    width: 20,
    height: 20,
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  };

const baseColumns = [
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
];

const actionColumn = {
  title: <div style={{ textAlign: "center" }}>Hành động</div>,
  key: "action",
  render: (_: string, record: DataType) => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 16,
          backgroundColor: editingKey === record.key ? "#e6f7ff" : undefined,
          borderRadius: 4,
        }}
      >
        {editingKey === record.key ? (
          <Tooltip title="Lưu" mouseEnterDelay={0.1} mouseLeaveDelay={0.1}>
            <CheckOutlined
              style={{
                ...iconStyle,
                color: "#1890ff",
                width: 28,
                height: 28,
              }}
              onClick={() => handleSave(record.key)}
            />
          </Tooltip>
        ) : (
          <Tooltip title="Sửa" mouseEnterDelay={0.1} mouseLeaveDelay={0.1}>
            <EditOutlined
              style={{
                ...iconStyle,
                color: "#1890ff",
                width: 28,
                height: 28,
              }}
              onClick={() => handleEdit(record.key)}
            />
          </Tooltip>
        )}

        <Tooltip title="Xóa" mouseEnterDelay={0.1} mouseLeaveDelay={0.1}>
          <DeleteOutlined
            style={{
              ...iconStyle,
              color: "red",
              width: 28,
              height: 28,
            }}
            onClick={() => handleDelete(record.key)}
          />
        </Tooltip>
      </div>
    );
  },
};

const columns = readOnly
  ? baseColumns
  : [...baseColumns, actionColumn];


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
        rowClassName={(record) =>
          editingKey === record.key ? "editing-row" : ""
        }
      />
    </Modal>
  );
}
