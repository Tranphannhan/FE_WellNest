'use client'

import Link from 'next/link';
import './Navbar.css'
import { conTentNavigationType } from '@/app/types/componentTypes/NavTypes';
import { usePathname } from 'next/navigation';
import { MdLogout } from "react-icons/md";


export default function Navbar ({conTentNavigation}:{conTentNavigation:conTentNavigationType}){
       const pathname = usePathname(); // thay vì useRouter

    return <nav className='Nav'>
        <img
            className='Nav__logo'
            src={conTentNavigation.logo} 
            alt="Logo"  
            />
        <div className='Nav__content'>
            {conTentNavigation?.navItems.map((value, index) =>{
                const isActive = pathname.startsWith(value.link);
                    return(

                        <Link key={index} href={value.link} prefetch={false}
                        >
                            <div className={`Nav__item ${isActive  ? 'Nav-active':''}`} >
                                <i className={value.icon}></i>
                                <span className='Nav__item__text'>{value.text}</span>
                            </div>
                        </Link>
                
                    )
            }
            
               
                
            )}
            <button style={{width:'100%'}}>
                    <div className='Nav__item'>
                        <MdLogout />
                        <span className='Nav__item__text'>Đăng xuất</span>
                    </div>
                </button>
        </div>
    </nav>
}