import { Outlet } from "react-router-dom";
import AdminShellProvider from "../../../app/providers/AdminShellProvider";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import "./AdminShell.css";

function AdminAppShell() {
  return (
    <AdminShellProvider>
      <main className="admin-shell">
        <AdminSidebar />

        <div className="admin-content">
          <AdminHeader />
          <div className="admin-workspace">
            <section className="admin-main">
              <Outlet />
            </section>
          </div>
        </div>
      </main>
    </AdminShellProvider>
  );
}

export default AdminAppShell;