// 'use client'
// import React, { useState } from 'react'; // Import useState
// import MedicineFees from '../../../../../../../Cashier/ComponentCashier/MedicineFees';
// import ParaclinicalPayment from '../../../../../../../Cashier/ComponentCashier/ParaclinicalPayment'; // Import the new component
// import './PrescriptionForm.css'; // Make sure to include this CSS for modal styling

// export default function HomePage() {
//     const [isMedicineFeesOpen, setIsMedicineFeesOpen] = useState(false); // State to control MedicineFees modal visibility
//     const [isParaclinicalPaymentOpen, setIsParaclinicalPaymentOpen] = useState(false); // State to control ParaclinicalPayment modal visibility

//     const handleOpenMedicineFees = () => {
//         setIsMedicineFeesOpen(true);
//     };

//     const handleCloseMedicineFees = () => {
//         setIsMedicineFeesOpen(false);
//     };

//     const handleOpenParaclinicalPayment = () => {
//         setIsParaclinicalPaymentOpen(true);
//     };

//     const handleCloseParaclinicalPayment = () => {
//         setIsParaclinicalPaymentOpen(false);
//     };

//     return (
//         <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//             <h1>Trang chủ Bệnh viện</h1> {/* Thêm tiêu đề trang để rõ ràng hơn */}

//             <button
//                 onClick={handleOpenMedicineFees}
//                 style={{
//                     padding: '10px 20px',
//                     backgroundColor: '#007bff',
//                     color: 'white',
//                     border: 'none',
//                     borderRadius: '5px',
//                     cursor: 'pointer',
//                     marginBottom: '20px', // Khoảng cách giữa các nút
//                     marginRight: '10px' // Khoảng cách giữa nút này và nút tiếp theo
//                 }}
//             >
//                 Xem Phiếu Thu Tiền Thuốc
//             </button>

//             <button
//                 onClick={handleOpenParaclinicalPayment}
//                 style={{
//                     padding: '10px 20px',
//                     backgroundColor: '#28a745', // Màu khác để dễ phân biệt
//                     color: 'white',
//                     border: 'none',
//                     borderRadius: '5px',
//                     cursor: 'pointer',
//                     marginBottom: '20px'
//                 }}
//             >
//                 Xem Giấy Xác nhận Thanh toán Xét nghiệm
//             </button>

//             {/* Render the MedicineFees component */}
//             <MedicineFees
//                 isOpen={isMedicineFeesOpen}
//                 onClose={handleCloseMedicineFees}
//             />

//             {/* Render the ParaclinicalPayment component */}
//             <ParaclinicalPayment
//                 isOpen={isParaclinicalPaymentOpen}
//                 onClose={handleCloseParaclinicalPayment}
//             />
//         </div>
//     );
// }