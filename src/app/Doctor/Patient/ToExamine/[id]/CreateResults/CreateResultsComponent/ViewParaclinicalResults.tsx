"use client";
import React, { useEffect, useState } from "react";
import "./ViewParaclinicalResults.css";
import ViewPhotoDetails from "./ViewPhotoDetails";
import { getResultsByMedicalExaminationFormId } from "@/app/services/DoctorSevices";
import { useParams } from "next/navigation";
import { formatTime } from "@/app/lib/Format";
import NoData from "@/app/components/ui/Nodata/Nodata";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface NormalTestResult {
  _id: string;
  Id_PhieuKhamBenh: string;
  Id_YeuCauXetNghiem: string;
  Id_NguoiXetNghiem: string;
  MaXetNghiem: string;
  TenXetNghiem: string;
  KetQua: string;
  ChiSoBinhThuong: string;
  DonViTinh: string;
  GhiChu: string;
  NgayXetNghiem: string;
  Gio: string;
  Image: string;
  __v: number;
}

interface ViewParaclinicalResultsProps {
  onClose: () => void;
  dataFromOutside?: NormalTestResult[]; // thêm optional prop
}


export default function ViewParaclinicalResults({
  onClose,
  dataFromOutside, 
}: ViewParaclinicalResultsProps) {

  const [showPhotoPopup, setShowPhotoPopup] = useState(false);
  const [currentPhotoSrc, setCurrentPhotoSrc] = useState("");
  const [valueRender, setValueRender] = useState<NormalTestResult[]>([]);
  const { id } = useParams();

  // 3. Hàm xử lý khi click vào ảnh
  const handleImageClick = (imageSrc: string) => {
    setCurrentPhotoSrc(imageSrc);
    setShowPhotoPopup(true);
  };

  // 4. Hàm đóng popup ảnh
  const handleClosePhotoPopup = () => {
    setShowPhotoPopup(false);
    setCurrentPhotoSrc(""); // Reset đường dẫn ảnh
  };

  const handleGetResultsByMedicalExaminationFormId = async () => {
    const res = await getResultsByMedicalExaminationFormId(id as string);
    if (res) setValueRender(res);
  };

useEffect(() => {
  if (dataFromOutside && dataFromOutside.length > 0) {
    setValueRender(dataFromOutside);
  } else {
    handleGetResultsByMedicalExaminationFormId();
  }
}, []);

  return (
    <div className="ViewParaclinicalResults-container">
      <div className="ViewParaclinicalResults-container_outer_wrapper">
        <span className="ViewParaclinicalResults-container_breadcrumb_outside">
          Bệnh nhân &gt;{" "}
          <span style={{ color: "#3497F9" }}>Kết quả xét nghiệm</span>
        </span>
        <div
          className="ViewParaclinicalResults-container_popup"
          onClick={(e) => e.stopPropagation()}
        >
          <h4 className="ViewParaclinicalResults-container_popup_main_title">
            Kết quả xét nghiệm
          </h4>

          <div className="ViewParaclinicalResults-container_products_frame">
            {valueRender.length > 0 ? (
              valueRender.map((result) => (
                <React.Fragment key={result._id}>
                  {" "}
                  {/* Sử dụng React.Fragment để bọc và key */}
                  <div className="ViewParaclinicalResults-container_test_result_card">
                    <div
                      className="card-image-wrapper"
                      onClick={() =>
                        handleImageClick(
                          `${API_BASE_URL}/Image/${result.Image}`
                        )
                      }
                    >
                      <img
                        src={`${API_BASE_URL}/Image/${result.Image}`}
                        alt={result.TenXetNghiem}
                        className="card-image"
                      />
                    </div>
                    <div className="ViewParaclinicalResults-container_card_details_group">
                      <div className="ViewParaclinicalResults-container_card_detail_item">
                        <span className="detail-label">Tên xét nghiệm:</span>
                        <span className="detail-value">
                          {result.TenXetNghiem}
                        </span>
                      </div>
                      <div className="ViewParaclinicalResults-container_card_detail_item">
                        <span className="detail-label">Mã xét nghiệm:</span>
                        <span className="detail-value">
                          {result.MaXetNghiem}
                        </span>
                      </div>
                      <div className="ViewParaclinicalResults-container_card_detail_item">
                        <span className="detail-label">Thời gian:</span>
                        <span className="detail-value">
                          {result.NgayXetNghiem +
                            " - " +
                            formatTime(result.Gio)}
                        </span>
                      </div>
                      <div className="ViewParaclinicalResults-container_card_detail_item">
                        <span className="detail-label">Chỉ số:</span>
                        <span className="detail-value normal-range">
                          {result.ChiSoBinhThuong}
                        </span>
                      </div>
                      <div className="ViewParaclinicalResults-container_card_detail_item">
                        <span className="detail-label note-label">
                          Ghi chú:
                        </span>
                        <span className="detail-value note-value">
                          {result.GhiChu}
                        </span>
                      </div>
                    </div>
                    <div className="ViewParaclinicalResults-container_card_metrics_group">
                      <div className="metric-item">
                        <span className="metric-label">Đơn vị tính: </span>
                        <span className="metric-value">{result.DonViTinh}</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-label">Kết quả: </span>
                        <span className="metric-value result-value">
                          {result.KetQua}
                        </span>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ))
            ) : (
              <NoData
                message="Chưa có kết quả xét nghiệm"
                remind="Vui lòng chờ kết quả xét nghiệm"
              ></NoData>
            )}
          </div>

          <div className="popup-footer">
            <button className="button secondary-button" onClick={onClose}>
              Quay lại
            </button>
          </div>
        </div>{" "}
        {/* Kết thúc popup-container */}
      </div>{" "}
      {/* Kết thúc outer-wrapper */}
      {/* 6. Conditional rendering của ViewPhotoDetails */}
      {showPhotoPopup && (
        <ViewPhotoDetails
          imageSrc={currentPhotoSrc}
          onClose={handleClosePhotoPopup}
        />
      )}
    </div>
  );
}
