'use client'
import './Header.css';

import { conTenHeaderType } from '@/app/types/componentTypes/headerType';


export default function Header ({conTentHeader} : {conTenHeaderType : conTenHeaderType}){
    return (
        <>
            <header className='Header'>
                <div className="Header_title">{conTentHeader.title}</div>
                <div className="Header_img"><img src={conTentHeader.navItems.img} alt="" /></div>
                <div className="Header_name">{conTentHeader.navItems.name}</div>
                <div className="Header_role">{conTentHeader.navItems.role}</div>
            </header>
        </>
    )

    
}