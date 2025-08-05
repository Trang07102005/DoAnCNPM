// 📁 AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart,
  Bar, XAxis, YAxis, Legend, LineChart, Line, CartesianGrid,
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils, faDollarSign, faShoppingCart, faUsers,
} from "@fortawesome/free-solid-svg-icons";

const CHART_COLORS = ["#FF6384", "#FF9F40", "#FFCD56", "#4BC0C0", "#36A2EB", "#9966FF"];
const COLOR_MAP = {
  "MENU": ["#ff8c00"],
  "DOANH THU": ["#00ff08"],
  "ORDERS": ["#3c00ff"],
  "NGƯỜI DÙNG": ["#ea00ff"],
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalFoods: 0,
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [orderChartData, setOrderChartData] = useState([]);
  const [topFoods, setTopFoods] = useState([]);
  const [revenueChartData, setRevenueChartData] = useState([]);
  const [chartType, setChartType] = useState("day");
  const [revenueChartType, setRevenueChartType] = useState("daily");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`http://localhost:8080/api/food-categories`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setCategories(res.data));
  }, []);
  
  const fetchTopFoods = (categoryId) => {
    const token = localStorage.getItem("token");
    const url = categoryId && categoryId !== "all"
      ? `http://localhost:8080/api/admin/dashboard/top-ordered-foods?categoryId=${categoryId}`
      : `http://localhost:8080/api/admin/dashboard/top-ordered-foods`;
  
    axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setTopFoods(res.data));
  };
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`http://localhost:8080/api/admin/dashboard/summary`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setStats(res.data));

    axios.get(`http://localhost:8080/api/admin/dashboard/top-ordered-foods`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setTopFoods(res.data));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`http://localhost:8080/api/admin/dashboard/order-stats?type=${chartType}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setOrderChartData(res.data));
  }, [chartType]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`http://localhost:8080/api/admin/dashboard/revenue-stats?type=${revenueChartType}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setRevenueChartData(res.data));
  }, [revenueChartType]);

  const formatMoney = (amount) =>
    amount?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  const formatNumber = (num) => num?.toLocaleString("vi-VN");
  const chartMock = (value) => [
    { name: "Used", value },
    { name: "Remaining", value: Math.max(value * 0.5, 1) },
  ];

  useEffect(() => {
    fetchTopFoods(selectedCategory);
  }, [selectedCategory]);
  

  const Card = ({ title, value, unit, chartData, icon, bgColor }) => (
    <div className={`shadow-md rounded-2xl p-4 flex flex-col items-center text-white ${bgColor}`}>
      <div className="text-sm mb-1">{title}</div>
      <div className="text-2xl font-semibold mb-3">
        {unit === "vnd" ? formatMoney(value) : formatNumber(value)}
      </div>
      <div className="relative w-24 h-24">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} dataKey="value" outerRadius={40} innerRadius={25}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={COLOR_MAP[title][0]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <FontAwesomeIcon icon={icon} className="absolute top-1/2 left-1/2 text-xl transform -translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
  );

  const maxCount = Math.max(...orderChartData.map((d) => d.count || 0));

  return (
    <div className="p-6">
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card title="MENU" value={stats.totalFoods} unit="count" chartData={chartMock(stats.totalFoods)} icon={faUtensils} bgColor="bg-yellow-500" />
        <Card title="DOANH THU" value={stats.totalRevenue} unit="vnd" chartData={chartMock(stats.totalRevenue)} icon={faDollarSign} bgColor="bg-green-500" />
        <Card title="ORDERS" value={stats.totalBookings} unit="count" chartData={chartMock(stats.totalBookings)} icon={faShoppingCart} bgColor="bg-blue-500" />
        <Card title="NGƯỜI DÙNG" value={stats.totalUsers} unit="count" chartData={chartMock(stats.totalUsers)} icon={faUsers} bgColor="bg-purple-500" />
      </div>

      {/* Top Foods */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-10">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
    <h2 className="text-2xl font-bold text-rose-600 flex items-center gap-2">
      🍽 Top Món Ăn Được Đặt
    </h2>
    <select
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
      className="border border-rose-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white transition duration-200 ease-in-out"
    >
      <option value="all">Tất cả danh mục</option>
      {categories.map((cat) => (
        <option key={cat.categoryId} value={cat.categoryId}>
          {cat.categoryName}
        </option>
      ))}
    </select>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {topFoods.map((item, index) => (
      <div
        key={index}
        className="p-4 bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-xl hover:border-rose-400 transition-all duration-300 ease-in-out"
      >
        <div className="relative w-full h-40 mb-3">
          <img
            src={item.imageUrl}
            alt={item.foodName}
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute top-2 left-2 bg-rose-600 text-white text-xs px-2 py-1 rounded-md shadow">
            #{index + 1}
          </div>
        </div>
        <h3 className="font-semibold text-lg text-gray-800 mb-1 line-clamp-2">
          {item.foodName}
        </h3>
        <span className="inline-block mt-1 px-3 py-1 bg-rose-100 text-rose-600 text-sm font-medium rounded-full">
          Số lượng: {formatNumber(item.totalOrdered)}
        </span>
      </div>
    ))}
  </div>
</div>



      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Chart */}
        <div className="bg-blue-50 p-6 rounded-2xl shadow-lg border border-blue-100">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2">
      📈 Biểu đồ Orders
    </h2>
    <select
      value={chartType}
      onChange={(e) => setChartType(e.target.value)}
      className="border border-blue-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
    >
      <option value="day">Theo ngày</option>
      <option value="month">Theo tháng</option>
      <option value="year">Theo năm</option>
    </select>
  </div>
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={orderChartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="label" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="count" radius={[6, 6, 0, 0]}>
        {orderChartData.map((entry, index) => (
          <Cell
            key={`bar-${index}`}
            fill={entry.count === maxCount ? "#facc15" : "#3b82f6"}
          />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
</div>


        {/* Revenue Chart */}
        <div className="bg-emerald-50 p-6 rounded-2xl shadow-lg border border-emerald-100">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-xl font-bold text-emerald-600 flex items-center gap-2">
      💵 Biểu đồ Doanh Thu
    </h2>
    <select
      value={revenueChartType}
      onChange={(e) => setRevenueChartType(e.target.value)}
      className="border border-emerald-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
    >
      <option value="daily">Theo ngày</option>
      <option value="monthly">Theo tháng</option>
      <option value="yearly">Theo năm</option>
    </select>
  </div>
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={revenueChartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="label" />
      <YAxis tickFormatter={(value) => `${(value / 1_000_000).toFixed(1)}M`} />
      <Tooltip formatter={(value) => `${parseInt(value).toLocaleString("vi-VN")} đ`} />
      <Line
        type="monotone"
        dataKey="totalRevenue"
        stroke="#10b981"
        strokeWidth={3}
        dot={{ r: 4 }}
        activeDot={{ r: 6 }}
      />
    </LineChart>
  </ResponsiveContainer>
</div>

      </div>
    </div>
  );
};

export default AdminDashboard;
