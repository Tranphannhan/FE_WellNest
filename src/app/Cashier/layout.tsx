import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Navbar from "@/app/components/shared/Navbar/Navbar";
import '../globals.css'
import Header from "@/app/components/shared/Header/Header";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Well Nest",
  description: "Hệ thống quản lý quy trình khám bệnh",
    icons: {
    icon: 'images/TitleLogo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="containerClient">
           <ToastContainer />

            <Navbar
                conTentNavigation = {
                  {
                    logo:'/images/logoWebsite.png',
                    navItems:[
                      {icon:`bi bi-file-earmark-text-fill`,text:"Thống kê doanh thu", link:'/Cashier/Dashboard'},
                      {icon:`bi bi-clipboard2-pulse-fill`,text:"Chờ thanh toán", link:'/Cashier/PaymentWaitingList'}
                    ]
                  }
                }
              >
            </Navbar>
            


              <div className="containerClient__content">
                 <Header
                    conTentHeader = {
                        {
                          title : 'Thu ngân',
                        }
                      }
                  >
                </Header>




              <div className="containerClient__item">
                    {children}
              </div>
      

               
              </div>


        </div>

      </body>
    </html>
  );
}
