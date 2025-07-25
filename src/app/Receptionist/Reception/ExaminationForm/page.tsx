"use client";

import React, { useEffect, useState } from "react";
import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import "./ExaminationForm.css";
import PreviewExaminationForm from "./PreviewExaminationForm";
import type { ExaminationForm } from "@/app/types/receptionTypes/receptionTypes";
import {
  checkPay,
  GetPriceDiscovery,
  getSTTKham,
  handlePay,
} from "@/app/services/ReceptionServices";
import { showToast, ToastType } from "@/app/lib/Toast";
import { useRouter } from "next/navigation";
import ModalComponent from "@/app/components/shared/Modal/Modal";
import ConfirmationNotice from "@/app/Cashier/ComponentCashier/ConfirmationNotice";
import payment from "@/app/services/Pay";
//import token
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import {localBaseUrl} from "@/app/config"

interface MyTokenType {
  _id: string;
  // có thể thêm các field khác nếu cần
}

export default function ExaminationForm() {
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [contentModal, setContentModal] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalPay, setModalPay] = useState<boolean>(false);
  const [price, setPrice] = useState<number>(0);
  const [callBackModal, setCallBackModal] = useState<() => void>(() => {});
  const [valueRender, setValueRender] = useState<
    ExaminationForm | null | undefined
  >(undefined);
  const [statusPay, setStatusPay] = useState<boolean>(false);
  const router = useRouter();

  const handleClose = () => setShowModal(false);
  const handleShow = () => {
    setShowModal(true);
    setModalPay(false);
  };

  const handlePayClose = () => setModalPay(false);
  const handlePayShow = () => setModalPay(true);

  //Lay token

  const getTiepNhanIdFromToken = (): string | null => {
    const token = Cookies.get("token");

    if (!token) return null;

    try {
      const decoded = jwtDecode<MyTokenType>(token);
      return decoded._id;
    } catch (error) {
      console.error("Lỗi giải mã token:", error);
      return null;
    }
  };

  const addHoaDonKham = async (Id_PhieuKhamBenh: string) => {
    const idThuNgan = getTiepNhanIdFromToken();
    if (!idThuNgan || !Id_PhieuKhamBenh) return;

    try {
      const response = await fetch(`${API_BASE_URL}/Hoadon/Add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Id_PhieuKhamBenh,
          Id_Dichvu: null,
          Id_ThuNgan: idThuNgan,
          LoaiHoaDon: "Kham",
          TenHoaDon: "Hóa đơn phí khám",
        }),
      });

      const data = await response.json();
      console.log("✅ Tạo hóa đơn khám thành công:", data);
    } catch (error) {
      console.error("❌ Lỗi tạo hóa đơn khám:", error);
    }
  };

  //code cu ko sua

  async function Pay(id: string | null = null) {
    const Id_PhieuKhamBenh = id ?? valueRender?.Id_PhieuKhamBenh;

    if (!Id_PhieuKhamBenh) {
      return showToast("Chưa có mã phiếu khám bệnh", ToastType.error);
    }

    const result = await handlePay(Id_PhieuKhamBenh);

    if (result?.status === true && result?.QueueNumber) {
      showToast(result.message, ToastType.success);

      const newValue = {
        ...(valueRender as ExaminationForm),
        QueueNumber: result.QueueNumber,
      };
      setValueRender(newValue);
      setStatusPay(true);
      setShowModal(false);

      await addHoaDonKham(Id_PhieuKhamBenh);
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

  const PayMoMo = async () => {
    await payment(
      price,
      "Phí Khám",
      `${localBaseUrl}/Receptionist/Reception/ExaminationForm`,
      valueRender?.Id_PhieuKhamBenh as string,
      "PhiKham"
    );
  };
useEffect(() => {
  
  const fetchPrice = async () => {
    try {
      const result = await GetPriceDiscovery();
      if (result?.Giadichvu) {
        setPrice(result.Giadichvu);
      } else {
        console.warn("Không lấy được giá khám bệnh.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy giá khám:", error);
    }
  };

  const loadSessionData = async () => {
    try {
      const dataLocal = sessionStorage.getItem("ThongTinPhieuKham");
      if (dataLocal) {
        const dataOb:ExaminationForm  = JSON.parse(dataLocal);
        const queueNumberRes = await getSTTKham(dataOb.Id_PhieuKhamBenh)
        checkRender(dataOb.Id_PhieuKhamBenh);

        setValueRender({...dataOb,QueueNumber:queueNumberRes});
      } else {
        setValueRender(null);
      }
    } catch (error) {
      console.error("Lỗi khi đọc dữ liệu từ sessionStorage:", error);
      setValueRender(null);
    }
  };

  fetchPrice();
  loadSessionData();

  // Kiểm tra thanh toán MoMo
  const urlParams = new URLSearchParams(window.location.search);
  const resultCode = urlParams.get("resultCode");
  const extraDataRaw = urlParams.get("extraData");

  if (resultCode === "0" && extraDataRaw) {
    try {
      const extraData = JSON.parse(decodeURIComponent(extraDataRaw));
      const idFromMoMo = extraData.Id;
      const type = extraData.Type;

      const dataLocal = sessionStorage.getItem("ThongTinPhieuKham");
      if (dataLocal) {
        const dataOb = JSON.parse(dataLocal);
        if (idFromMoMo === dataOb.Id_PhieuKhamBenh && type === "PhiKham") {
          console.log("🎉 MoMo thành công, gọi Pay...");

          // Gọi Pay và sau đó reload trang mà không có query params
          Pay(dataOb.Id_PhieuKhamBenh).then(() => {
            loadSessionData()
            router.push('/Receptionist/Reception/ExaminationForm')
          });
        }
      }
    } catch (error) {
      console.error("❌ Lỗi khi parse extraData từ URL:", error);
    }
  }
}, []);


  const token = Cookies.get("token");
  if (!token) return showToast("Chưa có tên người Tiếp Nhân", ToastType.error);
  const decoded = jwtDecode<{ _TenTaiKhoan: string }>(token);
  const currentCollectorName = decoded._TenTaiKhoan;

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

      <ConfirmationNotice
        Data_information={{
          name: valueRender?.fullName,
          totalPrice: String(price),
          paymentMethod: "",
          handleClose: handlePayClose,
          handleShow: handlePayShow,
          show: modalPay,
          callBack: handleShow,
          paymentConfirmation: PayMoMo,
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
                    ? {
                        pointerEvents: "none",
                        userSelect: "none",
                        border: "1px solid gray",
                      }
                    : {}
                }
              >
                <button
                  className="ExaminationForm-Container__print__btn"
                  style={
                    !statusPay
                      ? {
                          pointerEvents: "none",
                          userSelect: "none",
                          color: "gray",
                        }
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
                <input
                  type="text"
                  defaultValue={valueRender.fullName}
                  readOnly
                />
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
                <input
                  type="text"
                  defaultValue={valueRender.department}
                  readOnly
                />
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
                      setContentModal(
                        "Bạn chắc chắn xác nhận hoàn tất tiếp nhận?"
                      );
                      setCallBackModal(() => () => processingCompleted());
                      setShowModal(true);
                    }}
                  >
                    Hoàn thành
                  </button>
                  <button className="ExaminationForm-Container__isPay__btn">
                    <i
                      style={{ fontSize: "20px" }}
                      className="bi bi-check-lg"
                    ></i>
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
                      handlePayShow();
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
