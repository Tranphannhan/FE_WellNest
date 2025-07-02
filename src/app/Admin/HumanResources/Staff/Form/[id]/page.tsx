"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button,
    CircularProgress,
    Alert,
    Switch,
    Box,
    Typography,
} from "@mui/material";
import { Upload, type UploadFile } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./EditStaff.css";

interface StaffType {
    _id: string;
    TenNhanVien: string;
    SoDienThoai: string;
    SoCCCD: string;
    GioiTinh: string;
    VaiTro: string;
    ID_PhongXetNghiem: { _id: string; TenPhongXetNghiem: string };
    address: string;
    TrangThaiHoatDong: boolean;
    Image: string;
    Matkhau: string;
}

interface Errors {
    [key: string]: string;
}

const roles = [
    { value: "BacSiXetNghiem", label: "Bác sĩ xét nghiệm" },
    { value: "NhanVien", label: "Nhân viên" },
    { value: "QuanTriVien", label: "Quản trị viên" },
];

const testLabs = [
    { _id: "1", TenPhongXetNghiem: "Phòng xét nghiệm 1" },
    { _id: "2", TenPhongXetNghiem: "Phòng xét nghiệm 2" },
    { _id: "3", TenPhongXetNghiem: "Phòng xét nghiệm 3" },
];

