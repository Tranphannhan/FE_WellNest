"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Slide,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { TransitionProps } from "@mui/material/transitions";

// Props
interface ViewPhotoDetailsProps {
  imageSrc: string;
  onClose: () => void;
}

// Transition để mở ảnh mượt hơn
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ViewPhotoDetails({
  imageSrc,
  onClose,
}: ViewPhotoDetailsProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Dialog
      open
      onClose={onClose}
      TransitionComponent={Transition}
      fullScreen={fullScreen}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "rgba(0,0,0,0.95)",
          boxShadow: "none",
          borderRadius:'8px'
        },
      }}
    >
      <DialogContent
        sx={{
          p: 0,
          position: "relative",
          height: fullScreen ? "100vh" : "auto",
        }}
      >
        {/* Nút đóng */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            boxShadow: 3,
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.1)",
            },
            zIndex: 10,
          }}
        >
          <CloseIcon fontSize="large" />
        </IconButton>

        {/* Ảnh */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: fullScreen ? "100vh" : "80vh",
            backgroundColor: "#000",
            p: 2,
          }}
        >
          <img
            src={imageSrc}
            alt="Zoomed"
            style={{
              height: fullScreen ? "100vh" : "80vh",
              width: "auto",
              maxWidth: "100%",
              borderRadius: 4,
              objectFit: "contain",
              transition: "transform 0.3s ease",
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}
