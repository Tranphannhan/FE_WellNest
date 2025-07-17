// Trong React hoặc Next.js client
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const payment = async (amount:number, name:string, url:string, Id:string,   Type: "DonThuoc" | "XetNghiem" | "PhiKham" = "DonThuoc") => {
  const response = await fetch(`${API_BASE_URL}/PaymentMoMo/create-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: amount,
      orderInfo: name,
      url,
      Id,
      Type
    }),
  });

  const result = await response.json();
  if (result.payUrl) {
    window.location.href = result.payUrl;
  }
};

export default payment

