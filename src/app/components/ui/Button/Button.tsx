
import Link from 'next/link';
import './Button.css'


interface buttonContentType{
    text:string,
    backgroundColor:string,
    textColor:string,
    link:string
}

export default function Button ({buttonContent}:{buttonContent:buttonContentType}){
    return  <Link
            href={buttonContent.link}
            >

            <button className='button' 
                style={{
                        backgroundColor:buttonContent.backgroundColor,
                        color:buttonContent.textColor,
                        padding: '8px 45px',
                        borderRadius : '4px'
                    }}
                >
                {buttonContent.text}
            </button>
        </Link>
      
}