import React from 'react';
import './ViewPhotoDetails.css'; // Sẽ tạo file CSS này ở bước 2

// Định nghĩa interface cho props của ViewPhotoDetails
interface ViewPhotoDetailsProps {
  imageSrc: string; // Đường dẫn của ảnh cần hiển thị
  onClose: () => void; // Hàm để đóng popup
}

export default function ViewPhotoDetails({ imageSrc, onClose }: ViewPhotoDetailsProps) {
  return (
    <div className="ViewPhotoDetails-container" onClick={onClose}>
      <div className="ViewPhotoDetails-container_photo_details" onClick={(e) => e.stopPropagation()}>
        <img src={imageSrc} alt="Zoomed Photo" className="ViewPhotoDetails-container_zoomed_photo" />
        {/* Tùy chọn: Thêm nút đóng X ở góc trên bên phải */}
        {/* <button className="close-photo-button" onClick={onClose}>X</button> */}
      </div>
    </div>
  );
}