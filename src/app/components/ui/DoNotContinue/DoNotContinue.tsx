import { FC } from 'react';
import { Ban  } from "lucide-react"; // Biểu tượng cảnh báo

interface NoDataProps {
  message?: string;
  remind?: string;
}

const DoNotContinue: FC<NoDataProps> = ({
  message = 'Không được phép tiếp tục',
  remind = 'Vui lòng hoàn tất các bước trước đó hoặc liên hệ quản trị viên.',
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 rounded-lg text-red-600">
      <Ban  className="w-12 h-12 mb-4 text-red-500" />
      <p className="text-lg font-semibold">{message}</p>
      <p className="text-sm text-red-400 mt-1">{remind}</p>
    </div>
  );
};

export default DoNotContinue;
