import './Diagnosis.component.css';
import { Tabs, Tab } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BiotechIcon from '@mui/icons-material/Biotech';
import SummarizeIcon from '@mui/icons-material/Summarize';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';


interface DiagnosisProps {
  handlePage: (page: string) => void;
  page: string;
}

export default function Diagnosiscomponent({ handlePage, page }: DiagnosisProps) {
  const tabs = ["Chuẩn đoán sơ bộ", "Cận lâm sàng", "Chuẩn đoán kết quả", "Đơn thuốc"];
  const content = ["Chẩn đoán sơ bộ", "Cận lâm sàng", "Chẩn đoán kết quả", "Đơn thuốc"];

  const currentIndex = tabs.indexOf(page);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    handlePage(tabs[newValue]);
  };

  return (
    <div className="diagnosisComponent-navigationBar">
      <Tabs
        value={currentIndex}
        onChange={handleChange}
        aria-label="Diagnosis Tabs"
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          minHeight: 35,
          height: 35,
        }}
        TabIndicatorProps={{
          sx: {
            height: 2,
            backgroundColor:'#3497f9' // thanh trượt mỏng, vẫn giữ nguyên nếu không muốn thay đổi
          }
        }}
      >
        {tabs.map((tab, index) => (
          <Tab
            key={tab}
  icon={
    index === 0 ? <AssignmentIcon fontSize="small" /> :
    index === 1 ? <BiotechIcon fontSize="small" /> :
    index === 2 ? <SummarizeIcon	 fontSize="small" /> :
    <ReceiptLongIcon fontSize="small" />
  }
            iconPosition="start"
            label={content[index]}
            sx={{
              minHeight: 35,
              height: 35,
              px: 2,
              fontSize: '15px',
              textTransform: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: 0.5,
                  '&.Mui-selected': {
                color: '#3497f9',
                },

                // ✅ Màu khi hover
                '&:hover': {
                color: '#3497f9',
                },
            }}
            
          />
        ))}
      </Tabs>
    </div>
  );
}
