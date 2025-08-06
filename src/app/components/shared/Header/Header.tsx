"use client";

import React from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Divider,
  ListItemIcon,
} from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface StaffToken {
  _TenTaiKhoan: string;
  _Image: string;
  _Id_LoaiTaiKhoan: {
    VaiTro: string;
    TenLoaiTaiKhoan: string;
  };
}

interface DoctorToken {
  _TenBacSi: string;
  _Image: string;
  _VaiTro: string;
}

type UserToken = Partial<StaffToken & DoctorToken>;

export default function Header({
  conTentHeader,
}: {
  conTentHeader: { title: string ,link: string};
}) {
  const [user, setUser] = React.useState<UserToken | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  React.useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded = jwtDecode<UserToken>(token);
        setUser(decoded);
      } catch (err) {
        console.error("Token không hợp lệ:", err);
      }
    }
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    window.location.href = "/";
  };

  const avatarUrl = user?._Image
    ? `${API_BASE_URL}/image/${user._Image}`
    : "/default-avatar.png";
  const displayName = user?._TenBacSi || user?._TenTaiKhoan || "Người dùng";
  const role =
    user?._VaiTro ||
    user?._Id_LoaiTaiKhoan?.TenLoaiTaiKhoan ||
    "Không xác định";

  return (
    <AppBar
      position="static"
      color="default"
      enableColorOnDark
      elevation={0}
      sx={{
        backgroundColor: "#f1f8ff", // ép màu nền rõ ràng
        height: 113,
        justifyContent: "center",
      }}
    >
      <Toolbar sx={{ px: 2, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ color: "#374858", fontSize: 20 }}>
          {conTentHeader.title}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              textAlign: "right",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                textAlign: "right",
              }}
            >
              <Typography
                sx={{ fontSize: 18, fontWeight: 500, color: "#2C3E50" }}
              >
                {displayName}
              </Typography>
              <Typography
                sx={{ fontSize: 15, fontWeight: 400, color: "#7F8C8D" }}
              >
                {role === "BacSi" ? "Bác sĩ" : role}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleMenuOpen} size="small">
            <Avatar src={avatarUrl} sx={{ width: 44, height: 44 }} />
          </IconButton>
        </Box>
      </Toolbar>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            overflow: "visible",
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>
          <Avatar src={avatarUrl} sx={{ width: 32, height: 32, mr: 1 }} />
          {displayName}
        </MenuItem>
        <Divider />
        <MenuItem onClick={()=>{router.push(`${conTentHeader.link}`)}}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          Thông tin tài khoản
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Đăng xuất
        </MenuItem>
      </Menu>
    </AppBar>
  );
}
