'use client'
import Tabbar from '@/app/components/shared/Tabbar/Tabbar';
import './PatientInformation.css';
import Button from '@/app/components/ui/Button/Button';
import PatientInformation_component from './PatientInformationComponent';
import {useState} from 'react';



export default function PatientInformation (){
    const [display , setDisplay] = useState <boolean> (false);

    return (
        <>
            <Tabbar
                tabbarItems = {
                        {
                            tabbarItems : [
                                {text : "Thông tin bệnh nhân" , link : "/Receptionist/Reception/PatientInformation"}
                            ]
                        }
                    }
            />


            
            {display && <PatientInformation_component  callBack={() => {setDisplay(false)} }/>}

            <div className='PatientInformation' >
                <div className='PatientInformation_Box1'>
                    <div className='PatientInformation_Box1__title'>
                        Thông tin bệnh nhân 
                        <i className="bi bi-pencil-square"></i>
                    </div>

                    <div className='PatientInformation_Box1__content'>
                        <div className='PatientInformation_Box1__content__Name'>
                            <span className='PatientInformation_Box1__content__Name--Bold'>Họ và tên: </span>
                             Nguyễn Đình Huân 
                        </div>
                    </div>

                    <div className='PatientInformation_Box1__content'>
                        <div className='PatientInformation_Box1__content__Name'>
                            <span className='PatientInformation_Box1__content__Name--Bold'>Giới tính: </span>
                            Nam 
                        </div>
                    </div>

                    <div className='PatientInformation_Box1__content'>
                        <div className='PatientInformation_Box1__content__Name'>
                            <span className='PatientInformation_Box1__content__Name--Bold'>Số điện thoại: </span>
                            0369594026 
                        </div>
                    </div>

                    <div className='PatientInformation_Box1__content'>
                        <div className='PatientInformation_Box1__content__Name'>
                            <span className='PatientInformation_Box1__content__Name--Bold'>Số BHYT: </span>
                            BHYT9001999 
                        </div>
                    </div>

                    <div className='PatientInformation_Box1__content'>
                        <div className='PatientInformation_Box1__content__Name'>
                            <span className='PatientInformation_Box1__content__Name--Bold'>Địa chỉ: </span><br />
                            403, ấp Mỹ Điền, xã Long Hựu, huyện Cần Đước,tỉnh Long An 
                        </div>
                    </div>

                    <div className='PatientInformation_Box1__content'>
                        <div className='PatientInformation_Box1__content__Name'>
                            <span className='PatientInformation_Box1__content__Name--Bold'>Lịch sử bệnh: </span><br />
                            Suy tim, ho lao, sỏi thận,suy hô hấp 
                        </div>
                    </div>

                </div>


                <div className='PatientInformation_Box2'>
                    <div className='PatientInformation_Box2__content'>
                        <div className='PatientInformation_Box2__content__Name'>
                            <span className='PatientInformation_Box2__content__Name--Bold'>Số CCCD: </span>
                            080205013878
                        </div>
                    </div>

                    <div className='PatientInformation_Box2__content'>
                        <div className='PatientInformation_Box2__content__Name'>
                            <span className='PatientInformation_Box2__content__Name--Bold'>Ngày sinh: </span>
                             16/08/1998 
                        </div>
                    </div>


                    <div className='PatientInformation_Box2__content'>
                        <div className='PatientInformation_Box2__content__Name'>
                            <span className='PatientInformation_Box2__content__Name--Bold'>Số điện thoại người thân:  </span>
                            0977567891
                        </div>
                    </div>
                </div>
            </div>


            {/*  */}
            <div className='PatientInformation-button'>
                <Button buttonContent = {
                            {
                                text : "Quay lại",
                                backgroundColor : "#858585",
                                textColor : "#FFFFFF",
                                link : "/Receptionist/Reception"
                            }
                        }
                    >
                </Button>

                <button onClick={() => {setDisplay(true)}} className='PatientInformation-button__buttonItem'>Tiếp nhận</button>
            </div>




        </>
    )
}
  