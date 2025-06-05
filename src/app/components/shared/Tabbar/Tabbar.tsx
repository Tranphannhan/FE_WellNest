export default function Tabbar() {
    return (
        <div className="Tabbar">
            <div className="Tabbar__item">
                <i className="bi bi-house"></i>
                <span className="Tabbar__item__text">Home</span>
            </div>
            <div className="Tabbar__item">
                <i className="bi bi-calendar"></i>
                <span className="Tabbar__item__text">Schedule</span>
            </div>
            <div className="Tabbar__item">
                <i className="bi bi-person"></i>
                <span className="Tabbar__item__text">Profile</span>
            </div>
            <div className="Tabbar__item">
                <i className="bi bi-gear"></i>
                <span className="Tabbar__item__text">Settings</span>
            </div>
        </div>
    )
}