"use client";

import {
  Box,
  Fab,
  Drawer,
  IconButton,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Stack,
  Avatar,
  Paper,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import { fetchSuggestedKhoa } from "@/app/services/ReceptionServices";
import { SiRobotframework } from "react-icons/si";
<<<<<<< HEAD
import {IoMdSend } from "react-icons/io";
=======
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
>>>>>>> 1a9c313bba55026dad9f458bf51201014ff81340

// Kiểu khoa
type Khoa = {
  MaKhoa: string;
  TenKhoa: string;
};

// Kiểu phản hồi từ API
type SuggestedKhoaResponse = {
  khoaUuTien?: Khoa;
  khoaLienQuan?: Khoa[];
};

// Message
type Message = {
  sender: "user" | "bot";
  text: string;
};

// Token
type UserToken = {
  _Image?: string;
  _TenTaiKhoan?: string;
  _TenBacSi?: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ChatSuggestKhoa() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
<<<<<<< HEAD
      text: "Xin chào, tôi là AI của hệ thống WELLNEST.\nVui lòng nhập các triệu chứng để tôi có thể giúp bạn tìm ra khoa phù hợp nhất.",
=======
      text:
        "Xin chào, tôi là AI của hệ thống WELLNEST.\n" +
        "Vui lòng nhập các triệu chứng để tôi có thể giúp bạn tìm ra khoa phù hợp nhất.",
>>>>>>> 1a9c313bba55026dad9f458bf51201014ff81340
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
<<<<<<< HEAD
=======
  const [user, setUser] = useState<UserToken | null>(null);

  // Lấy user từ token
  useEffect(() => {
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

  const avatarUrl = user?._Image
    ? `${API_BASE_URL}/image/${user._Image}`
    : "/default-avatar.png";
>>>>>>> 1a9c313bba55026dad9f458bf51201014ff81340

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setInput("");

    try {
      const symptoms = input.split(",").map((s) => s.trim());
      const res: SuggestedKhoaResponse = await fetchSuggestedKhoa(symptoms);

      const botText = `Dựa trên các triệu chứng bạn cung cấp, chúng tôi đề xuất:\n\n - Khoa ưu tiên: ${
        res.khoaUuTien?.TenKhoa || "Không xác định"
      }\n - Khoa liên quan: ${
        res.khoaLienQuan?.map((k) => k.TenKhoa).join(", ") || "Không có"
      }`;

      const botMessage: Message = {
        sender: "bot",
        text: botText,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
<<<<<<< HEAD
          text: "Hiện tại, bệnh viện chúng tôi chưa có khoa phù hợp với triệu chứng này.",
=======
          text:
            "Hiện tại, bệnh viện chúng tôi chưa có khoa phù hợp với triệu chứng này.",
>>>>>>> 1a9c313bba55026dad9f458bf51201014ff81340
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Icon */}
      <Fab
        color="primary"
        aria-label="chat"
        sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 1000 }}
        onClick={() => setOpen(true)}
      >
        <ChatIcon />
      </Fab>

      {/* Chat Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: 450,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Header */}
        <Box
          p={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          borderBottom={"1px solid #d6d6d6"}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <img
              src="/images/logoWebsite.png"
              alt="WELLNEST AI"
              width={150}
              height={150}
            />
<<<<<<< HEAD
            <Typography variant="subtitle1" fontWeight="bold"></Typography>
=======
>>>>>>> 1a9c313bba55026dad9f458bf51201014ff81340
          </Box>
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Messages */}
        <Box flex={1} overflow="auto" p={2}>
          <Stack spacing={2}>
            {messages.map((msg, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={
                  msg.sender === "user" ? "flex-end" : "flex-start"
                }
                alignItems="flex-end"
              >
                {msg.sender === "bot" && (
<<<<<<< HEAD
                  <Avatar sx={{ bgcolor: "#3497f9", mr: 1 }}>
=======
                  <Avatar sx={{ bgcolor: "primary.main", mr: 1 }}>
>>>>>>> 1a9c313bba55026dad9f458bf51201014ff81340
                    <SiRobotframework fontSize="20px" />
                  </Avatar>
                )}

                <Paper
                  elevation={3}
                  sx={{
                    boxShadow:
                      "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;",
                    px: 2,
                    py: 1,
                    bgcolor: msg.sender === "user" ? "#3497f9" : "#f1f1f1f1",
                    maxWidth: "75%",
                    borderRadius: 2,
                    color: msg.sender === "user" ? "#ffffffff" : "#000000ff",
                  }}
                >
                  <Typography fontSize={14} whiteSpace="pre-wrap">
                    {msg.text}
                  </Typography>
                </Paper>

                {msg.sender === "user" && (
<<<<<<< HEAD
                  <Avatar sx={{ bgcolor: "#aaaaaaff", ml: 1 }}>
                    <PersonIcon fontSize="small" />
                  </Avatar>
=======
                  <Avatar
                    src={avatarUrl}
                    sx={{ width: 32, height: 32, ml: 1 }}
                  />
>>>>>>> 1a9c313bba55026dad9f458bf51201014ff81340
                )}
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Input Area */}
        <Box p={2} borderTop={"1px solid #d6d6d6"} display="flex" gap={1}>
          <TextField
            variant="outlined"
            size="small"
            fullWidth
            placeholder="Nhập triệu chứng..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button
            onClick={handleSend}
            variant="contained"
            disabled={loading}
            sx={{ minWidth: "64px" }}
            style={{}}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <>
                <IoMdSend style={{
                  fontSize:26,
                  marginLeft:4
                }}/>
              </>
            )}
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
