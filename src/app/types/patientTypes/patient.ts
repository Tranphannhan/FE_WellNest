import { DoctorType } from "../doctorTypes/doctorTypes";

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
  _id: string;
  Id_TheKhamBenh: medicalExaminationBook;
  Id_Bacsi: DoctorType;
  Id_NguoiTiepNhan: string;
  Id_GiaDichVu: string;
  LyDoDenKham: string;
  Ngay: string;
  Gio: string;
  TrangThaiThanhToan: boolean;
  STTKham: string;
  TrangThai: boolean;
  TrangThaiHoatDong: string;
  __v: number;
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