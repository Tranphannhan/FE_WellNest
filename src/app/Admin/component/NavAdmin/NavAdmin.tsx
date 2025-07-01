import { BiSolidDashboard, BiSolidGroup } from "react-icons/bi";
import { MdAdminPanelSettings, MdOutlineManageAccounts, MdOutlineReceiptLong, MdPeopleAlt, MdReceiptLong } from "react-icons/md";
import { FaClipboardList, FaHouseChimneyMedical, FaHouseMedicalCircleExclamation, FaUserDoctor } from 'react-icons/fa6';
import { GiMedicines } from 'react-icons/gi';
import { LuLayoutDashboard, LuStethoscope } from "react-icons/lu";
import { IoSettingsSharp } from "react-icons/io5";
import { BsHousesFill } from 'react-icons/bs';
import { TbMicroscope } from 'react-icons/tb';
import { RiMoneyDollarBoxFill, RiMoneyDollarBoxLine } from "react-icons/ri";
import type { Navigation } from '@toolpad/core/AppProvider';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Bệnh viện',
  },
  {
    segment: 'Admin/Dashboard', // ✅ Cha là Admin/Dashboard
    title: 'Thống kê',
    icon: <BiSolidDashboard />,
    children: [
      {
        segment: 'examination-statistics', // ✅ chỉ phần tiếp theo
        title: 'Phiếu khám',
        icon: <LuLayoutDashboard />,
      },
      {
        segment: 'DonThuoc', // ✅ KHÔNG lặp lại "Admin/Dashboard"
        title: 'Đơn thuốc',
        icon: <LuLayoutDashboard />,
      },
      {
        segment: 'test-statistics',
        title: 'Xét nghiệm',
        icon: <LuLayoutDashboard />,
      },
    ],
  },

  {
    segment: 'Admin/human-resources',
    title: 'Nhân sự',
    icon: <MdPeopleAlt />,
    children: [
      { segment: 'doctor', title: 'Bác sĩ', icon: <FaUserDoctor /> },
      { segment: 'staff', title: 'Nhân viên', icon: <BiSolidGroup /> },
    ],
  },
  {
    segment: 'Admin/room',
    title: 'Phòng',
    icon: <BsHousesFill />,
    children: [
      { segment: 'clinic', title: 'Phòng khám', icon: <FaHouseChimneyMedical /> },
      { segment: 'testing-room', title: 'Phòng xét nhiệm', icon: <FaHouseMedicalCircleExclamation /> },
    ],
  },
  {
    segment: 'Admin/list',
    title: 'Danh mục',
    icon: <FaClipboardList />,
    children: [
      { segment: 'account-type', title: 'Loại tài khoản', icon: <MdOutlineManageAccounts /> },
      { segment: 'test-type', title: 'Loại xét nghiệm', icon: <TbMicroscope /> },
      { segment: 'type-of-medicine', title: 'Loại thuốc', icon: <GiMedicines /> },
      { segment: 'department-type', title: 'Loại khoa', icon: <LuStethoscope /> },
    ],
  },
  {
    segment: 'Admin/price',
    title: 'Giá dịch vụ',
    icon: <RiMoneyDollarBoxFill />,
    children: [
      { segment: 'examination-invoice', title: 'Giá khám', icon: <RiMoneyDollarBoxLine /> },
      { segment: 'test-invoice', title: 'Giá xét nghiệm', icon: <RiMoneyDollarBoxLine /> },
    ],
  },
  {
    segment: 'Admin/bill',
    title: 'Hóa đơn',
    icon: <MdReceiptLong />,
    children: [
      { segment: 'examination-price', title: 'Khám', icon: <MdOutlineReceiptLong /> },
      { segment: 'medicine-price', title: 'Đơn thuốc', icon: <MdOutlineReceiptLong /> },
      { segment: 'test-price', title: 'Xét nghiệm', icon: <MdOutlineReceiptLong /> },
    ],
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Hệ thống',
  },
  {
    segment: 'role',
    title: 'Phân quyền',
    icon: <MdAdminPanelSettings />,
  },
  {
    segment: 'setting',
    title: 'Cài đặt',
    icon: <IoSettingsSharp />,
  },
];

export default NAVIGATION;