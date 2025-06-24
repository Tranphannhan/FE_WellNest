import { Box, Typography, Stack } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';

interface NoDataProps {
  message?: string;
  remind?: string;
}

export default function DoNotContinue({
  message = 'Không được phép tiếp tục',
  remind = 'Vui lòng hoàn tất các bước trước đó hoặc liên hệ quản trị viên.',
}: NoDataProps) {
  return (
    <Box
      sx={{
        py: 6,
        px: 2,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Stack spacing={1} alignItems="center" textAlign="center">
        <BlockIcon sx={{ fontSize: 56, color: 'error.main' }} />
        <Typography variant="h6" fontWeight={600} color="error.main">
          {message}
        </Typography>
        <Typography variant="body2" color="error.light" sx={{ maxWidth: 400 }}>
          {remind}
        </Typography>
      </Stack>
    </Box>
  );
}
