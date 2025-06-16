
import './Diagnosis.component.css';

interface DiagnosisProps {
    handlePage: (page: string) => void;
    page:string;
}

export default function Diagnosiscomponent({ handlePage , page}: DiagnosisProps) {
    const tabs = ["Chuẩn đoán sơ bộ", "Cận lâm sàng", "Chuẩn đoán kết quả", "Đơn thuốc"];
    const handleClick = (index: number) => {
        handlePage(tabs[index]);
    };
 
    return (
        <div className="diagnosisComponent-navigationBar">
            {tabs.map((tab, index) => (
                <div
                    key={index}
                    className={`diagnosisComponent-navigationBar__childBox ${page === tab ? 'active' : ''}`}
                    onClick={() => handleClick(index)}
                >
                    {tab}
                </div>  
            ))}
        </div>
    );
}
