'use client'
import { useEffect, useState } from 'react';
import './PatientInformation.css';
import { getAllDepartments } from '@/app/services/ReceptionServices';
import { showToast, ToastType } from '@/app/lib/Toast';
import { useRouter } from 'next/navigation';

export default function PatientInformation_component({ callBack }: { callBack: () => void }) {
  const [departments, setDepartments] = useState<{ _id: string; TenKhoa: string }[]>([]);
  const [errorDepartment, setErrorDepartment] = useState(false);
  const [errorReason, setErrorReason] = useState(false);
  const [value, setValue] = useState<{
    height?: string;
    Weight?: string;
    Department?: { _id: string; name: string };
    Reason?: string;
  }>({});
  const router = useRouter();

function HandleCreate () {
  let hasError = false;

  if (!value.Department) {
    setErrorDepartment(true);
    hasError = true;
  } else {
    setErrorDepartment(false);
  }

  if (!value.Reason || value.Reason.trim() === '') {
    setErrorReason(true);
    hasError = true;
  } else {
    setErrorReason(false);
  }

  if (hasError) {
    showToast('Vui lòng nhập đầy đủ thông tin', ToastType.error);
    return;
  }else{
    sessionStorage.setItem('thongTinTiepNhan',JSON.stringify(value));
    router.push('/Receptionist/Reception/ChooseRoom');
  }
}


  useEffect(() => {
    async function fetchDepartments() {
      try {
        const response = await getAllDepartments();
        const data = await response.json();
        setDepartments(data.data);
      } catch (err) {
        console.error('Lỗi khi lấy khoa:', err);
      }
    }

    fetchDepartments();
  }, []);

  return (
    <>
      <div className="PatientInformationComponent-Background" onClick={callBack}></div>

      <div className="PatientInformationComponent-Box">
        <div className="PatientInformationComponent-Box__Title">
          Tiếp nhận {'>'} <a href="#">Chọn phòng</a>
        </div>

        <div className="PatientInformationComponent-Box__Child">
          <div className="PatientInformationComponent__Box_Child__contentTop">
            {/* Chiều cao */}
            <div className="PatientInformationComponent-Box__Child__Input1">
              <label htmlFor="">Chiều cao</label>
              <br />
              <input
                type="number"
                min="0"
                onChange={(e) => {
                    const input = e.target.value;
                    const number = parseFloat(input);

                    if (input === '' || number > 0) {
                        setValue((prev) => ({ ...prev, height: input }));
                    }
                }}

                value={value.height}
              />
              <div className="PatientInformationComponent__Box_Child__contentTop__Title">Cm</div>
            </div>

            {/* Cân nặng */}
            <div className="PatientInformationComponent-Box__Child__Input1">
              <label htmlFor="">Cân Nặng</label>
              <br />
              <input
                type="number"
                min="0"
                onChange={(e) => {
                    const input = e.target.value;
                    const number = parseFloat(input);

                    if (input === '' || number > 0) {
                        setValue((prev) => ({ ...prev, Weight: input }));
                    }
                }}
                value={value.Weight}
              />
              <div className="PatientInformationComponent__Box_Child__contentTop__Title">Kg</div>
            </div>

            {/* Chọn khoa */}
            <div className="PatientInformationComponent-Box__Child__Input1">
              <label htmlFor="">Chọn khoa</label>
              <br />
              <i className="bi bi-chevron-expand"></i>
              <select
                    className={errorDepartment ? 'input-error' : ''}
                    onChange={(e) => {
                        const selectedId = e.target.value;
                        const selectedDepartment = departments.find((d) => d._id === selectedId);
                        if (selectedDepartment) {
                        setValue((prev) => ({
                            ...prev,
                            Department: {
                            _id: selectedDepartment._id,
                            name: selectedDepartment.TenKhoa,
                            },
                        }));
                        setErrorDepartment(false); // Xóa lỗi nếu đã chọn
                        }
                    }}
                    >
                    <option value="" disabled={!!value.Department}>---Chọn khoa---</option>
                    {departments?.map((value) => (
                        <option key={value._id} value={value._id}>
                        {value.TenKhoa}
                        </option>
                    ))}
                    </select>
            </div>
          </div>

          {/* Lý do khám */}
          <div className="PatientInformationComponent-Box_Child__contentBottom">
            <label htmlFor="">Lý do đến khám</label>
            <br />
            <textarea
            className={errorReason ? 'input-error' : ''}
            placeholder="Nhập nội dung..."
            onChange={(e) => {
                setValue((prev) => ({ ...prev, Reason: e.target.value }));
                if (e.target.value.trim() !== '') {
                setErrorReason(false); // Xóa lỗi nếu đã nhập
                }
            }}
            ></textarea>
          </div>
        </div>

        {/* Nút tiếp tục */}
        <div className="PatientInformationComponent-Box__Child_button">
          <button
            className="PatientInformation-button__buttonItem"
            onClick={HandleCreate}
          >
            Tiếp tục
          </button>
        </div>
      </div>
    </>
  );
}
