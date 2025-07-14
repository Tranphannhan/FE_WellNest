"use client";
import React, { useState, useEffect } from "react";
import {
  DoctorType,
  Khoa,
  ClinicType,
} from "@/app/types/doctorTypes/doctorTypes";
import { useRouter } from "next/navigation";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  Alert,
  Switch,
  Box,
  Typography,
} from "@mui/material";
import "./AddDoctor.css";
import { Upload, type UploadFile } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { FaArrowLeft, FaSpinner } from "react-icons/fa6";
import { FaSave } from "react-icons/fa";
import BreadcrumbComponent from "@/app/Admin/component/Breadcrumb";
import { addDoctor, getClinicsBySpecialty, getSpecialties } from "@/app/Admin/services/DoctorSevices";

interface Errors {
  [key: string]: string;
}

export default function DoctorEdit(){
  const [doctor, setDoctor] = useState<
    DoctorType & { SoCCCD?: string; address?: string; NamSinh?: string }
  >({
    _id: "",
    TenBacSi: "",
    SoDienThoai: "",
    SoCCCD: "",
    NamSinh: "",
    GioiTinh: "Nam",
    HocVi: "",
    ID_Khoa: { _id: "", TenKhoa: "", TrangThaiHoatDong: true },
    Id_PhongKham: { _id: "", SoPhongKham: "" },
    address: "",
    TrangThaiHoatDong: true,
    Image: "",
    Matkhau: "",
  });

  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [specialties, setSpecialties] = useState<Khoa[]>([]);
  const [clinics, setClinics] = useState<ClinicType[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    const fetchSpecialties = async () => {
      setIsLoading(true);
      try {
        const specialtyData = await getSpecialties();
        if (specialtyData) {
          setSpecialties(specialtyData);
        } else {
          console.log("No specialties data returned");
          setMessage("Không thể tải danh sách chuyên khoa.");
        }
      } catch (error) {
        console.error("Fetch specialties error:", error);
        setMessage("Có lỗi xảy ra khi tải danh sách chuyên khoa. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpecialties();
  }, []);

  useEffect(() => {
    if (doctor.ID_Khoa?._id) {
      const fetchClinics = async () => {
        const clinicData = await getClinicsBySpecialty(doctor.ID_Khoa!._id);
        if (clinicData) {
          setClinics(clinicData);
          console.log("Clinics loaded:", clinicData);
        } else {
          setClinics([]);
          console.log("No clinics loaded");
          setMessage("Không thể tải danh sách phòng khám.");
        }
      };
      fetchClinics();
    } else {
      setClinics([]);
      console.log("No specialty ID, clearing clinics");
    }
  }, [doctor.ID_Khoa?._id]);

  const handleChange = (e: { target: { name?: string; value: string } }) => {
    const { name, value } = e.target;

    if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else if (name === "ID_Khoa") {
      const selectedSpecialty = specialties.find((s) => s._id === value);
      setDoctor((prevDoctor) => ({
        ...prevDoctor,
        ID_Khoa: selectedSpecialty || {
          _id: "",
          TenKhoa: "",
          TrangThaiHoatDong: true,
        },
        Id_PhongKham: { _id: "", SoPhongKham: "" },
      }));
    } else if (name === "Id_PhongKham") {
      const selectedClinic = clinics.find((c) => c._id === value);
      setDoctor((prevDoctor) => ({
        ...prevDoctor,
        Id_PhongKham: selectedClinic || { _id: "", SoPhongKham: "" },
      }));
    } else {
      setDoctor((prevDoctor) => ({
        ...prevDoctor,
        [name as string]: value,
      }));
    }
    console.log(`Field ${name} updated to:`, value);
  };

  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview && file.originFileObj) {
      file.preview = await getBase64(file.originFileObj as File);
    }
    setDoctor((prev) => ({
      ...prev,
      Image: (file.url || file.preview || "") as string,
    }));
  };

  const handleUploadChange = async ({
    fileList: newFileList,
  }: {
    fileList: UploadFile[];
  }) => {
    setFileList(newFileList.slice(-1)); // Chỉ giữ 1 ảnh
    const latest = newFileList[0];
    if (latest?.originFileObj) {
      const base64 = await getBase64(latest.originFileObj);
      setDoctor((prev) => ({
        ...prev,
        Image: base64,
      }));
      setSelectedFile(latest.originFileObj);
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setMessage("");
  setErrors({});
  
  const newErrors: Errors = {};

  // Validate các trường bắt buộc trước khi gọi API
  if (!doctor.TenBacSi) newErrors.TenBacSi = "Họ và tên là bắt buộc.";
  if (!doctor.SoCCCD) newErrors.SoCCCD = "Số CCCD là bắt buộc.";
  if (!doctor.SoDienThoai) newErrors.SoDienThoai = "Số điện thoại là bắt buộc.";
  if (!doctor.NamSinh) newErrors.NamSinh = "Năm sinh là bắt buộc.";
  if (!doctor.ID_Khoa?._id) newErrors.ID_Khoa = "Chọn chuyên khoa là bắt buộc.";
  if (!doctor.Id_PhongKham?._id) newErrors.Id_PhongKham = "Chọn phòng khám là bắt buộc.";
  if (!doctor.HocVi) newErrors.HocVi = "Chọn học vị là bắt buộc.";
  if (!doctor.Image) newErrors.Image = "Ảnh bác sĩ là bắt buộc.";
  if (!doctor.Matkhau) newErrors.Matkhau = "Mật khẩu là bắt buộc.";
  else if (doctor.Matkhau.length < 6) newErrors.Matkhau = "Mật khẩu ít nhất 6 ký tự.";
  if (doctor.Matkhau !== confirmPassword) newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    setMessage("Vui lòng kiểm tra các trường thông tin.");
    return;
  }

  // Gửi form lên server
  setIsLoading(true);
  try {
    const formData = new FormData();
    formData.append("TenBacSi", doctor.TenBacSi || "");
    formData.append("SoDienThoai", doctor.SoDienThoai || "");
    formData.append("SoCCCD", doctor.SoCCCD || "");
    formData.append("NamSinh", doctor.NamSinh || "");
    formData.append("GioiTinh", doctor.GioiTinh || "");
    formData.append("HocVi", doctor.HocVi || "");
    formData.append("ID_Khoa", doctor.ID_Khoa?._id || "");
    formData.append("Id_PhongKham", doctor.Id_PhongKham?._id || "");
    formData.append("address", doctor.address || "");
    formData.append("TrangThaiHoatDong", String(doctor.TrangThaiHoatDong));
    formData.append("Matkhau", doctor.Matkhau || "");
    if (selectedFile) formData.append("Image", selectedFile);

    const result = await addDoctor(formData);

    if (!result.success) {
      // Check nếu BE trả về thông báo lỗi trùng
      if (result.message?.includes("Số CCCD")) {
        setErrors({ SoCCCD: result.message });
      } else if (result.message?.includes("Số điện thoại")) {
        setErrors({ SoDienThoai: result.message });
      } else {
        setMessage(result.message || "Có lỗi xảy ra khi thêm bác sĩ.");
      }
      return;
    }

    setMessage("Thêm bác sĩ thành công!");
    setDoctor({
      _id: "",
      TenBacSi: "",
      SoDienThoai: "",
      SoCCCD: "",
      NamSinh: "",
      GioiTinh: "Nam",
      HocVi: "",
      ID_Khoa: { _id: "", TenKhoa: "", TrangThaiHoatDong: true },
      Id_PhongKham: { _id: "", SoPhongKham: "" },
      address: "",
      TrangThaiHoatDong: true,
      Image: "",
      Matkhau: "",
    });
    setConfirmPassword("");
    setFileList([]);
    setSelectedFile(null);
  } catch (err) {
    console.error("Lỗi khi thêm bác sĩ:", err);
    setMessage("Có lỗi xảy ra khi thêm bác sĩ. Vui lòng thử lại.");
  } finally {
    setIsLoading(false);
  }
};


  const handleCancel = () => {
    router.push('/Admin/HumanResources/Doctor');
  };

  return (
    <div className="AdminContent-Container">
      <BreadcrumbComponent
                items={[
                  { title: "Trang chủ", href: "/Admin" },
                  { title: "Nhân sự", href: "/Admin/HumanResources/Doctor" },
                  { title: "Bác sĩ", href: "/Admin/HumanResources/Doctor" },
                  { title: "Thêm bác sĩ" },
                ]}
              />
      <h2 className="title">Thêm bác sĩ</h2>

      {isLoading && (
        <div className="loading">
          <CircularProgress size={20} className="spinner" />
          Đang tải/lưu dữ liệu...
        </div>
      )}

      {message && (
        <div
          className={
            message.includes("thành công") ? "message-success" : "message-error"
          }
        >
          <Alert
            severity={message.includes("thành công") ? "success" : "error"}
          >
            {message}
          </Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="form">
        <div className="grid-container">
          <div className="avatar-container">
            <label className="label">
              Ảnh <span className="red-star">*</span>:
            </label>
            <Upload
              className="upload-fullwidth"
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleUploadChange}
              beforeUpload={() => false}
              maxCount={1}
              accept="image/*"
            >
              {fileList.length >= 1 ? null : (
                <div style={{ color: "black", textAlign: "center" }}>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Chọn ảnh</div>
                </div>
              )}
            </Upload>
            {errors.Image && <p className="error-text">{errors.Image}</p>}
          </div>

          <div className="form-section">
            <div className="form-grid">
              <div className="form-control">
                <label htmlFor="TenBacSi" className="label">
                  Họ và tên <span className="red-star">*</span>:
                </label>
                <div className="input-container">
                  <TextField
                    fullWidth
                    id="TenBacSi"
                    name="TenBacSi"
                    value={doctor.TenBacSi || ""}
                    onChange={handleChange}
                    placeholder="Nhập họ và tên"
                    className={`input ${errors.TenBacSi ? "input-error" : ""}`}
                    error={!!errors.TenBacSi}
                    helperText={errors.TenBacSi}
                    required
                  />
                </div>
              </div>
              <div className="form-control">
                <label htmlFor="SoCCCD" className="label">
                  Số CCCD <span className="red-star">*</span>:
                </label>
                <div className="input-container">
                  <TextField
                    fullWidth
                    id="SoCCCD"
                    name="SoCCCD"
                    value={doctor.SoCCCD || ""}
                    onChange={handleChange}
                    placeholder="Nhập số CCCD"
                    className={`input ${errors.SoCCCD ? "input-error" : ""}`}
                    error={!!errors.SoCCCD}
                    helperText={errors.SoCCCD}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="form-grid-3">
              <div className="form-grid-3-content1 form-control">
                <label htmlFor="SoDienThoai" className="label">
                  Số điện thoại <span className="red-star">*</span>:
                </label>
                <div className="input-container">
                  <TextField
                    fullWidth
                    id="SoDienThoai"
                    name="SoDienThoai"
                    value={doctor.SoDienThoai || ""}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                    className={`input ${errors.SoDienThoai ? "input-error" : ""}`}
                    error={!!errors.SoDienThoai}
                    helperText={errors.SoDienThoai}
                    required
                    type="tel"
                  />
                </div>
              </div>
              <div className="form-grid-3-content2 form-control">
                <label htmlFor="NamSinh" className="label">
                  Năm sinh <span className="red-star">*</span>:
                </label>
                <div className="input-container">
                  <TextField
                    fullWidth
                    id="NamSinh"
                    name="NamSinh"
                    value={doctor.NamSinh || ""}
                    onChange={handleChange}
                    placeholder="Nhập năm sinh"
                    className={`input ${errors.NamSinh ? "input-error" : ""}`}
                    error={!!errors.NamSinh}
                    helperText={errors.NamSinh}
                    required
                    type="number"
                  />
                </div>
              </div>
              <div className="form-grid-3-content2">
                <label className="label">Giới tính:</label>
                <div className="radio-group">
                  <RadioGroup
                    row
                    name="GioiTinh"
                    value={doctor.GioiTinh || "Nam"}
                    onChange={handleChange}
                    className="radio"
                  >
                    <FormControlLabel
                      value="Nam"
                      control={<Radio className="radio" />}
                      label="Nam"
                    />
                    <FormControlLabel
                      value="Nữ"
                      control={<Radio className="radio" />}
                      label="Nữ"
                    />
                  </RadioGroup>
                </div>
              </div>
            </div>
            <div className="form-grid">
              <div className="form-control">
                <label htmlFor="Matkhau" className="label">
                  Mật khẩu <span className="red-star">*</span>:
                </label>
                <div className="input-container">
                  <TextField
                    fullWidth
                    id="Matkhau"
                    name="Matkhau"
                    value={doctor.Matkhau || ""}
                    onChange={handleChange}
                    placeholder="Nhập mật khẩu"
                    className={`input ${errors.Matkhau ? "input-error" : ""}`}
                    error={!!errors.Matkhau}
                    helperText={errors.Matkhau}
                    type="password"
                    required
                  />
                </div>
              </div>
              <div className="form-control">
                <label htmlFor="confirmPassword" className="label">
                  Xác nhận mật khẩu <span className="red-star">*</span>:
                </label>
                <div className="input-container">
                  <TextField
                    fullWidth
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleChange}
                    placeholder="Nhập lại mật khẩu"
                    className={`input ${errors.confirmPassword ? "input-error" : ""}`}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    type="password"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="hr" />

        <div className="form-grid-4">
          <FormControl fullWidth className="form-grid-children select-status">
            <InputLabel shrink className="select-label" sx={{ fontSize: 20 }}>
              Trạng thái tài khoản
            </InputLabel>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="start"
              mt={1}
            >
              <Switch
                checked={doctor.TrangThaiHoatDong}
                onChange={(e) =>
                  setDoctor((prev) => ({
                    ...prev,
                    TrangThaiHoatDong: e.target.checked,
                  }))
                }
              />
              <Typography variant="body2" color="text.secondary">
                {doctor.TrangThaiHoatDong ? "Hoạt động" : "Khóa tài khoản"}
              </Typography>
            </Box>
          </FormControl>

          <div className="form-grid-children select-Department">
            <FormControl
              fullWidth
              size="small"
              className={`select ${errors.ID_Khoa ? "select-error" : ""}`}
            >
              <InputLabel id="ID_Khoa-label">Chọn chuyên khoa</InputLabel>
              <Select
                labelId="ID_Khoa-label"
                id="ID_Khoa"
                name="ID_Khoa"
                value={doctor.ID_Khoa?._id || ""}
                onChange={handleChange}
                label="Chọn chuyên khoa"
                error={!!errors.ID_Khoa}
              >
                <MenuItem value="">Chọn chuyên khoa</MenuItem>
                {specialties.map((specialty) => (
                  <MenuItem key={specialty._id} value={specialty._id}>
                    {specialty.TenKhoa}
                  </MenuItem>
                ))}
              </Select>
              {errors.ID_Khoa && <p className="error-text">{errors.ID_Khoa}</p>}
            </FormControl>
          </div>
          <div className="form-grid-children select-degree">
            <FormControl
              fullWidth
              size="small"
              className={`select ${errors.HocVi ? "select-error" : ""}`}
            >
              <InputLabel id="HocVi-label">Chọn học vị</InputLabel>
              <Select
                labelId="HocVi-label"
                id="HocVi"
                name="HocVi"
                value={doctor.HocVi || ""}
                onChange={handleChange}
                label="Chọn học vị"
                error={!!errors.HocVi}
              >
                <MenuItem value="">Chọn học vị</MenuItem>
                <MenuItem value="Cử nhân">Cử nhân</MenuItem>
                <MenuItem value="Thạc sĩ">Thạc sĩ</MenuItem>
                <MenuItem value="Tiến sĩ">Tiến sĩ</MenuItem>
                <MenuItem value="Phó giáo sư">Phó giáo sư</MenuItem>
                <MenuItem value="Giáo sư">Giáo sư</MenuItem>
              </Select>
              {errors.HocVi && <p className="error-text">{errors.HocVi}</p>}
            </FormControl>
          </div>
          <div className="form-grid-children">
            <FormControl
              fullWidth
              size="small"
              className={`select ${errors.Id_PhongK}_{Kham ? "select-error" : ""}`}
            >
              <InputLabel id="Id_PhongKham-label">Chọn phòng khám</InputLabel>
              <Select
                labelId="Id_PhongKham-label"
                id="Id_PhongKham"
                name="Id_PhongKham"
                value={doctor.Id_PhongKham?._id || ""}
                onChange={handleChange}
                label="Chọn phòng khám"
                error={!!errors.Id_PhongKham}
              >
                <MenuItem value="">Chọn phòng khám</MenuItem>
                {clinics.map((clinic) => (
                  <MenuItem key={clinic._id} value={clinic._id}>
                    {clinic.SoPhongKham}
                  </MenuItem>
                ))}
              </Select>
              {errors.Id_PhongKham && (
                <p className="error-text">{errors.Id_PhongKham}</p>
              )}
            </FormControl>
          </div>
        </div>

        <div className="button-container">
          <button
            type="button"
            className="bigButton--gray"
            onClick={handleCancel}
          >
            <FaArrowLeft style={{ marginRight: "6px", verticalAlign: "middle" }} />
            Quay lại
          </button>

          <button
            type="submit"
            className="bigButton--blue"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FaSpinner style={{ marginRight: "6px", verticalAlign: "middle" }} className="spin" />
                Đang thêm...
              </>
            ) : (
              <>
                <FaSave style={{ marginRight: "6px", verticalAlign: "middle" }} />
                Thêm bác sĩ
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};