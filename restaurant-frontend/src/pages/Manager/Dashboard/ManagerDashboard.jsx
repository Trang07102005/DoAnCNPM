import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  LineChart, 
  Line,
  CartesianGrid,
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faDollarSign,
  faShoppingCart,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";


const CHART_COLORS = [
  "#FF6384", "#FF9F40", "#FFCD56", "#4BC0C0", "#36A2EB", "#9966FF",
];


const COLOR_MAP = {
  "MENU": ["#ff8c00", "#FEF3C7", "#FCD34D", "#FDE68A"],          // Vàng
  "DOANH THU": ["#00ff08", "#A7F3D0", "#34D399", "#6EE7B7"],     // Xanh lá
  "ORDERS": ["#3c00ff", "#BFDBFE", "#60A5FA", "#93C5FD"],        // Xanh dương
  "NGƯỜI DÙNG": ["#ea00ff", "#DDD6FE", "#A78BFA", "#C4B5FD"],    // Tím
};




const ManagerDashboard = () => {
  const [stats, setStats] = useState({
    totalFoods: 0,
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  
  const [chartType, setChartType] = useState("day");
  const [orderChartData, setOrderChartData] = useState([]);
  const [topFoods, setTopFoods] = useState([]);
  const [revenueChartData, setRevenueChartData] = useState([]);
  const [revenueChartType, setrevenueChartType] = useState("daily"); // Thêm state cho loại biểu đồ

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    axios
      .get(
        `http://localhost:8080/api/manager/dashboard/revenue-stats?type=${revenueChartType}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => setRevenueChartData(res.data))
      .catch((err) =>
        console.error("Lỗi khi tải biểu đồ doanh thu:", err)
      );
  }, [revenueChartType]); 
  
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:8080/api/manager/dashboard/order-stats?type=${chartType}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrderChartData(res.data))
      .catch((err) => console.error("Lỗi khi tải biểu đồ đơn hàng:", err));
  }, [chartType]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:8080/api/manager/dashboard/summary", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Lỗi khi tải dashboard:", err));

    axios
      .get("http://localhost:8080/api/manager/dashboard/top-ordered-foods", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTopFoods(res.data))
      .catch((err) =>
        console.error("Lỗi khi tải danh sách món ăn được đặt nhiều:", err)
      );
  }, []);

  const formatNumber = (num) =>
    num?.toLocaleString("vi-VN", { minimumFractionDigits: 0 });

  const formatMoney = (amount) =>
    amount?.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });

  const chartMock = (value) => [
    { name: "Used", value },
    { name: "Remaining", value: Math.max(value * 0.5, 1) },
  ];

  const Card = ({ title, value, unit, chartData, icon, bgColor }) => {
    const colors = COLOR_MAP[title] || ["#0088FE", "#d1d5db"];

    return (
      <div
        className={`shadow-md rounded-2xl p-4 flex flex-col items-center hover:shadow-lg transition text-white ${bgColor}`}
      >
        <div className="text-sm mb-1">{title}</div>
        <div className="text-2xl font-semibold mb-3">
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
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <FontAwesomeIcon
            icon={icon}
            className="absolute top-1/2 left-1/2 text-white text-xl transform -translate-x-1/2 -translate-y-1/2"
          />
        </div>
      </div>
    );
  };

  const maxCount = Math.max(...orderChartData.map((d) => d.count || 0));

  return (
      <div className="p-6">
        {/* THỐNG KÊ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card
          title="MENU"
          value={stats.totalFoods}
          unit="count"
          chartData={chartMock(stats.totalFoods)}
          icon={faUtensils}
          bgColor="bg-yellow-500"
          colors={COLOR_MAP["MENU"]}
        />
        <Card
          title="DOANH THU"
          value={stats.totalRevenue}
          unit="vnd"
          chartData={chartMock(stats.totalRevenue)}
          icon={faDollarSign}
          bgColor="bg-green-500"
          colors={COLOR_MAP["DOANH_THU"]}
        />
        <Card
          title="ORDERS"
          value={stats.totalBookings}
          unit="count"
          chartData={chartMock(stats.totalBookings)}
          icon={faShoppingCart}
          bgColor="bg-blue-500"
          colors={COLOR_MAP["ORDERS"]}
        />
        <Card
          title="NGƯỜI DÙNG"
          value={stats.totalUsers}
          unit="count"
          chartData={chartMock(stats.totalUsers)}
          icon={faUsers}
          bgColor="bg-purple-500"
          colors={COLOR_MAP["NGƯỜI_DÙNG"]}
        />  
        </div>

     


        <div className="grid bg-gradient-to-r from-blue-500 to-green-500 grid-cols-1 md:grid-cols-2 gap-5 rounded-2xl shadow-lg mt-20 p-6">
  {/* DANH SÁCH MÓN ĂN NHIỀU NHẤT */}
  <div className="bg-gray-50 rounded-xl shadow-md flex-1 ">
  <div className="bg-[#ff0040] w-full  p-4 mb-6 rounded-t-md">

    <h2 className="text-2xl text-start font-bold   mb-2 text-white">
      🏆 BEST SELLER
    </h2>
  </div>
    <div className="flex px-4 overflow-x-auto space-x-5 pb-3 pr-2 custom-scroll">
    {topFoods.map((item, index) => (
  <div
    key={index}
    className="min-w-[260px] bg-gradient-to-br from-sky-100 via-indigo-100 to-fuchsia-100 rounded-xl border border-sky-300 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col text-center"
  >
    {/* Ảnh nằm trên cùng, full width */}
    <div className="w-full h-40">
      <img
        src={item.imageUrl}
        alt={item.foodName}
        className="w-full h-full object-cover rounded-t-md"
      />
    </div>

    {/* Nội dung dưới */}
    <div className="p-6 flex flex-col items-center">
      <h3 className="text-md font-semibold bg-gradient-to-r from-orange-500 to-pink-500 text-transparent bg-clip-text">
        🏅 {index + 1}. {item.foodName}
      </h3>

      <p className="text-base text-black mt-1">
        Số Orders:{" "}
        <span className="font-bold bg-gradient-to-r from-red-500 to-yellow-400 text-transparent bg-clip-text">
          {formatNumber(item.totalOrdered)}
        </span>
      </p>
    </div>
  </div>
))}
    </div>
  </div>

  {/* BIỂU ĐỒ PIE CHO MÓN TOP */}
<div className="bg-gray-50 rounded-xl shadow flex flex-col items-center">
    {/* Header */}
    <div className="bg-blue-400 w-full p-4 mb-6 rounded-t-md">
      <h2 className="text-2xl font-bold mb-2 text-white text-start">
        🏆 MÓN ĐẶT THEO TỈ LỆ (TOP {topFoods.length})
      </h2>
    </div>

    <div className="flex flex-col lg:flex-row items-center justify-center gap-6 px-4 pb-6">
      {/* Pie Chart */}
      <PieChart width={300} height={300}>
        <Pie
          data={topFoods}
          dataKey="totalOrdered"
          nameKey="foodName"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
        >
          {topFoods.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={CHART_COLORS[index % CHART_COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>

      {/* Legend (Chú thích) */}
      <div className="flex flex-col items-start text-sm max-h-[300px] overflow-y-auto pr-2 custom-scrollbar w-60">
        {topFoods.map((item, index) => (
          <div
            key={index}
            className="flex items-center space-x-2 p-1 hover:bg-gray-100 rounded"
          >
            <span
              className="inline-block w-4 h-4 rounded"
              style={{
                backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
              }}
            />
            <span className="text-gray-800 font-medium truncate">
              {item.foodName}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>



<div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl shadow-lg mt-20 p-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* BIỂU ĐỒ ORDER */}
    <div className="rounded-2xl bg-gray-50 text-white shadow">
      <div className="flex justify-between bg-orange-400 w-full p-4 items-center mb-6 rounded-t-md">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          🧾 TỔNG SỐ ORDERS
        </h2>
        <select
          className="bg-gray-600 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-200"
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
        >
          <option value="day">Ngày</option>
          <option value="month">Tháng</option>
          <option value="year">Năm</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
  <BarChart
    data={orderChartData}
    barCategoryGap={40}
    barGap={10}
    barSize={40}
  >
    {/* ✅ Thêm dòng này để vẽ các đường kẻ nền */}
    <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />

    <XAxis
      dataKey="label"
      stroke="#9ca3af"
      axisLine={false}
      tickLine={false}
      style={{ fontSize: "14px" }}
    />
    <YAxis
      stroke="#9ca3af"
      axisLine={false}
      tickLine={false}
      style={{ fontSize: "14px" }}
    />
    <Tooltip
      cursor={{ fill: "transparent" }}
      contentStyle={{
        backgroundColor: "#111827",
        borderRadius: "8px",
        border: "none",
      }}
      labelStyle={{ color: "#facc15", fontWeight: "bold" }}
      itemStyle={{ color: "#f9fafb" }}
      formatter={(value) => [`${value}`, "Tổng Orders"]}
    />
    <Legend
      content={() => (
        <div className="mt-2 ml-4 flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded" />
          <span className="text-md font-semibold text-black">
            Orders Nhiều Nhất
          </span>
        </div>
      )}
    />
    <Bar
      dataKey="count"
      name="Tổng số Orders"
      radius={[6, 6, 0, 0]}
      isAnimationActive={false}
    >
      {orderChartData.map((entry, index) => (
        <Cell
          key={`cell-${index}`}
          fill={entry.count === maxCount ? "#ff9100" : "#595959"}
          stroke="none"
        />
      ))}
    </Bar>
  </BarChart>
</ResponsiveContainer>
    </div>

    {/* BIỂU ĐỒ DOANH THU */}
    <div className="rounded-t-2xl bg-gray-50 text-white shadow">
      <div className="flex justify-between bg-green-400 w-full p-4 items-center mb-6 rounded-t-md">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          💰 DOANH THU
        </h2>
        <select
          value={revenueChartType}
          onChange={(e) => setrevenueChartType(e.target.value)}
          className="bg-gray-600 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-200"
        >
          <option value="daily">Theo ngày</option>
          <option value="monthly">Theo tháng</option>
          <option value="yearly">Theo năm</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={revenueChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            stroke="#9ca3af"
            axisLine={false}
            tickLine={false}
            style={{ fontSize: "14px" }}
          />
          <YAxis
            stroke="#9ca3af"
            axisLine={false}
            tickLine={false}
            style={{ fontSize: "14px" }}
            tickFormatter={(value) => `${(value / 1_000_000).toFixed(1)}M`}
          />
          <Tooltip
            formatter={(value) =>
              `${parseInt(value).toLocaleString("vi-VN")} VND`
            }
            contentStyle={{
              backgroundColor: "#111827",
              borderRadius: "8px",
              border: "none",
            }}
            labelStyle={{ color: "#facc15", fontWeight: "bold" }}
            itemStyle={{ color: "#f9fafb" }}
          />
          <Legend
            content={() => (
              <div className="mt-2 ml-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded" />
                <span className="text-md font-semibold text-black">
                  Doanh Thu (VND)
                </span>
              </div>
            )}
          />
          <Line
            type="monotone"
            dataKey="totalRevenue"
            name="Doanh Thu"
            stroke="#22c55e"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>




    </div>
  );
};

export default ManagerDashboard;
