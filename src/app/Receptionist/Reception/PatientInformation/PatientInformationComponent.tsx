
import './PatientInformation.css';
// import Link from 'next/link';

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
/>



export default function PatientInformation_component ({callBack} : {callBack : () => void} ){
    return (
        <>
            <div className='PatientInformationComponent-Background' onClick={ callBack }></div>

            <div className="PatientInformationComponent__Box">
                <div className='PatientInformationComponent__Box_Title'>Tiếp nhận {'>'} <a href="">Chọn phòng</a></div>


                <div className='PatientInformationComponent__Box_Child'>
                    <div className='PatientInformationComponent__Box_Child__contentTop'>
                        <div className='PatientInformationComponent__Box_Child__Input1'>
                            <label htmlFor="">Chiều cao</label><br />
                            <input type="text" />
                            <div className='PatientInformationComponent__Box_Child__Input1_Title'>Cm</div>
                        </div>

                          <div className='PatientInformationComponent__Box_Child__Input1'>
                            <label htmlFor="">Chiều cao</label><br />
                            <input type="text" />
                            <div className='PatientInformationComponent__Box_Child__Input1_Title'>Cm</div>
                        </div>


                        <div className='PatientInformationComponent__Box_Child__Input1'>
                            <label htmlFor="">Chọn khoa</label><br />
                            <i className="bi bi-chevron-expand"></i>

                            <select name="" id="">
                                <option value="">---Chọn khoa---</option>
                                <option value="">Khoa 1</option>
                                <option value="">Khoa 2</option>
                                <option value="">Khoa 3</option>
                            </select>

                        </div>
                    </div>

                    {/*  */}

                    <div className='PatientInformationComponent__Box_Child__contentBottom'>
                        <label htmlFor="">Lý do đến khám</label><br />
                        <textarea placeholder="Nhập nội dung..."></textarea>
                    </div>

                 

                </div>



                    <div className='PatientInformationComponent__Box_Child_button'>
                        <button  className='PatientInformation-button__buttonItem'>Tiếp tục</button>

                    </div>


              





            


               


            </div>
        </>
    )

}