'use client';
import { useCallback, useEffect, useState } from 'react';
import './Paraclinical.css';
import { DoctorTemporaryTypes } from '@/app/types/doctorTypes/doctorTestTypes';
import { deleteDoctorTemporaryTypes, getDoctorTemporaryTypes } from '@/app/services/DoctorSevices';
import { formatCurrencyVND } from '@/app/lib/Format';
import { useParams } from 'next/navigation';
import NoData from '@/app/components/ui/Nodata/Nodata';

export default function ParaclinicalComponent() {
  const [data, setData] = useState<DoctorTemporaryTypes[]>([]);
  const { id } = useParams();

  const loadData = async () => {
    try {
      const result = await getDoctorTemporaryTypes(id as string);
      if (!result || !Array.isArray(result)) {
        console.error('Không tìm thấy dữ liệu cận lâm sàng');
        return;
      }
      setData(result);
    } catch (err) {
      console.error('Lỗi khi load cận lâm sàng:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const deleteParaclinical = useCallback(
    async (itemId: string) => {
      await deleteDoctorTemporaryTypes(itemId);
      setData(prev => prev.filter(item => item._id !== itemId));
    },
    []
  );

  return (
    <div className='Paraclinical-Body'>
      <div className="Paraclinical-medicine__container">
        {data.length > 0 ? (
          <>
            <table className="Paraclinical-medicine__container__medicineTable min-w-full divide-y divide-gray-200">
              <thead className='bg-gray-100 text-gray-700 text-sm font-semibold text-left'>
                <tr>
                  <th>Tên phòng thiết bị</th>
                  <th>Tên xét nghiệm</th>
                  <th>Hình ảnh xét nghiệm</th>
                  <th>Giá</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {data.map(item => (
                  <tr key={item._id}>
                    <td>{item.Id_LoaiXetNghiem.Id_PhongThietBi.TenPhongThietBi}</td>
                    <td>{item.Id_LoaiXetNghiem.TenXetNghiem}</td>
                    <td>
                      <img
                        style={{ width: '67px', height: '40px' }}
                        src={`http://localhost:5000/image/${item.Id_LoaiXetNghiem.Image}`}
                        alt="Hình ảnh xét nghiệm"
                      />
                    </td>
                    <td
                      className='font-semibold'
                    >{formatCurrencyVND(item.Id_LoaiXetNghiem.Id_GiaDichVu.Giadichvu)}</td>
                    <td>
                       <button
                          onClick={() => deleteParaclinical (item._id)}
                          className='cursor-pointer'
                          style={{
                            backgroundColor:'red',
                            color:'white',
                            padding:'4px 13px',
                            borderRadius:'5px',
                            display:'flex',
                            gap:8,
                            alignItems:'center'
                          }}
                        ><i className="bi bi-trash3-fill text-lg"
                          style={{
                            fontSize:14
                          }}
                        ></i> Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="Paraclinical-medicine__container__MedicineActions">
              <button className="Paraclinical-medicine__container__MedicineActions__addButton">+ Thêm yêu cầu</button>
              <button className="Paraclinical-medicine__container__MedicineActions__completeButton">Hoàn thành</button>
            </div>
          </>
        ) : (
          <NoData
            message="Không có chỉ định cận lâm sàng"
            remind="Nếu cần kết quả để chẩn đoán vui lòng chỉ định"
          />
        )}
      </div>
    </div>
  );
}
