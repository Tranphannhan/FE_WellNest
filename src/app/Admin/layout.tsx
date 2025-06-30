'use client';

import * as React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { DemoProvider, useDemoRouter } from '@toolpad/core/internal';
import { createTheme } from '@mui/material/styles';
import Image from 'next/image';
import Box from '@mui/material/Box';

import AccountMenu from './component/AccountMenu';
import NAVIGATION from './component/NavAdmin/NavAdmin';
import './component/NavAdmin/NavAdmin.css';

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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const isClient = typeof window !== 'undefined';
  const router = useDemoRouter();

  return (
    <DemoProvider window={isClient ? window : undefined}>
      <AppProvider
        navigation={NAVIGATION}
        router={router}
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
              top: 12,
              right: 24,
              zIndex: 1300,
            }}
          >
            <AccountMenu />
          </Box>
          {children}
        </DashboardLayout>
      </AppProvider>
    </DemoProvider>
  );
}
