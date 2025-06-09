'use client'
import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import './inputForm.css';
import { codeScanningInformationType } from "@/app/types/patientTypes/patient";

export default function InputForm({ searchParams = {} }: { searchParams?: { isTheOfficialCard?: string } }) {
  const isTheOfficialCard = searchParams.isTheOfficialCard === 'true';
  const patientInformationSession = sessionStorage.getItem('thongTinCCCD');
  let patientInformation:codeScanningInformationType | null = null;
  if(patientInformationSession){
    patientInformation = JSON.parse(patientInformationSession)
  }

  return (
    <>
    {
        isTheOfficialCard ?
                <Tabbar
                tabbarItems={{
                tabbarItems: [
                    { text: 'Tạo sổ khám bệnh', link: '/Receptionist/Reception/InputForm?isTheOfficialCard=true' },
                ],
                }}
            />
        :
                <Tabbar
                tabbarItems={{
                tabbarItems: [
                    { text: 'Quét mã QR', link: '/Receptionist/Reception' },
                    { text: 'Nhập thủ công', link: '/Receptionist/Reception/InputForm' },
                ],
                }}
            />
    }
     

      <div className="InputForm-Container">
        <form>
          <div className="InputForm-Container__row">
            <div className="InputForm-Container__form__group">
              <label><span className="text__red">*</span>Họ và tên:</label>
              <input
                value={isTheOfficialCard && patientInformation ? patientInformation.name : ''}
                type="text"
                disabled={isTheOfficialCard}
                className={isTheOfficialCard ? 'input-disabled' : ''}
              />
            </div>

            <div className="InputForm-Container__form__group">
                {isTheOfficialCard ? 
                    <label><span className="text__red">*</span>Số CCCD:</label>:
                    <label>Số CCCD (Không bắt buộc):</label>
                }
    
              <input
                type="text"
                value={isTheOfficialCard && patientInformation ? patientInformation.CCCDNumber : ''}
                disabled={isTheOfficialCard}
                className={isTheOfficialCard ? 'input-disabled' : ''}
              />
            </div>

            <div className="InputForm-Container__form__group">
              <label><span className="text__red">*</span>Ngày sinh:</label>
              <input
                value={isTheOfficialCard && patientInformation ? patientInformation.dateOfBirth : ''}
                type="date"
                style={{ color: '#808080' }}
                disabled={isTheOfficialCard}
                className={isTheOfficialCard ? 'input-disabled' : ''}
              />
            </div>
          </div>

          <div className="InputForm-Container__row">
            <div className="InputForm-Container__form__group">
              <label>Số BHYT (Không bắt buộc):</label>
              <input type="text" />
            </div>

            <div className="InputForm-Container__form__group">
              <label>Số điện thoại (Không bắt buộc):</label>
              <input type="text" />
            </div>

            <div className="InputForm-Container__form__group">
              <label>Số điện thoại người thân (Không bắt buộc):</label>
              <input type="text" />
            </div>
          </div>

          <div className="InputForm-Container__row">
            <div className="InputForm-Container__form__group">
              <label><span className="text__red">*</span>Giới tính:</label>
              <div className="InputForm-Container__gender">
                <label>
                  <input
                    className="gender__input"
                    type="radio"
                    name="gender"
                    disabled={isTheOfficialCard}
                    checked={isTheOfficialCard && patientInformation ? patientInformation.sex === 'Nam' : false}
                  /> Nam
                </label>
                <label>
                  <input
                    className="gender__input"
                    type="radio"
                    name="gender"
                    disabled={isTheOfficialCard}
                    checked={isTheOfficialCard && patientInformation ? patientInformation.sex === 'Nữ' : false}
                  /> Nữ
                </label>
              </div>
            </div>

            <div className="InputForm-Container__form__group InputForm-Container__address__group">
                {isTheOfficialCard ? 
                    <label><span className="text__red">*</span>Địa chỉ:</label>:
                    <label>Địa chỉ (Không bắt buộc):</label>
                }

              <textarea
                value={isTheOfficialCard && patientInformation ? patientInformation.address : ''}
                rows={3}
                disabled={isTheOfficialCard}
                className={isTheOfficialCard ? 'input-disabled' : ''}
              ></textarea>
            </div>
          </div>

          <div className="InputForm-Container__form__group">
            <label>Lịch sử bệnh (Không bắt buộc):</label>
            <textarea rows={4}></textarea>
          </div>

          <div className="InputForm-Container__form__button">
            <button>
              {isTheOfficialCard ? 'Tạo sổ khám bệnh chính thức' : 'Tạo sổ khám bệnh tạm thời'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
