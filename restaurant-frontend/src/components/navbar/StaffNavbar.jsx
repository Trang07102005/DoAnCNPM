// Các import như cũ

import {
  faArrowLeft,
  faArrowRight,
  faMagnifyingGlass,
  faMoneyBill,
  faRightFromBracket,
  faTableColumns,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StaffOrderFlow from "../../pages/Staff/StaffOrderFlow";
import StaffDashboard from "../../pages/Staff/StaffDashboard";

const StaffNavbar = ({ onLogout }) => {

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
    key: "order-management",
    title: "Quản Lý Order",
    icon: <FontAwesomeIcon icon={faUser} />,
  },
  {
    key: "report-statistics",
    title: "Báo Cáo Thống Kê",
    icon: <FontAwesomeIcon icon={faMoneyBill} />,
    children: [
      { key: "table-report", title: "Báo Cáo Bàn Đặt" },
      { key: "best-seller-report", title: "Báo Cáo Món Bán Chạy" },
      { key: "best-seller-report", title: "áđâsđá" },
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
          onClick={() => {
            setOpen((prev) => {
              const next = !prev;
              if (!next) setExpandedMenu(null); // 🔒 đóng submenu khi sidebar thu gọn
              return next;
            });
          }}
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
            src="https://cdn-icons-png.freepik.com/512/190/190671.png"
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
          <div key={index}>
            <li
              className={`flex items-center gap-3 rounded-md py-3 px-4 cursor-pointer truncate
                transition-colors duration-300 select-none
                ${
                  selectedPage === Menu.key
                    ? "text-yellow-600 font-semibold"
                    : "text-gray-400 hover:text-yellow-500"
                }
                ${open ? "justify-start" : "justify-center"}
              `}
              onClick={() => {
                if (Menu.children) {
                  setOpen(true);
                  setExpandedMenu(expandedMenu === Menu.key ? null : Menu.key);
                } else {
                  setSelectedPage(Menu.key);
                  setExpandedMenu(null);
                }
              }}
            >
              <span
                className={`text-lg flex-shrink-0 ${
                  selectedPage === Menu.key ? "text-yellow-600" : "text-gray-400"
                }`}
              >
                {Menu.icon}
              </span>
              <span className={`${!open && "hidden"} transition-all`}>
                {Menu.title}
              </span>
              {Menu.children && (
                <span className="ml-auto">{expandedMenu === Menu.key ? "▾" : "▸"}</span>
              )}
            </li>

      {/* Submenu */}
      {Menu.children && expandedMenu === Menu.key && (
        <ul className="ml-8 mt-1 space-y-3">
          {Menu.children.map((child, i) => (
            <li
              key={i}
              className={`py-2 px-3 rounded-md cursor-pointer truncate border-l-4
                transition-colors duration-300 select-none
                ${
                  selectedPage === child.key
                    ? "border-yellow-600 text-yellow-600 font-semibold"
                    : "border-gray-400 text-gray-400 hover:text-yellow-500 hover:border-yellow-500"
                }
              `}
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
        <div className="absolute bottom-6 left-0 w-full px-4 ">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-x-3 text-zinc-50 hover:bg-zinc-800/50 transition-all py-3 px-4 rounded-md "
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="text-lg" />
            <span className={`${!open && "hidden"} transition-all duration-300 `}>
              Đăng Xuất
            </span>
          </button>
        </div>
      </div>

      {/* Main dashboard area */}
      <div className="h-screen flex-1 bg-zinc-100 flex flex-col overflow-hidden space-y-6">

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
              Welcome, <span className="text-red-500 font-bold">{localStorage.getItem("username")}</span>
              </div>

              <img
                  src="https://cdn-icons-png.flaticon.com/512/6200/6200100.png"
                  alt="profile"
                  className="w-11 h-11 rounded-full object-cover cursor-pointer"
              />
              </div>

        </div>

       {/* Page content */}
<div className="flex-1 overflow-y-auto px-12 pb-12">
  <h1 className="text-xl font-semibold mt-6 mb-6">
    {{
      dashboard: "Trang Dashboard",
      "order-management": "Quản Lý Order",
      "table-report": "Báo Cáo Bàn Đặt",
      "best-seller-report": "Báo Cáo Món Bán Chạy",
    }[selectedPage] || "Trang"}
  </h1>

  {/* Render nội dung theo selectedPage */}
  {selectedPage === "dashboard" && <StaffDashboard />}
  {selectedPage === "order-management" && <StaffOrderFlow />}
  {selectedPage === "table-report" && (
    <div className="text-gray-600 italic">Nội dung báo cáo bàn đặt đang được phát triển...</div>
  )}
  {selectedPage === "best-seller-report" && (
    <div className="text-gray-600 italic">Nội dung báo cáo món bán chạy đang được phát triển...</div>
  )}
</div>


      </div>
    </div>
  );
};

export default StaffNavbar;
