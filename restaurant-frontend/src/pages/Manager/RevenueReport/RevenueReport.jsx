import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  PieChart, Pie, Cell
} from 'recharts';

const RevenueReport = () => {
  const [summary, setSummary] = useState({});
  const [revenueData, setRevenueData] = useState([]);
  const [averageOrderValue, setAverageOrderValue] = useState(0);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  const targetValue = 1000000; // Mục tiêu 1 triệu VNĐ

  useEffect(() => {
    fetchSummary();
    fetchRevenueStats('monthly');
    fetchAverageOrderValue();
  }, []);

  const fetchSummary = async () => {
    const res = await axios.get('http://localhost:8080/api/manager/dashboard/summary', { headers });
    setSummary(res.data);
  };

  const fetchRevenueStats = async (type) => {
    const res = await axios.get(`http://localhost:8080/api/manager/dashboard/revenue-stats?type=${type}`, { headers });
    setRevenueData(res.data);
  };

  const fetchAverageOrderValue = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/manager/dashboard/average-value', { headers });
      setAverageOrderValue(res.data);
    } catch (err) {
      console.error("Lỗi khi fetch giá trung bình đơn hàng:", err);
    }
  };

  const pieData = [
    { name: 'Giá trung bình', value: averageOrderValue },
    { name: 'Còn thiếu đến 1 triệu', value: Math.max(0, targetValue - averageOrderValue) },
  ];

  const COLORS = ['#34d399', '#fca5a5'];

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
  <h2 className="text-4xl font-bold mb-10 text-gray-800 text-center">
    📊 Quản lý Doanh thu & Lợi nhuận
  </h2>

  {/* Stat Cards */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
    <StatCard title="🧾 Đơn hàng" value={summary.totalBookings} color="bg-blue-100 text-blue-600" />
    <StatCard title="💵 Doanh thu" value={summary.totalRevenue?.toLocaleString() + ' đ'} color="bg-green-100 text-green-600" />
    <StatCard title="🍽️ Món ăn" value={summary.totalFoods} color="bg-yellow-100 text-yellow-600" />
    <StatCard title="📊 Trung bình đơn" value={averageOrderValue.toLocaleString() + ' đ'} color="bg-purple-100 text-purple-600" />
  </div>

  {/* Charts */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
    <ChartCard title="📈 Doanh thu hàng tháng">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={revenueData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="totalRevenue" stroke="#4ade80" name="Doanh thu" />
          <Line
            type="monotone"
            dataKey={(d) => d.totalRevenue * 0.3}
            stroke="#f97316"
            dot={false}
            name="Lợi nhuận (30%)"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>

    <ChartCard title="🥧 Trung bình mỗi đơn hàng (so với 1 triệu)">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${Number(value).toLocaleString()} đ`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <p className="text-center mt-4 text-gray-700 text-base">
        Giá trung bình đơn:{" "}
        <span className="font-bold text-emerald-600 text-lg">
          {averageOrderValue?.toLocaleString()} đ
        </span>
      </p>
    </ChartCard>
  </div>
</div>

  );
};

const StatCard = ({ title, value }) => (
    <div className="bg-gradient-to-br from-rose-100 via-white to-rose-50 shadow-xl rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300 ease-in-out">
      <p className="text-sm text-rose-500 font-semibold mb-2 uppercase tracking-wider">
        {title}
      </p>
      <p className="text-3xl font-bold text-rose-700">{value}</p>
    </div>
  );
  

  const ChartCard = ({ title, children }) => (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300 ease-in-out">
      <h3 className="text-xl font-bold text-rose-600 mb-4 tracking-wide">{title}</h3>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
  

export default RevenueReport;
