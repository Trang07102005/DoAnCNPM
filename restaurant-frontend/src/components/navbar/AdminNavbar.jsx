// Các import như cũ
import {
    faArrowLeft,
    faArrowRight,
    faGear,
    faMagnifyingGlass,
    faTableColumns,
    faRightFromBracket,
    faUser,
  } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import React, { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import UserManagement from "../../pages/Admin/UserManagement";
  import AdminDashboard from "../../pages/Admin/AdminDashboard";
import RoleManagement from "../../pages/Admin/RoleManagement";
import AdminGalleryManagement from "../../pages/Admin/AdminGalleryManagement";
  
  const AdminNavbar = ({ onLogout }) => {
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
        icon: <FontAwesomeIcon icon={faUser} />,
        key: "user",
      },
      {
        title: "Quản Lý Phân Quyền",
        icon: <FontAwesomeIcon icon={faGear} />,
        key: "role",
      },
      {
        title: "Quản Lý Thư Viện",
        icon: <FontAwesomeIcon icon={faGear} />,
        key: "gallery",
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
  } bg-zinc-900 min-h-screen pt-8 relative duration-300 ease-in-out select-none`}
>
          {/* Toggle */}
  <div
    className={`absolute cursor-pointer -right-4 top-9 w-8 h-8 p-0.5 bg-zinc-50 border-zinc-50 border-2 rounded-full text-xl flex items-center justify-center
      ${!open && "rotate-180"}
      transition-transform duration-300 ease-in-out
    `}
    onClick={() => setOpen(!open)}
  >
    {open ? (
      <FontAwesomeIcon icon={faArrowRight} className="text-pnik-700" />
    ) : (
      <FontAwesomeIcon icon={faArrowLeft} className="text-pink-700" />
    )}
  </div>

  
           {/* Logo */}
  <div className="flex gap-x-4 items-center mb-6">
    <img
      src="https://cdn.pixabay.com/photo/2017/02/18/19/20/logo-2078018_640.png"
      alt="logo"
      className={`w-10 h-10 rounded-full object-cover cursor-pointer transition-transform duration-700 ${
        open ? "rotate-[360deg]" : "rotate-0"
      }`}
    />
    <h1
      className={`text-zinc-50 origin-left font-bold text-xl transition-all duration-300 ${
        !open && "scale-0"
      }`}
    >
      Admin Dashboard
    </h1>
  </div>

  
          {/* Menu */}
          <ul className="pt-6 space-y-4">
  {Menus.map((Menu, index) => (
    <li
      key={index}
      className={`flex items-center gap-3 rounded-md py-3 px-4 cursor-pointer truncate border-l-4
        transition-colors duration-300 select-none
        ${
          selectedPage === Menu.key
            ? "border-pink-600 text-pink-600 font-semibold"
            : " hover:text-pink-500 hover:border-pink-500"
        }
        ${open ? "justify-start" : "justify-center"}
      `}
      onClick={() => setSelectedPage(Menu.key)}
    >
      <span
        className={`text-lg flex-shrink-0
          ${
            selectedPage === Menu.key ? "text-pink-600" : "text-gray-400"
          }
        `}
      >
        {Menu.icon}
      </span>
      <span
        className={`flex-1 truncate transition-all duration-300 ${
          !open ? "hidden" : ""
        }`}
      >
        {Menu.title}
      </span>
    </li>
  ))}
</ul>

  
           {/* Log out */}
  <div className="absolute bottom-6 left-0 w-full px-4">
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-x-3 text-zinc-50 hover:bg-red-700 transition-colors duration-300 py-3 px-4 rounded-md font-semibold select-none"
    >
      <FontAwesomeIcon icon={faRightFromBracket} className="text-lg" />
      <span className={`${!open && "hidden"} transition-all duration-300`}>
        Đăng Xuất
      </span>
    </button>
  </div>
</div>
  
        {/* Main dashboard area */}
        <div className="h-screen flex-1 bg-zinc-100 flex flex-col overflow-hidden">
  {/* Topbar */}
  <div className="w-full h-[8ch] px-12 bg-white shadow flex items-center justify-between">
  <div className="text-2xl font-bold">
    <span className="text-orange-300">VIET</span>
    <span className="text-gray-800">TAURANT</span>
  </div>
    {/* Search bar */}
    <div className="w-96 h-11 border border-zinc-300 rounded-full flex items-center overflow-hidden">
      <input
        type="text"
        placeholder="Search..."
        className="flex-1 h-full px-4 bg-white outline-none border-none text-sm"
      />
      <button className="px-4 h-full flex items-center justify-center text-zinc-600 border-l border-zinc-300">
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </button>
    </div>

    {/* Right section */}
    <div className="flex items-center gap-x-6">
      <div className="text-zinc-800 text-base font-medium">
        Welcome, {localStorage.getItem("username")}
      </div>
      <img
        src="https://static.vecteezy.com/system/resources/thumbnails/009/636/683/small_2x/admin-3d-illustration-icon-png.png"
        alt="profile"
        className="w-11 h-11 rounded-full object-cover"
      />
    </div>
  </div>

  {/* Page content */}
  <div className="flex-1 overflow-y-auto px-12 py-6">
    {selectedPage === "dashboard" && <AdminDashboard />}
    {selectedPage === "user" && <UserManagement />}
    {selectedPage === "role" && <RoleManagement />}
    {selectedPage === "gallery" && <AdminGalleryManagement />}
  </div>
</div>

      </div>
    );
  };
  
  export default AdminNavbar;
  