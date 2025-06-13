
"use client"
import React, { useState , useEffect }  from "react";
import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import './ChooseRoom.css'
import Link from "next/link";
import Example from './notificationChooseRoom';
import { getAllChooseRooms } from "@/app/services/ReceptionServices";
import { showToast, ToastType } from '@/app/lib/Toast';
import { receptionTemporaryDoctorTypes } from "@/app/types/receptionTypes/receptionTemporaryTypes";
import { useRouter } from "next/navigation";
import Pagination from "@/app/components/ui/Pagination/Pagination";
import NoData from "@/app/components/ui/Nodata/Nodata";
 
interface createExaminationCardInformationType{
  Id_TheKhamBenh?: string;
  Id_Bacsi?: string;
  Id_NguoiTiepNhan?: string;
  Id_GiaDichVu?: string;
  LyDoDenKham?: string;
}
 
export default function ChooseRoom() {
    const [show, setShow] = useState(false);
    const [currentPage,setCurrentPage] = useState<number>(1)
    const [totalPages,setTotalPagas] = useState <number>(1)
    const [nameDepartment, setNameDepartment] = useState <string>('')
    const [vitalSigns, setVitalSigns] = useState<{height?:string, weight?:string}>({})
    const [examinationCardInformation, setExaminationCardInformation] = useState <createExaminationCardInformationType>({})
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const router = useRouter();
    const [valueChooseRom , setValueChooseRom] = useState ({
        name : '',
        roomNumber : 0,
    })


async function HandleCreate() {
    try {
        console.log("Dữ liệu gửi đi:", examinationCardInformation);

        // Gửi yêu cầu tạo phiếu khám bệnh
        const response = await fetch('http://localhost:5000/Phieu_Kham_Benh/Add', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(examinationCardInformation)
        });

        if (!response.ok) {
            showToast("Tạo phiếu khám bệnh thất bại!", ToastType.error);
            return;
        }

        const resultResponseExaminationData = await response.json();
        const result = resultResponseExaminationData.data
        console.log("Thông tin phiếu khám bệnh trả về",result)
        const idPhieuKhamBenh = result._id;
        
        if (!idPhieuKhamBenh) {
            showToast("Không nhận được ID phiếu khám bệnh!", ToastType.error);
            return;
        }

        const examinationData = {
            Id_PhieuKhamBenh:idPhieuKhamBenh,
            fullName: result.Id_TheKhamBenh?.HoVaTen || 'Không có',
            cccd: result.Id_TheKhamBenh?.SoCCCD || 'Không có',
            dob: result.Id_TheKhamBenh?.NgaySinh || 'Không có',
            phone: result.Id_TheKhamBenh?.SoDienThoai || 'Không có',
            gender: result.Id_TheKhamBenh?.GioiTinh || 'Không có',
            height: vitalSigns.height || 'Không có',
            weight: vitalSigns.weight || 'Không có',
            clinic: result.Id_Bacsi?.Id_PhongKham?.SoPhongKham || 'Không có',
            department: nameDepartment || 'Không có',
            address: result.Id_TheKhamBenh?.DiaChi || 'Không có',
            reason: result.LyDoDenKham || 'Không có',
            price:result.Id_GiaDichVu.Giadichvu || 0,
            QueueNumber:0,
        };


        // Chuẩn bị payload chỉ số sinh tồn
        const payload: Record<string, string> = {
            Id_PhieuKhamBenh: idPhieuKhamBenh
        };

        if (typeof vitalSigns.weight === 'string' && vitalSigns.weight.trim()) {
            payload.CanNang = vitalSigns.weight.trim();
        }

        if (typeof vitalSigns.height === 'string' && vitalSigns.height.trim()) {
            payload.ChieuCao = vitalSigns.height.trim();
        }

        if (!payload.CanNang && !payload.ChieuCao) {
            showToast("Không có dữ liệu chỉ số sinh tồn để gửi!", ToastType.warn);
        } else {
            // Gửi chỉ số sinh tồn nếu có
            const responseVitalSigns = await fetch('http://localhost:5000/Chi_So_Sinh_Ton/Add', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!responseVitalSigns.ok) {
                showToast("Thêm chỉ số sinh tồn thất bại!", ToastType.error);
                return;
            }

            const resultVitalSigns = await responseVitalSigns.json();
            console.log("Thêm chỉ số sinh tồn thành công:", resultVitalSigns);
        }

        // Thành công toàn bộ
        showToast("Tạo phiếu khám bệnh thành công!", ToastType.success);
        setShow(false);
        sessionStorage.setItem('ThongTinPhieuKham',JSON.stringify(examinationData))
        router.push('/Receptionist/Reception/ExaminationForm');

    } catch (error) {
        console.error("Lỗi trong quá trình xử lý:", error);
        showToast("Đã xảy ra lỗi trong quá trình tạo phiếu khám!", ToastType.error);
    }
}




    
    const handleSetValue = (name : string , roomNumber : number) => {
        setValueChooseRom ({
            name : name,
            roomNumber : roomNumber
        })
        setShow(true)
    }   
    
    const [dataChooseRoom , setDataChooseRoom] = useState <receptionTemporaryDoctorTypes []> ([]);
    useEffect(() => {
        const initData = async () => {
            try {
                const dataLocal = sessionStorage.getItem('thongTinTiepNhan');
                const dataLocalPatient = sessionStorage.getItem('soKhamBenh');

                if (!dataLocal || !dataLocalPatient) {
                    showToast('Thiếu dữ liệu tiếp nhận hoặc bệnh nhân', ToastType.error);
                    return;
                }

                const data = JSON.parse(dataLocal);
                const dataPatient = JSON.parse(dataLocalPatient);

                if (!dataPatient._id) {
                    showToast('Chưa có mã sổ khám bệnh', ToastType.error);
                    return;
                }

                setExaminationCardInformation((prev) => ({
                    ...prev,
                    Id_TheKhamBenh: dataPatient._id,
                    Id_GiaDichVu: '683420eb8b7660453369dce1',
                    Id_NguoiTiepNhan: '68272e93b4cfad70da810029',
                    LyDoDenKham:data.Reason
                }));

                setVitalSigns({height:String(data.height),weight:String(data.Weight)})
                setNameDepartment(data.Department.name);

                const response = await getAllChooseRooms(data.Department._id,currentPage);
                if (response) {
                    setDataChooseRoom(response.data);
                    setTotalPagas(response.totalPages)
                }
            } catch (error) {
                showToast('Đã có lỗi xảy ra khi tải dữ liệu', ToastType.error);
                console.error(error);
            }
        };

        initData();
    }, [currentPage]);


    return (
        <>
            <Example 
                Data_information={
                    {
                        name: valueChooseRom.name,
                        roomNumber: valueChooseRom.roomNumber,
                        handleClose,
                        handleShow,
                        show,
                        callBack:HandleCreate
                    }
                }
            />


            <Tabbar
                tabbarItems={
                    {
                        tabbarItems: [
                            { text: 'Chọn phòng', link: '/Receptionist/Reception/ChooseRoom' },

                        ]
                    }

                }
            ></Tabbar>

            <div className="chooseRoom-container">
                <h1 className="chooseRoom-container__title">
                    Danh sách phòng khoa:
                    <span className="chooseRoom-container__title2"> {nameDepartment}</span>
                    <Link href="/Receptionist/Reception/PatientInformation">
                        <button className="chooseRoom-container__button">Quay lại</button>
                    </Link>
                </h1>



            {dataChooseRoom.length > 0 ?(

                <>
                                    <table className="chooseRoom-container__table">
                    <thead>
                        <tr>
                            <th>Tên bác sĩ</th>
                            <th>Số phòng</th>
                            <th>Số lượng bệnh nhân</th>
                            <th>Thời gian dự tính</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                   <tbody>
                        {dataChooseRoom.length === 0 ? (
                            <tr>
                            <td colSpan={5} style={{ textAlign: 'center', padding: '16px' }}>
                                Chưa có dữ liệu
                            </td>
                            </tr>
                        ) : (
                            dataChooseRoom.map((doctor: receptionTemporaryDoctorTypes, index: number) => {
                            const totalMinutes = doctor.SoNguoiDangKham * 15;

                            const formatTime = (minutes: number) => {
                                if (minutes < 60) return `${minutes} phút`;
                                const hours = Math.floor(minutes / 60);
                                const mins = minutes % 60;
                                return mins === 0 ? `${hours} tiếng` : `${hours} tiếng ${mins} phút`;
                            };
                            const isFull = doctor.SoNguoiDangKham === 10;


                            return (
                                <tr key={index}>
                                <td>{doctor.TenBacSi}</td>
                                <td>{doctor.Id_PhongKham?.SoPhongKham || 'Không rõ'}</td>
                                <td
                                    style={{
                                    color:
                                        doctor.SoNguoiDangKham < 4
                                        ? 'green'
                                        : doctor.SoNguoiDangKham < 8
                                        ? 'orange'
                                        : 'red',
                                    }}
                                >
                                    {doctor.SoNguoiDangKham + '/10'} bệnh nhân
                                </td>
                                <td>{formatTime(totalMinutes)}</td>
                                <td>
                                  {
                                        <button
                                            disabled={isFull}
                                            onClick={() => {
                                                if (isFull) {
                                                    showToast('Phòng đã đầy', ToastType.error);
                                                } else {
                                                    handleSetValue(doctor.TenBacSi, Number(doctor.Id_PhongKham?.SoPhongKham));
                                                    setExaminationCardInformation((prev) => ({
                                                        ...prev,
                                                        Id_Bacsi: doctor._id
                                                    }));
                                                }
                                            }}
                                            className="chooseRoom-container__btn-choose"
                                            style={{
                                                background: isFull ? '#313131' : '',
                                                cursor: isFull ? 'not-allowed' : 'pointer',
                                            }}
                                        >
                                            {isFull ? 'Đã đầy' : 'Chọn phòng'}
                                        </button>

                                  }
                                </td>
                                </tr>
                            );
                            })
                        )}
                        </tbody>

                </table>

            <div className="SearchReception-pagination">
                   <Pagination
                      totalPages={totalPages}
                      currentPage={currentPage}
                      onPageChange={setCurrentPage}
                  />

            </div>
                </>
            ):(
                <>
                    <NoData message="Không có dữ liệu bác sĩ" remind="Vui lòng liên hệ bệnh viện số: 0933750634"></NoData>
                </>
            )}
            </div>
        </>
    );
}