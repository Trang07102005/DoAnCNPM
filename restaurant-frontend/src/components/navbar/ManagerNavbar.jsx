import {
  faArrowLeft,
  faArrowRight,
  faBowlFood,
  faChartSimple,
  faMagnifyingGlass,
  faRightFromBracket,
  faTableColumns,
  faUtensils,
  faBookmark
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryManager from "../../pages/Manager/FoodCategoryManager/CategoryManager";
import FoodManager from "../../pages/Manager/foodManager/FoodManager";
import TableManager from "../../pages/Manager/Table/TableManager";
import ManagerInvoiceManagement from "../../pages/Manager/Invoice/ManagerInvoiceManagement";
import IngredientManager from "../../pages/Manager/Ingredient/IngredientManager";
import InventoryTransactionManager from "../../pages/Manager/Ingredient/InventoryTransactionManager";
import AddRecipe from "../../pages/Manager/Recipe/AddRecipe";
import ManagerDashboard from "../../pages/Manager/Dashboard/ManagerDashboard";
import IngredientStockManager from "../../pages/Manager/Ingredient/IngredientStockManager";
import RevenueReport from "../../pages/Manager/RevenueReport/RevenueReport";
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
      title: "Hóa Đơn Và Đặt Bàn",
      icon: <FontAwesomeIcon icon={faBookmark} />,
      children: [
        { key: "bill-management", title: "Quản Lý Hóa Đơn" },
        { key: "booking-management", title: "Quản Lý Đặt Bàn" },
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
        { key: "food-report", title: "Công Thức Món Ăn" },
      ],
    },
    
    {
      key: "ingredient-management",
      title: "Quản Lý Nguyên Liệu",
      icon: <FontAwesomeIcon icon={faBowlFood} />,
      children: [
        { key: "ingredient-info", title: "Xem Thông Tin NL" },
        { key: "inventory-report", title: "Giao Dịch Xuất Nhập Kho" },
        { key: "stock-tracking", title: "Theo Dõi Tồn Kho" },
      ],
    },
    
    {
      key: "statistics",
      title: "Báo Cáo Thống Kê",
      icon: <FontAwesomeIcon icon={faChartSimple} />,
      children: [
        { key: "revenue-expense-report", title: "Doanh Thu & PnL" },
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
    className={`absolute cursor-pointer -right-4 top-9 w-8 h-8 p-0.5 bg-zinc-50 border-zinc-50 border-2 rounded-full text-xl flex items-center justify-center
      ${!open && "rotate-180"}
      transition-transform duration-300 ease-in-out
    `}
    onClick={() => {
      setOpen((prev) => {
        const next = !prev;
        if (!next) setExpandedMenu(null);
        return next;
      });
    }}
  >
    {open ? (
      <FontAwesomeIcon icon={faArrowRight} className="text-indigo-700" />
    ) : (
      <FontAwesomeIcon icon={faArrowLeft} className="text-indigo-700" />
    )}
  </div>

        {/* Logo */}
        <div className="flex gap-x-4 items-center mb-6">
    <img
      src="https://cdn-icons-png.flaticon.com/512/1317/1317331.png"
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
                <ul className="ml-8 mt-1 space-y-3">
                  {Menu.children.map((child, i) => (
                    <li
                      key={i}
                      className={`py-2 px-3 rounded-md cursor-pointer truncate border-l-4
                        transition-colors duration-300
                        ${
                          selectedPage === child.key
                            ? "border-indigo-600 text-indigo-600 font-semibold"
                            : "border-gray-400 text-gray-400 hover:text-indigo-500 hover:border-indigo-500"
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
  <div className="absolute bottom-6 left-0 w-full px-4">
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-x-3 text-zinc-50 hover:bg-red-600 transition-colors duration-300 py-3 px-4 rounded-md font-semibold"
    >
      <FontAwesomeIcon icon={faRightFromBracket} className="text-lg" />
      <span className={`${!open && "hidden"} transition-all duration-300`}>
        Đăng Xuất
      </span>
    </button>
  </div>
</div>

      {/* Main dashboard area */}
<div className="h-screen flex-1 bg-zinc-100 overflow-hidden flex flex-col">
  {/* Topbar */}
  <div className="w-full h-[8ch] px-12 bg-zinc-50 shadow-md flex items-center justify-between shrink-0">
  <div className="text-2xl font-bold">
    <span className="text-orange-300">VIET</span>
    <span className="text-gray-800">TAURANT</span>
  </div>
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
  <div className="flex-1 overflow-y-auto px-12 py-6">
  <h1 className="text-3xl uppercase font-bold mb-4">
    {
      {
        dashboard: "Trang Dashboard",
        "bill-management": "Quản Lý Hóa Đơn",
        "booking-management": "Quản Lý Đặt Bàn",
        "category-management": "Quản Lý Danh Mục",
        "food-list": "Danh Sách Món Ăn",
        "food-report": "Báo Cáo Món Ăn",
        "ingredient-info": "Thông Tin Nguyên Liệu",
        "inventory-report": "Xuất Nhập Tồn",
        "stock-tracking": "Theo Dõi Tồn Kho",
      }[selectedPage] || "."
    }
  </h1>

  {/* Render component theo selectedPage */}
  {selectedPage === "dashboard" && <ManagerDashboard />}
  {selectedPage === "bill-management" && <ManagerInvoiceManagement />}
  {selectedPage === "booking-management" && <TableManager />}
  {selectedPage === "category-management" && <CategoryManager />}
  {selectedPage === "food-list" && <FoodManager />}
  {selectedPage === "food-report" && <AddRecipe />}
  {selectedPage === "ingredient-info" && <IngredientManager />}
  {selectedPage === "inventory-report" && <InventoryTransactionManager />}
  {selectedPage === "stock-tracking" && <IngredientStockManager />}
  {selectedPage === "revenue-expense-report" && <RevenueReport />}
</div>

</div>

    </div>
  );
}
  export default ManagerNavbar;