export interface ExaminationForm {
        Id_PhieuKhamBenh:string;
        fullName: string;
        cccd: string;
        dob: string;
        phone: string;
        gender: string;
        height: string;
        weight: string;
        clinic: string;
        department: string;
        address: string;
        reason: string;
        price:number;
        QueueNumber:number;
}


export interface ServiceItem {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}
