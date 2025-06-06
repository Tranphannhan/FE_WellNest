'use client';
import {useState } from 'react';
import './Tabbar.css';
import { tabbarContentType } from '@/app/types/componentTypes/TabbarTypes';
import Link from 'next/link';

export default function Tabbar({tabbarItems}:{tabbarItems:tabbarContentType}) {
    const [activeTab, setActiveTab] = useState<number>(0);
    return (
        <div className="Tabbar__container">
            <div className="Tabbar__navigation">
                {tabbarItems.tabbarItems.map((value, index)=>
                <Link key={index} href={value.link}>
                <div
                    className={`Tabbar__item ${index === activeTab ? 'Tabbar__active' : ''}`}
                    onClick={() => setActiveTab(index)}
                >
                    {value.text}
                </div></Link>
                
                )}

            </div>
        </div>
    );
}