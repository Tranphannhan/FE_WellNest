'use client';
import { tabbarContentType } from '@/app/types/componentTypes/TabbarTypes';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

export default function Tabbar({ tabbarItems }: { tabbarItems: tabbarContentType }) {
  const pathname = usePathname();

  const currentValue =
    tabbarItems.tabbarItems.find((item) => pathname === item.link.split('?')[0])?.link ||
    tabbarItems.tabbarItems[0].link;

  return (
    <Box
      sx={{
        pt: '11px',
        pb: 0,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '0.5px',
          backgroundColor: '#CFCFCF',
        },
      }}
    >
      <Tabs
        value={currentValue}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="Tab navigation"
        TabIndicatorProps={{
          sx: {
            height: '2px',
            backgroundColor: '#3497f9',
            borderRadius: 1,
          },
        }}
        sx={{
          px: '20px',
          display: 'flex',
          gap: '30px',
          minHeight: '40px',

          '& .MuiTabs-flexContainer': {
            gap: '30px',
          },

          '& .MuiTab-root': {
            textTransform: 'none',
            fontSize: '16px',
            color: '#CFCFCF',
            cursor: 'pointer',
            paddingBottom: '8px',
            minHeight: '40px',
            whiteSpace: 'nowrap',
            position: 'relative',

            '&.Mui-selected': {
              color: '#333',
              fontWeight: 500,
            },
          },
        }}
      >
        {tabbarItems.tabbarItems.map((item, index) => {
          return (
            <Tab
              key={index}
              label={item.text}
              value={item.link}
              component={Link}
              href={item.link}
              prefetch={false}
            />
          );
        })}
      </Tabs>
    </Box>
  );
}
