"use client";
import React, { useEffect, useState } from "react";
import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import "./SearchReception.css";
import Link from "next/link";
import Pagination from "@/app/components/ui/Pagination/Pagination";

export default function SearchReception() {
        const [currentPage, setCurrentPage] = useState<number>(1);
        const totalPages = 2;

  useEffect(()=>{
      console.log(`Đang ở trang: ${currentPage}`)

  },[currentPage])

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
            <div className="SearchReception-pagination">
                   <Pagination
                      totalPages={totalPages}
                      currentPage={currentPage}
                      onPageChange={setCurrentPage}
                  />

            </div>
        </div>
      </div>
    </>
  );
}
