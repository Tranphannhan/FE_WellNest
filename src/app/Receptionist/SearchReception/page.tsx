"use client";
import React from "react";
import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import "./SearchReception.css";
import Link from "next/link";

export default function SearchReception() {
  return (
    <>
      <Tabbar
        tabbarItems={{
          tabbarItems: [
            { text: "Tra cứu thẻ khám", link: "/Receptionist/SearchReception" },
          ],
        }}
      />
      <div className="search-reception-container">
        <div className="search-box-wrapper">
          <div className="search-box">
            <input
              type="text"
              placeholder="Hãy nhập số điện thoại"
              className="search-input"
            />
            <button className="search-btn">
              <i className="bi bi-search"></i>
            </button>
          </div>
          <div className="search-box">
            <input
              type="text"
              placeholder="Hãy nhập tên"
              className="search-input"
            />
            <button className="search-btn">
              <i className="bi bi-search"></i>
            </button>
          </div>
        </div>

        <h4 className="result-title">Kết quả:</h4>
        <div className="result-box">
          <table>
            <thead>
              <tr>
                <th>Họ và tên</th>
                <th>Ngày sinh</th>
                <th>Giới tính</th>
                <th>Số Điện thoại</th>
                <th>Số CCCD</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Lý Duy Lai Duy Ngã Độc Tôn</td>
                <td>16/08/2005</td>
                <td>Nam</td>
                <td>0987655651</td>
                <td>080205013878</td>
                <td>
                  <Link href="#">Xem chi tiết</Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
