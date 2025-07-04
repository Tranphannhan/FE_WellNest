import React from "react";

interface StatusBadgeProps {
  color: string; // mã màu chính (ví dụ: "#388e3c")
  backgroundColor: string; // màu nền (ví dụ: "#e8f5e9")
  label: string; // nội dung hiển thị (ví dụ: "Đang hoạt động")
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  color,
  backgroundColor,
  label,
}) => {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 8px",
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 500,
        backgroundColor,
        color,
        position: "relative",
      }}
    >
      <span
        style={{
          position: "relative",
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: color,
        }}
      >
        <span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            backgroundColor: color,
            animation:
              "pulseRing 1.8s cubic-bezier(0.215,0.61,0.355,1) infinite",
            opacity: 0.6,
          }}
        />
      </span>
      {label}
    </span>
  );
};

export default StatusBadge;
