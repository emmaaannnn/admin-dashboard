import { RouterProvider } from "react-router-dom";
import AdminSessionProvider from "./providers/AdminSessionProvider";
import router from "./router";

function App() {
  return (
    <AdminSessionProvider>
      <RouterProvider router={router} />
    </AdminSessionProvider>
  );
}

export default App;