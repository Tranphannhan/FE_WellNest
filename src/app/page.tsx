import Navbar from "./components/shared/Navbar/Navbar";


export default function Home() {
  return (
    <Navbar 
      conTentNavigation = {
        {
          logo:'./images/logoWebsite.png',
          navItems:[
            {icon:`bi bi-file-earmark-text-fill`,text:"Trag chủ", link:'https://media-cdn-v2.laodong.vn/storage/newsportal/2024/7/16/1367312/Benh-Vien-Tam-Anh-3.jpeg'}
          ]
        }
      }
    >

    </Navbar>
  )
}
