import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    totalFoods: 0,
    totalUsers: 0,
  });

  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`
        };

        // Gọi cả 2 API
        const [generalRes, monthlyRes] = await Promise.all([
          axios.get("http://localhost:8080/api/admin/dashboard", { headers }),
          axios.get("http://localhost:8080/api/admin/dashboard/monthly-stats", { headers }),
        ]);

        console.log("📊 Dashboard tổng quan:", generalRes.data);
        console.log("📈 Dữ liệu biểu đồ:", monthlyRes.data);

        setStats(generalRes.data);
        setMonthlyData(monthlyRes.data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy dữ liệu dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center text-white p-6">Đang tải dữ liệu...</div>;
  }

  

  return (
    <div className="p-6 space-y-8">
      <h2 className='font-bold text-xl'>Admin Dashboard</h2>

      {/* Tổng quan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-white">
        <div className="bg-gradient-to-r from-red-900 to-black p-4 rounded-xl shadow">
          <h2 className="text-sm">Tổng Orders</h2>
          <p className="text-2xl font-bold">{stats.totalBookings}</p>
        </div>
        <div className="bg-gradient-to-r from-red-900 to-black p-4 rounded-xl shadow">
          <h2 className="text-sm">Tổng doanh thu</h2>
          <p className="text-2xl font-bold">{stats.totalRevenue.toLocaleString('vi-VN')} ₫</p>
        </div>
        <div className="bg-gradient-to-r from-red-900 to-black p-4 rounded-xl shadow">
          <h2 className="text-sm">Tổng số món ăn</h2>
          <p className="text-2xl font-bold">{stats.totalFoods}</p>
        </div>
        <div className="bg-gradient-to-r from-red-900 to-black p-4 rounded-xl shadow">
          <h2 className="text-sm">Tổng số người dùng</h2>
          <p className="text-2xl font-bold">{stats.totalUsers}</p>
        </div>
      </div>

      {/* Biểu đồ */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Biểu đồ doanh thu theo tháng</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <Line type="monotone" dataKey="totalRevenue" stroke="#ef4444" strokeWidth={3} />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
