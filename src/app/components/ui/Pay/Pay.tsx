'use client';
import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

const paymentMethods = [
  {
    id: 'cash',
    label: 'Tiền mặt',
    value: 'Cash',
    icon: '/images/IconTienMat-removebg-preview.png', // ảnh ví tiền
  },
  {
    id: 'momo',
    label: 'MoMo',
    value: 'transfer',
    icon: '/images/MomoIcon-removebg-preview.png', // ảnh logo MoMo
  },
];

export default function PaymentMethodSelector({
  callBack,
}: {
  callBack: (value: string) => void;
}) {
  const [selected, setSelected] = useState<string>('cash');

  return (
    <div className="grid gap-2">
      <div className="grid grid-cols-2 gap-4">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => {
              setSelected(method.id);
              callBack(method.value);
            }}
            className={`relative border rounded-2xl p-3 flex flex-col items-center justify-center gap-2 transition duration-200 shadow-sm hover:shadow-md
              ${
                selected === method.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 bg-white'
              }`}
          >
            <Image
              src={method.icon}
              alt={method.label}
              width={50}
              height={50}
              className="object-contain"
            />
            <span className="text-sm font-medium">{method.label}</span>
            {selected === method.id && (
              <CheckCircle2 className="text-blue-500 absolute top-2 right-2 w-5 h-5" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
