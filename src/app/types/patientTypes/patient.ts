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