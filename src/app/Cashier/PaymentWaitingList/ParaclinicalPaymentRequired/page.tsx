"use client";
import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import "../Prescription.css";
import { useRouter } from "next/navigation";
import ConfirmationNotice from "../../ComponentCashier/ConfirmationNotice";
import React, { useEffect, useState } from "react";
import { formatCurrencyVND } from "@/app/lib/Format";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { paraclinicalType } from "@/app/types/patientTypes/patient";
import {
  confirmTestRequestPayment,
  SearchParaclinicalAwaitingPayment,
} from "@/app/services/Cashier";
import { showToast, ToastType } from "@/app/lib/Toast";
import payment from "@/app/services/Pay";
import NoData from "@/app/components/ui/Nodata/Nodata";
import Pagination from "@/app/components/ui/Pagination/Pagination";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

export default function ParaclinicalPaymentRequired() {
  const router = useRouter();

  const [dataPrescription, setDataPrescription] = useState<paraclinicalType[]>(
    []
  );
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [idPhieuKhamBenh, setIdPhieuKhamBenh] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [dataPendingPayment, setDataPendingPayment] = useState<{
    HoVaTen?: string;
    TongTien?: number;
  }>({});

  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");

  const getThuNganIdFromToken = (): string | null => {
    const token = Cookies.get("token");
    if (!token) return null;

    try {
      const decoded = jwtDecode<{ _id: string }>(token);
      return decoded._id;
    } catch (error) {
      console.error("Lỗi giải mã token:", error);
      return null;
    }
  };

  const loadApi = async (page: number = 1) => {
    const res = await SearchParaclinicalAwaitingPayment(
      true,
      page,
      searchName.trim() || undefined,
      searchPhone.trim() || undefined
    );
    if (res?.data) {
      setDataPrescription(res.data);
      setCurrentPage(res.currentPage);
      setTotalPages(res.totalPages);
    }
  };

  const PayMoMo = async () => {
    if(!dataPendingPayment.TongTien) return showToast("Không lấy được tổng tiền", ToastType.error);
    await payment(
      dataPendingPayment?.TongTien | 0,
      "Xét nghiệm",
      `http://localhost:3000/Cashier/PaymentWaitingList/ParaclinicalPaymentRequired/${idPhieuKhamBenh}`,
      idPhieuKhamBenh,
      "XetNghiem"
    );
  };

  useEffect(() => {
    loadApi();
  }, []);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handlePaymenConfirmation = (
    HoVaTen: string,
    TongTien: number,
    idPhieuKhamBenh: string
  ) => {
    setDataPendingPayment({ HoVaTen, TongTien });
    setIdPhieuKhamBenh(idPhieuKhamBenh);
    setShowModal(true);
  };

  const paymentConfirmation = async () => {
    try {
      const Id_ThuNgan = getThuNganIdFromToken();
      if(!Id_ThuNgan){
          showToast("Không tìm thấy ID thu ngân", ToastType.error);
          return;
      }
      const result = await confirmTestRequestPayment(idPhieuKhamBenh, Id_ThuNgan);
      if (result) {
        showToast("Xác nhận thanh toán thành công", ToastType.success);
        setShowModal(false);
        router.push(
          `/Cashier/PaymentWaitingList/ParaclinicalPaymentRequired/${idPhieuKhamBenh}`
        );
      } else {
        showToast("Xác nhận thanh toán thất bại", ToastType.error);
      }
    } catch {
      showToast("Đã có lỗi xảy ra khi xác nhận thanh toán", ToastType.error);
    }
  };

  return (
    <>
      <Tabbar
        tabbarItems={{
          tabbarItems: [
            {
              text: "Đơn thuốc chờ thanh toán",
              link: "/Cashier/PaymentWaitingList",
            },
            {
              text: "Cận lâm sàng chờ thanh toán",
              link: "/Cashier/PaymentWaitingList/ParaclinicalPaymentRequired",
            },
          ],
        }}
      />

      <ConfirmationNotice
        Data_information={{
          name: dataPendingPayment.HoVaTen || "",
          totalPrice:
            dataPendingPayment.TongTien !== undefined
              ? `${dataPendingPayment.TongTien}`
              : "",
          paymentMethod: "",
          handleClose: handleClose,
          handleShow: handleShow,
          show: showModal,
          callBack: paymentConfirmation,
          paymentConfirmation: PayMoMo,
        }}
      />

      <div className="Prescription-container">
        <div className="Prescription-searchReceptionContainer">
          <div className="Prescription_searchBoxWrapper">
            <div className="Prescription_searchBox">
              <input
                type="text"
                placeholder="Hãy nhập số điện thoại"
                className="search-input"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
              />
              <button className="search-btn" onClick={() => loadApi(1)}>
                <i className="bi bi-search"></i>
              </button>
            </div>

            <div className="Prescription_searchBox">
              <input
                type="text"
                placeholder="Hãy nhập tên"
                className="search-input"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
              <button className="search-btn" onClick={() => loadApi(1)}>
                <i className="bi bi-search"></i>
              </button>
            </div>
          </div>
        </div>

        {dataPrescription.length > 0 ? (
          <>
            <table className="Prescription-container_table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Họ và tên</th>
                  <th>Giới tính</th>
                  <th>Ngày sinh</th>
                  <th>Số điện thoại</th>
                  <th>Ngày</th>
                  <th>Tổng tiền</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {dataPrescription.map((record, index) => (
                  <tr key={record._id}>
                    <td>{(currentPage - 1) * 5 + index + 1}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {record?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.HoVaTen}
                    </td>
                    <td>
                      {record?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.GioiTinh}
                    </td>
                    <td>
                      {record?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.NgaySinh}
                    </td>
                    <td>
                      {record?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.SoDienThoai}
                    </td>
                    <td>{record?.Id_PhieuKhamBenh?.Ngay}</td>
                    <td
                      style={{
                        color: "red",
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatCurrencyVND(record?.TongTien || 0)}
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <button
                          className="button--green"
                          style={{ marginRight: "10px" }}
                          onClick={() =>
                            router.push(
                              `/Cashier/PaymentWaitingList/ParaclinicalPaymentRequired/${record.Id_PhieuKhamBenh?._id}`
                            )
                          }
                        >
                          <i className="bi bi-eye-fill"></i>
                          Xem chi tiết
                        </button>
                        <button
                          className="button--red"
                          onClick={() =>
                            handlePaymenConfirmation(
                              record?.Id_PhieuKhamBenh?.Id_TheKhamBenh
                                ?.HoVaTen || "",
                              record?.TongTien || 0,
                              record?.Id_PhieuKhamBenh?._id || ""
                            )
                          }
                        >
                          <FaMoneyCheckDollar />
                          Thu tiền
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={(page) => loadApi(page)}
            />
          </>
        ) : (
          <NoData />
        )}
      </div>
    </>
  );
}
