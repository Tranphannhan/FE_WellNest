import './Prescription.css';
// import { Trash2 } from 'lucide-react'; 

export default function SelectedMedicineComponent() {
    const medicines = [
        {
            name: 'Paracetamol 500mg',
            image: 'https://innguyenphong.com/Files/44/trang/h%E1%BB%99p/thi%E1%BA%BFt%20k%E1%BA%BF%20v%E1%BB%8F%20h%E1%BB%99p%20thu%E1%BB%91c/thiet-ke-vo-hop-thuoc%20(14).jpg',
            unit: 'Vỉ',
            quantity: 1,
            note: 'Nên uống trước khi ăn',
            usage: '2 vỉ 1 ngày sáng, tối',
            price: 150000,
        },
        {
            name: 'Onepiece 500mg',
            image: 'https://innguyenphong.com/Files/44/trang/h%E1%BB%99p/thi%E1%BA%BFt%20k%E1%BA%BF%20v%E1%BB%8F%20h%E1%BB%99p%20thu%E1%BB%91c/thiet-ke-vo-hop-thuoc%20(14).jpg',
            unit: 'Viên',
            quantity: 20,
            note: 'Tránh dùng cho phụ nữ mang thai',
            usage: '4 viên 1 ngày sáng, trưa chiều tối',
            price: 15000,
        },
        {
            name: 'Naruto 500mg',
            image: 'https://innguyenphong.com/Files/44/trang/h%E1%BB%99p/thi%E1%BA%BFt%20k%E1%BA%BF%20v%E1%BB%8F%20h%E1%BB%99p%20thu%E1%BB%91c/thiet-ke-vo-hop-thuoc%20(14).jpg',
            unit: 'Gói',
            quantity: 3,
            note: 'Không dùng cho trẻ em dưới 3 tuổi',
            usage: '3 gói 1 ngày sáng, Trưa, tối',
            price: 450000,
        },
        {
            name: 'Sasuke 500mg',
            image: 'https://innguyenphong.com/Files/44/trang/h%E1%BB%99p/thi%E1%BA%BFt%20k%E1%BA%BF%20v%E1%BB%8F%20h%E1%BB%99p%20thu%E1%BB%91c/thiet-ke-vo-hop-thuoc%20(14).jpg',
            unit: 'Vỉ',
            quantity: 1,
            note: 'Không dùng chung thuốc Naruto',
            usage: '1 vỉ 1 ngày tối',
            price: 250000,
        }
    ];

    return (
        <div>
            <div className="Prescription-medicine__container">
                <h3>Thuốc đã chọn</h3>
                <table className="Prescription-medicine__container__medicineTable">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Tên thuốc</th>
                            <th>Ảnh thuốc</th>
                            <th>Đơn vị</th>
                            <th>Số lượng</th>
                            <th>Lưu ý</th>
                            <th>Cách sử dụng</th>
                            <th>Giá mỗi đơn vị</th>
                            <th>Giá tổng</th>
                        </tr>
                    </thead>
                
                    <tbody>
                        {medicines.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <i style={{color : 'red' , fontSize : '20px'}} className="bi bi-trash3-fill"></i>
                                </td>
                                <td >{item.name}</td>
                                <td>
                                    <img src={item.image} alt={item.name} className="Prescription-medicine__container__medicineTable__medicineImage" />
                                </td>
                                <td>{item.unit}</td>
                                <td>{item.quantity}</td>
                                <td>{item.note}</td>
                                <td>{item.usage}</td>
                                <td>{item.price.toLocaleString()} ₫</td>
                                <td>{(item.price * item.quantity).toLocaleString()} ₫</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="Prescription-medicine__container__MedicineActions">
                    <button className="Prescription-medicine__container__MedicineActions__addButton">+ Thêm thuốc</button>
                    <button className="Prescription-medicine__container__MedicineActions__completeButton">Hoàn thành</button>
                </div>
            </div>
        </div>
    );
}
