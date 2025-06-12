import './Paraclinical.css';
export default function ParaclinicalComponent (){
      const medicines = [
        {
            tenphong : 'Phòng Chụp X Quang',
            name: 'Xét Nghiệm Máu',
            image: 'https://login.medlatec.vn//ImagePath/images/20201221/20201221_y-nghia-xet-nghiem-mau-1.jpg',
            price: 150000,
        },

          {
            tenphong : 'Phòng Chụp X Quang',
            name: 'Xét Nghiệm Máu',
            image: 'https://login.medlatec.vn//ImagePath/images/20201221/20201221_y-nghia-xet-nghiem-mau-1.jpg',
            price: 150000,
        },

          {
            tenphong : 'Phòng Chụp X Quang',
            name: 'Xét Nghiệm Máu',
            image: 'https://login.medlatec.vn//ImagePath/images/20201221/20201221_y-nghia-xet-nghiem-mau-1.jpg',
            price: 150000,
        },

          {
            tenphong : 'Phòng Chụp X Quang',
            name: 'Xét Nghiệm Máu',
            image: 'https://login.medlatec.vn//ImagePath/images/20201221/20201221_y-nghia-xet-nghiem-mau-1.jpg',
            price: 150000,
        },

          {
            tenphong : 'Phòng Chụp X Quang',
            name: 'Xét Nghiệm Máu',
            image: 'https://login.medlatec.vn//ImagePath/images/20201221/20201221_y-nghia-xet-nghiem-mau-1.jpg',
            price: 150000,
        },
    ];


    return (
        <>
            <div className='Paraclinical-Body'>
                 <div className="Paraclinical-medicine__container">
                    <div className='Paraclinical-medicine__container__title'>Các xét nghiệm đã chọn</div>
                    <table className="Paraclinical-medicine__container__medicineTable">
                        <thead>
                            <tr>
                                <th>Tên phòng thiết bị</th>
                                <th>Tên xét nghiệm</th>
                                <th>Hình ảnh xét nghiệm</th>
                                <th>Gía</th>
                                <th>Hành Động</th>
                            </tr>
                        </thead>
                    
                        <tbody>
                            {medicines.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.tenphong}</td>
                                    <td >{item.name}</td>
                                    <td><img style={{width : "67px" , height : "40px"}} src={item.image} alt={item.name} className="Prescription-medicine__container__medicineTable__medicineImage" /></td>
                                    <td>{item.price.toLocaleString()} ₫</td>
                                    <td >
                                        <div className='Paraclinical-medicine__container__medicineTable__Bton'>
                                            <span><i style={{color : "red" , fontSize : "15px"}} className="bi bi-x-lg"></i> Loại bỏ</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="Paraclinical-medicine__container__MedicineActions">
                        <button className="Paraclinical-medicine__container__MedicineActions__addButton">+ Thêm yêu cầu</button>
                        <button className="Paraclinical-medicine__container__MedicineActions__completeButton">Hoàn thành</button>
                    </div>
                </div>

            



            
            </div>
        </>
    ) 


}   