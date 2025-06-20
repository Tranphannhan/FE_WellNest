import moment from "moment";

// Định dạng năm từ 14052005 thành 2005-24-05
export function convertDateFormat(dateStr: string): string {
  const day = dateStr.substring(0, 2);
  const month = dateStr.substring(2, 4);
  const year = dateStr.substring(4, 8);

  return `${year}-${month}-${day}`;
}


// Định dạng tiền theo vnđ
export function formatCurrencyVND(value: number): string {
    return value.toLocaleString('vi-VN') + ' VND';
}

// tính tuổi
export function calculateAge(ngaySinhChuoi: string): number | null {
  if (!ngaySinhChuoi) return null;

  const ngaySinh = new Date(ngaySinhChuoi);
  if (isNaN(ngaySinh.getTime())) return null; // không hợp lệ

  const ngayHienTai = new Date();
  let tuoi = ngayHienTai.getFullYear() - ngaySinh.getFullYear();

  // Trừ bớt 1 tuổi nếu chưa tới sinh nhật trong năm nay
  const chuaDenSinhNhat =
    ngayHienTai.getMonth() < ngaySinh.getMonth() ||
    (ngayHienTai.getMonth() === ngaySinh.getMonth() &&
      ngayHienTai.getDate() < ngaySinh.getDate());

  if (chuaDenSinhNhat) tuoi--;

  return tuoi;
}

//định dạng thời gian 01-50-29s AM/PM
export function formatTime(time:string){
  return (moment(time, "HH:mm:ss").format("hh:mm:ss A"))
}