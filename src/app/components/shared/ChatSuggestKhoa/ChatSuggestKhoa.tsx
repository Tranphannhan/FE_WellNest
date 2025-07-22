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
import PersonIcon from "@mui/icons-material/Person";
import { useState } from "react";
import { fetchSuggestedKhoa } from "@/app/services/ReceptionServices";
import { SiRobotframework } from "react-icons/si";
import {IoMdSend } from "react-icons/io";

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

export default function ChatSuggestKhoa() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Xin chào, tôi là AI của hệ thống WELLNEST.\nVui lòng nhập các triệu chứng để tôi có thể giúp bạn tìm ra khoa phù hợp nhất.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

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

      const botText = `Dựa trên các triệu chứng bạn cung cấp, chúng tôi đề xuất:\n\n - Khoa ưu tiên: ${res.khoaUuTien?.TenKhoa || "Không xác định"}\n - Khoa liên quan: ${
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
          text: "Hiện tại, bệnh viện chúng tôi chưa có khoa phù hợp với triệu chứng này.",
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
            <Typography variant="subtitle1" fontWeight="bold"></Typography>
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
                  <Avatar sx={{ bgcolor: "#3497f9", mr: 1 }}>
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
                  <Avatar sx={{ bgcolor: "#aaaaaaff", ml: 1 }}>
                    <PersonIcon fontSize="small" />
                  </Avatar>
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
