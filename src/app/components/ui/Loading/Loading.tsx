// app/components/LoadingSpinner.tsx
'use client';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  fullscreen?: boolean;
  text?: string;
}

export default function LoadingSpinner({ fullscreen = false, text = 'Đang tải dữ liệu...' }: LoadingSpinnerProps) {
  return (
    <div
      className={`flex items-center justify-center ${fullscreen ? 'min-h-screen' : 'py-4'}`}
    >
      <motion.div
        className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, ease: 'linear', duration: 1 }}
      />
      {text && (
        <span className="ml-4 text-blue-600 dark:text-blue-400 font-medium animate-pulse">
          {text}
        </span>
      )}
    </div>
  );
}
