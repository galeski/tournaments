import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <AuthProvider>
      <Toaster />
      <div className="w-full p-6">
        <Navbar />
        <Outlet />
      </div>
    </AuthProvider>
  );
};
export default App;
