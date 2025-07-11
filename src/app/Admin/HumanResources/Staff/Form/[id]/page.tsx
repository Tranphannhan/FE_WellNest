"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { Upload, type UploadFile } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./EditStaff.css";
import { FaArrowLeft, FaSpinner } from "react-icons/fa6";
import { FaSave } from "react-icons/fa";
import { AccountType, Errors, LoaiTaiKhoan, TestingRoom } from "../page";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export async function getAccountDetails(id: string): Promise<AccountType | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/Tai_Khoan/Detail/${id}`);
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API error: Status ${response.status}, ${errorText}`);
            return null;
        }
        const data = await response.json();
        console.log("Account API response:", data);
        const account = Array.isArray(data) && data.length > 0 ? data[0] : data.data || data;
        return {
            _id: account._id || "",
            TenTaiKhoan: account.TenTaiKhoan || "",
            SoDienThoai: account.SoDienThoai || "",
            SoCCCD: account.SoCCCD || "",
            GioiTinh: account.GioiTinh || "Nam",
            VaiTro: account.Id_LoaiTaiKhoan?.VaiTro || "",
            Id_LoaiTaiKhoan: account.Id_LoaiTaiKhoan || { _id: "", TenLoaiTaiKhoan: "", VaiTro: "" },
            TrangThaiHoatDong: account.TrangThaiHoatDong ?? false,
            Image: account.Image || "https://placehold.co/150x150/aabbcc/ffffff?text=Avatar",
            MatKhau: "",
            Id_PhongThietBi: account.Id_PhongThietBi || "",
        };
    } catch (error) {
        console.error("Fetch account details error:", error);
        return null;
    }
}

export async function getAccountTypes(): Promise<LoaiTaiKhoan[] | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/Loai_Tai_Khoan`);
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Lỗi fetch loại tài khoản nhân viên: ${response.status} - ${errorText}`);
            return null;
        }
        const data = await response.json();
        console.log("Account types API response:", data);
        return data.data || data;
    } catch (error) {
        console.error("Exception khi lấy loại tài khoản nhân viên", error);
        return null;
    }
}

export async function updateAccount(id: string, formData: FormData): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/Tai_Khoan/Edit/${id}`, {
            method: "PUT",
            body: formData,
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Update API error: Status ${response.status}, ${errorText}`);
            return false;
        }
        return true;
    } catch (error) {
        console.error("Update account error:", error);
        if (error instanceof TypeError && error.message === "Failed to fetch") {
            console.error("Possible causes: Network issue, CORS, or server not running at", API_BASE_URL);
        }
        return false;
    }
}

export async function getTestingRoom(page: number): Promise<{ data: TestingRoom[] } | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/Phong_Thiet_Bi/Pagination?page=${page}`);
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API error: Status ${response.status}, ${errorText}`);
            return null;
        }
        const data = await response.json();
        console.log("Testing Room API response:", data);
        return data;
    } catch (error) {
        console.error("Fetch testing rooms error:", error);
        return null;
    }
}

