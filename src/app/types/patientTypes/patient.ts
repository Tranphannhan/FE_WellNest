export interface codeScanningInformationType{
    CCCDNumber?:string,
    name?:string,
    dateOfBirth?:string,
    sex?:string,
    address?:string,
    creationDate?:string
}

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

export interface SoKhamBenhData {
  _id: string;
  HoVaTen: string;
  GioiTinh: string;
  NgaySinh: string;
  SoDienThoai: string;
  SoBaoHiemYTe: string;
  DiaChi: string;
  SoCCCD: string;
  SDT_NguoiThan: string;
  LichSuBenh: string;
  __v: number;
}

// sổ khám bệnh
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