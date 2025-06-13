"use client";
import React, { useEffect, useState } from "react";
import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import "./SearchReception.css";
import Pagination from "@/app/components/ui/Pagination/Pagination";
import { medicalExaminationBook } from "@/app/types/patientTypes/patient";
import { searchMedicalExaminationBook } from "@/app/services/ReceptionServices";
import { useRouter } from "next/navigation";
import NoData from "@/app/components/ui/Nodata/Nodata";

export default function SearchReception() {
        const [currentPage, setCurrentPage] = useState<number>(1);
        const [valueRender, setValueRender] = useState <medicalExaminationBook []> ([])
        const [searchPhone,setSearchPhone] = useState <string>('')
        const [searchName,setSearchName] = useState <string>('')
        const [totalPages,setTotalPages] = useState <number>(1)
        const router = useRouter()


  async function search(phone:string,name:string,currentPage:number){
      const response = await searchMedicalExaminationBook(phone,name,currentPage);
      setValueRender(response.data)
      setTotalPages(response.totalPages)
      console.log(response)
      console.log('Giá trị tìm kiếm tên',searchName)
      console.log('Giá trị tìm kiếm số điện thoại',searchPhone)
  }

  function ViewDetail(value:medicalExaminationBook){
      sessionStorage.setItem('soKhamBenh',JSON.stringify(value))
      router.push('/Receptionist/Reception/PatientInformation')
  }

  useEffect(()=>{
      search(searchPhone,searchName,currentPage)

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
              onChange={(e)=>{
                  setSearchPhone(e.target.value)
              }}
            />
            <button className="search-btn"
              onClick={()=>{
                search(searchPhone,searchName,currentPage)
              }}
            >
              <i className="bi bi-search"></i>
            </button>
          </div>
          <div className="search-box">
            <input
              type="text"
              placeholder="Hãy nhập tên"
              className="search-input"
              onChange={(e)=>{
                setSearchName(e.target.value)
              }}
            />
            <button className="search-btn"
                onClick={()=>{
                search(searchPhone,searchName,currentPage)
              }}
            >
              <i className="bi bi-search"></i>
            </button>
          </div>
        </div>
        <div className="result-box">
          {
            valueRender.length > 0?(<>
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
              {
                valueRender.map((patient)=>(
                    <tr key={patient._id}>
                      <td>{patient.HoVaTen}</td>
                      <td>{patient.NgaySinh}</td>
                      <td>{patient.GioiTinh}</td>
                      <td>{patient.SoDienThoai}</td>
                      <td>{patient.SoCCCD}</td>
                      <td>
                        <button 
                          style={{color:'#349eff',cursor:'pointer'}}
                          onClick={()=>{
                          ViewDetail(patient)
                        }}>Xem chi tiết</button>
                      </td>
                    </tr>

                ))
              }
            </tbody>
          </table>
            <div className="SearchReception-pagination">
                   <Pagination
                      totalPages={totalPages}
                      currentPage={currentPage}
                      onPageChange={setCurrentPage}
                  />

            </div>
            </>):(
                <>
                  <NoData message="Không có sổ khám bệnh"
                  remind="Vui lòng kiểm tra lại thông tin tìm kiếm"
                  ></NoData>
                </>

            )
          }
        </div>
      </div>
    </>
  );
}
