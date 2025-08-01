// Các import như cũ

import {
  faArrowLeft,
  faArrowRight,
  faMagnifyingGlass,
  faMoneyBill,
  faRightFromBracket,
  faTableColumns,
  faUser,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import KitchenDashboard from "../../pages/Chef/KitchenDashboard";


const ChefNavbar = ({ onLogout }) => {

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
      key: "dish-orders",
      title: "Danh Sách Món Đặt",
      icon: <FontAwesomeIcon icon={faUser} />,
    },
    {
      key: "ingredients",
      title: "Danh Sách Nguyên Liệu",
      icon: <FontAwesomeIcon icon={faMoneyBill} />,
    },
    {
      key: "kitchen-report",
      title: "Báo Cáo Nhà Bếp",
      icon: <FontAwesomeIcon icon={faUtensils} />,
      children: [
        { key: "ingredient-report", title: "Báo Cáo Xuất Nhập Tồn" },
        { key: "dish-list-report", title: "Báo Cáo Danh Sách Món" },
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
            src="https://cdn-icons-png.flaticon.com/512/1377/1377199.png"
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
            Chef Dashboard
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
              setOpen(true); // 🟢 Mở sidebar nếu có submenu
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

      <div className="h-screen flex-1 bg-zinc-100 flex flex-col overflow-hidden">
  {/* Topbar */}
  <div className="w-full h-[8ch] px-12 bg-white shadow flex items-center justify-between">
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
    <h1 className="text-xl font-semibold mb-4">
      {{
        dashboard: "Trang Dashboard",
        "dish-orders": "Danh Sách Món Đặt",
        ingredients: "Danh Sách Nguyên Liệu",
        "ingredient-report": "Báo Cáo Xuất Nhập Tồn",
        "dish-list-report": "Báo Cáo Danh Sách Món",
      }[selectedPage] || "Trang"}
    </h1>

    {selectedPage === "dashboard" && <div>Nội dung dashboard...</div>}
    {selectedPage === "dish-orders" && <KitchenDashboard />}
    {selectedPage === "ingredients" && <div>Nội dung nguyên liệu...</div>}
    {selectedPage === "ingredient-report" && <div>Nội dung báo cáo xuất nhập tồn...</div>}
    {selectedPage === "dish-list-report" && <div>Nội dung báo cáo món...</div>}
  </div>
</div>

    </div>
  );
};

export default ChefNavbar;
