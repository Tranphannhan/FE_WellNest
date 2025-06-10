
import { useEffect, useState } from 'react';
import './PatientInformation.css';
import { getAllDepartments } from '@/app/services/ReceptionServices';

// import Link from 'next/link';

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
/>



export default function PatientInformation_component ({callBack} : {callBack : () => void} ){
    const [departments, setDepartments] = useState<{ _id: string; TenKhoa: string }[]>([]);

    useEffect(() => {
    async function fetchDepartments() {
        try {
        const response = await getAllDepartments();  
        const data = await response.json();
        setDepartments(data.data);
        } catch (err) {
        console.error("Lỗi khi lấy khoa:", err);
        }
    }

    fetchDepartments();
    }, []);


    return (
        <>
            <div className='PatientInformationComponent-Background' onClick={ callBack }></div>

            <div className="PatientInformationComponent-Box">
                <div className='PatientInformationComponent-Box__Title'>Tiếp nhận {'>'} <a href="">Chọn phòng</a></div>

                <div className='PatientInformationComponent-Box__Child'>


                    <div className='PatientInformationComponent__Box_Child__contentTop'>
                        <div className='PatientInformationComponent-Box__Child__Input1'>
                            <label htmlFor="">Chiều cao</label><br />
                            <input type="text" />
                            <div className='PatientInformationComponent__Box_Child__contentTop__Title'>Cm</div>
                        </div>

                        <div className='PatientInformationComponent-Box__Child__Input1'>
                            <label htmlFor="">Cân Nặng</label><br />
                            <input type="text" />
                            <div className='PatientInformationComponent__Box_Child__contentTop__Title'>Kg</div>
                        </div>


                        <div className='PatientInformationComponent-Box__Child__Input1'>
                            <label htmlFor="">Chọn khoa</label><br />
                            <i className="bi bi-chevron-expand"></i>

                            <select name="" id="">
                                <option value="">---Chọn khoa---</option>
                                {departments?.map((value) => (
                                <option key={value._id} value={value._id}>{value.TenKhoa}</option>
                                ))}
                            </select>

                        </div>
                    </div>

                    {/*  */}

                    <div className='PatientInformationComponent-Box_Child__contentBottom'>
                        <label htmlFor="">Lý do đến khám</label><br />
                        <textarea placeholder="Nhập nội dung..."></textarea>
                    </div>
                </div>



                    <div className='PatientInformationComponent-Box__Child_button '>
                        <button  className='PatientInformation-button__buttonItem'>Tiếp tục</button>
                    </div>


              





            


               


            </div>
        </>
    )

}