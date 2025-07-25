// Trong React hoặc Next.js client
import API_BASE_URL from "@/app/config";
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

