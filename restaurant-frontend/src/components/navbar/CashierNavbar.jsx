// Các import như cũ
import { faRocketchat } from "@fortawesome/free-brands-svg-icons";
import {
    faArrowLeft,
    faArrowRight,
    faGear,
    faMagnifyingGlass,
    faRightFromBracket,
    faTableColumns,
  } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import React, { useState } from "react";
  import { useNavigate } from "react-router-dom";

  
  const CashierNavbar = ({ onLogout }) => {

const [expandedMenu, setExpandedMenu] = useState(null);
    const [selectedPage, setSelectedPage] = useState("dashboard");
    const navigate = useNavigate();
    const [open, setOpen] = useState(true);
  
    const Menus = [
        {
          key: "dashboard",
          title: "Dashboard",
          icon: <FontAwesomeIcon icon={faTableColumns} />,
        },
        {
          key: "user-management",
          title: "Quản Lý Order",
          icon: <FontAwesomeIcon icon={faRocketchat} />,
          children: [
            { key: "users", title: "Quản Lý Hóa Đơn" },
            { key: "roles", title: "Quản Lý Đặt Bàn" },
          ],
        },
        {
          key: "settings",
          title: "Báo Cáo Và Thống Kê",
          icon: <FontAwesomeIcon icon={faGear} />,
          children: [
            { key: "users", title: "Báo Cáo Doanh Thu" },
            { key: "roles", title: "Báo Cáo Số Lượng Khách" },
            { key: "roles", title: "Báo Cáo Món Bán Chạy" },
          ],
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
              Admin Dashboard
            </h1>
          </div>
  
          {/* Menu */}
          <ul className="pt-6 space-y-0.5">
  {Menus.map((Menu, index) => (
    <div key={index}>
      <li
        className={`flex items-center gap-3 rounded-md py-3 px-4 cursor-pointer text-zinc-50 hover:bg-zinc-800/50 transition-all duration-300 ${
          selectedPage === Menu.key ? "bg-zinc-800/40" : ""
        }`}
        onClick={() => {
          if (Menu.children) {
            setExpandedMenu(expandedMenu === Menu.key ? null : Menu.key);
          } else {
            setSelectedPage(Menu.key);
            setExpandedMenu(null); // đóng dropdown khác
          }
        }}
      >
        <span className="text-lg">{Menu.icon}</span>
        <span className={`${!open && "hidden"} transition-all`}>
          {Menu.title}
        </span>
        {Menu.children && (
          <span className="ml-auto">{expandedMenu === Menu.key ? "▾" : "▸"}</span>
        )}
      </li>

      {/* Submenu */}
      {Menu.children && expandedMenu === Menu.key && (
        <ul className="ml-8 space-y-1">
          {Menu.children.map((child, i) => (
            <li
              key={i}
              className={`py-2 px-3 rounded-md cursor-pointer text-zinc-300 hover:bg-zinc-700/40 transition-all ${
                selectedPage === child.key ? "bg-zinc-800/30 text-white" : ""
              }`}
              onClick={() => setSelectedPage(child.key)}
            >
              {child.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  ))}
</ul>
  
          {/* Log out */}
          <div className="absolute bottom-6 left-0 w-full px-4">
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
                    src="https://cdn-icons-png.flaticon.com/512/6166/6166155.png"
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
  
  export default CashierNavbar;
  