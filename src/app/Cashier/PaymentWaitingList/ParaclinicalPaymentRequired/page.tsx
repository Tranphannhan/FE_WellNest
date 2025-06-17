
'use client'
import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import '../Prescription.css';


export default function Prescription (){
    const mockData = [
        {
            _id: '1',
            Id_TheKhamBenh: {
                HoVaTen: 'Nguyễn Văn A',
                SoDienThoai :  '0909876543',
                DichVu : 'Xét nghiệm máu',
                TenBacSi: 'Dr Ngô Hoàng Anh',
                TongTien : 1282,
            },
            Ngay: '2024/06/17'
        },

        {
            _id: '2',
            Id_TheKhamBenh: {
                HoVaTen: 'Nguyễn Văn Hùng',
                SoDienThoai :  '0909876512',
                DichVu : 'Xét nghiệm châm',
                TenBacSi: 'Dr GT Giao Long',
                TongTien : 1982,
            },
            Ngay: '2024/06/27'
        },
    ];

    

    return (
        <>
            <Tabbar
                tabbarItems={{
                        tabbarItems: [
                        { text: 'Đơn thuốc chờ thanh toán', link: '/Cashier/PaymentWaitingList' },
                        { text: 'Cận lâm sàng chờ thanh toán', link: '/Cashier/PaymentWaitingList/ParaclinicalPaymentRequired'}
                    ],
                    
                }}
            />
                


            <div className="Prescription-container">
                <div className="Prescription-searchReceptionContainer">
                    <div className="Prescription_searchBoxWrapper">
                        <div className="Prescription_searchBox">
                            <input
                                type="text"
                                placeholder="Hãy nhập số điện thoại"
                                className="search-input"
                            />
                            <button className="search-btn">
                            <i className="bi bi-search"></i>
                            </button>
                        </div>

                        <div className="Prescription_searchBox">
                            <input
                                type="text"
                                placeholder="Hãy nhập tên"
                                className="search-input"
                            />
                            <button className="search-btn">
                            <i className="bi bi-search"></i>
                            </button>
                        </div>
                    </div>
                </div>



                <table className="Prescription-container_table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Họ và tên</th>
                            <th>SĐT</th>
                            <th>Dịch vụ</th>
                            <th>Tên bác sĩ</th>
                            <th>Ngày</th>
                            <th>Tổng Tiền</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>


                    <tbody>
                        {mockData.map((record , index) => (
                            <tr key={record._id}>
                                <th>{index}</th>
                                <td>{record.Id_TheKhamBenh.HoVaTen}</td>
                                <td>{record.Id_TheKhamBenh.SoDienThoai}</td>
                                <td>{record.Id_TheKhamBenh.DichVu}</td>
                                <td>{record.Id_TheKhamBenh.TenBacSi}</td>
                                <td>{record.Ngay}</td>
                                <td>{record.Id_TheKhamBenh.TongTien}</td>
                                <td>
                                    <button className="btn-primary">Xem Chi Tiết</button>
                                    <button className="btn-danger">Thu tiền</button>    
                                </td>


                            </tr>   
                        ))}
                    </tbody>


                </table>


            </div>


        </>
    )

}