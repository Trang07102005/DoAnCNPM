import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell,
  LineChart, Line
} from 'recharts';

const StaffTableReport = () => {
  const [reservations, setReservations] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);

  const token = localStorage.getItem('token');
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const fetchReservations = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/reservations', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const activeReservations = res.data.filter(r => r.status === 'Đã đặt');
      setReservations(activeReservations);
      prepareChartData(activeReservations);
      prepareLineChartData(activeReservations);
    } catch (err) {
      console.error(err);
      toast.error('Không thể tải danh sách đặt bàn');
    }
  };

  const prepareChartData = (data) => {
    const grouped = data.reduce((acc, curr) => {
      const name = curr.restaurantTable?.tableName || 'Chưa rõ';
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});

    const chart = Object.entries(grouped).map(([name, count]) => ({
      name, count
    }));

    setChartData(chart);
  };

  const prepareLineChartData = (data) => {
    const grouped = data.reduce((acc, curr) => {
      const hour = new Date(curr.reservationTime).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});

    const result = Object.entries(grouped).map(([hour, count]) => ({
      hour: `${hour}h`,
      count
    }));

    setLineChartData(result);
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-10">
        <h2 className="text-3xl font-bold text-green-700">📊 Báo Cáo Đặt Bàn</h2>

        {/* Grid 3 chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Biểu đồ Bar */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl shadow-lg mb-10">
  <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
    🔢 Số Lượt Đặt Theo Bàn
  </h3>
  <div className="h-72">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
        <XAxis dataKey="name" tick={{ fill: '#334155', fontSize: 12 }} />
        <YAxis allowDecimals={false} tick={{ fill: '#334155', fontSize: 12 }} />
        <Tooltip
          contentStyle={{ backgroundColor: '#f0f9ff', borderRadius: '8px', borderColor: '#3b82f6' }}
          labelStyle={{ color: '#1e3a8a' }}
        />
        <Bar dataKey="count" fill="#2563EB" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>


<div className="bg-gradient-to-r from-pink-50 to-rose-100 p-6 rounded-2xl shadow-lg mb-10">
  <h3 className="text-xl font-bold text-rose-700 mb-4 flex items-center gap-2">
    📌 Tỉ lệ Đặt Theo Bàn
  </h3>
  <div className="h-72">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
        >
          {chartData.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ backgroundColor: '#fff1f2', borderRadius: 8, borderColor: '#f43f5e' }}
          labelStyle={{ color: '#be123c' }}
        />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>


          {/* Biểu đồ Line */}
<div className="bg-gradient-to-r from-green-50 to-emerald-100 p-6 rounded-2xl shadow-lg mb-10">
  <h3 className="text-xl font-bold text-emerald-700 mb-4 flex items-center gap-2">
    ⏰ Lượt Đặt Theo Giờ
  </h3>
  <div className="h-72">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={lineChartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
        <XAxis 
          dataKey="hour" 
          tick={{ fill: '#065f46', fontSize: 12 }}
          label={{ value: 'Giờ', position: 'insideBottomRight', offset: -5 }}
        />
        <YAxis 
          allowDecimals={false} 
          tick={{ fill: '#065f46', fontSize: 12 }}
          label={{ value: 'Số lượt', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip
          contentStyle={{ backgroundColor: '#ecfdf5', borderRadius: 8, borderColor: '#10B981' }}
          labelStyle={{ color: '#047857' }}
        />
        <Line 
          type="monotone" 
          dataKey="count" 
          stroke="#10B981" 
          strokeWidth={3} 
          dot={{ r: 4, stroke: '#047857', strokeWidth: 2, fill: 'white' }}
          activeDot={{ r: 6, fill: '#10B981' }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>

        </div>

        {/* Chi tiết đặt bàn */}
<div className="bg-white p-6 rounded-2xl shadow-md mt-8">
  <h3 className="text-xl font-bold text-rose-600 mb-5 flex items-center gap-2">
    📋 Danh sách bàn đang được đặt
  </h3>

  <div className="overflow-x-auto rounded-lg border border-gray-200">
    <table className="min-w-full table-auto text-sm text-gray-700">
      <thead className="bg-rose-50 text-rose-600 font-semibold">
        <tr>
          <th className="px-5 py-3 border-b border-gray-200 text-left">Tên bàn</th>
          <th className="px-5 py-3 border-b border-gray-200 text-left">Khách hàng</th>
          <th className="px-5 py-3 border-b border-gray-200 text-left">Số người</th>
          <th className="px-5 py-3 border-b border-gray-200 text-left">Thời gian đặt</th>
          <th className="px-5 py-3 border-b border-gray-200 text-left">Trạng thái</th>
        </tr>
      </thead>
      <tbody>
        {reservations.map((r) => (
          <tr
            key={r.reservationId}
            className="hover:bg-rose-50 transition-colors duration-200"
          >
            <td className="px-5 py-3 border-b border-gray-100">{r.restaurantTable?.tableName}</td>
            <td className="px-5 py-3 border-b border-gray-100">{r.customerName}</td>
            <td className="px-5 py-3 border-b border-gray-100">{r.numberOfPeople}</td>
            <td className="px-5 py-3 border-b border-gray-100">
              {new Date(r.reservationTime).toLocaleString('vi-VN')}
            </td>
            <td className="px-5 py-3 border-b border-gray-100">
              <span className="text-green-600 font-semibold">{r.status}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {reservations.length === 0 && (
      <div className="text-center py-6 text-gray-500 font-medium">
        Không có bàn nào đang được đặt
      </div>
    )}
  </div>
</div>

      </div>
    </div>
  );
};

export default StaffTableReport;
