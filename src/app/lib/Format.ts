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
