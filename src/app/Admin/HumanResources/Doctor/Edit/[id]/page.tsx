'use client';
import React, { useState, useEffect, useRef } from 'react';
import { DoctorType, Khoa, ClinicType } from '@/app/types/doctorTypes/doctorTypes';
import { useParams } from 'next/navigation';
import './EditDoctor.css';

interface Errors {
  [key: string]: string;
}

interface DoctorUpdatePayload {
  TenBacSi?: string;
  SoDienThoai?: string;
  SoCCCD?: string;
  NamSinh?: string;
  GioiTinh?: string;
  HocVi?: string;
  ID_Khoa?: string;
  Id_PhongKham?: string;
  TrangThaiHoatDong?: boolean;
  Image?: string;
  Matkhau?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export async function getDoctorDetails(id: string): Promise<DoctorType | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/Bacsi/detail/${id}`);
    if (!response.ok) {
      console.error(`API error: Status ${response.status}, ${response.statusText}`);
      return null;
    }
    const data = await response.json();
    console.log('Doctor API response:', data);

    if (Array.isArray(data) && data.length > 0) {
      return data[0];
    }

    return data.data || data;
  } catch (error) {
    console.error('Fetch doctor details error:', error);
    return null;
  }
}

export async function getSpecialties(): Promise<Khoa[] | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/Khoa/Pagination`);
    if (!response.ok) {
      console.error(`API error: Status ${response.status}, ${response.statusText}`);
      return null;
    }
    const data = await response.json();
    console.log('Specialties API response:', data);
    return data.data || data;
  } catch (error) {
    console.error('Fetch specialties error:', error);
    return null;
  }
}

