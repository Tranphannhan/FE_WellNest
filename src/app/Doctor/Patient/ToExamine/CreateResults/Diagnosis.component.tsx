
"use client";
import { useState } from 'react';
import './Diagnosis.component.css';

interface DiagnosisProps {
    handlePage: (page: string) => void;
}

export default function Diagnosiscomponent({ handlePage }: DiagnosisProps) {
    const [activeTab, setActiveTab] = useState(0);
    const tabs = ["Chuẩn đoán sơ bộ", "Cận lâm sàng", "Chuẩn đoán kết quả", "Đơn thuốc"];
    const handleClick = (index: number) => {
        setActiveTab(index);
        handlePage(tabs[index]);
    };
 
    return (
        <div className="diagnosisComponent-navigationBar">
            {tabs.map((tab, index) => (
                <div
                    key={index}
                    className={`diagnosisComponent-navigationBar__childBox ${activeTab === index ? 'active' : ''}`}
                    onClick={() => handleClick(index)}
                >
                    {tab}
                </div>  
            ))}
        </div>
    );
}
