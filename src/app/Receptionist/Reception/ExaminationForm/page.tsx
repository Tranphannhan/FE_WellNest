import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import './ExaminationForm.css'
export default function ExaminationForm(){
    return (
        <>
        <Tabbar
    tabbarItems={
            { 
                tabbarItems:[
                {text: 'Phiếu Khám', link: '/Receptionist/Reception/ExaminationForm'},
            ]
            }
            }
    >
    </Tabbar>
                <div className="ExaminationForm-Container">
                    <div className="ExaminationForm-Container__header">
                        <h2>Thông tin phiếu khám</h2>
                        <div className="ExaminationForm-Container__print">
                        <button className="ExaminationForm-Container__print__btn">🖨 In phiếu khám</button>
                        </div>
                    </div>

                    {/* Khung 1: Thông tin cơ bản (4 cột) */}
                    <div className="form-grid grid-4">
                        <div className="ExaminationForm-Container__form__group">
                            <label htmlFor="fullName">Họ và tên:</label>
                            <input type="text" id="fullName" defaultValue="Lý Văn Điền" readOnly/>
                        </div>
                        <div className="ExaminationForm-Container__form__group">
                            <label htmlFor="cccd">Số CCCD:</label>
                            <input type="text" id="cccd" defaultValue="080205013878" readOnly />
                        </div>
                        <div className="ExaminationForm-Container__form__group">
                            <label htmlFor="dob">Ngày sinh:</label>
                            <input type="text" id="dob" defaultValue="16/08/1998" readOnly />
                        </div>
                       <div className="ExaminationForm-Container__form__group">
                            <label htmlFor="phone">Số điện thoại:</label>
                            <input type="text" id="phone" defaultValue="0343527854" readOnly/>
                        </div>
                    </div>

                    {/* Khung 2: Thông tin chi tiết (4 cột) */}
                    <div className="form-grid grid-3">
                         <div className="ExaminationForm-Container__form__group">
                            <label htmlFor="gender">Giới tính:</label>
                            {/* Giới tính dùng input readonly để giống hình ảnh */}
                            <input type="text" id="gender" defaultValue="Nam" readOnly className="gender-btn" />
                        </div> {/* Giữ nguyên tên class grid-3 nhưng sẽ dùng 4 cột */}
                        

                        {/* Chiều cao */}
                        <div className="ExaminationForm-Container__form__group">
                            <label htmlFor="height">Chiều cao:</label>
                            <div className="ExaminationForm-Container__input__unit">
                                <input type="text" id="height" defaultValue="173" readOnly/>
                                <span>Cm</span>
                            </div>
                        </div>

                        {/* Cân nặng */}
                        <div className="ExaminationForm-Container__form__group">
                            <label htmlFor="weight">Cân nặng:</label>
                            <div className="ExaminationForm-Container__input__unit">
                                <input type="text" id="weight" defaultValue="61" readOnly/>
                                <span>Kg</span>
                            </div>
                        </div>

                        <div className="ExaminationForm-Container__form__group">
                            <label htmlFor="clinic">Phòng khám:</label>
                            <input type="text" id="clinic" defaultValue="1" readOnly/>
                        </div>

                        <div className="ExaminationForm-Container__form__group">
                            <label htmlFor="department">Khoa:</label>
                            <input type="text" id="department" defaultValue="Chấn thương chỉnh hình" readOnly/>
                        </div>
                    </div>

                    {/* Khung 3: Địa chỉ và Lý do đến khám (2 cột) */}
                    <div className="form-grid grid-2">
                        <div className="ExaminationForm-Container__form__group">
                            <label htmlFor="address">Địa chỉ:</label>
                            <textarea id="address" readOnly defaultValue="403, ấp Mỹ Điền, xã Long Hựu, huyện Cần Đước,tỉnh Long An" />
                        </div>
                        <div className="ExaminationForm-Container__form__group">
                            <label htmlFor="reason">Lí do đến khám:</label>
                            <textarea id="reason" readOnly defaultValue="Nứt xương cánh tay" />
                        </div>
                    </div>

                    <div className="ExaminationForm-Container__accept">
                        <button className="ExaminationForm-Container__accept__btn">Xác nhận đã thanh toán</button>
                    </div>
                </div>
        </>
    
    )
    
}