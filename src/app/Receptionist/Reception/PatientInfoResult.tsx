'use client';

import { codeScanningInformationType } from '@/app/types/patientTypes/patient';
import React from 'react';


const PatientInfoResult = ({ data, onNext }: {data:codeScanningInformationType, onNext:()=>void}) => {
  return (
    <div>
      <table className="w-full border border-gray-300 rounded overflow-hidden">
        <tbody>
          <Row label="Họ và tên" value={data.name || 'Chưa có dữ liệu'} />
          <Row label="Giới tính" value={data.sex  || 'Chưa có dữ liệu'} />
          <Row label="Ngày sinh" value={data.dateOfBirth  || 'Chưa có dữ liệu'} />
          <Row label="Số CCCD" value={data.CCCDNumber  || 'Chưa có dữ liệu'} />
          <Row label="Địa chỉ" value={data.address  || 'Chưa có dữ liệu'} />
        </tbody>
      </table>

      <div className="mt-6 flex justify-end gap-4">
        <button
          onClick={onNext}
          className="px-6 py-2 bg-[#3497F9] text-white rounded hover:bg-blue-700"
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <tr className="border-t" style={{ borderTopColor: '#D9D9D9' }}>
    <td className="px-4 py-2 font-medium w-1/4	text-black">{label}</td>
    <td className="px-4 py-2 text-[#595959]">{value}</td>
  </tr>
);

export default PatientInfoResult;
