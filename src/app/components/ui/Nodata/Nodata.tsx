import { Box, Typography, Stack } from '@mui/material';
import { FileSearch } from 'lucide-react'; // Giữ lại icon bạn muốn

interface NoDataProps {
  message?: string;
  remind?: string;
}

export default function NoData({
  message = 'Không có dữ liệu để hiển thị',
  remind = 'Không có thông tin để hiển thị',
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
        <FileSearch size={48} style={{ color: '#9ca3af' }} /> {/* gray-400 */}
        <Typography variant="h6" fontWeight={500} color="text.primary">
          {message}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {remind}
        </Typography>
      </Stack>
    </Box>
  );
}
