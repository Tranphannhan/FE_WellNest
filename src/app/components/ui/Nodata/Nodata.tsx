import { FC } from 'react';
import { FileSearch } from "lucide-react"; // hoặc LucideIcon bạn muốn
interface NoDataProps {
  message?: string;
  remind?:string;
}

const NoData: FC<NoDataProps> = ({ message = 'Không có dữ liệu để hiển thị' ,remind = 'Không có thông tin để hiển thị'}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 rounded-lg text-gray-600">
      <FileSearch className="w-12 h-12 mb-4 text-gray-400" />
      <p className="text-lg font-medium">{message}</p>
      <p className="text-sm text-gray-500 mt-1">{remind}</p>
    </div>
  );
};

export default NoData;
