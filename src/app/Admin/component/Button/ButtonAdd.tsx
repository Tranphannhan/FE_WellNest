"use client";

import { useRouter } from "next/navigation";
import React from "react";
import AddIcon from "@mui/icons-material/Add";

interface ButtonAddProps {
  name: string;
  link: string;
  icon?: React.ReactNode; // nếu không truyền sẽ dùng icon mặc định
}

import { Button } from '@mui/material';

interface ButtonAddProps {
  name: string;
  link: string;
  icon?: React.ReactNode;
}

export default function ButtonAdd({ name, link, icon }: ButtonAddProps) {
  const router = useRouter();

  return (
    <Button
      variant="outlined" 
      startIcon={icon ?? <AddIcon />}
      onClick={() => router.push(link)}
      color="primary"
      sx={{
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: 1,
        paddingY: 0.5,
        paddingX: 2,
      }}
    >
      {name}
    </Button>
  );
}
