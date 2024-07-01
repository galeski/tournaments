import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";


export default function Navbar() {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isLoggedIn, handleLogin, handleLogout } = useAuthContext();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isLoggedIn) {
      handleLogin(token);
    }
    if (!token && !isLoggedIn) {
      handleLogout();
      // navigate('/login');
    }
  }, [isLoggedIn, handleLogin, handleLogout]);

  // const handleLogout = () => {
  //   localStorage.removeItem('token');
  //   // setIsLoggedIn(false);
  //   isLoggedIn = false;
  //   
  // };

  return (
    <div>
      <nav className="flex justify-between items-center mb-6">
        <NavLink to="/">
          {/* <img alt="Tournaments logo" className="h-10 inline" src=""></img> */}
          Tournaments
        </NavLink>

        {isLoggedIn ? (
          <div className="flex space-x-2">
            <NavLink 
              className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3" 
              to="/create"
            >
              Create Tournament
            </NavLink>
            <NavLink 
              className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3" 
              to="/answers"
            >
              Answers
            </NavLink>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
            >
              Logout
            </button>
          </div>
        ) : (
          <NavLink 
            className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3" 
            to="/login"
          >
            Login
          </NavLink>
        )}
      </nav>
    </div>
  );
}