export async function getClinicsBySpecialty(specialtyId: string): Promise<ClinicType[] | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/Phong_Kham/LayTheoKhoa/${specialtyId}`);
    if (!response.ok) {
      console.error(`API error: Status ${response.status}, ${response.statusText}`);
      return null;
    }
    const data = await response.json();
    console.log('Clinics API response:', data);
    return data.data || data;
  } catch (error) {
    console.error('Fetch clinics error:', error);
    return null;
  }
}

export async function updateDoctor(id: string, doctorData: DoctorUpdatePayload): Promise<boolean> {
  try {
    const payload: DoctorUpdatePayload = { ...doctorData };
    if (typeof payload.TrangThaiHoatDong === 'string') {
      payload.TrangThaiHoatDong = payload.TrangThaiHoatDong === 'true';
    }
    if (!payload.Matkhau) {
      delete payload.Matkhau;
    }

    console.log('Sending payload:', payload);

    const response = await fetch(`${API_BASE_URL}/Bacsi/Edit/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Update API error: Status ${response.status}, ${response.statusText}, Body:`, errorText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Update doctor error:', error);
    return false;
  }
}

const App: React.FC = () => {
  const [doctor, setDoctor] = useState<DoctorType & { SoCCCD?: string; address?: string; NamSinh?: string }>({
    _id: '',
    TenBacSi: '',
    SoDienThoai: '',
    SoCCCD: '',
    NamSinh: '1',
    GioiTinh: 'Nam',
    HocVi: '',
    ID_Khoa: { _id: '', TenKhoa: '', TrangThaiHoatDong: true },
    Id_PhongKham: { _id: '', SoPhongKham: '' },
    address: '',
    TrangThaiHoatDong: true,
    Image: 'https://placehold.co/150x150/aabbcc/ffffff?text=Avatar',
    Matkhau: '',
  });

  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [specialties, setSpecialties] = useState<Khoa[]>([]);
  const [clinics, setClinics] = useState<ClinicType[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const params = useParams();
  const doctorId = params.id as string;

  useEffect(() => {
    console.log('Doctor ID from URL:', doctorId);
    if (!doctorId) {
      console.log('No Doctor ID found in URL');
      setMessage('Không tìm thấy ID bác sĩ trong URL.');
    }
  }, [doctorId]);

  useEffect(() => {
    if (!doctorId) {
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const doctorData = await getDoctorDetails(doctorId);
        const specialtyData = await getSpecialties();
        if (specialtyData) {
          setSpecialties(specialtyData);
        } else {
          console.log('No specialties data returned');
          setMessage('Không thể tải danh sách chuyên khoa.');
        }

        if (doctorData) {
          let mappedId_PhongKham = typeof doctorData.Id_PhongKham === 'string'
            ? { _id: doctorData.Id_PhongKham, SoPhongKham: '' }
            : doctorData.Id_PhongKham || { _id: '', SoPhongKham: '' };

          const updatedDoctor = {
            ...doctorData,
            SoCCCD: doctorData.SoCCCD || '',
            NamSinh: doctorData.NamSinh || "0",
            Matkhau: '',
            ID_Khoa: doctorData.ID_Khoa || { _id: '', TenKhoa: '', TrangThaiHoatDong: true },
            Id_PhongKham: mappedId_PhongKham,
          };

          setDoctor(updatedDoctor);
          console.log('Updated doctor state:', updatedDoctor);

          if (doctorData.ID_Khoa?._id) {
            const clinicData = await getClinicsBySpecialty(doctorData.ID_Khoa._id);
            if (clinicData) {
              setClinics(clinicData);
              if (typeof doctorData.Id_PhongKham === 'string') {
                const foundClinic = clinicData.find(c => c._id === doctorData.Id_PhongKham);
                if (foundClinic) {
                  setDoctor(prev => ({
                    ...prev,
                    Id_PhongKham: foundClinic,
                  }));
                  console.log('Updated Id_PhongKham with clinic:', foundClinic);
                } else {
                  console.log('No matching clinic found for Id_PhongKham:', doctorData.Id_PhongKham);
                  setMessage('Không tìm thấy phòng khám tương ứng.');
                }
              }
            } else {
              console.log('No clinic data returned');
              setMessage('Không thể tải danh sách phòng khám.');
            }
          } else {
            console.log('No doctor data returned');
            setMessage('Không tìm thấy thông tin bác sĩ.');
          }
        } else {
          console.log('No doctor data returned');
          setMessage('Không tìm thấy thông tin bác sĩ.');
        }
      } catch (error) {
        console.error('Fetch data error:', error);
        setMessage('Có lỗi xảy ra khi tải thông tin. Vui lòng thử lại.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [doctorId]);

  useEffect(() => {
    if (doctor.ID_Khoa?._id) {
      const fetchClinics = async () => {
        const clinicData = await getClinicsBySpecialty(doctor.ID_Khoa!._id);
        if (clinicData) {
          setClinics(clinicData);
          console.log('Clinics loaded:', clinicData);
        } else {
          setClinics([]);
          console.log('No clinics loaded');
          setMessage('Không thể tải danh sách phòng khám.');
        }
      };
      fetchClinics();
    } else {
      setClinics([]);
      console.log('No specialty ID, clearing clinics');
    }
  }, [doctor.ID_Khoa?._id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else if (name === 'ID_Khoa') {
      const selectedSpecialty = specialties.find((s) => s._id === value);
      setDoctor((prevDoctor) => ({
        ...prevDoctor,
        ID_Khoa: selectedSpecialty || { _id: '', TenKhoa: '', TrangThaiHoatDong: true },
        Id_PhongKham: { _id: '', SoPhongKham: '' },
      }));
    } else if (name === 'Id_PhongKham') {
      const selectedClinic = clinics.find((c) => c._id === value);
      setDoctor((prevDoctor) => ({
        ...prevDoctor,
        Id_PhongKham: selectedClinic || { _id: '', SoPhongKham: '' },
      }));
    } else {
      setDoctor((prevDoctor) => ({
        ...prevDoctor,
        [name]: value,
      }));
    }
    console.log(`Field ${name} updated to:`, value);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setDoctor((prevDoctor) => ({
          ...prevDoctor,
          Image: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setDoctor((prevDoctor) => ({
        ...prevDoctor,
        Image: 'https://placehold.co/150x150/aabbcc/ffffff?text=Avatar',
      }));
      setSelectedFile(null);
    }
    e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setErrors({});

    if (doctor.Matkhau !== confirmPassword) {
      setErrors({ confirmPassword: 'Mật khẩu xác nhận không khớp.' });
      setMessage('Vui lòng kiểm tra mật khẩu.');
      return;
    }

    if (!doctorId) {
      setMessage('Không tìm thấy ID bác sĩ.');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('TenBacSi', doctor.TenBacSi || '');
      formData.append('SoDienThoai', doctor.SoDienThoai || '');
      formData.append('SoCCCD', doctor.SoCCCD || '');
      formData.append('NamSinh', doctor.NamSinh || '');
      formData.append('GioiTinh', doctor.GioiTinh || '');
      formData.append('HocVi', doctor.HocVi || '');
      formData.append('ID_Khoa', doctor.ID_Khoa?._id || '');
      formData.append('Id_PhongKham', doctor.Id_PhongKham?._id || '');
      formData.append('address', doctor.address || '');
      formData.append('TrangThaiHoatDong', String(doctor.TrangThaiHoatDong));
      if (doctor.Matkhau) formData.append('Matkhau', doctor.Matkhau);
      if (selectedFile) formData.append('Image', selectedFile);

      const response = await fetch(`${API_BASE_URL}/Bacsi/Edit/${doctorId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Update API error: Status ${response.status}, ${response.statusText}, Body:`, errorText);
        setMessage('Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.');
        return;
      }

      setMessage('Cập nhật thông tin bác sĩ thành công!');
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error);
      setMessage('Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="AdminContent-Container">
      <h2 className="title">Thông tin bác sĩ</h2>

      {isLoading && (
        <div className="loading">
          <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Đang tải/lưu dữ liệu...
        </div>
      )}

      {message && (
        <div className={message.includes('thành công') ? 'message-success' : 'message-error'}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form">
        <div className="grid-container">
          <div className="avatar-container">
            <label className="avatar-label">Ảnh đại diện</label>
            <div className="avatar-box">
              <img
                src={
                  doctor.Image?.startsWith('data:')
                    ? doctor.Image
                    : `${API_BASE_URL}/image/${doctor.Image}`
                }
                alt="Avatar"
                className="avatar-image"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/150x150/aabbcc/ffffff?text=Avatar';
                }}
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="avatar-button"
                aria-label="Chọn ảnh đại diện"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="avatar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>Chọn ảnh</span>
              </button>
            </div>
          </div>

          <div className="form-section">
            <div className="form-grid">
              <div>
                <label htmlFor="TenBacSi" className="label">Họ và tên <span className="red-star">*</span>:</label>
                <div className="input-container">
                  <input
                    type="text"
                    id="TenBacSi"
                    name="TenBacSi"
                    value={doctor.TenBacSi || ''}
                    onChange={handleChange}
                    placeholder="Nhập họ và tên"
                    className={`input ${errors.TenBacSi ? 'input-error' : ''}`}
                  />
                  {errors.TenBacSi && (
                    <p className="error-text">{errors.TenBacSi}</p>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="cccd" className="label">Số CCCD <span className="red-star">*</span>:</label>
                <div className="input-container">
                  <input
                    type="text"
                    id="SoCCCD"
                    name="SoCCCD"
                    value={doctor.SoCCCD || ''}
                    readOnly
                    onChange={handleChange}
                    placeholder="Nhập số CCCD"
                    className={`input ${errors.SoCCCD ? 'input-error' : ''}`}
                  />
                  {errors.SoCCCD && (
                    <p className="error-text">{errors.cccd}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="form-grid-3">
              <div>
                <label htmlFor="SoDienThoai" className="label">Số điện thoại <span className="red-star">*</span>:</label>
                <div className="input-container">
                  <input
                    type="tel"
                    id="SoDienThoai"
                    name="SoDienThoai"
                    value={doctor.SoDienThoai || ''}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                    className={`input ${errors.SoDienThoai ? 'input-error' : ''}`}
                  />
                  {errors.SoDienThoai && (
                    <p className="error-text">{errors.SoDienThoai}</p>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="NamSinh" className="label">Năm sinh <span className="red-star">*</span>:</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="NamSinh"
                    name="NamSinh"
                    value={doctor.NamSinh || ''}
                    onChange={handleChange}
                    placeholder="Nhập năm sinh"
                    className={`input ${errors.NamSinh ? 'input-error' : ''}`}
                  />
                  {errors.NamSinh && (
                    <p className="error-text">{errors.NamSinh}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="label">Giới tính:</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="GioiTinh"
                      value="Nam"
                      checked={doctor.GioiTinh === 'Nam'}
                      onChange={handleChange}
                      className="radio"
                    />
                    <span className="radio-text">Nam</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="GioiTinh"
                      value="Nữ"
                      checked={doctor.GioiTinh === 'Nữ'}
                      onChange={handleChange}
                      className="radio"
                    />
                    <span className="radio-text">Nữ</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="form-grid">
              <div>
                <label htmlFor="Matkhau" className="label">Mật khẩu <span className="red-star">*</span>:</label>
                <div className="input-container">
                  <input
                    type="password"
                    id="Matkhau"
                    name="Matkhau"
                    value={doctor.Matkhau || ''}
                    onChange={handleChange}
                    placeholder="Nhập mật khẩu"
                    className={`input ${errors.Matkhau ? 'input-error' : ''}`}
                  />
                  {errors.Matkhau && (
                    <p className="error-text">{errors.Matkhau}</p>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="label">Xác nhận mật khẩu <span className="red-star">*</span>:</label>
                <div className="input-container">
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleChange}
                    placeholder="Nhập lại mật khẩu"
                    className={`input ${errors.confirmPassword ? 'input-error' : ''}`}
                  />
                  {errors.confirmPassword && (
                    <p className="error-text">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="hr" />

        <div className="form-grid-3">
          <div>
            <label htmlFor="HocVi" className="select-label">Học vị <span className="red-star">*</span>:</label>
            <select
              id="HocVi"
              name="HocVi"
              value={doctor.HocVi || ''}
              onChange={handleChange}
              className={`select ${errors.HocVi ? 'select-error' : ''}`}
            >
              <option value="">Chọn học vị</option>
              <option value="Cử nhân">Cử nhân</option>
              <option value="Thạc sĩ">Thạc sĩ</option>
              <option value="Tiến sĩ">Tiến sĩ</option>
              <option value="Phó giáo sư">Phó giáo sư</option>
              <option value="Giáo sư">Giáo sư</option>
            </select>
            {errors.HocVi && <p className="error-text">{errors.HocVi}</p>}
          </div>
          <div>
            <label htmlFor="ID_Khoa" className="select-label">Chuyên khoa <span className="red-star">*</span>:</label>
            <select
              id="ID_Khoa"
              name="ID_Khoa"
              value={doctor.ID_Khoa?._id || ''}
              onChange={handleChange}
              className={`select ${errors.ID_Khoa ? 'select-error' : ''}`}
            >
              <option value="">Chọn chuyên khoa</option>
              {specialties.map((specialty) => (
                <option key={specialty._id} value={specialty._id}>
                  {specialty.TenKhoa}
                </option>
              ))}
            </select>
            {errors.ID_Khoa && <p className="error-text">{errors.ID_Khoa}</p>}
          </div>
          <div>
            <label htmlFor="Id_PhongKham" className="select-label">Phòng khám <span className="red-star">*</span>:</label>
            <select
              id="Id_PhongKham"
              name="Id_PhongKham"
              value={doctor.Id_PhongKham?._id || ''}
              onChange={handleChange}
              className={`select ${errors.Id_PhongKham ? 'select-error' : ''}`}
            >
              <option value="">Chọn phòng khám</option>
              {clinics.map((clinic) => (
                <option key={clinic._id} value={clinic._id}>
                  {clinic.SoPhongKham}
                </option>
              ))}
            </select>
            {errors.Id_PhongKham && <p className="error-text">{errors.Id_PhongKham}</p>}
          </div>
          <div style={{ gridColumn: 'span 3' }}>
            <label className="select-label">Trạng thái tài khoản:</label>
            <div className="radio-group-status">
              <label className="radio-label">
                <input
                  type="radio"
                  name="TrangThaiHoatDong"
                  value="true"
                  checked={doctor.TrangThaiHoatDong === true}
                  onChange={() => setDoctor((prev) => ({ ...prev, TrangThaiHoatDong: true }))}
                  className="radio-status"
                />
                <span className="radio-text">Hoạt động</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="TrangThaiHoatDong"
                  value="false"
                  checked={doctor.TrangThaiHoatDong === false}
                  onChange={() => setDoctor((prev) => ({ ...prev, TrangThaiHoatDong: false }))}
                  className="radio-status"
                />
                <span className="radio-text">Khóa tài khoản</span>
              </label>
            </div>
          </div>
        </div>

        <div className="button-container">
          <button
            type="button"
            onClick={() => {
              console.log('Hủy bỏ chỉnh sửa.');
              setMessage('Đã hủy bỏ chỉnh sửa.');
              setTimeout(() => setMessage(''), 3000);
            }}
            className="cancel-button"
          >
            Quay lại
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="submit-button"
          >
            {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default App;