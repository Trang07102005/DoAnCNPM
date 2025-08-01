import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faDollarSign,
  faShoppingCart,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

const COLORS = ["#0088FE", "#d1d5db"]; // Màu: Xanh + Xám

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalFoods: 0,
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:8080/api/admin/dashboard/summary", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setStats(res.data))
      .catch((err) => {
        console.error("Lỗi khi tải dashboard:", err);
      });
  }, []);

  const formatNumber = (num) =>
    num.toLocaleString("vi-VN", { minimumFractionDigits: 0 });

  const formatMoney = (amount) =>
    amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });

  const chartMock = (value) => [
    { name: "Used", value },
    { name: "Remaining", value: Math.max(value * 0.5, 1) },
  ];

  const Card = ({ title, value, unit, chartData, icon }) => (
    <div className="bg-white shadow-md rounded-2xl p-4 flex flex-col items-center hover:shadow-lg transition">
      <div className="text-gray-500 text-sm mb-1">{title}</div>
      <div className="text-2xl font-semibold text-black mb-3">
        {unit === "vnd" ? formatMoney(value) : formatNumber(value)}
      </div>
      <div className="relative w-24 h-24">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              outerRadius={40}
              innerRadius={25}
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? COLORS[0] : COLORS[1]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <FontAwesomeIcon
          icon={icon}
          className="absolute top-1/2 left-1/2 text-blue-600 text-xl transform -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    </div>
  );

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card
        title="MENU"
        value={stats.totalFoods}
        unit="count"
        chartData={chartMock(stats.totalFoods)}
        icon={faUtensils}
      />
      <Card
        title="DOANH THU"
        value={stats.totalRevenue}
        unit="vnd"
        chartData={chartMock(stats.totalRevenue)}
        icon={faDollarSign}
      />
      <Card
        title="ORDERS"
        value={stats.totalBookings}
        unit="count"
        chartData={chartMock(stats.totalBookings)}
        icon={faShoppingCart}
      />
      <Card
        title="NGƯỜI DÙNG"
        value={stats.totalUsers}
        unit="count"
        chartData={chartMock(stats.totalUsers)}
        icon={faUsers}
      />
    </div>
  );
};

export default AdminDashboard;