const App: React.FC = () => {
    const [account, setAccount] = useState<AccountType>({
        _id: "",
        TenTaiKhoan: "",
        SoDienThoai: "",
        SoCCCD: "",
        GioiTinh: "Nam",
        VaiTro: "",
        Id_LoaiTaiKhoan: { _id: "", TenLoaiTaiKhoan: "", VaiTro: "" },
        TrangThaiHoatDong: false,
        Image: "https://placehold.co/150x150/aabbcc/ffffff?text=Avatar",
        MatKhau: "",
        Id_PhongThietBi: "",
    });

    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [errors, setErrors] = useState<Errors>({});
    const [message, setMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [accountTypes, setAccountTypes] = useState<LoaiTaiKhoan[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [testLabs, setTestLabs] = useState<TestingRoom[]>([]);

    const params = useParams();
    const accountId = params.id as string;
    const router = useRouter();

    useEffect(() => {
        const fetchTestLabs = async () => {
            try {
                const data = await getTestingRoom(1);
                if (data && Array.isArray(data.data)) {
                    setTestLabs(data.data);
                } else {
                    setMessage("Không thể tải danh sách phòng thiết bị.");
                }
            } catch (error) {
                console.error("Không thể tải danh sách phòng thiết bị", error);
                setMessage("Có lỗi xảy ra khi tải danh sách phòng thiết bị.");
            }
        };

        fetchTestLabs();
    }, []);

    useEffect(() => {
        if (!accountId) return;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const accountData = await getAccountDetails(accountId);
                const accountTypeData = await getAccountTypes();

                if (accountTypeData) {
                    setAccountTypes(accountTypeData);
                } else {
                    setMessage("Không thể tải danh sách loại tài khoản.");
                }

                if (accountData) {
                    setAccount(accountData);
                } else {
                    setMessage("Không tìm thấy thông tin tài khoản.");
                }
            } catch (error) {
                console.error("Fetch data error:", error);
                setMessage("Có lỗi xảy ra khi tải thông tin. Vui lòng thử lại.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [accountId]);

    useEffect(() => {
        if (
            account.Image &&
            account.Image !== "https://placehold.co/150x150/aabbcc/ffffff?text=Avatar"
        ) {
            setFileList([
                {
                    uid: "-1",
                    name: "Ảnh tài khoản",
                    status: "done",
                    url: account.Image.startsWith("data:") ? account.Image : `${API_BASE_URL}/image/${account.Image}`,
                },
            ]);
        } else {
            setFileList([]);
        }
    }, [account.Image]);

    const handleChange = (e: { target: { name?: string; value: string } }) => {
        const { name, value } = e.target;

        if (name === "confirmPassword") {
            setConfirmPassword(value);
        } else if (name === "VaiTro") {
            const selectedType = accountTypes.find((type) => type.VaiTro === value);
            setAccount((prevAccount) => ({
                ...prevAccount,
                VaiTro: value,
                Id_LoaiTaiKhoan: selectedType || { _id: "", TenLoaiTaiKhoan: "", VaiTro: "" },
                Id_PhongThietBi: value !== "BacSiXetNghiem" ? "" : prevAccount.Id_PhongThietBi,
            }));
        } else {
            setAccount((prevAccount) => ({
                ...prevAccount,
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
        setAccount((prev) => ({
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
            setAccount((prev) => ({
                ...prev,
                Image: base64,
            }));
            setSelectedFile(latest.originFileObj);
        } else {
            setSelectedFile(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setErrors({});

        const newErrors: Errors = {};

        if (!account.TenTaiKhoan) {
            newErrors.TenTaiKhoan = "Họ và tên là bắt buộc.";
        }
        if (!account.SoCCCD) {
            newErrors.SoCCCD = "Số CCCD là bắt buộc.";
        } else if (!/^\d{12}$/.test(account.SoCCCD)) {
            newErrors.SoCCCD = "Số CCCD phải có đúng 12 chữ số.";
        }
        if (!account.SoDienThoai) {
            newErrors.SoDienThoai = "Số điện thoại là bắt buộc.";
        } else if (!/^\d{10}$/.test(account.SoDienThoai)) {
            newErrors.SoDienThoai = "Số điện thoại phải có đúng 10 chữ số.";
        }
        if (!account.VaiTro) {
            newErrors.VaiTro = "Chọn vai trò là bắt buộc.";
        }
        if (account.VaiTro === "BacSiXetNghiem" && !account.Id_PhongThietBi) {
            newErrors.Id_PhongThietBi = "Chọn phòng thiết bị là bắt buộc.";
        }
        if (account.MatKhau) {
            if (account.MatKhau.length < 6) {
                newErrors.MatKhau = "Mật khẩu phải có ít nhất 6 ký tự.";
            }
            if (account.MatKhau !== confirmPassword) {
                newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setMessage("Vui lòng kiểm tra các trường thông tin.");
            return;
        }

        if (!accountId) {
            setMessage("Không tìm thấy ID tài khoản.");
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("TenTaiKhoan", account.TenTaiKhoan);
            formData.append("SoDienThoai", account.SoDienThoai);
            formData.append("SoCCCD", account.SoCCCD);
            formData.append("GioiTinh", account.GioiTinh);
            formData.append("Id_LoaiTaiKhoan", account.Id_LoaiTaiKhoan._id);
            formData.append("TrangThaiHoatDong", String(account.TrangThaiHoatDong));
            if (account.MatKhau) formData.append("MatKhau", account.MatKhau);
            if (selectedFile) {
                formData.append("Image", selectedFile);
            }
            if (account.Id_PhongThietBi) {
                formData.append("Id_PhongThietBi", account.Id_PhongThietBi);
            }

            const success = await updateAccount(accountId, formData);
            if (success) {
                setMessage("Cập nhật thông tin tài khoản thành công!");
                const updatedAccount = await getAccountDetails(accountId);
                if (updatedAccount) {
                    setAccount(updatedAccount);
                }
            } else {
                setMessage("Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            setMessage("Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    const getAccountStatusText = (trangThai: boolean | undefined | null) => {
        if (trangThai === undefined || trangThai === null) {
            return "Không hoạt động";
        }
        return trangThai ? "Hoạt động" : "Khóa tài khoản";
    };

    const handleCancel = () => {
        router.push('/Admin/HumanResources/Staff');
    };

    return (
        <div className="AdminContent-Container">
            <h2 className="StaffEdit-Title">Thông tin tài khoản</h2>

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
                                <label htmlFor="TenTaiKhoan" className="StaffEdit-Label">
                                    Họ và tên <span className="StaffEdit-RedStar">*</span>:
                                </label>
                                <div className="StaffEdit-InputContainer">
                                    <TextField
                                        fullWidth
                                        id="TenTaiKhoan"
                                        name="TenTaiKhoan"
                                        value={account.TenTaiKhoan}
                                        onChange={handleChange}
                                        placeholder="Nhập họ và tên"
                                        className={`StaffEdit-Input ${errors.TenTaiKhoan ? "StaffEdit-InputError" : ""}`}
                                        error={!!errors.TenTaiKhoan}
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
                                        value={account.SoCCCD}
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
                                        value={account.SoDienThoai}
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
                                        value={account.GioiTinh}
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
                                <label htmlFor="MatKhau" className="StaffEdit-Label">
                                    Mật khẩu:
                                </label>
                                <div className="StaffEdit-InputContainer">
                                    <TextField
                                        fullWidth
                                        id="MatKhau"
                                        name="MatKhau"
                                        value={account.MatKhau}
                                        onChange={handleChange}
                                        placeholder="Nhập mật khẩu"
                                        className={`StaffEdit-Input ${errors.MatKhau ? "StaffEdit-InputError" : ""}`}
                                        error={!!errors.MatKhau}
                                        helperText={errors.MatKhau}
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
                                checked={account.TrangThaiHoatDong}
                                onChange={(e) =>
                                    setAccount((prev) => ({
                                        ...prev,
                                        TrangThaiHoatDong: e.target.checked,
                                    }))
                                }
                            />
                            <Typography variant="body2" color="text.secondary">
                                {getAccountStatusText(account.TrangThaiHoatDong)}
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
                                value={account.VaiTro}
                                onChange={handleChange}
                                label="Chọn vai trò"
                                error={!!errors.VaiTro}
                            >
                                <MenuItem value="">Chọn vai trò</MenuItem>
                                {accountTypes.map((type) => (
                                    <MenuItem key={type._id} value={type.VaiTro}>
                                        {type.TenLoaiTaiKhoan}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.VaiTro && <p className="StaffEdit-ErrorText">{errors.VaiTro}</p>}
                        </FormControl>
                    </div>

                    {account.VaiTro === "BacSiXetNghiem" && (
                        <div className="StaffEdit-FormGridChild StaffEdit-SelectStatus">
                            <FormControl
                                fullWidth
                                size="small"
                                className={`StaffEdit-Select ${errors.Id_PhongThietBi ? "StaffEdit-SelectError" : ""}`}
                            >
                                <InputLabel id="Id_PhongThietBi-label">
                                    Chọn phòng thiết bị <span className="StaffEdit-RedStar">*</span>
                                </InputLabel>
                                <Select
                                    labelId="Id_PhongThietBi-label"
                                    id="Id_PhongThietBi"
                                    name="Id_PhongThietBi"
                                    value={account.Id_PhongThietBi || ""}
                                    onChange={handleChange}
                                    label="Chọn phòng thiết bị *"
                                    error={!!errors.Id_PhongThietBi}
                                >
                                    <MenuItem value="">Chọn phòng thiết bị</MenuItem>
                                    {testLabs.map((lab) => (
                                        <MenuItem key={lab._id} value={lab._id}>
                                            {lab.TenPhongThietBi}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.Id_PhongThietBi && (
                                    <p className="StaffEdit-ErrorText">{errors.Id_PhongThietBi}</p>
                                )}
                            </FormControl>
                        </div>
                    )}
                </div>

                <div className="StaffEdit-ButtonContainer">
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
                                Đang cập nhật...
                            </>
                        ) : (
                            <>
                                <FaSave style={{ marginRight: "6px", verticalAlign: "middle" }} />
                                Cập nhật
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default App;