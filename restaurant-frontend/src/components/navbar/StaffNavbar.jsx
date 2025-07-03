// Các import như cũ
import {
    faArrowLeft,
    faArrowRight,
    faGear,
    faMagnifyingGlass,
    faTableColumns,
    faRightFromBracket,
  } from "@fortawesome/free-solid-svg-icons";
  import { faRocketchat } from "@fortawesome/free-brands-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import React, { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import UserManagement from "../../pages/Admin/UserManagement";
  import AdminDashboard from "../../pages/Admin/AdminDashboard";
import RoleManagement from "../../pages/Admin/RoleManagement";
  
  const StaffNavbar = ({ onLogout }) => {
    const [selectedPage, setSelectedPage] = useState("dashboard");
    const navigate = useNavigate();
    const [open, setOpen] = useState(true);
  
    const Menus = [
      {
        title: "Dashboard",
        icon: <FontAwesomeIcon icon={faTableColumns} />,
        key: "dashboard",
      },
      {
        title: "Quản Lý Tài Khoản",
        icon: <FontAwesomeIcon icon={faRocketchat} />,
        key: "user",
      },
      {
        title: "Quản Lý Phân Quyền",
        icon: <FontAwesomeIcon icon={faGear} />,
        key: "role",
      },
    ];
  
    const handleLogout = () => {
      localStorage.clear();
      onLogout();
      navigate("/");
    };
  
    return (
      <div className="w-full flex">
        {/* Sidebar */}
        <div
          className={`${
            open ? "w-72 p-5" : "w-20 p-4"
          } bg-zinc-900 h-screen pt-8 relative duration-300 ease-in-out`}
        >
          {/* Toggle */}
          <div
            className={`absolute cursor-pointer -right-4 top-9 w-8 h-8 p-0.5 bg-zinc-50 border-zinc-50 border-2 rounded-full text-xl flex items-center justify-center ${
              !open && "rotate-180"
            } transition-all ease-in-out duration-300`}
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <FontAwesomeIcon icon={faArrowRight} />
            ) : (
              <FontAwesomeIcon icon={faArrowLeft} />
            )}
          </div>
  
          {/* Logo */}
          <div className="flex gap-x-4 items-center">
            <img
              src="https://cdn.pixabay.com/photo/2017/02/18/19/20/logo-2078018_640.png"
              alt="logo"
              className={`w-10 h-10 rounded-full object-cover cursor-pointer transition-all duration-300 ${
                open && "rotate-[360deg]"
              }`}
            />
            <h1
              className={`text-zinc-50 origin-left font-semibold text-xl transition-all ${
                !open && "scale-0"
              }`}
            >
              Staff Dashboard
            </h1>
          </div>
  
          {/* Menu */}
          <ul className="pt-6 space-y-0.5">
            {Menus.map((Menu, index) => (
              <li
                key={index}
                className={`flex items-center gap-3 rounded-md py-3 px-4 cursor-pointer text-zinc-50 hover:bg-zinc-800/50 transition-all duration-300 ${
                  selectedPage === Menu.key ? "bg-zinc-800/40" : ""
                }`}
                onClick={() => setSelectedPage(Menu.key)}
              >
                <span className="text-lg">{Menu.icon}</span>
                <span className={`${!open && "hidden"} transition-all`}>
                  {Menu.title}
                </span>
              </li>
            ))}
          </ul>
  
          {/* Log out */}
          <div className="absolute bottom-6 left-0 w-full px-4 hover:bg-red-500">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-x-3 text-zinc-50 hover:bg-zinc-800/50 transition-all py-3 px-4 rounded-md"
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="text-lg" />
              <span className={`${!open && "hidden"} transition-all duration-300`}>
                Log out
              </span>
            </button>
          </div>
        </div>
  
        {/* Main dashboard area */}
        <div className="h-screen flex-1 bg-zinc-100 space-y-6">
          {/* Topbar */}
          <div className="w-full h-[8ch] px-12 bg-zinc-50 shadow-md flex items-center justify-between">
            <div className="w-96 border border-zinc-300 rounded-full h-11 flex items-center justify-center">
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 h-full rounded-full outline-none border-none bg-zinc-50 px-4"
              />
              <button className="px-4 h-full flex items-center justify-center text-base text-zinc-600 border-l border-zinc-300">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </div>
  
            <div className="flex items-center gap-x-8">
                <div className="text-black text-lg font-medium">
                    Welcome, {localStorage.getItem("username")}
                </div>

                <img
                    src="https://static.vecteezy.com/system/resources/thumbnails/009/636/683/small_2x/admin-3d-illustration-icon-png.png"
                    alt="profile"
                    className="w-11 h-11 rounded-full object-cover cursor-pointer"
                />
                </div>

          </div>
  
          {/* Page content */}
          <div className="w-full px-12">
            {selectedPage === "dashboard" && <h1>Dashboard</h1>}
            {selectedPage === "user" && <h1>Dashboard</h1>}
            {selectedPage === "role" && <h1>Dashboard</h1>}
          </div>
        </div>
      </div>
    );
  };
  
  export default StaffNavbar;
  