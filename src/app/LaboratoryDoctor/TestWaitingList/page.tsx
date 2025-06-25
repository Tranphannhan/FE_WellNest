'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import './TestWaitingList.css';
import Pagination from '@/app/components/ui/Pagination/Pagination';
import { paraclinicalType } from '@/app/types/patientTypes/patient';
import { getWaitingForTest } from '@/app/services/LaboratoryDoctor';

export default function Prescription() {
    const router = useRouter();
    const [totalPages , setTotalPages] = useState <number> (1);
    const [currentPage , setCurrentPage] = useState <number> (1);
    const [data , setData] = useState <paraclinicalType []> ([]);

    const loaddingAPI = async () => {
        const getData = await getWaitingForTest ('6803bf3070cd96d5cde6d824' , 1);
        if (!getData) return;
        setData (getData.data);
        setTotalPages (getData.totalPages);
        setCurrentPage (getData.currentPage)
    }

    useEffect (() => {
        loaddingAPI ();
    }, []);



    return (
        <>
            <Tabbar
                tabbarItems={{
                    tabbarItems: [
                        { text: 'Chờ xét nghiệm', link: '/LaboratoryDoctor/TestWaitingList' },
                        { text: 'Bỏ qua xét nghiệm', link: '/LaboratoryDoctor/SkipTheTest' },
                        { text: 'Đã xét nghiệm', link: '#' }
                    ],
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
                            />
                            <button className="search-btn">
                                <i className="bi bi-search"></i>
                            </button>
                        </div>

                        <div className="Prescription_searchBox">
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
                </div>


                <table className="Prescription-container_table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Họ và tên</th>
                            <th>Giới tính</th>
                            <th>Ngày sinh</th>
                            <th>Lý do đến khám</th>
                            <th>Số điện thoại</th>
                            <th>Số điện thoại người thân</th>
                            <th>Ngày</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
  

                    <tbody>
                        {data.map((record, index) => (
                            <tr key={record._id}>
                                <td>{index + 1}</td>
                                <td style={{ whiteSpace: 'nowrap' }}>{record.Id_PhieuKhamBenh.Id_TheKhamBenh.HoVaTen}</td>
                                <td>{record?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.GioiTinh || ''}</td>
                                <td>{record?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.NgaySinh || ''}</td>
                                <td>{record?.Id_PhieuKhamBenh?.LyDoDenKham || ''}</td>
                                <td>{record?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.SoDienThoai || ''}</td>
                                <td>{record?.Id_PhieuKhamBenh?.Id_TheKhamBenh?.SDT_NguoiThan || ''}</td>
                                <td style={{ whiteSpace: 'nowrap' }}>{record?.Ngay || ''}</td>


                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <button
                                            className="button--green"
                                            style={{ marginRight: '10px' }}
                                            onClick={() => router.push(`/LaboratoryDoctor/TestWaitingList/${record.Id_PhieuKhamBenh._id}`)}
                                        >
                                            Thực hiện
                                        </button>

                                        <button className="button--red">
                                            Bỏ qua
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
                    onPageChange={setCurrentPage}
                />

            </div>
        </>
    )
}
