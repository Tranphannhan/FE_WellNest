'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import './inputForm.css';
import { codeScanningInformationType, medicalCardData, medicalExaminationBook } from "@/app/types/patientTypes/patient";
import { createMedicalExaminationCard } from '@/app/services/ReceptionServices';
import { showToast, ToastType } from '@/app/lib/Toast';
import ReceptionResultNotificationExample from './InputFormNotification';
import { useRouter } from 'next/navigation';
import API_BASE_URL from "@/app/config";

export default function InputForm() {
  const searchParams = useSearchParams();
  const isTheOfficialCard = searchParams.get('isTheOfficialCard') === 'true';
  const [idUpdateBook, setIdUpdateBook] = useState<string>('');
  const [valueUpdate, setValueUpdate] = useState<medicalExaminationBook>({});
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    CCCDNumber: '',
    dateOfBirth: '',
    sex: '',
    address: '',
    BHYT: '',
    phone: '',
    relativePhone: '',
    medicalHistory: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    dateOfBirth: '',
    sex: '',
    CCCDNumber: '',
    BHYT: '',
    phone: '',
    relativePhone: ''
  });

  useEffect(() => {
    if (isTheOfficialCard) {
      const session = sessionStorage.getItem('thongTinCCCD');
      if (session) {
        const data: codeScanningInformationType = JSON.parse(session);
        setFormData({
          ...formData,
          name: data.name || '',
          CCCDNumber: data.CCCDNumber || '',
          dateOfBirth: data.dateOfBirth || '',
          sex: data.sex || '',
          address: data.address || '',
        });
      }
    }
  }, [isTheOfficialCard]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', dateOfBirth: '', sex: '', CCCDNumber: '', BHYT: '', phone: '', relativePhone: '' };

    // Kiểm tra trường bắt buộc
    if (!formData.name.trim()) {
      newErrors.name = 'Họ và tên là bắt buộc';
      isValid = false;
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Ngày sinh là bắt buộc';
      isValid = false;
    }

    if (!formData.sex) {
      newErrors.sex = 'Giới tính là bắt buộc';
      isValid = false;
    }

    // Kiểm tra định dạng CCCDNumber (12 số)
    if (formData.CCCDNumber && !/^\d{12}$/.test(formData.CCCDNumber)) {
      newErrors.CCCDNumber = 'Số CCCD phải là 12 số';
      isValid = false;
    }

    // Kiểm tra định dạng BHYT (15 ký tự nếu nhập)
    if (formData.BHYT && !/^\d{15}$/.test(formData.BHYT)) {
      newErrors.BHYT = 'Số BHYT phải là 15 số';
      isValid = false;
    }

    // Kiểm tra định dạng phone (10-11 số)
    if (formData.phone && !/^\d{10,11}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại phải từ 10 đến 11 số';
      isValid = false;
    }

    // Kiểm tra định dạng relativePhone (10-11 số)
    if (formData.relativePhone && !/^\d{10,11}$/.test(formData.relativePhone)) {
      newErrors.relativePhone = 'Số điện thoại người thân phải từ 10 đến 11 số';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Xóa lỗi khi người dùng bắt đầu nhập
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({ ...prev, sex: value }));
    setErrors(prev => ({ ...prev, sex: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const medicalCardDataToSend: medicalCardData = {
      name: formData.name,
      sex: formData.sex,
      dateOfBirth: formData.dateOfBirth,
      phone: formData.phone,
      CCCDNumber: formData.CCCDNumber,
      address: formData.address,
      BHYT: formData.BHYT,
      relativePhone: formData.relativePhone,
      medicalHistory: formData.medicalHistory,
    };

    try {
      const response = await createMedicalExaminationCard(medicalCardDataToSend);
      const data = await response.json();
      if (data.status === 201) {
        showToast('Tạo sổ khám bệnh thành công', ToastType.success);
        sessionStorage.setItem('soKhamBenh', JSON.stringify(data.data));
        router.push('/Receptionist/Reception/PatientInformation');
      } else {
        if (data?.haveATemporaryCard) {
          setValueUpdate({
            HoVaTen: formData.name,
            GioiTinh: formData.sex,
            NgaySinh: formData.dateOfBirth,
            SoDienThoai: formData.phone,
            SoBaoHiemYTe: formData.BHYT,
            DiaChi: formData.address,
            SoCCCD: formData.CCCDNumber,
            SDT_NguoiThan: formData.relativePhone,
            LichSuBenh: formData.medicalHistory,
          });
          setIdUpdateBook(data.data._id);
          setShow(true);
        } else {
          showToast(data?.message, ToastType.error);
        }
      }
    } catch (error) {
      console.error("Không thể tạo thẻ khám bệnh:", error);
    }
  };

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  async function handleUpdate() {
    const filteredValueUpdate = Object.fromEntries(
      Object.entries(valueUpdate).filter(
        ([, value]) => value !== null && value !== undefined && value !== ''
      )
    );

    const response = await fetch(`${API_BASE_URL}/The_Kham_Benh/Edit/${idUpdateBook}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filteredValueUpdate),
    });

    if (response.ok) {
      showToast('Đã cập nhật thẻ tạm thời thành thẻ chính', ToastType.success);
      const responseBook = await response.json();
      sessionStorage.setItem('soKhamBenh', JSON.stringify(responseBook.data));
      router.push('/Receptionist/Reception/PatientInformation');
    } else {
      showToast('Đã cập nhật thất bại', ToastType.error);
    }
  }

  return (
    <>
      <ReceptionResultNotificationExample
        Data_information={{
          callBack: handleUpdate,
          handleClose,
          handleShow,
          show
        }}
      />

      {isTheOfficialCard ? (
        <Tabbar
          tabbarItems={{
            tabbarItems: [
              { text: 'Tạo sổ khám bệnh', link: '/Receptionist/Reception/InputForm?isTheOfficialCard=true' },
            ],
          }}
        />
      ) : (
        <Tabbar
          tabbarItems={{
            tabbarItems: [
              { text: 'Quét mã QR', link: '/Receptionist/Reception' },
              { text: 'Nhập thủ công', link: '/Receptionist/Reception/InputForm' },
            ],
          }}
        />
      )}

      <div className="InputForm-Container">
        <form onSubmit={handleSubmit}>
          <div className="InputForm-Container__row">
            <div className="InputForm-Container__form__group">
              <label><span className="text__red">*</span>Họ và tên:</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                disabled={isTheOfficialCard}
                className={`${isTheOfficialCard ? 'input-disabled' : ''} ${errors.name ? 'input-error' : ''}`}
              />
              {errors.name && <p className="error-text">{errors.name}</p>}
            </div>

            <div className="InputForm-Container__form__group">
              {isTheOfficialCard ? (
                <label><span className="text__red">*</span>Số CCCD:</label>
              ) : (
                <label>Số CCCD (Không bắt buộc):</label>
              )}
              <input
                name="CCCDNumber"
                value={formData.CCCDNumber}
                onChange={handleChange}
                type="text"
                disabled={isTheOfficialCard}
                className={`${isTheOfficialCard ? 'input-disabled' : ''} ${errors.CCCDNumber ? 'input-error' : ''}`}
              />
              {errors.CCCDNumber && <p className="error-text">{errors.CCCDNumber}</p>}
            </div>

            <div className="InputForm-Container__form__group">
              <label><span className="text__red">*</span>Ngày sinh:</label>
              <input
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                type="date"
                disabled={isTheOfficialCard}
                className={`${isTheOfficialCard ? 'input-disabled' : ''} ${errors.dateOfBirth ? 'input-error' : ''}`}
              />
              {errors.dateOfBirth && <p className="error-text">{errors.dateOfBirth}</p>}
            </div>
          </div>

          <div className="InputForm-Container__row">
            <div className="InputForm-Container__form__group">
              <label>Số BHYT (Không bắt buộc):</label>
              <input
                name="BHYT"
                value={formData.BHYT}
                onChange={handleChange}
                type="text"
                className={errors.BHYT ? 'input-error' : ''}
              />
              {errors.BHYT && <p className="error-text">{errors.BHYT}</p>}
            </div>

            <div className="InputForm-Container__form__group">
              <label>Số điện thoại (Không bắt buộc):</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                type="text"
                className={errors.phone ? 'input-error' : ''}
              />
              {errors.phone && <p className="error-text">{errors.phone}</p>}
            </div>

            <div className="InputForm-Container__form__group">
              <label>Số điện thoại người thân (Không bắt buộc):</label>
              <input
                name="relativePhone"
                value={formData.relativePhone}
                onChange={handleChange}
                type="text"
                className={errors.relativePhone ? 'input-error' : ''}
              />
              {errors.relativePhone && <p className="error-text">{errors.relativePhone}</p>}
            </div>
          </div>

          <div className="InputForm-Container__row">
            <div className="InputForm-Container__form__group">
              <label><span className="text__red">*</span>Giới tính:</label>
              <div className="InputForm-Container__gender">
                <label>
                  <input
                    type="radio"
                    name="gender"
                    className="gender__input"
                    checked={formData.sex === 'Nam'}
                    disabled={isTheOfficialCard}
                    onChange={() => handleRadioChange('Nam')}
                  /> Nam
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    className="gender__input"
                    checked={formData.sex === 'Nữ'}
                    disabled={isTheOfficialCard}
                    onChange={() => handleRadioChange('Nữ')}
                  /> Nữ
                </label>
              </div>
              {errors.sex && <p className="error-text">{errors.sex}</p>}
            </div>

            <div className="InputForm-Container__form__group InputForm-Container__address__group">
              {isTheOfficialCard ? (
                <label><span className="text__red">*</span>Địa chỉ:</label>
              ) : (
                <label>Địa chỉ (Không bắt buộc):</label>
              )}
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                disabled={isTheOfficialCard}
                className={isTheOfficialCard ? 'input-disabled' : ''}
              ></textarea>
            </div>
          </div>

          <div className="InputForm-Container__form__group">
            <label>Lịch sử bệnh (Không bắt buộc):</label>
            <textarea
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              rows={4}
            ></textarea>
          </div>

          <div className="InputForm-Container__form__button">
            <button type="submit">
              {isTheOfficialCard ? 'Tạo sổ khám bệnh chính thức' : 'Tạo sổ khám bệnh tạm thời'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}