import React, { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark",
  );

  const { user, token, logout } = useAuthStore();

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
  };

  const handleThemeToggle = () => {
    const newTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(
    () =>
      document.documentElement.setAttribute(
        "data-theme",
        localStorage.getItem("theme") || "dark",
      ),
    [],
  );
  return (
    <nav className="w-full h-16 bg-base-200 flex justify-between items-center px-6 rounded-b-lg">
      <span
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        ApplyTrack
      </span>
      <div className="flex items-center justify-between gap-2">
        <SunIcon />
        <input
          type="checkbox"
          className="toggle toggle-sm"
          onChange={handleThemeToggle}
          checked={isDark}
        />
        <MoonIcon />

        {token && (
          <div className="flex items-center justify-center text-center m-3 gap-2">
            <button className="btn btn-error btn-sm" onClick={handleLogout}>
              Logout
            </button>

            <span className="text-sm btn-sm cursor-default text-center justify-center items-center btn btn-success">
              {user?.name}
            </span>

          </div>
        )}
            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate(token ? "/dashboard" : "/login")}
            >
              {token ? "Dashboard" : "Login"}
            </button>
      </div>
    </nav>
  );
};

export default Navbar;
