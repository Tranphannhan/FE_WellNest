'use client';
import './Tabbar.css';
import { tabbarContentType } from '@/app/types/componentTypes/TabbarTypes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Tabbar({ tabbarItems }: { tabbarItems: tabbarContentType }) {
    const pathname = usePathname();

    return (
        <div className="Tabbar__container">
            <div className="Tabbar__navigation">
               {tabbarItems.tabbarItems.map((value, index) => {
                    const linkPath = value.link.split('?')[0];
                    const isActive = pathname === linkPath; // ✅ so sánh tuyệt đối
                    return (
                        <Link key={index} href={value.link} prefetch={false}>
                            <div className={`Tabbar__item ${isActive ? 'Tabbar__active' : ''}`}>
                                {value.text}
                            </div>
                        </Link>
                    );
                })}

            </div>
        </div>
    );
}
