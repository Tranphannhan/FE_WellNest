import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import './inputForm.css'
export default function InputForm() {
    return (
        <>
        <Tabbar
            tabbarItems={
                { 
                    tabbarItems:[
                    {text: 'Quét mã QR', link: '/Receptionist/Reception'},
                    {text: 'Nhập thủ công', link: '/Receptionist/Reception/InputForm'}
                ]
            }
               
            }
        ></Tabbar>
            <div className="InputForm__Container">
            <form>
                <div className="row">
                    <div className="form__group">
                        <label><span className="text__red">*</span>Họ và tên:</label>
                        <input type="text" />
                    </div>
                <div className="form__group">
                        <label>Số CCCD (Không bắt buộc):</label>
                        <input type="text" />
                    </div>
                <div className="form__group">
                        <label><span className="text__red">*</span>Ngày sinh:</label>
                        <input type="date" style={{color:'#808080'}}/>
                    </div>
                </div>

                <div className="row">
                    <div className="form__group">
                        <label>Số BHYT (Không bắt buộc):</label>
                        <input type="text" />
                    </div>
                <div className="form__group">
                        <label>Số điện thoại (Không bắt buộc):</label>
                        <input type="text" />
                    </div>
                <div className="form__group">
                        <label>Số điện thoại người thân (Không bắt buộc):</label>
                        <input type="text" />
                    </div>
                </div>  

                <div className="row">
                <div className="form__group">
                    <label><span className="text__red">*</span>Giới tính:</label>
                    <div className="gender">
                    <label>
                        <input className="gender__input" type="radio" name="gender" defaultChecked /> Nam
                    </label>
                    <label>
                        <input className="gender__input" type="radio" name="gender" /> Nữ
                    </label>
                    </div>
                </div>
                <div className="form__group address__group">
                    <label>Địa chỉ (Không bắt buộc):</label>
                    <textarea rows={3}></textarea>
                </div>
                </div>

                <div className="form__group">
                <label>Lịch sử bệnh (Không bắt buộc):</label>
                <textarea rows={4}></textarea>
                </div>

                <div className="Form_button">
                    <button>Tạo sổ khám bệnh tạm thời</button>
                </div>
                
            </form>
            </div>
        </>
    );
}