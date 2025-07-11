import {
  faArrowLeft,
  faArrowRight,
  faBowlFood,
  faChartSimple,
  faMagnifyingGlass,
  faMoneyBill,
  faRightFromBracket,
  faTableColumns,
  faToiletPaperSlash,
  faUser,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryManager from "../../pages/Manager/FoodCategoryManager/CategoryManager";
import FoodManager from "../../pages/Manager/foodManager/FoodManager";
import TableManager from "../../pages/Manager/Table/TableManager";
const ManagerNavbar = ({ onLogout }) => {
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
      key: "employee-management",
      title: "Quản Lý Nhân Viên",
      icon: <FontAwesomeIcon icon={faUser} />,
      children: [
        { key: "bill-management", title: "Quản Lý Hóa Đơn" },
        { key: "booking-management", title: "Quản Lý Đặt Bàn" },
      ],
    },
    {
      key: "expense-management",
      title: "Quản Lý Chi Tiêu",
      icon: <FontAwesomeIcon icon={faMoneyBill} />,
      children: [
        { key: "staff-cost", title: "Chi Phí Nhân Sự" },
        { key: "ingredient-cost", title: "Chi Phí Nguyên Liệu" },
        { key: "budget", title: "Quản Lý Ngân Sách" },
      ],
    },
    {
  key: "category-management",
  title: "Quản Lý Danh Mục",
  icon: <FontAwesomeIcon icon={faChartSimple} />,
},
    {
      key: "food-management",
      title: "Quản Lý Món Ăn",
      icon: <FontAwesomeIcon icon={faUtensils} />, // Sử dụng icon phù hợp cho món ăn
      children: [
        { key: "food-list", title: "Danh Sách Món Ăn" },
        { key: "food-list", title: "Chi Tiết Món Ăn" },
        { key: "food-report", title: "Báo Cáo Món Ăn" },
      ],
    },
    {
      key: "invoice-management",
      title: "Quản Lý Hóa Đơn",
      icon: <FontAwesomeIcon icon={faToiletPaperSlash} />,
    },
    {
      key: "ingredient-management",
      title: "Quản Lý Nguyên Liệu",
      icon: <FontAwesomeIcon icon={faBowlFood} />,
      children: [
        { key: "ingredient-info", title: "Xem Thông Tin NL" },
        { key: "inventory-report", title: "Báo Cáo Xuất Nhập Tồn Kho" },
        { key: "stock-tracking", title: "Theo Dõi Tồn Kho" },
      ],
    },
    {
      key: "time",
      title: "Quản Lý Ca Làm",
      icon: <FontAwesomeIcon icon={faChartSimple} />,
      children: [
        { key: "revenue-expense-report", title: "Báo Cáo Doanh Thu Và Chi Phí" },
        { key: "profit-report", title: "Báo Cáo Lợi Nhuận" },
      ],
    },
    {
      key: "statistics",
      title: "Báo Cáo Thống Kê",
      icon: <FontAwesomeIcon icon={faChartSimple} />,
      children: [
        { key: "revenue-expense-report", title: "Báo Cáo Doanh Thu Và Chi Phí" },
        { key: "profit-report", title: "Báo Cáo Lợi Nhuận" },
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
        className={`${open ? "w-72 p-5" : "w-20 p-4"} bg-zinc-900 h-screen pt-8 relative duration-300 ease-in-out`}
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
            src="https://cdn-icons-png.flaticon.com/512/1317/1317331.png"
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
            Manager Dashboard
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
                <span className={`${!open && "hidden"} transition-all`}>{Menu.title}</span>
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
            <span className={`${!open && "hidden"} transition-all duration-300`}>Đăng Xuất</span>
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
              Welcome, <span className="text-blue-500 font-bold">{localStorage.getItem("username")}</span>
            </div>
            <img
              src="https://cdn-icons-png.flaticon.com/512/4205/4205906.png"
              alt="profile"
              className="w-11 h-11 rounded-full object-cover cursor-pointer"
            />
          </div>
        </div>

        {/* Page content */}
        <div className="w-full px-12">
          {selectedPage === "dashboard" && <h1>Trang Dashboard</h1>}
          {selectedPage === "bill-management" && <h1>Quản Lý Hóa Đơn</h1>}
          {selectedPage === "booking-management" && <TableManager/>}
          {selectedPage === "staff-cost" && <h1>Chi Phí Nhân Sự</h1>}
          {selectedPage === "ingredient-cost" && <h1>Chi Phí Nguyên Liệu</h1>}
          {selectedPage === "budget" && <h1>Ngân Sách</h1>}
          {selectedPage === "category-management" && <CategoryManager />}
          {selectedPage === "food-list" && <FoodManager/>}
          {selectedPage === "add-food" && <h1>Thêm Món Ăn</h1>}
          {selectedPage === "food-report" && <h1>Báo Cáo Món Ăn</h1>}
          {selectedPage === "invoice-management" && <h1>Hóa Đơn</h1>}
          {selectedPage === "ingredient-info" && <h1>Thông Tin Nguyên Liệu</h1>}
          {selectedPage === "inventory-report" && <h1>Xuất Nhập Tồn</h1>}
          {selectedPage === "stock-tracking" && <h1>Theo Dõi Tồn Kho</h1>}
          {selectedPage === "revenue-expense-report" && <h1>DT & Chi Phí</h1>}
          {selectedPage === "profit-report" && <h1>Lợi Nhuận</h1>}
          {selectedPage === "time" && <h1>Ca Làm Việc</h1>}
        </div>
      </div>
    </div>
  );
}
  export default ManagerNavbar;