import { createContext, useContext, useEffect, useMemo, useState } from "react";
import mockAdminUser from "../../data/mock/adminUser";

const STORAGE_KEY = "oxace-admin-session";

const AdminSessionContext = createContext(null);


function AdminSessionProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    setIsAuthenticated(storedValue === "active");
    setIsHydrated(true);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      isHydrated,
      adminUser: isAuthenticated ? mockAdminUser : null,
      login: ({ email, password }) => {
        const hasValidCredentials =
          email.trim().toLowerCase() === mockAdminUser.email.toLowerCase() &&
          password === mockAdminUser.password;

        if (!hasValidCredentials) {
          return false;
        }

        window.localStorage.setItem(STORAGE_KEY, "active");
        setIsAuthenticated(true);
        return true;
      },
      logout: () => {
        window.localStorage.removeItem(STORAGE_KEY);
        setIsAuthenticated(false);
      },
    }),
    [isAuthenticated, isHydrated]
  );

  return (
    <AdminSessionContext.Provider value={value}>
      {children}
    </AdminSessionContext.Provider>
  );
}

export function useAdminSession() {
  const context = useContext(AdminSessionContext);

  if (!context) {
    throw new Error("useAdminSession must be used within AdminSessionProvider");
  }

  return context;
}

export default AdminSessionProvider;