import Tabbar from "@/app/components/shared/Tabbar/Tabbar";
import './ToExamine.css';
import PopupHistory from "../HistoryOfEx/PopupHistory";

export default function Patient() {
    return (
        <>
            <Tabbar
                tabbarItems={{
                    tabbarItems: [
                        { text: 'Thông tin bệnh nhân', link: '/Doctor/Patient/ToExamine' },
                        { text: 'Tạo kết quả', link: '/Doctor/Patient/ToExamine/CreateResults' },
                    ],
                }}
            />
            <div className="ToExamine-container">
                <h1 className="ToExamine-container__title">Thông tin bênh nhân</h1>
                <table className="ToExamine-container__table">
                    <tbody>
                        <tr><td>Ngày khám</td><td>20/02/2005</td></tr>
                        <tr><td>Số thứ tự</td><td>1</td></tr>
                        <tr><td>Họ và tên</td><td>Lý Văn Đền</td></tr>
                        <tr><td>Giới tính</td><td>Nam</td></tr>
                        <tr><td>Ngày sinh</td><td>16/08/1998</td></tr>
                        <tr><td>Số điện thoại</td><td>0987785432</td></tr>
                        <tr><td>Số CCCD</td><td>0810205013878</td></tr>
                        <tr><td>SĐT người thân</td><td>0977567891</td></tr>
                        <tr><td>Số BHYT</td><td>BHYT19001999</td></tr>
                        <tr><td>Địa chỉ</td><td>403, ấp Mỹ Điền, xã Long Hựu, huyện Cần Đước, tỉnh Long An</td></tr>
                        <tr><td>Lịch sử bệnh</td><td>Suy tim, ho lao, sỏi thận, suy hô hấp</td></tr>
                        <tr>
                            <td>Lịch sử khám tại đây</td>
                            <td><PopupHistory /></td>

                        </tr>
                    </tbody>
                </table>

            </div>
        </>
    )
}