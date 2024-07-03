import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <div className="w-full p-6">
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    </AuthProvider>
  );
};
export default App;
