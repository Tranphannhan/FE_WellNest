import Tabbar from "@/app/components/shared/Tabbar/Tabbar";

export default function InputForm() {
    return (
        <>
        <Tabbar
            tabbarItems={
                { 
                    tabbarItems:[
                    {text: 'Quét mã QR', link: '/Receptionist/Reception/ScanQRCode'},
                    {text: 'Nhập thủ công', link: '/Receptionist/Reception/InputForm'}
                ]
            }
               
            }
        ></Tabbar>
            <div className="input-form">
                <h1>Input Form</h1>
                <form>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" required />
                    
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" required />
                    
                    <button type="submit">Submit</button>
                </form>
            </div>
        </>
    );
}