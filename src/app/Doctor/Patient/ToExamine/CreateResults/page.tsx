import Tabbar from "@/app/components/shared/Tabbar/Tabbar";

export default function Patient(){
    return(
        <>
                  <Tabbar
                    tabbarItems={{
                      tabbarItems: [
                        { text: 'Thông tin bệnh nhân', link: '/Doctor/Patient/ToExamine' },
                        { text: 'Tạo kết quả', link: '/Doctor/Patient/ToExamine/CreateResults' },
                      ],
                    }}
                  />
        </>
    )
}