import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const CashierDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [openOrderId, setOpenOrderId] = useState(null);

  const toggleOrderDetails = (orderId) => {
    setOpenOrderId((prev) => (prev === orderId ? null : orderId));
  };
  const token = localStorage.getItem("token");

  const axiosAuth = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    fetchOrders();
    fetchTables();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axiosAuth.get("/api/cashier/pending-orders");
      console.log("Fetched orders:", res.data);
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  const fetchTables = async () => {
    try {
      const res = await axiosAuth.get("/api/tables/with-status");
      setTables(res.data);
    } catch (err) {
      console.error("Failed to fetch tables:", err);
    }
  };

  

  return (
    <div className="p-6 space-y-10">
      {/* Banner */}
      <div className="rounded-xl overflow-hidden shadow-md">
        <img
          src="https://img.freepik.com/premium-vector/discount-voucher-vouchers-special-offer-poster-banner-graphic-design-icon-logo-sign-symbol-social-me_680598-768.jpg"
          alt="Cashier Banner"
          className="w-full h-90 object-cover"
        />
      </div>

      {/* Pending Orders */}
      <div className="px-6 py-8">
      <h2 className="text-3xl font-bold text-rose-600 mb-8 flex items-center gap-2">
        🧾 Đơn Hàng Đang Chờ
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {orders.map((order) => (
          <div
            key={order.orderId}
            className="bg-gradient-to-br from-rose-50 via-white to-white p-6 rounded-2xl shadow-xl border border-rose-200 hover:shadow-2xl transition-all duration-300 cursor-pointer"
            onClick={() => toggleOrderDetails(order.orderId)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                🧾 Hóa đơn #{order.orderId}
              </h3>
              <span className="text-xs text-white bg-rose-500 px-2 py-1 rounded-full">
                {order.status}
              </span>
            </div>

            <div className="text-sm text-gray-600 mb-2">
              📅 Ngày đặt:{" "}
              <span className="font-medium text-gray-800">
                {order.orderTime
                  ? format(new Date(order.orderTime), "dd/MM/yyyy HH:mm")
                  : "-"}
              </span>
            </div>

            <div className="border-t border-gray-200 my-4"></div>

            <div className="text-right">
              <span className="text-lg font-semibold text-rose-600">
                💰 {order.total?.toLocaleString() || 0}₫
              </span>
            </div>

            {/* Chi tiết món ăn */}
            {openOrderId === order.orderId && (
  <div className="mt-4 bg-gray-50 rounded-2xl p-5 border border-gray-200 shadow-inner">
    <h4 className="font-bold text-lg text-rose-600 mb-4 flex items-center gap-2">
      🍽 Danh Sách Món Ăn
    </h4>
    <ul className="divide-y divide-gray-200">
      {order.orderDetails?.map((item, idx) => (
        <li
          key={idx}
          className="py-2 flex items-center justify-between text-gray-700 text-sm md:text-base"
        >
          <div className="flex-1 font-medium">
            {item.foodName}
            <span className="text-gray-500"> x{item.quantity}</span>
          </div>
          <div className="font-semibold text-rose-600 whitespace-nowrap">
            {(item.total ?? item.price * item.quantity)?.toLocaleString()}₫
          </div>
        </li>
      ))}
    </ul>
  </div>
)}

          </div>
        ))}
      </div>
    </div>


      {/* Tables Status */}
      <div className="mt-10">
  <h2 className="text-3xl font-bold text-blue-600 mb-6 flex items-center gap-2">
    🪑 Trạng Thái Bàn
  </h2>

  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
    {tables.map((table) => {
      const status = table.status || table.trangThaiThucTe;
      const name = table.tableName || table.tenBan || "Bàn";

      const isAvailable = status?.toLowerCase() === "trống";
      const isServing = status?.toLowerCase() === "đang phục vụ";
      const isReserved = status?.toLowerCase() === "đã đặt";

      let statusText = "";
      let icon = "";
      let bgColor = "";
      let borderColor = "";

      if (isAvailable) {
        statusText = "Còn trống";
        icon = "🟢";
        bgColor = "bg-green-100";
        borderColor = "border-green-300";
      } else if (isServing) {
        statusText = "Đang phục vụ";
        icon = "🛎️";
        bgColor = "bg-yellow-100";
        borderColor = "border-yellow-400";
      } else if (isReserved) {
        statusText = "Đã đặt";
        icon = "🔒";
        bgColor = "bg-rose-100";
        borderColor = "border-rose-400";
      }

      return (
        <div
          key={table.tableId || table.id}
          className={`rounded-2xl p-5 shadow-lg border-2 ${bgColor} ${borderColor} transition-all duration-300 hover:scale-105 cursor-pointer`}
        >
          <div className="text-xl font-bold text-gray-800 mb-2">{name}</div>
          <div className="text-sm text-gray-600 flex items-center gap-1">
            <span>{icon}</span>
            <span>{statusText}</span>
          </div>
        </div>
      );
    })}
  </div>
</div>


    </div>
  );
};

export default CashierDashboard;
