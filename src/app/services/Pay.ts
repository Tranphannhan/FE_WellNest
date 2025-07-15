// Trong React hoặc Next.js client
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const payment = async (amount:number, name:string, url:string, Id_DonThuoc:string) => {
  const response = await fetch(`${API_BASE_URL}/PaymentMoMo/create-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: amount,
      orderInfo: name,
      url,
      Id_DonThuoc,
    }),
  });

  const result = await response.json();
  if (result.payUrl) {
    window.location.href = result.payUrl; // Chuyển sang trang thanh toán của Momo
  }
};

export default payment

