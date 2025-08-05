import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { toast } from "react-toastify";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#F44336",
  "#9C27B0",
  "#3F51B5",
];

const CashierTopFoods = () => {
  const [topFoods, setTopFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopFoods();
  }, []);

  const fetchTopFoods = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Không có token. Người dùng cần đăng nhập lại.");
      toast.error("Vui lòng đăng nhập để xem dữ liệu.");
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:8080/api/cashier/foods/top",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Sửa ở đây: dùng key thay vì index
      const formattedData = response.data.map((item) => ({
        foodName: item.foodName,
        imageUrl: item.imageUrl,
        quantity: item.totalOrdered,
      }));

      setTopFoods(formattedData);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu món ăn:", error);
      toast.error("Không thể tải dữ liệu món ăn bán chạy");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold text-red-600 mb-4">
        🥇 Món Ăn Bán Chạy Nhất
      </h2>

      {loading ? (
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      ) : topFoods.length === 0 ? (
        <p className="text-gray-500">Không có dữ liệu hiển thị.</p>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          {/* Pie Chart */}
          <div className="w-full md:w-1/2 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topFoods}
                  dataKey="quantity"
                  nameKey="foodName"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {topFoods.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Food list */}
          <div className="w-full md:w-1/2 space-y-4">
            {topFoods.map((food, index) => (
              <div
                key={index}
                className="flex items-center gap-4 border-b pb-2"
              >
                <img
                  src={food.imageUrl}
                  alt={food.foodName}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">
                    {food.foodName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Đã bán: {food.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CashierTopFoods;
