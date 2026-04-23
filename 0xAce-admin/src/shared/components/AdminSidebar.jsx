import { NavLink } from "react-router-dom";
import adminNavigation from "../config/adminNavigation";
import "./styles/AdminSidebar.css";

function SidebarIcon({ path }) {
  return (
    <span className="sidebar-link__icon" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path
          d={path}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__inner">
        <div className="sidebar-brand">
          <div className="sidebar-brand__logo-frame">
            <img src="/0xACElogo.png" alt="0xAce" className="sidebar-brand__logo" />
          </div>
          <div className="sidebar-brand__copy">
            <h2>0xACE</h2>
            <span>Admin</span>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Admin navigation">
          {adminNavigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-link${isActive ? " is-active" : ""}`
              }
            >
              <SidebarIcon path={item.iconPath} />
              <span className="sidebar-link__label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}

export default AdminSidebar;