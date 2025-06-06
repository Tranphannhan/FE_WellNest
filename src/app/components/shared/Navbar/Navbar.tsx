'use client'

import Link from 'next/link';
import './Navbar.css'
import { useState } from 'react';
import { conTentNavigationType } from '@/app/types/componentTypes/navTypes';


export default function Navbar ({conTentNavigation}:{conTentNavigation:conTentNavigationType}){
    const [active,setActive] = useState <number>(0)

    return <nav className='Nav'>
        <img
            className='Nav__logo'
            src={conTentNavigation.logo} 
            alt="Logo"  
            />
        <div className='Nav__content'>
            {conTentNavigation?.navItems.map((value, index) =>
                <Link key={index} href={value.link}
                    onClick={()=>{setActive(index)}}
                >
                    <div className={`Nav__item ${index === active ? 'Nav-active':''}`} >
                        <i className={value.icon}></i>
                        <span className='Nav__item__text'>{value.text}</span>
                    </div>
                </Link>
                
            )}
            <button style={{width:'100%'}}>
                    <div className='Nav__item'>
                        <i className="bi bi-box-arrow-right"></i>
                        <span className='Nav__item__text'>Đăng xuất</span>
                    </div>
                </button>
        </div>
    </nav>
}