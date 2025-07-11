'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import './TestWaitingList.css';
import Pagination from '@/app/components/ui/Pagination/Pagination';
import { paraclinicalType } from '@/app/types/patientTypes/patient';
import { changeBoQuaStatus, getWaitingForTest } from '@/app/services/LaboratoryDoctor';
import NoData from '@/app/components/ui/Nodata/Nodata';
import { showToast, ToastType } from '@/app/lib/Toast';
import ModalComponent from '@/app/components/shared/Modal/Modal';
import Spinner from 'react-bootstrap/Spinner';

export default function TestWaitingList() {
  const router = useRouter();
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [data, setData] = useState<paraclinicalType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedSkipId, setSelectedSkipId] = useState<string | null>(null);

  const loadAPI = async () => {
    setIsLoading(true);
    const getData = await getWaitingForTest('6803bf3070cd96d5cde6d824', currentPage, true);
    if (getData) {
      setData(getData.data);
      setTotalPages(getData.totalPages);
      setCurrentPage(getData.currentPage);
    }
    setIsLoading(false);
  };

  const openSkipModal = (id: string) => {
    setSelectedSkipId(id);
    setShowModal(true);
  };

  const confirmSkip = async () => {
    if (!selectedSkipId) return;

    const result = await changeBoQuaStatus(selectedSkipId, false);
    setShowModal(false);
    setSelectedSkipId(null);

    if (result) {
      showToast('Đã chuyển sang danh sách bỏ qua', ToastType.success);
      loadAPI(); // Cập nhật lại dữ liệu sau khi bỏ qua
    } else {
      showToast('Lỗi khi cập nhật trạng thái bỏ qua', ToastType.error);
    }
  };

  useEffect(() => {
    loadAPI();
  }, [currentPage]);

  return (
    <>
      <Tabbar
        tabbarItems={{
          tabbarItems: [
            { text: 'Chờ xét nghiệm', link: '/LaboratoryDoctor/TestWaitingList' },
            { text: 'Bỏ qua xét nghiệm', link: '/LaboratoryDoctor/TestWaitingList/SkipTheTest' },
            { text: 'Đã xét nghiệm', link: '/LaboratoryDoctor/TestWaitingList/TestHistory' },
          ],
        }}
      />

      {/* Modal xác nhận bỏ qua */}
      <ModalComponent
        Data_information={{
          content: 'Bạn có chắc muốn bỏ qua bệnh nhân này không?',
          remid: 'Sau khi bỏ qua, bệnh nhân sẽ không hiển thị trong danh sách chờ.',
          handleClose: () => setShowModal(false),
          handleShow: () => {},
          show: showModal,
          callBack: confirmSkip,
        }}
      />

      <div className="TestWaitingList-container">
        {isLoading ? (
          <div className="text-center mt-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : data.length > 0 ? (
          <>
            <table className="TestWaitingList-container_table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Họ và tên</th>
                  <th>Giới tính</th>
                  <th>Ngày sinh</th>
                  <th>Lý do đến khám</th>
                  <th>Số điện thoại</th>
                  <th>SĐT người thân</th>
                  <th>Ngày</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {data.map((record, index) => (
                  <tr key={record._id}>
                    <td>{(currentPage - 1) * 10 + index + 1}</td>
                    <td>{record.Id_PhieuKhamBenh.Id_TheKhamBenh.HoVaTen}</td>
                    <td>{record.Id_PhieuKhamBenh.Id_TheKhamBenh.GioiTinh || ''}</td>
                    <td>{record.Id_PhieuKhamBenh.Id_TheKhamBenh.NgaySinh || ''}</td>
                    <td>{record.Id_PhieuKhamBenh.LyDoDenKham || ''}</td>
                    <td>{record.Id_PhieuKhamBenh.Id_TheKhamBenh.SoDienThoai || ''}</td>
                    <td>{record.Id_PhieuKhamBenh.Id_TheKhamBenh.SDT_NguoiThan || ''}</td>
                    <td>{record.Ngay || ''}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button
                          className="button--green"
                          style={{ marginRight: '10px' }}
                          onClick={() =>
                            router.push(`/LaboratoryDoctor/TestWaitingList/${record.Id_PhieuKhamBenh._id}`)
                          }
                        >
                          Thực hiện
                        </button>
                        <button
                          className="button--red"
                          onClick={() => openSkipModal(record._id)}
                        >
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
          </>
        ) : (
          <NoData />
        )}
      </div>
    </>
  );
}
