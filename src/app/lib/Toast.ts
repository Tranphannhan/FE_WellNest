import { toast, Bounce } from 'react-toastify';

// Định nghĩa kiểu enum cho toast
export enum ToastType {
  success = "success",
  error = "error",
  warn = "warn",
  info = "info"
}


// Hàm Toast sử dụng enum
export function showToast(content: string, type: ToastType) {
  toast[type](content, {
    position: "top-right",
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  });
}