const App: React.FC = () => {
    const [staff, setStaff] = useState<StaffType>({
        _id: "",
        TenNhanVien: "",
        SoDienThoai: "",
        SoCCCD: "",
        GioiTinh: "Nam",
        VaiTro: "",
        ID_PhongXetNghiem: { _id: "", TenPhongXetNghiem: "" },
        address: "",
        TrangThaiHoatDong: true,
        Image: "https://placehold.co/150x150/aabbcc/ffffff?text=Avatar",
        Matkhau: "",
    });

    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [errors, setErrors] = useState<Errors>({});
    const [message, setMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const params = useParams();
    const staffId = params.id as string;

    useEffect(() => {
        if (
            staff.Image &&
            staff.Image !== "https://placehold.co/150x150/aabbcc/ffffff?text=Avatar"
        ) {
            setFileList([
                {
                    uid: "-1",
                    name: "Ảnh nhân viên",
                    status: "done",
                    url: staff.Image.startsWith("data:") ? staff.Image : `/image/${staff.Image}`,
                },
            ]);
        } else {
            setFileList([]);
        }
    }, [staff.Image]);

    const handleChange = (e: { target: { name?: string; value: string } }) => {
        const { name, value } = e.target;

        if (name === "confirmPassword") {
            setConfirmPassword(value);
        } else if (name === "VaiTro") {
            setStaff((prevStaff) => ({
                ...prevStaff,
                VaiTro: value,
                ID_PhongXetNghiem:
                    value === "BacSiXetNghiem"
                        ? prevStaff.ID_PhongXetNghiem
                        : { _id: "", TenPhongXetNghiem: "" },
            }));
        } else if (name === "ID_PhongXetNghiem") {
            const selectedLab = testLabs.find((lab) => lab._id === value);
            setStaff((prevStaff) => ({
                ...prevStaff,
                ID_PhongXetNghiem: selectedLab || { _id: "", TenPhongXetNghiem: "" },
            }));
        } else {
            setStaff((prevStaff) => ({
                ...prevStaff,
                [name as string]: value,
            }));
        }
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
        setStaff((prev) => ({
            ...prev,
            Image: (file.url || file.preview || "") as string,
        }));
    };

    const handleUploadChange = async ({
        fileList: newFileList,
    }: {
        fileList: UploadFile[];
    }) => {
        setFileList(newFileList.slice(-1));
        const latest = newFileList[0];
        if (latest?.originFileObj) {
            const base64 = await getBase64(latest.originFileObj);
            setStaff((prev) => ({
                ...prev,
                Image: base64,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setErrors({});

        // Khởi tạo object lỗi
        const newErrors: Errors = {};

        // Kiểm tra các trường bắt buộc
        if (!staff.TenNhanVien) {
            newErrors.TenNhanVien = "Họ và tên là bắt buộc.";
        }
        if (!staff.SoCCCD) {
            newErrors.SoCCCD = "Số CCCD là bắt buộc.";
        } else if (!/^\d{12}$/.test(staff.SoCCCD)) {
            newErrors.SoCCCD = "Số CCCD phải có đúng 12 chữ số.";
        }
        if (!staff.SoDienThoai) {
            newErrors.SoDienThoai = "Số điện thoại là bắt buộc.";
        } else if (!/^\d{10}$/.test(staff.SoDienThoai)) {
            newErrors.SoDienThoai = "Số điện thoại phải có đúng 10 chữ số.";
        }
        if (!staff.VaiTro) {
            newErrors.VaiTro = "Chọn vai trò là bắt buộc.";
        }
        if (staff.VaiTro === "BacSiXetNghiem" && !staff.ID_PhongXetNghiem._id) {
            newErrors.ID_PhongXetNghiem = "Chọn phòng xét nghiệm là bắt buộc.";
        }
        if (
            !staff.Image ||
            staff.Image === "https://placehold.co/150x150/aabbcc/ffffff?text=Avatar"
        ) {
            newErrors.Image = "Ảnh nhân viên là bắt buộc.";
        }

        // Kiểm tra mật khẩu nếu có
        if (staff.Matkhau) {
            if (staff.Matkhau.length < 6) {
                newErrors.Matkhau = "Mật khẩu phải có ít nhất 6 ký tự.";
            }
            if (staff.Matkhau !== confirmPassword) {
                newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
            }
        }

        // Nếu có lỗi, hiển thị và dừng submit
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setMessage("Vui lòng kiểm tra các trường thông tin.");
            return;
        }

        if (!staffId) {
            setMessage("Không tìm thấy ID nhân viên.");
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("TenNhanVien", staff.TenNhanVien || "");
            formData.append("SoDienThoai", staff.SoDienThoai || "");
            formData.append("SoCCCD", staff.SoCCCD || "");
            formData.append("GioiTinh", staff.GioiTinh || "");
            formData.append("VaiTro", staff.VaiTro || "");
            formData.append("ID_PhongXetNghiem", staff.ID_PhongXetNghiem?._id || "");
            formData.append("address", staff.address || "");
            formData.append("TrangThaiHoatDong", String(staff.TrangThaiHoatDong));
            if (staff.Matkhau) formData.append("Matkhau", staff.Matkhau);
            if (fileList[0]?.originFileObj) {
                formData.append("Image", fileList[0].originFileObj);
            }

            const response = await fetch(``, {
                method: "PUT",
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(
                    `Update API error: Status ${response.status}, ${response.statusText}, Body:`,
                    errorText
                );
                setMessage("Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.");
                return;
            }

            setMessage("Cập nhật thông tin nhân viên thành công!");
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            setMessage("Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="AdminContent-Container">
            <h2 className="StaffEdit-Title">Thông tin nhân viên</h2>

            {isLoading && (
                <div className="StaffEdit-Loading">
                    <CircularProgress size={20} className="StaffEdit-Spinner" />
                    Đang tải/lưu dữ liệu...
                </div>
            )}

            {message && (
                <div
                    className={
                        message.includes("thành công")
                            ? "StaffEdit-MessageSuccess"
                            : "StaffEdit-MessageError"
                    }
                >
                    <Alert
                        severity={message.includes("thành công") ? "success" : "error"}
                    >
                        {message}
                    </Alert>
                </div>
            )}

            <form onSubmit={handleSubmit} className="StaffEdit-Form">
                <div className="StaffEdit-Grid">
                    <div className="StaffEdit-Avatar">
                        <label className="StaffEdit-Label">
                            Ảnh <span className="StaffEdit-RedStar">*</span>:
                        </label>
                        <Upload
                            className="StaffEdit-UploadFullWidth"
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
                        {errors.Image && <p className="StaffEdit-ErrorText">{errors.Image}</p>}
                    </div>

                    <div className="StaffEdit-FormSection">
                        <div className="StaffEdit-FormGrid">
                            <div className="StaffEdit-FormControl">
                                <label htmlFor="TenNhanVien" className="StaffEdit-Label">
                                    Họ và tên <span className="StaffEdit-RedStar">*</span>:
                                </label>
                                <div className="StaffEdit-InputContainer">
                                    <TextField
                                        fullWidth
                                        id="TenNhanVien"
                                        name="TenNhanVien"
                                        value={staff.TenNhanVien}
                                        onChange={handleChange}
                                        placeholder="Nhập họ và tên"
                                        className={`StaffEdit-Input ${errors.TenNhanVien ? "StaffEdit-InputError" : ""}`}
                                        error={!!errors.TenNhanVien}
                                    />
                                </div>
                            </div>
                            <div className="StaffEdit-FormControl">
                                <label htmlFor="SoCCCD" className="StaffEdit-Label">
                                    Số CCCD <span className="StaffEdit-RedStar">*</span>:
                                </label>
                                <div className="StaffEdit-InputContainer">
                                    <TextField
                                        fullWidth
                                        id="SoCCCD"
                                        name="SoCCCD"
                                        value={staff.SoCCCD}
                                        onChange={handleChange}
                                        placeholder="Nhập số CCCD"
                                        className={`StaffEdit-Input ${errors.SoCCCD ? "StaffEdit-InputError" : ""}`}
                                        error={!!errors.SoCCCD}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="StaffEdit-FormGrid3">
                            <div className="StaffEdit-FormGrid3-Content1 StaffEdit-FormControl">
                                <label htmlFor="SoDienThoai" className="StaffEdit-Label">
                                    Số điện thoại <span className="StaffEdit-RedStar">*</span>:
                                </label>
                                <div className="StaffEdit-InputContainer">
                                    <TextField
                                        fullWidth
                                        id="SoDienThoai"
                                        name="SoDienThoai"
                                        value={staff.SoDienThoai}
                                        onChange={handleChange}
                                        placeholder="Nhập số điện thoại"
                                        className={`StaffEdit-Input ${errors.SoDienThoai ? "StaffEdit-InputError" : ""}`}
                                        error={!!errors.SoDienThoai}
                                        type="tel"
                                    />
                                </div>
                            </div>
                            <div className="StaffEdit-FormGrid3-Content2">
                                <label className="StaffEdit-Label">Giới tính:</label>
                                <div className="StaffEdit-RadioGroup">
                                    <RadioGroup
                                        row
                                        name="GioiTinh"
                                        value={staff.GioiTinh}
                                        onChange={handleChange}
                                        className="StaffEdit-Radio"
                                    >
                                        <FormControlLabel
                                            value="Nam"
                                            control={<Radio className="StaffEdit-Radio" />}
                                            label="Nam"
                                        />
                                        <FormControlLabel
                                            value="Nữ"
                                            control={<Radio className="StaffEdit-Radio" />}
                                            label="Nữ"
                                        />
                                    </RadioGroup>
                                </div>
                            </div>
                        </div>
                        <div className="StaffEdit-FormGrid">
                            <div className="StaffEdit-FormControl">
                                <label htmlFor="Matkhau" className="StaffEdit-Label">
                                    Mật khẩu:
                                </label>
                                <div className="StaffEdit-InputContainer">
                                    <TextField
                                        fullWidth
                                        id="Matkhau"
                                        name="Matkhau"
                                        value={staff.Matkhau}
                                        onChange={handleChange}
                                        placeholder="Nhập mật khẩu"
                                        className={`StaffEdit-Input ${errors.Matkhau ? "StaffEdit-InputError" : ""}`}
                                        error={!!errors.Matkhau}
                                        helperText={errors.Matkhau}
                                        type="password"
                                    />
                                </div>
                            </div>
                            <div className="StaffEdit-FormControl">
                                <label htmlFor="confirmPassword" className="StaffEdit-Label">
                                    Xác nhận mật khẩu:
                                </label>
                                <div className="StaffEdit-InputContainer">
                                    <TextField
                                        fullWidth
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Nhập lại mật khẩu"
                                        className={`StaffEdit-Input ${errors.confirmPassword ? "StaffEdit-InputError" : ""}`}
                                        error={!!errors.confirmPassword}
                                        helperText={errors.confirmPassword}
                                        type="password"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="StaffEdit-Hr" />

                <div className="StaffEdit-FormGrid4">
                    <FormControl fullWidth className="StaffEdit-FormGridChild StaffEdit-SelectStatus">
                        <InputLabel shrink className="StaffEdit-SelectLabel" sx={{ fontSize: 20 }}>
                            Trạng thái tài khoản
                        </InputLabel>
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="start"
                            mt={1}
                        >
                            <Switch
                                checked={staff.TrangThaiHoatDong}
                                onChange={(e) =>
                                    setStaff((prev) => ({
                                        ...prev,
                                        TrangThaiHoatDong: e.target.checked,
                                    }))
                                }
                            />
                            <Typography variant="body2" color="text.secondary">
                                {staff.TrangThaiHoatDong ? "Hoạt động" : "Khóa tài khoản"}
                            </Typography>
                        </Box>
                    </FormControl>


                    <div className="StaffEdit-FormGridChild StaffEdit-SelectStatus">
                        <FormControl
                            fullWidth
                            size="small"
                            className={`StaffEdit-Select ${errors.VaiTro ? "StaffEdit-SelectError" : ""}`}
                        >
                            <InputLabel id="VaiTro-label">Chọn vai trò</InputLabel>
                            <Select
                                labelId="VaiTro-label"
                                id="VaiTro"
                                name="VaiTro"
                                value={staff.VaiTro}
                                onChange={handleChange}
                                label="Chọn vai trò"
                                error={!!errors.VaiTro}
                            >
                                <MenuItem value="">Chọn vai trò</MenuItem>
                                {roles.map((role) => (
                                    <MenuItem key={role.value} value={role.value}>
                                        {role.label}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.VaiTro && <p className="StaffEdit-ErrorText">{errors.VaiTro}</p>}
                        </FormControl>
                    </div>

                    {staff.VaiTro === "BacSiXetNghiem" && (
                        <div className="StaffEdit-FormGridChild StaffEdit-SelectStatus">
                            <FormControl
                                fullWidth
                                size="small"
                                className={`StaffEdit-Select ${errors.ID_PhongXetNghiem ? "StaffEdit-SelectError" : ""}`}
                            >
                                <InputLabel id="ID_PhongXetNghiem-label">Chọn phòng xét nghiệm</InputLabel>
                                <Select
                                    labelId="ID_PhongXetNghiem-label"
                                    id="ID_PhongXetNghiem"
                                    name="ID_PhongXetNghiem"
                                    value={staff.ID_PhongXetNghiem._id}
                                    onChange={handleChange}
                                    label="Chọn phòng xét nghiệm"
                                    error={!!errors.ID_PhongXetNghiem}
                                >
                                    <MenuItem value="">Chọn phòng xét nghiệm</MenuItem>
                                    {testLabs.map((lab) => (
                                        <MenuItem key={lab._id} value={lab._id}>
                                            {lab.TenPhongXetNghiem}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.ID_PhongXetNghiem && (
                                    <p className="StaffEdit-ErrorText">{errors.ID_PhongXetNghiem}</p>
                                )}
                            </FormControl>
                        </div>
                    )}

                </div>

                <div className="StaffEdit-ButtonContainer">
                    <Button
                        variant="contained"
                        color="inherit"
                        className="StaffEdit-CancelButton"
                        onClick={() => {
                            console.log("Hủy bỏ chỉnh sửa.");
                            setMessage("Đã hủy bỏ chỉnh sửa.");
                            setTimeout(() => setMessage(""), 3000);
                        }}
                    >
                        Quay lại
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={isLoading}
                        className="StaffEdit-SubmitButton"
                    >
                        {isLoading ? "Đang cập nhật..." : "Cập nhật"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default App;