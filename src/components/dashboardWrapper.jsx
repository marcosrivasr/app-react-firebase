import { Link } from "react-router-dom";
import style from "./dashboardWrapper.module.css";

export default function dashboardWrapper({ children }) {
  return (
    <div>
      <nav className={style.nav}>
        <div className={style.logo}>Logotipo</div>
        <Link to="/dashboard">Links</Link>

        <Link to="/dashboard/profile">Profile</Link>

        <Link to="/signout">Sign out</Link>
      </nav>

      <div className="main-container">{children}</div>
    </div>
  );
}
