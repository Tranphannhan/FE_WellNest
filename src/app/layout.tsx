import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'bootstrap-icons/font/bootstrap-icons.css';



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
    manifest: '/manifest.json',
    icons: {
      icon: [
        { url: '/favicon2.png', type: 'image/png' },
        { url: '/favicon2.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon2.png', sizes: '16x16', type: 'image/png' },
      ],
      shortcut: '/favicon2.png',
      apple: '/favicon2.png',
    },
  };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon2.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon2.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon2.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
    
        {children}
      </body>
    </html>
  );
}