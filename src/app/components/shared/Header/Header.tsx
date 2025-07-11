'use client'
import './Header.css';
import { conTenHeaderType } from '@/app/types/componentTypes/headerType';
import Image from 'next/image';
  
  
export default function Header ({conTentHeader} : {conTentHeader : conTenHeaderType}){
    return (
        <>
            <header className='Header'>
                <div className="Header_title">{conTentHeader.title}</div>


                <div className='Header_boxChild'>
                    <div className="Header_boxChild__img">
                        <Image 
                            src={conTentHeader.navItems.img} 
                            alt="Hình ảnh bài viết"
                            width={42} height={42}  
                        />
                    </div>

                    <div className='Header_boxChild__content'>
                        <div className="Header_boxChild__name">{conTentHeader.navItems.name}</div>
                        <div className="Header_boxChild_role">{conTentHeader.navItems.role}</div>
                    </div>
                      
                </div>
            </header>
        </>
    )

    
}