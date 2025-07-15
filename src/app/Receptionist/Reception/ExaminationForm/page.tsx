"use client";

import React, { useEffect, useState } from "react";
import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import "./ExaminationForm.css";
import PreviewExaminationForm from "./PreviewExaminationForm";
import type { ExaminationForm } from "@/app/types/receptionTypes/receptionTypes";
import { checkPay, handlePay } from "@/app/services/ReceptionServices";
import { showToast, ToastType } from "@/app/lib/Toast";
import { useRouter } from "next/navigation";
import ModalComponent from "@/app/components/shared/Modal/Modal";

export default function ExaminationForm() {
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [contentModal, setContentModal] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [callBackModal, setCallBackModal] = useState<() => void>(() => {});
  const [valueRender, setValueRender] = useState<ExaminationForm | null | undefined>(undefined);
  const [statusPay, setStatusPay] = useState<boolean>(false);
  const router = useRouter();

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  async function Pay() {
    if (!valueRender?.Id_PhieuKhamBenh) {
      return showToast("Chưa có mã phiếu khám bệnh", ToastType.error);
    }

    const result = await handlePay(valueRender.Id_PhieuKhamBenh);

    if (result?.status === true && result?.QueueNumber) {
      showToast(result.message, ToastType.success);

      const newValue = {
        ...valueRender,
        QueueNumber: result.QueueNumber,
      };

      setValueRender(newValue);
      sessionStorage.setItem("ThongTinPhieuKham", JSON.stringify(newValue));
      setStatusPay(true);
      setShowModal(false);
    } else if (result) {
      showToast(result.message, ToastType.error);
    }
  }

  function cancelPayment() {
    showToast("Đã hủy thanh toán", ToastType.warn);
    router.push("/Receptionist/Reception");
  }

  function processingCompleted() {
    showToast("Đã hoàn thành tiếp nhận", ToastType.success);
    router.push("/Receptionist/Reception");
  }

  async function checkRender(id: string) {
    const stutus = await checkPay(id);
    if (stutus) setStatusPay(stutus?.status);
  }

  useEffect(() => {
    try {
      const dataLocal = sessionStorage.getItem("ThongTinPhieuKham");
      if (dataLocal) {
        const dataOb = JSON.parse(dataLocal);
        checkRender(dataOb.Id_PhieuKhamBenh);
        setValueRender(dataOb);
      } else {
        setValueRender(null);
      }
    } catch (error) {
      console.error("Lỗi khi đọc dữ liệu từ sessionStorage:", error);
      setValueRender(null);
    }
  }, []);

  const currentCollectorName = "Trần Phan Nhân";

  const handleOpenPreview = () => setShowPreviewModal(true);
  const handleClosePreview = () => setShowPreviewModal(false);

  return (
    <>
      <Tabbar
        tabbarItems={{
          tabbarItems: [
            {
              text: "Phiếu Khám",
              link: "/Receptionist/Reception/ExaminationForm",
            },
          ],
        }}
      />
      <ModalComponent
        Data_information={{
          show: showModal,
          content: contentModal,
          callBack: callBackModal,
          handleClose: handleClose,
          handleShow: handleShow,
        }}
      />

      {valueRender === undefined ? (
        <div className="ExaminationForm-Container__loading">
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : valueRender === null ? (
        <div className="ExaminationForm-Container__no-data">
          <h3>Không có dữ liệu phiếu khám để hiển thị.</h3>
        </div>
      ) : (
        <>
          <div className="ExaminationForm-Container">
            <div className="ExaminationForm-Container__header">
              <h2>Thông tin phiếu khám</h2>
              <div
                className="ExaminationForm-Container__print"
                style={
                  !statusPay
                    ? { pointerEvents: "none", userSelect: "none", border: "1px solid gray" }
                    : {}
                }
              >
                <button
                  className="ExaminationForm-Container__print__btn"
                  style={
                    !statusPay
                      ? { pointerEvents: "none", userSelect: "none", color: "gray" }
                      : {}
                  }
                  onClick={handleOpenPreview}
                >
                  <span>
                    <i className="bi bi-printer-fill"></i>
                  </span>{" "}
                  In phiếu khám
                </button>
              </div>
            </div>

            {/* FORM GRID */}
            <div className="form-grid grid-4">
              <div className="ExaminationForm-Container__form__group">
                <label>Họ và tên:</label>
                <input type="text" defaultValue={valueRender.fullName} readOnly />
              </div>
              <div className="ExaminationForm-Container__form__group">
                <label>Số CCCD:</label>
                <input type="text" defaultValue={valueRender.cccd} readOnly />
              </div>
              <div className="ExaminationForm-Container__form__group">
                <label>Ngày sinh:</label>
                <input type="text" defaultValue={valueRender.dob} readOnly />
              </div>
              <div className="ExaminationForm-Container__form__group">
                <label>Số điện thoại:</label>
                <input type="text" defaultValue={valueRender.phone} readOnly />
              </div>
            </div>

            <div className="form-grid grid-3">
              <div className="ExaminationForm-Container__form__group">
                <label>Giới tính:</label>
                <input type="text" defaultValue={valueRender.gender} readOnly />
              </div>
              <div className="ExaminationForm-Container__form__group">
                <label>Chiều cao:</label>
                <div className="ExaminationForm-Container__input__unit">
                  <input
                    type="text"
                    defaultValue={
                      !valueRender.height || valueRender.height === "undefined"
                        ? "Không có"
                        : valueRender.height
                    }
                    readOnly
                  />
                  <span>Cm</span>
                </div>
              </div>
              <div className="ExaminationForm-Container__form__group">
                <label>Cân nặng:</label>
                <div className="ExaminationForm-Container__input__unit">
                  <input
                    type="text"
                    defaultValue={
                      !valueRender.weight || valueRender.weight === "undefined"
                        ? "Không có"
                        : valueRender.weight
                    }
                    readOnly
                  />
                  <span>Kg</span>
                </div>
              </div>
              <div className="ExaminationForm-Container__form__group">
                <label>Phòng khám:</label>
                <input type="text" defaultValue={valueRender.clinic} readOnly />
              </div>
              <div className="ExaminationForm-Container__form__group">
                <label>Khoa:</label>
                <input type="text" defaultValue={valueRender.department} readOnly />
              </div>
            </div>

            <div className="form-grid grid-2">
              <div className="ExaminationForm-Container__form__group">
                <label>Địa chỉ:</label>
                <textarea readOnly defaultValue={valueRender.address} />
              </div>
              <div className="ExaminationForm-Container__form__group">
                <label>Lí do đến khám:</label>
                <textarea readOnly defaultValue={valueRender.reason} />
              </div>
            </div>

            <div className="ExaminationForm-Container__accept">
              {statusPay ? (
                <>
                  <button
                    className="ExaminationForm-Container__isSuss__btn"
                    onClick={() => {
                      setContentModal("Bạn chắc chắn xác nhận hoàn tất tiếp nhận?");
                      setCallBackModal(() => () => processingCompleted());
                      setShowModal(true);
                    }}
                  >
                    Hoàn thành
                  </button>
                  <button className="ExaminationForm-Container__isPay__btn">
                    <i style={{ fontSize: "20px" }} className="bi bi-check-lg"></i>
                    Đã thanh toán
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="ExaminationForm-Container__cancel__btn"
                    onClick={() => {
                      setContentModal("Bạn chắc chắn xác nhận hủy thanh toán?");
                      setCallBackModal(() => () => cancelPayment());
                      setShowModal(true);
                    }}
                  >
                    Không thanh toán
                  </button>
                  <button
                    className="ExaminationForm-Container__accept__btn"
                    onClick={() => {
                      setContentModal("Bạn chắc chắn xác nhận thanh toán?");
                      setCallBackModal(() => () => Pay());
                      setShowModal(true);
                    }}
                  >
                    Xác nhận đã thanh toán
                  </button>
                </>
              )}
            </div>
          </div>

          <PreviewExaminationForm
            isOpen={showPreviewModal}
            onClose={handleClosePreview}
            patientData={valueRender}
            collectorName={currentCollectorName}
          />
        </>
      )}
    </>
  );
}
