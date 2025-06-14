'use client';
import { useCallback, useEffect, useState } from 'react';
import './Paraclinical.css';
import { DoctorTemporaryTypes } from '@/app/types/doctorTypes/doctorTestTypes';
import { deleteDoctorTemporaryTypes, getDoctorTemporaryTypes } from '@/app/services/DoctorSevices';
import { formatCurrencyVND } from '@/app/lib/Format';
import { useParams } from 'next/navigation';
import NoData from '@/app/components/ui/Nodata/Nodata';

 

export default function ParaclinicalComponent (){
        const [data , setData ] = useState <DoctorTemporaryTypes []> ([]);
        const { id } = useParams();

        const Loadding = async () => {
            const Data = await getDoctorTemporaryTypes (id as string);
            if (!Data){
                    return console.error('Không tìm thấy dữ liệu cần lâm sàng')
            } 
            const Tmdata = new Array (Data)
            setData(Tmdata)
        }

        useEffect (() => {
            Loadding ();
      
        } , []);


        const deleteParaclinical = useCallback ((id : string) => {
            deleteDoctorTemporaryTypes (id)
            setData (data)
        }, []);
        
        
    return (
        <>
            <div className='Paraclinical-Body'>
                 <div className="Paraclinical-medicine__container">
                   {data.length > 0?(<>
                     <div className='Paraclinical-medicine__container__title'>Các xét nghiệm đã chọn </div>
                    <table className="Paraclinical-medicine__container__medicineTable">
                        <thead>
                            <tr>
                                <th>Tên phòng thiết bị</th>
                                <th>Tên xét nghiệm</th>
                                <th>Hình ảnh xét nghiệm</th>
                                <th>Giá</th>
                                <th>Hành Động</th>
                            </tr>
                        </thead>
                    

                        <tbody>
                            {data.map((item) => (
                                <tr key={item._id}>
                                    <td>{item.Id_LoaiXetNghiem.Id_PhongThietBi.TenPhongThietBi}</td>
                                    <td >{item.Id_LoaiXetNghiem.TenXetNghiem}</td>
                                    <td>
                                        <img style={{width : "67px" , height : "40px"}} src={`http://localhost:5000/image/${item.Id_LoaiXetNghiem.Image}`} alt={`http://localhost:5000/${item.Id_LoaiXetNghiem.Image}`} />
                                    </td>

                                    <td>{formatCurrencyVND (item.Id_LoaiXetNghiem.Id_GiaDichVu.Giadichvu)}</td>
                                    <td>
                                        <div onClick={() => deleteParaclinical (item._id)} className='Paraclinical-medicine__container__medicineTable__Bton'>
                                            <span><i style={{color : "red" , fontSize : "15px"}} className="bi bi-x-lg"></i> Loại bỏ</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>




                    <div className="Paraclinical-medicine__container__MedicineActions">
                        <button className="Paraclinical-medicine__container__MedicineActions__addButton">+ Thêm yêu cầu</button>
                        <button className="Paraclinical-medicine__container__MedicineActions__completeButton">Hoàn thành</button>
                    </div>
                   </>):(
                        <NoData message='Không có chỉ định cận lâm sàng' remind='Nếu cần kết quả để chuẩn đoán vui lòng chỉ định'></NoData>
                   )}
                </div>

            



            
            </div>
        </>
    ) 


}   