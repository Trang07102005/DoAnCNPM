import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const ChefIngredientManagement = () => {
  const [ingredients, setIngredients] = useState([]);
  const [statistics, setStatistics] = useState([]);

  const COLORS = ['#FF8042', '#00C49F', '#FFBB28', '#0088FE', '#FF6666'];

  useEffect(() => {
    fetchIngredients();
    fetchStatistics();
  }, []);

  const fetchIngredients = async () => {
    try {
      const res = await axios.get('/api/chef/ingredients');
      setIngredients(res.data);
    } catch (err) {
      console.error('Error loading ingredients', err);
    }
  };

  const fetchStatistics = async () => {
    try {
      const res = await axios.get('/api/chef/ingredients/statistics');
      setStatistics(res.data);
    } catch (err) {
      console.error('Error loading statistics', err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-rose-600 mb-6">🍽 Quản Lý Nguyên Liệu</h1>

      {/* Biểu đồ */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">📊 Thống Kê Nguyên Liệu Theo Loại</h2>
        {statistics.length > 0 ? (
          <PieChart width={400} height={300}>
            <Pie
              data={statistics}
              dataKey="count"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {statistics.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        ) : (
          <p>Đang tải biểu đồ...</p>
        )}
      </div>

      {/* Danh sách nguyên liệu */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {ingredients.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition duration-300">
            <img
              src={item.imageUrl || 'https://via.placeholder.com/150'}
              alt={item.name}
              className="w-full h-32 object-cover rounded-lg mb-3"
            />
            <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
            <p className="text-gray-600">Số lượng: {item.quantity}</p>
            <p className="text-gray-500">Đơn vị: {item.unit}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChefIngredientManagement;
