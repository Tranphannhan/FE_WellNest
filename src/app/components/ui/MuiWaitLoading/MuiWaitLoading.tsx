'use client';

import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

interface MuiWaitLoadingProps {
  show: boolean;
}

export default function MuiWaitLoading({ show }: MuiWaitLoadingProps) {
  return (
    <Backdrop
      sx={(theme) => ({
        color: '#fff',
        zIndex: theme.zIndex.drawer + 9999,
      })}
      open={show}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
    