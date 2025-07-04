import { BiSolidDashboard, BiSolidGroup } from "react-icons/bi";
import { MdAdminPanelSettings, MdOutlineManageAccounts, MdOutlineReceiptLong, MdPeopleAlt, MdReceiptLong } from "react-icons/md";
import { FaClipboardList, FaHouseChimneyMedical, FaHouseMedicalCircleExclamation, FaUserDoctor } from 'react-icons/fa6';
import { GiMedicines } from 'react-icons/gi';
import { LuLayoutDashboard, LuStethoscope } from "react-icons/lu";
import { IoPricetagsOutline, IoSettingsSharp } from "react-icons/io5";
import { BsHousesFill } from 'react-icons/bs';
import { TbMicroscope } from 'react-icons/tb';
import { ImPriceTags } from "react-icons/im";
import { CiViewList } from "react-icons/ci";
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
        segment: 'Examination', // ✅ chỉ phần tiếp theo
        title: 'Phiếu khám',
        icon: <LuLayoutDashboard />,
      },
      {
        segment: 'DonThuoc', // ✅ KHÔNG lặp lại "Admin/Dashboard"
        title: 'Đơn thuốc',
        icon: <LuLayoutDashboard />,
      },
      {
        segment: 'Testing',
        title: 'Xét nghiệm',
        icon: <LuLayoutDashboard />,
      },
    ],
  },

  {
    segment: 'Admin/HumanResources',
    title: 'Nhân sự',
    icon: <MdPeopleAlt />,
    children: [
      { segment: 'Doctor', title: 'Bác sĩ', icon: <FaUserDoctor /> },
      { segment: 'Staff', title: 'Nhân viên', icon: <BiSolidGroup /> },
    ],
  },
  {
    segment: 'Admin/Rooms',
    title: 'Phòng',
    icon: <BsHousesFill />,
    children: [
      { segment: 'Clinic', title: 'Phòng khám', icon: <FaHouseChimneyMedical /> },
      { segment: 'TestingRoom', title: 'Phòng xét nhiệm', icon: <FaHouseMedicalCircleExclamation /> },
    ],
  },
  {
    segment: 'Admin/List',
    title: 'Danh mục',
    icon: <FaClipboardList />,
    children: [
      { segment: 'AccountType', title: 'Loại tài khoản', icon: <MdOutlineManageAccounts /> },
      { segment: 'TestType', title: 'Loại xét nghiệm', icon: <TbMicroscope /> },
      { segment: 'DepartmentType', title: 'Loại khoa', icon: <LuStethoscope /> },
    ],
  },
  {
    segment: 'Admin/price',
    title: 'Giá dịch vụ',
    icon: <ImPriceTags />,
    children: [
      { segment: 'AxaminationPrice', title: 'Giá khám', icon: <IoPricetagsOutline /> },
      { segment: 'TestPrice', title: 'Giá xét nghiệm', icon: <IoPricetagsOutline /> },
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
    segment: 'Admin/Medicine',
    title: 'Thuốc',
    icon: <GiMedicines />,
    children: [
      { segment: 'Medicine', title: 'Thuốc', icon: <GiMedicines /> },
      { segment: 'DrugGroup', title: 'Loại thuốc', icon: <CiViewList /> },
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