import { DoctorType } from "../doctorTypes/doctorTypes";
import { Testtype } from "../hospitalTypes/hospitalType";

// dữ liểu frontEnd
export interface codeScanningInformationType{
    CCCDNumber?:string,
    name?:string,
    dateOfBirth?:string,
    sex?:string,
    address?:string,
    creationDate?:string
}

// dữ liểu frontEnd
export interface medicalCardData {
    name: string;
    sex: string;
    dateOfBirth: string;
    phone: string;
    CCCDNumber: string;
    address: string;
    BHYT?: string;
    relativePhone?: string;
    medicalHistory?: string;
}


// thẻ khám bệnh
export interface medicalExaminationBook {
  _id?: string;
  HoVaTen?: string;
  GioiTinh?: string;
  NgaySinh?: string;
  SoDienThoai?: string;
  SoBaoHiemYTe?: string;
  DiaChi?: string;
  SoCCCD?: string;
  SDT_NguoiThan?: string;
  LichSuBenh?: string;
  __v?: number;
}

// phiếu khám bệnh 
export interface MedicalExaminationCard {
  _id ? : string;
  Id_TheKhamBenh ? : medicalExaminationBook;
  Id_Bacsi ? : DoctorType;
  Id_NguoiTiepNhan ? : string;
  Id_GiaDichVu ?: string;
  LyDoDenKham ? : string;
  Ngay ? : string;
  Gio ? : string;
  TrangThaiThanhToan ? : boolean;
  STTKham ? : number;
  TrangThai ? : boolean;
  TrangThaiHoatDong ? : string;
  GioKetThucKham ? :string;
  __v: number;
  SoLanKhongCoMat:number;

  // là dữ liệu phát sinh trên FE
  results?:string;
}

// chỉ số sinh tồn 
export interface survivalIndexType{
    _id? : string;
    Id_PhieuKhamBenh?: string;
    NhietDo?: string;
    Mach?: string;
    HuyetAp?: string;
    NhipTho?: string;
    ChieuCao?: string;
    BMI?: string;
    SP02?: string;
    CanNang?: string;
}



// chuẩn đoán chi tiết lâm sang
export interface diagnosisType {
  Id_KhamLamSang?  : string,
  TrieuChung? : string,
  ChuanDoanSoBo? : string
}

//Hiện Phòng Khám Lâm Sàng
export interface laboratoryType {
    _id: string;
    TenPhongThietBi: string;
    TenXetNghiem: string;
    Image: string;
    __v: number;
}

//Giá dịch vụ
export interface servicePriceType{
        _id?: string;
        Giadichvu?: number;
        Tendichvu?:string;
        Loaigia?:string;
        TrangThaiHoatDong?:boolean;
}


//Hiện loại khám lâm sàng the
export interface clinicalType {
    _id?: string;
    Id_PhongThietBi?: string;
    Id_GiaDichVu?: servicePriceType;
    TenXetNghiem?: string;
    MoTaXetNghiem?: string;
    Image?: string;
    TrangThaiHoatDong?: boolean;
    __v: number;
}


// kiểu dữ liệu tạo kết quả khám
export interface generateTestResultsType {
  _id? : string;
  Id_PhieuKhamBenh? : string,
  GhiChu? : string,
  HuongSuLy? : string,
  KetQua? : string ,
  TrangThaiHoanThanh ? : boolean
}



// đơn thuốc
export interface prescriptionType {
  _id: string;
  Id_PhieuKhamBenh: MedicalExaminationCard;
  TenDonThuoc: string;
  TrangThaiThanhToan: boolean;
  Gio: string;
  TrangThai: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}


// cận lâm sàng 
export interface paraclinicalType {
    _id: string;
    Id_PhieuKhamBenh: MedicalExaminationCard;
    Id_LoaiXetNghiem: Testtype;
    Gio: string;
    TrangThaiThanhToan: boolean;
    Ngay: string;
    STT: string;
    TrangThai: boolean;
    TrangThaiHoatDong: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}