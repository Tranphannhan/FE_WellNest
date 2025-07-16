
import { jwtDecode } from "jwt-decode";
import { NextRequest, NextResponse } from "next/server";

// Bản đồ định tuyến: route -> VaiTrò yêu cầu
const roleRouteMap: Record<string, string> = {
  "/Doctor": "BacSi",
  "/Receptionist": "TiepNhan",
  "/Cashier": "ThuNgan",
  "/Pharmacist": "DuocSi",
  "/LaboratoryDoctor": "BacSiXetNghiem",
  "/Admin": "Admin",
};


export function middleware(request: NextRequest) {
  console.log('middelwere')
  const { pathname } = request.nextUrl;
  const matchedRoute = Object.keys(roleRouteMap).find((route) =>
    pathname.startsWith(route)
  );

  if (matchedRoute) {
    const token = request.cookies.get("token")?.value;
    console.log("🧪 Token:", token);

    if (!token) {
      console.log("⛔ Không có token → chuyển hướng về /");
      return NextResponse.redirect(new URL("/", request.url));
    }

    try {
      const decoded: {
          _VaiTro: string;
          _Id_LoaiTaiKhoan: {
            VaiTro: string;
          };
        } = jwtDecode(token);
      console.log("✅ Token decode:", decoded);

      const requiredRole = roleRouteMap[matchedRoute];
      if (
        decoded._VaiTro !== requiredRole &&
        decoded._Id_LoaiTaiKhoan?.VaiTro !== requiredRole
      ) {
        console.log("❌ Sai vai trò → redirect");
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch{
      console.log("❌ Token decode lỗi → redirect");
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    "/Doctor/:path*",
    "/Receptionist/:path*",
    "/Cashier/:path*",
    "/Pharmacist/:path*",
    "/LaboratoryDoctor/:path*",
    "/Admin/:path*",
  ],
};
