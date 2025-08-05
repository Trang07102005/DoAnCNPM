// StaffBestSellerReport.jsx
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

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28BFE",
  "#FF5F7E",
  "#55D8C1",
  "#F57F17",
];

const StaffBestSellerReport = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchTopFoods = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/staff/top-ordered-food", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Chuyển đổi dữ liệu cho biểu đồ Pie
        const formattedData = res.data.map((item) => ({
          name: item.foodName,
          value: item.totalOrdered,
          imageUrl: item.imageUrl,
        }));

        setData(formattedData);
      } catch (err) {
        console.error("Lỗi khi fetch món ăn bán chạy:", err);
      }
    };

    fetchTopFoods();
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-10">
  <h2 className="text-2xl font-bold mb-6 text-blue-600 flex items-center gap-2">
    📈 Biểu Đồ Món Ăn Bán Chạy
  </h2>
  <div className="flex flex-col md:flex-row gap-6">
    <div className="w-full md:w-2/3 h-[300px]">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>

    {/* Custom Legend scrollable */}
    <div className="w-full md:w-1/3 max-h-[300px] overflow-y-auto pr-2">
      <ul className="space-y-2">
        {data.map((entry, index) => (
          <li key={index} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></div>
            <span className="text-gray-700 text-sm font-medium">
              {entry.name} ({entry.value})
            </span>
          </li>
        ))}
      </ul>
    </div>
  </div>
</div>


      {/* Danh sách món ăn */}
<div className="bg-white p-6 rounded-2xl shadow-lg mb-10">
  <h2 className="text-2xl font-bold mb-6 text-rose-600 flex items-center gap-2">
    🍽️ Danh Sách Món Ăn Bán Chạy
  </h2>
  {data.length === 0 ? (
    <p className="text-gray-500">Không có dữ liệu.</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {data.map((item, index) => (
        <div
          key={index}
          className="bg-rose-50 hover:bg-rose-100 transition-all duration-300 p-4 rounded-xl shadow border border-rose-200 flex flex-col items-center"
        >
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-20 h-20 object-cover rounded-lg border mb-3"
          />
          <p className="text-lg font-semibold text-gray-800 text-center">
            {item.name}
          </p>
          <p className="text-sm text-gray-600">
            Số lượng:{" "}
            <span className="font-medium text-rose-500">{item.value}</span>
          </p>
        </div>
      ))}
    </div>
  )}
</div>

    </div>
  );
};

export default StaffBestSellerReport;
