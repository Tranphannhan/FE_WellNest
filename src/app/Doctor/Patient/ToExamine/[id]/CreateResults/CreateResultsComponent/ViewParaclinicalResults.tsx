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
  MaXetNghiem?: string;
  TenXetNghiem?: string;
  KetQua?: string;
  ChiSoBinhThuong?: string;
  DonViTinh?: string;
  GhiChu?: string;
  NgayXetNghiem?: string;
  Gio?: string;
  Image?: string;
  LoaiChup?: string;
  VungChup?: string;
  NguonThamChieu?: string;
  GioiHanCanhBao?: string;
  __v?: number;
}

interface ViewParaclinicalResultsProps {
  onClose: () => void;
  dataFromOutside?: NormalTestResult[];
}

export default function ViewParaclinicalResults({
  onClose,
  dataFromOutside,
}: ViewParaclinicalResultsProps) {
  const [showPhotoPopup, setShowPhotoPopup] = useState(false);
  const [currentPhotoSrc, setCurrentPhotoSrc] = useState("");
  const [valueRender, setValueRender] = useState<NormalTestResult[]>([]);
  const { id } = useParams();

  const handleImageClick = (imageSrc: string) => {
    setCurrentPhotoSrc(imageSrc);
    setShowPhotoPopup(true);
  };

  const handleClosePhotoPopup = () => {
    setShowPhotoPopup(false);
    setCurrentPhotoSrc("");
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

  // Hàm helper render các field nếu tồn tại và không rỗng
  const renderDetailItem = (label: string, value?: string) => {
    if (!value || value.trim() === "") return null;
    return (
      <div className="ViewParaclinicalResults-container_card_detail_item">
        <span className="detail-label">{label}</span>
        <span className="detail-value">{value}</span>
      </div>
    );
  };

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
                  <div className="ViewParaclinicalResults-container_test_result_card">
                    {result.Image && (
                      <div
                        className="card-image-wrapper"
                        onClick={() =>
                          handleImageClick(`${API_BASE_URL}/image/${result.Image}`)
                        }
                      >
                        <img
                          src={`${API_BASE_URL}/image/${result.Image}`}
                          alt={result.TenXetNghiem || "Xét nghiệm"}
                          className="card-image"
                        />
                      </div>
                    )}

                    <div className="ViewParaclinicalResults-container_card_details_group">
                      {renderDetailItem("Tên xét nghiệm:", result.TenXetNghiem)}
                      {renderDetailItem("Mã xét nghiệm:", result.MaXetNghiem)}
                      {(result.NgayXetNghiem || result.Gio) && (
                        <div className="ViewParaclinicalResults-container_card_detail_item">
                          <span className="detail-label">Thời gian:</span>
                          <span className="detail-value">
                            {result.NgayXetNghiem}{" "}
                            {result.Gio ? "- " + formatTime(result.Gio) : ""}
                          </span>
                        </div>
                      )}
                      {renderDetailItem("Chỉ số:", result.ChiSoBinhThuong)}
                      {renderDetailItem("Ghi chú:", result.GhiChu)}
                      {renderDetailItem("Loại chụp:", result.LoaiChup)}
                      {renderDetailItem("Vùng chụp:", result.VungChup)}
                      {renderDetailItem("Nguồn tham chiếu:", result.NguonThamChieu)}
                      {renderDetailItem("Giới hạn cảnh báo:", result.GioiHanCanhBao)}
                    </div>

                    <div className="ViewParaclinicalResults-container_card_metrics_group">
                      {renderDetailItem("Đơn vị tính:", result.DonViTinh)}
                      {renderDetailItem("Kết quả:", result.KetQua)}
                    </div>
                  </div>
                </React.Fragment>
              ))
            ) : (
              <NoData
                message="Chưa có kết quả xét nghiệm"
                remind="Vui lòng chờ kết quả xét nghiệm"
              />
            )}
          </div>

          <div className="popup-footer">
            <button className="button secondary-button" onClick={onClose}>
              Quay lại
            </button>
          </div>
        </div>
      </div>

      {showPhotoPopup && (
        <ViewPhotoDetails imageSrc={currentPhotoSrc} onClose={handleClosePhotoPopup} />
      )}
    </div>
  );
}
