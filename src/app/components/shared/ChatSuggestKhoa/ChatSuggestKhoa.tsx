"use client";

import {
  Box,
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
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import { fetchSuggestedKhoa } from "@/app/services/ReceptionServices";
import { RiRobot2Fill } from "react-icons/ri";
import { IoMdSend } from "react-icons/io";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import AIChatButton from "./AvataAI";

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

// Component gõ ba chấm
const TypingDots = () => {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      <span className="dot" style={{ animationDelay: "0s" }}>
        •
      </span>
      <span className="dot" style={{ animationDelay: "0.2s" }}>
        •
      </span>
      <span className="dot" style={{ animationDelay: "0.4s" }}>
        •
      </span>
      <style jsx>{`
        .dot {
          animation: bounce 0.6s infinite ease-in-out;
          font-size: 18px;
        }
        @keyframes bounce {
          0%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-4px);
          }
        }
      `}</style>
    </span>
  );
};

export default function ChatSuggestKhoa() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text:
        "Xin chào, tôi là AI của hệ thống WELLNEST.\n" +
        "Vui lòng nhập các triệu chứng để tôi có thể gợi ý bạn tìm ra khoa phù hợp.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<UserToken | null>(null);

  // Hàm đọc văn bản bằng giọng nói
  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "vi-VN"; // giọng đọc tiếng Việt
      utterance.rate = 1; // tốc độ đọc
      utterance.pitch = 1; // độ cao giọng
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Trình duyệt không hỗ trợ speechSynthesis");
    }
  };

useEffect(() => {
  if (open && messages.length === 1 && messages[0].sender === "bot") {
    speakText(messages[0].text);
  }
}, [open]);

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

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setInput("");

    // Hiện tin nhắn ba chấm
    setMessages((prev) => [...prev, { sender: "bot", text: "__typing__" }]);

    try {
      const symptoms = input.split(",").map((s) => s.trim());
      const res: SuggestedKhoaResponse = await fetchSuggestedKhoa(symptoms);

     let botText = "";

    if (res.khoaUuTien?.TenKhoa === "Khoa Tổng Hợp") {
      botText =
        "Các triệu chứng bạn mô tả hiện chưa đặc hiệu cho một chuyên khoa cụ thể. " +
        "Bạn nên đến Khoa Tổng Hợp để được bác sĩ thăm khám, chẩn đoán ban đầu và tư vấn thêm.";
    } else {
      botText = `Dựa trên các triệu chứng bạn cung cấp, chúng tôi đề xuất:\n\n - Khoa ưu tiên: ${
        res.khoaUuTien?.TenKhoa || "Không xác định"
      }\n - Khoa liên quan: ${
        res.khoaLienQuan?.map((k) => k.TenKhoa).join(", ") || "Không có"
      }`;
    }

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { sender: "bot", text: botText };
        return updated;
      });

      // 👇 Thêm dòng này để đọc giọng
      speakText(botText);
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          sender: "bot",
          text: "Các triệu chứng bạn mô tả hiện chưa đặc hiệu cho một chuyên khoa cụ thể. Bạn nên đến Khoa Tổng Hợp để được bác sĩ thăm khám, chẩn đoán ban đầu và tư vấn thêm.",
        };
        return updated;
      });

      // 👇 Đọc giọng cho thông báo lỗi
      speakText(
        "Các triệu chứng bạn mô tả hiện chưa đặc hiệu cho một chuyên khoa cụ thể. Bạn nên đến Khoa Tổng Hợp để được bác sĩ thăm khám, chẩn đoán ban đầu và tư vấn thêm."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Icon */}
      <AIChatButton  callBack={() => setOpen(true)}></AIChatButton>

      {/* Chat Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: "450px !important",
            height: "100%",
            display: "flex",
            maxWidth: "450px !important",
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
                    <RiRobot2Fill fontSize="20px"/>

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
                    {msg.text === "__typing__" ? <TypingDots /> : msg.text}
                  </Typography>
                </Paper>

                {msg.sender === "user" && (
                  <Avatar
                    src={avatarUrl}
                    sx={{ width: 32, height: 32, ml: 1 }}
                  />
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
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <IoMdSend style={{ fontSize: 26, marginLeft: 4 }} />
            )}
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
