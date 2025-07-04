  "use client";
  import { useState } from "react";
  import { Box, Typography, Paper, Avatar } from "@mui/material";
  import CheckCircleIcon from "@mui/icons-material/CheckCircle";

  const paymentMethods = [
    {
      id: "cash",
      label: "Tiền mặt",
      value: "Cash",
      icon: "/images/IconTienMat-removebg-preview.png",
    },
    {
      id: "momo",
      label: "MoMo",
      value: "transfer",
      icon: "/images/MomoIcon-removebg-preview.png",
    },
  ];

  export default function PaymentMethodSelector({
    callBack,
  }: {
    callBack: (value: string) => void;
  }) {
    const [selected, setSelected] = useState<string>("cash");

    return (
      <Box display="flex" width="100%" gap={2}>
        {paymentMethods.map((method) => {
          const isSelected = selected === method.id;
          return (
            <Box key={method.id} flex={1}>
              <Paper
                elevation={0}
                onClick={() => {
                  setSelected(method.id);
                  callBack(method.value);
                }}
                sx={{
                  p: 2,
                  minHeight: 140, // Cố định chiều cao để tránh bị nảy
                  cursor: "pointer",
                  borderRadius: 3,
                  border: "2px solid",
                  borderColor: isSelected ? "#1976d2" : "#ccc",
                  backgroundColor: isSelected ? "#e3f2fd" : "#fff",
                  transition: "all 0.2s ease",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  textAlign: "center",
                  "&:hover": {
                    borderColor: "#1976d2",
                    boxShadow: 3,
                  },
                }}
              >
                <Avatar
                  src={method.icon}
                  alt={method.label}
                  variant="rounded"
                  sx={{ width: 56, height: 56 }}
                />
                <Typography variant="body1" fontWeight={500}>
                  {method.label}
                </Typography>

                {isSelected && (
                  <CheckCircleIcon
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      color: "#1976d2",
                    }}
                  />
                )}
              </Paper>
            </Box>
          );
        })}
      </Box>
    );
  }
