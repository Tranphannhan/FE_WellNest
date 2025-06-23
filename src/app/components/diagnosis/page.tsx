// 'use client';

// import React, { useState } from 'react';
// import DiagnosisPopup from './DiagnosisPopup';

// export default function DiagnosisPage() {
//   const [showPopup, setShowPopup] = useState(false);

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold text-center mb-6">Trang chuẩn đoán bệnh</h1>

//       <div className="flex justify-center">
//         <button
//           onClick={() => setShowPopup(true)}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
//         >
//           Xem chi tiết
//         </button>
//       </div>

//       {showPopup && (
//         <DiagnosisPopup id="68592939bdd3a1f09a7874c0" onClose={() => setShowPopup(false)} />
//       )}
//     </div>
//   );
// }
