'use client';
import { useState, useMemo } from 'react'; // Import useMemo for optimized filtering
import { Modal, Button, Input, Select, Pagination } from 'antd'; // Ant Design components for form elements and modal
import './CreatePrescriptionPopup.css'; // Your custom CSS file

const { Option } = Select;

interface Medicine {
  key: string;
  name: string;
  price: string;
  group: string;
  description?: string;
}

const PrescriptionPopup = ({ showPrescriptionPopup, handleClosePrescriptionPopup }: { showPrescriptionPopup: boolean, handleClosePrescriptionPopup: () => void }) => {
  const [step, setStep] = useState(1);
  const [isSelectingMedicine, setIsSelectingMedicine] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  // States for medicine selection table's search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');

  // Pagination states for the medicine selection table
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3; // Number of items per page

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleOpenMedicineSelectionView = () => {
    setIsSelectingMedicine(true);
    setCurrentPage(1); // Reset to first page when opening selection view
    setSearchTerm(''); // Reset search term
    setSelectedGroup('all'); // Reset filter
  };

  const handleBackToStep3Form = () => {
    setIsSelectingMedicine(false);
  };

  const handleSelectMedicine = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setIsSelectingMedicine(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Dummy data for medicines (replace with your actual data)
  const allMedicineData: Medicine[] = [
    { key: '1', name: 'Paracetamol 500mg', price: '15.000 VNĐ', group: 'Thuốc hạ sốt' },
    { key: '2', name: 'Amoxicillin 250mg', price: '25.000 VNĐ', group: 'Kháng sinh' },
    { key: '3', name: 'Vitamin C 1000mg', price: '10.000 VNĐ', group: 'Vitamin và khoáng chất' },
    { key: '4', name: 'Ibuprofen 400mg', price: '20.000 VNĐ', group: 'Thuốc kháng viêm'},
    { key: '5', name: 'Omeprazole 20mg', price: '18.000 VNĐ', group: 'Thuốc dạ dày'},
    { key: '6', name: 'Diazepam 5mg', price: '12.000 VNĐ', group: 'Thuốc an thần' },
    { key: '7', name: 'Metformin 500mg', price: '30.000 VNĐ', group: 'Thuốc tiểu đường'},
    { key: '8', name: 'Lisinopril 10mg', price: '45.000 VNĐ', group: 'Thuốc huyết áp'},
  ];

  // Filter and search logic for medicines
  const filteredAndSearchedData = useMemo(() => {
    let filtered = allMedicineData;

    // Apply group filter
    if (selectedGroup !== 'all') {
      filtered = filtered.filter(medicine => medicine.group === selectedGroup);
    }

    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(medicine =>
        medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [allMedicineData, selectedGroup, searchTerm]);

  // Calculate data for the current page after filtering and searching
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedMedicineData = filteredAndSearchedData.slice(startIndex, endIndex);

  return (
    <>
      <Modal
        open={showPrescriptionPopup}
        footer={null}
        onCancel={handleClosePrescriptionPopup}
        width={800}
        className="prescription-popup"
        style={{ top: 50 }}
      >
        {/* Các bước - Luôn hiển thị */}
        <div className="prescription-popup__steps">
          {[1, 2, 3].map((s, i, arr) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
              <div
                className={`prescription-popup__step ${step === s ? 'prescription-popup__step--active' : ''}`}
              >
                <div className="prescription-popup__step-title">Bước {s}</div>
                <div className="prescription-popup__step-subtitle">
                  {s === 1 ? 'Tạo đơn thuốc' : s === 2 ? 'Tạo đơn thuốc chi tiết' : 'Chọn thuốc'}
                </div>
              </div>

              {/* Chỉ thêm connector nếu không phải bước cuối */}
              {i < arr.length - 1 && <div className="prescription-popup__connector" />}
            </div>
          ))}
        </div>

        {/* Nội dung popup */}
        <div className="prescription-popup__body">
          {/* Layout chung cho Bước 1 & 2 */}
          {step !== 3 && (
            <>
              <div className="presscription-popup__title">Thông tin bệnh nhân</div>
              <div className="prescription-popup__content">
                <div className="prescription-popup__column">
                  <p>
                    <strong>Họ tên:</strong> Trần Bệnh Nhân
                  </p>
                  <p>
                    <strong>Tên đơn thuốc:</strong> Đơn thuốc
                  </p>
                  <p>
                    <strong>Ngày:</strong> 2025-05-20
                  </p>

                  {step === 2 && (
                    <Button
                      type="default"
                      className="prescription-popup__detail-button"
                      onClick={() => setStep(3)}
                    >
                      Tạo đơn thuốc chi tiết
                    </Button>
                  )}
                </div>
                <div className="prescription-popup__column">
                  <p>
                    <strong>Bác sĩ:</strong> Trần Bệnh Nhân
                  </p>
                  <p>
                    <strong>Ca:</strong> sáng
                  </p>
                  <p>
                    <strong>Số phòng:</strong> 1
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Giao diện riêng cho Bước 3 */}
          {step === 3 && (
            <>
              {!isSelectingMedicine ? ( // Show Step 3 form if not selecting medicine
                <div className="prescription-popup__step3">
                  <div className="form-row">
                    <div className="form-group qty">
                      <label>Số Lượng</label>
                      <Input type="number" placeholder="Nhập số lượng" className="form-control" />
                    </div>

                    <div className="form-group medicine">
                      <label>
                        Thuốc đã chọn:{' '}
                        <span style={{ fontWeight: 400 }}>
                          {selectedMedicine ? selectedMedicine.name : 'chưa chọn'}
                        </span>
                      </label>
                      <Input
                        type="text"
                        readOnly
                        placeholder="+ Chọn thuốc"
                        className="form-control clickable"
                        onClick={handleOpenMedicineSelectionView} // Trigger view switch
                        value={selectedMedicine ? selectedMedicine.name : ''}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Nhắc nhở</label>
                    <Input.TextArea placeholder="Nhập nhắc nhở" className="form-control" rows={4} />
                  </div>

                  <div style={{ textAlign: 'right', marginTop: '20px' }}>
                    <Button type="primary">Tạo</Button>
                  </div>
                </div>
              ) : (
                // Show Medicine Selection layout with pure HTML table
                <div className="medicine-selection-layout">
                  <h3 className="text-xl font-semibold mb-4">Chọn thuốc</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <Input.Search
                      placeholder="Tìm kiếm thuốc..."
                      onSearch={setSearchTerm} // Update search term state
                      onChange={(e) => setSearchTerm(e.target.value)}
                      value={searchTerm}
                      style={{ width: '100%' }}
                    />
                    <Select
                      defaultValue="all"
                      style={{ width: 200 }}
                      onChange={setSelectedGroup} // Update selected group state
                      value={selectedGroup}
                    >
                      <Option value="all">Tất cả nhóm thuốc</Option>
                      <Option value="Thuốc hạ sốt">Thuốc hạ sốt</Option>
                      <Option value="Kháng sinh">Kháng sinh</Option>
                      <Option value="Vitamin và khoáng chất">Vitamin và khoáng chất</Option>
                      <Option value="Thuốc kháng viêm">Thuốc kháng viêm</Option>
                      <Option value="Thuốc dạ dày">Thuốc dạ dày</Option>
                      <Option value="Thuốc an thần">Thuốc an thần</Option>
                      <Option value="Thuốc tiểu đường">Thuốc tiểu đường</Option>
                      <Option value="Thuốc huyết áp">Thuốc huyết áp</Option>
                    </Select>
                  </div>
                  {/* Pure HTML Table for Medicine Selection */}
                  <div className="medicine-table-container"> {/* Wrapper for scrolling and fixed columns */}
                    <table className="medicine-table">
                      <thead>
                        <tr>
                          <th className="align-left fixed-column-left">Tên thuốc</th>
                          <th className="align-center">Giá thuốc</th>
                          <th className="align-right fixed-column-right">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedMedicineData.length > 0 ? (
                          paginatedMedicineData.map((record: Medicine) => (
                            <tr key={record.key}>
                              <td className="align-left fixed-column-left">{record.name}</td>
                              <td className="align-center">{record.price}</td>
                              <td className="align-right fixed-column-right">
                                <Button type="primary" onClick={() => handleSelectMedicine(record)}>
                                  Chọn
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>
                              Không tìm thấy thuốc nào.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-between items-center px-2 py-1 mt-4"> {/* Adjust margin-top for spacing */}
                    <Button onClick={handleBackToStep3Form}>Quay lại</Button>
                    <Pagination
                      current={currentPage}
                      pageSize={pageSize}
                      total={filteredAndSearchedData.length} // Total items for pagination is based on filtered data
                      onChange={handlePageChange}
                      showSizeChanger={false}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer cho bước 1 (chỉ hiển thị nếu không phải bước 3) */}
        <div className="prescription-popup__footer">
          {step === 1 && (
            <Button type="primary" onClick={handleNextStep}>
              Tạo đơn
            </Button>
          )}
        </div>
      </Modal>
    </>
  );
};

export default PrescriptionPopup;
