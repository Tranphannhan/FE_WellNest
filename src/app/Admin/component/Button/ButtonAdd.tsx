"use client";

import { useRouter } from "next/navigation";
import React from "react";
import AddIcon from "@mui/icons-material/Add";

interface ButtonAddProps {
  name: string;
  link: string;
  icon?: React.ReactNode; // nếu không truyền sẽ dùng icon mặc định
}

export default function ButtonAdd({ name, link, icon }: ButtonAddProps) {
  const router = useRouter();

  return (
    <button
      className="bigButton--add flex items-center gap-2"
      onClick={() => router.push(link)}
    >
      <span>{icon ?? <AddIcon />}</span>
      <span>{name}</span>
    </button>
  );
}

