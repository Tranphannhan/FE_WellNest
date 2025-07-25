'use client';

import * as React from 'react';
import { Suspense } from 'react'; // Thêm import Suspense
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { DemoProvider } from '@toolpad/core/internal';
import { createTheme } from '@mui/material/styles';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Box from '@mui/material/Box';

import AccountMenu from './component/AccountMenu';
import NAVIGATION from './component/NavAdmin/NavAdmin';
import './component/NavAdmin/NavAdmin.css';
import { ToastContainer } from 'react-toastify';



const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

// Tạo component nội bộ để sử dụng các hook client-side
function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const isClient = typeof window !== 'undefined';
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const customRouter = {
    pathname: pathname || (isClient ? window.location.pathname : '/'),
    searchParams: searchParams || (isClient ? new URLSearchParams(window.location.search) : new URLSearchParams()),
    navigate: (url: string | URL) => {
      const newUrl = typeof url === 'string' ? url : url.toString();
      router.push(newUrl);
    },
  };

  console.log('Router pathname:', customRouter.pathname);
  console.log('Window location:', isClient ? window.location.pathname : 'N/A');

  return (
    <DemoProvider window={isClient ? window : undefined}>
      <link rel="icon" href="/images/TitleLogo.png" />
      <ToastContainer />
      <AppProvider
        navigation={NAVIGATION}
        router={customRouter}
        theme={demoTheme}
        window={isClient ? window : undefined}
        branding={{
          logo: (
            <Image
              src="/images/Logo.png"
              alt="WellNest"
              width={120}
              height={40}
            />
          ),
          title: '',
        }} 
      >
        <DashboardLayout>
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 30,
              zIndex: 1300,
            }}
          >
            <AccountMenu />
          </Box>
          <main className='Admin-containerLayout'>
            {children}
          </main>
        </DashboardLayout>
      </AppProvider>
    </DemoProvider>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </Suspense>
  );
}